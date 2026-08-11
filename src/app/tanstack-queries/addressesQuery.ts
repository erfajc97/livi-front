import { useQuery } from '@tanstack/react-query';
import { addressService } from '@/app/features/profile/services/addressService';
import { useAuthStore } from '@/app/store/auth/authStore';

export const ADDRESSES_QUERY_KEY = ['addresses', 'me'] as const;

/**
 * Direcciones guardadas del usuario logueado (mi-cuenta y checkout).
 * Solo se dispara con sesión activa: el checkout de invitado no llama al endpoint.
 */
export function useAddressesQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: () => addressService.list(),
    enabled: isAuthenticated,
    staleTime: 60_000,
    retry: 1,
  });
}
