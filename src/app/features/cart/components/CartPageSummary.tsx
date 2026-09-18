import { formatCurrency } from '@/app/helpers/formatCurrency';
import PaymentMethodIcons from '@/app/components/PaymentMethodIcons';
import TrustIcons from '@/app/components/UI/TrustIcons';
import { BTN_PRIMARY } from '@/app/components/UI/formClasses';

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

        <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-5">
          <span className="inline-block h-3.5 w-3.5 shrink-0 bg-accent" aria-hidden="true" />
          <span className="font-body text-xs text-text-soft">Envoltura de regalo LIVI incluida</span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.20em] text-text">Subtotal</span>
          <span className="font-heading text-3xl font-normal text-text">{formatCurrency(total)}</span>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          Envío calculado en el checkout
        </p>

        {/* CTA — burgundy, el paso que queremos que se siga (ref. PDF carrito) */}
        <a
          href="/checkout"
          className={`mt-6 flex items-center justify-center gap-2 ${BTN_PRIMARY}`}
        >
          Finalizar compra
        </a>
        <a
          href="/catalogo"
          className="mt-3 block text-center font-body text-xs italic text-text-muted transition-colors hover:text-text"
        >
          o seguir viendo la colección
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
