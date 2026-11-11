"use server";

// File: src/actions/upload.js
// Pemilik: Rafa

import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Megabytes

/**
 * Server action untuk mengunggah file foto bukti ke Supabase Storage.
 * Mengembalikan path file yang disimpan di bucket 'karhutla'.
 */
export async function uploadFotoAction(formData) {
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return { ok: false, error: "Tidak ada berkas gambar yang dipilih." };
  }

  // 1. Validasi MIME Type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: "Format berkas tidak didukung. Harap gunakan format JPG, PNG, atau WebP.",
    };
  }

  // 2. Validasi Ukuran (Maksimal 5 MB)
  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      error: "Ukuran berkas terlalu besar. Maksimal ukuran adalah 5 MB.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Silakan login terlebih dahulu untuk mengunggah berkas." };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { data, error } = await supabase.storage
    .from("karhutla")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: { path: data.path } };
}

