import type { ProductQueryParams, Gender, TimeOfDay, Concentration, Projection } from '@/app/types/global.types';

export interface CatalogFilters {
  search: string;
  inStock: boolean;
  bajoPedido?: boolean;
  categoryId?: number;
  marcaId?: number;
  gender: Gender | '';
  timeOfDay: TimeOfDay | '';
  concentration: Concentration | '';
  projection: Projection | '';
  minPrice?: number;
  maxPrice?: number;
  page: number;
  sortBy: ProductQueryParams['sortBy'];
  order: 'asc' | 'desc';
}
