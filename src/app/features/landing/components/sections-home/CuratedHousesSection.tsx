import { useMemo } from 'react';
import { useCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';

/**
 * "Casas que curamos" — todas las marcas reales del backend (de cada categoría)
 * en un carrusel infinito automático (marquee). Se pausa al pasar el mouse.
 */
export default function CuratedHousesSection() {
  const { data: categories = [] } = useCategoriesQuery();

  const brands = useMemo(() => {
    const seen = new Set<string>();
    const out: { id: string; name: string }[] = [];
    for (const cat of categories) {
      for (const m of cat.marcas) {
        const key = m.name.trim().toLowerCase();
        if (m.name && !seen.has(key)) {
          seen.add(key);
          out.push({ id: m.id, name: m.name });
        }
      }
    }
    return out;
  }, [categories]);

  if (brands.length === 0) return null;

  // Repetimos las marcas hasta llenar el ancho (con pocas marcas, una sola
  // pasada no cubre el viewport y el carrusel "empieza a la mitad"); luego
  // duplicamos ese bloque para que el loop sea continuo (translateX -50%).
  const repeats = Math.max(2, Math.ceil(16 / brands.length));
  const base = Array.from({ length: repeats }, () => brands).flat();
  const loop = [...base, ...base];
  const duration = Math.max(28, base.length * 3);

  return (
    <section className="border-b border-border bg-bg py-16 md:py-24">
      <div className="mb-9 text-center md:mb-14">
        <span className="eyebrow">— Casas que curamos</span>
      </div>

      <div className="marquee-wrap relative overflow-hidden">
        {/* Difuminado en los bordes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-bg to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-bg to-transparent md:w-32" />

        <div
          className="marquee-track flex w-max items-center"
          style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
        >
          {loop.map((b, i) => {
            const original = i % brands.length;
            return (
              <a
                key={`${b.id}-${i}`}
                href={`/catalogo/perfumes?marca=${b.id}`}
                className={`mx-6 shrink-0 font-display text-lg font-light tracking-[0.02em] text-text-soft transition-colors hover:text-accent md:mx-10 md:text-2xl ${
                  original % 3 === 0 ? 'italic' : ''
                }`}
              >
                {b.name}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
