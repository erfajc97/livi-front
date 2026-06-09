import {
  CATALOG_CONCENTRATIONS,
  CATALOG_PROJECTIONS,
} from '../data';
import FilterPillGroup from './FilterPillGroup';
import FilterPriceRange from './FilterPriceRange';
import { useCategoriesWithMarcasQuery } from '@/app/tanstack-queries/categoriesQuery';
import type { Concentration, Projection } from '@/app/types/global.types';

interface CatalogFiltersProps {
  concentration: Concentration | '';
  onConcentrationChange: (v: Concentration | '') => void;
  projection: Projection | '';
  onProjectionChange: (v: Projection | '') => void;
  hasDiscount: boolean;
  onHasDiscountChange: (v: boolean) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceRangeChange: (min?: number, max?: number) => void;
  categoryId?: number;
  onCategoryChange: (v?: number) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  hideCategories?: boolean;
}

const selectClass =
  'w-full border border-border px-3 py-2.5 text-sm text-text bg-surface focus:border-text focus:outline-none transition-colors appearance-none cursor-pointer';

export default function CatalogFilters({
  concentration,
  onConcentrationChange,
  projection,
  onProjectionChange,
  hasDiscount,
  onHasDiscountChange,
  maxPrice,
  onPriceRangeChange,
  categoryId,
  onCategoryChange,
  hasActiveFilters,
  onClearFilters,
  hideCategories,
}: CatalogFiltersProps) {
  const { data: categories = [] } = useCategoriesWithMarcasQuery();
  const filteredCategories = categories.filter((c) => c.name.toLowerCase() !== 'all');

  return (
    <div className="space-y-9">
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="font-body text-[10px] uppercase tracking-[0.18em] text-text-muted hover:text-text transition-colors border-b border-border pb-0.5"
        >
          Limpiar filtros
        </button>
      )}

      {/* Categorías — select */}
      {!hideCategories && filteredCategories.length > 0 && (
        <div>
          <p className="eyebrow mb-3">Categoría</p>
          <select
            value={categoryId ?? ''}
            onChange={(e) =>
              onCategoryChange(e.target.value ? Number(e.target.value) : undefined)
            }
            className={selectClass}
          >
            <option value="">Todas las categorías</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Género y Hora del día viven en los chips rápidos de arriba (no duplicar) */}

      {/* Concentración — radio buttons */}
      <div>
        <p className="eyebrow mb-3">Concentración</p>
        <div className="space-y-2.5">
          {CATALOG_CONCENTRATIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="concentration"
                checked={concentration === opt.value}
                onChange={() =>
                  onConcentrationChange(
                    concentration === opt.value ? '' : (opt.value as Concentration)
                  )
                }
                className="w-4 h-4 accent-accent cursor-pointer"
              />
              <span className="font-body text-sm text-text-soft group-hover:text-text transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <FilterPillGroup
        label="Proyección"
        options={CATALOG_PROJECTIONS}
        selected={projection ? [projection] : []}
        onChange={(values) => {
          const newVal = values.find((v) => v !== projection) || '';
          onProjectionChange(newVal as Projection | '');
        }}
        singleSelect
      />

      {/* Descuento */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={hasDiscount}
            onChange={(e) => onHasDiscountChange(e.target.checked)}
            className="w-4 h-4 accent-accent cursor-pointer"
          />
          <span className="font-body text-sm uppercase tracking-[0.12em] text-text-soft group-hover:text-text transition-colors">
            Con descuento
          </span>
        </label>
      </div>

      <FilterPriceRange
        label="Precio máximo"
        min={0}
        max={500}
        value={maxPrice ?? 500}
        onChange={(val) => onPriceRangeChange(undefined, val < 500 ? val : undefined)}
      />
    </div>
  );
}
