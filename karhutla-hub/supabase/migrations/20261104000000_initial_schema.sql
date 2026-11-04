-- ========================================================
-- SKEMA DATABASE: SISTEM INFORMASI PEMANTAUAN KARHUTLA (GIS)
-- Pemilik: Rafa (Backend & PM)
-- ========================================================

-- 1. ENUM TYPE
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('pelapor', 'petugas', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_laporan AS ENUM ('menunggu_verifikasi', 'terverifikasi', 'ditangani', 'selesai', 'ditolak');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABEL PROFILES (Terhubung dengan Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  nomor_hp VARCHAR(30),
  role user_role NOT NULL DEFAULT 'pelapor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger otomatis saat user mendaftar di auth.users -> buat profil pelapor
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, nomor_hp, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nama', 'Pengguna Baru'),
    new.raw_user_meta_data->>'nomor_hp',
    'pelapor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. TABEL WILAYAH (Master data area rawan kebakaran)
CREATE TABLE IF NOT EXISTS public.wilayah (
  id BIGSERIAL PRIMARY KEY,
  nama_wilayah VARCHAR(255) NOT NULL,
  kode_wilayah VARCHAR(50),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  deskripsi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABEL LAPORAN (Kejadian Karhutla)
CREATE TABLE IF NOT EXISTS public.laporan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pelapor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  wilayah_id BIGINT REFERENCES public.wilayah(id) ON DELETE RESTRICT,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  waktu_kejadian TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  deskripsi TEXT NOT NULL,
  status status_laporan NOT NULL DEFAULT 'menunggu_verifikasi',
  catatan_petugas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABEL LAPORAN_FOTO
CREATE TABLE IF NOT EXISTS public.laporan_foto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laporan_id UUID REFERENCES public.laporan(id) ON DELETE CASCADE NOT NULL,
  foto_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABEL PENUGASAN (Petugas yang menangani laporan)
CREATE TABLE IF NOT EXISTS public.penugasan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laporan_id UUID REFERENCES public.laporan(id) ON DELETE CASCADE NOT NULL,
  petugas_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  ditugaskan_oleh UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  catatan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TABEL TINDAK_LANJUT (Catatan progres penanganan lapangan)
CREATE TABLE IF NOT EXISTS public.tindak_lanjut (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laporan_id UUID REFERENCES public.laporan(id) ON DELETE CASCADE NOT NULL,
  petugas_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  keterangan TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TABEL BUKTI_PENANGANAN (Foto bukti pemadaman)
CREATE TABLE IF NOT EXISTS public.bukti_penanganan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tindak_lanjut_id UUID REFERENCES public.tindak_lanjut(id) ON DELETE CASCADE NOT NULL,
  foto_url TEXT NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TABEL STATUS_LOG (Audit log transisi status laporan)
CREATE TABLE IF NOT EXISTS public.status_log (
  id BIGSERIAL PRIMARY KEY,
  laporan_id UUID REFERENCES public.laporan(id) ON DELETE CASCADE NOT NULL,
  status_lama status_laporan,
  status_baru status_laporan NOT NULL,
  diubah_oleh UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  alasan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wilayah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penugasan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tindak_lanjut ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bukti_penanganan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_log ENABLE ROW LEVEL SECURITY;

-- Helper Function: Dapatkan Role User Saat Ini
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Profiles: Semua user login bisa melihat profil dasar, tapi hanya bisa edit profil milik sendiri
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. Wilayah: Publik bisa membaca data wilayah
CREATE POLICY "Wilayah viewable by all" ON public.wilayah
  FOR SELECT TO public USING (true);

-- 3. Laporan:
-- Peta publik hanya membaca status valid (terverifikasi, ditangani, selesai)
CREATE POLICY "Publik viewable verified reports" ON public.laporan
  FOR SELECT TO public
  USING (status IN ('terverifikasi', 'ditangani', 'selesai'));

-- Pelapor bisa melihat laporan miliknya sendiri (termasuk yang menunggu & ditolak)
CREATE POLICY "Pelapor can view own reports" ON public.laporan
  FOR SELECT TO authenticated
  USING (pelapor_id = auth.uid());

-- Petugas dan Admin bisa melihat semua laporan
CREATE POLICY "Petugas and Admin can view all reports" ON public.laporan
  FOR SELECT TO authenticated
  USING (public.current_user_role() IN ('petugas', 'admin'));

-- Pelapor bisa membuat laporan baru
CREATE POLICY "Authenticated users can insert reports" ON public.laporan
  FOR INSERT TO authenticated
  WITH CHECK (pelapor_id = auth.uid());

-- Petugas dan Admin bisa update laporan
CREATE POLICY "Petugas and Admin can update reports" ON public.laporan
  FOR UPDATE TO authenticated
  USING (public.current_user_role() IN ('petugas', 'admin'));

-- 4. Laporan Foto: Terbaca jika laporannya terbaca
CREATE POLICY "Fotos viewable if report viewable" ON public.laporan_foto
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can insert fotos" ON public.laporan_foto
  FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Penugasan, Tindak Lanjut, Bukti, Status Log
CREATE POLICY "Penugasan viewable by authenticated" ON public.penugasan
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Tindak lanjut viewable by authenticated" ON public.tindak_lanjut
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Bukti viewable by all" ON public.bukti_penanganan
  FOR SELECT TO public USING (true);

CREATE POLICY "Status log viewable by authenticated" ON public.status_log
  FOR SELECT TO authenticated USING (true);

