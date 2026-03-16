import type { PaymentMethod } from '../types';

interface PaymentSectionProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentSection({ selected, onSelect }: PaymentSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Transferencia */}
      <label
        onClick={() => onSelect('TRANSFERENCIA')}
        className={`flex items-center justify-between cursor-pointer border rounded-xl px-5 py-4 transition-colors ${selected === 'TRANSFERENCIA' ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === 'TRANSFERENCIA' ? 'border-black' : 'border-gray-300'}`}>
            {selected === 'TRANSFERENCIA' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 10h20" />
          </svg>
          <span className="text-sm font-medium text-black">Transferencia Bancaria / Deposito</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </label>

      {/* Tarjeta */}
      <label
        onClick={() => onSelect('PAYPHONE')}
        className={`flex items-center justify-between cursor-pointer border rounded-xl px-5 py-4 transition-colors ${selected === 'PAYPHONE' ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === 'PAYPHONE' ? 'border-black' : 'border-gray-300'}`}>
            {selected === 'PAYPHONE' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-blue-800 font-bold text-[10px] italic border border-gray-200 rounded px-1.5 py-0.5">VISA</span>
            <div className="w-5 h-5 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
              <div className="w-2.5 h-5 bg-blue-500 skew-x-12" />
            </div>
            <span className="text-orange-500 font-bold text-[8px] border border-gray-200 rounded px-1.5 py-0.5">DISCOVER</span>
          </div>
          <span className="text-sm font-medium text-black">Tarjeta debito o crédito</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </label>
    </div>
  );
}
