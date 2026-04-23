import { useState, useEffect } from 'react';
import { useCartStore } from '@/app/store/cart/cartStore';
import { useAuthStore } from '@/app/store/auth/authStore';
import { useDeliveryMethodsHook } from './useDeliveryMethodsHook';
import { calcPayphoneSurcharge } from '@/app/helpers/calcPayphoneSurcharge';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import type { CustomerFormData, PaymentMethod, DeliveryMethod } from '../types';

const PREFS_KEY = 'nondecants-checkout-prefs';

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

export function useCheckoutHook() {
  const [step, setStep] = useState<1 | 2>(1);
  const [customer, setCustomer] = useState<CustomerFormData>(buildInitialCustomer);
  const savedPrefs = loadPrefs();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(getInitialDeliveryMethod(savedPrefs));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isPending, setIsPending] = useState(false);

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

  // Subtotal only for non-combo items (coupons don't apply to combos)
  const productSubtotal = items
    .filter((i) => i.comboId == null)
    .reduce((acc, i) => acc + i.price * i.quantity, 0);

  const { methods: deliveryOptions, isLoading: deliveryLoading } = useDeliveryMethodsHook(customer.city);

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
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (field === 'city') setDeliveryMethod(null);
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
    if (!customer.name || !customer.email || !customer.phone || !customer.city) {
      sonnerResponse('Completa los datos de contacto.', 'error');
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

      // Expand combo items into individual products for the backend
      const orderItems = items.flatMap((item) => {
        if (item.comboProducts && item.comboProducts.length > 0) {
          return item.comboProducts.map((cp) => ({
            productVariationId: cp.productVariationId,
            quantity: cp.quantity * item.quantity,
          }));
        }
        return {
          productVariationId: parseInt(item.variantId, 10),
          quantity: item.quantity,
        };
      });

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
          customer.cedula && `Cédula: ${customer.cedula}`,
          customer.reference && `Ref: ${customer.reference}`,
          customer.province && `Provincia: ${customer.province}`,
        ].filter(Boolean).join(' | ') || undefined,
      };

      const { data } = await axiosInstance.post(API_ENDPOINTS.CREATE_TRANSACTION, payload);
      const result = data?.data ?? data;

      if (result.paymentUrl) {
        // PayPhone: redirect to payment page
        clearCart();
        window.location.href = result.paymentUrl;
      } else {
        // Transferencia: redirect to confirmation page
        clearCart();
        const orderId = result.order?.id || result.order?.orderNumber;
        sonnerResponse('¡Orden creada exitosamente!', 'success');
        window.location.href = `/orden/confirmacion?orderId=${orderId}&method=TRANSFERENCIA`;
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
    handleNextStep,
    handleSubmit,
  };
}
