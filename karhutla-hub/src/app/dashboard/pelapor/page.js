// File: src/app/dashboard/pelapor/page.js
// Dashboard Pelapor - Menampilkan riwayat laporan & form buat laporan baru

import { ambilLaporanSaya } from "@/queries/laporan";
import { ambilDaftarWilayah } from "@/queries/wilayah";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal, formatKoordinat } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import FormLaporan from "./FormLaporan";

const STATUS_VARIANT = {
  menunggu_verifikasi: "warning",
  terverifikasi: "info",
  ditangani: "danger",
  selesai: "success",
  ditolak: "neutral",
};

export default async function PelaporDashboardPage() {
  const [riwayatLaporan, daftarWilayah] = await Promise.all([
    ambilLaporanSaya(),
    ambilDaftarWilayah(),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-[#64776f]">
            AREA PELAPOR MASYARAKAT
          </p>
          <h1 className="m-0 text-2xl font-semibold text-[#18372e]">
            Dashboard Pelapor
          </h1>
          <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#64776f]">
            Laporkan kejadian karhutla di lingkungan Anda dan pantau proses verifikasi serta penanganannya.
          </p>
        </div>
        <FormLaporan daftarWilayah={daftarWilayah} />
      </header>

      {/* Riwayat Laporan */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#18372e]">
          Riwayat Laporan Saya ({riwayatLaporan.length})
        </h2>

        {riwayatLaporan.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#c8ddd5] bg-white p-12 text-center">
            <p className="text-sm font-semibold text-[#18372e] mb-1">
              Belum ada laporan yang dikirimkan
            </p>
            <p className="text-xs text-[#64776f] max-w-sm mx-auto">
              Jika Anda melihat titik api atau kebakaran hutan dan lahan, gunakan tombol &quot;+ Buat Laporan Karhutla&quot; di atas.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {riwayatLaporan.map((laporan) => (
              <div
                key={laporan.id}
                className="rounded-xl border border-[#c8ddd5] bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-[#64776f]">
                    #{laporan.id.slice(0, 8)}
                  </span>
                  <Badge variant={STATUS_VARIANT[laporan.status] || "neutral"}>
                    {STATUS_LAPORAN_LABEL[laporan.status] || laporan.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#18372e]">
                    {laporan.wilayah?.nama_wilayah || "Wilayah tidak terdaftar"}
                  </h3>
                  <p className="text-xs text-[#64776f] mt-0.5">
                    Koordinat: {formatKoordinat(laporan.latitude, laporan.longitude)}
                  </p>
                </div>

                <p className="text-xs text-[#40574d] bg-[#f8faf8] p-3 rounded-lg border border-[#e8eee8] line-clamp-3">
                  {laporan.deskripsi}
                </p>

                {laporan.catatan_petugas && (
                  <div className="text-xs bg-[#fff9f0] border border-[#fde8ca] p-2.5 rounded-lg text-[#7c4d00]">
                    <span className="font-semibold">Catatan Petugas:</span> {laporan.catatan_petugas}
                  </div>
                )}

                <div className="pt-2 border-t border-[#f0f4f1] text-[11px] text-[#86998f] flex justify-between">
                  <span>Waktu kejadian:</span>
                  <span>{formatTanggal(laporan.waktu_kejadian)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

