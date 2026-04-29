import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRegisterMutation } from '../mutations/useRegisterMutation';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { authService } from '../services/authService';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import { AUTH_INPUT_CLASS, AUTH_SUBMIT_CLASS } from '../data';
import EyeIcon from '@/assets/svg/EyeIcon';
import EyeOffIcon from '@/assets/svg/EyeOffIcon';
import Loader from '@/app/components/Loader';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);

  const { mutate: register, isPending } = useRegisterMutation(() => setSent(true));
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(onSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    register({ firstName: name, lastName, email, password });
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerification(email);
      sonnerResponse('Email de verificación reenviado.', 'success');
    } catch {
      sonnerResponse('Error al reenviar. Intenta de nuevo.', 'error');
    } finally {
      setResending(false);
    }
  };

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold text-black mb-2">Revisa tu bandeja de entrada</h2>
        <p className="text-sm text-gray-500 mb-6">
          Te enviamos un enlace de verificación a <strong className="text-black">{email}</strong>
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-gray-500 hover:text-black underline mb-4 block mx-auto"
        >
          {resending ? 'Reenviando...' : '¿No lo recibiste? Reenviar email'}
        </button>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-black font-medium hover:underline"
        >
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <h2 className="font-heading text-xl font-bold text-black text-center mb-1">Crear cuenta</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Regístrate para empezar a comprar</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan"
              required
              className={AUTH_INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Pérez"
              required
              className={AUTH_INPUT_CLASS}
            />
          </div>
        </div>

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

        {/* Phone */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Teléfono</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09X XXX XXXX"
            className={AUTH_INPUT_CLASS}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Contraseña</label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Confirmar contraseña</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            required
            minLength={6}
            className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none transition-colors ${
              passwordMismatch ? 'border-error focus:border-error' : 'border-gray-300 focus:border-black'
            }`}
          />
          {passwordMismatch && (
            <p className="text-xs text-error mt-1">Las contraseñas no coinciden</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || passwordMismatch}
          className={AUTH_SUBMIT_CLASS}
        >
          {isPending ? <Loader size={18} color="#fff" className="mx-auto" /> : 'Crear cuenta'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            size="large"
            theme="light"
          />
        </div>

        {/* Switch to login */}
        <p className="text-center text-sm text-gray-500 mt-1">
          ¿Ya tienes cuenta?{' '}
          <button type="button" onClick={onSwitchToLogin} className="text-black font-medium hover:underline">
            Ingresar
          </button>
        </p>
      </form>
    </div>
  );
}
