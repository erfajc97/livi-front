import { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import CarouselProgressTrack from './CarouselProgressTrack';
import {
  useCarouselNav,
  useMediaCenterTop,
  CarouselArrow,
} from '@/app/components/UI/CarouselNav';
import type { Product } from '@/app/types/global.types';

interface ExploreCategoriesCarouselProps {
  products: Product[];
}

export default function ExploreCategoriesCarousel({ products }: ExploreCategoriesCarouselProps) {
  /* REQ-014: avance de a una tarjeta con snaps recortados al final — la
     medida es estable haya muchos o pocos productos, sin salto brusco. */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });
  const { canPrev, canNext, progress, snapCount, scrollPrev, scrollNext, seekRatio } =
    useCarouselNav(emblaApi);
  const viewportRef = useRef<HTMLDivElement>(null);
  const arrowTop = useMediaCenterTop(viewportRef, products.length);

  if (products.length === 0) return null;

  /* Clases de flechas: en mobile van centradas con la imagen de la card
     (medida en px, ya estaban bien); en desktop se centran verticalmente
     con la tarjeta completa (REQ-027) usando top-0/bottom-0 + my-auto —
     por eso la barra de avance vive FUERA del contenedor relative. */
  const arrowMobile =
    'absolute top-[32%] -translate-y-1/2 md:hidden';
  const arrowDesktop =
    'absolute top-0 bottom-0 my-auto hidden md:flex';

  return (
    <section className="mb-8 mt-8 md:mb-10 md:mt-16">
      {/* Título de sección: Cormorant Garamond destacado (REQ-028), sin
          numeración editorial (REQ-032) */}
      <h2 className="mb-6 font-display text-3xl font-light leading-[1.05] tracking-[-0.02em] text-text md:mb-10 md:text-4xl">
        De la misma categoría
      </h2>

      {/* Carrusel — mismos controles que el resto de la landing */}
      <div className="relative" ref={viewportRef}>
        <CarouselArrow
          direction="prev"
          onClick={scrollPrev}
          disabled={!canPrev}
          top={arrowTop}
          className={`${arrowMobile} -left-2 sm:-left-3`}
        />
        <CarouselArrow
          direction="prev"
          onClick={scrollPrev}
          disabled={!canPrev}
          className={`${arrowDesktop} -left-2 sm:-left-3 lg:-left-5`}
        />

        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="shrink-0 basis-1/2 px-2 md:basis-1/3 md:px-3 lg:basis-1/4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <CarouselArrow
          direction="next"
          onClick={scrollNext}
          disabled={!canNext}
          top={arrowTop}
          className={`${arrowMobile} -right-2 sm:-right-3`}
        />
        <CarouselArrow
          direction="next"
          onClick={scrollNext}
          disabled={!canNext}
          className={`${arrowDesktop} -right-2 sm:-right-3 lg:-right-5`}
        />
      </div>

      {/* Barra continua de avance (REQ-026): riel gris + tramo activo negro,
          desktop y mobile */}
      <CarouselProgressTrack
        progress={progress}
        snapCount={snapCount}
        onSeek={seekRatio}
        className="mt-5 md:mt-7"
      />
    </section>
  );
}
