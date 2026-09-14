/**
 * Historia + Taller (ref. PDF home: bloques "historia" y "taller") —
 * dos tarjetas editoriales redireccionables a las páginas de marca.
 */
const CARDS = [
  {
    href: '/nuestra-historia',
    eyebrow: 'Nuestra historia',
    title: 'Por qué existe LIVI',
    copy: 'Empezamos buscando una pañalera que quisiéramos cargar todos los días. No existía, así que la hicimos.',
    image: '/productos/marca-familia.jpg',
    alt: 'Familia LIVI con su pañalera de cuero',
  },
  {
    href: '/el-taller',
    eyebrow: 'El taller',
    title: 'Hecho a mano en Ecuador',
    copy: 'Cuero genuino cortado, cosido y terminado por artesanos ecuatorianos. Cada pieza pasa por nuestras manos.',
    image: '/productos/marca-taller.jpg',
    alt: 'El taller LIVI trabajando el cuero',
  },
];

export default function StoryTallerSection() {
  return (
    <section className="bg-bg px-6 py-10 md:px-14 md:py-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {CARDS.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden md:min-h-[420px]"
          >
            <img
              src={c.image}
              alt={c.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/35 to-transparent" />
            <div className="relative flex flex-col gap-2 p-6 md:p-9">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#F5EFC6]/70">
                {c.eyebrow}
              </p>
              <h3 className="font-heading text-3xl font-normal leading-tight text-[#F5EFC6] md:text-4xl">
                {c.title}
              </h3>
              <p className="max-w-md font-body text-[13px] leading-relaxed text-[#F5EFC6]/85 md:text-sm">
                {c.copy}
              </p>
              <span className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5EFC6]">
                Conocer más
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M14 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
