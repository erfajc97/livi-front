import { useCartHook } from '../hooks/useCartHook';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useCartStore } from '@/app/store/cart/cartStore';

export default function CartDrawer() {
  const { items, total, isDrawerOpen, setDrawerOpen, removeItem, updateQty, hasHydrated } = useCartHook();
  const itemCount = useCartStore((s) => s.itemCount());

  if (!hasHydrated || !isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-bg text-text shadow-2xl"
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-2xl font-normal italic text-text">
            Tu pedido
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-text-muted transition-colors hover:text-text"
            aria-label="Cerrar carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-text-muted">
                <path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
              </svg>
              <p className="text-sm text-text-soft">Tu carrito está vacío.</p>
              <a
                href="/catalogo/perfumes"
                onClick={() => setDrawerOpen(false)}
                className="font-body text-[11px] uppercase tracking-[0.2em] text-accent hover:text-text"
              >
                Explorar catálogo →
              </a>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.some((i) => i.bajoPedido) && (
                <div className="my-3 flex items-start gap-2 border border-accent/40 bg-surface-raised px-3 py-2.5">
                  <span className="mt-0.5 h-[6px] w-[6px] shrink-0 rounded-full bg-accent" />
                  <p className="text-xs leading-snug text-text-soft">
                    Tu pedido incluye productos <span className="text-accent">bajo pedido</span>. Demora estimada: ~2 semanas tras confirmación del pago.
                  </p>
                </div>
              )}
              {items.map((item) => (
                <CartItem
                  key={item.variantId}
                  item={item}
                  onRemove={removeItem}
                  onQtyChange={updateQty}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <CartSummary
            total={total}
            itemCount={itemCount}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </div>
    </>
  );
}
