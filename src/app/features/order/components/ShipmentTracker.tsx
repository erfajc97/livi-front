import { useShipmentTrackerHook } from '../hooks/useShipmentTrackerHook';
import { SEARCH_OPTIONS, SEARCH_PLACEHOLDERS } from '../data';

export default function ShipmentTracker() {
  const { searchType, setSearchType, trackingNumber, setTrackingNumber, handleSubmit } =
    useShipmentTrackerHook();

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
      <div className="flex flex-col items-center text-center gap-6 py-6 max-w-lg mx-auto">

        {/* Servientrega logo */}
        <img
          src="/servientrega.png"
          alt="Servientrega"
          className="h-20 sm:h-24 object-contain"
        />

        {/* Title */}
        <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wide text-black">
          Rastrea la ubicación de tu envío
        </h2>

        {/* Radio buttons */}
        <div className="flex items-center gap-6">
          {SEARCH_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setSearchType(opt.value)}
            >
              <span
                className={[
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
                  searchType === opt.value ? 'border-black' : 'border-text-muted',
                ].join(' ')}
              >
                {searchType === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-black" />
                )}
              </span>
              <span className="text-sm font-medium text-black">{opt.label}</span>
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
          className="w-full border border-border rounded-lg px-4 py-3 text-sm text-black placeholder:text-text-muted focus:outline-none focus:border-black transition-colors"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white font-heading font-bold text-sm uppercase tracking-wider py-3.5 rounded-full hover:bg-black/85 transition-colors"
        >
          Consultar
        </button>
      </div>
    </div>
  );
}
