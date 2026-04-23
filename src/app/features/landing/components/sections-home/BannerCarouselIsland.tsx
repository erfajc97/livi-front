import AppProviders from '@/app/providers/AppProviders';
import { useBannersQuery } from '@/app/tanstack-queries/bannersQuery';
import BannerCarousel from './BannerCarousel';

function BannerCarouselContent() {
  const { data: banners = [] } = useBannersQuery();
  return <BannerCarousel banners={banners} />;
}

export default function BannerCarouselIsland() {
  return (
    <AppProviders withToaster={false}>
      <BannerCarouselContent />
    </AppProviders>
  );
}
