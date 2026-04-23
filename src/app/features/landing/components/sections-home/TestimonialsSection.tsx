import { useState, useEffect } from 'react';
import TestimonialCard from '../TestimonialCard';
import { TESTIMONIALS } from '../../data';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Solo auto-rotar si hay más de 1 testimonial
    if (TESTIMONIALS.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [TESTIMONIALS.length]);

  const t = TESTIMONIALS[current];

  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Título */}
        <h2 className="font-heading text-2xl font-black md:text-3xl text-bg uppercase tracking-wide mb-8">
          Lo que opinan nuestros clientes
        </h2>

        <hr className="border-border mb-10" />

        {/* Contenido */}
        <TestimonialCard
          badge={t.badge}
          name={t.name}
          text={t.text}
          rating={t.rating}
          avatar={t.avatar}
          productImage={t.productImage}
        />

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Reseña ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? 'bg-bg' : 'bg-surface-raised'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
