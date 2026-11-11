// File: src/lib/validations/laporan.js
// Pemilik: Rafa

import { z } from "zod";

export const buatLaporanSchema = z.object({
  wilayah_id: z.coerce.number().min(1, "Wilayah kejadian harus dipilih."),
  latitude: z.coerce
    .number()
    .min(-90, "Garis lintang tidak valid (-90 s/d 90).")
    .max(90, "Garis lintang tidak valid (-90 s/d 90)."),
  longitude: z.coerce
    .number()
    .min(-180, "Garis bujur tidak valid (-180 s/d 180).")
    .max(180, "Garis bujur tidak valid (-180 s/d 180)."),
  waktu_kejadian: z.string().min(1, "Waktu kejadian wajib diisi."),
  deskripsi: z.string().min(10, "Deskripsi kejadian minimal 10 karakter."),
  foto_paths: z
    .array(z.string())
    .min(1, "Wajib menyertakan minimal 1 foto bukti kebakaran."),
});

export const verifikasiLaporanSchema = z
  .object({
    laporan_id: z.string().uuid("ID laporan tidak valid."),
    status: z.enum(["terverifikasi", "ditolak"]),
    catatan: z.string().optional(),
    alasan_penolakan: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.status === "ditolak" &&
        (!data.alasan_penolakan || data.alasan_penolakan.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Alasan penolakan wajib diisi apabila laporan ditolak.",
      path: ["alasan_penolakan"],
    }
  );

export const tindakLanjutSchema = z
  .object({
    laporan_id: z.string().uuid("ID laporan tidak valid."),
    keterangan: z.string().min(10, "Keterangan penanganan minimal 10 karakter."),
    status_baru: z.enum(["ditangani", "selesai"]),
    bukti_paths: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (
        data.status_baru === "selesai" &&
        (!data.bukti_paths || data.bukti_paths.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Minimal sertakan 1 foto bukti penanganan di lapangan untuk menyelesaikan laporan.",
      path: ["bukti_paths"],
    }
  );

export const penugasanSchema = z.object({
  laporan_id: z.string().uuid("ID laporan tidak valid."),
  petugas_id: z.string().uuid("ID petugas tidak valid."),
  catatan: z.string().optional(),
});

