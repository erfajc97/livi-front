import AppProviders from '@/app/providers/AppProviders';
import { useExploreCategories } from '../../hooks/useExploreCategories';

function DecantsCategoryExitsContent() {
  const { cards, isLoading } = useExploreCategories();

  if (isLoading || cards.length === 0) return null;

  return (
    <section className="border-t border-border bg-bg-alt px-6 py-10 md:px-14 md:py-12">
      <h2 className="font-display text-[26px] font-light tracking-[-0.02em] text-text md:text-[30px]">
        Empieza por aquí
      </h2>
      <div className="mt-5 grid grid-cols-1 overflow-hidden border border-border md:grid-cols-3">
        {cards.map((card, index) => (
          <a
            key={card.id}
            href={card.href}
            className={`bg-surface px-6 py-6 ${index > 0 ? 'border-t border-border md:border-l md:border-t-0' : ''}`}
          >
            <h3 className="font-display text-[22px] font-light text-text">{card.heading}</h3>
            {card.brandLineMobile && (
              <p className="mt-2 font-body text-[13px] text-text-soft">{card.brandLineMobile}</p>
            )}
            <span className="mt-3 inline-block font-body text-[11.5px] uppercase tracking-[0.12em] text-accent">
              Ver catálogo →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function DecantsCategoryExits() {
  return (
    <AppProviders withToaster={false}>
      <DecantsCategoryExitsContent />
    </AppProviders>
  );
}
