import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { CartItem as CartItemType } from '@/app/store/cart/cartStore';

interface CartItemProps {
  item: CartItemType;
  onRemove: (variantId: string) => void;
  onQtyChange: (variantId: string, qty: number) => void;
}

export default function CartItem({ item, onRemove, onQtyChange }: CartItemProps) {
  const variantLabel = item.ml >= 30
    ? `${item.ml} ml Botella original`
    : `${item.ml}ml Decant`;

  return (
    <div className="flex gap-4 py-5">
      {/* Image */}
      <div className="w-20 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
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
          <p className="text-sm font-bold text-black leading-snug line-clamp-2">{item.name}</p>
          {/* Delete */}
          <button
            onClick={() => onRemove(item.variantId)}
            className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0"
            aria-label="Eliminar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>

        {/* Variant tag */}
        <span className="inline-block mt-1.5 px-2.5 py-1 text-[10px] font-bold text-black border border-gray-300 rounded">
          {variantLabel}
        </span>

        {/* Price */}
        <p className="text-sm font-bold text-black mt-2">
          {formatCurrency(item.price * item.quantity)}
        </p>

        {/* Qty controls (compact) */}
        {item.quantity > 1 && (
          <p className="text-xs text-gray-400 mt-0.5">
            {item.quantity} × {formatCurrency(item.price)}
          </p>
        )}
      </div>
    </div>
  );
}
