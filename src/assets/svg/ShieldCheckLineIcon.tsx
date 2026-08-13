interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Autenticidad — escudo con check, trazo fino.
 *
 * `pathLength={1}` normaliza el largo de cada trazo: así el dibujado por partes
 * (ver `.commit-icon--seal` en global.css) usa las mismas medidas sin importar
 * el tamaño real del path.
 */
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
      <path
        className="ci-part ci-part-1"
        pathLength={1}
        d="M12 2.75 4.75 5.6v5.3c0 4.6 3.05 8.4 7.25 9.35 4.2-.95 7.25-4.75 7.25-9.35V5.6L12 2.75Z"
      />
      <path className="ci-part ci-part-2" pathLength={1} d="M8.9 11.9 11.2 14.2l4-4.4" />
    </svg>
  );
}
