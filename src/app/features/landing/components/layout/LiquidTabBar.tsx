import { useState } from 'react';

/* ── Bottom tab "atomizador decant" — mobile ─────────────────────────────
   La barra ES un atomizador decant (imagen IA, /tabbar-atomizer.webp):
   tapón dorado a la izquierda y cuerpo de vidrio oscuro. Dentro del vidrio
   va una capa de LÍQUIDO ÁMBAR ANIMADA en loop continuo: relleno con
   gradiente + dos ondas senoidales que derivan en la superficie + brillo
   que recorre el líquido. Los tabs van en HTML encima. Si la imagen no
   carga, se cae a la cápsula oscura clásica. Solo mobile; oculta en PDP
   y checkout. */

interface LiquidTabBarProps {
  pathname: string;
  itemCount?: number;
}

const ico = 'h-[18px] w-[18px]';
const IconHome = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const IconVial = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2h6" /><path d="M10 2v5l-3.5 6.5A4 4 0 0 0 10 21h4a4 4 0 0 0 3.5-7.5L14 7V2" /><path d="M8.2 13h7.6" /></svg>
);
const IconGift = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h18v4H3z" /><path d="M5 12v9h14v-9" /><path d="M12 8v13" /><path d="M12 8s-4 0-4-2.5S12 3 12 5c0-2 4-2.5 4 .5S12 8 12 8z" /></svg>
);
const IconTruck = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h12v10H2z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="6.5" cy="17.5" r="1.6" /><circle cx="16.5" cy="17.5" r="1.6" /></svg>
);
const IconArticle = () => (
  <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h13v16H6a2 2 0 0 1-2-2V4z" /><path d="M17 8h3v10a2 2 0 0 1-2 2" /><path d="M7 8h7M7 12h7M7 16h4" /></svg>
);

const TABS = [
  { id: 'inicio', label: 'Inicio', href: '/', Icon: IconHome },
  { id: 'perfumes', label: 'Perfumes', href: '/catalogo/perfumes', Icon: IconVial },
  { id: 'combos', label: 'Combos', href: '/catalogo/combos', Icon: IconGift },
  { id: 'pedidos', label: 'Bajo Pedido', href: '/bajo-pedido', Icon: IconTruck },
  { id: 'blogs', label: 'Blogs', href: '/blog', Icon: IconArticle },
] as const;

/* Ondas de la superficie — crestas asimétricas (subida rápida, caída
   suave) como agua real, longitud de onda de 50 unidades; el bucle
   translateX(-50%) es perfectamente continuo. LINE es la misma curva sin
   relleno para dibujar el brillo especular de la cresta. */
const WAVE_A_CURVE =
  'M0 20 C 9 5 16 5 25 20 C 34 35 41 35 50 20 C 59 5 66 5 75 20 C 84 35 91 35 100 20 C 109 5 116 5 125 20 C 134 35 141 35 150 20 C 159 5 166 5 175 20 C 184 35 191 35 200 20';
const WAVE_A = `${WAVE_A_CURVE} V40 H0 Z`;
const WAVE_B_CURVE =
  'M0 23 C 8 12 17 12 25 23 C 33 34 42 34 50 23 C 58 12 67 12 75 23 C 83 34 92 34 100 23 C 108 12 117 12 125 23 C 133 34 142 34 150 23 C 158 12 167 12 175 23 C 183 34 192 34 200 23';
const WAVE_B = `${WAVE_B_CURVE} V40 H0 Z`;

