import { useRawCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';
import type { NavCategory } from '@/app/tanstack-queries/categoriesQuery';

interface CatalogBannerProps {
  defaultTitle: string;
  defaultDescription: string;
  /** Categoría/marca SELECCIONADA (estado del filtro). El banner reacciona a
   *  estos, no a la URL, para que cambie al usar el filtro sin recargar. */
  categoryId?: number;
  marcaId?: number;
}

function useBannerData(
  defaultTitle: string,
  defaultDescription: string,
  categoryId?: number,
  marcaId?: number,
) {
  const { data: categories = [] } = useRawCategoriesQuery();

  if (categoryId == null || categories.length === 0) {
    return { title: defaultTitle, description: defaultDescription, imageUrl: null };
  }

  const category =
    categories.find((c: NavCategory) => Number(c.id) === Number(categoryId)) ?? null;

  if (!category) {
    return { title: defaultTitle, description: defaultDescription, imageUrl: null };
  }

  // Con marca seleccionada, mostrar su nombre e imagen.
  if (marcaId != null) {
    const marca = category.marcas.find((s) => Number(s.id) === Number(marcaId));
    if (marca) {
      return {
        title: marca.name,
        description: `Explora nuestra selección de ${marca.name}`,
        // Imagen de la marca; si no tuviera, cae a la de la categoría.
        imageUrl: marca.imageUrl || category.imageUrl,
      };
    }
  }

  return {
    title: category.name,
    description: category.description || `Explora nuestra selección de ${category.name.toLowerCase()}`,
    imageUrl: category.imageUrl,
  };
}

export default function CatalogBanner({ defaultTitle, defaultDescription, categoryId, marcaId }: CatalogBannerProps) {
  const { title, description, imageUrl } = useBannerData(defaultTitle, defaultDescription, categoryId, marcaId);
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
