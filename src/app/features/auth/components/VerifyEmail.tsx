import { useEffect, useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { authService } from '../services/authService';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import Loader from '@/app/components/Loader';

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
        <p className="text-text-muted">Verificando tu email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold text-text mb-2">Email verificado</h1>
        <p className="text-text-muted mb-6">Tu cuenta ha sido activada exitosamente.</p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-accent text-bg font-heading font-bold text-sm uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity"
        >
          Ir al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
        <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="font-heading text-2xl font-bold text-text mb-2">Enlace inválido o expirado</h1>
      <p className="text-text-muted mb-6">El enlace de verificación no es válido o ha expirado.</p>
      <button
        onClick={handleResend}
        disabled={resending}
        className="inline-block px-8 py-3 bg-accent text-bg font-heading font-bold text-sm uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {resending ? 'Reenviando...' : 'Reenviar email de verificación'}
      </button>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <AppProviders withToaster>
      <div className="w-full max-w-md rounded-xl bg-surface p-8 border border-border">
        <VerifyEmailContent />
      </div>
    </AppProviders>
  );
}
