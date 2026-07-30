import AppProviders from '@/app/providers/AppProviders';
import { useOrderDetailHook } from './hooks/useOrderDetailHook';
import OrderConfirmation from './components/OrderConfirmation';
import Loader from '@/app/components/Loader';

interface OrderDetailProps {
  orderId: string;
}

function OrderDetailContent({ orderId }: OrderDetailProps) {
  const { order, isLoading, isError } = useOrderDetailHook(orderId);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-32 flex items-center justify-center">
        <Loader size={45} color="var(--color-accent)" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 text-center">
        <p className="text-[--color-text-muted]">No se encontró la orden.</p>
        <a href="/" className="mt-4 inline-block text-[--color-accent] text-sm hover:underline">
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <OrderConfirmation order={order} />
    </div>
  );
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  return (
    <AppProviders>
      <OrderDetailContent orderId={orderId} />
    </AppProviders>
  );
}
