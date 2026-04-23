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
      <h2 className="font-heading font-bold text-black text-lg mb-1">Método de pago</h2>
      {selected === 'PAYPHONE' && (
        <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
          Se aplica un recargo del 6% por procesamiento con tarjeta.
        </p>
      )}
      {selected === 'TRANSFERENCIA' && (
        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          Después de confirmar, podrás subir tu comprobante de transferencia.
        </p>
      )}
      {METHODS.map((m) => (
        <label
          key={m.key}
          onClick={() => onSelect(m.key)}
          className={`flex items-center justify-between cursor-pointer border rounded-xl px-5 py-4 transition-colors ${selected === m.key ? 'border-black bg-surface-raised' : 'border-border hover:border-black'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === m.key ? 'border-black' : 'border-border'}`}>
              {selected === m.key && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
            </div>
            {m.icon}
            <span className="text-sm font-medium text-black">{m.label}</span>
          </div>
        </label>
      ))}
    </div>
  );
}
