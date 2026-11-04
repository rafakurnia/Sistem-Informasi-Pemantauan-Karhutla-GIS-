"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import EmptyState from "../feedback/EmptyState";
import LoadingState from "../feedback/LoadingState";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  page = 1,
  pageCount = 1,
  onPageChange,
  filterValue = "",
  onFilterChange,
  filterPlaceholder = "Cari data",
  loading = false,
  emptyTitle = "Data tidak ditemukan",
  emptyDescription = "Coba ubah kata kunci atau periksa kembali nanti.",
  pageLabel = "Halaman",
}) {
  const safePageCount = Math.max(1, pageCount);

  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-[#dce5dd] bg-white">
      {onFilterChange ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7ece8] px-4 py-3">
          <label className="relative block w-full max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#75877f]"
            />
            <Input
              className="pl-9"
              onChange={(event) => onFilterChange(event.target.value)}
              placeholder={filterPlaceholder}
              type="search"
              value={filterValue}
            />
          </label>
        </div>
      ) : null}

      <div className="max-w-full overflow-x-auto" aria-busy={loading}>
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead className="bg-[#f3f6f2] text-xs font-semibold text-[#40574d]">
            <tr>
              {columns.map((column) => (
                <th className="whitespace-nowrap px-4 py-3" key={column.key} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7ece8]">
            {loading ? (
              <tr>
                <td className="px-4 py-6" colSpan={columns.length}>
                  <LoadingState label="Memuat tabel" lines={2} />
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((row, rowIndex) => (
                <tr className="text-[#40574d] hover:bg-[#f9fbf8]" key={row[rowKey] ?? rowIndex}>
                  {columns.map((column) => (
                    <td className="px-4 py-3 align-middle" key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ece8] px-4 py-3">
        <p className="m-0 text-xs text-[#64776f]">
          {pageLabel} {page} dari {safePageCount}
        </p>
        <div className="flex items-center gap-2">
          <Button
            aria-label="Halaman sebelumnya"
            disabled={!onPageChange || page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            size="icon"
            variant="secondary"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Halaman berikutnya"
            disabled={!onPageChange || page >= safePageCount || loading}
            onClick={() => onPageChange(page + 1)}
            size="icon"
            variant="secondary"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}