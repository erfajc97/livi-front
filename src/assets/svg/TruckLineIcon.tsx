interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** Envíos — camión de reparto, trazo fino. */
export default function TruckLineIcon({ size = 30, className, strokeWidth = 1 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2.75 6.25h10.5v9.5H2.75z" />
      <path d="M13.25 9.75h3.6l3.4 3.1v2.9h-7z" />
      <circle cx="7" cy="17.75" r="1.7" />
      <circle cx="16.75" cy="17.75" r="1.7" />
      <path d="M8.7 17.75h6.35M2.75 15.75h1.55" />
    </svg>
  );
}
