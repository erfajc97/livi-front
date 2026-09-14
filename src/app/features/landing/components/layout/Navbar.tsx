import { useEffect, useState } from 'react';
import AuthModalIsland from '@/app/features/auth/AuthModalIsland';
import CartDrawer from '@/app/features/cart/components/CartDrawer';
import { useCartStore } from '@/app/store/cart/cartStore';
import AppProviders from '@/app/providers/AppProviders';
import { useNavbarHook, isLinkActive } from '../../hooks/useNavbarHook';
import AnnouncementBar from './AnnouncementBar';
import MobileMenu from './MobileMenu';
import NavbarSearch from './NavbarSearch';

/**
 * Navbar LIVI — dirección de arte del PDF:
 * barra de anuncios burgundy, fila principal butter con links mono en
 * mayúsculas a la izquierda, wordmark centrado y BUSCAR / CUENTA /
 * CARRITO (n) a la derecha. Sin mega menú ni tab bar inferior.
 * Tras el scroll (ref. PDF navegación B): sombra mínima y logo reducido;
 * el carrito con piezas se vuelve píldora burgundy.
 */
export default function Navbar() {
  const {
    itemCount,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    mobileOpen,
    setMobileOpen,
    pathname,
  } = useNavbarHook();

  const [scrolled, setScrolled] = useState(false);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const NAV = [
    { href: '/catalogo', label: 'Tienda' },
    { href: '/nuestra-historia', label: 'Nuestra Historia' },
    { href: '/el-taller', label: 'El Taller' },
  ];

  const linkCls = (href: string) =>
    `font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-accent ${
      isLinkActive(href, pathname, href === '/')
        ? 'text-text underline underline-offset-8 decoration-2'
        : 'text-text'
    }`;

  return (
    <AppProviders withToaster>
      <header
        className={`sticky top-0 z-40 bg-bg text-text transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_14px_rgba(35,24,21,0.10)]' : ''
        }`}
      >
        {/* Barra burgundy — textos administrables desde el admin */}
        <AnnouncementBar />

        {/* Fila principal */}
        <div className="relative border-b border-border">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-4 md:grid-cols-[1fr_auto_1fr] md:gap-8 md:px-14 md:py-5">
            {/* Izquierda: hamburguesa móvil + links desktop */}
            <div className="flex items-center">
              <button
                className="flex items-center gap-2 p-1 font-mono text-[11px] uppercase tracking-[0.18em] md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Menú"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  {mobileOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                    : <><path d="M3 7h18" /><path d="M3 17h18" /></>}
                </svg>
                <span>Menú</span>
              </button>

              <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
                {NAV.map((l) => (
                  <a key={l.href} href={l.href} className={linkCls(l.href)}>
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Centro: wordmark — se reduce tras el scroll (ref. PDF nav B) */}
            <a href="/" className="justify-self-center text-text" aria-label="LIVI — Inicio">
              <img
                src="/logo-livi.svg"
                alt="LIVI"
                width={260}
                height={64}
                className={`w-auto transition-all duration-300 ${
                  scrolled ? 'h-6 sm:h-6 md:h-7' : 'h-7 sm:h-8 md:h-9'
                }`}
              />
            </a>

            {/* Derecha: utilidades en mono */}
            <div className="flex items-center justify-end gap-6 md:gap-7">
              <NavbarSearch />
              {isAuthenticated ? (
                <a href="/mi-cuenta" className="hidden font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-accent md:block">
                  Cuenta
                </a>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="hidden font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-accent md:block">
                  Cuenta
                </button>
              )}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir carrito"
                className={
                  itemCount > 0
                    ? 'bg-accent px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition-colors hover:bg-accent-hover'
                    : 'font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-accent'
                }
              >
                Carrito ({itemCount})
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileOpen && (
          <MobileMenu
            pathname={pathname}
            isAuthenticated={isAuthenticated}
            onAuthOpen={() => setAuthOpen(true)}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </header>

      <AuthModalIsland open={authOpen} onClose={() => setAuthOpen(false)} />
      <CartDrawer />
    </AppProviders>
  );
}
