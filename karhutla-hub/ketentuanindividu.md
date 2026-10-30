# AGENTS.md: Sistem Informasi Pemantauan Karhutla (GIS)

Panduan untuk AI coding agent (Claude Code, Cursor, Copilot, dan sejenisnya) dan untuk anggota tim. Baca seluruh file ini sebelum mengubah kode.

## 0. Aturan paling penting untuk agent

1. **Tanyakan dulu siapa penggunanya** (Rafa, Sabar, atau Yujin) bila belum jelas. Kepemilikan folder ada di bagian 4.
2. **Hanya ubah file milik penggunanya.** Bila tugas butuh perubahan di folder milik orang lain, berhenti, jelaskan perubahan yang dibutuhkan, dan minta pengguna menyampaikannya ke pemilik folder. Jangan edit sendiri.
3. **Jangan pernah** menaruh `SUPABASE_SERVICE_ROLE_KEY`, password database, atau kunci berprivilege di kode browser, repository, atau file `NEXT_PUBLIC_*`.
4. **Jangan** menyimpan data bisnis di array statis atau `localStorage`. Semua data ada di Supabase.
5. **Jangan** menyimpan berkas sebagai Base64 di tabel. Berkas masuk Supabase Storage, tabel hanya menyimpan path.
6. **Jangan** mengandalkan penyembunyian menu untuk keamanan. Hak akses wajib diperiksa di server dan di RLS.
7. Jangan mengubah skema database lewat dashboard Supabase. Semua perubahan lewat file migrasi di `supabase/migrations/`.
8. Jangan melakukan push langsung ke `main`.

## 1. Ringkasan proyek

Website pemantauan kebakaran hutan dan lahan berbasis peta. Pelapor mengirim laporan (koordinat, foto, deskripsi), petugas memverifikasi dan menangani, admin mengelola dan melihat rekap. Hanya laporan valid yang tampil di peta publik. Semua data adalah simulasi dan fiktif.

**Alur:** pelapor kirim laporan \u2192 petugas verifikasi \u2192 laporan valid tampil di peta publik \u2192 penanganan dicatat \u2192 selesai. Laporan `ditolak` tidak dihitung sebagai kejadian terverifikasi.

Dokumen kebutuhan lengkap ada di PRD tim. Bila PRD dan file ini berbeda, tanyakan ke Rafa (PM).

## 2. Stack

| Kebutuhan | Pilihan |
|---|---|
| Framework | Next.js (App Router) + javascritt |
| UI | Tailwind CSS + shadcn/ui |
| Peta | Leaflet + react-leaflet, tile OpenStreetMap |
| Database, Auth, Storage | Supabase (`@supabase/ssr`) |
| Form dan validasi | React Hook Form + Zod |
| Grafik | Recharts |
| Deploy | GitHub \u2192 Vercel |

Bahasa antarmuka: Bahasa Indonesia. Nama tabel dan kolom: `snake_case` bahasa Indonesia sesuai PRD. Nama variabel dan fungsi di kode: bahasa Inggris atau Indonesia, tetapi konsisten di dalam satu file.

## 3. Perintah umum

```bash
npm install
cp .env.example .env.local     # isi nilai dari Supabase
npm run dev                    # jalankan lokal
npm run lint
npm run build                  # wajib lolos sebelum membuka pull request
```

