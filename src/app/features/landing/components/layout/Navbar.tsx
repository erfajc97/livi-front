import LogoIconSvg from '@/assets/LogoIconSvg';
import CartDrawerIsland from '@/app/features/cart/CartDrawerIsland';
import AuthModalIsland from '@/app/features/auth/AuthModalIsland';
import AppProviders from '@/app/providers/AppProviders';
import { useNavbarHook, NAV_LINKS, isLinkActive } from '../../hooks/useNavbarHook';
import PerfumeDropdown from './PerfumeDropdown';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const {
    itemCount,
    setDrawerOpen,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    mobileOpen,
    setMobileOpen,
    perfumesOpen,
    setPerfumesOpen,
    activeCategory,
    setActiveCategory,
    dropdownRef,
    pathname,
    isScrolled,
  } = useNavbarHook();

  return (
    <AppProviders withToaster>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          pathname === '/' && !isScrolled ? 'bg-transparent' : 'bg-[--color-bg]'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6">

          {/* Logo */}
          <a href="/" className="shrink-0" aria-label="NönDecants — Inicio">
            <LogoIconSvg width={150} height={24} />
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-0.5 rounded-full bg-surface-raised px-1.5 py-1.5"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, pathname, link.exact);

              if (link.dropdown) {
                return (
                  <button
                    key={link.label}
                    onClick={() => setPerfumesOpen(!perfumesOpen)}
                    className={[
                      'flex items-center gap-1 rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-colors',
                      active || perfumesOpen ? 'bg-accent text-bg' : 'text-white hover:text-accent',
                    ].join(' ')}
                  >
                    {link.label}
                    <svg
                      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className={`transition-transform ${perfumesOpen ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                );
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setPerfumesOpen(false)}
                  className={[
                    'flex items-center gap-1 rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-colors',
                    active && !perfumesOpen ? 'bg-accent text-bg' : 'text-white hover:text-accent',
                  ].join(' ')}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Dropdown Bajo Pedido */}
          {perfumesOpen && (
            <PerfumeDropdown
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onClose={() => setPerfumesOpen(false)}
              dropdownRef={dropdownRef}
            />
          )}

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* Search */}
            <button
              className="hidden md:flex p-2 text-[--color-text-muted] transition-colors hover:text-[--color-accent-hover]"
              aria-label="Buscar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* User */}
            {isAuthenticated ? (
              <a
                href="/mi-cuenta"
                className="hidden md:flex p-2 text-[--color-text-muted] transition-colors hover:text-[--color-accent-hover]"
                aria-label="Mi cuenta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </a>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden md:flex p-2 text-[--color-text-muted] transition-colors hover:text-[--color-accent-hover]"
                aria-label="Ingresar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}

            {/* Favorites */}
            <button
              className="flex p-2 text-[--color-text-muted] transition-colors hover:text-[--color-accent-hover]"
              aria-label="Favoritos"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 text-[--color-text-muted] transition-colors hover:text-[--color-accent-hover]"
              aria-label="Carrito"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[--color-accent] font-bold text-[9px] text-[--color-bg]">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="p-2 text-[--color-text-muted] transition-colors hover:text-[--color-text] md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menú"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <MobileMenu
            pathname={pathname}
            isAuthenticated={isAuthenticated}
            onAuthOpen={() => setAuthOpen(true)}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </header>

      <CartDrawerIsland />
      <AuthModalIsland open={authOpen} onClose={() => setAuthOpen(false)} />
    </AppProviders>
  );
}
