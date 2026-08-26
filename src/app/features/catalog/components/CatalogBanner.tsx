import { useRawCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';
import type { NavCategory, NavMarca } from '@/app/tanstack-queries/categoriesQuery';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useMarcaStats } from '../hooks/useMarcaStats';

interface CatalogBannerProps {
  defaultTitle: string;
  defaultDescription: string;
  categoryId?: number;
  marcaId?: number;
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

function StatCell({
  label,
  value,
  loading,
  valueClassName,
}: {
  label: string;
  value: string;
  loading: boolean;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="font-body text-[11px] text-text-muted">{label}</p>
      <p className={`mt-0.5 font-display text-[22px] leading-none ${valueClassName ?? 'text-text'}`}>
        {loading ? '—' : value}
      </p>
    </div>
  );
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
    return (
      <div className="border-b border-border px-6 py-8 md:px-14 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="min-w-0 max-w-2xl">
            <span className="eyebrow">Selección curada</span>
            <h1 className="mt-3 font-display text-4xl font-light italic leading-none text-text sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-text-soft">
              Explora nuestra selección de {title}
            </p>
          </div>
          <div className="w-full shrink-0 border border-border bg-bg p-5 md:max-w-xs">
            <span className="eyebrow">En cifras</span>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <StatCell label="Referencias" value={String(stats.total)} loading={stats.isLoading} />
              <StatCell
                label="En decant"
                value={String(stats.decants)}
                loading={stats.isLoading}
                valueClassName="text-success"
              />
              <StatCell
                label="Por encargo"
                value={String(stats.bajoPedido)}
                loading={stats.isLoading}
                valueClassName="text-warning"
              />
              <StatCell
                label="Desde"
                value={stats.fromPrice != null ? formatCurrency(stats.fromPrice) : '—'}
                loading={stats.isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const title = category?.name ?? defaultTitle;
  const description =
    category?.description ||
    (category ? `Explora nuestra selección de ${category.name.toLowerCase()}` : defaultDescription);
  const imageUrl = category?.imageUrl || '/banner-catalog.png';
  const mobileSrc = category?.mobileImageUrl || null;

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
