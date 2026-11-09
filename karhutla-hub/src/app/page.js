"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PetaKarhutla from "@/components/map/PetaKarhutla";
import { DATA_TIRUAN_KEJADIAN } from "@/components/map/data-tiruan";

const DAFTAR_WILAYAH = [
  ...new Set(DATA_TIRUAN_KEJADIAN.map((kejadian) => kejadian.wilayah)),
].sort((a, b) => a.localeCompare(b, "id"));

export default function Home() {
  const [status, setStatus] = useState("");
  const [wilayah, setWilayah] = useState("");

  const kejadianTersaring = useMemo(
    () =>
      DATA_TIRUAN_KEJADIAN.filter(
        (kejadian) =>
          (!status || kejadian.status === status) &&
          (!wilayah || kejadian.wilayah === wilayah),
      ),
    [status, wilayah],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Navbar SIGAPI */}
      <Navbar />

      {/* Konten Utama Peta Publik buatan Sabar */}
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <header className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              Pemantauan kebakaran hutan dan lahan
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Peta Publik Karhutla
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Lihat sebaran kejadian karhutla di Indonesia. Gunakan filter untuk
              menelusuri kejadian berdasarkan status atau wilayah.
            </p>
          </header>

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
              daftarWilayah={DAFTAR_WILAYAH}
              kejadian={kejadianTersaring}
              onStatusChange={setStatus}
              onWilayahChange={setWilayah}
              status={status}
              wilayah={wilayah}
            />
          </section>

          <p className="text-xs leading-5 text-slate-500">
            Tampilan ini menggunakan data contoh sementara. Data kejadian akan
            dihubungkan ke sumber data aplikasi setelah query tersedia.
          </p>
        </div>
      </main>

      {/* Footer Universal */}
      <Footer />
    </div>
  );
}
