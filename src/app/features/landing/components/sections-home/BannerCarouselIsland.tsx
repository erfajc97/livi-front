import AppProviders from '@/app/providers/AppProviders';
import { useBannersQuery } from '@/app/tanstack-queries/bannersQuery';
import BannerCarousel from './BannerCarousel';

function BannerCarouselContent() {
  const { data: banners = [], isLoading } = useBannersQuery();
  return <BannerCarousel banners={banners} isLoading={isLoading} />;
}

export default function BannerCarouselIsland() {
  return (
    <AppProviders withToaster={false}>
      <BannerCarouselContent />
    </AppProviders>
  );
}
