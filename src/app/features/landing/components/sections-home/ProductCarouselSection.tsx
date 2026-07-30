import { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/app/features/product/components/ProductCard';
import Loader from '@/app/components/Loader';
import {
  useCarouselNav,
  useMediaCenterTop,
  CarouselArrow,
  CarouselProgressBar,
} from '@/app/components/UI/CarouselNav';
import type { Product } from '@/app/types/global.types';

interface ProductCarouselSectionProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  showCTA?: boolean;
  /** Número editorial mostrado a la izquierda del título (— 01) */
  num?: string;
  /** Ruta del enlace "Ver todo" (oculto en móvil) */
  viewAllHref?: string;
}

export default function ProductCarouselSection({
  title,
  products,
  isLoading = false,
  showCTA = false,
  num = '01',
  viewAllHref = '/catalogo',
}: ProductCarouselSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const { canPrev, canNext, progress, snapCount, scrollPrev, scrollNext, seekRatio } =
    useCarouselNav(emblaApi);

  const viewportRef = useRef<HTMLDivElement>(null);
  const arrowTop = useMediaCenterTop(viewportRef, isLoading ? 0 : products.length);

  return (
    <section className="bg-bg px-4 pb-10 pt-10 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-7xl">
        {/* Header editorial — — {num} · {label} · Ver todo */}
        <div className="mb-5 flex items-baseline justify-between px-2 sm:px-12 md:mb-9">
          <div className="flex items-baseline gap-4">
            <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-muted">
              — {num}
            </span>
            <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-soft md:text-[11px]">
              {title}
            </span>
          </div>
          <a
            href={viewAllHref}
            className="hidden border-b border-text pb-0.5 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            Ver todo
          </a>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={40} />
          </div>
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="relative" ref={viewportRef}>
            {/* Flechas centradas con la IMAGEN de la card (no con la card entera) */}
            <CarouselArrow
              direction="prev"
              onClick={scrollPrev}
              disabled={!canPrev}
              top={arrowTop}
              className="absolute left-0 top-[34%] -translate-y-1/2 sm:left-1 lg:-left-2"
            />

            {/* Contenedor del carrusel */}
            <div className="w-full overflow-hidden px-3 sm:px-12" ref={emblaRef}>
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
              className="absolute right-0 top-[34%] -translate-y-1/2 sm:right-1 lg:-right-2"
            />

            <CarouselProgressBar
              progress={progress}
              snapCount={snapCount}
              onSeek={seekRatio}
              className="mt-5 px-3 sm:px-12 md:mt-7"
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
