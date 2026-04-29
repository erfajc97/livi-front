import Loader from '@/app/components/Loader';
import CheckoutStepTabs from './CheckoutStepTabs';
import ContactSection from './ContactSection';
import AddressSection from './AddressSection';
import DeliverySection from './DeliverySection';
import PaymentSection from './PaymentSection';
import TransferBankInfoStep from './TransferBankInfoStep';
import type { CustomerFormData, DeliveryMethod, PaymentMethod, DeliveryOption } from '../types';

interface CheckoutFormProps {
  step: 1 | 2 | 3;
  setStep: (step: 1 | 2 | 3) => void;
  customer: CustomerFormData;
  deliveryMethod: DeliveryMethod | null;
  paymentMethod: PaymentMethod | null;
  deliveryOptions: DeliveryOption[];
  deliveryLoading: boolean;
  isPending: boolean;
  total: number;
  handleCustomerChange: (field: keyof CustomerFormData, value: string) => void;
  setDeliveryMethod: (val: DeliveryMethod) => void;
  setPaymentMethod: (val: PaymentMethod) => void;
  handleNextStep: () => void;
  handleSubmit: () => void;
  handleTransferSubmit: (receiptFile: File) => void;
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
  total,
  handleCustomerChange,
  setDeliveryMethod,
  setPaymentMethod,
  handleNextStep,
  handleSubmit,
  handleTransferSubmit,
}: CheckoutFormProps) {

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) handleNextStep();
    else if (step === 2) {
      if (paymentMethod === 'TRANSFERENCIA') {
        setStep(3);
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={onFormSubmit}>
      {step !== 3 && <CheckoutStepTabs step={step} setStep={setStep} />}

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
            disabled={isPending || !paymentMethod}
            className="w-full bg-black text-white font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader size={18} color="#fff" className="mx-auto" />
            ) : paymentMethod === 'TRANSFERENCIA' ? (
              'Ver datos bancarios'
            ) : (
              'Confirmar pedido'
            )}
          </button>
        </>
      )}

      {step === 3 && (
        <TransferBankInfoStep
          total={total}
          isPending={isPending}
          onConfirm={handleTransferSubmit}
          onBack={() => setStep(2)}
        />
      )}
    </form>
  );
}
