import { useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { useCatalogHook } from './hooks/useCatalogHook';
import CatalogBanner from './components/CatalogBanner';
import CatalogSearchBar from './components/CatalogSearchBar';
import CatalogFilters from './components/CatalogFilters';
import ProductGrid from './components/ProductGrid';
import CatalogPagination from './components/CatalogPagination';

interface CatalogContentProps {
  tipo?: 'perfumes' | 'combos';
  bajoPedido?: boolean;
  bannerTitle?: string;
  bannerDescription?: string;
  initialCategoryId?: number;
  initialMarcaId?: number;
}

function CatalogContent({
  tipo,
  bajoPedido,
  bannerTitle = 'Perfumes',
  bannerDescription = 'Aquí encontrarás todos los perfumes de Marcas',
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
    setSearch,
    setSort,
    setPage,
    setGender,
    setTimeOfDay,
    setConcentration,
    setProjection,
    setHasDiscount,
    setPriceRange,
    setCategoryId,
    clearFilters,
  } = useCatalogHook({ tipo, bajoPedido, initialCategoryId, initialMarcaId });

  const hideCategories = !!filters.marcaId;
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtersNode = (
    <CatalogFilters
      gender={filters.gender}
      onGenderChange={setGender}
      timeOfDay={filters.timeOfDay}
      onTimeOfDayChange={setTimeOfDay}
      concentration={filters.concentration}
      onConcentrationChange={setConcentration}
      projection={filters.projection}
      onProjectionChange={setProjection}
      hasDiscount={filters.hasDiscount}
      onHasDiscountChange={setHasDiscount}
      minPrice={filters.minPrice}
      maxPrice={filters.maxPrice}
      onPriceRangeChange={setPriceRange}
      categoryId={filters.categoryId}
      onCategoryChange={setCategoryId}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
      hideCategories={hideCategories}
    />
  );

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <CatalogBanner
        defaultTitle={bannerTitle}
        defaultDescription={bannerDescription}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CatalogSearchBar
          searchValue={filters.search}
          onSearchChange={setSearch}
          sortValue={sortValue}
          onSortChange={setSort}
        />

        {/* Mobile filter toggle button */}
        <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border-2 border-black bg-white text-black font-heading text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-accent text-white text-[10px] font-bold">
                ●
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            {filtersNode}
          </aside>

          {/* Mobile drawer */}
          {filtersOpen && (
            <>
              <div
                className="lg:hidden fixed inset-0 z-50 bg-black/50"
                onClick={() => setFiltersOpen(false)}
                aria-hidden="true"
              />
              <div
                className="lg:hidden fixed top-0 left-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
                role="dialog"
                aria-label="Filtros"
              >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-200 bg-white">
                  <h3 className="font-heading text-lg font-bold text-black">Filtros</h3>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="p-2 text-gray-500 hover:text-black transition-colors"
                    aria-label="Cerrar filtros"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="p-5">
                  {filtersNode}
                </div>
                <div className="sticky bottom-0 px-5 py-4 border-t border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="w-full py-3 rounded-full bg-black text-white font-heading text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Ver resultados
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isFetching={isFetching}
            />
            {pagination && (
              <CatalogPagination
                pagination={pagination}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalog({
  tipo,
  bajoPedido,
  bannerTitle,
  bannerDescription,
  initialCategoryId,
  initialMarcaId,
}: CatalogContentProps) {
  return (
    <AppProviders>
      <CatalogContent
        tipo={tipo}
        bajoPedido={bajoPedido}
        bannerTitle={bannerTitle}
        bannerDescription={bannerDescription}
        initialCategoryId={initialCategoryId}
        initialMarcaId={initialMarcaId}
      />
    </AppProviders>
  );
}
