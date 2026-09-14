import CaballitoDivider from '../shared/CaballitoDivider';

/**
 * Banda editorial LIVI (ref. PDF home: bloque "editorial") — la firma de
 * producto de la marca a todo ancho, cerrada por el separador del caballito.
 */
export default function EditorialBand() {
  return (
    <section className="border-y border-border bg-surface-raised px-6 py-12 md:px-14 md:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <CaballitoDivider tone="burgundy" className="w-full max-w-sm" />
        <p className="font-heading text-2xl font-normal italic leading-snug tracking-[-0.01em] text-text md:text-4xl">
          Cuero genuino. Hecho por artesanos ecuatorianos.
        </p>
        <p className="max-w-xl font-body text-sm leading-relaxed text-text-soft md:text-base">
          Piezas propias, producidas en Ecuador. Empezamos con pocas y bien
          resueltas: pañaleras y mochilas que no parecen de bebé, para tu vida
          y no solo para la etapa.
        </p>
      </div>
    </section>
  );
}
