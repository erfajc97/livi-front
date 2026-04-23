import AppProviders from '@/app/providers/AppProviders';
import { useHomeHook } from '../../hooks/useHomeHook';
import ProductCarouselSection from '../../components/sections-home/ProductCarouselSection';
import TestimonialsSection from '../../components/sections-home/TestimonialsSection';

function HomeContent() {
  const { sections, sectionsLoading } = useHomeHook();

  // Secciones arriba de testimonios (order <= 1) y abajo (order > 1)
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const sectionsAbove = sorted.filter((s) => s.order <= 1);
  const sectionsBelow = sorted.filter((s) => s.order > 1);

  return (
    <div className="bg-white">
      {sectionsAbove.map((section) => (
        <ProductCarouselSection
          key={section.id}
          title={section.title}
          products={section.products}
          isLoading={sectionsLoading}
        />
      ))}

      <TestimonialsSection />

      {sectionsBelow.map((section, index) => (
        <ProductCarouselSection
          key={section.id}
          title={section.title}
          products={section.products}
          isLoading={sectionsLoading}
          showCTA={index === sectionsBelow.length - 1}
        />
      ))}

    </div>
  );
}

export default function Home() {
  return (
    <AppProviders>
      <HomeContent />
    </AppProviders>
  );
}
