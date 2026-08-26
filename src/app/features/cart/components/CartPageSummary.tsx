import { formatCurrency } from '@/app/helpers/formatCurrency';
import PaymentMethodIcons from '@/app/components/PaymentMethodIcons';
import TrustIcons from '@/app/components/UI/TrustIcons';

interface CartPageSummaryProps {
  immediateSubtotal: number;
  bajoSubtotal: number;
  shipping: number;
  total: number;
  immediateCount: number;
  bajoCount: number;
}

export default function CartPageSummary({
  immediateSubtotal,
  bajoSubtotal,
  shipping,
  total,
  immediateCount,
  bajoCount,
}: CartPageSummaryProps) {
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

        {/* CTA — marco dorado en loop: es el paso que queremos que se siga */}
        <a
          href="/checkout"
          className="gold-frame mt-6 flex w-full items-center justify-between gap-2 bg-text px-6 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
        >
          <span>Pagar — {formatCurrency(total)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
        </a>

        <div className="mt-6">
          <PaymentMethodIcons />
        </div>

        <div className="mt-6">
          <TrustIcons />
        </div>
      </div>
    </div>
  );
}
