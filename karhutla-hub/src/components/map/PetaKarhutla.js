"use client";

import dynamic from "next/dynamic";
import FilterPeta from "./FilterPeta";
import LegendaPeta from "./LegendaPeta";

const PetaLeaflet = dynamic(() => import("./PetaInner"), {
  ssr: false,
  loading: () => (
    <div
      aria-live="polite"
      className="flex h-[55vh] min-h-[320px] max-h-[640px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600"
      role="status"
    >
      Memuat komponen peta...
    </div>
  ),
});

export default function PetaKarhutla({
  kejadian = [],
  loading = false,
  error = null,
  status = "",
  wilayah = "",
  daftarWilayah = [],
}) {
  if (error) {
    const pesanError =
      typeof error === "string" ? error : error.message || "Terjadi kesalahan.";

    return (
      <div
        aria-live="assertive"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        role="alert"
      >
        Peta kejadian gagal dimuat. {pesanError}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        aria-live="polite"
        className="flex h-[55vh] min-h-[320px] max-h-[640px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600"
        role="status"
      >
        Memuat data kejadian karhutla...
      </div>
    );
  }

  return (
    <section aria-label="Peta publik kejadian karhutla" className="space-y-4">
      <FilterPeta
        daftarWilayah={daftarWilayah}
        status={status}
        wilayah={wilayah}
      />
      {kejadian.length === 0 ? (
        <div
          className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600"
          role="status"
        >
          Belum ada kejadian karhutla untuk filter ini. Coba ubah filter atau
          pilih semua status dan wilayah.
        </div>
      ) : (
        <>
          <PetaLeaflet kejadian={kejadian} />
          <LegendaPeta />
        </>
      )}
    </section>
  );
}
