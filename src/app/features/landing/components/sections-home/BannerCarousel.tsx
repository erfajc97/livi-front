import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import CommitmentStrip from './CommitmentStrip';
import BannerHeroCopy from './BannerHeroCopy';
import { useCarouselNav, CarouselArrow, CarouselProgressBar, EMBLA_DURATION } from '@/app/components/UI/CarouselNav';
import type { Banner } from '@/app/types/global.types';

interface BannerCarouselProps {
  banners: Banner[];
  isLoading?: boolean;
}

export default function BannerCarousel({ banners, isLoading = false }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: EMBLA_DURATION }, [
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
    <section className="flex flex-col bg-bg">
      <div className="group relative h-80 sm:h-96 md:h-[72svh]">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {banners.map((banner, index) => (
              <div key={banner.id} className="relative h-full min-w-full">
                <picture>
                  {banner.mobileImageUrl && (
                    <source media="(max-width: 767px)" srcSet={banner.mobileImageUrl} />
                  )}
                  <img
                    src={banner.imageUrl ?? banner.image ?? ''}
                    alt={banner.title || 'Banner NönDecants'}
                    className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-center"
                    fetchPriority={index === 0 ? 'high' : undefined}
                  />
                </picture>

                {/* Desktop slide 1: velo corto a la izquierda para leer el
                    copy, sin el blanco que quemaba toda la foto. */}
                {index === 0 && (
                  <div className="pointer-events-none absolute inset-0 hidden md:block">
                    <div className="absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-black/45 via-black/18 to-transparent" />
                    <div className="pointer-events-auto relative flex h-full items-start px-12 pt-16 pb-10">
                      <BannerHeroCopy onDark />
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end px-6 py-6 md:px-12 md:py-10">
                  <span className="font-body text-[11px] tabular-nums tracking-[0.28em] text-white/80">
                    {pad(selected + 1)} / {pad(banners.length)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
              className="absolute inset-x-0 bottom-1.5 z-20 px-6 md:bottom-4 md:px-12"
            />
          </>
        )}
      </div>

      {/* Móvil: el copy no va sobre la foto, va como bloque aparte debajo. */}
      <div className="border-b border-border px-6 py-6 md:hidden">
        <BannerHeroCopy />
      </div>

      <CommitmentStrip />
    </section>
  );
}
