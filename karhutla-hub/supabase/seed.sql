-- ========================================================
-- SEED DATA: SISTEM INFORMASI PEMANTAUAN KARHUTLA (GIS)
-- Pemilik: Rafa
-- ========================================================

-- 1. Data Wilayah (Area Rawan Karhutla Indonesia)
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

