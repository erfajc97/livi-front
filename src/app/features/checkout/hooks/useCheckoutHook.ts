import { prepareReceiptUpload } from '@/app/helpers/prepareImageUpload';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/app/store/cart/cartStore';
import { useAuthStore } from '@/app/store/auth/authStore';
import { useDeliveryMethodsHook } from './useDeliveryMethodsHook';
import { useAddressesQuery } from '@/app/tanstack-queries/addressesQuery';
import { calcPayphoneSurcharge } from '@/app/helpers/calcPayphoneSurcharge';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { normalizeCustomerField, validateContact } from '../validators';
import { isPickupMethod, PICKUP_METHODS, type DeliveryMode } from '../components/DeliverySection';
import type { CustomerFormData, PaymentMethod, DeliveryMethod } from '../types';

const PREFS_KEY = 'livi-checkout-prefs';

interface CheckoutPrefs {
  phone?: string;
  city?: string;
  address?: string;
  deliveryMethod?: DeliveryMethod;
}

function loadPrefs(): CheckoutPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function savePrefs(prefs: CheckoutPrefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
}

function buildInitialCustomer(): CustomerFormData {
  const prefs = loadPrefs();
  const user = useAuthStore.getState().user;
  return {
    name:      user?.firstName ?? user?.name ?? '',
    lastName:  user?.lastName ?? '',
    email:     user?.email ?? '',
    cedula:    user?.cedula ?? '',
    reference: user?.reference ?? '',
    phone:     user?.phone ?? prefs.phone ?? '',
    province:  user?.province ?? '',
    city:      user?.city ?? prefs.city ?? '',
    address:   user?.address ?? prefs.address ?? '',
  };
}

function getInitialDeliveryMethod(prefs: CheckoutPrefs): DeliveryMethod | null {
  const user = useAuthStore.getState().user;
  const method = user?.preferredDeliveryMethod ?? prefs.deliveryMethod;
  return (method as DeliveryMethod) ?? null;
}

interface CouponResult {
  valid: boolean;
  discount: number;
  freeShipping: boolean;
  message: string;
}

interface OrderItemPayload {
  productId?: number | string;
  productVariationId?: number | string;
  quantity: number;
  priceOverride?: number;
}

