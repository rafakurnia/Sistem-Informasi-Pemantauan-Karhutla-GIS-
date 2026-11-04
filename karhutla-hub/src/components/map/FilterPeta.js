import { KONFIGURASI_STATUS } from "./data-tiruan";

export default function FilterPeta({
  status = "",
  onStatusChange,
  wilayah = "",
  onWilayahChange,
  daftarWilayah = [],
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Filter berdasarkan status
        <select
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          value={status}
          onChange={(event) => onStatusChange?.(event.target.value)}
        >
          <option value="">Semua status</option>
          {Object.entries(KONFIGURASI_STATUS).map(([nilaiStatus, konfigurasi]) => (
            <option key={nilaiStatus} value={nilaiStatus}>
              {konfigurasi.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Filter berdasarkan wilayah
        <select
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          value={wilayah}
          onChange={(event) => onWilayahChange?.(event.target.value)}
        >
          <option value="">Semua wilayah</option>
          {daftarWilayah.map((namaWilayah) => (
            <option key={namaWilayah} value={namaWilayah}>
              {namaWilayah}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
