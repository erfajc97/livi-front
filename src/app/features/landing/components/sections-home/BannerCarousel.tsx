import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import LockIcon from '@/assets/svg/LockIcon';
import TruckIcon from '@/assets/svg/TruckIcon';
import BoxIcon from '@/assets/svg/BoxIcon';
import HandsIcon from '@/assets/svg/HandsIcon';
import type { Banner } from '@/app/types/global.types';

interface BannerCarouselProps {
  banners: Banner[];
}

// Promesas — reutiliza los SVG existentes del proyecto
const PROMISES = [
  { Icon: LockIcon, title: 'Autenticidad garantizada', sub: 'Cada gota verificada' },
  { Icon: TruckIcon, title: 'Envíos Servientrega 24–72h', sub: 'A todo el Ecuador' },
  { Icon: BoxIcon, title: 'Devolución 7 días', sub: 'Sin preguntas' },
  { Icon: HandsIcon, title: 'Bajo pedido global', sub: 'Cualquier fragancia del mundo' },
];

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ]);
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  if (banners.length === 0) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    /* Hero + promesas caben en el primer viewport (descontando la navbar) */
    <section className="flex flex-col bg-bg h-[calc(100svh-4.5rem)] md:h-[calc(100svh-7.7rem)]">
      {/* ── Hero (carousel de banners) ── */}
      <div className="group relative min-h-0 flex-1">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {banners.map((banner) => (
              <div key={banner.id} className="relative h-full min-w-full">
                <img
                  src={banner.imageUrl ?? banner.image ?? ''}
                  alt={banner.title}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  fetchPriority="high"
                />
                {/* Gradiente sutil — solo abajo, deja apreciar la foto (ref. Atelier) */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.12) 100%)' }}
                />

                {/* Composición editorial: contador arriba · titular medio · texto izq + botones derecha */}
                <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] px-6 py-6 text-text md:px-12 md:py-10">
                  {/* Contador de slides (funcional, sin texto quemado) */}
                  <div className="flex items-start justify-end">
                    <span className="font-body text-[11px] tabular-nums tracking-[0.28em] text-text-soft">
                      {pad(selected + 1)} / {pad(banners.length)}
                    </span>
                  </div>

                  {/* Titular — desde el back */}
                  <div className="flex items-end">
                    <h1 className="max-w-[16ch] font-display text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.025em] text-text">
                      {banner.title}
                    </h1>
                  </div>

                  {/* Texto (back) a la izquierda · botones a la derecha */}
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    {banner.subtitle ? (
                      <p className="max-w-[340px] font-body text-sm leading-[1.65] text-text/85">
                        {banner.subtitle}
                      </p>
                    ) : (
                      <span />
                    )}
                    <div className="flex items-center gap-4">
                      <a
                        href={banner.link ?? '/catalogo/perfumes'}
                        className="inline-flex items-center gap-2 bg-text px-8 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
                      >
                        {banner.buttonText ?? 'Explorar colección'}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
                      </a>
                      <a
                        href="/bajo-pedido"
                        className="inline-flex items-center border border-text/20 bg-bg/85 px-7 py-4 font-body text-xs uppercase tracking-[0.2em] text-text backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                      >
                        Bajo Pedido
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flechas */}
        {banners.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              aria-label="Anterior"
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-text/30 text-text opacity-0 transition-all hover:border-accent hover:text-accent group-hover:opacity-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={scrollNext}
              aria-label="Siguiente"
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-text/30 text-text opacity-0 transition-all hover:border-accent hover:text-accent group-hover:opacity-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}
      </div>

      {/* ── Promesas NönDecants ── */}
      <div className="shrink-0 border-t border-border bg-bg-alt">
        <div className="mx-auto max-w-[1600px] px-6 py-5 md:px-12 md:py-7">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-border" />
            <span className="eyebrow">La promesa NönDecants</span>
            <span className="h-px w-8 bg-border" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {PROMISES.map((p, i) => (
              <div
                key={p.title}
                className={`flex flex-col items-center gap-2 px-3 py-2 text-center md:px-6 ${i > 0 ? 'md:border-l md:border-border' : ''}`}
              >
                <p.Icon width={26} height={26} />
                <span className="font-body text-[10px] uppercase tracking-[0.18em] text-text md:text-[11px]">{p.title}</span>
                <span className="hidden font-display text-xs italic text-text-muted md:block">{p.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
