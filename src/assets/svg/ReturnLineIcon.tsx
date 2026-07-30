interface IconProps {
  size?: number;
  className?: string;
}

/** Devolución — flecha de retorno sobre reloj, trazo fino. */
export default function ReturnLineIcon({ size = 30, className }: IconProps) {
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
      <path d="M3.6 12a8.4 8.4 0 1 0 2.5-6" />
      <path d="M3.35 3.4v3.4h3.4" />
      <path d="M12 8.1v4.15l2.75 1.6" />
    </svg>
  );
}
