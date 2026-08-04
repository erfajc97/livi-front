import { useBlogPostsQuery } from '@/app/tanstack-queries/blogQuery';

/**
 * Split editorial (estilo "Filosofía" de la referencia) alimentado por el BLOG.
 * Toma el último post publicado (mismos endpoints que el resto del blog):
 * imagen grande a la izquierda + titular serif, extracto y enlaces a la derecha.
 */
export default function EditorialBlogSplit() {
  const { data: posts = [], isLoading } = useBlogPostsQuery();

  // Esqueleto del split editorial mientras llega el post.
  if (isLoading) {
    return (
      <section className="bg-bg-alt px-6 py-10 md:px-14 md:py-20" aria-hidden="true">
        <div className="mx-auto grid max-w-7xl animate-pulse items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div className="h-[300px] w-full bg-border-soft sm:h-[420px] md:h-[640px]" />
          <div className="md:pl-6">
            <div className="h-3 w-20 rounded-sm bg-border-soft" />
            <div className="mt-6 h-10 w-4/5 rounded-sm bg-border-soft md:mt-8 md:h-14" />
            <div className="mt-5 h-4 w-full max-w-md rounded-sm bg-border-soft md:mt-7" />
            <div className="mt-2 h-4 w-3/4 max-w-md rounded-sm bg-border-soft" />
            <div className="mt-8 h-4 w-32 rounded-sm bg-border-soft md:mt-10" />
          </div>
        </div>
      </section>
    );
  }

  const post = [...posts].sort((a, b) => a.position - b.position)[0];
  if (!post) return null;

  const body =
    post.excerpt ||
    (post.content ? post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '');

  return (
    <section className="bg-bg-alt px-6 py-10 md:px-14 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-20">
        {/* Imagen editorial */}
        <a href={`/blog/${post.slug}`} className="group relative block">
          <img
            src={post.imageUrl || '/banner-catalog.png'}
            alt={post.title}
            loading="lazy"
            className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:h-[420px] md:h-[640px]"
          />
          <span className="absolute bottom-0 left-0 bg-bg-alt pr-8 pt-5 font-body text-[10px] uppercase tracking-[0.24em] text-text-muted">
            — Journal
          </span>
        </a>

        {/* Texto */}
        <div className="md:pl-6">
          <span className="eyebrow">— Journal</span>
          <h2 className="mt-6 font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-text md:mt-8 md:text-[64px]">
            {post.title}
          </h2>
          {body && (
            <p className="mt-5 line-clamp-4 max-w-md font-body text-sm leading-relaxed text-text-soft md:mt-7">
              {body}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-10">
            <a
              href={`/blog/${post.slug}`}
              className="border-b border-text pb-1 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
            >
              Leer artículo
            </a>
            <a
              href="/blog"
              className="border-b border-text pb-1 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
            >
              Ver el journal
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
