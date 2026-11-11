import { Suspense } from "react";
import PetaPublikKonten from "@/components/map/PetaPublikKonten";

export default function Home({ searchParams }) {
  return (
    <main className="flex-1 bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
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

        <Suspense
          fallback={
            <div
              aria-live="polite"
              className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600"
              role="status"
            >
              Menyiapkan data peta...
            </div>
          }
        >
          <PetaPublikKonten searchParams={searchParams} />
        </Suspense>

        <p className="text-xs leading-5 text-slate-500">
          Tampilan ini menggunakan data contoh sementara. Data kejadian akan
          dihubungkan ke sumber data aplikasi setelah query tersedia.
        </p>
      </div>
    </main>
  );
}
