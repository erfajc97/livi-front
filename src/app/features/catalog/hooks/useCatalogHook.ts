import { useState, useEffect, useCallback } from 'react';
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery';
import type { CatalogFilters } from '../types';
import type { Gender, TimeOfDay, Concentration, Projection } from '@/app/types/global.types';

export interface UseCatalogHookProps {
  tipo?: 'perfumes' | 'combos';
  bajoPedido?: boolean;
  initialCategoryId?: number;
  initialMarcaId?: number;
}

const LIMIT = 9;

const defaultFilters: CatalogFilters = {
  search: '',
  inStock: false,
  gender: '',
  timeOfDay: '',
  concentration: '',
  projection: '',
  hasDiscount: false,
  page: 1,
  sortBy: 'createdAt',
  order: 'desc',
};

function getUrlParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const catId = params.get('category');
  const subId = params.get('marca');
  return {
    categoryId: catId ? Number(catId) : undefined,
    marcaId: subId ? Number(subId) : undefined,
    search: params.get('search') ?? undefined,
  };
}

export function useCatalogHook({ tipo, bajoPedido, initialCategoryId, initialMarcaId }: UseCatalogHookProps = {}) {
  const urlParams = getUrlParams();
  const catId = initialCategoryId ?? urlParams.categoryId;
  const subId = initialMarcaId ?? urlParams.marcaId;

  const [filters, setFilters] = useState<CatalogFilters>({
    ...defaultFilters,
    search: urlParams.search ?? '',
    categoryId: catId,
    marcaId: subId,
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(filters.maxPrice);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMaxPrice(filters.maxPrice), 300);
    return () => clearTimeout(timer);
  }, [filters.maxPrice]);

  // Vista de categoría ("todas las casas {cat}"): muestra TODOS los productos
  // de esa categoría, estén o no en bajo pedido. Solo el browse general
  // (perfumes / bajo-pedido sin categoría) respeta el flag de la página.
  const effectiveBajoPedido =
    filters.categoryId && !filters.marcaId ? undefined : bajoPedido;

  const queryParams = {
    page: filters.page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    inStock: filters.inStock || undefined,
    bajoPedido: effectiveBajoPedido,
    categoryId: filters.categoryId,
    marcaId: filters.marcaId,
    gender: filters.gender || undefined,
    timeOfDay: filters.timeOfDay || undefined,
    concentration: filters.concentration || undefined,
    projection: filters.projection || undefined,
    hasDiscount: filters.hasDiscount || undefined,
    minPrice: filters.minPrice,
    maxPrice: debouncedMaxPrice,
    sortBy: filters.sortBy,
    sortOrder: filters.order?.toUpperCase() as 'ASC' | 'DESC',
  };

  const { data, isLoading, isFetching } = useProductsQuery({ queryParams });

  const setSearch = useCallback((search: string) => {
    setFilters((f) => ({ ...f, search, page: 1 }));
  }, []);

  const setInStock = useCallback((inStock: boolean) => {
    setFilters((f) => ({ ...f, inStock, page: 1 }));
  }, []);

  const setGender = useCallback((gender: Gender | '') => {
    setFilters((f) => ({ ...f, gender, page: 1 }));
  }, []);

  const setTimeOfDay = useCallback((timeOfDay: TimeOfDay | '') => {
    setFilters((f) => ({ ...f, timeOfDay, page: 1 }));
  }, []);

  const setConcentration = useCallback((concentration: Concentration | '') => {
    setFilters((f) => ({ ...f, concentration, page: 1 }));
  }, []);

  const setProjection = useCallback((projection: Projection | '') => {
    setFilters((f) => ({ ...f, projection, page: 1 }));
  }, []);

  const setHasDiscount = useCallback((hasDiscount: boolean) => {
    setFilters((f) => ({ ...f, hasDiscount, page: 1 }));
  }, []);

  const setPriceRange = useCallback((minPrice?: number, maxPrice?: number) => {
    setFilters((f) => ({ ...f, minPrice, maxPrice, page: 1 }));
  }, []);

  const setCategoryId = useCallback((categoryId?: number) => {
    setFilters((f) => ({ ...f, categoryId, marcaId: undefined, page: 1 }));
  }, []);

  const setMarcaId = useCallback((marcaId?: number) => {
    setFilters((f) => ({ ...f, marcaId, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((f) => ({ ...f, page }));
  }, []);

  const setSort = useCallback((sortValue: string) => {
    const [sortBy, order] = sortValue.split(':') as [
      CatalogFilters['sortBy'],
      CatalogFilters['order'],
    ];
    setFilters((f) => ({
      ...f,
      sortBy: sortBy || 'createdAt',
      order: order || 'desc',
      page: 1,
    }));
  }, []);

  const sortValue = `${filters.sortBy}:${filters.order}`;

  const clearFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      categoryId: initialCategoryId,
      marcaId: initialMarcaId,
    });
  }, [initialCategoryId, initialMarcaId]);

  const hasActiveFilters = !!(
    filters.search || filters.gender ||
    filters.timeOfDay || filters.concentration || filters.projection ||
    filters.hasDiscount || filters.minPrice || filters.maxPrice ||
    (filters.categoryId && filters.categoryId !== catId)
  );

  return {
    filters,
    products: data?.content ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    sortValue,
    hasActiveFilters,
    setSearch,
    setInStock,
    setGender,
    setTimeOfDay,
    setConcentration,
    setProjection,
    setHasDiscount,
    setPriceRange,
    setCategoryId,
    setMarcaId,
    setSort,
    setPage,
    clearFilters,
  };
}
