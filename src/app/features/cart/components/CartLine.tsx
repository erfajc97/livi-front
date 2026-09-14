import { formatCurrency } from '@/app/helpers/formatCurrency';
import DeliveryEta from '@/app/components/UI/DeliveryEta';
import { DEFAULT_DISPATCH_CUTOFF_HOUR } from '@/app/helpers/deliveryWindow';
import type { CartRow } from '../hooks/useCartPageHook';

interface CartLineProps {
  row: CartRow;
  group: 'immediate' | 'bajo';
  deliveryOffset?: number;
  cutoffHour?: number;
  /** Fija la cantidad TOTAL del item. */
  onSetTotal: (variantId: string, total: number) => void;
  onRemove: (variantId: string) => void;
}

export default function CartLine({ row, deliveryOffset = 0, cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR, onSetTotal, onRemove }: CartLineProps) {
  const { item, portionQty, total } = row;

  const plusDisabled = item.maxQty != null && total >= item.maxQty;

  const variantLabel = item.variationName ? `Color · ${item.variationName}` : '';

  return (
    <div className="grid grid-cols-[88px_1fr] gap-x-5 gap-y-4 border-b border-border py-7 sm:grid-cols-[140px_1fr_auto] sm:items-center">
      {/* Imagen */}
      <div className="row-span-2 h-[100px] w-[88px] shrink-0 overflow-hidden bg-bg-alt sm:row-span-1 sm:h-40 sm:w-[140px]">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <h3 className="font-display text-xl font-light leading-snug text-text line-clamp-2 sm:text-2xl">
          {item.name}
        </h3>
        {variantLabel && (
          <p className="mt-1.5 font-body text-[11px] tracking-[0.04em] text-text-soft">{variantLabel}</p>
        )}

        <div className="mt-2.5 min-w-0 overflow-hidden">
          <DeliveryEta
            variant="immediate"
            offsetDays={deliveryOffset}
            cutoffHour={cutoffHour}
            compact
          />
        </div>

        <button
          onClick={() => onRemove(item.variantId)}
          className="mt-3 border-b border-border pb-[2px] font-body text-[10px] uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-text hover:text-text"
        >
          Quitar
        </button>
      </div>

      {/* Stepper + precio */}
      <div className="col-start-2 flex items-center justify-between gap-5 sm:col-start-3 sm:flex-col sm:items-end sm:justify-center">
        <div className="inline-flex items-center border border-border">
          <button
            onClick={() => onSetTotal(item.variantId, total - 1)}
            className="flex h-8 w-8 items-center justify-center text-text-muted transition-colors hover:text-text"
            aria-label="Disminuir"
          >
            −
          </button>
          <span className="flex h-8 w-9 select-none items-center justify-center border-x border-border font-body text-xs text-text">
            {portionQty}
          </span>
          <button
            onClick={() => !plusDisabled && onSetTotal(item.variantId, total + 1)}
            disabled={plusDisabled}
            className="flex h-8 w-8 items-center justify-center text-text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>
        <p className="font-body text-sm text-text">{formatCurrency(item.price * portionQty)}</p>
      </div>
    </div>
  );
}
