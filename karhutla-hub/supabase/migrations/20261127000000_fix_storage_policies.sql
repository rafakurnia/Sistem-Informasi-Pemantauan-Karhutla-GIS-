-- Membuat bucket foto dan mengizinkan pengguna yang login mengunggah foto
-- ke folder milik user mereka sendiri.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'karhutla',
  'karhutla',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Karhutla public read" ON storage.objects;
CREATE POLICY "Karhutla public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'karhutla');

DROP POLICY IF EXISTS "Karhutla authenticated upload" ON storage.objects;
CREATE POLICY "Karhutla authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'karhutla'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Karhutla owner update" ON storage.objects;
CREATE POLICY "Karhutla owner update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'karhutla'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'karhutla'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Karhutla owner delete" ON storage.objects;
CREATE POLICY "Karhutla owner delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'karhutla'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy tabel yang dibutuhkan saat petugas menyimpan tindak lanjut.
DROP POLICY IF EXISTS "Petugas and Admin can insert tindak lanjut" ON public.tindak_lanjut;
CREATE POLICY "Petugas and Admin can insert tindak lanjut"
ON public.tindak_lanjut FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('petugas', 'admin')
  AND petugas_id = auth.uid()
);

DROP POLICY IF EXISTS "Petugas and Admin can insert bukti" ON public.bukti_penanganan;
CREATE POLICY "Petugas and Admin can insert bukti"
ON public.bukti_penanganan FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('petugas', 'admin')
);

DROP POLICY IF EXISTS "Petugas and Admin can insert status log" ON public.status_log;
CREATE POLICY "Petugas and Admin can insert status log"
ON public.status_log FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('petugas', 'admin')
  AND diubah_oleh = auth.uid()
);
