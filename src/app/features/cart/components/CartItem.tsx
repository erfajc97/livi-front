import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { CartItem as CartItemType } from '@/app/store/cart/cartStore';

interface CartItemProps {
  item: CartItemType;
  onRemove: (variantId: string) => void;
  onQtyChange: (variantId: string, qty: number) => void;
}

export default function CartItem({ item, onRemove, onQtyChange }: CartItemProps) {
  const isCombo = item.comboId != null;

  const variantLabel = isCombo
    ? `Combo · ${item.comboProducts?.length ?? 0} productos`
    : item.ml >= 30
      ? `${item.ml} ml Botella original`
      : `${item.ml}ml Decant`;

  return (
    <div className="flex gap-4 py-5">
      {/* Image */}
      <div className="w-20 h-24 shrink-0 bg-surface-raised rounded-lg overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-text leading-snug line-clamp-2">{item.name}</p>
          <button
            onClick={() => onRemove(item.variantId)}
            className="p-1 text-text-muted hover:text-error transition-colors shrink-0"
            aria-label="Eliminar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>

        {/* Variant tag */}
        <span className="inline-block mt-1.5 px-2.5 py-1 text-xs font-bold text-text border border-border rounded">
          {variantLabel}
        </span>

        {/* Price + Qty controls */}
        <div className="flex items-center justify-between mt-2">
          {isCombo ? (
            <span className="text-xs font-bold text-text select-none">Cant: {item.quantity}</span>
          ) : (
            <div className="flex items-center gap-0">
              <button
                onClick={() => onQtyChange(item.variantId, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center border border-border text-text-muted hover:text-text hover:border-black transition-colors rounded-l text-sm"
              >
                −
              </button>
              <span className="w-8 h-7 flex items-center justify-center border-y border-border text-xs font-bold text-text select-none">
                {item.quantity}
              </span>
              <button
                onClick={() => onQtyChange(item.variantId, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center border border-border text-text-muted hover:text-text hover:border-black transition-colors rounded-r text-sm"
              >
                +
              </button>
            </div>
          )}
          <p className="text-sm font-bold text-text">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
