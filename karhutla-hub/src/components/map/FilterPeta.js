import { KONFIGURASI_STATUS } from "./data-tiruan";

export default function FilterPeta({
  status = "",
  wilayah = "",
  daftarWilayah = [],
}) {
  return (
    <form action="/peta" className="map-filter-form" method="get">
      <div className="map-filter-fields">
        <label className="map-filter-label">
          Filter berdasarkan status
          <select
            className="map-filter-select"
            defaultValue={status}
            name="status"
          >
            <option value="">Semua status</option>
            {Object.entries(KONFIGURASI_STATUS).map(
              ([nilaiStatus, konfigurasi]) => (
                <option key={nilaiStatus} value={nilaiStatus}>
                  {konfigurasi.label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="map-filter-label">
          Filter berdasarkan wilayah
          <select
            className="map-filter-select"
            defaultValue={wilayah}
            name="wilayah"
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
      <button
        className="map-filter-submit"
        type="submit"
      >
        Terapkan filter
      </button>
    </form>
  );
}
