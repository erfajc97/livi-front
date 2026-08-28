import { useEffect, useRef, useState } from 'react';
import { CATALOG_GENDERS } from '../data';
import type { Gender } from '@/app/types/global.types';
import {
  sortCategoriesByHierarchy,
  type NavCategory,
  type NavMarca,
} from '@/app/tanstack-queries/categoriesQuery';

interface CatalogQuickFiltersProps {
  gender: Gender | '';
  onGenderChange: (v: Gender | '') => void;
  marcaId?: number;
  onMarcaChange: (v?: number) => void;
  categoryId?: number;
  onCategoryChange: (v?: number) => void;
  categories: NavCategory[];
  showCategory?: boolean;
}

type OpenMenu = 'category' | 'marca' | 'gender' | null;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function CatalogQuickFilters({
  gender,
  onGenderChange,
  marcaId,
  onMarcaChange,
  categoryId,
  onCategoryChange,
  categories,
  showCategory = false,
}: CatalogQuickFiltersProps) {
  const [open, setOpen] = useState<OpenMenu>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const sortedCategories = sortCategoriesByHierarchy(
    categories.filter((c) => c.name.toLowerCase() !== 'all'),
  );
  const marcaSource = categoryId
    ? (sortedCategories.find((c) => Number(c.id) === categoryId)?.marcas ?? [])
    : sortedCategories.flatMap((c) => c.marcas);
  const marcas: NavMarca[] = Array.from(
    new Map(marcaSource.map((m) => [String(m.id), m])).values(),
  );

  const genderLabel = CATALOG_GENDERS.find((g) => g.value === gender)?.label ?? 'Género';
  const marcaLabel = marcas.find((m) => Number(m.id) === marcaId)?.name ?? 'Marca';
  const categoryLabel =
    sortedCategories.find((c) => Number(c.id) === categoryId)?.name ?? 'Categoría';

  const btn = (active: boolean, menu: OpenMenu) =>
    `flex w-full min-w-0 items-center justify-between gap-1 border px-2 py-2.5 font-body text-[10px] uppercase tracking-[0.08em] transition-colors ${
      active || open === menu
        ? 'border-text bg-text text-bg'
        : 'border-border bg-surface text-text'
    }`;

  const menuPanel =
    'absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-x-hidden overflow-y-auto border border-border bg-surface py-1 shadow-[0_8px_24px_rgba(28,26,23,0.12)]';
  const menuItem = (active: boolean) =>
    `block w-full truncate px-3 py-2.5 text-left font-body text-sm ${
      active ? 'bg-text text-bg' : 'text-text hover:bg-bg-alt'
    }`;

  return (
    <div
      ref={rootRef}
      className={`relative grid min-w-0 gap-1.5 ${showCategory ? 'grid-cols-3' : 'grid-cols-2'}`}
    >
      {showCategory && (
        <button
          type="button"
          aria-expanded={open === 'category'}
          onClick={() => setOpen((v) => (v === 'category' ? null : 'category'))}
          className={btn(Boolean(categoryId), 'category')}
        >
          <span className="min-w-0 truncate">{categoryLabel}</span>
          <Chevron open={open === 'category'} />
        </button>
      )}

      <button
        type="button"
        aria-expanded={open === 'marca'}
        onClick={() => setOpen((v) => (v === 'marca' ? null : 'marca'))}
        className={btn(Boolean(marcaId), 'marca')}
      >
        <span className="min-w-0 truncate">{marcaLabel}</span>
        <Chevron open={open === 'marca'} />
      </button>

      <button
        type="button"
        aria-expanded={open === 'gender'}
        onClick={() => setOpen((v) => (v === 'gender' ? null : 'gender'))}
        className={btn(Boolean(gender), 'gender')}
      >
        <span className="min-w-0 truncate">{genderLabel}</span>
        <Chevron open={open === 'gender'} />
      </button>

      {open === 'category' && (
        <div className={menuPanel}>
          {sortedCategories.length === 0 ? (
            <p className="px-3 py-2.5 font-body text-sm text-text-muted">Sin categorías</p>
          ) : (
            sortedCategories.map((c) => {
              const active = categoryId === Number(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onCategoryChange(active ? undefined : Number(c.id));
                    setOpen(null);
                  }}
                  className={menuItem(active)}
                >
                  {c.name}
                </button>
              );
            })
          )}
        </div>
      )}

      {open === 'marca' && (
        <div className={menuPanel}>
          {marcas.length === 0 ? (
            <p className="px-3 py-2.5 font-body text-sm text-text-muted">Sin marcas</p>
          ) : (
            marcas.map((m) => {
              const active = marcaId === Number(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onMarcaChange(active ? undefined : Number(m.id));
                    setOpen(null);
                  }}
                  className={menuItem(active)}
                >
                  {m.name}
                </button>
              );
            })
          )}
        </div>
      )}

      {open === 'gender' && (
        <div className={menuPanel}>
          {CATALOG_GENDERS.map((opt) => {
            const active = gender === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onGenderChange(active ? '' : (opt.value as Gender));
                  setOpen(null);
                }}
                className={menuItem(active)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
