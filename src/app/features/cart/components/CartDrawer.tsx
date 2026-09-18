import { useEffect } from 'react';
import { useCartStore } from '@/app/store/cart/cartStore';
import { formatCurrency } from '@/app/helpers/formatCurrency';

/**
 * Carrito drawer LIVI (ref. PDF carrito): panel lateral de 440 px que entra
 * desde la derecha en ~260 ms. "Tu carrito", líneas con color y stepper,
 * envoltura de regalo incluida, subtotal con envío calculado en el checkout
 * y CTA burgundy. La página /carrito sigue existiendo como vista completa.
 */
export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.isDrawerOpen);
  const setOpen = useCartStore((s) => s.setDrawerOpen);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  if (!open) return null;

  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-label="Tu carrito">
      {/* Overlay */}
      <div className="absolute inset-0 bg-negro/40" onClick={close} aria-hidden="true" />

      {/* Panel — 440 px, entra desde la derecha */}
      <aside className="cart-drawer-panel absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-border bg-bg text-text">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-heading text-2xl font-normal text-text">Tu carrito</h2>
          <button onClick={close} aria-label="Cerrar carrito" className="p-1 text-text-muted transition-colors hover:text-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Líneas */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <img src="/caballito-burgundy.png" alt="" width="38" height="31" className="h-[31px] w-[38px] object-contain" aria-hidden="true" />
              <p className="font-heading text-xl text-text">Tu carrito está vacío</p>
              <button
                onClick={close}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:text-text"
              >
                Explorar la tienda
              </button>
            </div>
          ) : (
            items.map((item) => {
              const plusDisabled = item.maxQty != null && item.quantity >= item.maxQty;
              return (
                <div key={item.variantId} className="flex gap-4 border-b border-border py-5">
                  {/* Thumb */}
                  <div className="h-24 w-20 shrink-0 overflow-hidden bg-bg-alt">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-body text-sm font-medium leading-snug text-text">{item.name}</h3>
                      <span className="shrink-0 font-body text-sm text-text">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    {item.variationName && (
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                        Color · {item.variationName}
                        {item.size ? ` — Talla · ${item.size}` : ''}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border">
                        <button
                          onClick={() => updateQty(item.variantId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-text-muted transition-colors hover:text-text"
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <span className="flex h-7 w-8 select-none items-center justify-center font-body text-xs text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => !plusDisabled && updateQty(item.variantId, item.quantity + 1)}
                          disabled={plusDisabled}
                          className="flex h-7 w-7 items-center justify-center text-text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="font-mono text-[10px] uppercase tracking-[0.20em] text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer del drawer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="inline-block h-3.5 w-3.5 shrink-0 bg-accent" aria-hidden="true" />
              <span className="font-body text-xs text-text-soft">Añadir envoltura de regalo LIVI — incluida</span>
            </div>

            <div className="flex items-end justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.20em] text-text">Subtotal</span>
              <span className="font-heading text-2xl text-accent">{formatCurrency(subtotal)}</span>
            </div>
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
              Envío calculado en el checkout
            </p>

            <a
              href="/checkout"
              className="mt-4 flex w-full items-center justify-center bg-accent py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-bg transition-colors hover:bg-accent-hover"
            >
              Finalizar compra
            </a>
            <button
              onClick={close}
              className="mt-3 w-full text-center font-body text-xs italic text-text-muted transition-colors hover:text-text"
            >
              o seguir viendo la colección
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
