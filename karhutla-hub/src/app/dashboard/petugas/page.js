// File: src/app/dashboard/petugas/page.js
// Dashboard Petugas - Verifikasi antrean laporan & penanganan di lapangan

import { ambilAntreanVerifikasi, ambilTugasPetugasSaya } from "@/queries/laporan";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal, formatKoordinat } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import AksiPetugas from "./AksiPetugas";

export default async function PetugasDashboardPage() {
  const [antreanVerifikasi, tugasSaya] = await Promise.all([
    ambilAntreanVerifikasi(),
    ambilTugasPetugasSaya(),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-[#64776f]">
            AREA OPERASIONAL PETUGAS
          </p>
          <h1 className="m-0 text-2xl font-semibold text-[#18372e]">
            Dashboard Petugas Lapangan
          </h1>
          <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#64776f]">
            Verifikasi laporan masyarakat yang masuk dan catat tindakan penanganan karhutla.
          </p>
        </div>
      </header>

      {/* Bagian 1: Antrean Verifikasi */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#18372e] flex items-center gap-2">
            <span>Antrean Verifikasi Laporan</span>
            <span className="rounded-full bg-[#fff1d6] text-[#79500b] px-2.5 py-0.5 text-xs font-bold">
              {antreanVerifikasi.length}
            </span>
          </h2>
        </div>

        {antreanVerifikasi.length === 0 ? (
          <div className="rounded-xl border border-[#c8ddd5] bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#18372e]">
              Semua laporan telah diverifikasi!
            </p>
            <p className="text-xs text-[#64776f] mt-1">
              Saat ada warga yang mengirim laporan baru, laporan akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {antreanVerifikasi.map((lap) => (
              <div
                key={lap.id}
                className="rounded-xl border border-[#c8ddd5] bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-[#64776f]">
                    #{lap.id.slice(0, 8)}
                  </span>
                  <Badge variant="warning">Menunggu Verifikasi</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#18372e]">
                    {lap.wilayah?.nama_wilayah || "Wilayah tidak terdaftar"}
                  </h3>
                  <p className="text-xs text-[#64776f] mt-0.5">
                    Pelapor: <span className="font-medium text-[#18372e]">{lap.pelapor?.nama || "Masyarakat"}</span> ({lap.pelapor?.nomor_hp || "Tanpa HP"})
                  </p>
                  <p className="text-xs text-[#64776f]">
                    Koordinat: {formatKoordinat(lap.latitude, lap.longitude)}
                  </p>
                </div>

                <p className="text-xs text-[#40574d] bg-[#f8faf8] p-3 rounded-lg border border-[#e8eee8]">
                  {lap.deskripsi}
                </p>

                <div className="text-[11px] text-[#86998f]">
                  Dilaporkan: {formatTanggal(lap.created_at)}
                </div>

                <AksiPetugas laporanId={lap.id} statusSekarang="menunggu_verifikasi" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bagian 2: Tugas Lapangan Aktif */}
      <section className="space-y-4 pt-4 border-t border-[#dce5dd]">
        <h2 className="text-lg font-semibold text-[#18372e] flex items-center gap-2">
          <span>Tugas Penanganan Saya</span>
          <span className="rounded-full bg-[#e3f2e4] text-[#27633d] px-2.5 py-0.5 text-xs font-bold">
            {tugasSaya.length}
          </span>
        </h2>

        {tugasSaya.length === 0 ? (
          <div className="rounded-xl border border-[#c8ddd5] bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#18372e]">
              Tidak ada tugas aktif
            </p>
            <p className="text-xs text-[#64776f] mt-1">
              Verifikasi laporan di atas untuk mengambil penugasan dan mencatat hasil pemadaman.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tugasSaya.map((lap) => (
              <div
                key={lap.id}
                className="rounded-xl border border-[#c8ddd5] bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-[#64776f]">
                    #{lap.id.slice(0, 8)}
                  </span>
                  <Badge variant={lap.status === "ditangani" ? "danger" : "info"}>
                    {STATUS_LAPORAN_LABEL[lap.status] || lap.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#18372e]">
                    {lap.wilayah?.nama_wilayah}
                  </h3>
                  <p className="text-xs text-[#64776f]">
                    Koordinat: {formatKoordinat(lap.latitude, lap.longitude)}
                  </p>
                </div>

                <p className="text-xs text-[#40574d] bg-[#f8faf8] p-3 rounded-lg border border-[#e8eee8]">
                  {lap.deskripsi}
                </p>

                <AksiPetugas laporanId={lap.id} statusSekarang={lap.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

