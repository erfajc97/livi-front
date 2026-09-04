import AppProviders from '@/app/providers/AppProviders';
import { useBannersQuery } from '@/app/tanstack-queries/bannersQuery';
import BannerCarousel from './BannerCarousel';
import type { Banner } from '@/app/types/global.types';

function BannerCarouselContent({ initialBanners }: { initialBanners: Banner[] }) {
  const { data: banners = initialBanners, isLoading } = useBannersQuery(
    true,
    initialBanners.length ? initialBanners : undefined,
  );
  return <BannerCarousel banners={banners} isLoading={isLoading && !initialBanners.length} />;
}

export default function BannerCarouselIsland({
  initialBanners = [],
}: {
  initialBanners?: Banner[];
}) {
  return (
    <AppProviders withToaster={false}>
      <BannerCarouselContent initialBanners={initialBanners} />
    </AppProviders>
  );
}
