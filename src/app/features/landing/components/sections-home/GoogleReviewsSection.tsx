/**
 * Bloque de valoraciones del home: va justo después del blog.
 * El sello oficial de Merchant Center sigue siendo el widget flotante
 * (Google no permite incrustarlo). Este bloque es el lugar editorial
 * donde presentamos las reseñas verificadas.
 */
export default function GoogleReviewsSection() {
  return (
    <section
      id="valoraciones"
      className="border-y border-border bg-surface-raised px-6 py-8 md:px-14 md:py-14"
    >
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <h2 className="font-display text-3xl font-light leading-none tracking-[-0.02em] text-text md:text-5xl">
          Valoraciones.
        </h2>
        <p className="mt-4 font-display text-xl font-light italic leading-snug text-text md:text-2xl">
          Clientes verificados por Google
        </p>
        <p className="mt-3 max-w-md font-body text-[13px] leading-relaxed text-text-soft md:text-sm">
          Opiniones reales de compradores en Ecuador. El sello lo emite Google, no
          nosotros.
        </p>
        <div id="google-customer-reviews-badge" className="mt-6 flex justify-center" />
      </div>
    </section>
  );
}