Variabel environment (nilai tidak boleh masuk repository):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # hanya dipakai di server, tanpa awalan NEXT_PUBLIC
```

## 4. Struktur folder dan pemilik

Pemilik = satu-satunya orang yang boleh mengubah folder tersebut. Orang lain boleh membaca dan memakainya.

.
├─ AGENTS.md                          Rafa
├─ README.md                          Yujin (isi), Rafa (setup teknis)
├─ .env.example                       Rafa
├─ supabase/
│  ├─ migrations/                     Rafa  (skema, RLS, trigger, kebijakan Storage)
│  └─ seed.sql                        Rafa  (data dummy dan akun uji)
├─ public/                            Yujin (logo, ikon, gambar statis)
└─ src/
   ├─ middleware.ts                   Rafa  (proteksi halaman dan role)
   ├─ types/                          Rafa  (tipe database dan tipe bersama)
   ├─ lib/
   │  ├─ supabase/                    Rafa  (client.ts, server.ts, admin.ts khusus server)
   │  ├─ validations/                 Rafa  (skema Zod, dipakai frontend dan server)
   │  ├─ constants/                   Rafa  (status, role, label)
   │  └─ utils/                       Yujin (format tanggal, angka, helper tampilan)
   ├─ queries/                        Rafa  (fungsi baca data dan rekap, berjalan di server)
   ├─ actions/                        Rafa  (server action: laporan, verifikasi, penugasan,
   │                                            tindak-lanjut, admin, upload)
   ├─ app/
   │  ├─ layout.tsx, globals.css      Yujin
   │  ├─ loading.tsx, error.tsx,
   │  │  not-found.tsx                Yujin
   │  ├─ page.tsx                     Sabar (peta publik)
   │  ├─ kejadian/[id]/               Sabar (detail kejadian publik)
   │  ├─ (auth)/login, register/      Sabar
   │  ├─ api/                         Rafa  (route handler bila diperlukan)
   │  └─ dashboard/
   │     ├─ layout.tsx                Yujin (kerangka dashboard: sidebar, header)
   │     ├─ pelapor/                  Sabar
   │     ├─ petugas/                  Sabar
   │     └─ admin/                    Yujin
   └─ components/
      ├─ ui/                          Yujin (shadcn dan komponen dasar)
      ├─ layout/                      Yujin (navbar, sidebar, footer)
      ├─ feedback/                    Yujin (loading, empty state, toast, konfirmasi)
      ├─ data-table/                  Yujin (tabel, pagination, kolom filter)
      ├─ admin/                       Yujin (komponen khusus halaman admin, grafik rekap)
      ├─ map/                         Sabar (peta, marker, legenda, filter, popup)
      ├─ laporan/                     Sabar (form laporan, kartu laporan, timeline status)
      └─ petugas/                     Sabar (form verifikasi, form tindak lanjut, unggah bukti)

### Ringkasan per orang

**Rafa (backend, PM, deploy):** `supabase/`, `src/middleware.ts`, `src/types/`, `src/lib/supabase/`, `src/lib/validations/`, `src/lib/constants/`, `src/queries/`, `src/actions/`, `src/app/api/`, konfigurasi Vercel, pengaturan repo dan branch protection.

**Sabar (frontend peta, pelapor, petugas):** `src/app/page.tsx`, `src/app/kejadian/`, `src/app/(auth)/`, `src/app/dashboard/pelapor/`, `src/app/dashboard/petugas/`, `src/components/map/`, `src/components/laporan/`, `src/components/petugas/`.

**Yujin (frontend admin dan UI):** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/dashboard/layout.tsx`, `src/app/dashboard/admin/`, `src/components/ui/`, `layout/`, `feedback/`, `data-table/`, `admin/`, `src/lib/utils/`, `public/`, `README.md`.

### Bila butuh file milik orang lain

- Butuh tabel, kolom, query, atau server action baru \u2192 minta Rafa. Sebutkan nama, input, dan bentuk hasil yang diharapkan.
- Butuh komponen UI umum baru atau perubahan tema \u2192 minta Yujin.
- Sementara menunggu, pakai data tiruan lokal di dalam file milik sendiri, dan beri komentar `// TODO: ganti dengan query asli`. Hapus sebelum merge.

## 5. Kontrak data dan alur

### Role
`pelapor`, `petugas`, `admin`. Pelapor mendaftar sendiri dan otomatis berperan `pelapor` (trigger membuat profil). Petugas dan admin dibuat atau dinaikkan role-nya hanya oleh admin lewat server action. Kolom `role` tidak boleh bisa diubah lewat form profil.

### Status laporan
`menunggu_verifikasi`, `terverifikasi`, `ditangani`, `selesai`, `ditolak`. Konstanta ada di `src/lib/constants/status.ts`. Jangan menulis string status langsung di komponen.

| Dari | Ke | Siapa | Syarat |
|---|---|---|---|
| (baru) | menunggu_verifikasi | Pelapor | Koordinat, wilayah, waktu, deskripsi, minimal 1 foto |
| menunggu_verifikasi | terverifikasi | Petugas | Bila belum ada penugasan, pemverifikasi otomatis menjadi petugas yang ditugaskan |
| menunggu_verifikasi | ditolak | Petugas | Alasan wajib |
| terverifikasi | ditangani | Petugas yang ditugaskan | Mengisi tindak lanjut pertama |
| ditangani | selesai | Petugas yang ditugaskan | Minimal 1 bukti penanganan |

Transisi lain ditolak oleh server dan trigger database. Setiap perubahan status ditulis ke `status_log`.

### Tabel utama
`profiles`, `wilayah`, `laporan`, `laporan_foto`, `penugasan`, `tindak_lanjut`, `bukti_penanganan`, `status_log`. Kolom lengkap ada di PRD dan di `supabase/migrations/`. File migrasi adalah sumber kebenaran, bukan dokumen.

