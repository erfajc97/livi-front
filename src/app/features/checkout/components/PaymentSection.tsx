import type { PaymentMethod } from '../types';

interface PaymentSectionProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const METHODS: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  {
    key: 'PAYPHONE',
    label: 'Tarjeta débito o crédito',
    icon: (
      <div className="flex items-center gap-1.5">
        <span className="text-blue-800 font-bold text-xs italic border border-border rounded px-1.5 py-0.5">VISA</span>
        <div className="w-5 h-5 rounded-full border border-border overflow-hidden flex items-center justify-center">
          <div className="w-2.5 h-5 bg-blue-500 skew-x-12" />
        </div>
        <span className="text-orange-500 font-bold text-xs border border-border rounded px-1.5 py-0.5">DISCOVER</span>
      </div>
    ),
  },
  {
    key: 'TRANSFERENCIA',
    label: 'Transferencia bancaria / Depósito',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
];

export default function PaymentSection({ selected, onSelect }: PaymentSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="eyebrow mb-1">Método de pago</h2>
      {selected === 'PAYPHONE' && (
        <p className="border-l-2 border-accent bg-bg-alt px-3 py-2.5 font-body text-xs text-text-soft">
          Se aplica un recargo del 6% por procesamiento con tarjeta.
        </p>
      )}
      {selected === 'TRANSFERENCIA' && (
        <p className="border-l-2 border-border bg-bg-alt px-3 py-2.5 font-body text-xs text-text-soft">
          Después de confirmar, podrás subir tu comprobante de transferencia.
        </p>
      )}
      {METHODS.map((m) => (
        <label
          key={m.key}
          onClick={() => onSelect(m.key)}
          className={`flex cursor-pointer items-center justify-between border px-5 py-4 transition-colors ${selected === m.key ? 'border-text bg-bg-alt' : 'border-border hover:border-text'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${selected === m.key ? 'border-text' : 'border-border'}`}>
              {selected === m.key && <div className="h-2.5 w-2.5 rounded-full bg-text" />}
            </div>
            {m.icon}
            <span className="font-body text-sm text-text">{m.label}</span>
          </div>
        </label>
      ))}
    </div>
  );
}
