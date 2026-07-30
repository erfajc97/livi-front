interface IconProps {
  size?: number;
  className?: string;
}

/** Autenticidad — escudo con check, trazo fino. */
export default function ShieldCheckLineIcon({ size = 30, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 2.75 4.75 5.6v5.3c0 4.6 3.05 8.4 7.25 9.35 4.2-.95 7.25-4.75 7.25-9.35V5.6L12 2.75Z" />
      <path d="M8.9 11.9 11.2 14.2l4-4.4" />
    </svg>
  );
}
