import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import type { LandingSection } from '@/app/types/global.types';
import { mapProduct } from './productsQuery';

// ── Query para obtener secciones activas (público) ──
export function useLandingSectionsActiveQuery() {
  return useQuery({
    queryKey: ['landing-sections', 'active'],
    queryFn: async (): Promise<LandingSection[]> => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.LANDING_SECTIONS_ACTIVE);
      // Backend wrapper: { statusCode, message, data: [...] }
      const sections = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      return sections.map((s: any) => ({
        ...s,
        products: (s.products ?? []).map(mapProduct),
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// ── Query para obtener todas las secciones (admin) ──
export function useLandingSectionsQuery() {
  return useQuery({
    queryKey: ['landing-sections'],
    queryFn: async (): Promise<LandingSection[]> => {
      const { data } = await axiosInstance.get<LandingSection[]>(API_ENDPOINTS.LANDING_SECTIONS);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ── Query para obtener una sección por ID (admin) ──
export function useLandingSectionQuery(id: number | null) {
  return useQuery({
    queryKey: ['landing-sections', id],
    queryFn: async (): Promise<LandingSection> => {
      const { data } = await axiosInstance.get<LandingSection>(`${API_ENDPOINTS.LANDING_SECTION}/${id}`);
      return data;
    },
    enabled: id !== null,
    staleTime: 1000 * 60 * 5,
  });
}
