import { useState } from 'react';
import { NAV_LINKS, isLinkActive } from '../../hooks/useNavbarHook';
import { useNormalCategoriesQuery, useBajoPedidoCategoriesQuery, sortCategoriesByHierarchy } from '@/app/tanstack-queries/categoriesQuery';

interface MobileMenuProps {
  pathname: string;
  isAuthenticated?: boolean;
  onAuthOpen?: () => void;
  onClose: () => void;
}

/**
 * Menú móvil — misma dirección editorial (Atelier) que la navbar de escritorio:
 * opciones en serif display capitalizada (REQ-036), líneas finas
 * `border-border`, sin píldoras ni acentos rellenos.
 */
export default function MobileMenu({ pathname, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  // Segundo nivel: qué categoría tiene desplegadas sus marcas (una a la vez)
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const { data: normalCategories = [] } = useNormalCategoriesQuery();
  const { data: bajoPedidoCategories = [] } = useBajoPedidoCategoriesQuery();

  return (
    <div className="border-t border-border bg-bg md:hidden max-h-[80vh] overflow-y-auto pb-24">
      <nav className="flex flex-col px-6" aria-label="Navegación móvil">
        {NAV_LINKS.map((link) => {
          const active = isLinkActive(link.href, pathname, link.exact);

          if (link.dropdown) {
            const isOpen = expanded === link.dropdownId;
            const categories = sortCategoriesByHierarchy(
              (link.dropdownId === 'perfumes' ? normalCategories : bajoPedidoCategories)
                .filter((c) => c.name.toLowerCase() !== 'all'),
            );
            const basePath = link.dropdownId === 'perfumes' ? '/catalogo/perfumes' : '/bajo-pedido';

            return (
              <div key={link.label} className="border-b border-border">
                <button
                  onClick={() => {
                    setExpanded(isOpen ? null : link.dropdownId!);
                    // Al cambiar de sección se cierran las categorías abiertas
                    setExpandedCat(null);
                  }}
                  className="flex w-full items-center justify-between py-4 font-display text-base tracking-[0.04em]"
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
                      <div className="flex flex-col gap-5">
                        {categories.map((cat) => {
                          const catOpen = expandedCat === String(cat.id);
                          return (
                            <div key={cat.id}>
                              {/* Categoría colapsada por defecto: solo el nombre
                                  con su flecha; al tocarla se despliegan sus
                                  marcas para que el menú no sea infinito */}
                              <button
                                onClick={() => setExpandedCat(catOpen ? null : String(cat.id))}
                                aria-expanded={catOpen}
                                className="flex w-full items-baseline gap-3 pb-1.5 text-left"
                              >
                                <span className={`eyebrow transition-colors hover:underline underline-offset-4 decoration-accent/70 ${catOpen ? 'text-accent' : ''}`}>
                                  {cat.name}
                                </span>
                                <span className="h-px flex-1 bg-border" />
                                <svg
                                  className={`h-2.5 w-2.5 shrink-0 self-center text-text-muted transition-transform ${catOpen ? 'rotate-180' : ''}`}
                                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
                                >
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </button>
                              {catOpen && (
                                <div className="flex flex-col gap-3.5 pt-3">
                                  {cat.marcas.map((sub) => (
                                    <a
                                      key={sub.id}
                                      href={`${basePath}?category=${cat.id}&marca=${sub.id}`}
                                      onClick={onClose}
                                      className="font-display text-lg font-normal not-italic leading-none text-text-soft transition-colors hover:text-accent hover:underline underline-offset-4 decoration-accent/70"
                                    >
                                      {sub.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
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
              className={`border-b border-border py-4 font-display text-base tracking-[0.04em] transition-colors hover:text-accent ${active ? 'text-accent' : 'text-text'}`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* Fila de utilidades — aviso de envíos + logo de Servientrega (REQ-037) */}
      <div className="flex items-center gap-4 bg-bg-alt px-6 py-7">
        <span className="font-body text-sm tracking-[0.04em] text-text-muted">
          Envíos a todo el Ecuador
        </span>
        <img
          src="/servientrega.png"
          alt="Servientrega"
          className="h-12 w-auto object-contain"
        />
      </div>
    </div>
  );
}
