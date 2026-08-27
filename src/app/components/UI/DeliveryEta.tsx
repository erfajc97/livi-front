import type { ComponentType } from 'react';
import PackageLineIcon from '@/assets/svg/PackageLineIcon';
import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import {
  BACKORDER_LABEL,
  DEFAULT_DISPATCH_CUTOFF_HOUR,
  deliveryRangeShort,
  dispatchDateShort,
} from '@/app/helpers/deliveryWindow';

interface DeliveryEtaProps {
  variant: 'immediate' | 'backorder';
  offsetDays?: number;
  cutoffHour?: number;
  compact?: boolean;
}

interface EtaStepProps {
  Icon: ComponentType<{ size?: number; className?: string }>;
  motion: string;
  label?: string;
  value: string;
  compact: boolean;
}

function EtaStep({ Icon, motion, label, value, compact }: EtaStepProps) {
  const size = compact ? 16 : 20;
  return (
    <div className="flex min-w-0 items-start gap-2 sm:gap-3">
      <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 overflow-hidden text-text-soft sm:h-6 sm:w-6 ${motion}`}>
        <Icon size={size} />
      </span>
      <span className="min-w-0">
        {label && (
          <span
            className={`block font-body uppercase tracking-[0.16em] text-text-muted ${
              compact ? 'text-[9px]' : 'text-[10px]'
            }`}
          >
            {label}
          </span>
        )}
        <span
          className={`block font-display font-light italic leading-snug text-text ${
            compact ? 'text-sm' : 'mt-0.5 text-base'
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
  cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR,
  compact = false,
}: DeliveryEtaProps) {
  const isBackorder = variant === 'backorder';
  const eta = isBackorder ? BACKORDER_LABEL : deliveryRangeShort(offsetDays, cutoffHour);

  return (
    <div
      className={
        compact
          ? 'flex min-w-0 flex-col gap-1.5'
          : 'grid w-full min-w-0 grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-x-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-6'
      }
    >
      <EtaStep
        Icon={PackageLineIcon}
        motion="commit-icon commit-icon--pack"
        label={compact ? undefined : isBackorder ? 'Despacho' : 'Se despacha'}
        value={isBackorder ? 'Bajo pedido' : dispatchDateShort(cutoffHour)}
        compact={compact}
      />
      {!compact && (
        <span className="self-center font-body text-sm text-text-muted" aria-hidden>
          →
        </span>
      )}
      <div className="min-w-0 justify-self-end pl-2 sm:justify-self-auto sm:pl-0">
        <EtaStep
          Icon={TruckLineIcon}
          motion="commit-icon commit-icon--drive"
          label={undefined}
          value={eta}
          compact={compact}
        />
      </div>
    </div>
  );
}
