import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { MOCK_REVIEWS } from '../data';

function CarouselArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Anterior' : 'Siguiente'}
      className="absolute z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-accent-hover shadow-lg hover:scale-105 transition-transform"
      style={direction === 'left' ? { left: '-6px' } : { right: '-6px' }}
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

export default function ProductReviewsCarousel({ name }: { name: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="mt-16">
      <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase mb-8 text-black">
        Lo que nuestros clientes opinan
      </h2>

      <div className="relative flex items-center">
        <CarouselArrow direction="left" onClick={scrollPrev} />

        <div className="overflow-hidden w-full px-4 sm:px-6" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-5">
            {MOCK_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="shrink-0 basis-[85%] sm:basis-full md:basis-[calc(50%-10px)] border border-accent-hover rounded-xl p-4 sm:p-6 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= review.rating ? 'text-accent-hover' : 'text-text-muted'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-text-muted">{review.date}</span>
                </div>

                <h3 className="font-heading text-lg sm:text-xl font-bold text-black mb-1">{name}</h3>
                <p className="text-sm text-text-muted mb-4">{review.author}</p>

                <h4 className="font-heading font-bold text-accent-hover italic mb-2">{review.title}</h4>
                <p className="text-sm text-text-muted mb-5 line-clamp-3 leading-relaxed">
                  {review.text}
                </p>

                <button className="text-sm text-text-muted hover:text-black transition-colors underline underline-offset-4">
                  Reseña completa
                </button>
              </div>
            ))}
          </div>
        </div>

        <CarouselArrow direction="right" onClick={scrollNext} />
      </div>
    </div>
  );
}
