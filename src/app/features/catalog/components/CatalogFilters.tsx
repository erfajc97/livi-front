import {
  CATALOG_GENDERS,
  CATALOG_TIME_OF_DAY,
  CATALOG_CONCENTRATIONS,
  CATALOG_PROJECTIONS,
} from '../data';
import FilterPillGroup from './FilterPillGroup';
import FilterPriceRange from './FilterPriceRange';
import { useCategoriesWithMarcasQuery } from '@/app/tanstack-queries/categoriesQuery';
import type { Gender, TimeOfDay, Concentration, Projection } from '@/app/types/global.types';

interface CatalogFiltersProps {
  gender: Gender | '';
  onGenderChange: (v: Gender | '') => void;
  timeOfDay: TimeOfDay | '';
  onTimeOfDayChange: (v: TimeOfDay | '') => void;
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
  'w-full rounded-lg border border-border px-3 py-2.5 text-sm text-text bg-surface focus:border-black focus:outline-none transition-colors appearance-none cursor-pointer';

export default function CatalogFilters({
  gender,
  onGenderChange,
  timeOfDay,
  onTimeOfDayChange,
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
    <aside className="border border-border rounded-xl p-5 space-y-6">
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-xs font-heading uppercase tracking-wider text-text-muted hover:text-text transition-colors underline"
        >
          Limpiar filtros
        </button>
      )}

      {/* Categorías — select */}
      {!hideCategories && filteredCategories.length > 0 && (
        <div>
          <p className="font-heading text-base font-semibold text-text mb-3 italic">
            Categoría
          </p>
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

      <FilterPillGroup
        label="Género"
        options={CATALOG_GENDERS}
        selected={gender ? [gender] : []}
        onChange={(values) => {
          const newVal = values.find((v) => v !== gender) || '';
          onGenderChange(newVal as Gender | '');
        }}
        singleSelect
      />

      <FilterPillGroup
        label="Hora del día"
        options={CATALOG_TIME_OF_DAY}
        selected={timeOfDay ? [timeOfDay] : []}
        onChange={(values) => {
          const newVal = values.find((v) => v !== timeOfDay) || '';
          onTimeOfDayChange(newVal as TimeOfDay | '');
        }}
        singleSelect
      />

      {/* Concentración — radio buttons */}
      <div>
        <p className="font-heading text-base font-semibold text-text mb-3 italic">
          Concentración
        </p>
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
                className="w-4 h-4 accent-black cursor-pointer"
              />
              <span className="text-sm text-text-muted group-hover:text-text transition-colors">
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
            className="w-4 h-4 accent-black cursor-pointer rounded"
          />
          <span className="font-heading text-sm font-semibold text-text group-hover:text-text transition-colors">
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
    </aside>
  );
}
