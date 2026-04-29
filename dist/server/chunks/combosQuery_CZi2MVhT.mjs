import { useQuery } from '@tanstack/react-query';
import { a as axiosInstance, b as API_ENDPOINTS } from './AppProviders_CurmEGpy.mjs';

const fetchActiveCombos = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.COMBOS_ACTIVE);
  const responseData = data?.data ?? data;
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
};
const useActiveCombosQuery = (enabled = true) => useQuery({
  queryKey: ["combos", "active"],
  queryFn: fetchActiveCombos,
  enabled
});
const fetchComboById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.COMBOS}/${id}`);
    return data?.data ?? data;
  } catch {
    return null;
  }
};

export { fetchComboById as f, useActiveCombosQuery as u };
