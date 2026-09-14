import { useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { useCatalogHook } from './hooks/useCatalogHook';
import {
  useCategoriesWithMarcasQuery,
  sortCategoriesByHierarchy,
} from '@/app/tanstack-queries/categoriesQuery';
import type { CatalogBannerSlot } from '@/app/tanstack-queries/bannersQuery';
import CatalogBanner from './components/CatalogBanner';
import CatalogFilters from './components/CatalogFilters';
import ProductGrid from './components/ProductGrid';
import CatalogPagination from './components/CatalogPagination';
import { SORT_OPTIONS } from './data';

interface CatalogContentProps {
  bannerTitle?: string;
  bannerDescription?: string;
  bannerSlot?: CatalogBannerSlot;
  initialCategoryId?: number;
  initialMarcaId?: number;
}

function LoadMoreButton({
  onPress,
  isFetching,
}: {
  onPress: () => void;
  isFetching: boolean;
}) {
  return (
    <div className="mt-10 flex justify-center border-t border-border pt-6">
      <button
        type="button"
        onClick={onPress}
        disabled={isFetching}
        className="bg-text px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-bg transition-colors hover:bg-accent disabled:opacity-40"
      >
        {isFetching ? 'Cargando…' : 'Ver más'}
      </button>
    </div>
  );
}

function CatalogContent({
  bannerTitle = 'Tienda',
  bannerDescription = 'Piezas propias, producidas en Ecuador. Empezamos con pocas y bien resueltas.',
  bannerSlot,
  initialCategoryId,
  initialMarcaId,
}: CatalogContentProps) {
  const {
    filters,
    products,
    pagination,
    isLoading,
    isFetching,
    sortValue,
    hasActiveFilters,
    isBrandView,
    hasMore,
    loadMore,
    setSearch,
    setSort,
    setPage,
    setPriceRange,
    setCategoryId,
    setMarcaId,
    clearFilters,
  } = useCatalogHook({ initialCategoryId, initialMarcaId });

  const { data: categories = [] } = useCategoriesWithMarcasQuery();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resultCount = pagination?.total ?? products.length;
  const tabs = sortCategoriesByHierarchy(
    categories.filter((c) => c.name.toLowerCase() !== 'all'),
  );

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.maxPrice)
    activeChips.push({ key: 'price', label: `Hasta $${filters.maxPrice}`, onRemove: () => setPriceRange(undefined, undefined) });
  if (filters.search)
    activeChips.push({ key: 'search', label: `“${filters.search}”`, onRemove: () => setSearch('') });
  if (filters.marcaId && filters.marcaId !== initialMarcaId) {
    const marca = categories.flatMap((c) => c.marcas).find((m) => Number(m.id) === filters.marcaId);
    if (marca) activeChips.push({ key: 'marca', label: marca.name, onRemove: () => setMarcaId(initialMarcaId) });
  }

  const filtersNode = (
    <CatalogFilters
      minPrice={filters.minPrice}
      maxPrice={filters.maxPrice}
      onPriceRangeChange={setPriceRange}
      categoryId={filters.categoryId}
      onCategoryChange={setCategoryId}
      marcaId={filters.marcaId}
      onMarcaChange={setMarcaId}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    />
  );

  const productBlock = (
    <>
      <ProductGrid
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
      />
      {isBrandView && hasMore && <LoadMoreButton onPress={loadMore} isFetching={isFetching} />}
      {!isBrandView && pagination && <CatalogPagination pagination={pagination} onPageChange={setPage} />}
    </>
  );

  const tabCls = (active: boolean) =>
    `font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-accent ${
      active ? 'text-text underline decoration-2 underline-offset-8' : 'text-text-muted'
    }`;

  return (
    <div className="bg-bg">
      <CatalogBanner
        defaultTitle={bannerTitle}
        defaultDescription={bannerDescription}
        categoryId={filters.categoryId}
        marcaId={filters.marcaId}
        bannerSlot={bannerSlot}
      />

      {isBrandView ? (
        <div className="px-6 py-6 md:px-14 md:py-10">
          <button
            type="button"
            onClick={clearFilters}
            className="mb-8 inline-flex items-center gap-2 border-b border-border pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Volver a la tienda
          </button>

          {productBlock}
        </div>
      ) : (
        <>
          {/* Tabs de categoría + conteo + orden (ref. PDF Tienda) */}
          <div className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 md:px-14">
              <nav className="flex flex-wrap items-center gap-6" aria-label="Categorías">
                <button type="button" onClick={() => setCategoryId(undefined)} className={tabCls(filters.categoryId == null)}>
                  Todo
                </button>
                {tabs.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(filters.categoryId === Number(c.id) ? undefined : Number(c.id))}
                    className={tabCls(filters.categoryId === Number(c.id))}
                  >
                    {c.name}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  {resultCount} {resultCount === 1 ? 'pieza' : 'piezas'}
                </span>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:text-accent"
                >
                  Filtros{activeChips.length ? ` (${activeChips.length})` : ''}
                </button>
                <label className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted sm:inline-flex">
                  Ordenar por:
                  <select
                    value={sortValue}
                    onChange={(e) => setSort(e.target.value)}
                    className="cursor-pointer border-0 bg-transparent font-mono text-[11px] uppercase tracking-[0.18em] text-text focus:outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-3 md:px-14">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-[11px] tracking-[0.04em] text-text-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {chip.label} <span aria-hidden>×</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-text"
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>

          {/* Drawer de filtros (precio, etc.) — todos los tamaños */}
          {filtersOpen && (
            <>
              <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
              <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto bg-bg shadow-2xl" role="dialog" aria-label="Filtros">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-bg px-5 py-4">
                  <h3 className="font-heading text-xl text-text">Filtros</h3>
                  <button type="button" onClick={() => setFiltersOpen(false)} className="p-2 text-text-muted transition-colors hover:text-text" aria-label="Cerrar filtros">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <div className="p-5">{filtersNode}</div>
                <div className="sticky bottom-0 border-t border-border bg-bg px-5 py-4">
                  <button type="button" onClick={() => setFiltersOpen(false)} className="w-full bg-accent py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-bg transition-colors hover:bg-accent-hover">
                    Ver resultados
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="px-6 py-8 md:px-14 md:py-12">{productBlock}</div>
        </>
      )}
    </div>
  );
}

export default function Catalog(props: CatalogContentProps) {
  return (
    <AppProviders>
      <CatalogContent {...props} />
    </AppProviders>
  );
}
