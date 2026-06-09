import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { CartItem as CartItemType } from '@/app/store/cart/cartStore';

interface CartItemProps {
  item: CartItemType;
  onRemove: (variantId: string) => void;
  onQtyChange: (variantId: string, qty: number) => void;
}

export default function CartItem({ item, onRemove, onQtyChange }: CartItemProps) {
  const isCombo = item.comboId != null;
  const atMax = item.maxQty != null && item.quantity >= item.maxQty;

  const variantLabel = isCombo
    ? `Combo · ${item.comboProducts?.length ?? 0} productos`
    : item.ml >= 30
      ? `${item.ml} ml Botella original`
      : `${item.ml}ml Decant`;

  return (
    <div className="flex gap-4 py-5">
      {/* Image */}
      <div className="h-24 w-20 shrink-0 overflow-hidden bg-surface-raised">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-base font-normal leading-snug text-text line-clamp-2">{item.name}</p>
          <button
            onClick={() => onRemove(item.variantId)}
            className="shrink-0 p-1 text-text-muted transition-colors hover:text-error"
            aria-label="Eliminar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>

        {/* Variant tag */}
        <span className="mt-1.5 inline-block border border-border px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.14em] text-text-soft">
          {variantLabel}
        </span>

        {/* Price + Qty controls */}
        <div className="mt-2.5 flex items-center justify-between">
          {isCombo ? (
            <span className="select-none text-xs text-text-soft">Cant: {item.quantity}</span>
          ) : (
            <div className="flex items-center">
              <button
                onClick={() => onQtyChange(item.variantId, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center border border-border text-text-muted transition-colors hover:border-text hover:text-text"
              >
                −
              </button>
              <span className="flex h-7 w-9 select-none items-center justify-center border-y border-border text-xs text-text">
                {item.quantity}
              </span>
              <button
                onClick={() => !atMax && onQtyChange(item.variantId, item.quantity + 1)}
                disabled={atMax}
                className="flex h-7 w-7 items-center justify-center border border-border text-text-muted transition-colors hover:border-text hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          )}
          <p className="font-body text-sm text-text">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
        {atMax && !isCombo && (
          <p className="mt-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-text-muted">
            Máximo disponible: {item.maxQty}
          </p>
        )}
      </div>
    </div>
  );
}
