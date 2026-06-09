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
      <h2 className="eyebrow mb-4">Método de envío</h2>
      <div className="flex flex-col divide-y divide-border border-y border-border">
        {isLoading ? (
          <p className="py-4 font-body text-sm text-text-muted">Cargando opciones...</p>
        ) : options.length === 0 ? (
          <p className="py-4 font-body text-sm text-text-muted">Selecciona una ciudad primero para ver las opciones disponibles.</p>
        ) : (
          options.map((opt) => (
            <label key={opt.id} onClick={() => onSelect(opt.method)} className="group flex cursor-pointer items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${selected === opt.method ? 'border-text' : 'border-border group-hover:border-text'}`}>
                  {selected === opt.method && <div className="h-2.5 w-2.5 rounded-full bg-text" />}
                </div>
                <span className="font-body text-sm text-text">{opt.label}</span>
              </div>
              <span className="font-body text-sm text-text">
                {opt.cost === 0 ? 'Gratis' : formatCurrency(opt.cost)}
              </span>
            </label>
          ))
        )}
      </div>
    </section>
  );
}
