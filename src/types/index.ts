// Global & Shared TypeScript Types

export interface PaginationState {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface OptionItem<T = string | number> {
  value: T;
  label: string;
  color?: string;
  disabled?: boolean;
}