export default function LiquidTabBar({ pathname }: LiquidTabBarProps) {
  const [imgOk, setImgOk] = useState(true);

  // PDP y checkout ya tienen su propia barra fija de conversión
  if (pathname.startsWith('/producto') || pathname.startsWith('/checkout')) {
    return null;
  }

  const activeId = (() => {
    if (pathname.startsWith('/catalogo/perfumes')) return 'perfumes';
    if (pathname.startsWith('/catalogo/combos') || pathname.startsWith('/combo')) return 'combos';
    if (pathname.startsWith('/bajo-pedido')) return 'pedidos';
    if (pathname.startsWith('/blog')) return 'blogs';
    if (pathname === '/') return 'inicio';
    return '';
  })();

  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: 'env(safe-area-inset-bottom)' }}
    >
      <style>{`
        .ltb-glow { animation: ltb-glowk 2.6s ease-in-out infinite; }
        @keyframes ltb-glowk { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
        .ltb-wave { position: absolute; left: 0; width: 200%; height: 100%; animation: ltb-drift 7s linear infinite; }
        .ltb-wave-b { animation-duration: 11s; animation-direction: reverse; }
        @keyframes ltb-drift { to { transform: translateX(-50%); } }
        .ltb-tilt { animation: ltb-tiltk 5.4s ease-in-out infinite; transform-origin: 50% 100%; }
        @keyframes ltb-tiltk { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }
        .ltb-bob { animation: ltb-bobk 4.2s ease-in-out infinite; }
        @keyframes ltb-bobk { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .ltb-shine { animation: ltb-shinek 6.5s linear infinite; }
        @keyframes ltb-shinek { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
      `}</style>

      {/* Atomizador decant — la imagen ES la barra */}
      <div
        className="relative w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]"
        style={{ aspectRatio: '1009 / 188' }}
      >
        {imgOk ? (
          <img
            src="/tabbar-atomizer.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full select-none"
            draggable={false}
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className="absolute inset-0 rounded-full border border-[#C9A227]/55 bg-[#14100C]" aria-hidden />
        )}

        {/* Líquido ámbar vivo — dentro del vidrio, loop continuo */}
        <div
          className="pointer-events-none absolute overflow-hidden"
          style={{ left: '19%', right: '2.6%', top: '10%', bottom: '11%', borderRadius: '0 999px 999px 0' }}
          aria-hidden
        >
          {/* cuerpo del líquido con oleaje suave + balanceo */}
          <div className="ltb-bob absolute inset-x-0 bottom-0" style={{ height: '64%' }}>
            <div className="ltb-tilt absolute inset-0">
            {/* relleno base: tinte ámbar casi transparente */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(238,150,42,0.05) 0%, rgba(202,110,24,0.08) 45%, rgba(140,60,12,0.12) 100%)' }}
            />
            {/* ondas de la superficie — crestas asimétricas + brillo especular */}
            <div className="absolute -top-[16%] left-0 h-[34%] w-full">
              <svg className="ltb-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d={WAVE_A} fill="#f4a83e" fillOpacity="0.12" />
                <path d={WAVE_A_CURVE} fill="none" stroke="#ffe6b0" strokeOpacity="0.28" strokeWidth="1.1" />
              </svg>
              <svg className="ltb-wave ltb-wave-b" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d={WAVE_B} fill="#ffd98a" fillOpacity="0.07" />
                <path d={WAVE_B_CURVE} fill="none" stroke="#fff0c8" strokeOpacity="0.16" strokeWidth="0.9" />
              </svg>
            </div>
            {/* brillo que recorre el líquido */}
            <div
              className="ltb-shine absolute inset-y-0 w-[40%]"
              style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,226,160,0.06) 50%, transparent 100%)' }}
            />
            </div>
          </div>
        </div>

        {/* Tabs — sobre el cuerpo de vidrio, libre del tapón (~19% izq.) */}
        <div className="absolute inset-0 z-10 grid grid-cols-5 items-center pl-[21%] pr-[3%]">
          {TABS.map(({ id, label, href, Icon }) => {
            const active = activeId === id;
            return (
              <a
                key={id}
                href={href}
                className={`relative flex flex-col items-center gap-[3px] py-2 transition-colors ${
                  active ? 'text-[#F8E3AC]' : 'text-[#c8a87a]'
                }`}
              >
                {active && (
                  <span className="ltb-glow pointer-events-none absolute inset-x-2 top-1/2 h-9 -translate-y-1/2 rounded-full bg-[#E8C766]/25 blur-md" />
                )}
                <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  <Icon />
                </span>
                <span className="relative text-center font-body text-[7px] uppercase leading-[1.25] tracking-[0.14em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  {label}
                </span>
                {active && <span className="relative h-[2px] w-4 rounded-full bg-[#E8C766]" />}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
