import Loader from '@/app/components/Loader';
import CheckoutStepTabs from './CheckoutStepTabs';
import ContactSection from './ContactSection';
import AddressSection from './AddressSection';
import DeliverySection from './DeliverySection';
import PaymentSection from './PaymentSection';
import type { CustomerFormData, DeliveryMethod, PaymentMethod, DeliveryOption } from '../types';

interface CheckoutFormProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  customer: CustomerFormData;
  deliveryMethod: DeliveryMethod | null;
  paymentMethod: PaymentMethod | null;
  deliveryOptions: DeliveryOption[];
  deliveryLoading: boolean;
  isPending: boolean;
  handleCustomerChange: (field: keyof CustomerFormData, value: string) => void;
  setDeliveryMethod: (val: DeliveryMethod) => void;
  setPaymentMethod: (val: PaymentMethod) => void;
  handleNextStep: () => void;
  handleSubmit: () => void;
}

export default function CheckoutForm({
  step,
  setStep,
  customer,
  deliveryMethod,
  paymentMethod,
  deliveryOptions,
  deliveryLoading,
  isPending,
  handleCustomerChange,
  setDeliveryMethod,
  setPaymentMethod,
  handleNextStep,
  handleSubmit,
}: CheckoutFormProps) {

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) handleNextStep();
    else handleSubmit();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={onFormSubmit}>
      <CheckoutStepTabs step={step} setStep={setStep} />

      {step === 1 && (
        <>
          <ContactSection customer={customer} onChange={handleCustomerChange} />
          <AddressSection customer={customer} onChange={handleCustomerChange} />
          <DeliverySection
            options={deliveryOptions}
            isLoading={deliveryLoading}
            selected={deliveryMethod}
            onSelect={setDeliveryMethod}
          />
          <button
            type="submit"
            className="w-full bg-black text-white font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-neutral-800 transition-colors"
          >
            Continuar
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <PaymentSection selected={paymentMethod} onSelect={setPaymentMethod} />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader size={18} color="#fff" className="mx-auto" /> : 'Confirmar pedido'}
          </button>
        </>
      )}
    </form>
  );
}
