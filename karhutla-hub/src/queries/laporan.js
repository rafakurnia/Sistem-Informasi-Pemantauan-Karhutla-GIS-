// File: src/queries/laporan.js
// Pemilik: Rafa (fungsi baca data, berjalan di server)

import { createClient } from "@/lib/supabase/server";

/**
 * Mengambil daftar laporan untuk Peta Publik & Landing Page.
 * Sesuai aturan keamanan:
 * 1. Hanya laporan dengan status 'terverifikasi', 'ditangani', dan 'selesai'.
 * 2. TIDAK memuat nama atau nomor HP pelapor demi privasi masyarakat.
 */
export async function ambilLaporanPublik() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laporan")
    .select(`
      id,
      latitude,
      longitude,
      waktu_kejadian,
      deskripsi,
      status,
      created_at,
      wilayah:wilayah_id (
        id,
        nama_wilayah,
        kode_wilayah
      ),
      fotos:laporan_foto (
        id,
        foto_url
      )
    `)
    .in("status", ["terverifikasi", "ditangani", "selesai"])
    .order("waktu_kejadian", { ascending: false });

  if (error) {
    console.error("Gagal mengambil laporan publik:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Mengambil detail laporan kejadian publik berdasarkan ID.
 * Hanya bisa dibuka bila berstatus terverifikasi, ditangani, atau selesai.
 */
export async function ambilDetailKejadian(id) {
  if (!id) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laporan")
    .select(`
      id,
      latitude,
      longitude,
      waktu_kejadian,
      deskripsi,
      status,
      catatan_petugas,
      created_at,
      updated_at,
      wilayah:wilayah_id (
        id,
        nama_wilayah,
        kode_wilayah
      ),
      fotos:laporan_foto (
        id,
        foto_url
      ),
      tindak_lanjut (
        id,
        keterangan,
        created_at,
        bukti:bukti_penanganan (
          id,
          foto_url,
          deskripsi
        )
      )
    `)
    .eq("id", id)
    .in("status", ["terverifikasi", "ditangani", "selesai"])
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Mengambil riwayat laporan milik pelapor yang sedang login.
 */
export async function ambilLaporanSaya() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("laporan")
    .select(`
      id,
      latitude,
      longitude,
      waktu_kejadian,
      deskripsi,
      status,
      catatan_petugas,
      created_at,
      updated_at,
      wilayah:wilayah_id (
        id,
        nama_wilayah
      ),
      fotos:laporan_foto (
        id,
        foto_url
      )
    `)
    .eq("pelapor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil laporan pelapor:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Mengambil antrean verifikasi untuk Petugas & Admin.
 * Status: 'menunggu_verifikasi'
 */
export async function ambilAntreanVerifikasi() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laporan")
    .select(`
      id,
      latitude,
      longitude,
      waktu_kejadian,
      deskripsi,
      status,
      created_at,
      pelapor:pelapor_id (
        id,
        nama,
        nomor_hp
      ),
      wilayah:wilayah_id (
        id,
        nama_wilayah
      ),
      fotos:laporan_foto (
        id,
        foto_url
      )
    `)
    .eq("status", "menunggu_verifikasi")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Gagal mengambil antrean verifikasi:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Mengambil laporan yang ditugaskan kepada petugas yang sedang login.
 */
export async function ambilTugasPetugasSaya() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: penugasan, error: pError } = await supabase
    .from("penugasan")
    .select("laporan_id")
    .eq("petugas_id", user.id);

  if (pError || !penugasan || penugasan.length === 0) {
    return [];
  }

  const laporanIds = penugasan.map((p) => p.laporan_id);

  const { data, error } = await supabase
    .from("laporan")
    .select(`
      id,
      latitude,
      longitude,
      waktu_kejadian,
      deskripsi,
      status,
      catatan_petugas,
      created_at,
      wilayah:wilayah_id (
        id,
        nama_wilayah
      ),
      fotos:laporan_foto (
        id,
        foto_url
      )
    `)
    .in("id", laporanIds)
    .in("status", ["terverifikasi", "ditangani"])
    .order("waktu_kejadian", { ascending: false });

  if (error) {
    console.error("Gagal mengambil tugas petugas:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Mengambil semua laporan untuk halaman kelola Admin.
 */
export async function ambilSemuaLaporanAdmin({ status, limit = 50, page = 1 } = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("laporan")
    .select(
      `
      id,
      latitude,
      longitude,
      waktu_kejadian,
      deskripsi,
      status,
      catatan_petugas,
      created_at,
      pelapor:pelapor_id (nama),
      wilayah:wilayah_id (nama_wilayah)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Gagal mengambil semua laporan admin:", error.message);
    return { data: [], total: 0 };
  }

  return { data: data || [], total: count || 0 };
}

