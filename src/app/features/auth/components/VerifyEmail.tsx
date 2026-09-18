import { useEffect, useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { authService } from '../services/authService';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import Loader from '@/app/components/Loader';
import { BTN_PRIMARY } from '@/app/components/UI/formClasses';

type Status = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const [status, setStatus] = useState<Status>('loading');
  const [resending, setResending] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      const email = prompt('Ingresa tu email para reenviar la verificación:');
      if (email) {
        await authService.resendVerification(email);
        sonnerResponse('Email de verificación reenviado.', 'success');
      }
    } catch {
      sonnerResponse('Error al reenviar. Intenta de nuevo.', 'error');
    } finally {
      setResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Loader size={40} className="mx-auto mb-4" />
        <p className="font-body text-sm text-text-soft">Verificando tu email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-success-muted">
          <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 font-heading text-2xl font-normal text-text">Email verificado</h1>
        <p className="mb-6 font-body text-sm text-text-soft">Tu cuenta ha sido activada exitosamente.</p>
        <a
          href="/"
          className={`inline-block max-w-xs ${BTN_PRIMARY}`}
        >
          Ir al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-error-muted">
        <svg className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="mb-2 font-heading text-2xl font-normal text-text">Enlace inválido o expirado</h1>
      <p className="mb-6 font-body text-sm text-text-soft">El enlace de verificación no es válido o ha expirado.</p>
      <button
        onClick={handleResend}
        disabled={resending}
        className={`inline-block max-w-xs ${BTN_PRIMARY}`}
      >
        {resending ? 'Reenviando...' : 'Reenviar email de verificación'}
      </button>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <AppProviders withToaster>
      <div className="w-full max-w-md border border-border bg-surface p-8">
        <VerifyEmailContent />
      </div>
    </AppProviders>
  );
}
