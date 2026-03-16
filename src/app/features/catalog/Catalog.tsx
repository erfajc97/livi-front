import AppProviders from '@/app/providers/AppProviders';
import { useCatalogHook } from './hooks/useCatalogHook';
import CatalogSearchBar from './components/CatalogSearchBar';
import CatalogFilters from './components/CatalogFilters';
import ProductGrid from './components/ProductGrid';
import CatalogPagination from './components/CatalogPagination';

interface CatalogContentProps {
  tipo?: 'perfumes' | 'combos';
}

function CatalogContent({ tipo }: CatalogContentProps) {
  const {
    filters,
    products,
    pagination,
    isLoading,
    isFetching,
    sortValue,
    setSearch,
    setType,
    setSort,
    setPage,
  } = useCatalogHook({ tipo });

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Search + Sort */}
      <CatalogSearchBar
        searchValue={filters.search}
        onSearchChange={setSearch}
        sortValue={sortValue}
        onSortChange={setSort}
      />

      {/* Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <CatalogFilters
            selectedType={filters.type}
            onTypeChange={setType}
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

export default function Catalog({ tipo }: CatalogContentProps) {
  return (
    <AppProviders>
      <CatalogContent tipo={tipo} />
    </AppProviders>
  );
}
