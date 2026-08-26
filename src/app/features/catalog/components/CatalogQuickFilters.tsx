import { useEffect, useRef, useState } from 'react';
import { CATALOG_GENDERS } from '../data';
import type { Gender } from '@/app/types/global.types';
import type { NavMarca } from '@/app/tanstack-queries/categoriesQuery';

interface CatalogQuickFiltersProps {
  gender: Gender | '';
  onGenderChange: (v: Gender | '') => void;
  marcaId?: number;
  onMarcaChange: (v?: number) => void;
  marcas: NavMarca[];
}

type OpenMenu = 'gender' | 'marca' | null;

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
  marcas,
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

  const genderLabel = CATALOG_GENDERS.find((g) => g.value === gender)?.label ?? 'Género';
  const marcaLabel = marcas.find((m) => Number(m.id) === marcaId)?.name ?? 'Marca';

  const btn = (active: boolean, menu: OpenMenu) =>
    `flex w-full min-w-0 items-center justify-between gap-2 border px-3 py-2.5 font-body text-[11px] uppercase tracking-[0.12em] transition-colors ${
      active || open === menu
        ? 'border-text bg-text text-bg'
        : 'border-border bg-surface text-text'
    }`;

  return (
    <div ref={rootRef} className="grid min-w-0 flex-1 grid-cols-2 gap-2">
      <div className="relative min-w-0">
        <button
          type="button"
          aria-expanded={open === 'gender'}
          onClick={() => setOpen((v) => (v === 'gender' ? null : 'gender'))}
          className={btn(Boolean(gender), 'gender')}
        >
          <span className="truncate">{genderLabel}</span>
          <Chevron open={open === 'gender'} />
        </button>
        {open === 'gender' && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 border border-border bg-surface py-1 shadow-[0_8px_24px_rgba(28,26,23,0.12)]">
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
                  className={`block w-full px-3 py-2.5 text-left font-body text-sm ${
                    active ? 'bg-text text-bg' : 'text-text hover:bg-bg-alt'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative min-w-0">
        <button
          type="button"
          aria-expanded={open === 'marca'}
          onClick={() => setOpen((v) => (v === 'marca' ? null : 'marca'))}
          className={btn(Boolean(marcaId), 'marca')}
        >
          <span className="truncate">{marcaLabel}</span>
          <Chevron open={open === 'marca'} />
        </button>
        {open === 'marca' && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto border border-border bg-surface py-1 shadow-[0_8px_24px_rgba(28,26,23,0.12)]">
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
                    className={`block w-full px-3 py-2.5 text-left font-body text-sm ${
                      active ? 'bg-text text-bg' : 'text-text hover:bg-bg-alt'
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
