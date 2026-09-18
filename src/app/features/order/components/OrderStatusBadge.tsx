import { ORDER_STATUS_CONFIG } from '../data';

interface OrderStatusBadgeProps {
  status: string;
}

const FALLBACK = { label: 'Sin estado', color: 'bg-bg-alt text-text-muted border-border' };

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] ?? FALLBACK;
  return (
    <span
      className={`inline-block border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${config.color}`}
    >
      {config.label}
    </span>
  );
}
