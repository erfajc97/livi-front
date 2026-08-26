import {
  useNormalCategoriesQuery,
  type NavCategory,
  type NavMarca,
} from '@/app/tanstack-queries/categoriesQuery';
import type { ExploreCategoryCard } from '../types';

function editorialHeading(name: string): string {
  const n = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/arab/.test(n)) return 'Perfumes árabes';
  if (/nicho|niche/.test(n)) return 'Perfumes nicho';
  if (/disenador|designer/.test(n)) return 'Perfumes de diseñador';
  return name;
}

function editorialRank(name: string): number {
  const n = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/arab/.test(n)) return 0;
  if (/nicho|niche/.test(n)) return 1;
  if (/disenador|designer/.test(n)) return 2;
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
    href: `/catalogo/perfumes?category=${category.id}`,
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
