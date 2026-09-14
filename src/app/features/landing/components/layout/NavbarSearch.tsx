import { useState, useEffect, useRef } from 'react';
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { productUrl } from '@/app/helpers/productUrl';
import type { Product } from '@/app/types/global.types';

const SearchIcon = ({ className = 'h-[18px] w-[18px]' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
  </svg>
);

const minPriceOf = (p: Product) => {
  const prices = (p.variants ?? []).map((v) => v.price).filter((n) => n > 0);
  return prices.length ? Math.min(...prices) : (p.price ?? 0);
};

export default function NavbarSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const active = debounced.length >= 2;
  const { data, isFetching } = useProductsQuery({
    queryParams: { search: debounced, limit: 6 },
    enabled: open && active,
  });
  const results = data?.content ?? [];

  const close = () => { setOpen(false); };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-accent md:block"
        aria-label="Buscar"
      >
        Buscar
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40" onClick={close}>
          <div className="w-full border-b border-border bg-bg" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto max-w-3xl px-6 py-6 md:px-8 md:py-8">
              {/* Input — título serif + línea fina (ref. PDF búsqueda D) */}
              <div className="flex items-center gap-4 border-b border-text pb-3 text-text">
                <SearchIcon className="h-5 w-5 text-text-muted" />
                <input
                  ref={inputRef}
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar"
                  aria-label="Buscar"
                  className="flex-1 bg-transparent font-heading text-2xl font-normal text-text placeholder:text-text-muted focus:outline-none md:text-3xl"
                />
                <button onClick={close} aria-label="Cerrar" className="p-1 text-text-muted transition-colors hover:text-text">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              {/* Resultados */}
              <div className="mt-2 max-h-[62vh] overflow-y-auto">
                {!active ? (
                  <div className="px-1 py-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">Sugerencias</p>
                    <div className="mt-3 flex flex-col">
                      {['Tote espresso', 'Mochila negra', 'Pañaleras', 'Accesorios'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setQ(s)}
                          className="border-b border-border/60 py-3 text-left font-body text-sm font-medium text-text transition-colors hover:text-accent"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : isFetching && results.length === 0 ? (
                  <p className="px-1 py-6 font-body text-sm text-text-muted">Buscando…</p>
                ) : results.length === 0 ? (
                  <p className="px-1 py-6 font-body text-sm text-text-muted">Sin resultados para “{debounced}”.</p>
                ) : (
                  <>
                    <p className="px-1 pt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">Sugerencias</p>
                    {results.map((p) => (
                      <a
                        key={p.id}
                        href={productUrl(p)}
                        onClick={close}
                        className="flex items-center gap-4 border-b border-border/60 px-1 py-3 transition-colors hover:bg-bg-alt"
                      >
                        <div className="h-14 w-12 shrink-0 overflow-hidden bg-bg-alt">
                          {p.image ? (
                            <img src={p.image} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-base text-text">{p.name}</p>
                          <p className="font-body text-[10px] uppercase tracking-[0.16em] text-text-muted">
                            {'En stock'}
                          </p>
                        </div>
                        <span className="shrink-0 font-body text-sm text-text-soft">Desde {formatCurrency(minPriceOf(p))}</span>
                      </a>
                    ))}
                    <a
                      href={`/catalogo?search=${encodeURIComponent(debounced)}`}
                      onClick={close}
                      className="block px-1 py-4 font-body text-[11px] uppercase tracking-[0.18em] text-accent transition-colors hover:text-text"
                    >
                      Ver todos los resultados →
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
