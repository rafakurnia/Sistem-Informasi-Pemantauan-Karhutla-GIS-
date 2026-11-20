// File: src/app/dashboard/pelapor/page.js
// Dashboard Pelapor — Riwayat laporan sendiri + tindak lanjut + bukti dari DB

import { ambilLaporanSaya } from "@/queries/laporan";
import { ambilDaftarWilayah } from "@/queries/wilayah";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal, formatKoordinat } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import FormLaporan from "./FormLaporan";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileImage,
  ClipboardList,
} from "lucide-react";

const STATUS_VARIANT = {
  menunggu_verifikasi: "warning",
  terverifikasi: "info",
  ditangani: "danger",
  selesai: "success",
  ditolak: "neutral",
};

const STATUS_ICON = {
  menunggu_verifikasi: Clock,
  terverifikasi: AlertCircle,
  ditangani: Loader2,
  selesai: CheckCircle2,
  ditolak: AlertCircle,
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
            Laporkan kejadian karhutla dan pantau perkembangan laporan Anda — dari verifikasi
            hingga penanganan tuntas beserta bukti petugas di lapangan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/peta"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#c8ddd5] bg-white text-[#18372e] text-sm font-medium hover:bg-[#f0f7f0] transition"
          >
            <MapPin className="size-4 text-[#166534]" />
            Lihat Peta Hotspot
          </Link>
          <FormLaporan daftarWilayah={daftarWilayah} />
        </div>
      </header>

      {/* Ringkasan Cepat */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Laporan", value: riwayatLaporan.length, color: "bg-slate-50 border-slate-200" },
          { label: "Menunggu", value: riwayatLaporan.filter(l => l.status === "menunggu_verifikasi").length, color: "bg-amber-50 border-amber-200" },
          { label: "Ditangani", value: riwayatLaporan.filter(l => l.status === "ditangani" || l.status === "terverifikasi").length, color: "bg-blue-50 border-blue-200" },
          { label: "Selesai", value: riwayatLaporan.filter(l => l.status === "selesai").length, color: "bg-emerald-50 border-emerald-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold text-[#18372e]">{s.value}</p>
            <p className="text-xs font-medium text-[#64776f] mt-0.5">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Riwayat Laporan */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#18372e] flex items-center gap-2">
          <ClipboardList className="size-5 text-[#166534]" />
          Riwayat Laporan Saya ({riwayatLaporan.length})
        </h2>

        {riwayatLaporan.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#c8ddd5] bg-white p-12 text-center">
            <ClipboardList className="size-10 text-[#c8ddd5] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#18372e] mb-1">
              Belum ada laporan yang dikirimkan
            </p>
            <p className="text-xs text-[#64776f] max-w-sm mx-auto">
              Jika Anda melihat titik api atau kebakaran hutan dan lahan, gunakan tombol
              &quot;+ Buat Laporan Karhutla&quot; di atas, atau laporkan langsung melalui peta.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {riwayatLaporan.map((laporan) => {
              const StatusIcon = STATUS_ICON[laporan.status] || Clock;
              const tindakLanjut = laporan.tindak_lanjut || [];
              const semuaBukti = tindakLanjut.flatMap((tl) => tl.bukti || []);

              return (
                <div
                  key={laporan.id}
                  className="rounded-xl border border-[#c8ddd5] bg-white shadow-sm overflow-hidden"
                >
                  {/* Header Kartu */}
                  <div className="flex items-center justify-between px-5 py-3 bg-[#f8faf8] border-b border-[#e8eee8]">
                    <span className="text-xs font-mono font-medium text-[#64776f]">
                      #{laporan.id.slice(0, 8)}
                    </span>
                    <Badge variant={STATUS_VARIANT[laporan.status] || "neutral"}>
                      <StatusIcon className="size-3 mr-1 inline-block" />
                      {STATUS_LAPORAN_LABEL[laporan.status] || laporan.status}
                    </Badge>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#18372e]">
                        {laporan.wilayah?.nama_wilayah || "Wilayah tidak terdaftar"}
                      </h3>
                      <p className="text-xs text-[#64776f] mt-0.5">
                        📍 {formatKoordinat(laporan.latitude, laporan.longitude)}
                      </p>
                    </div>

                    <p className="text-xs text-[#40574d] bg-[#f8faf8] p-3 rounded-lg border border-[#e8eee8] line-clamp-3">
                      {laporan.deskripsi}
                    </p>

                    {/* Catatan Petugas */}
                    {laporan.catatan_petugas && (
                      <div className="text-xs bg-[#fff9f0] border border-[#fde8ca] p-2.5 rounded-lg text-[#7c4d00]">
                        <span className="font-semibold">📋 Catatan Petugas:</span>{" "}
                        {laporan.catatan_petugas}
                      </div>
                    )}

                    {/* Riwayat Tindak Lanjut */}
                    {tindakLanjut.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-[#64776f] uppercase tracking-wide">
                          Riwayat Penanganan ({tindakLanjut.length})
                        </p>
                        {tindakLanjut.map((tl) => (
                          <div
                            key={tl.id}
                            className="bg-[#f0f9f4] border border-[#c6f6d5] rounded-lg p-2.5 text-xs"
                          >
                            <p className="text-[#1a4731] leading-relaxed">{tl.keterangan}</p>
                            <p className="text-[#64776f] mt-1 text-[10px]">
                              🕒 {formatTanggal(tl.created_at)}
                            </p>
                            {/* Foto Bukti */}
                            {tl.bukti && tl.bukti.length > 0 && (
                              <div className="mt-2 flex gap-2 flex-wrap">
                                {tl.bukti.map((b) => (
                                  <a
                                    key={b.id}
                                    href={b.foto_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                                  >
                                    <FileImage className="size-3" />
                                    {b.deskripsi || "Foto Bukti"}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Foto laporan sendiri */}
                    {laporan.fotos && laporan.fotos.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-[#64776f] uppercase tracking-wide mb-1.5">
                          Foto Laporan ({laporan.fotos.length})
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {laporan.fotos.map((f) => (
                            <a
                              key={f.id}
                              href={f.foto_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                            >
                              <FileImage className="size-3" />
                              Foto {laporan.fotos.indexOf(f) + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#f0f4f1] text-[11px] text-[#86998f] flex justify-between">
                      <span>Waktu kejadian:</span>
                      <span>{formatTanggal(laporan.waktu_kejadian)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
