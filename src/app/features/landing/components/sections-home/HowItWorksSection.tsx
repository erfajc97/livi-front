const STEPS = [
  { n: '01', h: 'Descubre', t: 'Decants desde 2 ml. Prueba sin comprometer un frasco entero.' },
  { n: '02', h: 'Decide', t: 'Encuentra la fragancia que cambia algo en ti — sin prisa.' },
  { n: '03', h: 'Disfruta', t: 'NonDecants o frascos sellados, según el ritual que prefieras.' },
];

/** "Cómo funciona" — tres pasos editoriales (ref. DecantStory). */
export default function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-surface-raised px-6 py-16 md:px-14 md:py-24">
      <div className="mx-auto max-w-[720px] text-center">
        <span className="eyebrow">— Cómo funciona</span>
        <h2 className="mt-6 font-display text-4xl font-light leading-none tracking-[-0.02em] text-text md:text-7xl">
          Tres pasos hacia <span className="italic">tu fragancia.</span>
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-[1200px] gap-10 md:mt-24 md:grid-cols-3 md:gap-16">
        {STEPS.map((s) => (
          <div key={s.n}>
            <div className="font-display text-sm italic tracking-[0.08em] text-accent">— {s.n}</div>
            <div className="mb-6 mt-4 h-px bg-border" />
            <div className="font-display text-3xl font-light tracking-[-0.01em] text-text">{s.h}</div>
            <p className="mt-3 font-body text-sm leading-[1.7] text-text-soft">{s.t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
