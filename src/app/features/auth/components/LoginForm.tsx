import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation } from '../mutations/useLoginMutation';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { AUTH_INPUT_CLASS, AUTH_SUBMIT_CLASS, AUTH_GOOGLE_BTN_CLASS } from '../data';
import EyeIcon from '@/assets/svg/EyeIcon';
import EyeOffIcon from '@/assets/svg/EyeOffIcon';
import GoogleIcon from '@/assets/svg/GoogleIcon';
import Loader from '@/app/components/Loader';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToForgot }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSession, setKeepSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLoginMutation(onSuccess);
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(onSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password, keepSession });
  };

  return (
    <div>
      {/* Title */}
      <h2 className="font-heading text-xl font-bold text-text text-center mb-1">Iniciar Sesión</h2>
      <p className="text-sm text-text-muted text-center mb-6">Para poder comprar logueate con tu cuenta</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className={AUTH_INPUT_CLASS}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`${AUTH_INPUT_CLASS} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Keep session + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={keepSession}
              onChange={(e) => setKeepSession(e.target.checked)}
              className="w-4 h-4 accent-black rounded"
            />
            <span className="text-xs text-text-muted">Mantenerme conectad@</span>
          </label>
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-xs text-text-muted hover:text-text transition-colors"
          >
            Olvidé mi contraseña
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={AUTH_SUBMIT_CLASS}
        >
          {isPending ? <Loader size={18} color="#fff" className="mx-auto" /> : 'Login'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-surface-raised" />
          <span className="text-xs text-text-muted">or</span>
          <div className="flex-1 h-px bg-surface-raised" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            size="large"
            theme="light"
          />
        </div>

        {/* Switch to register */}
        <p className="text-center text-sm text-text-muted mt-2">
          ¿No tienes cuenta?{' '}
          <button type="button" onClick={onSwitchToRegister} className="text-text font-medium hover:underline">
            Regístrate
          </button>
        </p>
      </form>
    </div>
  );
}
