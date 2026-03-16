import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';

export function useForgotPasswordMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      sonnerResponse('Error al enviar el enlace. Intenta de nuevo.', 'error');
    },
  });
}
