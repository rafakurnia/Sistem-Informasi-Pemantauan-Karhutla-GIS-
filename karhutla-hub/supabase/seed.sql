-- ========================================================
-- SEED DATA: SISTEM INFORMASI PEMANTAUAN KARHUTLA (GIS)
-- Pemilik: Rafa (Backend & PM)
-- Minimal 5 baris per tabel utama, kelima status terpenuhi,
-- dan 5 akun simulasi uji (1 Admin, 2 Petugas, 2 Pelapor).
-- ========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. AKUN UJI (auth.users & public.profiles)
-- Password seragam untuk kemudahan pengujian: "Password123!"
DO $$
DECLARE
  pwd_hash TEXT := crypt('Password123!', gen_salt('bf'));
  uid_admin UUID := 'a0000000-0000-0000-0000-000000000001';
  uid_petugas1 UUID := 'b0000000-0000-0000-0000-000000000001';
  uid_petugas2 UUID := 'b0000000-0000-0000-0000-000000000002';
  uid_pelapor1 UUID := 'c0000000-0000-0000-0000-000000000001';
  uid_pelapor2 UUID := 'c0000000-0000-0000-0000-000000000002';
BEGIN
  -- 1a. auth.users
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES
    (uid_admin, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@sigapi.id', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"nama":"Rafa Admin Pusat"}', now(), now()),
    (uid_petugas1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'petugas1@sigapi.id', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"nama":"Budi Santoso (Manggala Agni)"}', now(), now()),
    (uid_petugas2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'petugas2@sigapi.id', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"nama":"Siti Rahma (BPBD)"}', now(), now()),
    (uid_pelapor1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pelapor1@sigapi.id', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"nama":"Ahmad Fauzi","nomor_hp":"081234567890"}', now(), now()),
    (uid_pelapor2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pelapor2@sigapi.id', pwd_hash, now(), '{"provider":"email","providers":["email"]}', '{"nama":"Dewi Lestari","nomor_hp":"085678901234"}', now(), now())
  ON CONFLICT (id) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email = EXCLUDED.email;

  -- 1b. public.profiles
  INSERT INTO public.profiles (id, nama, nomor_hp, role) VALUES
    (uid_admin, 'Rafa Admin Pusat', '08111000100', 'admin'),
    (uid_petugas1, 'Budi Santoso (Manggala Agni)', '08122000200', 'petugas'),
    (uid_petugas2, 'Siti Rahma (BPBD)', '08133000300', 'petugas'),
    (uid_pelapor1, 'Ahmad Fauzi', '081234567890', 'pelapor'),
    (uid_pelapor2, 'Dewi Lestari', '085678901234', 'pelapor')
  ON CONFLICT (id) DO UPDATE
  SET nama = EXCLUDED.nama,
      role = EXCLUDED.role,
      nomor_hp = EXCLUDED.nomor_hp;
END $$;

-- 2. TABEL WILAYAH (Master Data 5 Area Rawan Karhutla)
INSERT INTO public.wilayah (id, nama_wilayah, kode_wilayah, latitude, longitude, deskripsi) VALUES
(1, 'Riau - Kab. Siak', 'ID-RI-SIAK', 0.7970, 102.0460, 'Area gambut rawan terbakar di Kab. Siak, Riau'),
(2, 'Kalimantan Tengah - Kotawaringin Timur', 'ID-KT-KOTIM', -2.5333, 112.9500, 'Kawasan semak belukar & gambut Kotim'),
(3, 'Sumatera Selatan - Ogan Komering Ilir', 'ID-SS-OKI', -3.3769, 105.0247, 'Lahan gambut pesisir OKI'),
(4, 'Kalimantan Barat - Kubu Raya', 'ID-KB-KUBU', -0.3200, 109.3300, 'Kawasan rawa gambut dekat Pontianak'),
(5, 'Jambi - Muaro Jambi', 'ID-JA-MUARO', -1.5400, 103.6200, 'Area penyangga hutan Muaro Jambi')
ON CONFLICT (id) DO UPDATE 
SET nama_wilayah = EXCLUDED.nama_wilayah,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude;

-- 3. TABEL LAPORAN (Mencakup 5 Status: menunggu_verifikasi, terverifikasi, ditangani, selesai, ditolak)
INSERT INTO public.laporan (id, pelapor_id, wilayah_id, latitude, longitude, waktu_kejadian, deskripsi, status, catatan_petugas) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 1, 0.8120, 102.0620, now() - interval '2 hours', 'Kepulan asap tebal terdeteksi di lahan gambut samping perkebunan kelapa sawit.', 'menunggu_verifikasi', NULL),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 2, -2.5410, 112.9320, now() - interval '5 hours', 'Terlihat kobaran api merambat di semak belukar kering pinggir jalan poros.', 'terverifikasi', 'Laporan valid, citra satelit mendeteksi hotspot confidence 85%.'),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 3, -3.3850, 105.0410, now() - interval '1 day', 'Kebakaran lahan gambut seluas kurang lebih 2 hektar dengan asap pekat.', 'ditangani', 'Regu 1 Manggala Agni sudah di lokasi melakukan sekat bakar dan pemadaman.'),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 4, -0.3150, 109.3420, now() - interval '2 days', 'Titik api kecil di lahan kosong dekat pemukiman warga.', 'selesai', 'Api berhasil dipadamkan total dan telah dilakukan pendinginan area.'),
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 5, -1.5320, 103.6120, now() - interval '3 days', 'Asap terlihat membumbung tinggi dari kejauhan.', 'ditolak', 'Bukan kebakaran hutan/lahan, melainkan pembakaran sampah terkendali warga.')
ON CONFLICT (id) DO UPDATE
SET deskripsi = EXCLUDED.deskripsi,
    status = EXCLUDED.status,
    catatan_petugas = EXCLUDED.catatan_petugas;

