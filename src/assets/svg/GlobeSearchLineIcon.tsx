interface IconProps {
  size?: number;
  className?: string;
}

/** Encargos globales — globo con lupa, trazo fino. */
export default function GlobeSearchLineIcon({ size = 30, className }: IconProps) {
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
      <path d="M20.2 12.9a8.65 8.65 0 1 0-7.5 7.6" />
      <path d="M3.4 9.4h17.2M3.4 14.6h9.3" />
      <path d="M12 3.35c-2.4 2.5-3.6 5.35-3.6 8.65s1.2 6.15 3.6 8.65c2.05-2.15 3.25-4.5 3.55-7.1" />
      <circle cx="17.5" cy="17.5" r="3.1" />
      <path d="m19.9 19.9 1.75 1.75" />
    </svg>
  );
}
