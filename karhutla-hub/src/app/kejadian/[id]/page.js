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
import { STATUS_LAPORAN } from "@/lib/constants/status";
import { KONFIGURASI_STATUS } from "@/components/map/data-tiruan";
import { ambilDetailKejadian } from "@/queries/laporan";

const TAHAP_STATUS_PUBLIK = [
  STATUS_LAPORAN.TERVERIFIKASI,
  STATUS_LAPORAN.DITANGANI,
  STATUS_LAPORAN.SELESAI,
];

const VARIAN_STATUS = {
  [STATUS_LAPORAN.TERVERIFIKASI]: "info",
  [STATUS_LAPORAN.DITANGANI]: "warning",
  [STATUS_LAPORAN.SELESAI]: "success",
};

function formatWaktu(waktu) {
  if (!waktu) return "Waktu kejadian tidak tersedia";
  const tanggal = new Date(waktu);
  if (Number.isNaN(tanggal.getTime())) return waktu;
  return tanggal.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function StatusKejadian({ status }) {
  const konfigurasi = KONFIGURASI_STATUS[status];
  if (!konfigurasi) return null;
  return <Badge variant={VARIAN_STATUS[status] ?? "neutral"}>{konfigurasi.label}</Badge>;
}

function TimelineStatus({ status }) {
  const indeksAktif = TAHAP_STATUS_PUBLIK.indexOf(status);
  return (
    <ol className="space-y-5">
      {TAHAP_STATUS_PUBLIK.map((tahap, indeks) => {
        const tercapai = indeks <= indeksAktif;
        const tahapAktif = indeks === indeksAktif;
        const label = KONFIGURASI_STATUS[tahap]?.label ?? tahap;
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

  // Ambil data langsung dari Supabase
  const kejadian = await ambilDetailKejadian(id);

  if (!kejadian || !TAHAP_STATUS_PUBLIK.includes(kejadian.status)) {
    notFound();
  }

  const namaWilayah =
    kejadian.wilayah?.nama_wilayah ?? kejadian.wilayah ?? "Lokasi Kejadian";

  const fotoList = kejadian.fotos ?? [];
  const tindakLanjutList = kejadian.tindak_lanjut ?? [];

  return (
    <main className="flex-1 bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <article className="mx-auto w-full max-w-4xl space-y-6">
        <Link
          className="inline-flex min-h-11 items-center font-medium text-emerald-800 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          href="/peta"
        >
          ← Kembali ke Peta
        </Link>

        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Detail Kejadian Karhutla
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {namaWilayah}
          </h1>
          <StatusKejadian status={kejadian.status} />
        </header>

        <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
          <div className="space-y-5">
            {/* Informasi Kejadian */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kejadian</CardTitle>
                <CardDescription>
                  Ringkasan informasi yang tersedia untuk publik.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Wilayah</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {namaWilayah}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Koordinat</h2>
                  <p className="mt-1 font-mono text-sm text-slate-700">
                    {kejadian.latitude}, {kejadian.longitude}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Waktu Kejadian</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {formatWaktu(kejadian.waktu_kejadian ?? kejadian.created_at)}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Deskripsi</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {kejadian.deskripsi || "Deskripsi kejadian belum tersedia."}
                  </p>
                </div>
                {kejadian.catatan_petugas && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <h2 className="text-sm font-semibold text-amber-800 mb-1">
                      Catatan Petugas Lapangan
                    </h2>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      {kejadian.catatan_petugas}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Foto Kejadian */}
            <Card>
              <CardHeader>
                <CardTitle>Foto Kejadian</CardTitle>
                <CardDescription>
                  Dokumentasi visual lokasi kebakaran yang dilaporkan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fotoList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {fotoList.map((foto) => (
                      <a
                        key={foto.id}
                        href={foto.foto_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border border-slate-200 hover:opacity-90 transition"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={foto.foto_url}
                          alt="Foto kejadian karhutla"
                          className="w-full h-40 object-cover"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div
                    aria-label="Foto kejadian belum tersedia"
                    className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-600"
                    role="img"
                  >
                    Foto kejadian belum tersedia.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tindak Lanjut & Bukti Penanganan */}
            {tindakLanjutList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tindak Lanjut Petugas</CardTitle>
                  <CardDescription>
                    Catatan dan bukti penanganan dari petugas lapangan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tindakLanjutList.map((tl) => (
                    <div
                      key={tl.id}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3"
                    >
                      <p className="text-sm text-emerald-800 leading-relaxed">
                        {tl.keterangan}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {formatWaktu(tl.created_at)}
                      </p>
                      {tl.bukti && tl.bukti.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {tl.bukti.map((b) => (
                            <a
                              key={b.id}
                              href={b.foto_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg overflow-hidden border border-emerald-200 hover:opacity-90 transition"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={b.foto_url}
                                alt={b.deskripsi || "Bukti penanganan"}
                                className="w-full h-32 object-cover"
                              />
                              {b.deskripsi && (
                                <p className="text-[11px] text-emerald-700 px-2 py-1 bg-emerald-50">
                                  {b.deskripsi}
                                </p>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar: Timeline Status */}
          <Card>
            <CardHeader>
              <CardTitle>Perkembangan Status</CardTitle>
              <CardDescription>
                Tahapan penanganan kejadian karhutla ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
