import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { STATUS_LAPORAN } from "@/components/laporan/status";
import {
  DATA_TIRUAN_KEJADIAN,
  KONFIGURASI_STATUS,
} from "@/components/map/data-tiruan";

const TAHAP_STATUS_PUBLIK = [
  STATUS_LAPORAN.TERVERIFIKASI,
  STATUS_LAPORAN.DITANGANI,
  STATUS_LAPORAN.SELESAI,
];

const VARIAN_STATUS = {
  [STATUS_LAPORAN.TERVERIFIKASI]: "danger",
  [STATUS_LAPORAN.DITANGANI]: "warning",
  [STATUS_LAPORAN.SELESAI]: "success",
};

function formatWaktu(waktu) {
  if (!waktu) {
    return "Waktu kejadian tidak tersedia";
  }

  const tanggal = new Date(waktu);
  if (Number.isNaN(tanggal.getTime())) {
    return waktu;
  }

  return tanggal.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function StatusKejadian({ status }) {
  const konfigurasi = KONFIGURASI_STATUS[status];

  return (
    <Badge variant={VARIAN_STATUS[status]}>
      {konfigurasi.label}
    </Badge>
  );
}

function TimelineStatus({ status }) {
  const indeksAktif = TAHAP_STATUS_PUBLIK.indexOf(status);

  return (
    <ol className="space-y-5">
      {TAHAP_STATUS_PUBLIK.map((tahap, indeks) => {
        const tercapai = indeks <= indeksAktif;
        const tahapAktif = indeks === indeksAktif;
        const label = KONFIGURASI_STATUS[tahap].label;

        return (
          <li className="flex gap-3" key={tahap}>
            <span
              aria-hidden="true"
              className={`mt-1 size-3 shrink-0 rounded-full ${
                tercapai ? "bg-emerald-700" : "bg-slate-300"
              }`}
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <p className="text-sm text-slate-600">
                {tahapAktif
                  ? "Status saat ini"
                  : tercapai
                    ? "Tahap ini telah dilalui"
                    : "Belum tercapai"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

async function DetailKejadian({ params }) {
  const { id } = await params;

  // TODO: ganti dengan query detail publik dari src/queries/ setelah query Rafa siap.
  const kejadian = DATA_TIRUAN_KEJADIAN.find((item) => item.id === id);

  if (
    !kejadian ||
    !TAHAP_STATUS_PUBLIK.includes(kejadian.status)
  ) {
    notFound();
  }

  return (
    <main className="flex-1 bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <article className="mx-auto w-full max-w-4xl space-y-6">
        <Link
          className="inline-flex min-h-11 items-center font-medium text-emerald-800 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          href="/"
        >
          Kembali ke peta publik
        </Link>

        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Detail kejadian karhutla
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {kejadian.wilayah}
          </h1>
          <StatusKejadian status={kejadian.status} />
        </header>

        <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Informasi kejadian</CardTitle>
                <CardDescription>
                  Ringkasan informasi yang tersedia untuk publik.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Wilayah
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {kejadian.wilayah}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Waktu kejadian
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {formatWaktu(kejadian.waktu)}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Deskripsi
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {kejadian.deskripsi || "Deskripsi kejadian belum tersedia."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Foto kejadian</CardTitle>
                <CardDescription>
                  Foto ditampilkan setelah sumber gambar publik tersedia.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: tampilkan foto melalui signed URL dari server setelah query Rafa siap. */}
                <div
                  aria-label="Pratinjau foto kejadian belum tersedia"
                  className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-600"
                  role="img"
                >
                  Pratinjau foto belum tersedia.
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perkembangan status</CardTitle>
              <CardDescription>
                Riwayat waktu tiap perubahan status akan tersedia setelah
                terhubung ke data status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: ganti tahapan tiruan dengan status_log dari query Rafa. */}
              <TimelineStatus status={kejadian.status} />
            </CardContent>
          </Card>
        </div>
      </article>
    </main>
  );
}

export default function DetailKejadianPage({ params }) {
  return (
    <Suspense
      fallback={
        <div
          aria-live="polite"
          className="flex flex-1 items-center justify-center px-4 py-12 text-sm text-slate-600"
          role="status"
        >
          Memuat detail kejadian...
        </div>
      }
    >
      <DetailKejadian params={params} />
    </Suspense>
  );
}
