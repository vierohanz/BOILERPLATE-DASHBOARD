import { useState, useCallback, useMemo } from 'react';

export interface TableState {
  search: string;
  page: number;
  perPage: number;
}

export interface UseTableStateReturn<T> extends TableState {
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  totalPages: number;
  paginatedData: T[];
  filteredData: T[];
  startIndex: number;
  endIndex: number;
}

interface UseTableStateOptions {
  initialPerPage?: number;
  perPageOptions?: number[];
}

export function useTableState<T>(
  data: T[],
  filterFn: (item: T, search: string) => boolean,
  options: UseTableStateOptions = {}
): UseTableStateReturn<T> {
  const { initialPerPage = 10 } = options;

  const [search, setSearchRaw] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPageRaw] = useState(initialPerPage);

  const setSearch = useCallback((value: string) => {
    setSearchRaw(value);
    setPage(1); // Reset to page 1 on search
  }, []);

  const setPerPage = useCallback((value: number) => {
    setPerPageRaw(value);
    setPage(1); // Reset to page 1 on perPage change
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((item) => filterFn(item, search));
  }, [data, search, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));

  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filteredData.length);

  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  return {
    search,
    page: safePage,
    perPage,
    setSearch,
    setPage,
    setPerPage,
    totalPages,
    paginatedData,
    filteredData,
    startIndex,
    endIndex,
  };
}
