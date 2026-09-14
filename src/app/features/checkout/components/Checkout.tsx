import AppProviders from '@/app/providers/AppProviders';
import AuthModalIsland from '@/app/features/auth/AuthModalIsland';
import { useCheckoutHook } from '../hooks/useCheckoutHook';
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
