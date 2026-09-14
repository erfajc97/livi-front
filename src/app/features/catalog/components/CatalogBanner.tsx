import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useMarcaStats } from '../hooks/useMarcaStats';
import type { CatalogBannerSlot } from '@/app/tanstack-queries/bannersQuery';
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
  total: number;
  fromPrice: number | null;
  isLoading: boolean;
}) {
  if (stats.isLoading) return '';
  const from = stats.fromPrice != null ? ` desde ${formatCurrency(stats.fromPrice)}` : '';
  if (stats.total > 0) {
    return `${stats.total} ${stats.total === 1 ? 'referencia disponible' : 'referencias disponibles'}${from}.`;
  }
  return '';
}

export default function CatalogBanner({
  defaultTitle,
  defaultDescription,
  categoryId,
  marcaId,
}: CatalogBannerProps) {
  const { data: categories = [] } = useRawCategoriesQuery();
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

  // Cabecera editorial LIVI (ref. PDF): serif grande, sin foto de fondo.
  return (
    <div className="border-b border-border px-6 pb-8 pt-10 md:px-14 md:pb-10 md:pt-14">
      <h1 className="font-heading text-5xl font-normal leading-none text-text sm:text-6xl md:text-7xl">
        {title}
      </h1>
      <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-text-soft md:text-base">
        {description}
      </p>
    </div>
  );
}
