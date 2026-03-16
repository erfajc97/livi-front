import AppProviders from '@/app/providers/AppProviders';
import { useHomeHook } from '../../hooks/useHomeHook';
import BannerCarousel from '../../components/sections-home/BannerCarousel';
import FeaturedProductsSection from '../../components/sections-home/FeaturedProductsSection';
import NewArrivalsSection from '../../components/sections-home/NewArrivalsSection';
import NewsletterSection from '../../components/sections-home/NewsletterSection';
import TestimonialsSection from '../../components/sections-home/TestimonialsSection';

function HomeContent() {
  const { featuredProducts, featuredLoading, newArrivals, newArrivalsLoading } = useHomeHook();

  return (
    <div>
      <BannerCarousel banners={[]} />
      <NewArrivalsSection products={newArrivals} isLoading={newArrivalsLoading} />
      <TestimonialsSection />
      <FeaturedProductsSection products={featuredProducts} isLoading={featuredLoading} />
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
