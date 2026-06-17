import { useState } from 'react';
import { NAV_LINKS, isLinkActive } from '../../hooks/useNavbarHook';
import { useNormalCategoriesQuery, useBajoPedidoCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';

interface MobileMenuProps {
  pathname: string;
  isAuthenticated: boolean;
  onAuthOpen: () => void;
  onClose: () => void;
}

export default function MobileMenu({ pathname, isAuthenticated, onAuthOpen, onClose }: MobileMenuProps) {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const { data: normalCategories = [] } = useNormalCategoriesQuery();
  const { data: bajoPedidoCategories = [] } = useBajoPedidoCategoriesQuery();

  return (
    <div className="border-t border-border bg-bg px-4 py-4 md:hidden max-h-[70vh] overflow-y-auto">
      <div className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => {
          const active = isLinkActive(link.href, pathname, link.exact);

          if (link.dropdown) {
            const isExpanded = expandedDropdown === link.dropdownId;
            const categories = link.dropdownId === 'perfumes'
              ? normalCategories.filter((c) => c.name.toLowerCase() !== 'all')
              : bajoPedidoCategories.filter((c) => c.name.toLowerCase() !== 'all');
            const basePath = link.dropdownId === 'perfumes' ? '/catalogo/perfumes' : '/bajo-pedido';

            return (
              <div key={link.label}>
                <button
                  onClick={() => setExpandedDropdown(isExpanded ? null : link.dropdownId!)}
                  className={[
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-heading text-sm transition-colors',
                    active || isExpanded ? 'bg-accent text-bg' : 'text-text hover:text-accent',
                  ].join(' ')}
                >
                  {link.label}
                  <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {isExpanded && (
                  <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-accent/30 pl-3">
                    <a
                      href={basePath}
                      onClick={onClose}
                      className="rounded-md px-3 py-2 text-sm font-semibold text-accent"
                    >
                      Ver Todos
                    </a>
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <span className="block px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                          {cat.name}
                        </span>
                        {cat.marcas.map((sub) => (
                          <a
                            key={sub.id}
                            href={`${basePath}?category=${cat.id}&marca=${sub.id}`}
                            onClick={onClose}
                            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-text-soft hover:text-accent transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    ))}
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
              className={[
                'flex items-center gap-2 rounded-lg px-3 py-2.5 font-heading text-sm transition-colors',
                active ? 'bg-accent text-bg' : 'text-text hover:text-accent',
              ].join(' ')}
            >
              {link.label}
            </a>
          );
        })}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        {isAuthenticated ? (
          <a href="/mi-cuenta" className="block font-heading text-xs uppercase tracking-wider text-accent">
            Mi cuenta
          </a>
        ) : (
          <button
            onClick={() => { onAuthOpen(); onClose(); }}
            className="font-heading text-xs uppercase tracking-wider text-accent"
          >
            Ingresar
          </button>
        )}
      </div>
    </div>
  );
}
