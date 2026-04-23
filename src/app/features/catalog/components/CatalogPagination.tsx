interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

interface CatalogPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

function getVisiblePages(current: number, total: number): (number | '...')[] {
  const maxVisible = 5;
  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];
  let start = Math.max(1, current - 2);
  let end = Math.min(total, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) pages.push(i);
  }

  if (end < total) {
    if (end < total - 1) pages.push('...');
    pages.push(total);
  }

  return pages;
}

export default function CatalogPagination({ pagination, onPageChange }: CatalogPaginationProps) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 pt-6 pb-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 sm:px-5 py-2 sm:py-2.5 font-heading text-xs sm:text-xs uppercase tracking-wider border border-border text-text-muted rounded-lg hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Atrás
      </button>

      <div className="flex items-center gap-1 sm:gap-1.5">
        {visiblePages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-heading rounded-lg transition-colors ${
                p === page
                  ? 'bg-black text-white'
                  : 'border border-border text-text-muted hover:border-black hover:text-black'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 sm:px-5 py-2 sm:py-2.5 font-heading text-xs sm:text-xs uppercase tracking-wider bg-black text-white rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}
