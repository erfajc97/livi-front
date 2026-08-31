import { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/app/features/product/components/ProductCard';
import ProductCardSkeleton from '@/app/components/UI/ProductCardSkeleton';
import {
  useCarouselNav,
  useMediaCenterTop,
  CarouselArrow,
  EMBLA_DURATION,
} from '@/app/components/UI/CarouselNav';
import CarouselProgressTrack from '@/app/components/UI/CarouselProgressTrack';
import type { Product } from '@/app/types/global.types';

interface ProductCarouselSectionProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  showCTA?: boolean;
  /** Ruta del enlace "Ver todo" (oculto en móvil) */
  viewAllHref?: string;
}

export default function ProductCarouselSection({
  title,
  products,
  isLoading = false,
  showCTA = false,
  viewAllHref = '/catalogo',
}: ProductCarouselSectionProps) {
  // El paso de la flecha = las tarjetas visibles: 2 en móvil, 3 en tablet y 4
  // en desktop (mismo corte que el basis de cada slide). Se fija por
  // breakpoint en vez de `slidesToScroll: 'auto'` porque 'auto' hacía que la
  // última página avanzara una distancia distinta —el "salto" del final—.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    duration: EMBLA_DURATION,
    containScroll: 'trimSnaps',
    slidesToScroll: 2,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 4 },
    },
  });
  const { canPrev, canNext, progress, snapCount, scrollPrev, scrollNext, seekRatio } =
    useCarouselNav(emblaApi);

  const viewportRef = useRef<HTMLDivElement>(null);
  const arrowTop = useMediaCenterTop(viewportRef, isLoading ? 0 : products.length);

  return (
    <section className="bg-bg px-4 pb-10 pt-10 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-7xl">
        {/* Header de sección — título en Cormorant Garamond (REQ-028) · Ver todo */}
        <div className="mb-5 flex items-baseline justify-between px-2 sm:px-12 md:mb-9">
          {isLoading ? (
            <div className="h-8 w-52 animate-pulse rounded-sm bg-bg-alt md:h-10 md:w-72" />
          ) : (
            <h2 className="font-display text-3xl font-light italic leading-none tracking-[-0.01em] text-text md:text-5xl">
              {title}
            </h2>
          )}
          <a
            href={viewAllHref}
            className="hidden shrink-0 border-b border-text pb-0.5 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            Ver todo
          </a>
        </div>

        {isLoading ? (
          /* Mismo ancho por slide que el carrusel cargado: nada salta. */
          <div className="px-3 sm:px-12">
            <div className="flex">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="shrink-0 basis-1/2 px-2.5 md:basis-1/3 md:px-3 lg:basis-1/4">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">
            No hay productos disponibles.
          </p>
        ) : (
          /* El padding va FUERA del viewport: con overflow-hidden el recorte
             ocurre en el borde del padding y se colaba un trozo de la card
             siguiente. Así entran exactamente 4 (2 en móvil, 3 en tablet). */
          <div className="relative px-3 sm:px-12" ref={viewportRef}>
            {/* Flechas montadas sobre las esquinas de la primera/última card,
                centradas con la imagen */}
            <CarouselArrow
              direction="prev"
              onClick={scrollPrev}
              disabled={!canPrev}
              top={arrowTop}
              className="absolute left-3 top-[34%] -translate-y-1/2 sm:left-12"
            />

            {/* Contenedor del carrusel */}
            <div className="w-full overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {products.map((p) => (
                  <div key={p.id} className="shrink-0 basis-1/2 px-2.5 md:basis-1/3 md:px-3 lg:basis-1/4">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            <CarouselArrow
              direction="next"
              onClick={scrollNext}
              disabled={!canNext}
              top={arrowTop}
              className="absolute right-3 top-[34%] -translate-y-1/2 sm:right-12"
            />

            {/* Barra continua (REQ-026): un solo riel gris con el tramo activo
                en negro, igual que en la ficha de producto */}
            <CarouselProgressTrack
              progress={progress}
              snapCount={snapCount}
              onSeek={seekRatio}
              emblaApi={emblaApi}
              className="mt-5 md:mt-7"
            />
          </div>
        )}

        {/* CTA móvil */}
        {showCTA && (
          <div className="mt-10 text-center sm:hidden">
            <a
              href={viewAllHref}
              className="inline-block border border-accent px-8 py-3 font-body text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:bg-bg-alt"
            >
              Ver todo el catálogo
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
