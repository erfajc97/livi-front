import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import type { Address, AddressPayload } from '../types';

function mapAddress(raw: any): Address {
  return {
    id: String(raw.id),
    alias: raw.alias ?? '',
    provincia: raw.provincia ?? '',
    ciudad: raw.ciudad ?? '',
    direccion: raw.direccion ?? '',
    referencia: raw.referencia ?? '',
    telefono: raw.telefono ?? '',
    isDefault: raw.isDefault ?? false,
  };
}

export const addressService = {
  list: async (): Promise<Address[]> => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.USER_ADDRESSES);
    const raw = data?.data?.data ?? data?.data ?? data ?? [];
    return Array.isArray(raw) ? raw.map(mapAddress) : [];
  },

  create: async (payload: AddressPayload): Promise<Address> => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USER_ADDRESSES, payload);
    return mapAddress(data?.data ?? data);
  },

  update: async (id: string, payload: AddressPayload): Promise<Address> => {
    const { data } = await axiosInstance.patch(`${API_ENDPOINTS.USER_ADDRESSES}/${id}`, payload);
    return mapAddress(data?.data ?? data);
  },

  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.USER_ADDRESSES}/${id}`);
  },

  setDefault: async (id: string): Promise<Address> => {
    const { data } = await axiosInstance.patch(`${API_ENDPOINTS.USER_ADDRESSES}/${id}/default`);
    return mapAddress(data?.data ?? data);
  },
};
