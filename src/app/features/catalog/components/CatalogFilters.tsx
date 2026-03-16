import { useState } from 'react';
import {
  CATALOG_CATEGORIES,
  CATALOG_GENDERS,
  CATALOG_TIME_OF_DAY,
  CATALOG_CONCENTRATIONS,
  CATALOG_PROJECTIONS,
} from '../data';
import FilterPillGroup from './FilterPillGroup';
import FilterPriceRange from './FilterPriceRange';
import type { ProductType } from '@/app/types/global.types';

interface CatalogFiltersProps {
  selectedType: ProductType | '';
  onTypeChange: (type: ProductType | '') => void;
}

export default function CatalogFilters({
  selectedType,
  onTypeChange,
}: CatalogFiltersProps) {
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [selectedConcentration, setSelectedConcentration] = useState('');
  const [selectedProjections, setSelectedProjections] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(200);

  const categorySelected = selectedType ? [selectedType] : [];

  const handleCategoryChange = (values: string[]) => {
    const newValue = values.find((v) => v !== selectedType) || '';
    onTypeChange(newValue as ProductType | '');
  };

  return (
    <aside className="border border-gray-200 rounded-xl p-5 space-y-6">
      <FilterPillGroup
        label="Categorías"
        options={CATALOG_CATEGORIES}
        selected={categorySelected}
        onChange={handleCategoryChange}
        singleSelect
      />

      <FilterPillGroup
        label="Género"
        options={CATALOG_GENDERS}
        selected={selectedGenders}
        onChange={setSelectedGenders}
      />

      <FilterPillGroup
        label="Hora del día"
        options={CATALOG_TIME_OF_DAY}
        selected={selectedTimeOfDay}
        onChange={setSelectedTimeOfDay}
      />

      {/* Concentración — radio buttons */}
      <div>
        <p className="font-heading text-base font-semibold text-black mb-3 italic">
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
                checked={selectedConcentration === opt.value}
                onChange={() => setSelectedConcentration(opt.value)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <FilterPillGroup
        label="Proyección"
        options={CATALOG_PROJECTIONS}
        selected={selectedProjections}
        onChange={setSelectedProjections}
      />

      <FilterPriceRange
        label="Desde"
        min={0}
        max={500}
        value={priceMax}
        onChange={setPriceMax}
      />
    </aside>
  );
}
