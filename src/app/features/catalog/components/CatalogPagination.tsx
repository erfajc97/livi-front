interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

interface CatalogPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function CatalogPagination({ pagination, onPageChange }: CatalogPaginationProps) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 pt-6">
      {/* ATRÁS */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 sm:px-5 py-2 sm:py-2.5 font-heading text-[10px] sm:text-xs uppercase tracking-wider border border-gray-300 text-gray-600 rounded-lg hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Atrás
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-heading rounded-lg transition-colors ${
              p === page
                ? 'bg-black text-white'
                : 'border border-gray-300 text-gray-500 hover:border-black hover:text-black'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* SIGUIENTE */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 sm:px-5 py-2 sm:py-2.5 font-heading text-[10px] sm:text-xs uppercase tracking-wider bg-black text-white rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}
