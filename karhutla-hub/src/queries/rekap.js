// File: src/queries/rekap.js
// Pemilik: Rafa (fungsi rekap data untuk admin, berjalan di server)

import { createClient } from "@/lib/supabase/server";

/**
 * Mengambil ringkasan indikator laporan untuk Dashboard Admin.
 * Catatan aturan: Laporan 'ditolak' tidak dihitung sebagai kejadian terverifikasi.
 */
export async function ambilRekapStatistik() {
  const supabase = await createClient();

  const { data: laporan, error } = await supabase
    .from("laporan")
    .select("status, created_at, wilayah_id");

  if (error || !laporan) {
    return {
      totalKejadian: 0,
      perluVerifikasi: 0,
      dalamPenanganan: 0,
      selesaiDitangani: 0,
      ditolak: 0,
      totalSemua: 0,
    };
  }

  const perluVerifikasi = laporan.filter((l) => l.status === "menunggu_verifikasi").length;
  const dalamPenanganan = laporan.filter((l) => l.status === "ditangani").length;
  const selesaiDitangani = laporan.filter((l) => l.status === "selesai").length;
  const terverifikasi = laporan.filter((l) => l.status === "terverifikasi").length;
  const ditolak = laporan.filter((l) => l.status === "ditolak").length;

  // Total kejadian valid / terverifikasi
  const totalKejadian = terverifikasi + dalamPenanganan + selesaiDitangani;

  return {
    totalKejadian,
    perluVerifikasi,
    dalamPenanganan,
    selesaiDitangani,
    ditolak,
    totalSemua: laporan.length,
  };
}

