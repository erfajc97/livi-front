import { useState } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import PaymentMethodIcons from '@/app/components/PaymentMethodIcons';
import { ESTIMATED_SHIPPING } from '@/app/features/checkout/data';
import { useAuthStore } from '@/app/store/auth/authStore';
import AuthModal from '@/app/features/auth/components/AuthModal';

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onClose: () => void;
}

export default function CartSummary({ total, onClose }: CartSummaryProps) {
  const estimatedTotal = total + ESTIMATED_SHIPPING;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showAuth, setShowAuth] = useState(false);

  const handleCheckout = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuth(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="px-6 pb-6 pt-2">
      {/* Subtotal + Taxes + Total */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-soft">Subtotal</span>
          <span className="font-body text-sm text-text">{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-muted">Impuestos y Envío</span>
          <span className="font-body text-sm text-text-muted">{formatCurrency(ESTIMATED_SHIPPING)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-body text-sm uppercase tracking-[0.14em] text-text">Total</span>
          <span className="font-display text-2xl text-text">{formatCurrency(estimatedTotal)}</span>
        </div>
      </div>

      {/* Payment method icons */}
      <div className="mt-5">
        <PaymentMethodIcons />
      </div>

      {/* Action buttons */}
      <div className="mt-7 space-y-3">
        <a
          href="/checkout"
          onClick={handleCheckout}
          className="block w-full bg-text py-4 text-center font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
        >
          Proceder al pago →
        </a>
        <button
          onClick={onClose}
          className="block w-full border border-border py-4 text-center font-body text-xs uppercase tracking-[0.2em] text-text transition-colors hover:border-text"
        >
          Seguir comprando
        </button>
      </div>

      {/* Auth modal */}
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
