import { useState } from 'react';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { toast } from 'sonner';
import CaballitoDivider from '../shared/CaballitoDivider';

/**
 * Newsletter LIVI — banda burgundy con el caballito y el formulario en
 * línea editorial (ref. PDF: newsletter como componente transversal).
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(API_ENDPOINTS.NEWSLETTER_SUBSCRIBE, { email });
      setSubmitted(true);
      toast.success('¡Te has suscrito exitosamente!');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Error al suscribirse. Intenta de nuevo.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-accent px-6 py-12 md:px-14 md:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 text-center">
        <CaballitoDivider tone="butter" className="w-full max-w-sm" />

        <h2 className="font-heading text-3xl font-normal leading-tight text-[#F5EFC6] md:text-4xl">
          Novedades de la colección
        </h2>
        <p className="max-w-md font-body text-sm leading-relaxed text-[#F5EFC6]/80">
          Lanzamientos, colores nuevos y piezas del taller. Sin ruido: solo
          cuando hay algo que valga la pena contar.
        </p>

        {submitted ? (
          <p className="font-heading text-lg italic text-[#F5EFC6]">
            ¡Gracias! Te avisaremos con las novedades.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-xl flex-col items-stretch gap-4 sm:flex-row sm:items-end"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              required
              disabled={loading}
              aria-label="Tu correo electrónico"
              className="flex-1 border-b border-[#F5EFC6]/40 bg-transparent px-1 py-3 font-body text-base text-[#F5EFC6] placeholder:text-[#F5EFC6]/50 focus:border-[#F5EFC6] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 whitespace-nowrap border border-[#F5EFC6] px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5EFC6] transition-colors hover:bg-[#F5EFC6] hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Enviando…' : 'Suscribirme'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
