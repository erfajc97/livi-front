import AppProviders from '@/app/providers/AppProviders';
import AuthModalIsland from '@/app/features/auth/AuthModalIsland';
import { useCheckoutHook, type BackorderLine } from '../hooks/useCheckoutHook';
import CheckoutForm from './CheckoutForm';
import CheckoutOrderSummary from './CheckoutOrderSummary';

function CheckoutContent() {
  const checkoutData = useCheckoutHook();

  return (
    <div className="relative flex flex-col gap-7 border border-border bg-surface p-5 md:gap-10 md:p-10 lg:flex-row lg:gap-14">
      <div className="flex-1">
        <CheckoutForm {...checkoutData} onLogin={checkoutData.openAuth} />
      </div>
      <div className="hidden w-px shrink-0 bg-border lg:block" />
      <div className="lg:w-[400px] shrink-0">
        <CheckoutOrderSummary
          items={checkoutData.items}
          subtotal={checkoutData.subtotal}
          deliveryCost={checkoutData.deliveryCost}
          total={checkoutData.total}
          payphoneSurcharge={checkoutData.payphoneSurcharge}
          couponCode={checkoutData.couponCode}
          couponDiscount={checkoutData.couponDiscount}
          couponFreeShipping={checkoutData.couponFreeShipping}
          couponApplied={checkoutData.couponApplied}
          couponLoading={checkoutData.couponLoading}
          couponMessage={checkoutData.couponMessage}
          onCouponCodeChange={checkoutData.setCouponCode}
          onApplyCoupon={checkoutData.handleApplyCoupon}
          onRemoveCoupon={checkoutData.handleRemoveCoupon}
        />
      </div>

      {/* Registro/inicio de sesión sin salir del checkout (compra guest) */}
      <AuthModalIsland open={checkoutData.authOpen} onClose={checkoutData.closeAuth} />

      {checkoutData.bajoConfirmOpen && (
        <BajoPedidoConfirmModal
          isPending={checkoutData.isPending}
          items={checkoutData.backorderItems}
          onConfirm={checkoutData.confirmBajoPedido}
          onCancel={checkoutData.cancelBajoPedido}
        />
      )}
    </div>
  );
}

function BajoPedidoConfirmModal({
  isPending,
  items,
  onConfirm,
  onCancel,
}: {
  isPending: boolean;
  items: BackorderLine[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  // ¿Hay al menos un frasco con stock parcial (algo inmediato + algo bajo pedido)?
  const hasPartial = items.some((i) => i.inStock > 0 && i.bajo > 0);

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={isPending ? undefined : onCancel} />
      <div className="relative w-full max-w-md border border-border bg-surface p-7 shadow-xl">
        <div className="mb-5 flex items-start gap-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-0.5 shrink-0 text-accent">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="eyebrow mb-2 text-accent">Pedido bajo demanda</p>
            <h3 className="font-display text-2xl font-light leading-tight text-text">
              {hasPartial ? 'Stock parcial disponible' : '¿Confirmas tu pedido?'}
            </h3>
          </div>
        </div>

        <p className="mb-4 font-body text-sm leading-relaxed text-text-soft">
          {hasPartial
            ? 'Algunas unidades salen de stock de inmediato y el resto se importa bajo pedido:'
            : 'Tu pedido incluye productos bajo pedido que importamos especialmente para ti:'}
        </p>

        {/* Desglose por producto */}
        <div className="mb-5 divide-y divide-border border border-border">
          {items.map((it, idx) => (
            <div key={idx} className="flex flex-col gap-1 px-4 py-3">
              <p className="font-body text-sm text-text">
                {it.name}
                {it.ml ? <span className="text-text-muted"> · {it.ml}ml</span> : null}
              </p>
              <p className="font-body text-xs text-text-soft">
                {it.inStock > 0 && (
                  <span className="text-text">
                    {it.inStock} en stock
                  </span>
                )}
                {it.inStock > 0 && it.bajo > 0 && <span className="text-text-muted"> · </span>}
                {it.bajo > 0 && (
                  <span className="text-accent">
                    {it.bajo} bajo pedido
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-7 border-l-2 border-accent bg-bg-alt px-4 py-3">
          <p className="font-body text-xs leading-relaxed text-text-soft">
            Las unidades bajo pedido llegan en <span className="text-text">13 a 17 días</span> tras confirmar el pago. El resto se prepara de inmediato. Se cobra el total ahora y generamos tu orden.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-text px-6 py-3.5 font-body text-[11px] uppercase tracking-[0.18em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Procesando…' : 'Sí, confirmar pedido'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 border border-border px-6 py-3.5 font-body text-[11px] uppercase tracking-[0.18em] text-text-soft transition-colors hover:border-text hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <AppProviders withToaster>
      <CheckoutContent />
    </AppProviders>
  );
}
