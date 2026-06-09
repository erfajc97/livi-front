import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/app/features/product/components/ProductCard';
import Loader from '@/app/components/Loader';
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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-bg px-4 pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-7xl">
        {/* Header editorial — — {num} · {label} · Ver todo */}
        <div className="mb-10 flex items-baseline justify-between px-2 sm:px-12 md:mb-12">
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
          /* Carrusel con flechas editoriales (estilo Atelier) */
          <div className="relative">
            {/* Flecha izquierda */}
            <button
              onClick={scrollPrev}
              aria-label="Anterior"
              className="absolute -left-2 top-[32%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/80 text-text backdrop-blur transition-colors hover:border-accent hover:text-accent sm:-left-3 sm:flex lg:-left-5"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>

            {/* Contenedor del carrusel */}
            <div className="w-full overflow-hidden px-2 sm:px-12" ref={emblaRef}>
              <div className="flex">
                {products.map((p) => (
                  <div key={p.id} className="shrink-0 basis-1/2 px-2 md:basis-1/3 md:px-3 lg:basis-1/4">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            {/* Flecha derecha */}
            <button
              onClick={scrollNext}
              aria-label="Siguiente"
              className="absolute -right-2 top-[32%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/80 text-text backdrop-blur transition-colors hover:border-accent hover:text-accent sm:-right-3 sm:flex lg:-right-5"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
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
