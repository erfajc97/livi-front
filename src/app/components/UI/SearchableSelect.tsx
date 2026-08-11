import { useEffect, useId, useMemo, useRef, useState } from 'react';

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  /** Texto cuando la búsqueda no encuentra nada (se puede escribir igual). */
  emptyHint?: string;
  disabled?: boolean;
  disabledHint?: string;
  className?: string;
  /** Estilo del campo; por defecto el recuadro con borde del panel de cuenta. */
  inputClassName?: string;
  id?: string;
}

const DEFAULT_INPUT =
  'w-full border border-border bg-surface px-3.5 py-3 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-text';

/** Quita tildes y baja a minúsculas: buscar "canar" encuentra "Cañar". */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/**
 * Selector con buscador — pensado para listas largas como los 221 cantones del
 * país, donde un `<select>` obliga a scrollear a ciegas.
 *
 * Se escribe para filtrar, se navega con las flechas y Enter, y el valor puede
 * quedarse tal cual se escribió: hay parroquias y recintos que no son cabecera
 * cantonal y el cliente igual tiene que poder poner el suyo.
 */
export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Buscar…',
  emptyHint = 'Sin coincidencias — puedes escribirlo igual',
  disabled = false,
  disabledHint,
  className = '',
  inputClassName = DEFAULT_INPUT,
  id,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const inputId = id ?? autoId;

  // Mientras está cerrado, el input muestra el valor elegido.
  const shown = open ? query : value;

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!open || !q) return options;
    return options.filter((o) => normalize(o).includes(q));
  }, [open, query, options]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeWith(query);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  });

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  /** Cierra guardando lo escrito: nadie pierde lo que tipeó. */
  const closeWith = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== value) {
      const exact = options.find((o) => normalize(o) === normalize(trimmed));
      onChange(exact ?? trimmed);
    }
    setOpen(false);
    setQuery('');
  };

  const pick = (option: string) => {
    onChange(option);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlight(0);
        return;
      }
      const next = e.key === 'ArrowDown' ? highlight + 1 : highlight - 1;
      setHighlight(Math.max(0, Math.min(filtered.length - 1, next)));
    } else if (e.key === 'Enter') {
      if (open) {
        e.preventDefault();
        if (filtered[highlight]) pick(filtered[highlight]);
        else closeWith(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${inputId}-list`}
        autoComplete="off"
        disabled={disabled}
        value={shown}
        placeholder={disabled ? (disabledHint ?? placeholder) : placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlight(0);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery('');
          setHighlight(0);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          // Las opciones se eligen en `mousedown` (con preventDefault), así que
          // si llegamos acá es que el foco se fue de verdad: cerrar y guardar.
          if (open) closeWith(query);
        }}
        className={`${inputClassName} pr-8 disabled:cursor-not-allowed disabled:opacity-50`}
      />

      {/* Flecha / limpiar */}
      {value && !disabled ? (
        <button
          type="button"
          aria-label="Limpiar"
          onClick={() => {
            onChange('');
            setQuery('');
            setOpen(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-muted transition-colors hover:text-text"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      )}

      {open && !disabled && (
        <ul
          id={`${inputId}-list`}
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto border border-border bg-surface shadow-[0_10px_30px_rgba(28,26,23,0.12)]"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 font-body text-xs text-text-muted">{emptyHint}</li>
          ) : (
            filtered.map((option, i) => (
              <li
                key={option}
                role="option"
                aria-selected={option === value}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  e.preventDefault(); // que no dispare el blur antes del click
                  pick(option);
                }}
                className={`cursor-pointer px-4 py-2.5 font-body text-sm transition-colors ${
                  i === highlight ? 'bg-bg-alt text-text' : 'text-text-soft'
                } ${option === value ? 'font-medium text-text' : ''}`}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
