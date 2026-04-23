interface CheckoutStepTabsProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
}

export default function CheckoutStepTabs({ step, setStep }: CheckoutStepTabsProps) {
  return (
    <div className="flex gap-8 border-b border-border pb-0 font-bold text-sm text-text-muted">
      <button
        type="button"
        onClick={() => setStep(1)}
        className={`pb-3 -mb-px transition-colors ${step === 1 ? 'text-black border-b-2 border-black' : 'hover:text-text-muted'}`}
      >
        1. Información de envío
      </button>
      <button
        type="button"
        onClick={() => setStep(2)}
        className={`pb-3 -mb-px transition-colors ${step === 2 ? 'text-black border-b-2 border-black' : 'hover:text-text-muted'}`}
      >
        2. Método de pago
      </button>
    </div>
  );
}
