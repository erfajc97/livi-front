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
    <section className="border-y border-border bg-surface-raised px-6 py-8 md:px-14 md:py-16">
      <div className="mx-auto max-w-[720px] text-center">
        <h2 className="font-display text-3xl font-light leading-none tracking-[-0.02em] text-text md:text-6xl">
          Tres pasos hacia <span className="italic">tu fragancia.</span>
        </h2>
      </div>

      {/* Mobile: número y título en la misma línea para no alargar el scroll. */}
      <div className="mx-auto mt-6 grid max-w-[1200px] gap-5 md:mt-12 md:grid-cols-3 md:gap-14">
        {STEPS.map((s) => (
          <div key={s.n} className="border-t border-border pt-4 md:border-t-0 md:pt-0">
            <div className="flex items-baseline gap-3 md:block">
              <span className="font-display text-2xl font-light italic leading-none tracking-[-0.02em] text-text md:block md:text-6xl">
                {s.n}
              </span>
              <span className="hidden md:mb-4 md:mt-4 md:block md:h-px md:bg-border" />
              <span className="font-display text-2xl font-light tracking-[-0.01em] text-text md:block md:text-3xl">
                {s.h}
              </span>
            </div>
            <p className="mt-1.5 font-body text-[13px] leading-[1.6] text-text-soft md:mt-3 md:text-sm md:leading-[1.7]">
              {s.t}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
