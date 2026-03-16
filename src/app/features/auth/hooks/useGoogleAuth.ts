import { useCallback } from 'react';
import { authService } from '../services/authService';
import { applyAuthSuccess } from '../helpers/applyAuthSuccess';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';

export function useGoogleAuth(onSuccess?: () => void) {
  const handleGoogleSuccess = useCallback(
    async (credentialResponse: any) => {
      try {
        const idToken = credentialResponse.credential;

        // Send token to backend for validation — returns proper JWT
        const authResponse = await authService.googleAuth(idToken);

        applyAuthSuccess(authResponse, false);
        sonnerResponse('¡Bienvenido!', 'success');
        onSuccess?.();
      } catch (error) {
        console.error('Google auth error:', error);
        sonnerResponse('Error al autenticar con Google', 'error');
      }
    },
    [onSuccess]
  );

  const handleGoogleError = useCallback(() => {
    sonnerResponse('Error al autenticar con Google', 'error');
  }, []);

  return { handleGoogleSuccess, handleGoogleError };
}
