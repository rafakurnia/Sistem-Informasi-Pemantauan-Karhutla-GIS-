// File: src/lib/constants/status.js
// Pemilik: Rafa

export const STATUS_LAPORAN = {
  MENUNGGU_VERIFIKASI: "menunggu_verifikasi",
  TERVERIFIKASI: "terverifikasi",
  DITANGANI: "ditangani",
  SELESAI: "selesai",
  DITOLAK: "ditolak",
};

export const STATUS_LAPORAN_LABEL = {
  menunggu_verifikasi: "Menunggu Verifikasi",
  terverifikasi: "Terverifikasi",
  ditangani: "Sedang Ditangani",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export const STATUS_LAPORAN_BADGE_VARIANT = {
  menunggu_verifikasi: "warning",
  terverifikasi: "default",
  ditangani: "secondary",
  selesai: "outline",
  ditolak: "destructive",
};

export const DAFTAR_STATUS = Object.values(STATUS_LAPORAN);

