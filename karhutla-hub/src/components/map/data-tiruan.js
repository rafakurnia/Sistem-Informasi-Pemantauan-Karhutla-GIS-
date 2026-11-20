// File: src/components/map/data-tiruan.js
// Konfigurasi status laporan & master data provinsi Indonesia untuk SIGAPI.
// Semua data laporan diambil langsung dari database Supabase — tidak ada data dummy.

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

/**
 * Daftar 38 Provinsi di Indonesia lengkap dengan koordinat pusat geospasial
 * untuk navigasi dan filter interaktif peta Karhutla SIGAPI.
 */
export const PROVINSI_INDONESIA = [
  // Prioritas Wilayah Rawan Karhutla (Sumatera & Kalimantan)
  { id: "riau", nama: "Riau", lat: 0.5071, lng: 101.4478, zoom: 8, rawan: true },
  { id: "kalteng", nama: "Kalimantan Tengah", lat: -1.6815, lng: 113.3824, zoom: 8, rawan: true },
  { id: "sumsel", nama: "Sumatera Selatan", lat: -3.3194, lng: 104.5908, zoom: 8, rawan: true },
  { id: "kalbar", nama: "Kalimantan Barat", lat: -0.1322, lng: 111.0969, zoom: 8, rawan: true },
  { id: "jambi", nama: "Jambi", lat: -1.6101, lng: 103.6131, zoom: 8, rawan: true },
  { id: "kalsel", nama: "Kalimantan Selatan", lat: -3.0926, lng: 115.2838, zoom: 8, rawan: true },
  { id: "kaltim", nama: "Kalimantan Timur", lat: 0.5387, lng: 116.4194, zoom: 8, rawan: true },
  { id: "kaltara", nama: "Kalimantan Utara", lat: 3.0731, lng: 116.0414, zoom: 8, rawan: true },
  { id: "sumut", nama: "Sumatera Utara", lat: 2.1154, lng: 99.5451, zoom: 8, rawan: true },
  { id: "sumbar", nama: "Sumatera Barat", lat: -0.7399, lng: 100.8000, zoom: 8, rawan: true },
  { id: "aceh", nama: "Aceh", lat: 4.6951, lng: 96.7494, zoom: 8, rawan: true },
  { id: "lampung", nama: "Lampung", lat: -4.5586, lng: 105.4068, zoom: 8, rawan: true },
  { id: "babel", nama: "Kepulauan Bangka Belitung", lat: -2.7411, lng: 106.4406, zoom: 8, rawan: true },
  { id: "kepri", nama: "Kepulauan Riau", lat: 3.9457, lng: 108.1429, zoom: 8, rawan: true },
  { id: "bengkulu", nama: "Bengkulu", lat: -3.5778, lng: 102.3464, zoom: 8, rawan: true },
  // Jawa, Bali, Nusa Tenggara
  { id: "dki", nama: "DKI Jakarta", lat: -6.2088, lng: 106.8456, zoom: 10, rawan: false },
  { id: "jabar", nama: "Jawa Barat", lat: -6.9175, lng: 107.6191, zoom: 8, rawan: false },
  { id: "jateng", nama: "Jawa Tengah", lat: -7.1510, lng: 110.1403, zoom: 8, rawan: false },
  { id: "diy", nama: "DI Yogyakarta", lat: -7.7956, lng: 110.3695, zoom: 10, rawan: false },
  { id: "jatim", nama: "Jawa Timur", lat: -7.5361, lng: 112.2384, zoom: 8, rawan: true },
  { id: "banten", nama: "Banten", lat: -6.4058, lng: 106.0640, zoom: 9, rawan: false },
  { id: "bali", nama: "Bali", lat: -8.4095, lng: 115.1889, zoom: 9, rawan: false },
  { id: "ntb", nama: "Nusa Tenggara Barat", lat: -8.6529, lng: 117.3616, zoom: 8, rawan: true },
  { id: "ntt", nama: "Nusa Tenggara Timur", lat: -8.6574, lng: 121.0794, zoom: 8, rawan: true },
  // Sulawesi
  { id: "sulut", nama: "Sulawesi Utara", lat: 0.6247, lng: 123.9750, zoom: 8, rawan: false },
  { id: "sulteng", nama: "Sulawesi Tengah", lat: -1.4300, lng: 121.4456, zoom: 8, rawan: false },
  { id: "sulsel", nama: "Sulawesi Selatan", lat: -3.6687, lng: 119.9741, zoom: 8, rawan: false },
  { id: "sultra", nama: "Sulawesi Tenggara", lat: -4.1449, lng: 122.1746, zoom: 8, rawan: false },
  { id: "gorontalo", nama: "Gorontalo", lat: 0.6999, lng: 122.4467, zoom: 9, rawan: false },
  { id: "sulbar", nama: "Sulawesi Barat", lat: -2.8441, lng: 119.2321, zoom: 8, rawan: false },
  // Maluku & Papua
  { id: "maluku", nama: "Maluku", lat: -3.2385, lng: 130.1453, zoom: 8, rawan: false },
  { id: "malut", nama: "Maluku Utara", lat: 1.5709, lng: 127.8088, zoom: 8, rawan: false },
  { id: "papua", nama: "Papua", lat: -4.2699, lng: 138.0804, zoom: 7, rawan: false },
  { id: "papuabarat", nama: "Papua Barat", lat: -1.3361, lng: 133.1747, zoom: 7, rawan: false },
  { id: "papuaselatan", nama: "Papua Selatan", lat: -7.5000, lng: 139.5000, zoom: 7, rawan: false },
  { id: "papuatengah", nama: "Papua Tengah", lat: -3.7000, lng: 136.5000, zoom: 7, rawan: false },
  { id: "papuapegunungan", nama: "Papua Pegunungan", lat: -4.1000, lng: 139.0000, zoom: 7, rawan: false },
  { id: "papuabaratdaya", nama: "Papua Barat Daya", lat: -1.0000, lng: 131.5000, zoom: 7, rawan: false },
];
