import { useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { authService } from '../services/authService';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import { AUTH_INPUT_CLASS, AUTH_SUBMIT_CLASS, AUTH_LABEL_CLASS } from '../data';
import { BTN_PRIMARY } from '@/app/components/UI/formClasses';
import EyeIcon from '@/assets/svg/EyeIcon';
import EyeOffIcon from '@/assets/svg/EyeOffIcon';
import Loader from '@/app/components/Loader';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword || !token) return;

    setIsPending(true);
    try {
      await authService.resetPassword(token, password);
      sonnerResponse('Contraseña restablecida exitosamente.', 'success');
      setSuccess(true);
    } catch {
      sonnerResponse('Token inválido o expirado. Solicita un nuevo enlace.', 'error');
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-error-muted">
          <svg className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mb-2 font-heading text-2xl font-normal text-text">Enlace inválido</h1>
        <p className="mb-6 font-body text-sm text-text-soft">Este enlace no contiene un token válido para restablecer tu contraseña.</p>
        <a
          href="/"
          className={`inline-block max-w-xs ${BTN_PRIMARY}`}
        >
          Ir al inicio
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-success-muted">
          <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 font-heading text-2xl font-normal text-text">Contraseña actualizada</h1>
        <p className="mb-6 font-body text-sm text-text-soft">Ya puedes iniciar sesión con tu nueva contraseña.</p>
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
    <div>
      <h1 className="mb-2 text-center font-heading text-2xl font-normal text-text">Nueva contraseña</h1>
      <p className="mb-6 text-center font-body text-sm text-text-soft">Ingresa tu nueva contraseña</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={AUTH_LABEL_CLASS}>Nueva contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className={`${AUTH_INPUT_CLASS} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div>
          <label className={AUTH_LABEL_CLASS}>Confirmar contraseña</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            required
            minLength={6}
            className={
              passwordMismatch ? `${AUTH_INPUT_CLASS} border-error` : AUTH_INPUT_CLASS
            }
          />
          {passwordMismatch && (
            <p className="mt-1.5 font-body text-xs text-error">Las contraseñas no coinciden</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || passwordMismatch || password.length < 6}
          className={AUTH_SUBMIT_CLASS}
        >
          {isPending ? <Loader size={18} color="currentColor" className="mx-auto" /> : 'Restablecer contraseña'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <AppProviders withToaster>
      <div className="w-full max-w-md border border-border bg-surface p-8">
        <ResetPasswordContent />
      </div>
    </AppProviders>
  );
}
