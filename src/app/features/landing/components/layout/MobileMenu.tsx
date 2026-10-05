import { useEffect, useState } from 'react';
import { isLinkActive } from '../../hooks/useNavbarHook';
import {
  useMenuCategoriesQuery,
  sortCategoriesByHierarchy,
} from '@/app/tanstack-queries/categoriesQuery';
import { useNavbarAdQuery } from '@/app/tanstack-queries/navbarAdQuery';
import { useCartStore } from '@/app/store/cart/cartStore';
import { LABEL_MONO } from '@/app/components/UI/formClasses';

interface MobileMenuProps {
  pathname: string;
  isAuthenticated?: boolean;
  onAuthOpen?: () => void;
  onClose: () => void;
}

const BASE_PATH = '/catalogo';

// Páginas de marca y utilidades — filas simples, sin acordeón.
const PAGES = [
  { href: BASE_PATH, label: 'Tienda' },
  { href: '/nuestra-historia', label: 'Nuestra historia' },
  { href: '/el-taller', label: 'El taller' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/rastrear', label: 'Rastrear pedido' },
];

/** Fila base: alto cómodo para el pulgar + hairline inferior. */
const ROW =
  'flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-body text-[15px] leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 ${
        open ? 'rotate-180' : ''
      }`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * Menú móvil LIVI — panel de navegación a pantalla completa (ref. de marca:
 * lista vertical, una sección por fila separada por hairlines).
 *
 * Jerarquía: categorías reales del backend con acordeón de marcas →
 * páginas de marca → Cuenta → publicidad del navbar anclada abajo.
 *
 * Fondo `bg-bg` con tinta `text-text`: el overlay burgundy anterior obligaba
 * a inventar opacidades de butter para cada nivel de texto; sobre blanco la
 * jerarquía sale de los tokens (text / text-soft / text-muted) y la lista se
 * lee como el resto de la tienda.
 */
export default function MobileMenu({
  pathname,
  isAuthenticated,
  onAuthOpen,
  onClose,
}: MobileMenuProps) {
  const { data: categories = [], isLoading } = useMenuCategoriesQuery();
  const { data: navAd } = useNavbarAdQuery();

  const itemCount = useCartStore((s) => s.itemCount());
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  /** El buscador vive en la navbar de escritorio: en móvil se cierra el menú
   *  y se lleva al catálogo, que tiene su propio campo de búsqueda. */
  const handleSearch = () => {
    onClose();
    window.location.href = `${BASE_PATH}?buscar=1`;
  };

  const handleCart = () => {
    onClose();
    setDrawerOpen(true);
  };

  // Una sola categoría abierta a la vez: en una pantalla de teléfono varios
  // acordeones abiertos esconden el resto de la lista.
  const [openCat, setOpenCat] = useState<string | null>(null);

  // Escape cierra el panel (el scroll-lock del fondo lo libera useNavbarHook
  // al desmontarse este componente).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cats = sortCategoriesByHierarchy(
    categories.filter((c) => c.name.toLowerCase() !== 'all'),
  );

  // Categoría activa: se lee del query real, no por `includes` (con ids
  // numéricos "category=1" también coincidiría con "category=11").
  const activeCategoryId = new URLSearchParams(pathname.split('?')[1] ?? '').get('category');

  // Publicidad del navbar: prioriza el arte vertical subido para teléfono.
  const adImage = navAd?.mobileImageUrl || navAd?.imageUrl || navAd?.image || null;

  const rowTone = (active: boolean) =>
    active ? 'text-accent' : 'text-text hover:text-accent';

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-bg text-text md:hidden">
      {/* Cerrar · wordmark · buscar y carrito: desde el menú se puede seguir
          comprando sin tener que cerrarlo primero (ref. de marca). */}
      <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="justify-self-start p-2 text-text-soft transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <a href="/" onClick={onClose} aria-label="LIVI — Inicio" className="justify-self-center">
          <img src="/logo-livi.svg" alt="LIVI Ecuador" className="h-6 w-auto" />
        </a>

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Buscar"
            className="p-2 text-text-soft transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleCart}
            aria-label={`Abrir carrito (${itemCount})`}
            className="relative p-2 text-text-soft transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 7h12l-1 13H7L6 7z" />
              <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute right-0 top-0 min-w-4 bg-accent px-1 text-center font-mono text-[10px] leading-4 text-bg">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Lista de navegación — scroll propio cuando el contenido no entra */}
      <nav className="flex-1 overflow-y-auto overscroll-contain" aria-label="Navegación móvil">
        <p className={`${LABEL_MONO} px-6 pb-3 pt-6`}>Comprar</p>

        <div className="border-t border-border">
          {isLoading && (
            <p className="px-6 py-4 font-body text-sm text-text-muted">Cargando categorías…</p>
          )}

          {cats.map((cat) => {
            const catHref = `${BASE_PATH}?category=${cat.id}`;
            const isActive = activeCategoryId === cat.id;

            // Sin marcas no hay nada que desplegar: la fila navega directo.
            if (cat.marcas.length === 0) {
              return (
                <a
                  key={cat.id}
                  href={catHref}
                  onClick={onClose}
                  className={`${ROW} border-b border-border ${rowTone(isActive)}`}
                >
                  <span>{cat.name}</span>
                </a>
              );
            }

            const open = openCat === cat.id;
            const panelId = `mobile-menu-cat-${cat.id}`;

            return (
              <div key={cat.id} className="border-b border-border">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenCat(open ? null : cat.id)}
                  className={`${ROW} ${rowTone(isActive)}`}
                >
                  <span>{cat.name}</span>
                  <Chevron open={open} />
                </button>

                {/* Acordeón: 0fr → 1fr con opacidad. Sin rebote y sin alto fijo,
                    así el panel se adapta al número de marcas. */}
                <div
                  id={panelId}
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="pb-4">
                      {cat.marcas.map((marca) => (
                        <li key={marca.id}>
                          <a
                            href={`${catHref}&marca=${marca.id}`}
                            onClick={onClose}
                            className="block py-2 pl-10 pr-6 font-body text-sm text-text-soft transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                          >
                            {marca.name}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href={catHref}
                          onClick={onClose}
                          className={`${LABEL_MONO} block py-3 pl-10 pr-6 text-text-soft transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}
                        >
                          Ver todo {cat.name}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Páginas de marca y utilidades */}
        <div>
          {PAGES.map((page) => (
            <a
              key={page.href}
              href={page.href}
              onClick={onClose}
              className={`${ROW} border-b border-border ${rowTone(
                isLinkActive(page.href, pathname, true),
              )}`}
            >
              <span>{page.label}</span>
            </a>
          ))}
        </div>

        {/* Cuenta — cierra la lista, separada por un hueco */}
        <div className="mt-6 border-t border-border">
          {isAuthenticated ? (
            <a
              href="/mi-cuenta"
              onClick={onClose}
              className={`${ROW} border-b border-border ${rowTone(
                isLinkActive('/mi-cuenta', pathname, false),
              )}`}
            >
              <span>Cuenta</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAuthOpen?.();
              }}
              className={`${ROW} border-b border-border ${rowTone(false)}`}
            >
              <span>Cuenta</span>
            </button>
          )}
        </div>

        {/* Colchón: el último hairline no queda pegado al pie del panel */}
        <div className="h-8" aria-hidden="true" />
      </nav>

      {/* Publicidad del navbar — anclada al pie del panel, fuera del scroll.
          Sin banner no se renderiza nada (ni placeholder ni hueco). */}
      {navAd && adImage && (
        <a
          href={navAd.link || BASE_PATH}
          onClick={onClose}
          className="group block shrink-0 border-t border-border px-6 pb-6 pt-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        >
          <p className={LABEL_MONO}>Destacado</p>
          <p className="mt-1.5 font-heading text-xl leading-tight text-text transition-colors group-hover:text-accent">
            {navAd.title}
          </p>
          {navAd.subtitle && (
            <p className="mt-1 font-body text-[13px] leading-relaxed text-text-soft">
              {navAd.subtitle}
            </p>
          )}
          <img
            src={adImage}
            alt=""
            loading="lazy"
            className="mt-3 h-24 w-full border border-border object-cover"
          />
        </a>
      )}
    </div>
  );
}
