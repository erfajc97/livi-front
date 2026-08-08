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
 * "Nuestro Compromiso" — cada card es un pedazo real de vidrio vertical
 * (placa de cristal generada con IA, centro transparente): arriba la gota
 * de cristal con el icono dentro, abajo el texto — todo DENTRO del vidrio.
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

        {/* Fila horizontal de 4 en todos los tamaños */}
        <div className="grid grid-cols-4 gap-2 md:gap-8">
          {COMMITMENTS.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="relative mx-auto aspect-[504/720] w-full max-w-[230px]"
            >
              {/* Pedazo de vidrio — el contenedor ES la placa */}
              <img
                src="/images/commitment/glass-slab.webp"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full select-none object-fill"
                draggable={false}
              />

              {/* Contenido dentro del vidrio */}
              <div className="relative flex h-full flex-col items-center px-[9%] pt-[9%] text-center md:pt-[11%]">
                {/* Gota de cristal + icono suspendido */}
                <span className="relative block w-10 md:w-28">
                  <img
                    src="/images/commitment/droplet-crystal.webp"
                    alt=""
                    loading="lazy"
                    className="block h-auto w-full select-none"
                    draggable={false}
                  />
                  <span className="absolute left-[46%] top-[45%] -translate-x-1/2 -translate-y-1/2 text-accent">
                    <Icon size={11} className="md:hidden" />
                    <Icon size={26} className="hidden md:block" />
                  </span>
                </span>

                {/* Título + texto centrados en el espacio restante:
                    el centro de la placa ya no queda vacío */}
                <span className="flex w-full flex-1 flex-col items-center justify-center gap-0.5 pb-[16%] md:gap-2 md:pb-[18%]">
                  <span className="font-body text-[6.5px] uppercase leading-snug tracking-[0.08em] text-text md:text-[13px] md:tracking-[0.18em]">
                    {title}
                  </span>
                  <span className="line-clamp-2 font-display text-[7.5px] italic leading-snug text-text-muted md:line-clamp-none md:text-[15px]">
                    {text}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
