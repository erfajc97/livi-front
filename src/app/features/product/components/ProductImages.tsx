import { useState } from 'react';

interface ProductImagesProps {
  images: string[];
  name: string;
  bajoPedido?: boolean;
}

export default function ProductImages({ images, name, bajoPedido }: ProductImagesProps) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [];

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
       disponible (flex-1) y las miniaturas quedan visibles sin hacer scroll. */
    <div className="flex flex-col gap-3 h-[66svh] md:h-[calc(100svh-13rem)] md:max-h-[760px]">
      {/* Imagen principal — con padding para que no quede pegada a los bordes */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-surface-raised">
        <div className="absolute inset-0 p-4 md:p-6">
          <img
            src={list[active]}
            alt={name}
            className="h-full w-full object-contain transition-opacity duration-300"
          />
        </div>
        {bajoPedido && (
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 border border-accent bg-bg px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.22em] text-text">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" />
            Bajo Pedido
          </span>
        )}
      </div>

      {/* Miniaturas */}
      {list.length > 1 && (
        <div className="grid shrink-0 grid-cols-3 gap-3">
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
