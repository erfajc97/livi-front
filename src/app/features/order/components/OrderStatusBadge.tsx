import { ORDER_STATUS_CONFIG } from '../data';

interface OrderStatusBadgeProps {
  status: string;
}

const FALLBACK = { label: 'Sin estado', color: 'bg-gray-500/20 text-gray-400 border-gray-500/40' };

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] ?? FALLBACK;
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-heading tracking-wider uppercase border ${config.color}`}
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      {config.label}
    </span>
  );
}
