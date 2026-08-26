interface IconProps {
  size?: number;
  className?: string;
}

/** Pago / envío seguro — escudo con candado, trazo fino. */
export default function ShieldLockLineIcon({ size = 30, className }: IconProps) {
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
      <rect x="9.05" y="10.35" width="5.9" height="4.7" rx="0.7" />
      <path d="M10.45 10.35V8.45a1.55 1.55 0 0 1 3.1 0v1.9" />
    </svg>
  );
}
