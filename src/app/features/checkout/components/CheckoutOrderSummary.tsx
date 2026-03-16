import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
}

export default function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryCost,
  total,
}: CheckoutOrderSummaryProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  return (
    <div className="flex flex-col">
      <h2 className="font-heading text-2xl font-bold text-black mb-6">Tu pedido</h2>

      {/* Cart Items */}
      <div className="flex flex-col gap-5 mb-8 flex-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No hay productos en tu carrito.</p>
        ) : (
          items.map((item) => (
            <div key={item.variantId} className="flex gap-4 items-center">
              <div className="w-20 h-24 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-black leading-snug pr-4">{item.name}</h3>
                  <button onClick={() => removeItem(item.variantId)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Eliminar producto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                <div className="mt-1.5 border border-gray-300 rounded-md px-1.5 py-0.5 inline-block text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {item.ml}ml {item.ml >= 30 ? 'Botella original' : 'Decant'}
                </div>
                <p className="font-bold text-sm text-black mt-2">{formatCurrency(item.price)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-4 font-bold text-sm">
        {/* Separator */}
        <div className="w-full h-px bg-gray-200" />
        
        <div className="flex justify-between items-center text-black">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center text-black">
          <span>Impuestos y Envío</span>
          <span>{formatCurrency(deliveryCost)}</span>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gray-200 mt-2" />

        <div className="flex justify-between items-center text-black text-xl font-heading mt-2">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
