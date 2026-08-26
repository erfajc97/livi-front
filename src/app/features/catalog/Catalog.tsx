import { useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { useCatalogHook } from './hooks/useCatalogHook';
import { useCategoriesWithMarcasQuery } from '@/app/tanstack-queries/categoriesQuery';
import CatalogBanner from './components/CatalogBanner';
import CatalogFilters from './components/CatalogFilters';
import ProductGrid from './components/ProductGrid';
import CatalogPagination from './components/CatalogPagination';
import CatalogQuickFilters from './components/CatalogQuickFilters';
import CatalogBrandBackorder from './components/CatalogBrandBackorder';
import {
  CATALOG_GENDERS,
  CATALOG_TIME_OF_DAY,
  CATALOG_CONCENTRATIONS,
  CATALOG_PROJECTIONS,
  SORT_OPTIONS,
} from './data';

interface CatalogContentProps {
  tipo?: 'perfumes' | 'combos';
  bajoPedido?: boolean;
  bannerTitle?: string;
  bannerDescription?: string;
  initialCategoryId?: number;
  initialMarcaId?: number;
}

const labelOf = (opts: { value: string; label: string }[], v?: string) =>
  opts.find((o) => o.value === v)?.label ?? v ?? '';

function CatalogContent({
  tipo,
  bajoPedido,
  bannerTitle = 'Perfumes',
  bannerDescription = 'Curamos fragancias de las casas más codiciadas del mundo. Descubre, prueba y colecciona.',
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
    setPriceRange,
    setCategoryId,
    setMarcaId,
    clearFilters,
    showBrandBackorder,
    brandBackorderProducts,
    brandBackorderTotal,
    brandBackorderLoading,
    brandBackorderFetching,
    selectedMarca,
  } = useCatalogHook({ tipo, bajoPedido, initialCategoryId, initialMarcaId });

  const { data: categories = [] } = useCategoriesWithMarcasQuery();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resultCount =
    (pagination?.total ?? products.length) + (showBrandBackorder ? brandBackorderTotal : 0);

  const marcas = Array.from(
    new Map(categories.flatMap((c) => c.marcas).map((m) => [String(m.id), m])).values(),
  );

  // Chips de filtros activos (cada uno se puede quitar)
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.gender)
    activeChips.push({ key: 'gender', label: labelOf(CATALOG_GENDERS, filters.gender), onRemove: () => setGender('') });
  if (filters.timeOfDay)
    activeChips.push({ key: 'time', label: labelOf(CATALOG_TIME_OF_DAY, filters.timeOfDay), onRemove: () => setTimeOfDay('') });
  if (filters.concentration)
    activeChips.push({ key: 'conc', label: labelOf(CATALOG_CONCENTRATIONS, filters.concentration), onRemove: () => setConcentration('') });
  if (filters.projection)
    activeChips.push({ key: 'proj', label: labelOf(CATALOG_PROJECTIONS, filters.projection), onRemove: () => setProjection('') });
  if (filters.maxPrice)
    activeChips.push({ key: 'price', label: `Hasta $${filters.maxPrice}`, onRemove: () => setPriceRange(undefined, undefined) });
  if (filters.search)
    activeChips.push({ key: 'search', label: `“${filters.search}”`, onRemove: () => setSearch('') });
  if (filters.categoryId && filters.categoryId !== initialCategoryId) {
    const cat = categories.find((c) => Number(c.id) === filters.categoryId);
    if (cat) activeChips.push({ key: 'cat', label: cat.name, onRemove: () => setCategoryId(initialCategoryId) });
  }
  if (filters.marcaId && filters.marcaId !== initialMarcaId) {
    const marca = categories.flatMap((c) => c.marcas).find((m) => Number(m.id) === filters.marcaId);
    if (marca) activeChips.push({ key: 'marca', label: marca.name, onRemove: () => setMarcaId(initialMarcaId) });
  }

  // Género/ocasión se eligieron en el panel de filtros (secciones 2 y 3);
  // aquí solo quedan los chips de filtros activos, removibles.

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

  return (
    <div className="bg-bg">
      {/* Banner full-width — reacciona a la categoría/marca SELECCIONADA. */}
      <CatalogBanner
        defaultTitle={bannerTitle}
        defaultDescription={bannerDescription}
        categoryId={filters.categoryId}
        marcaId={filters.marcaId}
      />

      {/* Búsqueda */}
      <div className="border-b border-border px-6 py-4 md:px-14 md:py-6">
        <input
          type="search"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar fragancia o casa…"
          className="w-full max-w-md border-b border-border bg-transparent pb-2 font-body text-sm text-text placeholder:text-text-muted focus:border-text focus:outline-none"
        />
      </div>

      {/* Barra de filtros sticky: activos · conteo · orden */}
      <div className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-14">
          {/* Móvil: Filtros + Género + Marca en UNA fila propia. Los chips
              activos no entran aquí: si no, se pisan al elegir un filtro. */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 bg-text px-3.5 py-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filtros{activeChips.length ? ` (${activeChips.length})` : ''}
            </button>
            <CatalogQuickFilters
              gender={filters.gender}
              onGenderChange={setGender}
              marcaId={filters.marcaId}
              onMarcaChange={setMarcaId}
              marcas={marcas}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className={`items-center gap-1.5 border border-border px-3 py-1.5 font-body text-[11px] tracking-[0.04em] text-text-soft transition-colors hover:border-accent hover:text-accent ${
                  chip.key === 'gender' || chip.key === 'marca'
                    ? 'hidden md:inline-flex'
                    : 'inline-flex'
                }`}
              >
                {chip.label} <span aria-hidden>×</span>
              </button>
            ))}
            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-body text-[10px] uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-text"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="font-body text-xs text-text-soft">
              Mostrando {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
            </span>
            <label className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.18em] text-text">
              Ordenar ·
              <select
                value={sortValue}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer border-0 bg-transparent font-body text-[11px] uppercase tracking-[0.12em] text-text focus:outline-none"
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
      </div>

      {/* Cuerpo: sidebar 260px + grid (full-width) */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border px-8 py-10 md:block">
          {filtersNode}
        </aside>

        {/* Drawer móvil */}
        {filtersOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
            <div className="fixed left-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto bg-bg shadow-2xl md:hidden" role="dialog" aria-label="Filtros">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-bg px-5 py-4">
                <h3 className="font-display text-xl text-text">Filtros</h3>
                <button type="button" onClick={() => setFiltersOpen(false)} className="p-2 text-text-muted transition-colors hover:text-text" aria-label="Cerrar filtros">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="p-5">{filtersNode}</div>
              <div className="sticky bottom-0 border-t border-border bg-bg px-5 py-4">
                <button type="button" onClick={() => setFiltersOpen(false)} className="w-full bg-text py-3.5 font-body text-xs uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent">
                  Ver resultados
                </button>
              </div>
            </div>
          </>
        )}

        <div className="min-w-0 px-6 py-6 md:px-14 md:py-10">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isFetching={isFetching}
            hideEmpty={showBrandBackorder}
          />
          {showBrandBackorder &&
            !isLoading &&
            !brandBackorderLoading &&
            products.length === 0 &&
            brandBackorderProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center md:py-20">
                <p className="font-body text-sm text-text-muted">
                  No se encontraron productos con esos filtros.
                </p>
              </div>
            )}
          {pagination && <CatalogPagination pagination={pagination} onPageChange={setPage} />}
          {showBrandBackorder && (
            <CatalogBrandBackorder
              products={brandBackorderProducts}
              isLoading={brandBackorderLoading}
              isFetching={brandBackorderFetching}
              marcaName={selectedMarca?.name}
              marcaSlug={selectedMarca?.slug}
              total={brandBackorderTotal}
            />
          )}
        </div>
      </div>
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
