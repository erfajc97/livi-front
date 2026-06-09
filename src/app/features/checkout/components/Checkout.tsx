import AppProviders from '@/app/providers/AppProviders';
import { useCheckoutHook } from '../hooks/useCheckoutHook';
import CheckoutForm from './CheckoutForm';
import CheckoutOrderSummary from './CheckoutOrderSummary';

function CheckoutContent() {
  const checkoutData = useCheckoutHook();

  return (
    <div className="relative flex flex-col gap-10 border border-border bg-surface p-6 md:p-10 lg:flex-row lg:gap-14">
      <div className="flex-1">
        <CheckoutForm {...checkoutData} />
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

      {checkoutData.bajoConfirmOpen && (
        <BajoPedidoConfirmModal
          isPending={checkoutData.isPending}
          onConfirm={checkoutData.confirmBajoPedido}
          onCancel={checkoutData.cancelBajoPedido}
        />
      )}
    </div>
  );
}

function BajoPedidoConfirmModal({
  isPending,
  onConfirm,
  onCancel,
}: {
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
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
            <h3 className="font-display text-2xl font-light leading-tight text-text">¿Confirmas tu pedido?</h3>
          </div>
        </div>

        <p className="mb-2 font-body text-sm leading-relaxed text-text-soft">
          Tu pedido incluye productos <span className="text-text">bajo pedido</span> que importamos especialmente para ti.
        </p>
        <p className="mb-7 font-body text-sm leading-relaxed text-text-soft">
          La entrega estimada es de <span className="text-text">13 a 17 días</span> tras confirmar el pago. El resto de tus productos en stock se preparan de inmediato.
        </p>

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
