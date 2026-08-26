interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** Autenticidad — sello con estrella y cintas, trazo fino. */
export default function AwardStarLineIcon({ size = 30, className, strokeWidth = 1 }: IconProps) {
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
      <circle cx="12" cy="8.2" r="5.45" />
      <path d="M12 5.35 12.95 7.4l2.25.33-1.63 1.58.38 2.24L12 10.5l-1.95 1.05.38-2.24-1.63-1.58 2.25-.33Z" />
      <path d="M8.55 12.85 7.15 20.7 12 17.85 16.85 20.7 15.45 12.85" />
    </svg>
  );
}
