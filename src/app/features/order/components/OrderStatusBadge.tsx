import { ORDER_STATUS_CONFIG } from '../data';
import type { OrderStatus } from '@/app/types/global.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-heading tracking-wider uppercase border ${config.color}`}
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      {config.label}
    </span>
  );
}
