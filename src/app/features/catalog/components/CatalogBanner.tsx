import { useCategoriesWithMarcasQuery } from '@/app/tanstack-queries/categoriesQuery';
import type { NavCategory } from '@/app/tanstack-queries/categoriesQuery';

interface CatalogBannerProps {
  defaultTitle: string;
  defaultDescription: string;
}

function useBannerData(defaultTitle: string, defaultDescription: string) {
  const isClient = typeof window !== 'undefined';
  const params = isClient ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const categoryId = params.get('category');
  const marcaId = params.get('marca');

  const { data: categories = [] } = useCategoriesWithMarcasQuery();

  if (!categoryId || categories.length === 0) {
    return { title: defaultTitle, description: defaultDescription, imageUrl: null };
  }

  const category = categories.find((c: NavCategory) => c.id === categoryId) ?? null;

  if (!category) {
    return { title: defaultTitle, description: defaultDescription, imageUrl: null };
  }

  // When a marca is selected, show its name and image
  if (marcaId) {
    const marca = category.marcas.find((s) => s.id === marcaId);
    if (marca) {
      return {
        title: marca.name,
        description: `Explora nuestra selección de ${marca.name}`,
        imageUrl: marca.imageUrl,
      };
    }
  }

  return {
    title: category.name,
    description: category.description || `Explora nuestra selección de ${category.name.toLowerCase()}`,
    imageUrl: category.imageUrl,
  };
}

export default function CatalogBanner({ defaultTitle, defaultDescription }: CatalogBannerProps) {
  const { title, description, imageUrl } = useBannerData(defaultTitle, defaultDescription);
  const bannerSrc = imageUrl || '/banner-catalog.png';

  return (
    /* Banner-strip: alto moderado en todos los breakpoints (antes quedaba
       demasiado alto y "desbordaba" la vista). */
    <div className="relative h-48 w-full overflow-hidden sm:h-60 md:h-72">
      <img
        src={bannerSrc}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.6]"
      />
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
