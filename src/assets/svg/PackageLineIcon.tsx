interface IconProps {
  size?: number;
  className?: string;
}

/** Despacho — caja cerrada, trazo fino (mismo lenguaje que CommitmentStrip). */
export default function PackageLineIcon({ size = 30, className }: IconProps) {
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
      <path d="M4.5 8.25 12 4.5l7.5 3.75v9.5L12 21.5 4.5 17.75z" />
      <path d="M12 4.5v17" />
      <path d="M4.5 8.25 12 12l7.5-3.75" />
    </svg>
  );
}
