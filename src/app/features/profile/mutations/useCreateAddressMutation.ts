import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';
import { ADDRESSES_QUERY_KEY } from '@/app/tanstack-queries/addressesQuery';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { AddressPayload } from '../types';

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => addressService.create(payload),
    onSuccess: () => {
      sonnerResponse('Dirección guardada', 'success');
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message;
      sonnerResponse(
        typeof msg === 'string' ? msg : 'No se pudo guardar la dirección',
        'error',
      );
    },
  });
}
