import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import type { Product } from '@/app/types/global.types';

interface ExploreCategoriesCarouselProps {
  products: Product[];
}

function CarouselArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Anterior' : 'Siguiente'}
      className="absolute z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-accent-hover shadow-lg hover:scale-105 transition-transform"
      style={direction === 'left' ? { left: '-4px' } : { right: '-4px' }}
    >
      <div className="bg-bg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {direction === 'left'
            ? <polyline points="15 18 9 12 15 6" />
            : <polyline points="9 18 15 12 9 6" />}
        </svg>
      </div>
    </button>
  );
}

export default function ExploreCategoriesCarousel({ products }: ExploreCategoriesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (products.length === 0) return null;

  return (
    <div className="mt-16 mb-10">
      <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase text-black mb-8 px-2 sm:px-12">
        Explora nuestras categorias
      </h2>

      <div className="relative flex items-center">
        <CarouselArrow direction="left" onClick={scrollPrev} />

        <div className="overflow-hidden w-full px-2 sm:px-12" ref={emblaRef}>
          <div className="flex">
            {products.map((product) => (
              <div key={product.id} className="px-2 shrink-0 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <CarouselArrow direction="right" onClick={scrollNext} />
      </div>
    </div>
  );
}
