import Loader from '@/app/components/Loader';
import CheckoutStepTabs from './CheckoutStepTabs';
import ContactSection from './ContactSection';
import AddressSection from './AddressSection';
import DeliverySection from './DeliverySection';
import PaymentSection from './PaymentSection';
import TransferBankInfoStep from './TransferBankInfoStep';
import { validateContact } from '../validators';
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

  // El paso 1 solo avanza con los datos completos y un método de entrega
  // elegido: hasta entonces el botón queda deshabilitado.
  const contactError = validateContact(customer);
  const canContinue = contactError === null && deliveryMethod !== null;

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
          <div className="mt-2">
            <button
              type="submit"
              disabled={!canContinue}
              className="w-full bg-text py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-text/40 disabled:hover:bg-text/40"
            >
              Continuar
            </button>
            {!canContinue && (
              <p className="mt-2 font-body text-[11px] text-text-muted">
                {contactError ?? 'Selecciona un método de entrega.'}
              </p>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <PaymentSection selected={paymentMethod} onSelect={setPaymentMethod} />
          <button
            type="submit"
            disabled={isPending || !paymentMethod}
            className="mt-2 w-full bg-text py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
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
