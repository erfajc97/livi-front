import { useState } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { productUrl } from '@/app/helpers/productUrl';
import { CarouselProgressBar } from '@/app/components/UI/CarouselNav';
import type { Product } from '@/app/types/global.types';

/** Productos por página en la lista lateral (desktop) y en la lista móvil. */
const PER_PAGE = 4;
const MOBILE_PER_PAGE = 5;

interface ProductRankingSectionProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  num?: string;
  viewAllHref?: string;
}

const CONCENTRATION_SHORT: Record<string, string> = {
  EAU_DE_PARFUM: 'EDP',
  EAU_DE_TOILETTE: 'EDT',
  EAU_DE_TOILETTE_INTENSE: 'EDT Intense',
  EAU_DE_COLOGNE: 'EDC',
  BODY_MIST: 'Body Mist',
  ELIXIR: 'Elixir',
  PARFUM: 'Parfum',
  EXTRAIT_DE_PARFUM: 'Extrait',
};
const GENDER_LABELS: Record<string, string> = { HOMBRE: 'Hombre', MUJER: 'Mujer', UNISEX: 'Unisex' };
const TIME_LABELS: Record<string, string> = { DIA: 'Día', NOCHE: 'Noche' };

function derive(p: Product) {
  const imgs = (p.images ?? []).map((i: any) => (typeof i === 'string' ? i : i.url)).filter(Boolean);
  const image = imgs[0] || p.image || p.imageUrl;
  const prices = (p.variants ?? []).map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : p.price ?? 0;
  const formatCount = (p.variants?.length ?? 0) || 1;
  const tags = [
    p.gender && (GENDER_LABELS[p.gender] ?? p.gender),
    p.timeOfDay && (TIME_LABELS[p.timeOfDay] ?? p.timeOfDay),
    p.concentration && (CONCENTRATION_SHORT[p.concentration] ?? p.concentration),
  ].filter(Boolean);
  return { image, minPrice, formatCount, tags: tags.join(' · '), href: productUrl(p) };
}

const Arrow = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
  </svg>
);

