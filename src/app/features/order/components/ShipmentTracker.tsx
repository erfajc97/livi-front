import { BTN_PRIMARY, INPUT_UNDERLINE } from '@/app/components/UI/formClasses';
import { useShipmentTrackerHook } from '../hooks/useShipmentTrackerHook';
import { SEARCH_OPTIONS, SEARCH_PLACEHOLDERS } from '../data';

export default function ShipmentTracker() {
  const { searchType, setSearchType, trackingNumber, setTrackingNumber, handleSubmit } =
    useShipmentTrackerHook();

  return (
    <div className="border border-border bg-surface p-6 sm:p-10">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-6 text-center">

        {/* Servientrega logo */}
        <img
          src="/servientrega.png"
          alt="Servientrega"
          className="h-20 object-contain sm:h-24"
        />

        {/* Title */}
        <h2 className="font-heading text-xl font-normal text-text sm:text-2xl">
          Rastrea la ubicación de tu envío
        </h2>

        {/* Radio buttons — cuadrados, como el resto del flujo de compra */}
        <div className="flex items-center gap-6">
          {SEARCH_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2"
              onClick={() => setSearchType(opt.value)}
            >
              <span
                className={[
                  'flex h-4 w-4 items-center justify-center border transition-colors',
                  searchType === opt.value ? 'border-text' : 'border-border',
                ].join(' ')}
              >
                {searchType === opt.value && <span className="h-2 w-2 bg-text" />}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text">
                {opt.label}
              </span>
            </label>
          ))}
        </div>

        {/* Input */}
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={SEARCH_PLACEHOLDERS[searchType]}
          className={INPUT_UNDERLINE}
        />

        {/* Button */}
        <button onClick={handleSubmit} className={BTN_PRIMARY}>
          Consultar
        </button>
      </div>
    </div>
  );
}
