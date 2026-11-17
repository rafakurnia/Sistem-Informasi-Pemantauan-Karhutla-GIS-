"use server";

// File: src/actions/auth.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

/**
 * Server action untuk login pengguna (Pelapor, Petugas, Admin).
 */
export async function loginAction(input) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Data login belum lengkap.", fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message === "Invalid login credentials"
          ? "Email atau kata sandi yang Anda masukkan salah."
          : error.message,
    };
  }

  // Cek role pengguna untuk redirect yang sesuai
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = profile?.role || "pelapor";
  const redirectUrl =
    role === "admin"
      ? "/dashboard/admin"
      : role === "petugas"
      ? "/dashboard/petugas"
      : "/dashboard/pelapor";

  return { ok: true, data: { redirectUrl, role } };
}

/**
 * Server action untuk registrasi akun pelapor baru oleh masyarakat.
 */
export async function registerAction(input) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Data pendaftaran belum valid.", fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        nama: parsed.data.nama,
        nomor_hp: parsed.data.nomor_hp,
      },
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Backup insert ke profiles jika trigger database belum terpasang
  if (data?.user) {
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        nama: parsed.data.nama,
        nomor_hp: parsed.data.nomor_hp,
        role: "pelapor",
      },
      { onConflict: "id" }
    );
  }

  return { ok: true, data: { success: true } };
}

/**
 * Server action untuk logout pengguna.
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

