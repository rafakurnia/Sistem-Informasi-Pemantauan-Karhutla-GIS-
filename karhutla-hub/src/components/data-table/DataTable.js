"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
} from "lucide-react";
import EmptyState from "../feedback/EmptyState";
import LoadingState from "../feedback/LoadingState";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

function getColumnFilter(column) {
  if (!column.filter) return null;
  if (column.filter === true) return { type: "text" };
  return column.filter;
}

export default function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  page = 1,
  pageCount = 1,
  onPageChange,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
  totalRows,
  filterValue = "",
  onFilterChange,
  columnFilters = {},
  onColumnFiltersChange,
  filterPlaceholder = "Cari data",
  loading = false,
  emptyTitle = "Data tidak ditemukan",
  emptyDescription = "Coba ubah kata kunci atau periksa kembali nanti.",
  pageLabel = "Halaman",
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safePageCount = Number.isFinite(pageCount)
    ? Math.max(1, Math.floor(pageCount))
    : 1;
  const currentPage = Number.isFinite(page)
    ? Math.min(safePageCount, Math.max(1, Math.floor(page)))
    : 1;
  const safePageSize = Number.isFinite(pageSize) ? Math.max(1, pageSize) : 10;
  const columnFiltersList = columns
    .map((column) => ({ column, filter: getColumnFilter(column) }))
    .filter(({ filter }) => filter && onColumnFiltersChange);
  const hasActiveFilters = Boolean(
    filterValue || Object.values(columnFilters).some((value) => value !== ""),
  );
  const firstRow = totalRows === 0 ? 0 : (currentPage - 1) * safePageSize + 1;
  const lastRow =
    typeof totalRows === "number"
      ? Math.min(currentPage * safePageSize, totalRows)
      : firstRow + Math.max(0, safeRows.length - 1);
  const columnCount = Math.max(columns.length, 1);

  function updateColumnFilter(key, value) {
    onColumnFiltersChange?.({ ...columnFilters, [key]: value });
  }

  function clearFilters() {
    onFilterChange?.("");
    onColumnFiltersChange?.({});
    if (currentPage !== 1) onPageChange?.(1);
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-[#dce5dd] bg-white">
      {onFilterChange || columnFiltersList.length ? (
        <div className="flex flex-wrap items-end gap-3 border-b border-[#e7ece8] px-4 py-3">
          {onFilterChange ? (
            <label className="relative block w-full max-w-sm">
              <span className="mb-1.5 block text-xs font-medium text-[#52665a]">
                Pencarian
              </span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-[calc(50%+5px)] size-4 -translate-y-1/2 text-[#75877f]"
              />
              <Input
                className="pl-9"
                onChange={(event) => onFilterChange(event.target.value)}
                placeholder={filterPlaceholder}
                type="search"
                value={filterValue}
              />
            </label>
          ) : null}

          {columnFiltersList.map(({ column, filter }) => (
            <label className="block w-full max-w-56" key={column.key}>
              <span className="mb-1.5 block text-xs font-medium text-[#52665a]">
                {filter.label ?? `Filter ${column.header}`}
              </span>
              {filter.type === "select" ? (
                <Select
                  aria-label={filter.label ?? `Filter ${column.header}`}
                  onChange={(event) => updateColumnFilter(column.key, event.target.value)}
                  value={columnFilters[column.key] ?? ""}
                >
                  <option value="">Semua {column.header}</option>
                  {(filter.options ?? []).map((option) => {
                    const value = typeof option === "object" ? option.value : option;
                    const label = typeof option === "object" ? option.label : option;
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </Select>
              ) : (
                <Input
                  aria-label={filter.label ?? `Filter ${column.header}`}
                  onChange={(event) => updateColumnFilter(column.key, event.target.value)}
                  placeholder={filter.placeholder ?? `Filter ${column.header}`}
                  type="search"
                  value={columnFilters[column.key] ?? ""}
                />
              )}
            </label>
          ))}

          {hasActiveFilters ? (
            <Button
              className="ml-auto"
              onClick={clearFilters}
              size="small"
              variant="ghost"
            >
              <X aria-hidden="true" className="size-3.5" />
              Bersihkan filter
            </Button>
          ) : null}
        </div>
      ) : null}

      <div aria-busy={loading} className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead className="bg-[#f3f6f2] text-xs font-semibold text-[#40574d]">
            <tr>
              {columns.map((column) => (
                <th
                  className="whitespace-nowrap px-4 py-3"
                  key={column.key}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7ece8]">
            {loading ? (
              <tr>
                <td className="px-4 py-6" colSpan={columnCount}>
                  <LoadingState label="Memuat tabel" lines={2} />
                </td>
              </tr>
            ) : safeRows.length ? (
              safeRows.map((row, rowIndex) => (
                <tr
                  className="text-[#40574d] hover:bg-[#f9fbf8]"
                  key={row?.[rowKey] ?? rowIndex}
                >
                  {columns.map((column) => (
                    <td className="px-4 py-3 align-middle" key={column.key}>
                      {column.render
                        ? column.render(row?.[column.key], row)
                        : row?.[column.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnCount}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ece8] px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p aria-live="polite" className="m-0 text-xs text-[#64776f]">
            {typeof totalRows === "number" ? (
              <>Menampilkan {firstRow}-{lastRow} dari {totalRows} data</>
            ) : (
              <>
                {pageLabel} {currentPage} dari {safePageCount}
              </>
            )}
          </p>
          {onPageSizeChange ? (
            <label className="flex items-center gap-2 text-xs text-[#64776f]">
              Baris per halaman
              <Select
                className="min-h-8 py-1 pl-2 pr-7 text-xs"
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                value={String(safePageSize)}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </label>
          ) : null}
        </div>

        <nav aria-label="Navigasi halaman tabel" className="flex items-center gap-1">
          <Button
            aria-label="Halaman pertama"
            disabled={!onPageChange || currentPage <= 1 || loading}
            onClick={() => onPageChange(1)}
            size="icon"
            variant="secondary"
          >
            <ChevronsLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Halaman sebelumnya"
            disabled={!onPageChange || currentPage <= 1 || loading}
            onClick={() => onPageChange(currentPage - 1)}
            size="icon"
            variant="secondary"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Halaman berikutnya"
            disabled={!onPageChange || currentPage >= safePageCount || loading}
            onClick={() => onPageChange(currentPage + 1)}
            size="icon"
            variant="secondary"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Halaman terakhir"
            disabled={!onPageChange || currentPage >= safePageCount || loading}
            onClick={() => onPageChange(safePageCount)}
            size="icon"
            variant="secondary"
          >
            <ChevronsRight aria-hidden="true" className="size-4" />
          </Button>
        </nav>
      </div>
    </section>
  );
}