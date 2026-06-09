import AppProviders from '@/app/providers/AppProviders';
import { useHomeHook } from '../../hooks/useHomeHook';
import ProductCarouselSection from '../../components/sections-home/ProductCarouselSection';
import ProductRankingSection from '../../components/sections-home/ProductRankingSection';
import EditorialBlogSplit from '../../components/sections-home/EditorialBlogSplit';
import HowItWorksSection from '../../components/sections-home/HowItWorksSection';
import CuratedHousesSection from '../../components/sections-home/CuratedHousesSection';

function HomeContent() {
  const { sections, sectionsLoading } = useHomeHook();

  // Orden fijo de secciones por posición (no por order<=1):
  // 1ª sección → carrusel · split editorial (blog) · 2ª sección → ranking · resto → carrusel
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const [first, second, ...rest] = sorted;

  return (
    <div className="bg-bg">
      {first && (
        <ProductCarouselSection
          key={first.id}
          title={first.title}
          products={first.products}
          isLoading={sectionsLoading}
          num="01"
        />
      )}

      <EditorialBlogSplit />

      {second && (
        <ProductRankingSection
          key={second.id}
          title={second.title}
          products={second.products}
          isLoading={sectionsLoading}
          num="02"
        />
      )}

      {rest.map((section, index) => (
        <ProductCarouselSection
          key={section.id}
          title={section.title}
          products={section.products}
          isLoading={sectionsLoading}
          showCTA={index === rest.length - 1}
          num={String(index + 3).padStart(2, '0')}
        />
      ))}

      <HowItWorksSection />
      <CuratedHousesSection />
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
