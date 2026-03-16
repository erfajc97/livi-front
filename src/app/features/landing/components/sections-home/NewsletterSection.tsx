import { useState } from 'react';
import LogoIconSvg from '@/assets/LogoIconSvg';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="w-full bg-white py-16">
      {/* Imagen full-width con overlay y form encima */}
      <div className="relative overflow-hidden mx-auto">
        <img
          src="/img-subs.png"
          alt=""
          className="w-full h-96 sm:h-[400px] lg:h-[450px] object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 z-10 mx-auto w-full max-w-8xl px-4 lg:px-28 flex flex-col justify-center gap-6">
          {/* Logo + línea con punta */}
          <div className="flex flex-col items-start gap-4">
            <LogoIconSvg width={420} height={66} />
            <svg width="420" height="4" viewBox="0 0 420 4" fill="none">
              <line x1="0" y1="2" x2="416" y2="2" stroke="white" strokeWidth="1.5" />
              <polygon points="416,0 420,2 416,4" fill="white" />
            </svg>
          </div>

          {/* Form centrado */}
          <div className="flex justify-center w-full">
            {submitted ? (
              <p className="text-white font-heading uppercase tracking-wider text-lg">
                ¡Gracias! Te avisaremos con las novedades.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 w-full max-w-3xl">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  className="flex-1 w-full px-6 py-4 bg-white text-bg placeholder:text-gray-400 text-base md:text-lg focus:outline-none rounded-md"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-black text-white font-heading text-sm md:text-base uppercase tracking-widest hover:bg-black/80 transition-colors shrink-0 whitespace-nowrap rounded-md"
                >
                  Suscribirme a NonDecants
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
