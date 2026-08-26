import useEmblaCarousel from 'embla-carousel-react';
import { useBlogPostsQuery, type BlogPost } from '@/app/tanstack-queries/blogQuery';
import { useCarouselNav, EMBLA_DURATION } from '@/app/components/UI/CarouselNav';

/**
 * Sección Blog del home (REQ-006): carrusel de tarjetas editoriales.
 * Desktop: 3 tarjetas por vista, flechas redondas a los lados y puntitos de
 * avance. Mobile: 1 tarjeta a la vez, sin flechas, con puntitos.
 * Los datos llegan por TanStack Query (misma query pública del blog).
 */

const fmtDate = (d?: string | null) => {
  if (!d) return '';
  const parts = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(new Date(d));
  return parts
    .map((p) => (p.type === 'month' ? p.value.charAt(0).toUpperCase() + p.value.slice(1) : p.value))
    .join('');
};

/** Tiempo de lectura estimado (~200 palabras por minuto). */
const readingTime = (post: BlogPost) => {
  const text = (post.content || post.excerpt || '').replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const excerptOf = (post: BlogPost) =>
  post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '');

function BlogCard({ post }: { post: BlogPost }) {
  const date = fmtDate(post.publishedAt || post.createdAt);
  const excerpt = excerptOf(post);

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group/card flex h-full flex-col border border-border bg-surface"
    >
      {/* Imagen con categoría encima, abajo a la izquierda */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-raised">
        <img
          src={post.imageUrl || '/banner-catalog.png'}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
        />
        <span className="absolute bottom-3 left-3 font-body text-[10px] uppercase tracking-[0.24em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]">
          Blog
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="line-clamp-2 font-display text-2xl font-light leading-tight text-text">
          {post.title}
        </h3>

        {/* Fecha de publicación + tiempo de lectura */}
        <div className="mt-2 flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {date && <span>{date}</span>}
          {date && <span aria-hidden="true">·</span>}
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span>{readingTime(post)} min</span>
        </div>

        {excerpt && (
          <p className="mt-2.5 line-clamp-2 font-body text-sm leading-relaxed text-text-soft">
            {excerpt}
          </p>
        )}

        {/* Línea + enlace al artículo (anclado al pie de la tarjeta) */}
        <div className="mt-auto pt-3.5">
          <div className="border-t border-border pt-3">
            <span className="font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors group-hover/card:text-accent">
              Ver artículo
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function RoundArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Anterior' : 'Siguiente'}
      className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-[0_2px_12px_rgba(28,26,23,0.12)] transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30 md:flex ${
        isPrev ? '-left-2 lg:-left-5' : '-right-2 lg:-right-5'
      }`}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={isPrev ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  );
}

export default function BlogCarousel() {
  const { data: posts = [], isLoading } = useBlogPostsQuery();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', duration: EMBLA_DURATION });
  const { canPrev, canNext, snapCount, selectedIndex, scrollPrev, scrollNext, scrollToIndex } =
    useCarouselNav(emblaApi);

  if (isLoading) {
    return (
      <section className="bg-bg px-6 pb-8 pt-6 md:px-14 md:py-12" aria-hidden="true">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mx-auto h-10 w-40 rounded-sm bg-border-soft md:h-12" />
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={i > 0 ? 'hidden md:block' : ''}>
                <div className="aspect-[4/3] w-full bg-border-soft" />
                <div className="mt-5 h-6 w-4/5 rounded-sm bg-border-soft" />
                <div className="mt-3 h-3 w-1/2 rounded-sm bg-border-soft" />
                <div className="mt-3 h-4 w-full rounded-sm bg-border-soft" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    /* Sección compacta (REQ-006): mismo diseño, menos aire vertical */
    <section className="bg-bg px-6 pb-8 pt-6 md:px-14 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Título centrado con línea fina debajo */}
        {/* Sin la línea bajo el título: separaba de más el encabezado del carrusel */}
        <h2 className="text-center font-display text-4xl font-light leading-none tracking-[-0.02em] text-text md:text-5xl">
          Blog
        </h2>

        {/* Carrusel de tarjetas */}
        <div className="relative mt-6 md:mt-8">
          <RoundArrow direction="prev" onClick={scrollPrev} disabled={!canPrev} />

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="min-w-0 shrink-0 basis-full px-1 sm:basis-1/2 md:px-3 lg:basis-1/3"
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>

          <RoundArrow direction="next" onClick={scrollNext} disabled={!canNext} />
        </div>

        {/* Puntitos de avance */}
        {snapCount > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: snapCount }, (_, i) => {
              const active = i === selectedIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Ir a la página ${i + 1} de ${snapCount}`}
                  aria-current={active}
                  className={`h-1.5 rounded-full transition-all ${
                    active ? 'w-4 bg-text' : 'w-1.5 bg-border hover:bg-text-muted'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Enlace inferior centrado */}
        <div className="mt-6 text-center md:mt-7">
          <a
            href="/blog"
            className="inline-block border-b border-text pb-1 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            Descubre el blog
          </a>
        </div>
      </div>
    </section>
  );
}
