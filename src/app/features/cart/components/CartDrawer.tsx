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
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white flex flex-col shadow-2xl"
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="font-heading text-xl font-bold text-black">
            Tu pedido
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-gray-400 hover:text-black transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-gray-300">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p className="text-gray-400 text-sm">Tu carrito está vacío.</p>
              <a
                href="/catalogo"
                onClick={() => setDrawerOpen(false)}
                className="text-accent text-sm font-medium hover:underline"
              >
                Explorar catálogo
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
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
