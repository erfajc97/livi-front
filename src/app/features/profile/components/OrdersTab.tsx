import { MOCK_PENDING_ORDERS } from '../data';

export default function OrdersTab() {
  const orders = MOCK_PENDING_ORDERS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-black font-heading uppercase">Mis Pedidos</h2>
        <p className="text-sm text-gray-400 mt-0.5">Revisa el estado de tus pedidos</p>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {orders.map((order, i) => {
          const isDelivered = order.status === 'Entregado';
          return (
            <div
              key={`${order.id}-${i}`}
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
            >
              <img
                src={order.image}
                alt={order.name}
                className="h-20 w-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-black text-sm">{order.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Código: {order.id}</p>
                <p className="text-xs text-gray-400">{order.date}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-bold text-black text-sm">${order.price.toFixed(2)}</span>
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                      isDelivered
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800">
                  Volver a comprar
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-gray-50">
                  Dejar una reseña
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
