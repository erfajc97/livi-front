const STEPS = [
  { n: '01', h: 'Descubre', t: 'Empieza con 3 ml. Conoce el perfume antes de invertir en un frasco completo.' },
  { n: '02', h: 'Decide', t: 'Decide con calma cuál es tu fragancia, probando las que quieras.' },
  { n: '03', h: 'Disfruta', t: 'Recíbelo en decant o en frasco sellado, como prefieras.' },
];

/**
 * "Cómo funciona" — tres pasos editoriales (ref. DecantStory).
 *
 * Sin el rótulo "— Cómo funciona" (REQ-007): el título arranca la sección.
 * Los números mandan (REQ-008) y el alto es compacto en desktop (REQ-009).
 */
export default function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-surface-raised px-6 py-10 md:px-14 md:py-16">
      <div className="mx-auto max-w-[720px] text-center">
        <h2 className="font-display text-4xl font-light leading-none tracking-[-0.02em] text-text md:text-6xl">
          Tres pasos hacia <span className="italic">tu fragancia.</span>
        </h2>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1200px] gap-8 md:mt-12 md:grid-cols-3 md:gap-14">
        {STEPS.map((s) => (
          <div key={s.n}>
            <div className="font-display text-5xl font-light italic leading-none tracking-[-0.02em] text-accent md:text-6xl">
              {s.n}
            </div>
            <div className="mb-3 mt-3 h-px bg-border md:mb-4 md:mt-4" />
            <div className="font-display text-3xl font-light tracking-[-0.01em] text-text">{s.h}</div>
            <p className="mt-2 font-body text-sm leading-[1.7] text-text-soft md:mt-3">{s.t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
