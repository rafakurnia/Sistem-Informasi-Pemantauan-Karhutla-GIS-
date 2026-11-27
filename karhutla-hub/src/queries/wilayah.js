// File: src/queries/wilayah.js
// Pemilik: Rafa

import { createPublicClient } from "@/lib/supabase/public";

/**
 * Mengambil daftar master data wilayah rawan karhutla.
 * Data ini bersifat publik — tidak butuh sesi pengguna.
 */
export async function ambilDaftarWilayah() {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("wilayah")
    .select("id, nama_wilayah, kode_wilayah, latitude, longitude, deskripsi")
    .order("nama_wilayah", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data wilayah:", error.message);
    return [];
  }

  return data || [];
}
