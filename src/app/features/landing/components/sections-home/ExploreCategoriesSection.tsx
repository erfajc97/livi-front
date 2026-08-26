import { useExploreCategories } from '../../hooks/useExploreCategories';
import type { ExploreCategoryCard } from '../../types';

function DesktopCard({ card }: { card: ExploreCategoryCard }) {
  return (
    <a
      href={card.href}
      className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden border border-border"
    >
      {card.imageUrl ? (
        <img
          src={card.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-md transition-transform duration-700 group-hover:scale-125"
        />
      ) : (
        <div className="absolute inset-0 bg-text" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-text via-text/70 to-text/25" />
      <div className="relative px-6 py-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-accent">
          {card.marcaCount} {card.marcaCount === 1 ? 'marca' : 'marcas'}
        </p>
        <h3 className="mt-2 font-display text-[28px] font-light leading-none tracking-[-0.02em] text-bg">
          {card.heading}
        </h3>
        {card.brandLineDesktop && (
          <p className="mt-3 font-body text-[13px] leading-relaxed text-bg/80">
            {card.brandLineDesktop}
          </p>
        )}
      </div>
    </a>
  );
}

function MobileCard({ card }: { card: ExploreCategoryCard }) {
  return (
    <a href={card.href} className="block border border-border bg-surface px-5 py-5">
      <p className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">
        {card.marcaCount} {card.marcaCount === 1 ? 'marca' : 'marcas'}
      </p>
      <h3 className="mt-2 font-display text-[26px] font-light leading-none tracking-[-0.02em] text-text">
        {card.heading}
      </h3>
      {card.brandLineMobile && (
        <p className="mt-2 font-body text-sm text-text-soft">{card.brandLineMobile}</p>
      )}
    </a>
  );
}

export default function ExploreCategoriesSection() {
  const { cards, isLoading, marcaCount } = useExploreCategories();

  if (isLoading) {
    return (
      <section className="bg-bg px-6 pb-6 pt-8 md:px-14 md:py-16" aria-hidden="true">
        <div className="mb-6 h-8 w-64 animate-pulse bg-bg-alt md:mb-8" />
        <div className="hidden grid-cols-3 gap-3.5 md:grid">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="min-h-[300px] animate-pulse bg-bg-alt" />
          ))}
        </div>
        <div className="flex flex-col gap-3 md:hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-28 animate-pulse border border-border bg-bg-alt" />
          ))}
        </div>
      </section>
    );
  }

  if (cards.length === 0) return null;

  return (
    <section className="bg-bg px-6 pb-6 pt-8 md:px-14 md:pb-16 md:pt-12">
      <div className="mb-5 flex items-baseline justify-between gap-4 md:mb-6">
        <h2 className="font-display text-3xl font-light tracking-[-0.02em] text-text md:text-[30px]">
          Explora por categoría
        </h2>
        <a
          href="/catalogo/perfumes"
          className="hidden shrink-0 font-body text-[11.5px] uppercase tracking-[0.12em] text-accent transition-colors hover:text-text md:inline"
        >
          {marcaCount > 0 ? `Ver las ${marcaCount} marcas →` : 'Ver catálogo →'}
        </a>
      </div>

      <div className="hidden grid-cols-3 gap-3.5 md:grid">
        {cards.map((card) => (
          <DesktopCard key={card.id} card={card} />
        ))}
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {cards.map((card) => (
          <MobileCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
