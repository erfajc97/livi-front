import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import type { Combo } from '@/app/types/global.types';

const fetchActiveCombos = async (): Promise<Combo[]> => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.COMBOS_ACTIVE);
  const responseData = data?.data ?? data;
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
};

export const useActiveCombosQuery = (enabled = true) =>
  useQuery<Combo[]>({
    queryKey: ['combos', 'active'],
    queryFn: fetchActiveCombos,
    enabled,
  });

export const fetchComboById = async (id: string): Promise<Combo | null> => {
  try {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.COMBOS}/${id}`);
    return data?.data ?? data;
  } catch {
    return null;
  }
};