export function useCheckoutHook() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customer, setCustomer] = useState<CustomerFormData>(buildInitialCustomer);
  const savedPrefs = loadPrefs();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(getInitialDeliveryMethod(savedPrefs));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  // Envío o retiro en tienda: filtra los métodos que se muestran.
  const initialMethod = getInitialDeliveryMethod(savedPrefs);
  const [deliveryMode, setDeliveryModeState] = useState<DeliveryMode>(
    isPickupMethod(initialMethod) ? 'pickup' : 'shipping',
  );
  const [authOpen, setAuthOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Direcciones guardadas (REQ-062): solo con sesión; el guest checkout no cambia.
  const { data: savedAddresses = [] } = useAddressesQuery();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const addressAutoApplied = useRef(false);

  // Autocompleta los datos de envío con la dirección elegida.
  // `null` = "nueva dirección": el usuario escribe los campos a mano.
  const handleSelectAddress = (id: string | null) => {
    setSelectedAddressId(id);
    if (id == null) return;
    const addr = savedAddresses.find((a) => a.id === id);
    if (!addr) return;
    setCustomer((prev) => ({
      ...prev,
      phone:     normalizeCustomerField('phone', addr.telefono),
      province:  addr.provincia,
      city:      addr.ciudad,
      address:   addr.direccion,
      reference: addr.referencia,
    }));
  };

  // Preselección: al cargar las direcciones se aplica la predeterminada
  // (o la primera) una sola vez, antes de que el usuario empiece a editar.
  useEffect(() => {
    if (addressAutoApplied.current || savedAddresses.length === 0) return;
    addressAutoApplied.current = true;
    const def = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];
    handleSelectAddress(def.id);
  }, [savedAddresses]);

  // Fetch full profile from API to pre-fill all fields
  useEffect(() => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!isAuth) return;

    axiosInstance.get(API_ENDPOINTS.USER_ME).then(({ data }) => {
      const u = data?.data ?? data;
      const prefs = loadPrefs();
      setCustomer((prev) => ({
        name:      prev.name || u.firstName || '',
        lastName:  prev.lastName || u.lastName || '',
        email:     prev.email || u.email || '',
        cedula:    prev.cedula || u.cedula || '',
        reference: prev.reference || u.reference || '',
        phone:     prev.phone || u.phone || prefs.phone || '',
        province:  prev.province || u.province || '',
        city:      prev.city || u.city || prefs.city || '',
        address:   prev.address || u.address || prefs.address || '',
      }));
      if (u.preferredDeliveryMethod && !deliveryMethod) {
        setDeliveryMethod(u.preferredDeliveryMethod as DeliveryMethod);
      }
    }).catch(() => {});
  }, []);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponFreeShipping, setCouponFreeShipping] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const items    = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.total());

  const productSubtotal = subtotal;

  const { methods: deliveryOptions, isLoading: deliveryLoading } = useDeliveryMethodsHook(customer.city);

  // La ciudad se elige DESPUÉS del método: si la nueva ciudad no admite el
  // método ya marcado, se limpia (antes se borraba con cualquier cambio de
  // ciudad, lo que obligaba a volver arriba siempre).
  useEffect(() => {
    if (!deliveryMethod) return;
    if (!deliveryOptions.some((m) => m.method === deliveryMethod)) {
      setDeliveryMethod(null);
    }
  }, [deliveryOptions, deliveryMethod]);

  const deliveryCost = couponFreeShipping
    ? 0
    : deliveryMethod
      ? (deliveryOptions.find((m) => m.method === deliveryMethod)?.cost ?? 0)
      : 0;

  const afterDiscount = Math.max(0, subtotal - couponDiscount);
  const isPayphone = paymentMethod === 'PAYPHONE';
  const payphoneSurcharge = isPayphone ? calcPayphoneSurcharge(afterDiscount + deliveryCost) : 0;
  const total = afterDiscount + deliveryCost + payphoneSurcharge;

  const clearCart = useCartStore((s) => s.clearCart);

  const handleCustomerChange = (field: keyof CustomerFormData, value: string) => {
    const next = normalizeCustomerField(field, value);
    setCustomer((prev) => ({ ...prev, [field]: next }));
  };

  // Al cambiar de modo se limpia el método si pertenece al otro grupo.
  const setDeliveryMode = (mode: DeliveryMode) => {
    setDeliveryModeState(mode);
    setDeliveryMethod((current) => {
      if (current == null) return null;
      const currentIsPickup = PICKUP_METHODS.includes(current);
      return currentIsPickup === (mode === 'pickup') ? current : null;
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMessage('');
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.COUPONS_VALIDATE, {
        code: couponCode,
        orderAmount: productSubtotal,
      });
      const result: CouponResult = data?.data ?? data;
      if (result.valid) {
        setCouponDiscount(result.discount);
        setCouponFreeShipping(result.freeShipping);
        setCouponApplied(true);
        setCouponMessage(result.message);
        sonnerResponse(result.message, 'success');
      } else {
        setCouponDiscount(0);
        setCouponFreeShipping(false);
        setCouponApplied(false);
        setCouponMessage(result.message);
        sonnerResponse(result.message, 'error');
      }
    } catch {
      setCouponMessage('Error al validar el cupón');
      sonnerResponse('Error al validar el cupón', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponFreeShipping(false);
    setCouponApplied(false);
    setCouponMessage('');
  };

  const handleNextStep = () => {
    const contactError = validateContact(customer, {
      requiresAddress: deliveryMode !== 'pickup',
    });
    if (contactError) {
      sonnerResponse(contactError, 'error');
      return;
    }
    if (!deliveryMethod) {
      sonnerResponse('Selecciona un método de entrega.', 'error');
      return;
    }
    if (items.length === 0) {
      sonnerResponse('Tu carrito está vacío.', 'error');
      return;
    }
    // Save preferences for next time
    savePrefs({
      phone: customer.phone,
      city: customer.city,
      address: customer.address,
      deliveryMethod: deliveryMethod ?? undefined,
    });
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      sonnerResponse('Selecciona un método de pago.', 'error');
      return;
    }

    setIsPending(true);

    try {
      // Save contact data to user profile in background
      const isAuth = useAuthStore.getState().isAuthenticated;
      if (isAuth) {
        axiosInstance.patch(API_ENDPOINTS.USER_ME, {
          firstName: customer.name,
          lastName: customer.lastName,
          phone: customer.phone,
          cedula: customer.cedula,
          province: customer.province,
          city: customer.city,
          address: customer.address,
          reference: customer.reference,
          preferredDeliveryMethod: deliveryMethod,
        }).catch(() => {}); // fire and forget
      }

      // Cada línea del carrito es una variante (color) del producto.
      const orderItems: OrderItemPayload[] = items.map((item) => ({
        productVariationId: parseInt(item.variantId, 10),
        quantity: item.quantity,
      }));

      const sizesNote = items
        .filter((i) => i.size)
        .map((i) => `${i.name}${i.variationName ? ` ${i.variationName}` : ''} — Talla ${i.size} ×${i.quantity}`)
        .join(' | ');

      const payload = {
        items: orderItems,
        paymentMethod,
        customerName: `${customer.name} ${customer.lastName}`.trim(),
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingCity: customer.city,
        shippingAddress: customer.address,
        deliveryMethod,
        deliveryCost,
        couponCode: couponApplied ? couponCode : undefined,
        couponDiscount: couponApplied ? couponDiscount : undefined,
        notes: [
          sizesNote && `Tallas: ${sizesNote}`,
          customer.cedula && `Cédula: ${customer.cedula}`,
          customer.reference && `Ref: ${customer.reference}`,
          customer.province && `Provincia: ${customer.province}`,
        ].filter(Boolean).join(' | ') || undefined,
      };

      const { data } = await axiosInstance.post(API_ENDPOINTS.CREATE_TRANSACTION, payload);
      const result = data?.data ?? data;

      // handleSubmit SOLO corre para PAYPHONE (transferencia usa
      // handleTransferSubmit). La pasarela devuelve payWithCard (paymentUrl)
      // y/o payWithPayPhone. Si no hay enlace, NO fingir compra exitosa: el
      // pedido pudo crearse sin poder iniciar el pago con tarjeta.
      const gatewayUrl = result.paymentUrl || result.payWithPayPhone;
      if (gatewayUrl) {
        clearCart();
        window.location.href = gatewayUrl;
      } else {
        throw new Error(
          'No se pudo iniciar el pago con tarjeta. Vuelve a intentarlo o escríbenos por WhatsApp para completar tu pedido.',
        );
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Error al crear la orden';
      sonnerResponse(typeof msg === 'string' ? msg : JSON.stringify(msg), 'error');
    } finally {
      setIsPending(false);
    }
  };

  const handleTransferSubmit = async (receiptFile: File) => {
    setIsPending(true);
    try {
      // Save profile in background
      const isAuth = useAuthStore.getState().isAuthenticated;
      if (isAuth) {
        axiosInstance.patch(API_ENDPOINTS.USER_ME, {
          firstName: customer.name,
          lastName: customer.lastName,
          phone: customer.phone,
          cedula: customer.cedula,
          province: customer.province,
          city: customer.city,
          address: customer.address,
          reference: customer.reference,
          preferredDeliveryMethod: deliveryMethod,
        }).catch(() => {});
      }

      // Cada línea del carrito es una variante (color) del producto.
      const orderItems: OrderItemPayload[] = items.map((item) => ({
        productVariationId: parseInt(item.variantId, 10),
        quantity: item.quantity,
      }));

      const sizesNote = items
        .filter((i) => i.size)
        .map((i) => `${i.name}${i.variationName ? ` ${i.variationName}` : ''} — Talla ${i.size} ×${i.quantity}`)
        .join(' | ');

      const payload = {
        items: orderItems,
        paymentMethod: 'TRANSFERENCIA',
        customerName: `${customer.name} ${customer.lastName}`.trim(),
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingCity: customer.city,
        shippingAddress: customer.address,
        deliveryMethod,
        deliveryCost,
        couponCode: couponApplied ? couponCode : undefined,
        couponDiscount: couponApplied ? couponDiscount : undefined,
        notes: [
          sizesNote && `Tallas: ${sizesNote}`,
          customer.cedula && `Cédula: ${customer.cedula}`,
          customer.reference && `Ref: ${customer.reference}`,
          customer.province && `Provincia: ${customer.province}`,
        ].filter(Boolean).join(' | ') || undefined,
      };

      // 1. Create the order
      const { data } = await axiosInstance.post(API_ENDPOINTS.CREATE_TRANSACTION, payload);
      const result = data?.data ?? data;
      const orderId = result.order?.id;

      // 2. Upload receipt immediately
      if (orderId && receiptFile) {
        const fd = new FormData();
        // Una foto de teléfono pasa fácil los 5 MB que acepta el endpoint.
        fd.append('receipt', await prepareReceiptUpload(receiptFile));
        // Quien compra sin sesión no tiene token: el correo del pedido es lo que
        // le permite al backend confirmar que la orden es suya.
        fd.append('email', customer.email);
        await axiosInstance.post(`/payments/${orderId}/upload-receipt`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      clearCart();
      sonnerResponse('¡Orden creada con comprobante!', 'success');
      window.location.href = `/orden/confirmacion?orderId=${orderId}&method=TRANSFERENCIA`;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Error al crear la orden';
      sonnerResponse(typeof msg === 'string' ? msg : JSON.stringify(msg), 'error');
    } finally {
      setIsPending(false);
    }
  };

  const requestSubmit = () => {
    if (!paymentMethod) {
      sonnerResponse('Selecciona un método de pago.', 'error');
      return;
    }
    if (!termsAccepted) {
      sonnerResponse('Debes aceptar los términos y condiciones.', 'error');
      return;
    }
    handleSubmit();
  };

  const requestTransferSubmit = (file: File) => {
    if (!termsAccepted) {
      sonnerResponse('Debes aceptar los términos y condiciones.', 'error');
      return;
    }
    handleTransferSubmit(file);
  };

  return {
    step,
    setStep,
    customer,
    deliveryMethod,
    paymentMethod,
    deliveryOptions,
    deliveryLoading,
    subtotal,
    deliveryCost,
    payphoneSurcharge,
    isPayphone,
    total,
    items,
    isPending,
    couponCode,
    couponDiscount,
    couponFreeShipping,
    couponApplied,
    couponLoading,
    couponMessage,
    setCouponCode,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleCustomerChange,
    setDeliveryMethod,
    setPaymentMethod,
    termsAccepted,
    setTermsAccepted,
    handleNextStep,
    deliveryMode,
    setDeliveryMode,
    isAuthenticated,
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => setAuthOpen(false),
    // Direcciones guardadas (REQ-062)
    savedAddresses,
    selectedAddressId,
    handleSelectAddress,
    handleSubmit: requestSubmit,
    handleTransferSubmit: requestTransferSubmit,
  };
}
