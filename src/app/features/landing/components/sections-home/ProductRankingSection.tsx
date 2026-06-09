import { formatCurrency } from '@/app/helpers/formatCurrency';
import Loader from '@/app/components/Loader';
import type { Product } from '@/app/types/global.types';

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
  ELIXIR_DE_PARFUM: 'Elixir',
  EAU_DE_COLOGNE: 'EDC',
  BODY_MIST: 'Body Mist',
  PARFUM_EXTRAIT: 'Extrait',
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
  return { image, minPrice, formatCount, tags: tags.join(' · '), href: `/producto/${p.id}` };
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
  if (isLoading) {
    return (
      <section className="bg-bg px-6 py-24 md:px-14">
        <div className="flex items-center justify-center py-20"><Loader size={40} /></div>
      </section>
    );
  }
  if (!products || products.length === 0) return null;

  const top = products[0];
  const list = products.slice(1, 5);
  const t = derive(top);

  return (
    <section className="bg-bg px-6 py-24 md:px-14 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header editorial */}
        <div className="mb-10 flex items-baseline justify-between md:mb-12">
          <div className="flex items-baseline gap-4">
            <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-muted">— {num}</span>
            <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-soft md:text-[11px]">{title}</span>
          </div>
          <a href={viewAllHref} className="hidden border-b border-text pb-0.5 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent sm:inline-block">
            Ver el ranking completo
          </a>
        </div>

        {/* ── Desktop: #1 destacado + lista 02–05 ── */}
        <div className="hidden items-start gap-12 md:grid md:grid-cols-[1.3fr_1fr]">
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
            <div className="mt-7 grid grid-cols-[40px_1fr_auto] items-baseline gap-5">
              <span className="font-display text-5xl font-light italic leading-none text-accent">01</span>
              <div>
                {t.tags && <span className="eyebrow">{t.tags}</span>}
                <div className="mt-2 font-display text-4xl font-light leading-none tracking-[-0.01em] text-text">{top.name}</div>
              </div>
              <div className="text-right">
                <div className="font-body text-sm text-text">Desde {formatCurrency(t.minPrice)}</div>
                <div className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">{t.formatCount} formatos</div>
              </div>
            </div>
          </a>

          {/* Ranked list 02–05 */}
          <div className="flex flex-col">
            {list.map((p, i) => {
              const d = derive(p);
              return (
                <a key={p.id} href={d.href} className="group grid grid-cols-[40px_120px_1fr_auto] items-center gap-6 border-b border-border py-6 first:border-t">
                  <span className="font-display text-3xl italic leading-none text-accent">0{i + 2}</span>
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
          </div>
        </div>

        {/* ── Móvil: lista compacta top 5 ── */}
        <div className="flex flex-col md:hidden">
          {products.slice(0, 5).map((p, i) => {
            const d = derive(p);
            return (
              <a key={p.id} href={d.href} className="grid grid-cols-[28px_84px_1fr] items-center gap-4 border-b border-border py-3.5">
                <span className="font-display text-2xl italic leading-none text-accent">0{i + 1}</span>
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
        </div>
      </div>
    </section>
  );
}
