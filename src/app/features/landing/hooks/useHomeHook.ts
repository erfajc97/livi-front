import { useBannersQuery } from '@/app/tanstack-queries/bannersQuery';
import { useLandingSectionsActiveQuery } from '@/app/tanstack-queries/landingSectionsQuery';

export function useHomeHook() {
  const { data: bannersData, isLoading: bannersLoading } = useBannersQuery();

  // Secciones editables desde el admin
  const { data: sectionsData, isLoading: sectionsLoading } = useLandingSectionsActiveQuery();

  return {
    banners: bannersData ?? [],
    bannersLoading,

    sections: sectionsData ?? [],
    sectionsLoading,
  };
}
