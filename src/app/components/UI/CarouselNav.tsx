import { useCallback, useEffect, useRef, useState } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

/**
 * Estado de navegación de un carrusel Embla: flechas (con extremos) y posición
 * para la barra inferior. Se comparte entre todas las secciones de la landing.
 */
export function useCarouselNav(emblaApi: EmblaCarouselType | undefined) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const sync = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setProgress(Math.min(1, Math.max(0, emblaApi.scrollProgress())));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onReInit = () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      sync();
    };
    onReInit();
    emblaApi.on('select', sync);
    emblaApi.on('scroll', sync);
    emblaApi.on('reInit', onReInit);
    return () => {
      emblaApi.off('select', sync);
      emblaApi.off('scroll', sync);
      emblaApi.off('reInit', onReInit);
    };
  }, [emblaApi, sync]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /** Salta al "grupo" correspondiente a una proporción 0–1 del recorrido. */
  const seekRatio = useCallback(
    (ratio: number) => {
      if (!emblaApi) return;
      const last = emblaApi.scrollSnapList().length - 1;
      if (last < 0) return;
      emblaApi.scrollTo(Math.round(Math.min(1, Math.max(0, ratio)) * last));
    },
    [emblaApi],
  );

  return { canPrev, canNext, progress, snapCount, scrollPrev, scrollNext, seekRatio };
}

/**
 * Alto de la parte visual de la card (la imagen) dentro del carrusel, para
 * poder centrar las flechas con ella y no con el bloque completo (imagen +
 * nombre + precio + chips). Se recalcula al redimensionar.
 */
export function useMediaCenterTop(
  containerRef: React.RefObject<HTMLElement | null>,
  /** Cambia cuando el contenido se monta/renueva (p. ej. nº de items). */
  contentKey?: unknown,
) {
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;

    const media = root.querySelector('[data-card-media]');
    if (!media) return;

    const measure = () => setTop((media as HTMLElement).offsetHeight / 2);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(media);
    return () => observer.disconnect();
  }, [containerRef, contentKey]);

  return top;
}

interface ArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  /** Clases de posición (absolute left/right …). */
  className?: string;
  /** Posición vertical en px (centro de la imagen de la card). */
  top?: number | null;
}

/**
 * Flecha de carrusel — bloque sólido oscuro, siempre visible en desktop para
 * que se note que hay más productos.
 */
export function CarouselArrow({ direction, onClick, disabled, className = '', top }: ArrowProps) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Anterior' : 'Siguiente'}
      style={top != null ? { top: `${top}px` } : undefined}
      className={`z-20 hidden h-12 w-9 items-center justify-center bg-text text-bg shadow-[0_2px_10px_rgba(28,26,23,0.18)] transition-opacity hover:bg-accent disabled:pointer-events-none disabled:opacity-25 sm:flex ${className}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={isPrev ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  );
}

interface ProgressProps {
  progress: number;
  snapCount: number;
  onSeek: (ratio: number) => void;
  className?: string;
}

/**
 * Barra inferior de posición: muestra en qué parte del carrusel estás y
 * permite arrastrar para desplazarse. Siempre visible — cuando todo cabe en
 * una vista el indicador ocupa el ancho completo (señal de "no hay más").
 */
export function CarouselProgressBar({ progress, snapCount, onSeek, className = '' }: ProgressProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const hasPages = snapCount > 1;
  const thumbWidth = hasPages ? Math.max(100 / snapCount, 12) : 100;

  const seek = (clientX: number) => {
    if (!hasPages) return;
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    onSeek((clientX - rect.left) / rect.width);
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Posición del carrusel"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={0}
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          seek(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) seek(e.clientX);
        }}
        onPointerUp={(e) => {
          draggingRef.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
        className="relative h-3 w-full max-w-36 cursor-pointer touch-none"
      >
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        <span
          className="absolute top-1/2 h-px -translate-y-1/2 bg-text transition-[left] duration-150"
          style={{ width: `${thumbWidth}%`, left: `${progress * (100 - thumbWidth)}%` }}
        />
      </div>
    </div>
  );
}