export default function ProductRankingSection({
  title,
  products,
  isLoading = false,
  num = '02',
  viewAllHref = '/catalogo',
}: ProductRankingSectionProps) {
  // Página actual de la lista (hook antes de cualquier return condicional).
  const [page, setPage] = useState(0);

  if (isLoading) {
    // Esqueleto del layout del ranking: destacado + lista de 4.
    return (
      <section className="bg-bg px-6 py-10 md:px-14 md:py-20" aria-hidden="true">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-6 h-3 w-40 rounded-sm bg-bg-alt md:mb-12" />
          <div className="hidden items-start gap-12 md:grid md:grid-cols-[1.05fr_1fr]">
            <div>
              <div className="aspect-square w-full bg-bg-alt" />
              <div className="mt-6 h-6 w-3/5 rounded-sm bg-bg-alt" />
            </div>
            <div className="flex flex-col">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="grid grid-cols-[40px_120px_1fr] items-center gap-6 border-b border-border py-6 first:border-t">
                  <div className="h-7 w-8 rounded-sm bg-bg-alt" />
                  <div className="h-32 w-full bg-bg-alt" />
                  <div className="h-4 w-2/3 rounded-sm bg-bg-alt" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:hidden">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="grid grid-cols-[28px_84px_1fr] items-center gap-4 border-b border-border py-3.5">
                <div className="h-6 w-6 rounded-sm bg-bg-alt" />
                <div className="h-24 w-full bg-bg-alt" />
                <div className="h-4 w-2/3 rounded-sm bg-bg-alt" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (!products || products.length === 0) return null;

  const top = products[0];
  const t = derive(top);

  // La lista lateral pagina de 4 en 4 (02–05, 06–09, …) con la misma barrita
  // de posición de los carruseles.
  const rest = products.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const list = rest.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);
  const rankAt = (i: number) => String(safePage * PER_PAGE + i + 2).padStart(2, '0');

  // Móvil: misma paginación, incluyendo el #1 en la primera página.
  const mobilePages = Math.max(1, Math.ceil(products.length / MOBILE_PER_PAGE));
  const safeMobilePage = Math.min(page, mobilePages - 1);
  const mobileList = products.slice(
    safeMobilePage * MOBILE_PER_PAGE,
    safeMobilePage * MOBILE_PER_PAGE + MOBILE_PER_PAGE,
  );

  return (
    <section className="bg-bg px-6 py-10 md:px-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header editorial */}
        <div className="mb-6 flex items-baseline justify-between md:mb-12">
          <div className="flex items-baseline gap-4">
            <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-muted">— {num}</span>
            <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-soft md:text-[11px]">{title}</span>
          </div>
          <a href={viewAllHref} className="hidden border-b border-text pb-0.5 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent sm:inline-block">
            Ver el ranking completo
          </a>
        </div>

        {/* ── Desktop: #1 destacado + lista 02–05 ── */}
        <div className="hidden items-start gap-12 md:grid md:grid-cols-[1.05fr_1fr]">
          {/* Featured #1 */}
          <a href={t.href} className="group block">
            <div className="relative aspect-square overflow-hidden bg-surface-raised">
              {t.image && (
                <img src={t.image} alt={top.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
              )}
              <span className="absolute left-6 top-6 bg-black/55 px-3 py-1.5 font-display text-sm italic tracking-wide text-white">
                — Número uno
              </span>
            </div>
            <div className="mt-6 grid grid-cols-[36px_1fr_auto] items-baseline gap-4">
              <span className="font-display text-4xl font-light italic leading-none text-accent">01</span>
              <div>
                {t.tags && <span className="eyebrow">{t.tags}</span>}
                <div className="mt-2 font-display text-3xl font-light leading-none tracking-[-0.01em] text-text">{top.name}</div>
              </div>
              <div className="text-right">
                <div className="font-body text-sm text-text">Desde {formatCurrency(t.minPrice)}</div>
                <div className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">{t.formatCount} formatos</div>
              </div>
            </div>
          </a>

          {/* Lista paginada (02–05, 06–09, …) */}
          <div className="flex flex-col">
            {list.map((p, i) => {
              const d = derive(p);
              return (
                <a key={p.id} href={d.href} className="group grid grid-cols-[40px_120px_1fr_auto] items-center gap-6 border-b border-border py-6 first:border-t">
                  <span className="font-display text-3xl italic leading-none text-accent">{rankAt(i)}</span>
                  <div className="h-32 w-full overflow-hidden bg-surface-raised">
                    {d.image && <img src={d.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
                  </div>
                  <div>
                    {d.tags && <span className="eyebrow">{d.tags}</span>}
                    <div className="mt-1.5 font-display text-[22px] font-light leading-tight text-text">{p.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-body text-[13px] text-text">{formatCurrency(d.minPrice)}</div>
                    <span className="mt-2 ml-auto block w-fit text-text-soft transition-colors group-hover:text-accent"><Arrow /></span>
                  </div>
                </a>
              );
            })}

            {/* Barrita de posición — arrastra para ver los siguientes */}
            <CarouselProgressBar
              snapCount={totalPages}
              selectedIndex={safePage}
              onSelect={setPage}
              className="mt-7"
            />
          </div>
        </div>

        {/* ── Móvil: lista paginada ── */}
        <div className="flex flex-col md:hidden">
          {mobileList.map((p, i) => {
            const d = derive(p);
            const rank = String(safeMobilePage * MOBILE_PER_PAGE + i + 1).padStart(2, '0');
            return (
              <a key={p.id} href={d.href} className="grid grid-cols-[28px_84px_1fr] items-center gap-4 border-b border-border py-3.5">
                <span className="font-display text-2xl italic leading-none text-accent">{rank}</span>
                <div className="h-24 w-full overflow-hidden bg-surface-raised">
                  {d.image && <img src={d.image} alt={p.name} className="h-full w-full object-cover" />}
                </div>
                <div>
                  {d.tags && <span className="eyebrow">{d.tags}</span>}
                  <div className="mt-1 font-display text-lg font-light leading-tight text-text">{p.name}</div>
                  <div className="mt-1 font-body text-[11px] text-text-soft">Desde {formatCurrency(d.minPrice)}</div>
                </div>
              </a>
            );
          })}

          <CarouselProgressBar
            snapCount={mobilePages}
            selectedIndex={safeMobilePage}
            onSelect={setPage}
            className="mt-6"
          />
        </div>
      </div>
    </section>
  );
}
