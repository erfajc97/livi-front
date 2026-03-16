import { formatCurrency } from '@/app/helpers/formatCurrency';
import PaymentMethodIcons from '@/app/components/PaymentMethodIcons';
import { ESTIMATED_SHIPPING } from '@/app/features/checkout/data';

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onClose: () => void;
}

export default function CartSummary({ total, onClose }: CartSummaryProps) {
  const estimatedTotal = total + ESTIMATED_SHIPPING;

  return (
    <div className="px-6 pb-6 pt-2">
      {/* Subtotal + Taxes + Total */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-black">Subtotal</span>
          <span className="text-sm font-bold text-black">{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Impuestos y Envío</span>
          <span className="text-sm text-gray-500 font-medium">{formatCurrency(ESTIMATED_SHIPPING)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-base font-bold text-black">Total</span>
          <span className="text-xl font-bold text-black">{formatCurrency(estimatedTotal)}</span>
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
          onClick={onClose}
          className="block w-full text-center py-3.5 bg-black text-white font-heading text-sm font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors"
        >
          Proceder al pago
        </a>
        <button
          onClick={onClose}
          className="block w-full text-center py-3.5 border-2 border-black text-black font-heading text-sm font-bold uppercase tracking-widest rounded-full hover:bg-gray-50 transition-colors"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  );
}
