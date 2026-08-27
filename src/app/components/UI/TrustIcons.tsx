import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import ShieldCheckLineIcon from '@/assets/svg/ShieldCheckLineIcon';
import LockLineIcon from '@/assets/svg/LockLineIcon';

const ITEMS = [
  { Icon: TruckLineIcon, label: 'Envíos a Ecuador', motion: 'commit-icon commit-icon--drive' },
  { Icon: ShieldCheckLineIcon, label: 'Auténtico', motion: 'commit-icon commit-icon--seal' },
  { Icon: LockLineIcon, label: 'Pago seguro', motion: 'commit-icon commit-icon--lock' },
] as const;

interface TrustIconsProps {
  size?: number;
}

export default function TrustIcons({ size = 22 }: TrustIconsProps) {
  return (
    <ul className="grid grid-cols-3 gap-3" aria-label="Compra con confianza">
      {ITEMS.map(({ Icon, label, motion }) => (
        <li key={label} className="flex flex-col items-center gap-1.5 text-center">
          <span className={`inline-flex h-7 w-7 items-center justify-center overflow-hidden text-text-soft ${motion}`}>
            <Icon size={size} />
          </span>
          <span className="font-body text-[10px] uppercase leading-tight tracking-[0.14em] text-text-muted">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
