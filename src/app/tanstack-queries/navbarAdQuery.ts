import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import type { Banner } from '@/app/types/global.types';

/**
 * Publicidad del navbar: banner con type='navbar' que alimenta el panel
 * "Destacado" del mega menú. Se gestiona desde el admin (tab "Publicidad navbar").
 * Devuelve el primer banner visible de ese tipo, o null si no hay.
 */
const fetchNavbarAd = async (): Promise<Banner | null> => {
  try {
    const { data } = await axiosInstance.get(API_ENDPOINTS.BANNERS_BY_TYPE, {
      params: { type: 'navbar' },
    });
    const result = data?.data ?? data;
    if (!Array.isArray(result) || result.length === 0) return null;
    return result[0] as Banner;
  } catch {
    return null;
  }
};

export const useNavbarAdQuery = (enabled = true) =>
  useQuery<Banner | null>({
    queryKey: ['navbar-ad'],
    queryFn: fetchNavbarAd,
    enabled,
    staleTime: 1000 * 60 * 10,
  });
