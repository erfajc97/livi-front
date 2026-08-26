/**
 * Copy y CTAs del banner. En desktop van sobre el slide 1 (onDark);
 * en móvil, debajo de la foto.
 */
export default function BannerHeroCopy({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="max-w-[38rem]">
      <p
        className={`font-body text-[10px] uppercase tracking-[0.22em] ${
          onDark ? 'text-bg/75' : 'text-text-muted'
        }`}
      >
        Perfumería · Ecuador
      </p>
      <p
        className={`mt-3 font-display text-[clamp(2rem,4.4vw,3.35rem)] font-light leading-[1.08] tracking-[-0.02em] ${
          onDark ? 'text-bg' : 'text-text'
        }`}
      >
        Perfumes originales y decants en Ecuador
      </p>
      <p
        className={`mt-4 max-w-[46ch] font-body text-sm leading-[1.65] md:text-[15px] ${
          onDark ? 'text-bg/85' : 'text-text-soft'
        }`}
      >
        Prueba en decant de 3 ml{' '}
        <strong className={`font-semibold ${onDark ? 'text-bg' : 'text-text'}`}>
          desde $3,75
        </strong>{' '}
        antes de comprometerte con el frasco entero. Árabes, nicho y de diseñador.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href="/catalogo/perfumes"
          className={`inline-flex items-center justify-center px-5 py-2.5 font-body text-[11px] uppercase tracking-[0.18em] transition-colors md:px-6 md:py-3 ${
            onDark
              ? 'bg-bg text-text hover:bg-accent hover:text-bg'
              : 'bg-text text-bg hover:bg-accent'
          }`}
        >
          Ver el catálogo
        </a>
        <a
          href="/decants"
          className={`inline-flex items-center justify-center border bg-transparent px-5 py-2.5 font-body text-[11px] uppercase tracking-[0.18em] transition-colors md:px-6 md:py-3 ${
            onDark
              ? 'border-bg/45 text-bg/90 hover:border-bg hover:text-bg'
              : 'border-border text-text-soft hover:border-text hover:text-text'
          }`}
        >
          Cómo funcionan los decants
        </a>
      </div>
    </div>
  );
}
