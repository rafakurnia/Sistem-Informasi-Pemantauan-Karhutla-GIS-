// File: src/queries/wilayah.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";

/**
 * Mengambil daftar master data wilayah rawan karhutla.
 */
export async function ambilDaftarWilayah() {
  const supabase = await createClient();

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

