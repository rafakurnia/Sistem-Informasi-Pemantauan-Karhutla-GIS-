"use client";

// File: src/app/dashboard/admin/ManajemenLaporan.js
// Monitoring semua laporan + ubah status inline oleh admin.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ubahStatusLaporanAction } from "@/actions/admin";
import {
  Search, ChevronDown, ExternalLink, Loader2, MapPin,
} from "lucide-react";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal, formatKoordinat } from "@/lib/utils";
import Link from "next/link";

const STATUS_OPTS = [
  { value: "menunggu_verifikasi", label: "Menunggu Verifikasi" },
  { value: "terverifikasi",        label: "Terverifikasi" },
  { value: "ditangani",            label: "Sedang Ditangani" },
  { value: "selesai",              label: "Selesai" },
  { value: "ditolak",              label: "Ditolak" },
];

const STATUS_STYLE = {
  menunggu_verifikasi: "bg-amber-100 text-amber-800 border-amber-200",
  terverifikasi:       "bg-sky-100   text-sky-800   border-sky-200",
  ditangani:           "bg-orange-100 text-orange-800 border-orange-200",
  selesai:             "bg-emerald-100 text-emerald-800 border-emerald-200",
  ditolak:             "bg-red-100   text-red-800   border-red-200",
};

export default function ManajemenLaporan({ laporan = [] }) {
  const router = useRouter();
  const [cari, setCari] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [ubahId, setUbahId] = useState(null);       // id laporan yang form ubah statusnya terbuka
  const [statusBaru, setStatusBaru] = useState("");
  const [catatan, setCatatan] = useState("");
  const [ubahLoading, setUbahLoading] = useState(null);

  // ── Filter ───────────────────────────────────────────────────────────────
  const daftarTersaring = laporan.filter((l) => {
    const cocokStatus = filterStatus === "semua" || l.status === filterStatus;
    const kata = cari.toLowerCase();
    const cocokCari =
      !cari ||
      (l.wilayah?.nama_wilayah || "").toLowerCase().includes(kata) ||
      (l.pelapor?.nama || "").toLowerCase().includes(kata) ||
      l.id.toLowerCase().startsWith(kata);
    return cocokStatus && cocokCari;
  });

  // ── Ubah status ──────────────────────────────────────────────────────────
  async function handleUbahStatus(laporanId) {
    if (!statusBaru) return;
    setUbahLoading(laporanId);
    const res = await ubahStatusLaporanAction({
      laporan_id: laporanId,
      status_baru: statusBaru,
      catatan: catatan.trim() || undefined,
    });
    setUbahLoading(null);
    if (!res.ok) { alert(res.error); return; }
    setUbahId(null);
    setStatusBaru("");
    setCatatan("");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#18372e] m-0">Monitoring Semua Laporan</h2>
        <p className="text-sm text-[#64776f] mt-0.5">
          {laporan.length} laporan terdaftar di sistem. Admin dapat mengubah status laporan manapun.
        </p>
      </div>

      {/* Filter baris */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#86998f]" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari wilayah, pelapor, ID…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c8ddd5] bg-white text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterStatus("semua")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === "semua"
                ? "bg-[#173f30] text-white"
                : "bg-white border border-[#c8ddd5] text-[#40574d] hover:bg-[#f0f4f1]"
            }`}
          >
            Semua ({laporan.length})
          </button>
          {STATUS_OPTS.map((s) => {
            const jml = laporan.filter((l) => l.status === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setFilterStatus(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === s.value
                    ? "bg-[#173f30] text-white"
                    : "bg-white border border-[#c8ddd5] text-[#40574d] hover:bg-[#f0f4f1]"
                }`}
              >
                {s.label} ({jml})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabel */}
      {daftarTersaring.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#c8ddd5] bg-white p-10 text-center text-sm text-[#64776f]">
          Tidak ada laporan yang sesuai filter.
        </div>
      ) : (
        <div className="space-y-3">
          {daftarTersaring.map((lap) => (
            <div
              key={lap.id}
              className="rounded-2xl border border-[#e0ebe2] bg-white overflow-hidden"
            >
              {/* Baris utama */}
              <div className="flex flex-wrap items-start gap-3 px-5 py-4">
                {/* Info kiri */}
                <div className="flex-1 min-w-[200px] space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-[#86998f]">
                      #{lap.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLE[lap.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {STATUS_LAPORAN_LABEL[lap.status] || lap.status}
                    </span>
                  </div>
                  <p className="font-semibold text-[#18372e] text-sm m-0">
                    {lap.wilayah?.nama_wilayah || "Wilayah tidak terdaftar"}
                  </p>
                  <p className="text-xs text-[#64776f] m-0">
                    Pelapor: <span className="font-medium text-[#18372e]">{lap.pelapor?.nama || "Masyarakat"}</span>
                    {lap.pelapor?.nomor_hp && ` · ${lap.pelapor.nomor_hp}`}
                  </p>
                  <p className="text-xs text-[#86998f] flex items-center gap-1 m-0">
                    <MapPin className="size-3" />
                    {formatKoordinat(lap.latitude, lap.longitude)}
                  </p>
                  <p className="text-xs text-[#86998f] m-0">
                    {formatTanggal(lap.waktu_kejadian || lap.created_at)}
                  </p>
                </div>

                {/* Deskripsi */}
                <p className="flex-[2] min-w-[180px] text-xs text-[#40574d] bg-[#f8faf8] p-3 rounded-xl border border-[#e8eee8] leading-relaxed line-clamp-3 m-0">
                  {lap.deskripsi}
                </p>

                {/* Aksi kanan */}
                <div className="flex flex-col gap-2 items-end shrink-0">
                  <Link
                    href={`/kejadian/${lap.id}`}
                    className="flex items-center gap-1 text-[11px] text-[#166534] font-semibold hover:underline"
                    target="_blank"
                  >
                    <ExternalLink className="size-3" />
                    Detail
                  </Link>
                  <button
                    onClick={() => {
                      if (ubahId === lap.id) { setUbahId(null); return; }
                      setUbahId(lap.id);
                      setStatusBaru(lap.status);
                      setCatatan("");
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#173f30] bg-[#edf4ee] hover:bg-[#daeede] px-3 py-1.5 rounded-lg transition"
                  >
                    <ChevronDown className={`size-3 transition-transform ${ubahId === lap.id ? "rotate-180" : ""}`} />
                    Ubah Status
                  </button>
                </div>
              </div>

              {/* Panel ubah status (expandable) */}
              {ubahId === lap.id && (
                <div className="border-t border-[#e8eee8] bg-[#f8faf8] px-5 py-4 space-y-3">
                  <p className="text-xs font-bold text-[#18372e] uppercase tracking-wide">
                    Override Status Laporan (Admin)
                  </p>
                  <div className="flex flex-wrap gap-3 items-end">
                    {/* Pilih status */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-[#40574d] uppercase">
                        Status Baru
                      </label>
                      <select
                        value={statusBaru}
                        onChange={(e) => setStatusBaru(e.target.value)}
                        className="rounded-xl border border-[#c8ddd5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
                      >
                        {STATUS_OPTS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Catatan */}
                    <div className="flex-1 min-w-[200px] space-y-1">
                      <label className="block text-[11px] font-semibold text-[#40574d] uppercase">
                        Catatan Admin (opsional)
                      </label>
                      <input
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Alasan perubahan status…"
                        className="w-full rounded-xl border border-[#c8ddd5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
                      />
                    </div>

                    {/* Tombol */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUbahId(null)}
                        className="px-4 py-2 rounded-xl border border-[#c8ddd5] bg-white text-sm font-medium text-[#40574d] hover:bg-[#f0f4f1] transition"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleUbahStatus(lap.id)}
                        disabled={ubahLoading === lap.id || !statusBaru}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#173f30] hover:bg-[#103024] text-white text-sm font-semibold shadow transition disabled:opacity-60"
                      >
                        {ubahLoading === lap.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : null}
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#86998f]">
        Menampilkan {daftarTersaring.length} dari {laporan.length} laporan.
      </p>
    </div>
  );
}
