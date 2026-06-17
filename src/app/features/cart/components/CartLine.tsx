import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { CartRow } from '../hooks/useCartPageHook';

interface CartLineProps {
  row: CartRow;
  group: 'immediate' | 'bajo';
  /** Fija la cantidad TOTAL del item (el split se recalcula solo). */
  onSetTotal: (variantId: string, total: number) => void;
  onRemove: (variantId: string) => void;
}

export default function CartLine({ row, group, onSetTotal, onRemove }: CartLineProps) {
  const { item, portionQty, total, split } = row;
  const isBajo = group === 'bajo';
  const isCombo = item.comboId != null;

  // Decant topado por stock: no puede exceder maxQty (no genera bajo pedido).
  const decantCapped = item.stockAvailable == null && item.maxQty != null;
  const plusDisabled = decantCapped && total >= (item.maxQty ?? Infinity);
  // En la fila "en stock" de un item partido, el menos se gestiona desde la
  // fila de bajo pedido (evita ambigüedad sobre qué unidad se quita).
  const minusDisabled = group === 'immediate' && split;

  const variantLabel = isCombo
    ? `Combo · ${item.comboProducts?.length ?? 0} productos`
    : `${item.ml} ml · ${item.ml >= 30 ? 'Botella original' : 'Decant'}`;

  // Quitar: en la porción bajo pedido de un item partido, solo elimina esa
  // porción (baja el total al stock); en el resto, elimina el item completo.
  const handleRemove = () =>
    isBajo && split ? onSetTotal(item.variantId, total - portionQty) : onRemove(item.variantId);

  return (
    <div
      className={`grid grid-cols-[88px_1fr] gap-x-5 gap-y-4 border-b border-border py-7 sm:grid-cols-[140px_1fr_auto] sm:items-center ${
        isBajo ? 'border-l-2 border-l-accent pl-4 sm:pl-5' : ''
      }`}
    >
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
        <p className="mt-1.5 font-body text-[11px] tracking-[0.04em] text-text-soft">{variantLabel}</p>

        {/* Estado según grupo */}
        <p className="mt-2.5 flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.16em] text-text-muted">
          {isBajo ? (
            <>
              <span className="h-[5px] w-[5px] rounded-full bg-accent" />
              Bajo pedido · Entrega 13–17 días
            </>
          ) : (
            <>En stock · Listo para envío</>
          )}
        </p>
        {split && !isBajo && (
          <p className="mt-1 font-body text-[10px] uppercase tracking-[0.14em] text-text-muted">
            El resto va bajo pedido ↓
          </p>
        )}

        <button
          onClick={handleRemove}
          className="mt-3 border-b border-border pb-[2px] font-body text-[10px] uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-text hover:text-text"
        >
          {isBajo && split ? 'Quitar bajo pedido' : 'Quitar'}
        </button>
      </div>

      {/* Stepper + precio */}
      <div className="col-start-2 flex items-center justify-between gap-5 sm:col-start-3 sm:flex-col sm:items-end sm:justify-center">
        {isCombo ? (
          <span className="select-none font-body text-xs text-text-soft">Cant: {portionQty}</span>
        ) : (
          <div className="inline-flex items-center border border-border">
            <button
              onClick={() => !minusDisabled && onSetTotal(item.variantId, total - 1)}
              disabled={minusDisabled}
              className="flex h-8 w-8 items-center justify-center text-text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-30"
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
        )}
        <p className="font-body text-sm text-text">{formatCurrency(item.price * portionQty)}</p>
      </div>
    </div>
  );
}
