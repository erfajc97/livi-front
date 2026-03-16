import { NAV_LINKS, isLinkActive } from '../../hooks/useNavbarHook';

interface MobileMenuProps {
  pathname: string;
  isAuthenticated: boolean;
  onAuthOpen: () => void;
  onClose: () => void;
}

export default function MobileMenu({ pathname, isAuthenticated, onAuthOpen, onClose }: MobileMenuProps) {
  return (
    <div className="border-t border-[--color-border] bg-[--color-surface] px-4 py-4 md:hidden">
      <div className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => {
          const active = isLinkActive(link.href, pathname, link.exact);
          return (
            <a
              key={link.label}
              href={link.href}
              className={[
                'flex items-center gap-2 rounded-lg px-3 py-2.5 font-heading text-sm transition-colors',
                active ? 'bg-accent text-bg' : 'text-white hover:text-accent',
              ].join(' ')}
            >
              {link.label}
              {link.dropdown && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              )}
            </a>
          );
        })}
      </div>
      <div className="mt-3 border-t border-[--color-border] pt-3">
        {isAuthenticated ? (
          <a href="/mi-cuenta" className="block font-heading text-xs uppercase tracking-wider text-[--color-accent]">
            Mi cuenta
          </a>
        ) : (
          <button
            onClick={() => { onAuthOpen(); onClose(); }}
            className="font-heading text-xs uppercase tracking-wider text-[--color-accent]"
          >
            Ingresar
          </button>
        )}
      </div>
    </div>
  );
}
