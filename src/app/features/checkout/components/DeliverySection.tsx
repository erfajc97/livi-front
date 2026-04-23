import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { DeliveryMethod, DeliveryOption } from '../types';

interface DeliverySectionProps {
  options: DeliveryOption[];
  isLoading: boolean;
  selected: DeliveryMethod | null;
  onSelect: (method: DeliveryMethod) => void;
}

export default function DeliverySection({ options, isLoading, selected, onSelect }: DeliverySectionProps) {
  return (
    <section>
      <h2 className="font-heading font-bold text-black text-lg mb-4">Método de envío</h2>
      <div className="flex flex-col divide-y divide-border">
        {isLoading ? (
          <p className="text-sm text-text-muted py-3">Cargando opciones...</p>
        ) : options.length === 0 ? (
          <p className="text-sm text-text-muted py-3">Selecciona una ciudad primero para ver las opciones disponibles.</p>
        ) : (
          options.map((opt) => (
            <label key={opt.id} onClick={() => onSelect(opt.method)} className="flex items-center justify-between cursor-pointer group py-4">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === opt.method ? 'border-black' : 'border-border group-hover:border-black'}`}>
                  {selected === opt.method && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                </div>
                <span className="text-sm text-black">{opt.label}</span>
              </div>
              <span className="text-sm font-bold text-black">
                {opt.cost === 0 ? 'Grátis' : formatCurrency(opt.cost)}
              </span>
            </label>
          ))
        )}
      </div>
    </section>
  );
}
