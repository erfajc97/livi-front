import { useState } from 'react';

/* ── Bottom tab "vial líquido" — experimento mobile ──────────────────────
   Cápsula oscura tipo vial de perfume con una onda de líquido dorado que
   fluye constantemente y "salpica" al tocar un tab. Solo se muestra en
   mobile; se oculta en PDP y checkout, que ya tienen sus propias barras
   fijas de conversión. La lógica de navegación es la misma de siempre:
   enlaces normales del sitio + contador del carrito. */

interface LiquidTabBarProps {
  pathname: string;
  itemCount: number;
}

const ico = 'h-[18px] w-[18px]';
const IconHome = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const IconBottle = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4v3l2 3v13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8l2-3V2z" /><path d="M8 13h8" /></svg>
);
const IconVial = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2h6" /><path d="M10 2v5l-3.5 6.5A4 4 0 0 0 10 21h4a4 4 0 0 0 3.5-7.5L14 7V2" /><path d="M8.2 13h7.6" /></svg>
);
const IconTag = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h8l10 10-8 8L3 11V3z" /><circle cx="8" cy="8" r="1.4" /></svg>
);
const IconBag = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);

const TABS = [
  { id: 'inicio', label: 'Inicio', href: '/', Icon: IconHome },
  { id: 'marcas', label: 'Marcas', href: '/catalogo', Icon: IconBottle },
  { id: 'decants', label: 'Decants', href: '/catalogo/perfumes', Icon: IconVial },
  { id: 'ofertas', label: 'Ofertas', href: '/catalogo/perfumes?descuento=1', Icon: IconTag },
  { id: 'carrito', label: 'Carrito', href: '/carrito', Icon: IconBag },
] as const;

/* Onda senoidal que se repite cada 200 unidades — al animar translateX(-50%)
   el bucle es perfectamente continuo. La superficie queda baja (~bottom 20%)
   para que el líquido no tape las etiquetas de los tabs. */
const WAVE_A =
  'M0 50 Q50 40 100 50 T200 50 T300 50 T400 50 T500 50 T600 50 T700 50 T800 50 V64 H0 Z';
const WAVE_B =
  'M0 53 Q50 46 100 53 T200 53 T300 53 T400 53 T500 53 T600 53 T700 53 T800 53 V64 H0 Z';

export default function LiquidTabBar({ pathname, itemCount }: LiquidTabBarProps) {
  const [slosh, setSlosh] = useState(0);
  const [videoOk, setVideoOk] = useState(true);

  // PDP y checkout ya tienen su propia barra fija de conversión
  if (pathname.startsWith('/producto') || pathname.startsWith('/checkout')) {
    return null;
  }

  const search = typeof window !== 'undefined' ? window.location.search : '';
  const activeId = (() => {
    if (pathname.startsWith('/carrito')) return 'carrito';
    if (pathname.startsWith('/catalogo/perfumes')) {
      return search.includes('descuento=1') ? 'ofertas' : 'decants';
    }
    if (pathname.startsWith('/catalogo')) return 'marcas';
    if (pathname === '/') return 'inicio';
    return '';
  })();

  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <style>{`
        .ltb-waves { position: absolute; inset: 0; }
        .ltb-wave { position: absolute; left: 0; bottom: 0; width: 200%; height: 100%; animation: ltb-drift 9s linear infinite; }
        .ltb-wave-b { animation-duration: 14s; animation-direction: reverse; }
        @keyframes ltb-drift { to { transform: translateX(-50%); } }
        .ltb-slosh { animation: ltb-sloshk 0.9s ease-out; }
        @keyframes ltb-sloshk {
          0% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(-9px) scaleY(1.8); }
          60% { transform: translateY(3px) scaleY(0.85); }
          100% { transform: translateY(0) scaleY(1); }
        }
        .ltb-glow { animation: ltb-glowk 2.6s ease-in-out infinite; }
        @keyframes ltb-glowk { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
      `}</style>

      {/* Vial decant horizontal — tapón atomizador dorado + cuerpo de vidrio */}
      <div className="flex items-center">
        {/* Tapón atomizador (izquierda) — cilindro dorado con boquilla y anillos */}
        <div className="relative z-20 -mr-2.5 h-[62px] w-[46px] shrink-0 drop-shadow-[0_10px_14px_rgba(0,0,0,0.55)]" aria-hidden>
          <div className="absolute inset-0 rounded-l-[16px] rounded-r-[7px] bg-[linear-gradient(180deg,#f7e3a1_0%,#ddb84e_20%,#9c7422_42%,#5f4512_58%,#a8802a_78%,#f0d588_100%)]" />
          {/* brillo lateral del cilindro */}
          <span className="absolute inset-y-1 left-[5px] w-[5px] rounded-full bg-white/35 blur-[2px]" />
          {/* boquilla del spray */}
          <span className="absolute left-[10px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-[#0b0906] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]" />
          {/* anillos de unión con el cuerpo */}
          <span className="absolute inset-y-[7px] right-[4px] w-[3px] rounded-full bg-[#f0d588]/80" />
          <span className="absolute inset-y-[10px] right-[10px] w-[2px] rounded-full bg-[#4a360e]" />
        </div>

        {/* Cuerpo del vial */}
        <div className="relative flex-1 overflow-hidden rounded-full border border-[#C9A227]/55 bg-[#14100C] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]">

        {/* Video de líquido real (Higgsfield) — textura viva dentro del vial.
            Si falla la carga, se oculta y quedan las ondas SVG como fallback. */}
        {videoOk && (
          <>
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
              src="/videos/liquid-tabbar.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
              onError={() => setVideoOk(false)}
            />
            {/* Oscurece la zona de los iconos para mantener la legibilidad */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#14100C]/75 via-[#14100C]/25 to-transparent" />
          </>
        )}

        {/* Líquido dorado — fluye siempre y salpica al tocar */}
        <div key={slosh} className={`ltb-waves ${slosh > 0 ? 'ltb-slosh' : ''}`} aria-hidden>
          <svg className="ltb-wave" viewBox="0 0 800 64" preserveAspectRatio="none">
            <path d={WAVE_A} fill="#C9A227" fillOpacity="0.5" />
          </svg>
          <svg className="ltb-wave ltb-wave-b" viewBox="0 0 800 64" preserveAspectRatio="none">
            <path d={WAVE_B} fill="#E8C766" fillOpacity="0.28" />
          </svg>
        </div>

        {/* Tabs */}
        <div className="relative z-10 grid grid-cols-5 pl-4">
          {TABS.map(({ id, label, href, Icon }) => {
            const active = activeId === id;
            return (
              <a
                key={id}
                href={href}
                onClick={() => setSlosh((s) => s + 1)}
                className={`relative flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  active ? 'text-[#F0D588]' : 'text-[#8d7c5f]'
                }`}
              >
                {active && (
                  <span className="ltb-glow pointer-events-none absolute inset-x-3 top-1 h-7 rounded-full bg-[#E8C766]/25 blur-md" />
                )}
                <span className="relative">
                  <Icon />
                  {id === 'carrito' && itemCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex min-w-[14px] items-center justify-center rounded-full bg-[#E8C766] px-[3px] py-[1px] font-body text-[8px] font-semibold text-[#14100C]">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </span>
                <span className="relative font-body text-[8px] uppercase tracking-[0.18em]">{label}</span>
                {active && <span className="relative h-[2px] w-4 rounded-full bg-[#E8C766]" />}
              </a>
            );
          })}
        </div>
      </div>
      </div>
    </nav>
  );
}
