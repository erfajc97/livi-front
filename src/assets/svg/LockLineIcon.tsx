interface IconProps {
  size?: number;
  className?: string;
}

/** Pago seguro — candado, trazo fino (mismo lenguaje que CommitmentStrip). */
export default function LockLineIcon({ size = 30, className }: IconProps) {
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
      <rect x="6.25" y="10.5" width="11.5" height="9" rx="1.2" />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 0 1 7 0v2.3" />
    </svg>
  );
}
