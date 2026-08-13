interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Catálogo — tres frascos dentro de un marco, trazo fino (ANX-A).
 *
 * Cada parte lleva `pathLength={1}` para poder dibujarlas en orden: primero el
 * marco y después los frascos (ver `.commit-icon--rise` en global.css).
 */
export default function BottlesFrameLineIcon({ size = 30, className }: IconProps) {
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
      {/* Marco */}
      <path className="ci-part ci-part-1" pathLength={1} d="M3.4 3.4h17.2v17.2H3.4z" />
      {/* Frasco izquierdo */}
      <path
        className="ci-part ci-part-2"
        pathLength={1}
        d="M6.9 11.2h2.6v6.1H6.9zM7.6 11.2V9.9h1.2v1.3M7.9 8.6h.6v1.3h-.6z"
      />
      {/* Frasco central (más alto) */}
      <path
        className="ci-part ci-part-3"
        pathLength={1}
        d="M10.9 9.6h2.4v7.7h-2.4zM11.5 9.6V8.3h1.2v1.3M11.8 7h.6v1.3h-.6z"
      />
      {/* Frasco derecho */}
      <path
        className="ci-part ci-part-4"
        pathLength={1}
        d="M14.6 12.4h2.6v4.9h-2.6zM15.3 12.4v-1.2h1.2v1.2M15.6 9.9h.6v1.3h-.6z"
      />
    </svg>
  );
}
