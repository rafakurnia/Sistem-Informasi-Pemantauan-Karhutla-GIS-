import { KONFIGURASI_STATUS } from "./data-tiruan";

export default function LegendaPeta() {
  return (
    <ul
      aria-label="Legenda status kejadian"
      className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-700"
    >
      {Object.entries(KONFIGURASI_STATUS).map(([status, konfigurasi]) => (
        <li className="inline-flex items-center gap-2" key={status}>
          <span
            aria-hidden="true"
            className="size-3 rounded-full ring-2 ring-white"
            style={{ backgroundColor: konfigurasi.warna }}
          />
          <span>{konfigurasi.label}</span>
        </li>
      ))}
    </ul>
  );
}
