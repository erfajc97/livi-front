import type { ComponentType } from 'react';
import PackageLineIcon from '@/assets/svg/PackageLineIcon';
import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import { BACKORDER_LABEL, deliveryRangeShort, todayShort } from '@/app/helpers/deliveryWindow';

interface DeliveryEtaProps {
  variant: 'immediate' | 'backorder';
  offsetDays?: number;
  compact?: boolean;
}

interface EtaStepProps {
  Icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  compact: boolean;
}

function EtaStep({ Icon, label, value, compact }: EtaStepProps) {
  const size = compact ? 16 : 20;
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span className="mt-0.5 shrink-0 text-text-soft">
        <Icon size={size} />
      </span>
      <span className="min-w-0">
        <span
          className={`block font-body uppercase tracking-[0.16em] text-text-muted ${
            compact ? 'text-[9px]' : 'text-[10px]'
          }`}
        >
          {label}
        </span>
        <span
          className={`mt-0.5 block font-display font-light italic leading-snug text-text ${
            compact ? 'text-sm' : 'text-base'
          }`}
        >
          {value}
        </span>
      </span>
    </div>
  );
}

export default function DeliveryEta({
  variant,
  offsetDays = 0,
  compact = false,
}: DeliveryEtaProps) {
  const isBackorder = variant === 'backorder';
  const eta = isBackorder ? BACKORDER_LABEL : deliveryRangeShort(offsetDays);

  return (
    <div className={`flex flex-wrap items-start ${compact ? 'gap-x-3 gap-y-2' : 'gap-x-4 gap-y-2'}`}>
      <EtaStep
        Icon={PackageLineIcon}
        label={isBackorder ? 'Despacho' : 'Se despacha'}
        value={isBackorder ? 'Bajo pedido' : `Hoy ${todayShort()}`}
        compact={compact}
      />
      <span className={`mt-4 font-body text-text-muted ${compact ? 'text-xs' : 'text-sm'}`} aria-hidden>
        →
      </span>
      <EtaStep Icon={TruckLineIcon} label="Entrega estimada" value={eta} compact={compact} />
    </div>
  );
}
