"use server";

// File: src/actions/admin.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ubahRoleSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

/**
 * Server action untuk Admin mengubah role pengguna (misal promosi menjadi Petugas atau Admin).
 * Menggunakan createAdminClient (service_role) di sisi server untuk bypass RLS profil.
 */
export async function ubahRolePenggunaAction(input) {
  const parsed = ubahRoleSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Input role tidak valid.", fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Akses ditolak: Silakan login terlebih dahulu." };
  }

  // Verifikasi peran pemanggil
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Hanya akun Administrator yang berhak mengubah role pengguna." };
  }

  // Gunakan service_role admin client khusus server
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({
      role: parsed.data.role_baru,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.target_user_id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin");
  return { ok: true, data: { success: true } };
}

