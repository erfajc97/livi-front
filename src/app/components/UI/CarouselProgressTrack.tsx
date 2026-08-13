import type { MouseEvent } from 'react';

interface CarouselProgressTrackProps {
  /** Progreso 0–1 del recorrido (scrollProgress de Embla). */
  progress: number;
  /** Nº de posiciones (snaps) del carrusel. */
  snapCount: number;
  /** Salta a la posición correspondiente a una proporción 0–1 del recorrido. */
  onSeek: (ratio: number) => void;
  className?: string;
}

/**
 * Barra de avance continua (REQ-026): un solo riel gris con el tramo activo
 * en negro que se desplaza según la posición del carrusel — no segmentos.
 * El ancho del tramo es 1/snapCount del riel y su desplazamiento sigue al
 * `scrollProgress` de Embla (se actualiza también durante el arrastre).
 * Clic sobre el riel para saltar a esa parte del recorrido.
 */
export default function CarouselProgressTrack({
  progress,
  snapCount,
  onSeek,
  className = '',
}: CarouselProgressTrackProps) {
  if (snapCount <= 1) return null;

  const thumbPct = 100 / snapCount;
  // translateX en % del propio tramo: de 0 a (snapCount - 1) veces su ancho.
  const offsetPct = Math.min(1, Math.max(0, progress)) * (snapCount - 1) * 100;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    onSeek((e.clientX - rect.left) / rect.width);
  };

  return (
    <div
      role="slider"
      aria-label="Progreso del carrusel"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(Math.min(1, Math.max(0, progress)) * 100)}
      onClick={handleClick}
      /* Riel corto y centrado: a lo ancho de la sección parecía un separador,
         no un indicador de avance. */
      className={`relative mx-auto h-4 w-full max-w-[180px] cursor-pointer md:max-w-[220px] ${className}`}
    >
      {/* Riel gris (hit-area de 16px, trazo visible de 3px centrado) */}
      <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-border" />
      {/* Tramo activo negro */}
      <div
        className="absolute left-0 top-1/2 h-[3px] rounded-full bg-text"
        style={{ width: `${thumbPct}%`, transform: `translateX(${offsetPct}%) translateY(-50%)` }}
      />
    </div>
  );
}
