import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Banner } from '@/app/types/global.types';

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (banners.length === 0) return null;

  return (
    <div className="relative group -mt-16">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-full" style={{ height: '100vh' }}>
              <img
                src={banner.imageUrl ?? banner.image ?? ''}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0 flex items-start"
                style={{ background: 'linear-gradient(to right, rgba(27,25,25,0.85) 0%, rgba(27,25,25,0.5) 55%, rgba(27,25,25,0.15) 100%)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="hidden font-heading text-[clamp(1.6rem,2vw,2.8rem)] font-normal uppercase leading-[0.96] tracking-[-0.02em] text-white">
                    {banner.subtitle ?? 'Única Experiencia'}
                  </p>
                  <span className="hidden mt-1 font-body text-[clamp(3.5rem,8vw,7rem)] font-black italic leading-[0.96] tracking-[-0.02em] text-[--color-accent]">
                    {banner.title}
                  </span>
                  <a
                    href={banner.link ?? '/catalogo'}
                    className="inline-flex items-center justify-center px-14 py-4 bg-brand-gold text-brand-black font-heading text-sm uppercase tracking-[0.15em] font-bold rounded-lg transition-all duration-300 hover:bg-brand-gold/95 hover:shadow-[0_10px_40px_rgba(204,179,119,0.4)] hover:scale-105 active:scale-100 shadow-[0_4px_20px_rgba(204,179,119,0.25)] border border-brand-gold/20"
                  >
                    {banner.buttonText ?? 'Ver Catálogo'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={scrollPrev}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-[--color-border] bg-[--color-bg]/70 text-[--color-text-muted] hover:border-[--color-accent] hover:text-[--color-accent] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        style={{ borderRadius: 'var(--radius-sm)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button
        onClick={scrollNext}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-[--color-border] bg-[--color-bg]/70 text-[--color-text-muted] hover:border-[--color-accent] hover:text-[--color-accent] transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        style={{ borderRadius: 'var(--radius-sm)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  );
}
