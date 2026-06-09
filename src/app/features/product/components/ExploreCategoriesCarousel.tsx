import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import type { Product } from '@/app/types/global.types';

interface ExploreCategoriesCarouselProps {
  products: Product[];
}

export default function ExploreCategoriesCarousel({ products }: ExploreCategoriesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16 mb-10">
      {/* Header editorial */}
      <div className="mb-10 flex items-baseline justify-between md:mb-12">
        <div className="flex items-baseline gap-4">
          <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-muted">— 04</span>
          <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-soft md:text-[11px]">
            De la misma categoría
          </span>
        </div>
      </div>

      {/* Carrusel con flechas editoriales (estilo Atelier) */}
      <div className="relative">
        <button
          onClick={scrollPrev}
          aria-label="Anterior"
          className="absolute -left-2 top-[32%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-text/25 bg-bg/80 text-text backdrop-blur transition-colors hover:border-accent hover:text-accent sm:-left-3 sm:flex lg:-left-5"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>

        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="shrink-0 basis-1/2 px-2 md:basis-1/3 md:px-3 lg:basis-1/4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          aria-label="Siguiente"
          className="absolute -right-2 top-[32%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-text/25 bg-bg/80 text-text backdrop-blur transition-colors hover:border-accent hover:text-accent sm:-right-3 sm:flex lg:-right-5"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </section>
  );
}
