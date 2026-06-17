import { useState } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import PaymentMethodIcons from '@/app/components/PaymentMethodIcons';
import { useAuthStore } from '@/app/store/auth/authStore';
import AuthModal from '@/app/features/auth/components/AuthModal';

interface CartPageSummaryProps {
  immediateSubtotal: number;
  bajoSubtotal: number;
  shipping: number;
  total: number;
  immediateCount: number;
  bajoCount: number;
}

const ASSURANCES = [
  'Verificado por NönDecants antes del envío',
  'Pago seguro · PayPhone · Transferencia',
  'Acceso a referencias raras bajo pedido',
];

export default function CartPageSummary({
  immediateSubtotal,
  bajoSubtotal,
  shipping,
  total,
  immediateCount,
  bajoCount,
}: CartPageSummaryProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showAuth, setShowAuth] = useState(false);

  const handleCheckout = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuth(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Resumen ── */}
      <div className="bg-bg-alt p-7 md:p-8">
        <span className="eyebrow">— Resumen</span>

        <div className="mt-6 flex flex-col gap-3 font-body text-sm">
          {immediateCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-text-soft">Subtotal — en stock</span>
              <span className="text-text">{formatCurrency(immediateSubtotal)}</span>
            </div>
          )}
          {bajoCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="italic text-text-soft">Subtotal — bajo pedido</span>
              <span className="text-text">{formatCurrency(bajoSubtotal)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Envío estimado · Servientrega</span>
            <span className="text-text-muted">{formatCurrency(shipping)}</span>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <span className="font-body text-[11px] uppercase tracking-[0.18em] text-text">Total</span>
          <span className="font-display text-3xl font-light text-text">{formatCurrency(total)}</span>
        </div>
        <p className="mt-2 font-display text-sm italic text-text-muted">
          Envío e impuestos finales se confirman en el pago.
        </p>

        {/* CTA */}
        <a
          href="/checkout"
          onClick={handleCheckout}
          className="mt-6 flex w-full items-center justify-between gap-2 bg-text px-6 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
        >
          <span>Pagar — {formatCurrency(total)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
        </a>

        <div className="mt-6">
          <PaymentMethodIcons />
        </div>

        <ul className="mt-6 flex flex-col gap-2.5">
          {ASSURANCES.map((a) => (
            <li key={a} className="flex items-start gap-2.5 font-body text-xs text-text-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-0.5 shrink-0 text-accent"><polyline points="20 6 9 17 4 12" /></svg>
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Entregas ── */}
      <div className="border border-border p-7 md:p-8">
        <span className="eyebrow">— Entregas</span>
        <div className="mt-5 flex flex-col gap-5">
          {immediateCount > 0 && (
            <div>
              <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.16em] text-text-muted">
                <span>01 · En stock</span>
                <span>{immediateCount} {immediateCount === 1 ? 'referencia' : 'referencias'}</span>
              </div>
              <p className="mt-1 font-display text-base italic text-text">24 – 72 horas</p>
            </div>
          )}
          {bajoCount > 0 && (
            <div>
              <div className="flex items-center justify-between font-body text-[10px] uppercase tracking-[0.16em] text-text-muted">
                <span>{immediateCount > 0 ? '02' : '01'} · Bajo pedido</span>
                <span>{bajoCount} {bajoCount === 1 ? 'referencia curada' : 'referencias curadas'}</span>
              </div>
              <p className="mt-1 font-display text-base italic text-text">13 – 17 días</p>
            </div>
          )}
        </div>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
