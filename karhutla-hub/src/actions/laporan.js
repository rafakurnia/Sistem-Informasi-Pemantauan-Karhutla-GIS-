"use server";

// File: src/actions/laporan.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";
import { buatLaporanSchema } from "@/lib/validations/laporan";
import { revalidatePath } from "next/cache";

/**
 * Server action untuk pelapor membuat laporan karhutla baru.
 * Otomatis berstatus 'menunggu_verifikasi' dan dicatat ke status_log.
 */
export async function buatLaporanAction(input) {
  const parsed = buatLaporanSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Data laporan belum valid.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Anda harus login untuk mengirimkan laporan." };
  }

  // 1. Simpan baris laporan baru
  const { data: laporan, error: insertError } = await supabase
    .from("laporan")
    .insert({
      pelapor_id: user.id,
      wilayah_id: parsed.data.wilayah_id,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      waktu_kejadian: parsed.data.waktu_kejadian,
      deskripsi: parsed.data.deskripsi,
      status: "menunggu_verifikasi",
    })
    .select("id")
    .single();

  if (insertError || !laporan) {
    return {
      ok: false,
      error: insertError?.message || "Gagal menyimpan data laporan ke database.",
    };
  }

  // 2. Simpan path foto ke laporan_foto (hanya path, bukan base64)
  if (parsed.data.foto_paths && parsed.data.foto_paths.length > 0) {
    const fotoInserts = parsed.data.foto_paths.map((path) => ({
      laporan_id: laporan.id,
      foto_url: path,
    }));
    await supabase.from("laporan_foto").insert(fotoInserts);
  }

  // 3. Catat status log awal
  await supabase.from("status_log").insert({
    laporan_id: laporan.id,
    status_lama: null,
    status_baru: "menunggu_verifikasi",
    diubah_oleh: user.id,
    alasan: "Laporan baru dikirim oleh pelapor.",
  });

  revalidatePath("/dashboard/pelapor");
  revalidatePath("/dashboard/petugas");
  return { ok: true, data: { id: laporan.id } };
}

