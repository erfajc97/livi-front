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

  return (
    <div className="bg-bg min-h-[calc(100vh-80px)]">
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

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
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
          </aside>

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
