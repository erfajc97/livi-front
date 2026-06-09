import { SORT_OPTIONS } from '../data';

interface CatalogSearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
}

export default function CatalogSearchBar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
}: CatalogSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search input */}
      <div className="relative flex-1">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre de producto"
          className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border text-text placeholder:text-text-muted text-sm focus:outline-none focus:border-text transition-colors"
        />
      </div>

      {/* Sort select */}
      <div className="relative sm:w-64">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full appearance-none px-4 py-3.5 bg-surface border border-border text-text text-sm focus:outline-none focus:border-text transition-colors pr-10 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Ordenar por : {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
