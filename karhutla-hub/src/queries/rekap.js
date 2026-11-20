// File: src/queries/rekap.js
// Pemilik: Rafa (fungsi rekap data untuk admin, berjalan di server)

import { createClient } from "@/lib/supabase/server";

/**
 * Mengambil ringkasan indikator laporan untuk Dashboard Admin.
 * Catatan aturan: Laporan 'ditolak' tidak dihitung sebagai kejadian terverifikasi.
 * Menyertakan jumlah petugas dan wilayah untuk metrik lengkap.
 */
export async function ambilRekapStatistik() {
  const supabase = await createClient();

  const [
    { data: laporan, error: lapError },
    { count: jumlahPetugas, error: petError },
    { count: jumlahWilayah, error: wilError },
  ] = await Promise.all([
    supabase.from("laporan").select("status, created_at, wilayah_id"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "petugas"),
    supabase.from("wilayah").select("id", { count: "exact", head: true }),
  ]);

  if (lapError || !laporan) {
    return {
      totalKejadian: 0,
      perluVerifikasi: 0,
      dalamPenanganan: 0,
      selesaiDitangani: 0,
      ditolak: 0,
      totalSemua: 0,
      jumlahPetugas: jumlahPetugas || 0,
      jumlahWilayah: jumlahWilayah || 0,
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
    jumlahPetugas: jumlahPetugas || 0,
    jumlahWilayah: jumlahWilayah || 0,
  };
}

/**
 * Mengambil daftar petugas aktif untuk penugasan oleh Admin.
 */
export async function ambilDaftarPetugas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nama, nomor_hp, role, created_at")
    .eq("role", "petugas")
    .order("nama", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data petugas:", error.message);
    return [];
  }

  return data || [];
}
