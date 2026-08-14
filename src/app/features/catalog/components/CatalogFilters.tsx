import { useState } from 'react';
import {
  CATALOG_GENDERS,
  CATALOG_TIME_OF_DAY,
  CATALOG_CONCENTRATIONS,
  CATALOG_PROJECTIONS,
} from '../data';
import FilterPillGroup from './FilterPillGroup';
import FilterPriceRange from './FilterPriceRange';
import {
  useCategoriesWithMarcasQuery,
  sortCategoriesByHierarchy,
} from '@/app/tanstack-queries/categoriesQuery';
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
  marcaId?: number;
  onMarcaChange: (v?: number) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  hideCategories?: boolean;
}

const normalizeText = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Indicador cuadrado (estilo checkbox de la referencia) para listas de
 *  selección única: la API filtra por UN solo valor de marca/concentración. */
function CheckRow({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className="group flex w-full items-center gap-2.5 text-left"
    >
      <span
        aria-hidden
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          active ? 'border-text bg-text' : 'border-border bg-surface group-hover:border-text'
        }`}
      >
        {active && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-bg">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className="font-body text-sm text-text-soft transition-colors group-hover:text-text">
        {label}
      </span>
    </button>
  );
}

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
  marcaId,
  onMarcaChange,
  hasActiveFilters,
  onClearFilters,
  hideCategories,
}: CatalogFiltersProps) {
  const { data: categories = [] } = useCategoriesWithMarcasQuery();
  const filteredCategories = sortCategoriesByHierarchy(
    categories.filter((c) => c.name.toLowerCase() !== 'all'),
  );

  // Marcas de la lista: las de la categoría elegida; si no hay categoría,
  // todas las marcas (dedupe por id).
  const marcaSource = categoryId
    ? (filteredCategories.find((c) => Number(c.id) === categoryId)?.marcas ?? [])
    : filteredCategories.flatMap((c) => c.marcas);
  const marcas = Array.from(new Map(marcaSource.map((m) => [String(m.id), m])).values());

  // Buscador de marcas (filtra la lista localmente).
  const [marcaSearch, setMarcaSearch] = useState('');
  const visibleMarcas = marcaSearch
    ? marcas.filter((m) => normalizeText(m.name).includes(normalizeText(marcaSearch)))
    : marcas;

  return (
    <div className="space-y-9">
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="border-b border-border pb-0.5 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-text"
        >
          Limpiar filtros
        </button>
      )}

      {/* 1. Categoría — chips (Árabes / Diseñador / Nicho primero) */}
      {!hideCategories && filteredCategories.length > 0 && (
        <FilterPillGroup
          label="1. Categoría"
          options={filteredCategories.map((c) => ({ value: String(c.id), label: c.name }))}
          selected={categoryId != null ? [String(categoryId)] : []}
          onChange={(values) => {
            const next = values.find((v) => v !== String(categoryId));
            onCategoryChange(next != null ? Number(next) : undefined);
          }}
          singleSelect
        />
      )}

      {/* 2. Género — chips */}
      <FilterPillGroup
        label="2. Género"
        options={CATALOG_GENDERS}
        selected={gender ? [gender] : []}
        onChange={(values) => {
          const next = values.find((v) => v !== gender) || '';
          onGenderChange(next as Gender | '');
        }}
        singleSelect
      />

      {/* 3. Ocasión — chips */}
      <FilterPillGroup
        label="3. Ocasión"
        options={CATALOG_TIME_OF_DAY}
        selected={timeOfDay ? [timeOfDay] : []}
        onChange={(values) => {
          const next = values.find((v) => v !== timeOfDay) || '';
          onTimeOfDayChange(next as TimeOfDay | '');
        }}
        singleSelect
      />

      {/* 4. Marca — buscador + lista */}
      {marcas.length > 0 && (
        <div>
          <p className="eyebrow mb-3 font-semibold text-text">4. Marca</p>
          {marcas.length > 5 && (
            <input
              type="search"
              value={marcaSearch}
              onChange={(e) => setMarcaSearch(e.target.value)}
              placeholder="Buscar marca…"
              className="mb-3 w-full border-b border-border bg-transparent pb-2 font-body text-sm text-text placeholder:text-text-muted focus:border-text focus:outline-none"
            />
          )}
          <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
            {visibleMarcas.map((m) => (
              <CheckRow
                key={m.id}
                label={m.name}
                active={marcaId === Number(m.id)}
                onToggle={() => onMarcaChange(marcaId === Number(m.id) ? undefined : Number(m.id))}
              />
            ))}
            {visibleMarcas.length === 0 && (
              <p className="font-body text-xs text-text-muted">Sin marcas para “{marcaSearch}”.</p>
            )}
          </div>
        </div>
      )}

      {/* 5. Concentración — lista */}
      <div>
        <p className="eyebrow mb-3 font-semibold text-text">5. Concentración</p>
        <div className="space-y-2.5">
          {CATALOG_CONCENTRATIONS.map((opt) => (
            <CheckRow
              key={opt.value}
              label={opt.label}
              active={concentration === opt.value}
              onToggle={() =>
                onConcentrationChange(concentration === opt.value ? '' : (opt.value as Concentration))
              }
            />
          ))}
        </div>
      </div>

      {/* 6. Proyección — chips */}
      <FilterPillGroup
        label="6. Proyección"
        options={CATALOG_PROJECTIONS}
        selected={projection ? [projection] : []}
        onChange={(values) => {
          const newVal = values.find((v) => v !== projection) || '';
          onProjectionChange(newVal as Projection | '');
        }}
        singleSelect
      />

      {/* Con descuento — toggle */}
      <div>
        <button
          type="button"
          role="switch"
          aria-checked={hasDiscount}
          onClick={() => onHasDiscountChange(!hasDiscount)}
          className="group flex items-center gap-3"
        >
          <span
            aria-hidden
            className={`relative h-5 w-9 rounded-full transition-colors ${hasDiscount ? 'bg-text' : 'bg-border'}`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface transition-transform ${
                hasDiscount ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </span>
          <span className="font-body text-sm uppercase tracking-[0.12em] text-text-soft transition-colors group-hover:text-text">
            Con descuento
          </span>
        </button>
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
