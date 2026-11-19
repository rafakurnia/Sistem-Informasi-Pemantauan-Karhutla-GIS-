"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tambahWilayahAction } from "@/actions/wilayah";
import { Plus, X, MapPin, Loader2, CheckCircle2 } from "lucide-react";

export default function FormTambahWilayah() {
  const router = useRouter();
  const [terbuka, setTerbuka] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState(null); // { tipe: "sukses"|"error", teks: string }

  const [form, setForm] = useState({
    nama_wilayah: "",
    kode_wilayah: "",
    latitude: "",
    longitude: "",
    deskripsi: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setPesan(null);

    const result = await tambahWilayahAction(form);

    if (result.ok) {
      setPesan({ tipe: "sukses", teks: `Wilayah "${form.nama_wilayah}" berhasil ditambahkan!` });
      setForm({ nama_wilayah: "", kode_wilayah: "", latitude: "", longitude: "", deskripsi: "" });
      router.refresh();
    } else {
      setPesan({ tipe: "error", teks: result.error || "Terjadi kesalahan. Coba lagi." });
    }
    setLoading(false);
  }

  return (
    <section className="rounded-2xl border border-[#2a5c40] bg-[#f0f7ee] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#18372e] m-0">Tambah Wilayah Baru</h2>
          <p className="text-sm text-[#64776f] mt-1 mb-0">
            Daftarkan wilayah pemantauan baru untuk sistem laporan karhutla.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setTerbuka((v) => !v); setPesan(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            terbuka
              ? "bg-white border border-[#b0cfb8] text-[#18372e] hover:bg-[#e8f5e2]"
              : "bg-[#173f30] text-white hover:bg-[#1e5540]"
          }`}
        >
          {terbuka ? <X className="size-4" /> : <Plus className="size-4" />}
          {terbuka ? "Tutup Form" : "Tambah Wilayah"}
        </button>
      </div>

      {pesan && !terbuka && (
        <div
          className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            pesan.tipe === "sukses"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {pesan.tipe === "sukses" && <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-emerald-600" />}
          {pesan.teks}
        </div>
      )}

      {terbuka && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {pesan && (
            <div
              className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                pesan.tipe === "sukses"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              {pesan.tipe === "sukses" && <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-emerald-600" />}
              {pesan.teks}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="nama_wilayah" className="block text-xs font-semibold text-[#18372e] uppercase tracking-wide">
                Nama Wilayah <span className="text-rose-500">*</span>
              </label>
              <input
                id="nama_wilayah"
                name="nama_wilayah"
                type="text"
                required
                placeholder="cth. Kabupaten Siak, Riau"
                value={form.nama_wilayah}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#c2d8c6] bg-white px-4 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b8a8] focus:outline-none focus:ring-2 focus:ring-[#173f30]/40 transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="kode_wilayah" className="block text-xs font-semibold text-[#18372e] uppercase tracking-wide">
                Kode Wilayah
              </label>
              <input
                id="kode_wilayah"
                name="kode_wilayah"
                type="text"
                placeholder="cth. ID-RIU-SIAK"
                value={form.kode_wilayah}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#c2d8c6] bg-white px-4 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b8a8] focus:outline-none focus:ring-2 focus:ring-[#173f30]/40 transition"
              />
              <p className="text-[11px] text-[#8aaa94]">Dikosongkan = dibuat otomatis</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="deskripsi" className="block text-xs font-semibold text-[#18372e] uppercase tracking-wide">
                Deskripsi
              </label>
              <input
                id="deskripsi"
                name="deskripsi"
                type="text"
                placeholder="cth. Wilayah rawan gambut Riau"
                value={form.deskripsi}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#c2d8c6] bg-white px-4 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b8a8] focus:outline-none focus:ring-2 focus:ring-[#173f30]/40 transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="latitude" className="block text-xs font-semibold text-[#18372e] uppercase tracking-wide">
                Latitude <span className="text-rose-500">*</span>
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                required
                placeholder="cth. 1.4931"
                value={form.latitude}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#c2d8c6] bg-white px-4 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b8a8] focus:outline-none focus:ring-2 focus:ring-[#173f30]/40 transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="longitude" className="block text-xs font-semibold text-[#18372e] uppercase tracking-wide">
                Longitude <span className="text-rose-500">*</span>
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                required
                placeholder="cth. 101.4553"
                value={form.longitude}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#c2d8c6] bg-white px-4 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b8a8] focus:outline-none focus:ring-2 focus:ring-[#173f30]/40 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setTerbuka(false); setPesan(null); }}
              className="px-4 py-2 rounded-xl border border-[#c2d8c6] bg-white text-sm font-medium text-[#18372e] hover:bg-[#e8f5e2] transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#173f30] text-white text-sm font-semibold hover:bg-[#1e5540] disabled:opacity-60 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan…
                </>
              ) : (
                <>
                  <MapPin className="size-4" />
                  Simpan Wilayah
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
