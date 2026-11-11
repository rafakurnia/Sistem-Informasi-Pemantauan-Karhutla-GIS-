"use client";

// File: src/app/dashboard/petugas/AksiPetugas.js
// Tombol dan aksi verifikasi & tindak lanjut untuk petugas lapangan

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifikasiLaporanAction } from "@/actions/verifikasi";
import { catatTindakLanjutAction } from "@/actions/tindak-lanjut";
import Button from "@/components/ui/Button";

export default function AksiPetugas({ laporanId, statusSekarang }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showTolak, setShowTolak] = useState(false);
  const [showTindak, setShowTindak] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [statusTarget, setStatusTarget] = useState("ditangani");

  async function handleVerifikasi(status, alasanPenolakan = "") {
    setLoading(true);
    const res = await verifikasiLaporanAction({
      laporan_id: laporanId,
      status,
      catatan: status === "terverifikasi" ? "Laporan terkonfirmasi valid oleh petugas lapangan." : undefined,
      alasan_penolakan: status === "ditolak" ? alasanPenolakan : undefined,
    });
    setLoading(false);

    if (res.ok) {
      setShowTolak(false);
      router.refresh();
    } else {
      alert(res.error || "Gagal memperbarui status verifikasi.");
    }
  }

  async function handleTindakLanjut(e) {
    e.preventDefault();
    setLoading(true);
    const res = await catatTindakLanjutAction({
      laporan_id: laporanId,
      keterangan,
      status_target: statusTarget,
      bukti_paths: [],
    });
    setLoading(false);

    if (res.ok) {
      setShowTindak(false);
      router.refresh();
    } else {
      alert(res.error || "Gagal mencatat tindak lanjut.");
    }
  }

  if (statusSekarang === "menunggu_verifikasi") {
    return (
      <div className="space-y-3 pt-2">
        {!showTolak ? (
          <div className="flex gap-2">
            <Button
              size="small"
              variant="primary"
              disabled={loading}
              onClick={() => handleVerifikasi("terverifikasi")}
            >
              ✓ Verifikasi Valid
            </Button>
            <Button
              size="small"
              variant="danger"
              disabled={loading}
              onClick={() => setShowTolak(true)}
            >
              ✕ Tolak Laporan
            </Button>
          </div>
        ) : (
          <div className="bg-[#fff5f5] p-3 rounded-lg border border-[#fed7d7] space-y-2">
            <label className="block text-xs font-semibold text-[#c53030]">
              Alasan Penolakan:
            </label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Contoh: Bukan kebakaran hutan, laporan fiktif, dll."
              rows={2}
              className="w-full text-xs p-2 rounded border border-[#feb2b2] bg-white outline-none focus:ring-1 focus:ring-red-500"
            />
            <div className="flex gap-2 justify-end">
              <Button size="small" variant="ghost" onClick={() => setShowTolak(false)}>
                Batal
              </Button>
              <Button
                size="small"
                variant="danger"
                disabled={loading || !alasan.trim()}
                onClick={() => handleVerifikasi("ditolak", alasan)}
              >
                Konfirmasi Tolak
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (statusSekarang === "terverifikasi" || statusSekarang === "ditangani") {
    return (
      <div className="space-y-3 pt-2">
        {!showTindak ? (
          <Button
            size="small"
            variant="secondary"
            onClick={() => setShowTindak(true)}
          >
            + Update Tindak Lanjut Penanganan
          </Button>
        ) : (
          <form onSubmit={handleTindakLanjut} className="bg-[#f0f9f4] p-3.5 rounded-lg border border-[#c6f6d5] space-y-3">
            <h4 className="text-xs font-bold text-[#22543d]">Catat Tindak Lanjut Penanganan:</h4>
            <div>
              <label className="block text-[11px] font-semibold text-[#276749] mb-1">
                Status Baru:
              </label>
              <select
                value={statusTarget}
                onChange={(e) => setStatusTarget(e.target.value)}
                className="w-full text-xs p-1.5 rounded border border-[#9ae6b4] bg-white"
              >
                <option value="ditangani">Sedang Ditangani (Pemadaman Berlangsung)</option>
                <option value="selesai">Selesai (Api Berhasil Dipadamkan)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#276749] mb-1">
                Keterangan Penanganan:
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                required
                rows={2}
                placeholder="Rincian armada yang diturunkan, luas yang dipadamkan..."
                className="w-full text-xs p-2 rounded border border-[#9ae6b4] bg-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button size="small" variant="ghost" type="button" onClick={() => setShowTindak(false)}>
                Batal
              </Button>
              <Button size="small" variant="primary" type="submit" disabled={loading || !keterangan.trim()}>
                {loading ? "Menyimpan…" : "Simpan Penanganan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return null;
}

