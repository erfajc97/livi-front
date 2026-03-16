import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { RegisterPayload } from '../types';

export function useRegisterMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      sonnerResponse('¡Cuenta creada! Revisa tu email para verificar tu cuenta.', 'success');
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        'Error al crear la cuenta. El correo puede estar en uso.';
      sonnerResponse(msg, 'error');
    },
  });
}
