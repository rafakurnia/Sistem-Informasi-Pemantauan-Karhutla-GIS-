import { STATUS_LAPORAN } from "../laporan/status";

// TODO: ganti konfigurasi status peta ini dengan konfigurasi publik Rafa.
export const STATUS_KEJADIAN = Object.freeze({
  TERVERIFIKASI: STATUS_LAPORAN.TERVERIFIKASI,
  DITANGANI: STATUS_LAPORAN.DITANGANI,
  SELESAI: STATUS_LAPORAN.SELESAI,
});

export const KONFIGURASI_STATUS = Object.freeze({
  [STATUS_KEJADIAN.TERVERIFIKASI]: {
    label: "Terverifikasi",
    warna: "#dc2626",
  },
  [STATUS_KEJADIAN.DITANGANI]: {
    label: "Sedang ditangani",
    warna: "#d97706",
  },
  [STATUS_KEJADIAN.SELESAI]: {
    label: "Selesai",
    warna: "#16a34a",
  },
});

// TODO: ganti dengan query asli dari src/queries/ setelah query Rafa siap.
export const DATA_TIRUAN_KEJADIAN = [
  {
    id: "karhutla-001",
    lat: -0.7893,
    lng: 113.9213,
    wilayah: "Kabupaten Kapuas, Kalimantan Tengah",
    status: STATUS_KEJADIAN.TERVERIFIKASI,
    waktu: "2025-08-12T08:30:00+07:00",
    deskripsi: "Asap terlihat di area lahan dekat permukiman dan kebun.",
  },
  {
    id: "karhutla-002",
    lat: 0.5071,
    lng: 101.4478,
    wilayah: "Kota Pekanbaru, Riau",
    status: STATUS_KEJADIAN.DITANGANI,
    waktu: "2025-08-11T14:15:00+07:00",
    deskripsi: "Petugas melakukan pemeriksaan dan pemadaman di lokasi.",
  },
  {
    id: "karhutla-003",
    lat: -2.1316,
    lng: 106.1169,
    wilayah: "Kabupaten Bangka, Kepulauan Bangka Belitung",
    status: STATUS_KEJADIAN.SELESAI,
    waktu: "2025-08-10T10:00:00+07:00",
    deskripsi: "Api berhasil dipadamkan dan lokasi sudah diperiksa kembali.",
  },
  {
    id: "karhutla-004",
    lat: -1.6815,
    lng: 110.5117,
    wilayah: "Kabupaten Ketapang, Kalimantan Barat",
    status: STATUS_KEJADIAN.DITANGANI,
    waktu: "2025-08-09T16:45:00+07:00",
    deskripsi: "Tim gabungan berada di lokasi untuk mencegah api meluas.",
  },
  {
    id: "karhutla-005",
    lat: -3.3194,
    lng: 114.5908,
    wilayah: "Kota Banjarmasin, Kalimantan Selatan",
    status: STATUS_KEJADIAN.TERVERIFIKASI,
    waktu: "2025-08-08T09:20:00+07:00",
    deskripsi: "Titik panas telah dikonfirmasi dan menunggu penanganan.",
  },
  {
    id: "karhutla-006",
    lat: -0.9471,
    lng: 100.4172,
    wilayah: "Kota Padang, Sumatera Barat",
    status: STATUS_KEJADIAN.SELESAI,
    waktu: "2025-08-07T13:10:00+07:00",
    deskripsi: "Pemadaman selesai, kondisi area dilaporkan terkendali.",
  },
  {
    id: "karhutla-007",
    lat: -2.9909,
    lng: 104.7566,
    wilayah: "Kota Palembang, Sumatera Selatan",
    status: STATUS_KEJADIAN.DITANGANI,
    waktu: "2025-08-06T11:35:00+07:00",
    deskripsi: "Petugas melakukan pembasahan pada lahan yang terdampak.",
  },
  {
    id: "karhutla-008",
    lat: -7.2575,
    lng: 112.7521,
    wilayah: "Kota Surabaya, Jawa Timur",
    status: STATUS_KEJADIAN.TERVERIFIKASI,
    waktu: "2025-08-05T07:50:00+07:00",
    deskripsi: "Laporan asap sedang diverifikasi oleh petugas setempat.",
  },
  {
    id: "karhutla-009",
    lat: -8.65,
    lng: 115.2167,
    wilayah: "Kota Denpasar, Bali",
    status: STATUS_KEJADIAN.SELESAI,
    waktu: "2025-08-04T15:05:00+07:00",
    deskripsi: "Sumber api telah ditangani dan tidak ditemukan titik aktif.",
  },
];
