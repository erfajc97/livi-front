import { PERFUME_CATEGORIES } from '../../data';

interface PerfumeDropdownProps {
  activeCategory: number;
  setActiveCategory: (idx: number) => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function PerfumeDropdown({ activeCategory, setActiveCategory, onClose, dropdownRef }: PerfumeDropdownProps) {
  return (
    <div
      ref={dropdownRef}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden md:block"
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl w-[420px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer.png')" }}
      >
        {/* Title */}
        <div className="px-10 pt-7 pb-4">
          <h3 className="font-heading text-lg font-bold tracking-widest uppercase text-white text-center">
            PERFUMES <span className="text-accent">NONDECANTS</span>
          </h3>
        </div>

        {/* Categories list */}
        <div className="flex flex-col pb-6 px-4">
          {PERFUME_CATEGORIES.map((cat, idx) => {
            const isActive = activeCategory === idx;
            return (
              <div key={cat.label}>
                {/* Category button with ribbon shape when active */}
                <div className="relative py-1">
                  <button
                    onClick={() => setActiveCategory(isActive ? -1 : idx)}
                    className={[
                      'relative w-full text-center py-3 font-heading text-base font-bold tracking-wider uppercase transition-colors z-10',
                      isActive ? 'text-white' : 'text-white/80 hover:text-white',
                    ].join(' ')}
                  >
                    {cat.label}
                  </button>
                  {/* Ribbon bg shape — points inward */}
                  {isActive && (
                    <div
                      className="absolute inset-y-1 inset-x-0"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        clipPath: 'polygon(0% 0%, 100% 0%, 96% 50%, 100% 100%, 0% 100%, 4% 50%)',
                      }}
                    />
                  )}
                </div>

                {/* Subcategories inline below selected category */}
                {isActive && (
                  <div className="px-6 py-3">
                    <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
                      {cat.subcategories.map((sub) => (
                        <a
                          key={sub}
                          href={`/bajo-pedido?category=${cat.label.toLowerCase()}&sub=${encodeURIComponent(sub.toLowerCase())}`}
                          onClick={onClose}
                          className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                          {sub}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
