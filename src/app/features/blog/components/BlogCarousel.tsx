import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  imageUrl: string | null;
}

interface BlogCarouselProps {
  posts: BlogPost[];
}

export default function BlogCarousel({ posts }: BlogCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (posts.length === 0) return null;

  return (
    <section className="bg-white border-t border-border pt-8 pb-14 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-xl sm:text-2xl font-black md:text-3xl text-bg uppercase tracking-wide mb-8 px-4 sm:px-12">
          Más del blog
        </h2>

        <div className="relative flex items-center group">
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

          <div className="overflow-hidden w-full px-2 sm:px-12" ref={emblaRef}>
            <div className="flex">
              {posts.map((post) => (
                <div key={post.slug} className="px-2 shrink-0 basis-full sm:basis-1/2 lg:basis-1/3">
                  <a href={`/blog/${post.slug}`} className="group/card flex flex-col border border-border rounded-2xl overflow-hidden h-full">
                    <img
                      src={post.imageUrl || '/home-3.png'}
                      alt={post.title}
                      className="w-full h-52 object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-col items-center gap-4 p-6 flex-1">
                      <h3 className="font-heading text-base font-bold text-black text-center group-hover/card:text-text-muted transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {(post.content || post.excerpt) && (
                        <p className="font-body text-sm leading-relaxed text-text-muted text-center line-clamp-3">
                          {post.content || post.excerpt}
                        </p>
                      )}
                      <span className="mt-auto w-full py-2.5 bg-black text-white font-heading text-sm font-bold uppercase tracking-wider text-center rounded-full group-hover/card:bg-black/80 transition-colors">
                        Leer el post
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

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
      </div>
    </section>
  );
}
