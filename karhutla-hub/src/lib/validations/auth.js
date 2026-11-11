// File: src/lib/validations/auth.js
// Pemilik: Rafa

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export const registerSchema = z
  .object({
    nama: z.string().min(3, "Nama lengkap minimal 3 karakter."),
    email: z.string().email("Format email tidak valid."),
    nomor_hp: z
      .string()
      .min(10, "Nomor HP minimal 10 digit.")
      .regex(/^[0-9+]+$/, "Nomor HP hanya boleh berisi angka."),
    password: z.string().min(6, "Password minimal 6 karakter."),
    konfirmasi_password: z.string().min(6, "Konfirmasi password minimal 6 karakter."),
  })
  .refine((data) => data.password === data.konfirmasi_password, {
    message: "Konfirmasi password tidak cocok dengan password.",
    path: ["konfirmasi_password"],
  });

export const ubahRoleSchema = z.object({
  target_user_id: z.string().uuid("ID pengguna tidak valid."),
  role_baru: z.enum(["pelapor", "petugas", "admin"]),
});

