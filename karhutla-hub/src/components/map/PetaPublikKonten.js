import PetaKarhutla from "./PetaKarhutla";
import {
  DATA_TIRUAN_KEJADIAN,
  KONFIGURASI_STATUS,
} from "./data-tiruan";

const STATUS_PUBLIK = Object.keys(KONFIGURASI_STATUS);

export default async function PetaPublikKonten({ searchParams }) {
  const parameter = await searchParams;
  const statusParameter =
    typeof parameter.status === "string" ? parameter.status : "";
  const wilayahParameter =
    typeof parameter.wilayah === "string" ? parameter.wilayah : "";

  // TODO: ganti dengan query publik dari src/queries/ setelah query Rafa siap.
  const kejadianPublik = DATA_TIRUAN_KEJADIAN.filter((kejadian) =>
    STATUS_PUBLIK.includes(kejadian.status),
  );
  const daftarWilayah = [
    ...new Set(kejadianPublik.map((kejadian) => kejadian.wilayah)),
  ].sort((a, b) => a.localeCompare(b, "id"));
  const status = STATUS_PUBLIK.includes(statusParameter)
    ? statusParameter
    : "";
  const wilayah = daftarWilayah.includes(wilayahParameter)
    ? wilayahParameter
    : "";
  const kejadianTersaring = kejadianPublik.filter(
    (kejadian) =>
      (!status || kejadian.status === status) &&
      (!wilayah || kejadian.wilayah === wilayah),
  );

  return (
    <section
      aria-label="Peta dan daftar kejadian karhutla"
      className="space-y-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Sebaran kejadian</h2>
        <p aria-live="polite" className="text-sm text-slate-600">
          {kejadianTersaring.length} kejadian ditampilkan
        </p>
      </div>
      <PetaKarhutla
        daftarWilayah={daftarWilayah}
        kejadian={kejadianTersaring}
        status={status}
        wilayah={wilayah}
      />
    </section>
  );
}