### Bentuk hasil server action
Semua server action di `src/actions/` mengembalikan bentuk yang sama supaya frontend seragam:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
```

Frontend menampilkan `error` dalam bahasa Indonesia apa adanya dan memetakan `fieldErrors` ke kolom form.

### Aturan baca dan tulis
- **Tulis** (buat laporan, verifikasi, penugasan, tindak lanjut, unggah, kelola pengguna): hanya lewat `src/actions/`. Frontend tidak menulis langsung ke Supabase.
- **Baca**: komponen server memanggil fungsi di `src/queries/`. Komponen client yang butuh data memakai client Supabase dengan sesi pengguna, dan tetap dibatasi RLS.
- `src/lib/supabase/admin.ts` (service_role) hanya boleh di-import dari `src/actions/` dan `src/app/api/`. Jangan pernah di-import dari komponen.

## 6. Keamanan

- RLS aktif di semua tabel. Peta publik hanya boleh membaca laporan berstatus `terverifikasi`, `ditangani`, `selesai`.
- Pelapor hanya membaca dan membuat laporan miliknya (`pelapor_id = auth.uid()`).
- Petugas membaca antrean `menunggu_verifikasi` dan laporan yang ditugaskan kepadanya. Admin membaca semua.
- Data publik tidak boleh memuat nama atau nomor HP pelapor.
- Foto dan bukti bersifat privat sampai laporan terverifikasi, lalu dapat dibuka lewat signed URL yang dibuat di server.
- Validasi unggahan: jpg, png, webp, maksimal 5 MB, dicek di klien dan di server.
- Mengganti ID di URL tidak boleh membuka data orang lain. Uji ini sebelum merge fitur detail.

## 7. Aturan frontend

- Peta Leaflet dimuat dengan `dynamic(() => import(...), { ssr: false })`.
- Setiap halaman data punya 4 kondisi: memuat, kosong, berhasil, gagal.
- Tombol submit dinonaktifkan selama pengiriman untuk mencegah klik ganda.
- Daftar panjang memakai pagination. Pencarian dan filter berjalan di server (query), bukan menyaring array besar di browser.
- Semua halaman harus nyaman di lebar 360 px dan di desktop. Tabel lebar discroll di dalam kontainernya, bukan menggeser halaman.
- Gunakan komponen dari `components/ui/` dan `components/feedback/` milik Yujin. Jangan membuat tombol, kartu, atau toast sendiri yang berbeda gaya.

## 8. Alur Git

- `main` dilindungi dan selalu bisa di-deploy. Vercel membuat preview untuk setiap pull request.
- Nama branch: `rafa/<fitur>`, `sabar/<fitur>`, `yujin/<fitur>`. Contoh: `sabar/peta-publik`.
- Satu pull request = satu fitur kecil. Jelaskan apa yang berubah dan cara mengujinya.
- Review silang: Rafa mereview Sabar, Sabar mereview Yujin, Yujin mereview Rafa. Rafa melakukan merge ke `main`.
- Pesan commit: `fitur: ...`, `perbaikan: ...`, `ui: ...`, `db: ...`.
- Sebelum membuka pull request: `npm run lint` dan `npm run build` lolos, tidak ada kredensial di diff.

## 9. Definisi selesai untuk satu fitur

- [ ] Berjalan di preview Vercel, bukan hanya di lokal.
- [ ] Data tersimpan di Supabase dan tetap ada setelah refresh, logout-login, dan perangkat lain.
- [ ] Sudah dicoba dengan akun tiap role yang relevan, termasuk akses yang seharusnya ditolak.
- [ ] Input tidak valid ditolak dengan pesan jelas.
- [ ] Tampilan memuat, kosong, berhasil, dan gagal tersedia.
- [ ] Nyaman di ponsel.
- [ ] Tidak ada kredensial atau Base64 berkas di kode atau database.

## 10. Data dummy dan akun uji

Dikelola Rafa di `supabase/seed.sql`. Minimal 5 baris per tabel utama, laporan mencakup kelima status, dan foto contoh berada di Storage (tabel hanya menyimpan path). Akun uji: 1 admin, 2 petugas, 2 pelapor, semua fiktif. Daftar email dan password uji ditulis di `README.md` oleh Yujin setelah seed final dari Rafa.

## 11. Urutan kerja yang disarankan

1. **Hari 1\u20133:** Rafa menyiapkan repo, Supabase, Vercel, skema, dan `types/`. Yujin menyiapkan tema dan komponen dasar. Sabar menyiapkan halaman auth dan kerangka peta dengan data tiruan.
2. **Setelah skema final:** Sabar dan Yujin mengganti data tiruan dengan `queries/` dan `actions/` dari Rafa.
3. **Sepanjang proyek:** deploy ke Vercel setiap merge, jangan menunda sampai akhir.
