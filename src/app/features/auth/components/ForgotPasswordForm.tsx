import { useForgotPasswordHook } from '../hooks/useForgotPasswordHook';
import { AUTH_INPUT_CLASS, AUTH_SUBMIT_CLASS } from '../data';
import Loader from '@/app/components/Loader';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const { email, setEmail, sent, isPending, handleSubmit } = useForgotPasswordHook();

  return (
    <div>
      {/* Title */}
      <h2 className="font-heading text-xl font-bold text-black text-center mb-1">Recuperar contraseña</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        {sent
          ? 'Revisa tu bandeja de entrada'
          : 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña'}
      </p>

      {sent ? (
        <div className="flex flex-col items-center gap-5">
          {/* Success icon */}
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Si el email <span className="font-medium text-black">{email}</span> está registrado, recibirás un enlace para restablecer tu contraseña.
          </p>
          <button type="button" onClick={onSwitchToLogin} className={AUTH_SUBMIT_CLASS}>
            Volver al login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className={AUTH_INPUT_CLASS}
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={isPending} className={AUTH_SUBMIT_CLASS}>
            {isPending ? <Loader size={18} color="#fff" className="mx-auto" /> : 'Enviar enlace'}
          </button>

          {/* Back to login */}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Volver al login
          </button>
        </form>
      )}
    </div>
  );
}
