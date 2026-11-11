"use server";

// File: src/actions/penugasan.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";
import { penugasanSchema } from "@/lib/validations/laporan";
import { revalidatePath } from "next/cache";

/**
 * Server action untuk Admin menugaskan petugas lapangan ke laporan karhutla.
 */
export async function tugaskanPetugasAction(input) {
  const parsed = penugasanSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Data penugasan tidak valid.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Silakan login terlebih dahulu." };
  }

  // Hanya admin yang bisa menugaskan secara eksplisit
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Hanya admin yang berhak melakukan penugasan petugas." };
  }

  const { error } = await supabase.from("penugasan").insert({
    laporan_id: parsed.data.laporan_id,
    petugas_id: parsed.data.petugas_id,
    ditugaskan_oleh: user.id,
    catatan: parsed.data.catatan || "Ditugaskan oleh Administrator.",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/petugas");
  return { ok: true, data: { success: true } };
}

