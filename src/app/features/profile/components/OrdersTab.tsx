import { useState, useEffect } from 'react';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { formatCurrency } from '@/app/helpers/formatCurrency';

interface OrderItem {
  id: number;
  productName?: string;
  productImage?: string;
  mlSize?: number;
  isFullBottle?: boolean;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  deliveryMethod?: string;
  trackingCode?: string;
  shippingAddress?: string;
  shippingCity?: string;
  items: OrderItem[];
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  order_created: { label: 'Pendiente de pago', color: 'bg-amber-100 text-amber-700' },
  order_received: { label: 'Pagado', color: 'bg-blue-100 text-blue-700' },
  order_accepted: { label: 'Pagado', color: 'bg-blue-100 text-blue-700' },
  order_shipped: { label: 'Enviado', color: 'bg-indigo-100 text-indigo-700' },
  order_delivered: { label: 'Entregado', color: 'bg-green-100 text-green-700' },
  order_cancelled: { label: 'Cancelado', color: 'bg-error text-white' },
  order_delayed: { label: 'Retrasado', color: 'bg-amber-100 text-amber-700' },
  order_rejected: { label: 'Rechazado', color: 'bg-error text-white' },
}

const isServientrega = (m?: string) => m === 'SERVIENTREGA_GYE' || m === 'SERVIENTREGA_NACIONAL';

interface HistoryEntry {
  id: number;
  toStatus: string;
  changedBy: string;
  note?: string;
  createdAt: string;
}

// Timeline step icons per status
const STEP_ICON: Record<string, string> = {
  order_created: '🛒',
  order_received: '✅',
  order_accepted: '📦',
  order_shipped: '🚚',
  order_delivered: '🎉',
  order_cancelled: '❌',
  order_delayed: '⏳',
  order_rejected: '🚫',
  nuevo: '🆕',
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    axiosInstance.get(API_ENDPOINTS.ORDERS)
      .then(({ data }) => {
        const list = data?.data ?? data;
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch history when order is selected
  useEffect(() => {
    if (!selected) { setHistory([]); return; }
    axiosInstance.get(`${API_ENDPOINTS.ORDERS}/${selected.id}/history`)
      .then(({ data }) => setHistory(data?.data ?? data ?? []))
      .catch(() => setHistory([]));
  }, [selected?.id]);

  // Detail view
  if (selected) {
    const s = STATUS_MAP[selected.status] || { label: selected.status, color: 'bg-gray-100 text-gray-500' };
    return (
      <div className="space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Volver a mis pedidos
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black font-heading">{selected.orderNumber}</h2>
            <p className="text-xs text-gray-500">{new Date(selected.createdAt).toLocaleDateString('es-EC', { dateStyle: 'long' })}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.color}`}>{s.label}</span>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-gray-200 divide-y divide-border">
          {selected.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center p-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Sin img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">{item.productName || 'Producto'}</p>
                <p className="text-xs text-gray-500">{item.mlSize ? `${item.mlSize}ml ${item.isFullBottle ? 'Botella' : 'Decant'}` : ''} · {item.quantity}x</p>
              </div>
              <p className="text-sm font-bold text-black">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center text-base font-bold text-black">
          <span>Total</span>
          <span>{formatCurrency(selected.total)}</span>
        </div>

        {/* Tracking for Servientrega */}
        {isServientrega(selected.deliveryMethod) && selected.trackingCode && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-800 mb-1">Número de guía Servientrega</p>
            <p className="text-lg font-mono font-bold text-blue-900 mb-2">{selected.trackingCode}</p>
            <p className="text-xs text-blue-700 mb-2">
              Haz clic para rastrear tu envío con tu número de guía:
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(
                  `https://www.servientrega.com.ec/Tracking/Index/?guia=${encodeURIComponent(selected.trackingCode!)}`,
                  '_blank',
                  'noopener,noreferrer',
                )
              }}
              className="inline-flex items-center gap-2 cursor-pointer bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rastrear en Servientrega
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>
        )}

        {isServientrega(selected.deliveryMethod) && !selected.trackingCode && (
          <div className="rounded-xl border border-gray-200 bg-gray-100 p-4">
            <p className="text-sm text-gray-500">Tu número de guía será asignado cuando despachemos tu pedido.</p>
          </div>
        )}

        {/* Delivery info */}
        {(selected.shippingAddress || selected.shippingCity) && (
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-500">Envío a:</span> {selected.shippingAddress}{selected.shippingCity ? `, ${selected.shippingCity}` : ''}
          </div>
        )}

        {/* Status Timeline */}
        {history.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-linear-to-b from-gray-50 to-white p-5">
            <h3 className="font-heading text-sm font-bold text-black mb-4">Seguimiento de tu pedido</h3>
            <div className="relative pl-8">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-linear-to-b from-accent via-gray-200 to-gray-100 rounded-full" />
              {history.map((entry, i) => {
                const label = STATUS_MAP[entry.toStatus]?.label ?? entry.toStatus;
                const icon = STEP_ICON[entry.toStatus] ?? '📋';
                const isLast = i === history.length - 1;
                const isFirst = i === 0;
                return (
                  <div key={entry.id} className={`relative pb-5 last:pb-0 ${isLast ? '' : ''}`}>
                    <div className={`absolute -left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isLast ? 'bg-accent shadow-md shadow-accent/30' : isFirst ? 'bg-gray-100' : 'bg-gray-100'
                    }`}>
                      <span className={isLast ? 'grayscale-0' : 'grayscale opacity-60'}>{icon}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isLast ? 'text-black' : 'text-gray-500'}`}>{label}</p>
                      {entry.note && <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>}
                      <p className="text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleString('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-black font-heading uppercase">Mis Pedidos</h2>
        <p className="text-xs text-gray-500 mt-0.5">Revisa el estado de tus pedidos</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No tienes pedidos aún.</p>
          <a href="/catalogo" className="text-accent text-sm font-medium hover:underline mt-2 inline-block">Explorar catálogo</a>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const s = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-500' };
            const firstItem = order.items[0];
            const hasTracking = isServientrega(order.deliveryMethod) && order.trackingCode;
            const awaitingTracking = isServientrega(order.deliveryMethod) && !order.trackingCode;
            return (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className="group w-full flex items-center gap-4 rounded-xl border border-gray-200 p-4 text-left hover:border-black hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {firstItem?.productImage ? (
                    <img src={firstItem.productImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-black">{order.orderNumber}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.color}`}>{s.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.items.length} producto{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })}
                    {' · '}<span className="font-bold text-black">{formatCurrency(order.total)}</span>
                  </p>
                  {hasTracking && (
                    <p className="text-sm text-blue-600 font-semibold mt-1 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      Guía asignada — Ver detalle de envío
                    </p>
                  )}
                  {awaitingTracking && (
                    <p className="text-sm text-amber-600 mt-1">Guía pendiente de asignación</p>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-black flex items-center justify-center transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500 group-hover:text-white transition-colors"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-black font-medium transition-colors">Ver</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
