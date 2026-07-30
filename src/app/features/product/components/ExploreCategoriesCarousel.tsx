import { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import {
  useCarouselNav,
  useMediaCenterTop,
  CarouselArrow,
  CarouselProgressBar,
} from '@/app/components/UI/CarouselNav';
import type { Product } from '@/app/types/global.types';

interface ExploreCategoriesCarouselProps {
  products: Product[];
}

export default function ExploreCategoriesCarousel({ products }: ExploreCategoriesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const { canPrev, canNext, progress, snapCount, scrollPrev, scrollNext, seekRatio } =
    useCarouselNav(emblaApi);
  const viewportRef = useRef<HTMLDivElement>(null);
  const arrowTop = useMediaCenterTop(viewportRef, products.length);

  if (products.length === 0) return null;

  return (
    <section className="mb-8 mt-8 md:mb-10 md:mt-16">
      {/* Header editorial */}
      <div className="mb-6 flex items-baseline justify-between md:mb-12">
        <div className="flex items-baseline gap-4">
          <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-muted">— 04</span>
          <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-soft md:text-[11px]">
            De la misma categoría
          </span>
        </div>
      </div>

      {/* Carrusel — mismos controles que el resto de la landing */}
      <div className="relative" ref={viewportRef}>
        <CarouselArrow
          direction="prev"
          onClick={scrollPrev}
          disabled={!canPrev}
          top={arrowTop}
          className="absolute -left-2 top-[32%] -translate-y-1/2 sm:-left-3 lg:-left-5"
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
          className="absolute -right-2 top-[32%] -translate-y-1/2 sm:-right-3 lg:-right-5"
        />

        <CarouselProgressBar
          progress={progress}
          snapCount={snapCount}
          onSeek={seekRatio}
          className="mt-5 md:mt-7"
        />
      </div>
    </section>
  );
}
