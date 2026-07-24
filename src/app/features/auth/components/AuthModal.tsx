import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  if (!open) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => setMode('login'), 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative flex w-full max-w-4xl flex-col overflow-hidden bg-bg shadow-2xl md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 p-1.5 text-text-muted transition-colors hover:text-text"
            aria-label="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Left: Form side */}
          <div className="max-h-[90vh] flex-1 overflow-y-auto px-8 py-10 sm:px-12 sm:py-14">
            {/* Wordmark */}
            <div className="mb-8 flex justify-center">
              <img src="/logonondecants.png" alt="NönDecants" width={543} height={127} className="h-8 w-auto" />
            </div>

            {mode === 'login' && (
              <LoginForm
                onSuccess={handleClose}
                onSwitchToRegister={() => setMode('register')}
                onSwitchToForgot={() => setMode('forgot')}
              />
            )}
            {mode === 'register' && (
              <RegisterForm
                onSuccess={handleClose}
                onSwitchToLogin={() => setMode('login')}
              />
            )}
            {mode === 'forgot' && (
              <ForgotPasswordForm
                onSwitchToLogin={() => setMode('login')}
              />
            )}
          </div>

          {/* Right: Banner image */}
          <div className="hidden md:block md:w-[320px] lg:w-[360px] shrink-0 relative">
            <img
              src="/loginbanner.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay with brand text */}
            <div className="absolute inset-0 flex flex-col items-center justify-between bg-black/40 px-6 py-10">
              <img src="/logo.svg" alt="NönDecants" className="h-6" />
              <p className="max-w-[260px] text-center font-display text-sm italic leading-relaxed text-white/90">
                Compra 100% segura — aprovecha nuestros descuentos y compra con confianza.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
