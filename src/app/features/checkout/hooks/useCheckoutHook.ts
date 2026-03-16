import { useState } from 'react';
import { useCartStore } from '@/app/store/cart/cartStore';
import { useDeliveryMethodsHook } from './useDeliveryMethodsHook';
import { calcPayphoneSurcharge } from '@/app/helpers/calcPayphoneSurcharge';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { CustomerFormData, PaymentMethod, DeliveryMethod } from '../types';

const initialCustomer: CustomerFormData = {
  name:    '',
  email:   '',
  phone:   '',
  city:    '',
  address: '',
};

export function useCheckoutHook() {
  const [step, setStep] = useState<1 | 2>(1);
  const [customer, setCustomer] = useState<CustomerFormData>(initialCustomer);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const items    = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.total());

  const { methods: deliveryOptions, isLoading: deliveryLoading } = useDeliveryMethodsHook(customer.city);

  // Cálculo de costos
  const deliveryCost = deliveryMethod
    ? (deliveryOptions.find((m) => m.method === deliveryMethod)?.cost ?? 0)
    : 0;

  const isPayphone = paymentMethod === 'PAYPHONE';
  const payphoneSurcharge = isPayphone ? calcPayphoneSurcharge(subtotal + deliveryCost) : 0;
  const total = subtotal + deliveryCost + payphoneSurcharge;

  const clearCart = useCartStore((s) => s.clearCart);
  // TODO: conectar isPending al mutation cuando el backend esté listo
  // const { mutate: createOrder, isPending } = useCreateOrderMutation();
  const isPending = false;

  const handleCustomerChange = (field: keyof CustomerFormData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    // Reset delivery method al cambiar ciudad
    if (field === 'city') setDeliveryMethod(null);
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
    setStep(2);
  };

  const handleSubmit = () => {
    if (!paymentMethod) {
      sonnerResponse('Selecciona un método de pago.', 'error');
      return;
    }

    // TODO: conectar con API cuando el back esté listo
    clearCart();
    sonnerResponse('¡Orden creada exitosamente!', 'success');
    window.location.href = '/confirmacion';
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
    handleCustomerChange,
    setDeliveryMethod,
    setPaymentMethod,
    handleNextStep,
    handleSubmit,
  };
}
