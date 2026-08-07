import ShieldCheckLineIcon from '@/assets/svg/ShieldCheckLineIcon';
import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import ReturnLineIcon from '@/assets/svg/ReturnLineIcon';
import GlobeSearchLineIcon from '@/assets/svg/GlobeSearchLineIcon';

const COMMITMENTS = [
  {
    Icon: ShieldCheckLineIcon,
    title: 'Autenticidad garantizada',
    text: 'Cada decant es revisado por nosotros.',
  },
  {
    Icon: TruckLineIcon,
    title: 'Envíos a todo Ecuador',
    text: 'Recíbelo entre 24 y 72 horas.',
  },
  {
    Icon: ReturnLineIcon,
    title: 'Devolución en 7 días',
    text: 'Compra con tranquilidad.',
  },
  {
    Icon: GlobeSearchLineIcon,
    title: 'Fragancias por encargo',
    text: 'Encontramos perfumes de todo el mundo.',
  },
];

/**
 * "Nuestro Compromiso" — cuatro placas en forma de arco (silueta de decant)
 * con el icono suspendido dentro de una gota de agua dorada fotorrealista
 * (generada con IA, fondo transparente) y su gota satélite.
 */
export default function CommitmentStrip() {
  return (
    <div className="shrink-0 border-t border-border bg-bg-alt">
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-12 md:py-12">
        <div className="mb-6 flex items-center justify-center gap-4 md:mb-8">
          <span className="h-px w-8 bg-border" />
          <span className="eyebrow">Nuestro compromiso</span>
          <span className="h-px w-8 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {COMMITMENTS.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-b-md rounded-t-[999px] border border-accent/35 bg-surface-raised px-3 pb-6 pt-8 text-center shadow-[0_14px_34px_-16px_rgba(28,26,23,0.14)] md:px-5 md:pb-9 md:pt-12"
            >
              {/* Gota principal + icono suspendido + gota satélite */}
              <span className="relative mb-3 block w-24 md:mb-5 md:w-36">
                <img
                  src="/images/commitment/droplet-main.webp"
                  alt=""
                  loading="lazy"
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
                <span className="absolute left-[47%] top-[59%] -translate-x-1/2 -translate-y-1/2 text-accent">
                  <Icon size={18} className="md:hidden" />
                  <Icon size={28} className="hidden md:block" />
                </span>
                <img
                  src="/images/commitment/droplet-small.webp"
                  alt=""
                  loading="lazy"
                  className="absolute bottom-[6%] -right-2 w-5 select-none md:-right-3 md:w-7"
                  draggable={false}
                />
              </span>

              <span className="font-body text-[9px] uppercase leading-snug tracking-[0.14em] text-text md:text-[12px] md:tracking-[0.18em]">
                {title}
              </span>
              <span className="mt-1.5 font-display text-[11px] italic leading-snug text-text-muted md:mt-2.5 md:text-[15px]">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
