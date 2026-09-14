import AppProviders from '@/app/providers/AppProviders';
import { useHomeHook } from '../../hooks/useHomeHook';
import ProductCarouselSection from '../../components/sections-home/ProductCarouselSection';
import ProductRankingSection from '../../components/sections-home/ProductRankingSection';
import BlogCarousel from '@/app/features/blog/components/BlogCarousel';
import HowItWorksSection from '../../components/sections-home/HowItWorksSection';
import EditorialBand from '../../components/sections-home/EditorialBand';
import StoryTallerSection from '../../components/sections-home/StoryTallerSection';
import NewsletterSection from '../../components/sections-home/NewsletterSection';
import InstagramSection from '../../components/sections-home/InstagramSection';
// Valoraciones: se comentan de momento; quizá más adelante se haga bien.
// import GoogleReviewsSection from '../../components/sections-home/GoogleReviewsSection';
// "Explora por categoría" tampoco va en el home: las secciones de producto
// (Más vendidos, etc.) se pintan desde el admin (Landing Sections).
// import ExploreCategoriesSection from '../../components/sections-home/ExploreCategoriesSection';

/**
 * Orden del home según la arquitectura del PDF de dirección creativa:
 * hero (en index.astro) → producto héroe (sección del admin) → editorial →
 * historia · taller → tres pasos → más secciones del admin → blog → newsletter.
 */
function HomeContent() {
  const { sections, sectionsLoading } = useHomeHook();

  // Mientras cargan las secciones se pintan los esqueletos con la forma final
  // del home. Sin esto la página quedaba en blanco y todo saltaba al llegar
  // la data.
  if (sectionsLoading) {
    return (
      <div className="bg-bg">
        <ProductCarouselSection title="" products={[]} isLoading num="01" />
        <EditorialBand />
        <StoryTallerSection />
      </div>
    );
  }

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const [first, second, ...rest] = sorted;

  return (
    <div className="bg-bg">
      {/* 01 · Producto héroe — primera sección administrable (p. ej. Más vendidos) */}
      {first && (
        <ProductCarouselSection
          key={first.id}
          title={first.title}
          products={first.products}
          isLoading={sectionsLoading}
          num="01"
        />
      )}

      {/* 02 · Editorial — firma de producto + caballito */}
      <EditorialBand />

      {/* 03 · Historia · Taller — páginas de marca */}
      <StoryTallerSection />

      {/* 04 · Tres pasos — cómo funciona la compra */}
      <HowItWorksSection />

      {/* 05 · Ranking — segunda sección administrable */}
      {second && (
        <ProductRankingSection
          key={second.id}
          title={second.title}
          products={second.products}
          isLoading={sectionsLoading}
          num="02"
        />
      )}

      {/* Secciones extra del admin (3ª en adelante) */}
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

      {/* El blog cierra la parte editorial */}
      <BlogCarousel />

      {/* Valoraciones — comentadas de momento:
      <GoogleReviewsSection />
      */}

      {/* Instagram — comunidad (fotos curadas + link al perfil) */}
      <InstagramSection />

      {/* Newsletter — cierre transversal del home */}
      <NewsletterSection />
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
