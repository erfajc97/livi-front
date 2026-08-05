import AuthModalIsland from '@/app/features/auth/AuthModalIsland';
import AppProviders from '@/app/providers/AppProviders';
import { useNavbarHook } from '../../hooks/useNavbarHook';
import AnnouncementBar from './AnnouncementBar';
import PerfumesMegaMenu from './PerfumesMegaMenu';
import MobileMenu from './MobileMenu';
import NavbarSearch from './NavbarSearch';
import LiquidTabBar from './LiquidTabBar';

/* ── Iconos de línea fina (estilo Noir) ───────────────────────────────── */
const ico = 'h-[18px] w-[18px]';
const IconUser = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="9" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>
);
const IconHeart = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 20s-7-4.5-9-9.5C1.5 6.5 4.5 4 7.5 5 9 5.5 12 8 12 8s3-2.5 4.5-3c3-1 6 1.5 4.5 6.5-2 5-9 9.5-9 9.5z" /></svg>
);
const IconBag = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);


export default function Navbar() {
  const {
    itemCount,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    mobileOpen,
    setMobileOpen,
    openDropdown,
    setOpenDropdown,
    dropdownRef,
    pathname,
    handleDropdownEnter,
    handleDropdownLeave,
    handleDropdownContentEnter,
    handleDropdownContentLeave,
  } = useNavbarHook();

  const megaMode =
    openDropdown === 'perfumes' ? 'perfumes'
    : openDropdown === 'bajoPedido' ? 'bajoPedido'
    : null;

  // Enlace simple — DM Sans en versalitas, sin cambio de fuente/color al hover (ref. Atelier)
  const NavLink = ({ label, href, muted = false }: { label: string; href: string; muted?: boolean }) => (
    <a
      href={href}
      onMouseEnter={() => setOpenDropdown(null)}
      className={`cursor-pointer ${muted ? 'text-text-soft' : 'text-text'}`}
    >
      {label}
    </a>
  );

  // Trigger para items con mega menú (Perfumes / Bajo Pedido).
  // Solo el subrayado aparece al abrir el mega — la tipografía nunca cambia.
  const MegaTrigger = ({ id, label, href }: { id: string; label: string; href: string }) => (
    <span
      onMouseEnter={() => handleDropdownEnter(id)}
      onMouseLeave={handleDropdownLeave}
      className="relative flex cursor-pointer items-center gap-2 text-text"
    >
      <a href={href}>{label}</a>
      <svg
        className={`h-2.5 w-2.5 transition-transform ${openDropdown === id ? 'rotate-180' : ''}`}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span className={`absolute -bottom-2 left-0 right-4 h-px bg-text transition-opacity ${openDropdown === id ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  );

  return (
    <AppProviders withToaster>
      <header className="sticky top-0 z-40 bg-bg text-text">
        {/* Barra de promociones — textos administrables + flechas */}
        <AnnouncementBar />

        {/* Fila principal */}
        <div className="relative">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-4 md:grid-cols-[1fr_auto_1fr] md:gap-8 md:px-14 md:py-6">
            {/* Izquierda: nav desktop + hamburguesa móvil */}
            <div className="flex items-center">
              <button
                className="p-1 md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Menú"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  {mobileOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                    : <><path d="M3 7h18" /><path d="M3 17h18" /></>}
                </svg>
              </button>

              <nav
                className="hidden items-center gap-9 font-body text-xs uppercase tracking-[0.18em] md:flex"
                aria-label="Navegación principal"
              >
                <MegaTrigger id="perfumes" label="Perfumes" href="/catalogo/perfumes" />
                <NavLink label="Combos" href="/catalogo/combos" />
                <MegaTrigger id="bajoPedido" label="Bajo Pedido" href="/bajo-pedido" />
                <NavLink label="Journal" href="/blog" muted />
              </nav>
            </div>

            {/* Centro: logo */}
            <a href="/" className="justify-self-center text-text" aria-label="NönDecants — Inicio">
              <img
                src="/logonondecants.png"
                alt="NönDecants"
                width={543}
                height={127}
                className="h-6 w-auto sm:h-7 md:h-9"
              />
            </a>

            {/* Derecha: iconos */}
            <div
              className="flex items-center justify-end gap-5 text-text md:gap-6"
              onMouseEnter={() => setOpenDropdown(null)}
            >
              <NavbarSearch />
              {isAuthenticated ? (
                <a href="/mi-cuenta" className="hidden p-0.5 hover:text-accent md:block" aria-label="Mi cuenta">
                  <IconUser />
                </a>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="hidden p-0.5 hover:text-accent md:block" aria-label="Ingresar">
                  <IconUser />
                </button>
              )}
              <a href="/mi-cuenta" className="hidden p-0.5 hover:text-accent md:block" aria-label="Favoritos">
                <IconHeart />
              </a>
              <a href="/carrito" className="relative p-0.5 hover:text-accent" aria-label="Carrito">
                <IconBag />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex items-center justify-center rounded-full bg-text px-[5px] py-[1px] font-body text-[9px] font-medium text-bg">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </a>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Mega menú — Perfumes o Bajo Pedido */}
          {megaMode && (
            <PerfumesMegaMenu
              key={megaMode}
              mode={megaMode}
              onClose={() => setOpenDropdown(null)}
              dropdownRef={dropdownRef}
              onMouseEnter={handleDropdownContentEnter}
              onMouseLeave={handleDropdownContentLeave}
            />
          )}
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

      {/* Bottom tab líquida — experimento mobile */}
      <LiquidTabBar pathname={pathname} itemCount={itemCount} />

      <AuthModalIsland open={authOpen} onClose={() => setAuthOpen(false)} />
    </AppProviders>
  );
}
