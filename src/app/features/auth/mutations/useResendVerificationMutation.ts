import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
    onSuccess: () => {
      sonnerResponse('Revisa tu email para verificar tu cuenta.', 'success');
    },
    onError: () => {
      sonnerResponse('Error al enviar el email de verificación.', 'error');
    },
  });
}
