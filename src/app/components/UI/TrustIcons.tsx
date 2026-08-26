import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import ShieldLockLineIcon from '@/assets/svg/ShieldLockLineIcon';
import AwardStarLineIcon from '@/assets/svg/AwardStarLineIcon';

const ITEMS = [
  { Icon: TruckLineIcon, label: 'Envíos nacionales a todo Ecuador' },
  { Icon: ShieldLockLineIcon, label: 'Pago y envío seguros' },
  { Icon: AwardStarLineIcon, label: 'Autenticidad garantizada' },
] as const;

interface TrustIconsProps {
  size?: number;
}

export default function TrustIcons({ size = 44 }: TrustIconsProps) {
  return (
    <ul className="flex items-center justify-center gap-12" aria-label="Compra con confianza">
      {ITEMS.map(({ Icon, label }) => (
        <li key={label} className="text-text">
          <Icon size={size} strokeWidth={0.7} />
          <span className="sr-only">{label}</span>
        </li>
      ))}
    </ul>
  );
}
