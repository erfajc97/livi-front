import { useEffect, useRef, useState } from 'react';
import ShieldCheckLineIcon from '@/assets/svg/ShieldCheckLineIcon';
import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import BottlesFrameLineIcon from '@/assets/svg/BottlesFrameLineIcon';
import GlobeSearchLineIcon from '@/assets/svg/GlobeSearchLineIcon';

/* Los cuatro pilares aprobados (REQ-057). "Devolución en 7 días" salió y entró
   "Más de 300 referencias", que es un número real del catálogo. La clase de
   animación es la que le da a cada ícono su gesto propio (REQ-061). */
const COMMITMENTS = [
  {
    Icon: ShieldCheckLineIcon,
    title: 'Autenticidad\ngarantizada',
    text: 'Cada decant es revisado por nosotros.',
    motion: 'commit-icon--seal',
  },
  {
    Icon: TruckLineIcon,
    title: 'Envíos por\nServientrega',
    text: 'Recíbelo entre 24 y 72 horas.',
    motion: 'commit-icon--drive',
  },
  {
    Icon: BottlesFrameLineIcon,
    title: 'Más de 300\nreferencias',
    text: 'Un catálogo pensado, disponible para ti.',
    motion: 'commit-icon--rise',
  },
  {
    Icon: GlobeSearchLineIcon,
    title: 'Fragancias\npor encargo',
    text: 'Encontramos perfumes de todo el mundo.',
    motion: 'commit-icon--search',
  },
];

/**
 * "Nuestro compromiso" (REQ-057) — cuatro pilares sobre fondo crema plano,
 * íconos de línea fina y separadores verticales sutiles. Sin placas de vidrio
 * ni gotas doradas: la referencia aprobada es minimalista.
 *
 * Al entrar en pantalla, cada ícono hace su micro-animación (REQ-061): una sola
 * vez, escalonadas y con un gesto que refuerza su significado. Se respeta
 * `prefers-reduced-motion`.
 */
export default function CommitmentStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect(); // sin loops: se dispara una sola vez
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="shrink-0 border-t border-border bg-bg-alt">
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-12 md:py-12">
        {/* Mismo tratamiento que los títulos de banner y de sección */}
        <div className="mb-7 flex items-center justify-center gap-4 md:mb-10">
          <span className="h-px w-8 bg-border" />
          <h2 className="font-display text-2xl font-light italic leading-none tracking-[-0.01em] text-text md:text-3xl">
            Nuestro compromiso
          </h2>
          <span className="h-px w-8 bg-border" />
        </div>

        {/* Los cuatro pilares en UNA sola fila, también en móvil (ANX-A),
            separados por líneas verticales sutiles */}
        <div className="grid grid-cols-4">
          {COMMITMENTS.map(({ Icon, title, text, motion }, i) => (
            <div
              key={title}
              className={`flex flex-col items-center px-1.5 text-center sm:px-4 md:px-8 ${
                i > 0 ? 'border-l border-border' : ''
              }`}
            >
              <span
                className={`text-text-soft ${visible ? `commit-icon ${motion}` : 'opacity-0'}`}
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <Icon size={22} className="sm:hidden" />
                <Icon size={30} className="hidden sm:block md:hidden" />
                <Icon size={38} className="hidden md:block" />
              </span>

              <h3 className="mt-2.5 whitespace-pre-line font-display text-[10px] font-light uppercase leading-tight tracking-[0.08em] text-text sm:text-sm sm:tracking-[0.12em] md:mt-5 md:text-lg">
                {title}
              </h3>
              {/* En tinta, no en gris: a este tamaño el gris sobre marfil
                  quedaba ilegible. Se mantiene el cuerpo pequeño. */}
              <p className="mt-1.5 line-clamp-3 font-display text-[9px] italic leading-snug text-text sm:line-clamp-none sm:text-xs md:mt-2 md:text-sm">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
