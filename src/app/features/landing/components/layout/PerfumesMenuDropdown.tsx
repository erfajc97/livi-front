import { useNormalCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery';

interface PerfumesMenuDropdownProps {
  activeCategory: number;
  setActiveCategory: (idx: number) => void;
  onClose: () => void;
  dropdownRef: React.Ref<HTMLDivElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function PerfumesMenuDropdown({
  activeCategory,
  setActiveCategory,
  onClose,
  dropdownRef,
  onMouseEnter,
  onMouseLeave,
}: PerfumesMenuDropdownProps) {
  const { data: categories = [] } = useNormalCategoriesQuery();

  return (
    <div
      ref={dropdownRef}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden md:block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl w-[520px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer.png')" }}
      >
        {/* Title */}
        <div className="px-10 pt-7 pb-4">
          <h3 className="font-heading text-xl font-bold tracking-widest uppercase text-white text-center">
            PERFUMES <span className="text-accent">NONDECANTS</span>
          </h3>
        </div>

        {/* Categories list */}
        <div className="flex flex-col pb-6 px-4">
          {categories.length === 0 ? (
            <p className="text-center text-base text-white/50 py-4">Cargando...</p>
          ) : (
            <>
              {/* "All" category — always first, clickable link */}
              <div className="relative py-1">
                <a
                  href="/catalogo/perfumes"
                  onClick={onClose}
                  className="relative block w-full text-center py-3 font-heading text-lg font-bold tracking-wider uppercase text-accent hover:text-white transition-colors z-10"
                >
                  Ver Todos
                </a>
              </div>

              {categories.filter((c) => c.name.toLowerCase() !== 'all').map((cat, idx) => {
                const isActive = activeCategory === idx;
                return (
                  <div key={cat.id}>
                    <div className="relative py-1">
                      <button
                        onClick={() => setActiveCategory(isActive ? -1 : idx)}
                        onMouseEnter={() => setActiveCategory(idx)}
                        className={[
                          'relative w-full text-center py-3 font-heading text-lg font-bold tracking-wider uppercase transition-colors z-10',
                          isActive ? 'text-white' : 'text-white/80 hover:text-white',
                        ].join(' ')}
                      >
                        {cat.name}
                      </button>
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

                    {isActive && cat.marcas.length > 0 && (
                      <div className="px-6 py-3">
                        <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
                          {cat.marcas.map((sub) => (
                            <a
                              key={sub.id}
                              href={`/catalogo/perfumes?category=${cat.id}&marca=${sub.id}`}
                              onClick={onClose}
                              className="text-base text-white/80 hover:text-accent transition-colors flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                              {sub.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
