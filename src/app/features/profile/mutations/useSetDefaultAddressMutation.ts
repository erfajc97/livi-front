import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';
import { ADDRESSES_QUERY_KEY } from '@/app/tanstack-queries/addressesQuery';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';

export function useSetDefaultAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.setDefault(id),
    onSuccess: () => {
      sonnerResponse('Dirección predeterminada actualizada', 'success');
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message;
      sonnerResponse(
        typeof msg === 'string' ? msg : 'No se pudo marcar como predeterminada',
        'error',
      );
    },
  });
}
