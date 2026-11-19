// File: src/app/dashboard/petugas/page.js
// Dashboard Petugas — Antrean masuk, penanganan aktif, selesai + link ke peta

import { ambilLaporanPetugas } from "@/queries/laporan";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal, formatKoordinat } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import AksiPetugas from "./AksiPetugas";
import Link from "next/link";
import {
  MapPin,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Flame,
  FileImage,
} from "lucide-react";

const STATUS_VARIANT = {
  menunggu_verifikasi: "warning",
  terverifikasi: "info",
  ditangani: "danger",
  selesai: "success",
  ditolak: "neutral",
};

export default async function PetugasDashboardPage() {
  const { antreanMasuk, dalamPenanganan, laporanSelesai } =
    await ambilLaporanPetugas();

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
            Verifikasi laporan masyarakat yang masuk, catat tindak lanjut penanganan,
            dan pantau titik api aktif langsung dari peta GIS.
          </p>
        </div>
        <Link
          href="/peta"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173f30] hover:bg-[#103024] text-white text-sm font-semibold shadow transition"
        >
          <MapPin className="size-4" />
          Lihat Peta Hotspot
        </Link>
      </header>

      {/* Ringkasan Cepat */}
      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <Clock className="size-5 text-amber-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-[#18372e]">{antreanMasuk.length}</p>
          <p className="text-xs font-medium text-[#64776f]">Menunggu Verifikasi</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <Flame className="size-5 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-[#18372e]">{dalamPenanganan.length}</p>
          <p className="text-xs font-medium text-[#64776f]">Dalam Penanganan</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <CheckCircle2 className="size-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-[#18372e]">{laporanSelesai.length}</p>
          <p className="text-xs font-medium text-[#64776f]">Selesai Ditangani</p>
        </div>
      </section>

      {/* Bagian 1: Antrean Verifikasi */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="size-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-[#18372e] flex items-center gap-2">
            Antrean Verifikasi Laporan Masuk
            <span className="rounded-full bg-[#fff1d6] text-[#79500b] px-2.5 py-0.5 text-xs font-bold">
              {antreanMasuk.length}
            </span>
          </h2>
        </div>

        {antreanMasuk.length === 0 ? (
          <div className="rounded-xl border border-[#c8ddd5] bg-white p-8 text-center">
            <ShieldCheck className="size-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#18372e]">
              Semua laporan telah diverifikasi!
            </p>
            <p className="text-xs text-[#64776f] mt-1">
              Saat ada warga mengirim laporan baru, laporan akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {antreanMasuk.map((lap) => (
              <div
                key={lap.id}
                className="rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3 bg-amber-50 border-b border-amber-200">
                  <span className="text-xs font-mono font-medium text-[#64776f]">
                    #{lap.id.slice(0, 8)}
                  </span>
                  <Badge variant="warning">Menunggu Verifikasi</Badge>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#18372e]">
                      {lap.wilayah?.nama_wilayah || "Wilayah tidak terdaftar"}
                    </h3>
                    <p className="text-xs text-[#64776f] mt-0.5">
                      Pelapor:{" "}
                      <span className="font-medium text-[#18372e]">
                        {lap.pelapor?.nama || "Masyarakat"}
                      </span>{" "}
                      ({lap.pelapor?.nomor_hp || "Tanpa HP"})
                    </p>
                    <p className="text-xs text-[#64776f]">
                      📍 {formatKoordinat(lap.latitude, lap.longitude)}
                    </p>
                  </div>

                  <p className="text-xs text-[#40574d] bg-white p-3 rounded-lg border border-amber-200">
                    {lap.deskripsi}
                  </p>

                  {/* Foto laporan */}
                  {lap.fotos && lap.fotos.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {lap.fotos.map((f) => (
                        <a
                          key={f.id}
                          href={f.foto_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                        >
                          <FileImage className="size-3" />
                          Foto {lap.fotos.indexOf(f) + 1}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-[#86998f]">
                    Dilaporkan: {formatTanggal(lap.created_at)}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <AksiPetugas laporanId={lap.id} statusSekarang="menunggu_verifikasi" />
                    <Link
                      href={`/peta?id=${lap.id}`}
                      className="text-[11px] font-semibold text-[#166534] hover:underline flex items-center gap-1"
                    >
                      <MapPin className="size-3" /> Lihat di Peta
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bagian 2: Dalam Penanganan */}
      <section className="space-y-4 pt-4 border-t border-[#dce5dd]">
        <div className="flex items-center gap-3">
          <Flame className="size-5 text-red-500" />
          <h2 className="text-lg font-semibold text-[#18372e] flex items-center gap-2">
            Dalam Penanganan
            <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold">
              {dalamPenanganan.length}
            </span>
          </h2>
        </div>

        {dalamPenanganan.length === 0 ? (
          <div className="rounded-xl border border-[#c8ddd5] bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#18372e]">
              Belum ada laporan aktif dalam penanganan.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {dalamPenanganan.map((lap) => {
              const tindakLanjut = lap.tindak_lanjut || [];
              return (
                <div
                  key={lap.id}
                  className="rounded-xl border border-[#c8ddd5] bg-white shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-3 bg-[#f8faf8] border-b border-[#e8eee8]">
                    <span className="text-xs font-mono font-medium text-[#64776f]">
                      #{lap.id.slice(0, 8)}
                    </span>
                    <Badge variant={STATUS_VARIANT[lap.status] || "info"}>
                      {STATUS_LAPORAN_LABEL[lap.status] || lap.status}
                    </Badge>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#18372e]">
                        {lap.wilayah?.nama_wilayah}
                      </h3>
                      <p className="text-xs text-[#64776f]">
                        📍 {formatKoordinat(lap.latitude, lap.longitude)}
                      </p>
                    </div>

                    <p className="text-xs text-[#40574d] bg-[#f8faf8] p-3 rounded-lg border border-[#e8eee8]">
                      {lap.deskripsi}
                    </p>

                    {/* Riwayat tindak lanjut */}
                    {tindakLanjut.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold text-[#64776f] uppercase tracking-wide">
                          Riwayat penanganan ({tindakLanjut.length})
                        </p>
                        {tindakLanjut.map((tl) => (
                          <div
                            key={tl.id}
                            className="bg-[#f0f9f4] border border-[#c6f6d5] rounded-lg p-2 text-xs text-[#1a4731]"
                          >
                            <p>{tl.keterangan}</p>
                            <p className="text-[10px] text-[#64776f] mt-0.5">
                              {formatTanggal(tl.created_at)}
                            </p>
                            {tl.bukti && tl.bukti.length > 0 && (
                              <div className="flex gap-2 flex-wrap mt-1">
                                {tl.bukti.map((b) => (
                                  <a
                                    key={b.id}
                                    href={b.foto_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                                  >
                                    <FileImage className="size-3" />
                                    {b.deskripsi || "Bukti"}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <AksiPetugas laporanId={lap.id} statusSekarang={lap.status} />
                      <Link
                        href={`/peta?id=${lap.id}`}
                        className="text-[11px] font-semibold text-[#166534] hover:underline flex items-center gap-1"
                      >
                        <MapPin className="size-3" /> Lihat di Peta
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bagian 3: Selesai */}
      <section className="space-y-4 pt-4 border-t border-[#dce5dd]">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-[#18372e] flex items-center gap-2">
            Laporan Selesai
            <span className="rounded-full bg-[#e3f2e4] text-[#27633d] px-2.5 py-0.5 text-xs font-bold">
              {laporanSelesai.length}
            </span>
          </h2>
        </div>

        {laporanSelesai.length === 0 ? (
          <div className="rounded-xl border border-[#c8ddd5] bg-white p-6 text-center">
            <p className="text-xs text-[#64776f]">Belum ada laporan yang selesai.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {laporanSelesai.map((lap) => (
              <div
                key={lap.id}
                className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#64776f]">
                    #{lap.id.slice(0, 8)}
                  </span>
                  <Badge variant="success">Selesai</Badge>
                </div>
                <h3 className="text-sm font-bold text-[#18372e]">
                  {lap.wilayah?.nama_wilayah || "Wilayah tidak terdaftar"}
                </h3>
                <p className="text-xs text-[#40574d] line-clamp-2">{lap.deskripsi}</p>
                <div className="flex justify-between items-center pt-1 border-t border-emerald-200/60">
                  <span className="text-[11px] text-[#86998f]">
                    {formatTanggal(lap.waktu_kejadian)}
                  </span>
                  <Link
                    href={`/kejadian/${lap.id}`}
                    className="text-[11px] text-[#166534] font-semibold hover:underline"
                  >
                    Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
