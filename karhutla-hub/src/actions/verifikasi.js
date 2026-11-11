"use server";

// File: src/actions/verifikasi.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";
import { verifikasiLaporanSchema } from "@/lib/validations/laporan";
import { revalidatePath } from "next/cache";

/**
 * Server action untuk petugas memverifikasi atau menolak laporan.
 */
export async function verifikasiLaporanAction(input) {
  const parsed = verifikasiLaporanSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Data verifikasi belum valid.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Silakan login terlebih dahulu." };
  }

  // Cek apakah user adalah petugas atau admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "petugas" && profile?.role !== "admin") {
    return {
      ok: false,
      error: "Akses ditolak: Hanya petugas atau admin yang berhak memverifikasi laporan.",
    };
  }

  // 1. Update status laporan
  const catatan =
    parsed.data.status === "ditolak"
      ? parsed.data.alasan_penolakan
      : parsed.data.catatan || "Laporan terverifikasi valid.";

  const { error: updateError } = await supabase
    .from("laporan")
    .update({
      status: parsed.data.status,
      catatan_petugas: catatan,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.laporan_id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  // 2. Bila status terverifikasi, otomatis jadikan pemverifikasi sebagai petugas yang ditugaskan
  if (parsed.data.status === "terverifikasi") {
    const { data: existingPenugasan } = await supabase
      .from("penugasan")
      .select("id")
      .eq("laporan_id", parsed.data.laporan_id)
      .limit(1);

    if (!existingPenugasan || existingPenugasan.length === 0) {
      await supabase.from("penugasan").insert({
        laporan_id: parsed.data.laporan_id,
        petugas_id: user.id,
        ditugaskan_oleh: user.id,
        catatan: "Ditugaskan otomatis saat laporan diverifikasi.",
      });
    }
  }

  // 3. Catat riwayat ke status_log
  await supabase.from("status_log").insert({
    laporan_id: parsed.data.laporan_id,
    status_lama: "menunggu_verifikasi",
    status_baru: parsed.data.status,
    diubah_oleh: user.id,
    alasan: catatan,
  });

  revalidatePath("/");
  revalidatePath("/dashboard/petugas");
  revalidatePath("/dashboard/admin");
  return { ok: true, data: { success: true } };
}

