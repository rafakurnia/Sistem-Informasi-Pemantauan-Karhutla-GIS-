"use server";

// File: src/actions/wilayah.js
// Pemilik: Rafa
// Server Action untuk Admin menambah master data wilayah

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function tambahWilayahAction(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Silakan login terlebih dahulu." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Hanya akun Administrator yang berhak menambah wilayah." };
  }

  const nama_wilayah = formData.get ? formData.get("nama_wilayah") : formData.nama_wilayah;
  const kode_wilayah = formData.get ? formData.get("kode_wilayah") : formData.kode_wilayah;
  const latitude = parseFloat(formData.get ? formData.get("latitude") : formData.latitude);
  const longitude = parseFloat(formData.get ? formData.get("longitude") : formData.longitude);
  const deskripsi = formData.get ? formData.get("deskripsi") : formData.deskripsi;

  if (!nama_wilayah || isNaN(latitude) || isNaN(longitude)) {
    return { ok: false, error: "Nama wilayah, latitude, dan longitude wajib diisi dengan benar." };
  }

  const { data, error } = await supabase
    .from("wilayah")
    .insert({
      nama_wilayah,
      kode_wilayah: kode_wilayah || `ID-${Date.now().toString().slice(-6)}`,
      latitude,
      longitude,
      deskripsi: deskripsi || null,
    })
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/peta");
  return { ok: true, data };
}
