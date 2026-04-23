import AppProviders from '@/app/providers/AppProviders';
import { useCheckoutHook } from '../hooks/useCheckoutHook';
import CheckoutForm from './CheckoutForm';
import CheckoutOrderSummary from './CheckoutOrderSummary';

function CheckoutContent() {
  const checkoutData = useCheckoutHook();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
      <div className="flex-1">
        <CheckoutForm {...checkoutData} />
      </div>
      <div className="hidden lg:block w-px bg-gray-200 shrink-0" />
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
