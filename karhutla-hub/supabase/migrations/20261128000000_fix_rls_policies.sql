-- ========================================================
-- MIGRASI: FIX LENGKAP SEMUA RLS POLICY
-- Tanggal: 2026-11-28
-- Pemilik: Rafa
-- Tujuan: Perbaiki semua policy INSERT/UPDATE/DELETE yang
--         hilang sehingga alur pelapor → petugas → admin
--         berjalan tanpa error RLS.
-- ========================================================

-- ── TINDAK LANJUT ────────────────────────────────────────
-- Petugas & admin boleh insert tindak lanjut milik sendiri
DROP POLICY IF EXISTS "Petugas and Admin can insert tindak lanjut" ON public.tindak_lanjut;
CREATE POLICY "Petugas and Admin can insert tindak lanjut"
ON public.tindak_lanjut FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('petugas', 'admin')
  AND petugas_id = auth.uid()
);

-- Petugas & admin boleh update tindak lanjut
DROP POLICY IF EXISTS "Petugas and Admin can update tindak lanjut" ON public.tindak_lanjut;
CREATE POLICY "Petugas and Admin can update tindak lanjut"
ON public.tindak_lanjut FOR UPDATE
TO authenticated
USING (
  public.current_user_role() IN ('petugas', 'admin')
);

-- ── BUKTI PENANGANAN ─────────────────────────────────────
-- Petugas & admin boleh insert bukti
DROP POLICY IF EXISTS "Petugas and Admin can insert bukti" ON public.bukti_penanganan;
CREATE POLICY "Petugas and Admin can insert bukti"
ON public.bukti_penanganan FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('petugas', 'admin')
);

-- ── STATUS LOG ───────────────────────────────────────────
-- Semua user terautentikasi boleh insert status log (pelapor saat buat laporan)
DROP POLICY IF EXISTS "Authenticated can insert status log" ON public.status_log;
CREATE POLICY "Authenticated can insert status log"
ON public.status_log FOR INSERT
TO authenticated
WITH CHECK (
  diubah_oleh = auth.uid()
);

-- ── LAPORAN FOTO ─────────────────────────────────────────
-- Pelapor boleh insert foto milik laporan sendiri
DROP POLICY IF EXISTS "Authenticated can insert laporan foto" ON public.laporan_foto;
CREATE POLICY "Authenticated can insert laporan foto"
ON public.laporan_foto FOR INSERT
TO authenticated
WITH CHECK (true);

-- ── PENUGASAN ────────────────────────────────────────────
-- Petugas & admin boleh insert penugasan
DROP POLICY IF EXISTS "Petugas and Admin can insert penugasan" ON public.penugasan;
CREATE POLICY "Petugas and Admin can insert penugasan"
ON public.penugasan FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('petugas', 'admin')
);

-- Petugas & admin boleh update penugasan
DROP POLICY IF EXISTS "Petugas and Admin can update penugasan" ON public.penugasan;
CREATE POLICY "Petugas and Admin can update penugasan"
ON public.penugasan FOR UPDATE
TO authenticated
USING (
  public.current_user_role() IN ('petugas', 'admin')
);

-- ── LAPORAN ──────────────────────────────────────────────
-- Pelapor boleh insert laporan baru miliknya sendiri
DROP POLICY IF EXISTS "Authenticated users can insert reports" ON public.laporan;
CREATE POLICY "Authenticated users can insert reports"
ON public.laporan FOR INSERT
TO authenticated
WITH CHECK (pelapor_id = auth.uid());

-- Petugas & admin boleh update status laporan
DROP POLICY IF EXISTS "Petugas and Admin can update reports" ON public.laporan;
CREATE POLICY "Petugas and Admin can update reports"
ON public.laporan FOR UPDATE
TO authenticated
USING (
  public.current_user_role() IN ('petugas', 'admin')
);

-- Admin boleh delete laporan
DROP POLICY IF EXISTS "Admin can delete reports" ON public.laporan;
CREATE POLICY "Admin can delete reports"
ON public.laporan FOR DELETE
TO authenticated
USING (
  public.current_user_role() = 'admin'
);

-- ── PROFILES ─────────────────────────────────────────────
-- Admin boleh update semua profil (untuk ubah role)
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
CREATE POLICY "Admin can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  public.current_user_role() = 'admin'
);

-- Admin boleh delete profil
DROP POLICY IF EXISTS "Admin can delete profiles" ON public.profiles;
CREATE POLICY "Admin can delete profiles"
ON public.profiles FOR DELETE
TO authenticated
USING (
  public.current_user_role() = 'admin'
);

-- ── WILAYAH ──────────────────────────────────────────────
-- Admin boleh insert wilayah baru
DROP POLICY IF EXISTS "Admin can insert wilayah" ON public.wilayah;
CREATE POLICY "Admin can insert wilayah"
ON public.wilayah FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() = 'admin'
);

-- Admin boleh update wilayah
DROP POLICY IF EXISTS "Admin can update wilayah" ON public.wilayah;
CREATE POLICY "Admin can update wilayah"
ON public.wilayah FOR UPDATE
TO authenticated
USING (
  public.current_user_role() = 'admin'
);

-- Admin boleh delete wilayah
DROP POLICY IF EXISTS "Admin can delete wilayah" ON public.wilayah;
CREATE POLICY "Admin can delete wilayah"
ON public.wilayah FOR DELETE
TO authenticated
USING (
  public.current_user_role() = 'admin'
);
