"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build array of page numbers (e.g. [1, 2, 3, 4, 5])
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t-2 border-ink pt-8 font-mono text-xs">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-2 border-ink bg-paper px-3 py-1.5 uppercase transition-all hover:bg-ink hover:text-cream disabled:opacity-30 disabled:hover:bg-paper disabled:hover:text-ink cursor-pointer"
        >
          ← Prev
        </button>

        {/* Google-Style Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-[36px] border-2 font-bold transition-all cursor-pointer ${
                  isActive
                    ? "border-ink bg-ink text-cream shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "border-rule bg-paper hover:border-ink hover:bg-paper-deep"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-2 border-ink bg-paper px-3 py-1.5 uppercase transition-all hover:bg-ink hover:text-cream disabled:opacity-30 disabled:hover:bg-paper disabled:hover:text-ink cursor-pointer"
        >
          Next →
        </button>
      </div>

      {/* Page Info Counter */}
      <p className="text-muted text-[11px]">
        Page <span className="font-bold text-ink">{currentPage}</span> of{" "}
        <span className="font-bold text-ink">{totalPages}</span>
      </p>
    </div>
  );
}