interface CheckoutStepTabsProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
}

export default function CheckoutStepTabs({ step, setStep }: CheckoutStepTabsProps) {
  return (
    <div className="flex gap-8 border-b border-border font-body text-[11px] uppercase tracking-[0.16em] text-text-muted">
      <button
        type="button"
        onClick={() => setStep(1)}
        className={`-mb-px pb-3 transition-colors ${step === 1 ? 'border-b border-text text-text' : 'hover:text-text'}`}
      >
        01 · Envío
      </button>
      <button
        type="button"
        onClick={() => setStep(2)}
        className={`-mb-px pb-3 transition-colors ${step === 2 ? 'border-b border-text text-text' : 'hover:text-text'}`}
      >
        02 · Pago
      </button>
    </div>
  );
}
