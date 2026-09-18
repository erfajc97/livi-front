import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { DeliveryMethod, DeliveryOption } from '../types';

/** Métodos que el cliente retira en persona (no se envían). */
export const PICKUP_METHODS: DeliveryMethod[] = ['ENTREGA_PERSONAL', 'RETIRO_PIWU'];

export const isPickupMethod = (method: DeliveryMethod | null) =>
  method != null && PICKUP_METHODS.includes(method);

/**
 * Puntos de retiro con su ubicación real en Google Maps: quien retira necesita
 * saber a dónde ir, y un nombre suelto no alcanza.
 */
const PICKUP_PLACES: Record<string, { name: string; hint: string; mapsUrl: string }> = {
  RETIRO_PIWU: {
    name: 'Piwu Market',
    hint: 'Retiro en el local',
    mapsUrl: 'https://maps.app.goo.gl/D2wHX9e1yFdRVpmAA',
  },
  ENTREGA_PERSONAL: {
    name: 'Plaza Tía — La Joya',
    hint: 'Entrega personal en el punto acordado',
    mapsUrl: 'https://maps.app.goo.gl/gHDxiQzobtaQyameA',
  },
};

export type DeliveryMode = 'shipping' | 'pickup';

interface DeliverySectionProps {
  options: DeliveryOption[];
  isLoading: boolean;
  selected: DeliveryMethod | null;
  onSelect: (method: DeliveryMethod) => void;
  mode: DeliveryMode;
  onModeChange: (mode: DeliveryMode) => void;
}

export default function DeliverySection({
  options,
  isLoading,
  selected,
  onSelect,
  mode,
  onModeChange,
}: DeliverySectionProps) {
  const modeOptions: { id: DeliveryMode; label: string; hint: string }[] = [
    { id: 'shipping', label: 'Quiero que me lo envíen', hint: 'Servientrega a todo el país' },
    { id: 'pickup', label: 'Lo recogeré en tienda', hint: 'Guayaquil · sin costo de envío' },
  ];

  const visibleOptions = options.filter((opt) =>
    mode === 'pickup' ? PICKUP_METHODS.includes(opt.method) : !PICKUP_METHODS.includes(opt.method),
  );

  return (
    <section className="flex flex-col gap-7">
      {/* 1 · Cómo lo recibe */}
      <div>
        <h2 className="mb-4 font-heading text-xl font-normal text-text">
          ¿Cómo quieres recibir tu pedido?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {modeOptions.map((opt) => {
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onModeChange(opt.id)}
                className={`flex flex-col items-center gap-1 border px-4 py-4 text-center transition-colors ${
                  active
                    ? 'border-text bg-bg-alt text-text'
                    : 'border-border text-text-soft hover:border-text hover:text-text'
                }`}
              >
                <span className="font-body text-[13px] font-medium leading-snug">{opt.label}</span>
                <span className="font-body text-[11px] text-text-muted">{opt.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 · Método concreto, con su costo siempre visible */}
      <div>
        <h2 className="mb-4 font-heading text-xl font-normal text-text">
          {mode === 'pickup' ? 'Puntos de retiro' : 'Métodos de envío'}
        </h2>

        {isLoading ? (
          <p className="py-3 text-center font-body text-sm text-text-muted">Cargando opciones…</p>
        ) : visibleOptions.length === 0 ? (
          <p className="py-3 text-center font-body text-sm text-text-muted">
            {mode === 'pickup'
              ? 'No hay puntos de retiro para la ciudad seleccionada.'
              : 'No hay envíos disponibles para la ciudad seleccionada.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visibleOptions.map((opt) => {
              const active = selected === opt.method;
              const place = PICKUP_PLACES[opt.method];
              return (
                <div
                  key={opt.id}
                  className={`border transition-colors ${
                    active ? 'border-text bg-bg-alt' : 'border-border hover:border-text'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(opt.method)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                          active ? 'border-text' : 'border-border'
                        }`}
                      >
                        {active && <span className="h-2 w-2 bg-text" />}
                      </span>
                      <span className="font-body text-[13px] leading-snug text-text">
                        {place?.name ?? opt.label}
                        {place && (
                          <span className="block font-body text-[11px] text-text-muted">
                            {place.hint}
                          </span>
                        )}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 font-body text-sm ${opt.cost === 0 ? 'text-accent' : 'text-text'}`}
                    >
                      {opt.cost === 0 ? 'Gratis' : formatCurrency(opt.cost)}
                    </span>
                  </button>

                  {place && (
                    <a
                      href={place.mapsUrl}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1.5 border-t border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted transition-colors hover:text-text"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Ver ubicación en Maps
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-2.5 font-body text-[11px] text-text-muted">
          El costo de envío puede variar según la ciudad de entrega.
        </p>
      </div>
    </section>
  );
}
