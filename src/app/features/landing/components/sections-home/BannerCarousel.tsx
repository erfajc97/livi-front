import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import CommitmentStrip from './CommitmentStrip';
import { useCarouselNav, CarouselArrow, CarouselProgressBar } from '@/app/components/UI/CarouselNav';
import type { Banner } from '@/app/types/global.types';

interface BannerCarouselProps {
  banners: Banner[];
  isLoading?: boolean;
}

export default function BannerCarousel({ banners, isLoading = false }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ]);
  const [selected, setSelected] = useState(0);
  const { snapCount, selectedIndex, scrollPrev, scrollNext, scrollToIndex } = useCarouselNav(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // Esqueleto del hero mientras llegan los banners: misma altura final.
  if (isLoading) {
    return (
      <section className="flex flex-col bg-bg" aria-hidden="true">
        <div className="h-80 animate-pulse bg-bg-alt sm:h-96 md:h-[72svh]" />
        <CommitmentStrip />
      </section>
    );
  }

  if (banners.length === 0) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    /* El hero mide un viewport completo (menos navbar) en desktop y las
       promesas fluyen debajo — antes ambas competían dentro del mismo
       viewport y las cards altas de vidrio aplastaban el banner. */
    <section className="flex flex-col bg-bg">
      {/* ── Hero (carousel de banners) ── */}
      <div className="group relative h-80 sm:h-96 md:h-[72svh]">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {banners.map((banner) => (
              <div key={banner.id} className="relative h-full min-w-full">
                <img
                  src={banner.imageUrl ?? banner.image ?? ''}
                  alt={banner.title || 'Banner NönDecants'}
                  /* Mobile: encuadra hacia el centro-alto (no corta caras/frascos);
                     desktop vuelve a centro. */
                  className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-center"
                  fetchPriority="high"
                />
                {/* Desktop: gradiente sutil, deja apreciar la foto (ref. Atelier).
                    Mobile: scrim oscuro real para que el texto blanco se lea sobre
                    fotos de tono medio (antes el titular ink quedaba ilegible). */}
                <div
                  className="absolute inset-0 hidden md:block"
                  style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.12) 100%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 md:hidden" />

                {/* Composición editorial: contador arriba · titular medio · texto izq + botones derecha */}
                <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] px-6 py-6 text-text md:px-12 md:py-10">
                  {/* Contador de slides (funcional, sin texto quemado) */}
                  <div className="flex items-start justify-end">
                    <span className="font-body text-[11px] tabular-nums tracking-[0.28em] text-white/80 md:text-text-soft">
                      {pad(selected + 1)} / {pad(banners.length)}
                    </span>
                  </div>

                  {/* Titular — desde el back (opcional: la imagen puede traer
                      su propio texto) */}
                  <div className="flex items-end">
                    {banner.title && (
                      <h1 className="max-w-[16ch] font-display text-[clamp(2.4rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.025em] text-white drop-shadow-sm md:text-text md:drop-shadow-none">
                        {banner.title}
                      </h1>
                    )}
                  </div>

                  {/* Texto (back) a la izquierda · botones a la derecha */}
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    {banner.subtitle ? (
                      <p className="max-w-[340px] font-body text-sm leading-[1.65] text-white/90 md:text-text/85">
                        {banner.subtitle}
                      </p>
                    ) : (
                      <span />
                    )}
                    {/* CTAs — tipografía fina (display serif) como el resto de
                        los titulares editoriales */}
                    {/* CTAs — en móvil pegados a la derecha; en desktop al
                        extremo derecho de la fila inferior */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <a
                        href={banner.link || '/catalogo/perfumes'}
                        className="inline-flex items-center gap-2 bg-text px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.18em] text-bg transition-colors hover:bg-accent md:px-6 md:py-3 md:text-xs"
                      >
                        {banner.buttonText || 'Explorar colección'}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
                      </a>
                      <a
                        href="/bajo-pedido"
                        className="inline-flex items-center border border-text/20 bg-bg/85 px-4 py-2.5 font-display text-[11px] uppercase tracking-[0.18em] text-text backdrop-blur-sm transition-colors hover:border-accent hover:text-accent md:px-5 md:py-3 md:text-xs"
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

        {/* Flechas + barra de posición — siempre visibles: dejan claro que hay
            más de un banner */}
        {banners.length > 1 && (
          <>
            <CarouselArrow
              direction="prev"
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            />
            <CarouselArrow
              direction="next"
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            />
            <CarouselProgressBar
              snapCount={snapCount}
              selectedIndex={selectedIndex}
              onSelect={scrollToIndex}
              className="absolute inset-x-0 bottom-4 z-20 px-6 md:px-12"
            />
          </>
        )}
      </div>

      {/* ── Nuestro compromiso ── */}
      <CommitmentStrip />
    </section>
  );
}
