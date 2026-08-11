import { useState, useEffect, useCallback } from 'react';
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery';
import { useRawCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';
import type { CatalogFilters } from '../types';
import type { Gender, TimeOfDay, Concentration, Projection } from '@/app/types/global.types';

export interface UseCatalogHookProps {
  tipo?: 'perfumes' | 'combos';
  bajoPedido?: boolean;
  initialCategoryId?: number;
  initialMarcaId?: number;
}

// REQ-059: máximo 8 por página — filas completas en el grid de 4 columnas
// (con 9 la última fila quedaba con hueco).
const LIMIT = 8;

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

/**
 * REQ-058 — URLs legibles con slugs: `?categoria=arabes&marca=giorgio-armani`.
 * Se ACEPTAN los formatos viejo (`category=3&marca=3`, IDs numéricos) y nuevo
 * (`categoria=<slug>&marca=<slug>`); la API sigue recibiendo IDs — el slug se
 * resuelve a id en front con las categorías/marcas ya cargadas, y la URL se
 * reescribe con slugs vía history.replaceState.
 */
const normalizeSlug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const matchesSlug = (item: { name: string; slug: string }, value: string) => {
  const v = normalizeSlug(value);
  return normalizeSlug(item.slug) === v || normalizeSlug(item.name) === v.replace(/-/g, ' ');
};

function getUrlParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');
  const marcaParam = params.get('marca');
  const desc = params.get('descuento');
  return {
    // Formato viejo: IDs numéricos (los menús aún pueden generarlos).
    categoryId: categoryParam && /^\d+$/.test(categoryParam) ? Number(categoryParam) : undefined,
    marcaId: marcaParam && /^\d+$/.test(marcaParam) ? Number(marcaParam) : undefined,
    // Formato nuevo: slugs. `marca` también acepta slug (además de id legado).
    categorySlug: params.get('categoria') ?? undefined,
    marcaSlug: marcaParam && !/^\d+$/.test(marcaParam) ? marcaParam : undefined,
    search: params.get('search') ?? undefined,
    hasDiscount: desc === '1' || desc === 'true' ? true : undefined,
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
    hasDiscount: urlParams.hasDiscount ?? false,
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(filters.maxPrice);

  // Slugs pendientes de resolver (llegan por URL; se resuelven a IDs cuando
  // cargan las categorías). Con IDs numéricos no hay nada pendiente.
  const [pendingSlugs] = useState(() => ({
    categoria: initialCategoryId == null ? urlParams.categorySlug : undefined,
    marca: initialMarcaId == null && urlParams.marcaId == null ? urlParams.marcaSlug : undefined,
  }));
  const [slugsResolved, setSlugsResolved] = useState(!pendingSlugs.categoria && !pendingSlugs.marca);

  const { data: rawCategories = [] } = useRawCategoriesQuery();

  // Resolver slugs de la URL → IDs (una sola vez, al cargar las categorías).
  useEffect(() => {
    if (slugsResolved || rawCategories.length === 0) return;
    let categoryId: number | undefined;
    let marcaId: number | undefined;
    if (pendingSlugs.categoria) {
      const cat = rawCategories.find((c) => matchesSlug(c, pendingSlugs.categoria!));
      if (cat) categoryId = Number(cat.id);
    }
    if (pendingSlugs.marca) {
      const pool = categoryId != null
        ? rawCategories.filter((c) => Number(c.id) === categoryId)
        : rawCategories;
      for (const c of pool) {
        const m = c.marcas.find((marca) => matchesSlug(marca, pendingSlugs.marca!));
        if (m) {
          marcaId = Number(m.id);
          // Marca sola (sin categoría en la URL): se filtra solo por marca,
          // igual que el formato viejo `?marca=3`.
          if (pendingSlugs.categoria && categoryId == null) categoryId = Number(c.id);
          break;
        }
      }
    }
    setFilters((f) => ({
      ...f,
      categoryId: categoryId ?? f.categoryId,
      marcaId: marcaId ?? f.marcaId,
      page: 1,
    }));
    setSlugsResolved(true);
  }, [slugsResolved, rawCategories, pendingSlugs]);

  // Reescribir la URL con slugs legibles al cambiar categoría/marca (o cuando
  // llega en formato viejo con IDs). Conserva los demás params (search, etc.).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!slugsResolved || rawCategories.length === 0) return;
    const cat = filters.categoryId != null
      ? rawCategories.find((c) => Number(c.id) === filters.categoryId)
      : undefined;
    const marca = filters.marcaId != null
      ? rawCategories.flatMap((c) => c.marcas).find((m) => Number(m.id) === filters.marcaId)
      : undefined;
    const params = new URLSearchParams(window.location.search);
    params.delete('category');
    if (cat) params.set('categoria', cat.slug);
    else params.delete('categoria');
    if (marca) params.set('marca', marca.slug);
    else params.delete('marca');
    if (filters.hasDiscount) params.set('descuento', '1');
    else params.delete('descuento');
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [filters.categoryId, filters.marcaId, filters.hasDiscount, rawCategories, slugsResolved]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMaxPrice(filters.maxPrice), 300);
    return () => clearTimeout(timer);
  }, [filters.maxPrice]);

  // El flag de la página (bajoPedido={true} en /bajo-pedido, ={false} en
  // /catalogo/perfumes) SIEMPRE se respeta, incluso al navegar a una casa
  // (marca) o categoría. Así la sección "Bajo Pedido" muestra solo bajo
  // pedido y "Perfumes" solo stock, en cualquier nivel de navegación.
  const queryParams = {
    page: filters.page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    inStock: filters.inStock || undefined,
    bajoPedido,
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
