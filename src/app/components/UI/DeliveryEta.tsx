import { BACKORDER_LABEL, deliveryRangeShort, todayShort } from '@/app/helpers/deliveryWindow';

interface DeliveryEtaProps {
  variant: 'immediate' | 'backorder';
  offsetDays?: number;
  compact?: boolean;
}

export default function DeliveryEta({
  variant,
  offsetDays = 0,
  compact = false,
}: DeliveryEtaProps) {
  const isBackorder = variant === 'backorder';
  const eta = isBackorder ? BACKORDER_LABEL : deliveryRangeShort(offsetDays);

  return (
    <p
      className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 text-text ${
        compact ? 'font-body text-[11px] leading-snug' : 'font-body text-sm leading-snug'
      }`}
    >
      <span className="inline-flex items-baseline gap-1.5">
        <span aria-hidden>📦</span>
        <span className="font-medium">
          {isBackorder ? 'Bajo pedido' : `Se despacha hoy ${todayShort()}`}
        </span>
      </span>
      <span className="text-text-muted" aria-hidden>
        →
      </span>
      <span className="inline-flex items-baseline gap-1.5">
        <span aria-hidden>🚚</span>
        <span className="text-text-soft">Entrega estimada</span>
        <span className="font-medium text-text">{eta}</span>
      </span>
    </p>
  );
}
