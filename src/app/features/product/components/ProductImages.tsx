import { useRef, useState } from 'react';

interface ProductImagesProps {
  images: string[];
  name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const list = images.length > 0 ? images : [];

  const go = (dir: 1 | -1) =>
    setActive((a) => (a + dir + list.length) % list.length);

  /* Swipe en mobile: deslizar izquierda/derecha cambia la imagen */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || list.length < 2) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  if (list.length === 0) {
    return (
      <div className="flex h-[55svh] items-center justify-center bg-surface-raised text-text-muted">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    /* Galería que cabe en el viewport: la imagen principal ocupa el espacio
       disponible. En mobile se navega con swipe + puntos; en desktop con
       miniaturas. */
    <div className="flex flex-col gap-3 h-[66svh] md:h-[calc(100svh-13rem)] md:max-h-[760px]">
      {/* Imagen principal — con padding para que no quede pegada a los bordes */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden bg-surface-raised"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 p-4 md:p-6">
          <img
            src={list[active]}
            alt={name}
            className="h-full w-full object-contain transition-opacity duration-300"
            draggable={false}
          />
        </div>

        {/* Puntos del carrusel — solo mobile */}
        {list.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 md:hidden">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Imagen ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active === i ? 'w-4 bg-text' : 'w-1.5 bg-text/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas — solo desktop */}
      {list.length > 1 && (
        <div className="hidden shrink-0 grid-cols-3 gap-3 md:grid">
          {list.slice(0, 3).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 overflow-hidden border bg-surface-raised transition-colors md:h-24 ${
                active === i ? 'border-text' : 'border-border opacity-90 hover:opacity-100'
              }`}
            >
              <div className="absolute inset-0 p-2">
                <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-contain" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
