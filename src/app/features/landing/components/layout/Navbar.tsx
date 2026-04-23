import LogoIconSvg from '@/assets/LogoIconSvg';
import CartDrawerIsland from '@/app/features/cart/CartDrawerIsland';
import AuthModalIsland from '@/app/features/auth/AuthModalIsland';
import AppProviders from '@/app/providers/AppProviders';
import { useNavbarHook, NAV_LINKS, isLinkActive } from '../../hooks/useNavbarHook';
import PerfumeDropdown from './PerfumeDropdown';
import PerfumesMenuDropdown from './PerfumesMenuDropdown';
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
    openDropdown,
    setOpenDropdown,
    activeCategory,
    setActiveCategory,
    dropdownRef,
    pathname,
    isScrolled,
    handleDropdownEnter,
    handleDropdownLeave,
    handleDropdownContentEnter,
    handleDropdownContentLeave,
  } = useNavbarHook();

  // Determinar si usar tema claro (dorado sobre oscuro)
  const isLightTheme = pathname === '/' && !isScrolled;
  const iconColor = isLightTheme ? '#E5E7EB' : '#CCB377';

  return (
    <AppProviders withToaster>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isLightTheme
            ? 'bg-transparent'
            : 'bg-[--color-bg]/95 backdrop-blur-md shadow-sm border-b border-white/5'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6">

          {/* Logo */}
          <a href="/" className="shrink-0" aria-label="NönDecants — Inicio">
            <LogoIconSvg
              width={200}
              height={32}
              color={isLightTheme ? 'white' : '#CCB377'}
            />
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-0.5 rounded-full bg-surface-raised px-1.5 py-1.5"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, pathname, link.exact);

              if (link.dropdown) {
                const isOpen = openDropdown === link.dropdownId;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(link.dropdownId)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      className={[
                        'flex items-center gap-1 rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-colors',
                        active || isOpen ? 'bg-accent text-bg' : 'text-white hover:text-accent',
                      ].join(' ')}
                    >
                      {link.label}
                      <svg
                        width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                  </div>
                );
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpenDropdown(null)}
                  className={[
                    'flex items-center gap-1 rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-colors',
                    active && !openDropdown ? 'bg-accent text-bg' : 'text-white hover:text-accent',
                  ].join(' ')}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Dropdown: Perfumes (dynamic categories) */}
          {openDropdown === 'perfumes' && (
            <PerfumesMenuDropdown
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onClose={() => setOpenDropdown(null)}
              dropdownRef={dropdownRef}
              onMouseEnter={handleDropdownContentEnter}
              onMouseLeave={handleDropdownContentLeave}
            />
          )}

          {/* Dropdown: Bajo Pedido (static categories) */}
          {openDropdown === 'bajoPedido' && (
            <PerfumeDropdown
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onClose={() => setOpenDropdown(null)}
              dropdownRef={dropdownRef}
              onMouseEnter={handleDropdownContentEnter}
              onMouseLeave={handleDropdownContentLeave}
            />
          )}

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* User */}
            {isAuthenticated ? (
              <a
                href="/mi-cuenta"
                className="hidden md:flex p-2.5 transition-colors hover:opacity-80"
                style={{ color: iconColor }}
                aria-label="Mi cuenta"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </a>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden md:flex p-2.5 transition-colors hover:opacity-80"
                style={{ color: iconColor }}
                aria-label="Ingresar"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2.5 transition-colors hover:opacity-80"
              style={{ color: iconColor }}
              aria-label="Carrito"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold font-bold text-[10px] text-brand-black">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="p-2.5 transition-colors hover:opacity-80 md:hidden"
              style={{ color: iconColor }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
