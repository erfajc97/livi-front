import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import ShieldCheckLineIcon from '@/assets/svg/ShieldCheckLineIcon';
import LockLineIcon from '@/assets/svg/LockLineIcon';

const ITEMS = [
  { Icon: TruckLineIcon, label: 'Envíos a Ecuador' },
  { Icon: ShieldCheckLineIcon, label: 'Auténtico' },
  { Icon: LockLineIcon, label: 'Pago seguro' },
] as const;

interface TrustIconsProps {
  size?: number;
}

export default function TrustIcons({ size = 22 }: TrustIconsProps) {
  return (
    <ul className="grid grid-cols-3 gap-3" aria-label="Compra con confianza">
      {ITEMS.map(({ Icon, label }) => (
        <li key={label} className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-text-soft">
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
