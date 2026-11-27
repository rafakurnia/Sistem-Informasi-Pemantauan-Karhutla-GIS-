"use server";

// File: src/actions/admin.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ubahRoleSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Helper: pastikan pemanggil adalah admin ─────────────────────────────────
async function pastikanAdmin(supabase, userId) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return profile?.role === "admin";
}

/**
 * Ubah role pengguna (pelapor ↔ petugas ↔ admin).
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan login terlebih dahulu." };
  if (!(await pastikanAdmin(supabase, user.id)))
    return { ok: false, error: "Hanya admin yang berhak mengubah role." };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ role: parsed.data.role_baru, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.target_user_id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/admin");
  return { ok: true };
}

// ─── Schema lokal ─────────────────────────────────────────────────────────────
const buatAkunSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  nomor_hp: z.string().min(10, "Nomor HP minimal 10 digit.").regex(/^[0-9+]+$/, "Hanya angka."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  role: z.enum(["pelapor", "petugas", "admin"]),
});

/**
 * Buat akun pengguna baru (pelapor / petugas / admin) oleh admin.
 * Menggunakan Admin API agar tidak perlu verifikasi email.
 */
export async function buatAkunAction(input) {
  const parsed = buatAkunSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = {};
    parsed.error.errors.forEach((err) => {
      fieldErrors[err.path.join(".")] = err.message;
    });
    return { ok: false, error: "Data akun belum valid.", fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan login terlebih dahulu." };
  if (!(await pastikanAdmin(supabase, user.id)))
    return { ok: false, error: "Hanya admin yang dapat membuat akun." };

  const adminClient = createAdminClient();

  // 1. Buat user di Supabase Auth
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { nama: parsed.data.nama, nomor_hp: parsed.data.nomor_hp },
  });

  if (authError) {
    const msg = authError.message?.toLowerCase() || "";
    if (msg.includes("already registered") || msg.includes("already exists")) {
      return { ok: false, error: "Email sudah terdaftar di sistem." };
    }
    return { ok: false, error: authError.message };
  }

  // 2. Simpan profil dengan role yang dipilih
  if (authData?.user) {
    const { error: profError } = await adminClient.from("profiles").upsert(
      {
        id: authData.user.id,
        nama: parsed.data.nama,
        nomor_hp: parsed.data.nomor_hp,
        role: parsed.data.role,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (profError) console.error("Gagal simpan profil:", profError.message);
  }

  revalidatePath("/dashboard/admin");
  return { ok: true, data: { id: authData?.user?.id } };
}

/**
 * Hapus akun pengguna beserta seluruh data terkait.
 * Admin tidak bisa menghapus dirinya sendiri.
 */
export async function hapusAkunAction(targetUserId) {
  if (!targetUserId) return { ok: false, error: "ID pengguna tidak boleh kosong." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan login terlebih dahulu." };
  if (!(await pastikanAdmin(supabase, user.id)))
    return { ok: false, error: "Hanya admin yang dapat menghapus akun." };

  if (user.id === targetUserId)
    return { ok: false, error: "Anda tidak dapat menghapus akun Anda sendiri." };

  const adminClient = createAdminClient();

  // Hapus user dari Supabase Auth (cascade akan hapus profiles via FK jika ada)
  const { error } = await adminClient.auth.admin.deleteUser(targetUserId);
  if (error) return { ok: false, error: error.message };

  // Pastikan profiles juga terhapus (jika tidak ada cascade)
  await adminClient.from("profiles").delete().eq("id", targetUserId);

  revalidatePath("/dashboard/admin");
  return { ok: true };
}

const ubahStatusLaporanSchema = z.object({
  laporan_id: z.string().uuid(),
  status_baru: z.enum(["menunggu_verifikasi", "terverifikasi", "ditangani", "selesai", "ditolak"]),
  catatan: z.string().optional(),
});

/**
 * Admin mengubah status laporan secara paksa (override).
 */
export async function ubahStatusLaporanAction(input) {
  const parsed = ubahStatusLaporanSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Data tidak valid." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan login terlebih dahulu." };
  if (!(await pastikanAdmin(supabase, user.id)))
    return { ok: false, error: "Hanya admin yang dapat mengubah status laporan secara paksa." };

  // Ambil status lama untuk log
  const { data: laporan } = await supabase
    .from("laporan")
    .select("status")
    .eq("id", parsed.data.laporan_id)
    .single();

  const { error } = await supabase
    .from("laporan")
    .update({
      status: parsed.data.status_baru,
      catatan_petugas: parsed.data.catatan || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.laporan_id);

  if (error) return { ok: false, error: error.message };

  // Catat di status_log
  await supabase.from("status_log").insert({
    laporan_id: parsed.data.laporan_id,
    status_lama: laporan?.status || null,
    status_baru: parsed.data.status_baru,
    diubah_oleh: user.id,
    alasan: parsed.data.catatan || "Diubah oleh admin.",
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/petugas");
  revalidatePath("/dashboard/pelapor");
  revalidatePath("/peta");
  return { ok: true };
}
