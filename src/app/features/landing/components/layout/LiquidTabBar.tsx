/* ── Bottom tab móvil — LIVI ─────────────────────────────────────────────
   Cápsula espresso con texto butter, sobria y editorial. Solo mobile;
   oculta en PDP y checkout (esas páginas tienen su propia barra fija de
   conversión). */

interface LiquidTabBarProps {
  pathname: string;
  itemCount?: number;
  /** Con sesión la pestaña "Cuenta" navega a /mi-cuenta;
      sin sesión abre el modal de login (que incluye crear cuenta). */
  isAuthenticated?: boolean;
  onAuthOpen?: () => void;
}

const ico = 'h-[18px] w-[18px]';
const IconHome = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const IconBag = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
const IconTruck = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h12v10H2z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="6.5" cy="17.5" r="1.6" /><circle cx="16.5" cy="17.5" r="1.6" /></svg>
);
const IconUser = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>
);

const TABS = [
  { id: 'inicio', label: 'Inicio', href: '/', Icon: IconHome },
  { id: 'tienda', label: 'Tienda', href: '/catalogo', Icon: IconBag },
  { id: 'rastrear', label: 'Rastrear', href: '/rastrear', Icon: IconTruck },
  { id: 'cuenta', label: 'Cuenta', href: '/mi-cuenta', Icon: IconUser },
] as const;

export default function LiquidTabBar({ pathname, isAuthenticated = false, onAuthOpen }: LiquidTabBarProps) {
  // PDP y checkout ya tienen su propia barra fija de conversión
  if (pathname.startsWith('/producto') || pathname.startsWith('/checkout')) {
    return null;
  }

  const activeId = (() => {
    if (pathname.startsWith('/catalogo')) return 'tienda';
    if (pathname.startsWith('/rastrear') || pathname.startsWith('/orden')) return 'rastrear';
    if (pathname.startsWith('/mi-cuenta')) return 'cuenta';
    if (pathname === '/') return 'inicio';
    return '';
  })();

  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative w-full rounded-full border border-[#4D0E12]/40 bg-[#231815] shadow-[0_18px_30px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-4 items-center px-2 py-2.5">
          {TABS.map(({ id, label, href, Icon }) => {
            const active = activeId === id;
            return (
              <a
                key={id}
                href={href}
                onClick={
                  id === 'cuenta' && !isAuthenticated
                    ? (e) => {
                        e.preventDefault();
                        onAuthOpen?.();
                      }
                    : undefined
                }
                className={`relative flex flex-col items-center gap-[3px] py-1 transition-colors ${
                  active ? 'text-[#F5EFC6]' : 'text-[#E9E3D7]/60'
                }`}
              >
                <Icon />
                <span className="text-center font-body text-[8px] uppercase leading-[1.25] tracking-[0.14em]">
                  {label}
                </span>
                {active && <span className="h-[2px] w-4 rounded-full bg-[#F5EFC6]" />}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
