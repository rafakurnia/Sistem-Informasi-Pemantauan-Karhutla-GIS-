"use client";

// File: src/app/dashboard/pelapor/FormLaporan.js
// Form pelaporan karhutla baru oleh pelapor

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buatLaporanAction } from "@/actions/laporan";
import Button from "@/components/ui/Button";

export default function FormLaporan({ daftarWilayah = [] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(e.target);
    const result = await buatLaporanAction({
      wilayah_id: form.get("wilayah_id"),
      latitude: parseFloat(form.get("latitude")),
      longitude: parseFloat(form.get("longitude")),
      waktu_kejadian: new Date(form.get("waktu_kejadian")).toISOString(),
      deskripsi: form.get("deskripsi"),
      foto_paths: [], // sementara tanpa upload storage
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error || "Gagal mengirimkan laporan.");
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  function isiKoordinatWilayah(e) {
    const wilayahId = e.target.value;
    const w = daftarWilayah.find((item) => item.id === wilayahId);
    if (w) {
      const latInput = document.getElementById("lat-input");
      const lngInput = document.getElementById("lng-input");
      if (latInput && lngInput) {
        latInput.value = w.latitude;
        lngInput.value = w.longitude;
      }
    }
  }

  return (
    <div>
      {!open ? (
        <Button onClick={() => setOpen(true)} variant="primary">
          + Buat Laporan Karhutla
        </Button>
      ) : (
        <div className="rounded-xl border border-[#c8ddd5] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#e8eee8] mb-5">
            <h2 className="text-lg font-bold text-[#18372e]">
              Formulir Laporan Kejadian Karhutla
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-[#64776f] hover:text-[#18372e] underline"
            >
              Tutup
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#40574d] mb-1">
                Pilih Wilayah Terdekat
              </label>
              <select
                name="wilayah_id"
                required
                onChange={isiKoordinatWilayah}
                className="w-full rounded-lg border border-[#c8ddd5] bg-white px-3 py-2 text-sm text-[#18372e] outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              >
                <option value="">-- Pilih Wilayah --</option>
                {daftarWilayah.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nama_wilayah} ({w.kode_wilayah})
                  </option>
                ))}
              </select>
              {fieldErrors.wilayah_id && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.wilayah_id}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#40574d] mb-1">
                  Latitude
                </label>
                <input
                  id="lat-input"
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  placeholder="Contoh: 0.9056"
                  className="w-full rounded-lg border border-[#c8ddd5] bg-white px-3 py-2 text-sm text-[#18372e] outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                />
                {fieldErrors.latitude && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.latitude}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#40574d] mb-1">
                  Longitude
                </label>
                <input
                  id="lng-input"
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  placeholder="Contoh: 102.0089"
                  className="w-full rounded-lg border border-[#c8ddd5] bg-white px-3 py-2 text-sm text-[#18372e] outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                />
                {fieldErrors.longitude && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.longitude}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#40574d] mb-1">
                Waktu Kejadian
              </label>
              <input
                name="waktu_kejadian"
                type="datetime-local"
                required
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full rounded-lg border border-[#c8ddd5] bg-white px-3 py-2 text-sm text-[#18372e] outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              />
              {fieldErrors.waktu_kejadian && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.waktu_kejadian}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#40574d] mb-1">
                Deskripsi Kejadian &amp; Kondisi Lapangan
              </label>
              <textarea
                name="deskripsi"
                rows={3}
                required
                placeholder="Jelaskan perkiraan luas lahan terbakar, jenis vegetasi, dan akses jalan..."
                className="w-full rounded-lg border border-[#c8ddd5] bg-white px-3 py-2 text-sm text-[#18372e] outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              />
              {fieldErrors.deskripsi && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.deskripsi}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button onClick={() => setOpen(false)} variant="secondary" type="button">
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Mengirimkan…" : "Kirim Laporan"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

