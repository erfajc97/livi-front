import { isLinkActive } from '../../hooks/useNavbarHook';

interface MobileMenuProps {
  pathname: string;
  isAuthenticated?: boolean;
  onAuthOpen?: () => void;
  onClose: () => void;
}

// Grupos del menú overlay (ref. PDF navegación C):
// COMPRAR → categorías de la tienda · LIVI → páginas de marca.
const COMPRAR = [
  { href: '/catalogo?categoria=panaleras', label: 'Pañaleras' },
  { href: '/catalogo?categoria=mochilas', label: 'Mochilas' },
  { href: '/catalogo?categoria=accesorios', label: 'Accesorios' },
  { href: '/catalogo', label: 'Todo' },
];

const LIVI_LINKS = [
  { href: '/nuestra-historia', label: 'Nuestra historia' },
  { href: '/el-taller', label: 'El taller' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/blog', label: 'Blog' },
];

/**
 * Menú overlay LIVI — cubre la pantalla en burgundy con los dos grupos
 * editoriales y la pieza destacada. Entra con fundido (ref. PDF nav C).
 */
export default function MobileMenu({ pathname, isAuthenticated, onAuthOpen, onClose }: MobileMenuProps) {
  const linkCls = (href: string) =>
    `block py-1.5 font-display text-3xl font-light leading-tight tracking-[-0.01em] transition-colors ${
      isLinkActive(href, pathname, false) ? 'text-[#F5EFC6] italic' : 'text-[#F5EFC6]/85 hover:text-[#F5EFC6]'
    }`;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-accent text-[#F5EFC6] md:hidden">
      {/* Barra superior del overlay */}
      <div className="flex items-center justify-between px-6 py-4">
        <img src="/logo-livi-reversed.svg" alt="LIVI Ecuador" className="h-8 w-auto" />
        <button
          onClick={onClose}
          aria-label="Cerrar menú"
          className="p-2 text-[#F5EFC6]/80 transition-colors hover:text-[#F5EFC6]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-10 px-6 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* COMPRAR */}
          <nav aria-label="Comprar">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#F5EFC6]/50">
              Comprar
            </p>
            {COMPRAR.map((l) => (
              <a key={l.label} href={l.href} onClick={onClose} className={linkCls(l.href)}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* LIVI */}
          <nav aria-label="LIVI">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#F5EFC6]/50">
              LIVI
            </p>
            {LIVI_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={onClose} className={linkCls(l.href)}>
                {l.label}
              </a>
            ))}
            {isAuthenticated ? (
              <a href="/mi-cuenta" onClick={onClose} className={linkCls('/mi-cuenta')}>
                Mi cuenta
              </a>
            ) : (
              <button
                onClick={() => { onClose(); onAuthOpen?.(); }}
                className={`${linkCls('/mi-cuenta')} text-left`}
              >
                Mi cuenta
              </button>
            )}
          </nav>
        </div>

        {/* Pieza destacada */}
        <a href="/producto/2-olivia-maxi-tote" onClick={onClose} className="group block">
          <div className="overflow-hidden">
            <img
              src="/productos/olivia-interior-1.jpg"
              alt="Interior de la Olivia Maxi Tote"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-[#F5EFC6]/60">
            Nuevo · Tote espresso
          </p>
        </a>
      </div>

      {/* Caballito de cierre */}
      <div className="flex items-center justify-center gap-5 px-6 pb-10" aria-hidden="true">
        <span className="h-px w-16 bg-[#F5EFC6]/40" />
        <img src="/caballito-butter.png" alt="" width="38" height="31" className="h-[31px] w-[38px] object-contain" />
        <span className="h-px w-16 bg-[#F5EFC6]/40" />
      </div>
    </div>
  );
}
