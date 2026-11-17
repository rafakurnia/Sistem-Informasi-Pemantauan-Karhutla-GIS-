// File: src/types/index.js
// Pemilik: Rafa (Tipe Data Bersama & Definisi Skema Database)

/**
 * @typedef {'pelapor' | 'petugas' | 'admin'} UserRole
 */

/**
 * @typedef {'menunggu_verifikasi' | 'terverifikasi' | 'ditangani' | 'selesai' | 'ditolak'} StatusLaporan
 */

/**
 * @template T
 * @typedef {Object} ActionResultSuccess
 * @property {true} ok
 * @property {T} data
 */

/**
 * @typedef {Object} ActionResultError
 * @property {false} ok
 * @property {string} error
 * @property {Record<string, string>} [fieldErrors]
 */

/**
 * @template T
 * @typedef {ActionResultSuccess<T> | ActionResultError} ActionResult
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - UUID user dari auth.users
 * @property {string} nama
 * @property {string} [nomor_hp]
 * @property {UserRole} role
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Wilayah
 * @property {number} id
 * @property {string} nama_wilayah
 * @property {string} kode_wilayah
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [deskripsi]
 * @property {string} created_at
 */

/**
 * @typedef {Object} Laporan
 * @property {string} id - UUID
 * @property {string} pelapor_id
 * @property {number} wilayah_id
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} waktu_kejadian
 * @property {string} deskripsi
 * @property {StatusLaporan} status
 * @property {string} [catatan_petugas]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} LaporanFoto
 * @property {string} id - UUID
 * @property {string} laporan_id
 * @property {string} foto_url
 * @property {string} created_at
 */

/**
 * @typedef {Object} Penugasan
 * @property {string} id - UUID
 * @property {string} laporan_id
 * @property {string} petugas_id
 * @property {string} [ditugaskan_oleh]
 * @property {string} [catatan]
 * @property {string} created_at
 */

/**
 * @typedef {Object} TindakLanjut
 * @property {string} id - UUID
 * @property {string} laporan_id
 * @property {string} petugas_id
 * @property {string} keterangan
 * @property {string} created_at
 */

/**
 * @typedef {Object} BuktiPenanganan
 * @property {string} id - UUID
 * @property {string} tindak_lanjut_id
 * @property {string} foto_url
 * @property {string} [deskripsi]
 * @property {string} created_at
 */

/**
 * @typedef {Object} StatusLog
 * @property {number} id
 * @property {string} laporan_id
 * @property {StatusLaporan | null} status_lama
 * @property {StatusLaporan} status_baru
 * @property {string} [diubah_oleh]
 * @property {string} [alasan]
 * @property {string} created_at
 */

export {};

