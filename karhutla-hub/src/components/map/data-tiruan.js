// File: src/components/map/data-tiruan.js
// Konfigurasi status kejadian karhutla SIGAPI.
// PERHATIAN: Seluruh data wilayah provinsi dan laporan kejadian diambil 100%
// langsung dari Database Supabase (tabel 'wilayah' dan 'laporan').

import { STATUS_LAPORAN, STATUS_LAPORAN_LABEL } from "@/lib/constants/status";

export const STATUS_KEJADIAN = Object.freeze({
  TERVERIFIKASI: STATUS_LAPORAN.TERVERIFIKASI,
  DITANGANI: STATUS_LAPORAN.DITANGANI,
  SELESAI: STATUS_LAPORAN.SELESAI,
  MENUNGGU_VERIFIKASI: STATUS_LAPORAN.MENUNGGU_VERIFIKASI,
  DITOLAK: STATUS_LAPORAN.DITOLAK,
});

export const KONFIGURASI_STATUS = Object.freeze({
  [STATUS_KEJADIAN.DITANGANI]: {
    label: STATUS_LAPORAN_LABEL.ditangani,
    warna: "#dc2626", // Merah: Sedang ditangani pemadam
    keterangan: "Titik api aktif dalam proses pemadaman oleh regu darat/udara.",
  },
  [STATUS_KEJADIAN.TERVERIFIKASI]: {
    label: STATUS_LAPORAN_LABEL.terverifikasi,
    warna: "#2563eb", // Biru: Terverifikasi valid
    keterangan: "Laporan valid telah dikonfirmasi petugas, menunggu penugasan tim.",
  },
  [STATUS_KEJADIAN.MENUNGGU_VERIFIKASI]: {
    label: STATUS_LAPORAN_LABEL.menunggu_verifikasi,
    warna: "#d97706", // Amber/Oranye: Menunggu verifikasi
    keterangan: "Laporan baru dari masyarakat, menunggu pengecekan keabsahan.",
  },
  [STATUS_KEJADIAN.SELESAI]: {
    label: STATUS_LAPORAN_LABEL.selesai,
    warna: "#16a34a", // Hijau: Berhasil dipadamkan
    keterangan: "Api berhasil dipadamkan tuntas dan lokasi telah didinginkan.",
  },
  [STATUS_KEJADIAN.DITOLAK]: {
    label: STATUS_LAPORAN_LABEL.ditolak,
    warna: "#64748b", // Abu-abu: Ditolak / fiktif
    keterangan: "Laporan dibatalkan karena tidak valid atau titik api tidak ditemukan.",
  },
});
