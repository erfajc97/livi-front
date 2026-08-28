import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useMarcaStats } from '../hooks/useMarcaStats';
import {
  useCatalogPageBanner,
  type CatalogBannerSlot,
} from '@/app/tanstack-queries/bannersQuery';
import { useRawCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';
import type { NavCategory, NavMarca } from '@/app/tanstack-queries/categoriesQuery';

interface CatalogBannerProps {
  defaultTitle: string;
  defaultDescription: string;
  categoryId?: number;
  marcaId?: number;
  bannerSlot?: CatalogBannerSlot;
}

function findMarca(
  categories: NavCategory[],
  marcaId: number,
): { marca: NavMarca; category: NavCategory } | null {
  for (const category of categories) {
    const marca = category.marcas.find((item) => Number(item.id) === Number(marcaId));
    if (marca) return { marca, category };
  }
  return null;
}

function StatRow({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="font-body text-[11px] uppercase tracking-[0.16em] text-text-muted">{label}</dt>
      <dd className="font-display text-xl leading-none text-text">{loading ? '—' : value}</dd>
    </div>
  );
}

function marcaSummary(stats: {
  decants: number;
  bajoPedido: number;
  fromPrice: number | null;
  isLoading: boolean;
}) {
  if (stats.isLoading) return '';
  const from = stats.fromPrice != null ? ` desde ${formatCurrency(stats.fromPrice)}` : '';
  const decantBit =
    stats.decants > 0
      ? `${stats.decants} ${stats.decants === 1 ? 'referencia' : 'referencias'} para probar en decant hoy${from}`
      : '';
  const backBit = stats.bajoPedido > 0 ? `${stats.bajoPedido} más por encargo` : '';
  if (decantBit && backBit) return `${decantBit} y ${backBit}.`;
  if (decantBit) return `${decantBit}.`;
  if (stats.bajoPedido > 0) {
    return `${stats.bajoPedido} ${stats.bajoPedido === 1 ? 'referencia' : 'referencias'} por encargo.`;
  }
  return '';
}

export default function CatalogBanner({
  defaultTitle,
  defaultDescription,
  categoryId,
  marcaId,
  bannerSlot,
}: CatalogBannerProps) {
  const { data: categories = [] } = useRawCategoriesQuery();
  const { data: slotBanner } = useCatalogPageBanner(bannerSlot, marcaId == null);
  const stats = useMarcaStats(marcaId);

  const found = marcaId != null ? findMarca(categories, marcaId) : null;
  const category =
    categoryId != null
      ? categories.find((item) => Number(item.id) === Number(categoryId))
      : found?.category;

  const showMarcaHeader = marcaId != null && (categories.length === 0 || found != null);

  if (showMarcaHeader) {
    const title = found?.marca.name ?? defaultTitle;
    const description = found?.marca.description?.trim() ?? '';
    const summary = marcaSummary(stats);

    return (
      <div className="border-b border-border px-6 py-5 md:px-14 md:py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="min-w-0 max-w-2xl">
            {found?.category?.name && (
              <span className="eyebrow">{found.category.name}</span>
            )}
            <h1 className="mt-2 font-display text-4xl font-light italic leading-none text-text sm:text-5xl md:text-6xl">
              {title} en Ecuador
            </h1>
            {summary && (
              <p className="mt-4 font-body text-sm font-medium leading-relaxed text-text md:text-base">
                {summary}
              </p>
            )}
            {description && (
              <p className="mt-3 font-body text-sm leading-relaxed text-text-soft">{description}</p>
            )}
          </div>
          <div className="w-full shrink-0 border border-border bg-surface px-5 py-4 md:max-w-xs">
            <p className="eyebrow">En cifras</p>
            <dl className="mt-1 divide-y divide-border">
              <StatRow label="Referencias" value={String(stats.total)} loading={stats.isLoading} />
              <StatRow label="En decant" value={String(stats.decants)} loading={stats.isLoading} />
              <StatRow label="Por encargo" value={String(stats.bajoPedido)} loading={stats.isLoading} />
              <StatRow
                label="Desde"
                value={stats.fromPrice != null ? formatCurrency(stats.fromPrice) : '—'}
                loading={stats.isLoading}
              />
            </dl>
          </div>
        </div>
      </div>
    );
  }

  const title = category?.name ?? defaultTitle;
  const description =
    category?.description ||
    (category ? `Explora nuestra selección de ${category.name.toLowerCase()}` : defaultDescription);
  const imageUrl = category?.imageUrl || slotBanner?.imageUrl || slotBanner?.image || '/banner-catalog.png';
  const mobileSrc = category?.mobileImageUrl || slotBanner?.mobileImageUrl || null;

  return (
    <div className="relative h-48 w-full overflow-hidden sm:h-60 md:h-72">
      <picture>
        {mobileSrc && <source media="(max-width: 767px)" srcSet={mobileSrc} />}
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.6]"
        />
      </picture>
      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 px-6 py-8 md:px-14 md:py-12">
        <span className="eyebrow text-white/80">Selección curada</span>
        <h1 className="font-display text-4xl font-light italic leading-none text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="max-w-md font-body text-xs tracking-wide text-white/80 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
