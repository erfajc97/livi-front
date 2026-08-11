interface TermsAcceptanceProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function TermsAcceptance({ checked, onChange }: TermsAcceptanceProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-border transition-colors peer-checked:border-text peer-checked:bg-text">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-bg">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="font-body text-xs leading-relaxed text-text-soft">
        He leído y acepto los{' '}
        <a
          href="/terminos"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-text underline underline-offset-2 transition-colors hover:text-accent"
        >
          términos y condiciones
        </a>
      </span>
    </label>
  );
}
