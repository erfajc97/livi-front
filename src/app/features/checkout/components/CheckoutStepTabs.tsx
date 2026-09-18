import { LABEL_MONO } from '@/app/components/UI/formClasses';

interface CheckoutStepTabsProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  /** El paso 2 (Pago) solo se abre cuando el paso 1 está completo:
      contacto válido + método de entrega elegido. */
  canGoToStep2?: boolean;
}

export default function CheckoutStepTabs({ step, setStep, canGoToStep2 = false }: CheckoutStepTabsProps) {
  return (
    <div className={`flex gap-8 border-b border-border ${LABEL_MONO}`}>
      <button
        type="button"
        onClick={() => setStep(1)}
        className={`-mb-px pb-3 transition-colors ${step === 1 ? 'border-b border-text text-text' : 'hover:text-text'}`}
      >
        01 · Envío
      </button>
      <button
        type="button"
        disabled={!canGoToStep2}
        onClick={() => canGoToStep2 && setStep(2)}
        title={canGoToStep2 ? undefined : 'Completa tus datos de envío primero'}
        className={`-mb-px pb-3 transition-colors ${
          step === 2 ? 'border-b border-text text-text' : 'hover:text-text'
        } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-text-muted`}
      >
        02 · Pago
      </button>
    </div>
  );
}
