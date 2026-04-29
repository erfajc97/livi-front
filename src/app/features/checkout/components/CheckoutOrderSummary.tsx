import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
  couponFreeShipping?: boolean;
  couponApplied?: boolean;
  couponLoading?: boolean;
  couponMessage?: string;
  onCouponCodeChange?: (code: string) => void;
  onApplyCoupon?: () => void;
  onRemoveCoupon?: () => void;
  payphoneSurcharge?: number;
}

export default function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryCost,
  total,
  couponCode = '',
  couponDiscount = 0,
  couponFreeShipping = false,
  couponApplied = false,
  couponLoading = false,
  couponMessage = '',
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  payphoneSurcharge = 0,
}: CheckoutOrderSummaryProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);

  const hasNonComboItems = items.some((item) => item.comboId == null);

  return (
    <div className="flex flex-col">
      <h2 className="font-heading text-2xl font-bold text-black mb-6">Tu pedido</h2>

      {/* Cart Items */}
      <div className="flex flex-col gap-5 mb-8 flex-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No hay productos en tu carrito.</p>
        ) : (
          items.map((item) => (
            <div key={item.variantId} className="flex gap-4 items-center">
              <div className="w-20 h-24 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading font-bold text-sm text-black leading-snug pr-4">{item.name}</h3>
                  <button onClick={() => removeItem(item.variantId)} className="text-gray-400 hover:text-error transition-colors" aria-label="Eliminar producto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                {item.comboId ? (
                  <div className="mt-1.5 border border-gray-200 rounded-md px-1.5 py-0.5 inline-block text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Combo · {item.comboProducts?.length ?? 0} productos
                  </div>
                ) : (
                  <div className="mt-1.5 border border-gray-200 rounded-md px-1.5 py-0.5 inline-block text-xs text-gray-500 font-bold uppercase tracking-wider">
                    {item.ml}ml {item.ml >= 30 ? 'Botella original' : 'Decant'}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  {item.comboId ? (
                    <span className="text-sm font-bold text-black select-none">Cant: {item.quantity}</span>
                  ) : (
                    <div className="flex items-center gap-0">
                      <button type="button" onClick={() => updateQty(item.variantId, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black rounded-l text-xs">−</button>
                      <span className="w-7 h-6 flex items-center justify-center border-y border-gray-200 text-sm font-bold text-black select-none">{item.quantity}</span>
                      <button type="button" onClick={() => updateQty(item.variantId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black rounded-r text-xs">+</button>
                    </div>
                  )}
                  <p className="font-bold text-sm text-black">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Coupon Input — only when there are non-combo products */}
      {onApplyCoupon && hasNonComboItems && (
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Cupón de descuento</p>
          {couponApplied ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <div>
                <span className="font-mono font-bold text-success text-sm">{couponCode}</span>
                <span className="text-success text-xs ml-2">
                  {couponFreeShipping ? 'Envío gratis' : `-${formatCurrency(couponDiscount)}`}
                </span>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-error hover:text-error text-xs font-bold transition-colors"
              >
                Quitar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                id="coupon-code"
                type="text"
                value={couponCode}
                onChange={(e) => onCouponCodeChange?.(e.target.value.toUpperCase())}
                placeholder="Ej: VERANO2026"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono uppercase text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {couponLoading ? '...' : 'Aplicar'}
              </button>
            </div>
          )}
          {couponMessage && !couponApplied && (
            <p className="text-xs text-error mt-1.5">{couponMessage}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 font-bold text-sm">
        <div className="w-full h-px bg-gray-200" />

        <div className="flex justify-between items-center text-black">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between items-center text-success">
            <span>Descuento cupón</span>
            <span>-{formatCurrency(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-black">
          <span>{couponFreeShipping ? 'Envío (gratis)' : 'Envío'}</span>
          <span>{couponFreeShipping ? formatCurrency(0) : formatCurrency(deliveryCost)}</span>
        </div>

        {payphoneSurcharge > 0 && (
          <div className="flex justify-between items-center text-gray-500">
            <span>Recargo Payphone (6%)</span>
            <span>{formatCurrency(payphoneSurcharge)}</span>
          </div>
        )}

        <div className="w-full h-px bg-gray-200 mt-2" />

        <div className="flex justify-between items-center text-black text-xl font-heading mt-2">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
