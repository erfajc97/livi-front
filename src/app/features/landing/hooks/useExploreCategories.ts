import {
  useNormalCategoriesQuery,
  type NavCategory,
  type NavMarca,
} from '@/app/tanstack-queries/categoriesQuery';
import type { ExploreCategoryCard } from '../types';

function editorialHeading(name: string): string {
  return name;
}

function editorialRank(name: string): number {
  const n = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (/panalera|diaper/.test(n)) return 0;
  if (/mochila|backpack/.test(n)) return 1;
  if (/accesorio/.test(n)) return 2;
  return 3;
}

function brandLine(marcas: NavMarca[], max: number, compact: boolean): string {
  const names = marcas.slice(0, max).map((marca) => marca.name).filter(Boolean);
  const rest = Math.max(0, marcas.length - names.length);
  if (names.length === 0) return '';
  if (compact && rest > 0) return `${names.join(', ')} +${rest}`;
  if (rest > 0) return `${names.join(', ')} y ${rest} ${rest === 1 ? 'marca más' : 'marcas más'}.`;
  return `${names.join(', ')}.`;
}

function toCard(category: NavCategory): ExploreCategoryCard {
  return {
    id: category.id,
    // El catálogo resuelve la categoría por slug (?categoria=panaleras).
    href: `/catalogo?categoria=${category.slug ?? category.id}`,
    heading: editorialHeading(category.name),
    imageUrl: category.imageUrl,
    brandLineDesktop: brandLine(category.marcas, 5, false),
    brandLineMobile: brandLine(category.marcas, 4, true),
    marcaCount: category.marcas.length,
  };
}

export function useExploreCategories() {
  const { data: categories = [], isLoading } = useNormalCategoriesQuery();

  const ranked = [...categories].sort(
    (a, b) => editorialRank(a.name) - editorialRank(b.name),
  );
  const cards = ranked.slice(0, 3).map(toCard);

  const uniqueMarcaIds = new Set(
    categories.flatMap((category) => category.marcas.map((marca) => marca.id)),
  );

  return {
    cards,
    isLoading,
    marcaCount: uniqueMarcaIds.size,
  };
}
