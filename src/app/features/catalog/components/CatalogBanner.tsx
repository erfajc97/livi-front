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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div className="relative overflow-hidden rounded-2xl h-52 md:h-64">
        <img
          src={bannerSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
          <img
            src="/box-catalog.svg"
            alt=""
            className="w-12 h-12 md:w-14 md:h-14"
            aria-hidden="true"
          />
          <h1 className="font-heading text-3xl md:text-5xl text-white uppercase tracking-widest">
            {title}
          </h1>
          <p className="text-text-muted text-sm md:text-base tracking-wide">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
