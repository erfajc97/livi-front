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
 * "Nuestro Compromiso" — cuatro placas editoriales bajo el hero.
 * Placas sutiles (marfil claro, hairline dorado, sombra casi imperceptible),
 * no tarjetas de aplicación.
 */
export default function CommitmentStrip() {
  return (
    <div className="shrink-0 border-t border-border bg-bg-alt">
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-12 md:py-8">
        <div className="mb-4 flex items-center justify-center gap-4 md:mb-5">
          <span className="h-px w-8 bg-border" />
          <span className="eyebrow">Nuestro compromiso</span>
          <span className="h-px w-8 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
          {COMMITMENTS.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-2 rounded-[14px] border border-accent/25 bg-surface-raised px-3 py-4 text-center shadow-[0_1px_2px_rgba(28,26,23,0.03)] md:gap-2.5 md:px-6 md:py-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/5 text-accent md:h-12 md:w-12">
                <Icon size={26} className="md:hidden" />
                <Icon size={30} className="hidden md:block" />
              </span>
              <span className="font-body text-[9px] uppercase leading-tight tracking-[0.14em] text-text md:text-[11px] md:tracking-[0.16em]">
                {title}
              </span>
              <span className="font-display text-[13px] italic leading-snug text-text-muted md:text-[15px]">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
