import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';
import { ADDRESSES_QUERY_KEY } from '@/app/tanstack-queries/addressesQuery';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { AddressPayload } from '../types';

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddressPayload }) =>
      addressService.update(id, payload),
    onSuccess: () => {
      sonnerResponse('Dirección actualizada', 'success');
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message;
      sonnerResponse(
        typeof msg === 'string' ? msg : 'No se pudo actualizar la dirección',
        'error',
      );
    },
  });
}