-- 4. TABEL LAPORAN_FOTO (Minimal 5 Baris Foto Bukti Awal)
INSERT INTO public.laporan_foto (id, laporan_id, foto_url) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'laporan/siak-asap-01.jpg'),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'laporan/kotim-api-01.jpg'),
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'laporan/oki-gambut-01.jpg'),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'laporan/kubu-padam-01.jpg'),
('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', 'laporan/muaro-sampah-01.jpg')
ON CONFLICT (id) DO UPDATE SET foto_url = EXCLUDED.foto_url;

-- 5. TABEL PENUGASAN (Minimal 5 Baris Penugasan Tim Lapangan)
INSERT INTO public.penugasan (id, laporan_id, petugas_id, ditugaskan_oleh, catatan) VALUES
('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Lakukan verifikasi visual lapangan dan persiapan unit pompa portabel.'),
('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Koordinasikan dengan BPBD setempat untuk pasokan air tangki.'),
('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Bantuan regu cadangan pemadaman gambut OKI.'),
('f0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Pemadaman cepat karhutla Kubu Raya dekat pemukiman.'),
('f0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Pemeriksaan laporan fiktif Muaro Jambi.')
ON CONFLICT (id) DO UPDATE SET catatan = EXCLUDED.catatan;

-- 6. TABEL TINDAK_LANJUT (Minimal 5 Baris Catatan Progres)
INSERT INTO public.tindak_lanjut (id, laporan_id, petugas_id, keterangan) VALUES
('10000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Tim tiba di lokasi Kotim, melakukan pemasangan selang air 300 meter.'),
('10000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Pemadaman kepala api berhasil, melanjutkan pembasahan bara bawah tanah gambut.'),
('10000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Pembuatan parit isolasi/sekat bakar sepanjang 500 meter untuk mencegah api meluas.'),
('10000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Pemadaman tuntas dalam waktu 45 menit menggunakan 1 unit mobil tangki BPBD.'),
('10000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Tahap mop-up / pendinginan tanah gambut sedalam 30 cm, suhu permukaan normal.')
ON CONFLICT (id) DO UPDATE SET keterangan = EXCLUDED.keterangan;

-- 7. TABEL BUKTI_PENANGANAN (Minimal 5 Baris Foto Hasil Pemadaman)
INSERT INTO public.bukti_penanganan (id, tindak_lanjut_id, foto_url, deskripsi) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'bukti/kotim-selang-01.jpg', 'Gelar selang dan pompa apung di parit terdekat.'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'bukti/oki-pembasahan-01.jpg', 'Penyemprotan intensif bara gambut bawah tanah.'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'bukti/oki-sekat-bakar-01.jpg', 'Sekat bakar pembatas perimeter api.'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'bukti/kubu-padam-total-01.jpg', 'Kondisi vegetasi padam total dan aman.'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'bukti/kubu-cek-suhu-01.jpg', 'Pemeriksaan thermal camera tanah gambut.')
ON CONFLICT (id) DO UPDATE SET foto_url = EXCLUDED.foto_url;

-- 8. TABEL STATUS_LOG (Minimal 5 Baris Audit Trail Status Laporan)
INSERT INTO public.status_log (id, laporan_id, status_lama, status_baru, diubah_oleh, alasan) VALUES
(1, 'd0000000-0000-0000-0000-000000000001', NULL, 'menunggu_verifikasi', 'c0000000-0000-0000-0000-000000000001', 'Laporan pertama kali dikirimkan oleh warga Siak.'),
(2, 'd0000000-0000-0000-0000-000000000002', 'menunggu_verifikasi', 'terverifikasi', 'b0000000-0000-0000-0000-000000000001', 'Laporan diverifikasi valid berdasarkan citra satelit dan visual darat.'),
(3, 'd0000000-0000-0000-0000-000000000003', 'terverifikasi', 'ditangani', 'b0000000-0000-0000-0000-000000000001', 'Armada pemadam Manggala Agni tiba di lokasi kebakaran OKI.'),
(4, 'd0000000-0000-0000-0000-000000000004', 'ditangani', 'selesai', 'b0000000-0000-0000-0000-000000000002', 'Seluruh bara dan kepulan asap telah padam sempurna.'),
(5, 'd0000000-0000-0000-0000-000000000005', 'menunggu_verifikasi', 'ditolak', 'b0000000-0000-0000-0000-000000000001', 'Laporan fiktif / bukan karhutla setelah dicek ke lokasi.')
ON CONFLICT (id) DO UPDATE SET alasan = EXCLUDED.alasan;
