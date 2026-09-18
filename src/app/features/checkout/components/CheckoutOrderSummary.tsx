import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';
import { lineDeliveryLabel, orderDeliveryLabel, DEFAULT_DISPATCH_CUTOFF_HOUR } from '@/app/helpers/deliveryWindow';
import { useDeliveryOffsetQuery, useDispatchCutoffQuery } from '@/app/tanstack-queries/settingsQuery';

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

  const { data: deliveryOffset = 0 } = useDeliveryOffsetQuery();
  const { data: cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR } = useDispatchCutoffQuery();

  return (
    <div className="flex flex-col">
      <h2 className="mb-6 font-heading text-3xl font-normal text-text">Tu pedido</h2>

      {/* Cart Items */}
      <div className="flex flex-col gap-5 mb-8 flex-1">
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">No hay productos en tu carrito.</p>
        ) : (
          items.map((item) => (
            <div key={item.variantId} className="flex gap-4 items-center">
              <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden border border-border bg-bg-alt">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="pr-4 font-heading text-base font-normal leading-snug text-text">{item.name}</h3>
                  <button onClick={() => removeItem(item.variantId)} className="text-text-muted hover:text-error transition-colors" aria-label="Eliminar producto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                {item.variationName && (
                  <div className="mt-1.5 inline-block border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                    {item.variationName}
                    {item.size ? ` · Talla ${item.size}` : ''}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <button type="button" onClick={() => updateQty(item.variantId, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center border border-border text-text-muted transition-colors hover:text-text">−</button>
                    <span className="flex h-7 w-8 select-none items-center justify-center border-y border-border font-body text-sm text-text">{item.quantity}</span>
                    <button type="button" disabled={item.maxQty != null && item.quantity >= item.maxQty} onClick={() => updateQty(item.variantId, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center border border-border text-text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-40">+</button>
                  </div>
                  <p className="font-body text-sm text-text">{formatCurrency(item.price * item.quantity)}</p>
                </div>

                {/* Cuándo llega esta línea */}
                <p className="mt-2 flex items-center gap-1.5 font-body text-[11px] text-text-soft">
                  <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-text-muted" />
                  {lineDeliveryLabel(deliveryOffset, cutoffHour)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Resumen global de tiempos de entrega */}
        {items.length > 0 && (
          <p className="border-t border-border pt-4 font-body text-[12px] leading-relaxed text-text-soft">
            {orderDeliveryLabel(deliveryOffset, cutoffHour)}
          </p>
        )}
      </div>

      {/* Coupon Input */}
      {onApplyCoupon && (
        <div className="mb-6">
          <p className="eyebrow mb-3">Cupón de descuento</p>
          {couponApplied ? (
            <div className="flex items-center justify-between border-l-2 border-success bg-bg-alt px-4 py-3">
              <div>
                <span className="font-body text-sm tracking-[0.08em] text-text">{couponCode}</span>
                <span className="ml-2 font-body text-xs text-success">
                  {couponFreeShipping ? 'Envío gratis' : `-${formatCurrency(couponDiscount)}`}
                </span>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted transition-colors hover:text-error"
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
                className="flex-1 border border-border bg-transparent px-4 py-3 font-body text-sm uppercase tracking-[0.08em] text-text placeholder:text-text-muted focus:border-text focus:outline-none"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="bg-text px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {couponLoading ? '...' : 'Aplicar'}
              </button>
            </div>
          )}
          {couponMessage && !couponApplied && (
            <p className="mt-1.5 font-body text-xs text-error">{couponMessage}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 font-body text-sm">
        <div className="h-px w-full bg-border" />

        <div className="flex justify-between items-center text-text">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between items-center text-success">
            <span>Descuento cupón</span>
            <span>-{formatCurrency(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-text">
          <span>{couponFreeShipping ? 'Envío (gratis)' : 'Envío'}</span>
          <span>{couponFreeShipping ? formatCurrency(0) : formatCurrency(deliveryCost)}</span>
        </div>

        {payphoneSurcharge > 0 && (
          <div className="flex justify-between items-center text-text-muted">
            <span>Recargo Payphone (6%)</span>
            <span>{formatCurrency(payphoneSurcharge)}</span>
          </div>
        )}

        <div className="mt-2 h-px w-full bg-border" />

        <div className="mt-2 flex items-center justify-between text-text">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted">Total</span>
          <span className="font-heading text-2xl">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
