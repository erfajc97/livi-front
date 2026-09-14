import type { ProductQueryParams } from '@/app/types/global.types';

export interface CatalogFilters {
  search: string;
  inStock: boolean;
  categoryId?: number;
  marcaId?: number;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  sortBy: ProductQueryParams['sortBy'];
  order: 'asc' | 'desc';
}
