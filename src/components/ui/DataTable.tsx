import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Database } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  startIndex?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  rowKey?: (item: T, index: number) => string | number;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  startIndex = 0,
  isLoading = false,
  emptyMessage = 'Tidak ada data ditemukan',
  emptyIcon,
  sortKey,
  sortDir,
  onSort,
  rowKey,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.03, 
        duration: 0.25, 
        ease: 'easeOut' as const 
      },
    }),
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown size={12} className="text-text-muted/30 group-hover:text-text-muted/60 transition-colors" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp size={12} className="text-primary" />
    ) : (
      <ArrowDown size={12} className="text-primary" />
    );
  };

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/60 ${
                    col.sortable && onSort ? 'cursor-pointer select-none group hover:text-text-muted transition-colors' : ''
                  } ${col.headerClassName || ''}`}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && onSort && <SortIcon columnKey={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-text-muted/10 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="px-6 py-20">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-text-muted/5 flex items-center justify-center">
                      {emptyIcon || <Database size={24} className="text-text-muted/30" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-text-muted/60">{emptyMessage}</p>
                      <p className="text-xs text-text-muted/40">Coba ubah filter atau kata kunci pencarian</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((item, index) => (
                <motion.tr
                  key={rowKey ? rowKey(item, index) : index}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className={`group/row hover:bg-primary/5 transition-colors duration-200 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(item, startIndex + index)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 text-sm font-medium text-text-main ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(item, startIndex + index)
                        : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
