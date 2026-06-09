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
      <div className="flex aspect-[5/6] items-center justify-center bg-surface-raised text-text-muted">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      {/* Imagen principal — grande, editorial */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-raised md:aspect-[5/6]">
        <img
          src={list[active]}
          alt={name}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        {bajoPedido && (
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 border border-accent bg-bg px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.22em] text-text">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" />
            Bajo Pedido
          </span>
        )}
      </div>

      {/* Miniaturas */}
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {list.slice(0, 3).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden border transition-colors ${
                active === i ? 'border-text' : 'border-border opacity-90 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
