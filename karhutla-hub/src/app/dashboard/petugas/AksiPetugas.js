"use client";

// File: src/app/dashboard/petugas/AksiPetugas.js
// Tombol dan aksi verifikasi & tindak lanjut untuk petugas lapangan
// Mendukung upload foto bukti penanganan, wajib saat status selesai.

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { verifikasiLaporanAction } from "@/actions/verifikasi";
import { catatTindakLanjutAction } from "@/actions/tindak-lanjut";
import { uploadFotoAction } from "@/actions/upload";
import Button from "@/components/ui/Button";
import { FileImage, X, Upload, Loader2, AlertCircle } from "lucide-react";

export default function AksiPetugas({ laporanId, statusSekarang }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [showTolak, setShowTolak] = useState(false);
  const [showTindak, setShowTindak] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [statusTarget, setStatusTarget] = useState("ditangani");

  // State untuk foto bukti
  const [fotoFiles, setFotoFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  // Error inline — ditampilkan di dalam form, bukan alert()
  const [actionError, setActionError] = useState("");
  const [verifikasiError, setVerifikasiError] = useState("");

  function handlePilihFoto(e) {
    const files = Array.from(e.target.files || []);
    setFotoFiles((prev) => [...prev, ...files].slice(0, 3));
    setUploadError("");
  }

  function hapusFoto(idx) {
    setFotoFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleVerifikasi(status, alasanPenolakan = "") {
    setLoading(true);
    setVerifikasiError("");
    try {
      const res = await verifikasiLaporanAction({
        laporan_id: laporanId,
        status,
        catatan:
          status === "terverifikasi"
            ? "Laporan terkonfirmasi valid oleh petugas lapangan."
            : undefined,
        alasan_penolakan: status === "ditolak" ? alasanPenolakan : undefined,
      });
      if (res.ok) {
        setShowTolak(false);
        router.refresh();
      } else {
        setVerifikasiError(res.error || "Gagal memperbarui status verifikasi.");
      }
    } catch (err) {
      setVerifikasiError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTindakLanjut(e) {
    e.preventDefault();
    setUploadError("");
    setActionError("");

    // Validasi client: keterangan minimal 10 karakter
    if (keterangan.trim().length < 10) {
      setActionError("Keterangan penanganan minimal 10 karakter.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload semua foto bukti terlebih dahulu
      const buktiPaths = [];
      for (const file of fotoFiles) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await uploadFotoAction(fd);
        if (!uploadRes.ok) {
          setUploadError(`Gagal upload foto: ${uploadRes.error}`);
          return;
        }
        buktiPaths.push(uploadRes.data.path);
      }

      // 2. Simpan tindak lanjut + bukti ke database
      const res = await catatTindakLanjutAction({
        laporan_id: laporanId,
        keterangan: keterangan.trim(),
        status_baru: statusTarget,
        bukti_paths: buktiPaths,
      });

      if (res.ok) {
        setShowTindak(false);
        setFotoFiles([]);
        setKeterangan("");
        setActionError("");
        router.refresh();
      } else {
        setActionError(res.error || "Gagal mencatat tindak lanjut. Coba lagi.");
      }
    } catch (err) {
      setActionError("Terjadi kesalahan jaringan. Periksa koneksi dan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  // ── Status: Menunggu Verifikasi ──────────────────────────────────────────
  if (statusSekarang === "menunggu_verifikasi") {
    return (
      <div className="space-y-3 pt-2">
        {verifikasiError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
            <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
            {verifikasiError}
          </div>
        )}
        {!showTolak ? (
          <div className="flex gap-2 flex-wrap">
            <Button
              size="small"
              variant="primary"
              disabled={loading}
              onClick={() => handleVerifikasi("terverifikasi")}
            >
              {loading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "✓ Verifikasi Valid"
              )}
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
              <Button
                size="small"
                variant="ghost"
                onClick={() => { setShowTolak(false); setVerifikasiError(""); }}
              >
                Batal
              </Button>
              <Button
                size="small"
                variant="danger"
                disabled={loading || !alasan.trim()}
                onClick={() => handleVerifikasi("ditolak", alasan)}
              >
                {loading ? <Loader2 className="size-3 animate-spin" /> : "Konfirmasi Tolak"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Status: Terverifikasi / Ditangani ────────────────────────────────────
  if (statusSekarang === "terverifikasi" || statusSekarang === "ditangani") {
    return (
      <div className="space-y-3 pt-2 w-full">
        {!showTindak ? (
          <Button
            size="small"
            variant="secondary"
            onClick={() => { setShowTindak(true); setActionError(""); setUploadError(""); }}
          >
            + Update Penanganan
          </Button>
        ) : (
          <form
            onSubmit={handleTindakLanjut}
            className="bg-[#f0f9f4] p-3.5 rounded-lg border border-[#c6f6d5] space-y-3 w-full"
          >
            <h4 className="text-xs font-bold text-[#22543d]">
              Catat Tindak Lanjut Penanganan:
            </h4>

            {/* Error inline dari action */}
            {actionError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                {actionError}
              </div>
            )}

            {/* Status Baru */}
            <div>
              <label className="block text-[11px] font-semibold text-[#276749] mb-1">
                Update Status:
              </label>
              <select
                value={statusTarget}
                onChange={(e) => setStatusTarget(e.target.value)}
                className="w-full text-xs p-1.5 rounded border border-[#9ae6b4] bg-white"
              >
                <option value="ditangani">Sedang Ditangani (Pemadaman Berlangsung)</option>
                <option value="selesai">Selesai (Api Berhasil Dipadamkan) ✓</option>
              </select>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-[11px] font-semibold text-[#276749] mb-1">
                Keterangan Penanganan:
                <span className="text-[#86998f] font-normal ml-1">(min. 10 karakter)</span>
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => { setKeterangan(e.target.value); setActionError(""); }}
                required
                rows={2}
                placeholder="Rincian armada yang diturunkan, luas yang dipadamkan..."
                className="w-full text-xs p-2 rounded border border-[#9ae6b4] bg-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div className="flex justify-between mt-0.5">
                <span className={`text-[10px] ${keterangan.trim().length < 10 && keterangan.length > 0 ? "text-red-500" : "text-[#86998f]"}`}>
                  {keterangan.trim().length} / min 10 karakter
                </span>
              </div>
            </div>

            {/* Upload Foto Bukti */}
            <div>
              <label className="block text-[11px] font-semibold text-[#276749] mb-1">
                Foto Bukti Penanganan{" "}
                <span className="text-[#64776f] font-normal">(opsional)</span>
              </label>

              {fotoFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {fotoFiles.map((f, i) => (
                    <div
                      key={i}
                      className="relative flex items-center gap-1 bg-white border border-[#9ae6b4] rounded-lg px-2 py-1 text-[11px] text-[#276749]"
                    >
                      <FileImage className="size-3 shrink-0" />
                      <span className="max-w-[120px] truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => hapusFoto(i)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fotoFiles.length < 3 && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handlePilihFoto}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-[#276749] bg-white border border-dashed border-[#9ae6b4] rounded-lg px-3 py-2 hover:bg-[#f0fdf4] transition w-full justify-center"
                  >
                    <Upload className="size-3.5" />
                    Pilih Foto Bukti (maks 3)
                  </button>
                </>
              )}

              {uploadError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-1.5 text-xs text-red-700">
                  <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                  {uploadError}
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-2 justify-end">
              <Button
                size="small"
                variant="ghost"
                type="button"
                onClick={() => {
                  setShowTindak(false);
                  setFotoFiles([]);
                  setUploadError("");
                  setActionError("");
                  setKeterangan("");
                }}
              >
                Batal
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={loading || keterangan.trim().length < 10}
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3 animate-spin" />
                    {fotoFiles.length > 0 ? "Mengupload…" : "Menyimpan…"}
                  </span>
                ) : statusTarget === "selesai" ? (
                  "✓ Selesaikan & Simpan Bukti"
                ) : (
                  "Simpan Update"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return null;
}
