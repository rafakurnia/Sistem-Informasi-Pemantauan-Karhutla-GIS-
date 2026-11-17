"use server";

// File: src/actions/tindak-lanjut.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";
import { tindakLanjutSchema } from "@/lib/validations/laporan";
import { revalidatePath } from "next/cache";

/**
 * Server action untuk petugas mencatat progres tindak lanjut penanganan di lapangan.
 * Status: 'ditangani' atau 'selesai'.
 */
export async function catatTindakLanjutAction(input) {
  const parsed = tindakLanjutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Data tindak lanjut belum valid.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Silakan login terlebih dahulu." };
  }

  // 1. Catat tindakan penanganan
  const { data: tindakLanjut, error: tlError } = await supabase
    .from("tindak_lanjut")
    .insert({
      laporan_id: parsed.data.laporan_id,
      petugas_id: user.id,
      keterangan: parsed.data.keterangan,
    })
    .select("id")
    .single();

  if (tlError || !tindakLanjut) {
    return {
      ok: false,
      error: tlError?.message || "Gagal menyimpan catatan penanganan.",
    };
  }

  // 2. Simpan foto bukti jika ada
  if (parsed.data.bukti_paths && parsed.data.bukti_paths.length > 0) {
    const buktiInserts = parsed.data.bukti_paths.map((path) => ({
      tindak_lanjut_id: tindakLanjut.id,
      foto_url: path,
      deskripsi: "Bukti penanganan kebakaran di lokasi.",
    }));
    await supabase.from("bukti_penanganan").insert(buktiInserts);
  }

  // 3. Update status laporan ke 'ditangani' atau 'selesai'
  const { error: updateError } = await supabase
    .from("laporan")
    .update({
      status: parsed.data.status_baru,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.laporan_id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  // 4. Catat riwayat log status
  await supabase.from("status_log").insert({
    laporan_id: parsed.data.laporan_id,
    status_lama: parsed.data.status_baru === "ditangani" ? "terverifikasi" : "ditangani",
    status_baru: parsed.data.status_baru,
    diubah_oleh: user.id,
    alasan: parsed.data.keterangan,
  });

  revalidatePath("/");
  revalidatePath("/dashboard/petugas");
  revalidatePath("/dashboard/admin");
  return { ok: true, data: { success: true } };
}

