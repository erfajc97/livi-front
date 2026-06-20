import { useState } from 'react';
import { NAV_LINKS, isLinkActive } from '../../hooks/useNavbarHook';
import { useNormalCategoriesQuery, useBajoPedidoCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';

interface MobileMenuProps {
  pathname: string;
  isAuthenticated: boolean;
  onAuthOpen: () => void;
  onClose: () => void;
}

/**
 * Menú móvil — misma dirección editorial (Atelier) que la navbar de escritorio:
 * tipografía DM Sans en versalitas con tracking, nombres de marca en serif
 * display, líneas finas `border-border`, sin píldoras ni acentos rellenos.
 */
export default function MobileMenu({ pathname, isAuthenticated, onAuthOpen, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: normalCategories = [] } = useNormalCategoriesQuery();
  const { data: bajoPedidoCategories = [] } = useBajoPedidoCategoriesQuery();

  return (
    <div className="border-t border-border bg-bg md:hidden max-h-[80vh] overflow-y-auto">
      <nav className="flex flex-col px-6" aria-label="Navegación móvil">
        {NAV_LINKS.map((link) => {
          const active = isLinkActive(link.href, pathname, link.exact);

          if (link.dropdown) {
            const isOpen = expanded === link.dropdownId;
            const categories = (link.dropdownId === 'perfumes' ? normalCategories : bajoPedidoCategories)
              .filter((c) => c.name.toLowerCase() !== 'all');
            const basePath = link.dropdownId === 'perfumes' ? '/catalogo/perfumes' : '/bajo-pedido';

            return (
              <div key={link.label} className="border-b border-border">
                <button
                  onClick={() => setExpanded(isOpen ? null : link.dropdownId!)}
                  className="flex w-full items-center justify-between py-4 font-body text-xs uppercase tracking-[0.18em]"
                  aria-expanded={isOpen}
                >
                  <span className={active || isOpen ? 'text-accent' : 'text-text'}>{link.label}</span>
                  <svg
                    className={`h-3 w-3 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="pb-6 pl-1">
                    <a
                      href={basePath}
                      onClick={onClose}
                      className="eyebrow mb-6 inline-block border-b border-text pb-1 text-text transition-colors hover:text-accent"
                    >
                      Ver todo →
                    </a>

                    {categories.length === 0 ? (
                      <p className="font-body text-sm text-text-muted">No hay casas disponibles</p>
                    ) : (
                      <div className="flex flex-col gap-7">
                        {categories.map((cat) => (
                          <div key={cat.id}>
                            <div className="flex items-baseline gap-3 pb-3">
                              <span className="eyebrow">{cat.name}</span>
                              <span className="h-px flex-1 bg-border" />
                            </div>
                            <div className="flex flex-col gap-3.5">
                              {cat.marcas.map((sub) => (
                                <a
                                  key={sub.id}
                                  href={`${basePath}?category=${cat.id}&marca=${sub.id}`}
                                  onClick={onClose}
                                  className="font-display text-lg font-normal not-italic leading-none text-text-soft transition-colors hover:text-accent"
                                >
                                  {sub.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={`border-b border-border py-4 font-body text-xs uppercase tracking-[0.18em] transition-colors hover:text-accent ${active ? 'text-accent' : 'text-text'}`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* Cuenta + fila de utilidades (espejo de la barra superior de escritorio) */}
      <div className="flex flex-col gap-4 bg-bg-alt px-6 py-7">
        {isAuthenticated ? (
          <a href="/mi-cuenta" onClick={onClose} className="eyebrow self-start text-text transition-colors hover:text-accent">
            Mi cuenta
          </a>
        ) : (
          <button
            onClick={() => { onAuthOpen(); onClose(); }}
            className="eyebrow self-start text-text transition-colors hover:text-accent"
          >
            Ingresar
          </button>
        )}
        <div className="flex flex-col gap-2.5 font-body text-[11px] tracking-[0.04em] text-text-soft">
          <a href="/rastrear" onClick={onClose} className="hover:text-text">Rastrear pedido</a>
          <a href="/contacto" onClick={onClose} className="hover:text-text">Acerca de</a>
        </div>
        <span className="font-body text-[11px] tracking-[0.04em] text-text-muted">
          Envíos a todo el Ecuador · Servientrega 24–72h · ES · USD
        </span>
      </div>
    </div>
  );
}
