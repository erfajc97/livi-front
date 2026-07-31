import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';

/**
 * Días adicionales de entrega configurados en el admin
 * (setting `delivery_days_offset`). Si no existe, 0.
 */
export function useDeliveryOffsetQuery() {
  return useQuery({
    queryKey: ['settings', 'delivery_days_offset'],
    queryFn: async (): Promise<number> => {
      try {
        const { data } = await axiosInstance.get(
          `${API_ENDPOINTS.SETTINGS}/delivery_days_offset`,
        );
        const value = Number(data?.data?.value ?? data?.value);
        return Number.isFinite(value) && value > 0 ? value : 0;
      } catch {
        return 0;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
