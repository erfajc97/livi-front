import { useCartPageHook, type CartRow } from '../hooks/useCartPageHook';
import CartLine from './CartLine';
import CartPageSummary from './CartPageSummary';

function GroupHeader({ num, title, meta, dot }: { num: string; title: string; meta: string; dot?: boolean }) {
  return (
    <div className="mb-1 flex items-end justify-between border-b border-border pb-4">
      <div className="flex items-baseline gap-3">
        <span className="font-body text-[10px] italic tracking-[0.1em] text-text-muted">— {num}</span>
        <h2 className="font-display text-2xl font-light text-text">{title}</h2>
      </div>
      <span className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.16em] text-text-muted">
        {dot && <span className="h-[5px] w-[5px] rounded-full bg-accent" />}
        {meta}
      </span>
    </div>
  );
}

export default function CartPage() {
  const {
    immediate,
    bajo,
    immediateSubtotal,
    bajoSubtotal,
    shipping,
    total,
    itemCount,
    removeItem,
    updateQty,
    hasHydrated,
  } = useCartPageHook();

  // Evita parpadeo SSR/hidratación antes de leer localStorage
  if (!hasHydrated) {
    return <div className="min-h-[60vh] bg-bg" />;
  }

  // ── Carrito vacío ──
  if (itemCount === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-[1600px] flex-col items-center justify-center gap-5 px-6 py-16 text-center md:py-24">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-text-muted">
          <path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
        <h1 className="font-display text-4xl font-light text-text">Tu carrito está vacío</h1>
        <p className="max-w-sm font-body text-sm text-text-soft">
          Explora el catálogo y descubre fragancias en stock o curadas bajo pedido.
        </p>
        <a
          href="/catalogo/perfumes"
          className="mt-2 inline-flex items-center gap-2 bg-text px-8 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
        >
          Explorar catálogo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
        </a>
      </section>
    );
  }

  const mixed = immediate.length > 0 && bajo.length > 0;
  const bajoNum = immediate.length > 0 ? '02' : '01';

  const renderRow = (row: CartRow, group: 'immediate' | 'bajo') => (
    <CartLine
      key={`${group}-${row.item.variantId}`}
      row={row}
      group={group}
      onSetTotal={updateQty}
      onRemove={removeItem}
    />
  );

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-8 md:px-12 md:py-20">
      {/* ── Encabezado ── */}
      <header className="mb-7 md:mb-16">
        <span className="eyebrow">— Tu selección</span>
        <h1 className="mt-3 font-display text-5xl font-light leading-none tracking-[-0.025em] text-text md:text-7xl">
          Carrito <span className="italic text-text-soft">({itemCount})</span>
        </h1>
        <p className="mt-4 max-w-xl font-body text-sm text-text-soft">
          {mixed ? (
            <>Tu carrito combina referencias <span className="text-text">en stock</span> y referencias <span className="italic">curadas bajo pedido</span>.</>
          ) : bajo.length > 0 ? (
            <>Todas tus referencias son <span className="italic">curadas bajo pedido</span>.</>
          ) : (
            <>Todas tus referencias están <span className="text-text">en stock</span>, listas para envío.</>
          )}
        </p>
      </header>

      {/* ── Cuerpo: items (izq) + resumen (der) ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-16 xl:gap-24">
        {/* Items agrupados */}
        <div>
          {immediate.length > 0 && (
            <div className="mb-8 md:mb-14">
              <GroupHeader num="01" title="Envío inmediato" meta="Servientrega · 24–72 h" />
              <div>{immediate.map((r) => renderRow(r, 'immediate'))}</div>
            </div>
          )}

          {bajo.length > 0 && (
            <div>
              <GroupHeader num={bajoNum} title="Bajo pedido" meta="Entrega 13–17 días" dot />
              <div>{bajo.map((r) => renderRow(r, 'bajo'))}</div>
              <p className="mt-6 border-l-2 border-accent bg-bg-alt px-4 py-3 font-display text-sm italic text-text-soft">
                Curado exclusivamente para tu pedido. Verificado por NönDecants antes del envío.
              </p>
            </div>
          )}
        </div>

        {/* Resumen sticky */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CartPageSummary
            immediateSubtotal={immediateSubtotal}
            bajoSubtotal={bajoSubtotal}
            shipping={shipping}
            total={total}
            immediateCount={immediate.length}
            bajoCount={bajo.length}
          />
        </aside>
      </div>
    </section>
  );
}
