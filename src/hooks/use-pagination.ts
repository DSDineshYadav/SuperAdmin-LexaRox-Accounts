import { useEffect, useMemo, useState } from "react";

export const LIST_TABLE_PAGE_SIZE = 5;

type UsePaginationOptions = {
  pageSize?: number;
  resetKey?: string | number;
};

export function usePagination<T>(items: T[], options: UsePaginationOptions = {}) {
  const pageSize = options.pageSize ?? LIST_TABLE_PAGE_SIZE;
  const resetKey = options.resetKey ?? items.length;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    page: currentPage,
    setPage,
    pageItems,
    totalPages,
    totalItems: items.length,
    rangeStart: items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    rangeEnd: Math.min(currentPage * pageSize, items.length),
    showPagination: items.length > pageSize,
  };
}
