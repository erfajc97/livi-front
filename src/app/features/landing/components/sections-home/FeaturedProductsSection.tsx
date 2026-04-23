import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/app/features/product/components/ProductCard';
import Loader from '@/app/components/Loader';
import type { Product } from '@/app/types/global.types';

interface FeaturedProductsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export default function FeaturedProductsSection({ products, isLoading }: FeaturedProductsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-white border-t border-gray-200 pt-24 pb-14 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start mb-6 px-4 sm:px-12">
          <h2 className="font-heading text-2xl font-black md:text-[28px] text-bg uppercase tracking-wide">
            LOS MÁS VENDIDOS
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={40} />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">
            No hay productos disponibles.
          </p>
        ) : (
          /* Carousel con Botones de Navegación */
          <div className="relative flex items-center group">

            {/* Botón Izquierdo */}
            <button
              onClick={scrollPrev}
              aria-label="Anterior"
              className="absolute left-0 sm:left-2 lg:-left-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-accent text-black shadow-lg hover:scale-105 transition-transform"
            >
              <div className="bg-bg w-9 h-9 flex items-center justify-center rounded-full text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </div>
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden w-full px-2 sm:px-12" ref={emblaRef}>
              <div className="flex">
                {products.map(p => (
                  <div key={p.id} className="px-2 shrink-0 basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            {/* Botón Derecho */}
            <button
              onClick={scrollNext}
              aria-label="Siguiente"
              className="absolute right-0 sm:right-2 lg:-right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-accent text-black shadow-lg hover:scale-105 transition-transform"
            >
              <div className="bg-bg w-9 h-9 flex items-center justify-center rounded-full text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </button>

          </div>
        )}

        {/* CTA mobile */}
        <div className="sm:hidden text-center mt-8">
          <a
            href="/catalogo"
            className="inline-block px-8 py-3 border border-accent text-accent font-heading text-xs uppercase tracking-widest hover:bg-surface transition-colors rounded"
          >
            Ver todo el catálogo
          </a>
        </div>
      </div>
    </section>
  );
}
