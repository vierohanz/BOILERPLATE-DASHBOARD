import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select } from './Select';

interface PaginationProps {
  page: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  perPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPerPageChange,
  perPageOptions = [5, 10, 25, 50, 100],
}) => {
  const getVisiblePages = (): (number | 'dots')[] => {
    const pages: (number | 'dots')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push('dots');

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push('dots');

    pages.push(totalPages);

    return pages;
  };

  const NavButton = ({
    onClick,
    disabled,
    children,
    ariaLabel,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    ariaLabel: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`h-9 w-9 flex items-center justify-center rounded-xl border border-border-subtle bg-surface-card transition-all duration-200 shadow-sm
        ${disabled 
          ? 'opacity-80 cursor-not-allowed text-text-muted' 
          : 'text-text-main hover:text-primary hover:border-primary/30 active:scale-95'
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      {/* Left: Info & PerPage */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-text-muted invisible sm:visible">
          Menampilkan{' '}
          <span className="text-text-main font-bold">{totalItems === 0 ? 0 : startIndex + 1}</span>
          –
          <span className="text-text-main font-bold">{endIndex}</span>
          {' '}dari{' '}
          <span className="text-text-main font-bold">{totalItems}</span>
        </span>

        <div className="flex items-center gap-3">
          <Select 
            value={perPage} 
            onChange={(val) => onPerPageChange(Number(val))}
            options={perPageOptions.map(o => ({ value: o, label: String(o) }))}
            className="w-20"
            position="up"
            variant="grid"
          />
        </div>
      </div>

      {/* Right: Page Navigation */}
      <div className="flex items-center gap-1.5">
        <NavButton onClick={() => onPageChange(1)} disabled={page <= 1} ariaLabel="Halaman pertama">
          <ChevronsLeft size={18} strokeWidth={2.5} />
        </NavButton>
        <NavButton onClick={() => onPageChange(page - 1)} disabled={page <= 1} ariaLabel="Halaman sebelumnya">
          <ChevronLeft size={18} strokeWidth={2.5} />
        </NavButton>

        {getVisiblePages().map((p, idx) =>
          p === 'dots' ? (
            <span
              key={`dots-${idx}`}
              className="h-9 w-9 flex items-center justify-center text-text-muted/40 text-xs font-bold select-none"
            >
              ···
            </span>
          ) : (
            <motion.button
              key={p}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-200 ${
                p === page
                  ? 'bg-primary text-slate-900 shadow-lg shadow-primary/25'
                  : 'border border-border-subtle bg-surface-card text-text-muted hover:text-text-main hover:border-primary/30'
              }`}
            >
              {p}
            </motion.button>
          )
        )}

        <NavButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} ariaLabel="Halaman berikutnya">
          <ChevronRight size={18} strokeWidth={2.5} />
        </NavButton>
        <NavButton onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} ariaLabel="Halaman terakhir">
          <ChevronsRight size={18} strokeWidth={2.5} />
        </NavButton>
      </div>
    </div>
  );
};
