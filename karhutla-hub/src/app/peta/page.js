// File: src/app/peta/page.js
// Peta Geospasial Hotspot & Pelaporan Karhutla Terintegrasi (SiPongi KLHK Style)

import { ambilLaporanPublik, ambilLaporanSaya, ambilAntreanVerifikasi } from "@/queries/laporan";
import { ambilDaftarWilayah } from "@/queries/wilayah";
import { createClient } from "@/lib/supabase/server";
import PetaSipongiView from "@/components/map/PetaSipongiView";

export const metadata = {
  title: "Peta Hotspot & Pelaporan Karhutla | SIGAPI",
  description:
    "Portal peta geospasial sebaran titik api, verifikasi, dan pelaporan kebakaran hutan dan lahan berbasis GIS interaktif ala SiPongi KLHK.",
};

export default async function PetaHotspotPage() {
  const supabase = await createClient();

  // 1. Ambil Data Titik Hotspot & Wilayah dari Database Supabase
  const [laporanPublik, daftarWilayah] = await Promise.all([
    ambilLaporanPublik(),
    ambilDaftarWilayah(),
  ]);

  // 2. Cek Sesi & Profil Pengguna Aktif
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUser = null;
  let laporanSaya = [];
  let antreanVerifikasi = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, nama, nomor_hp, role")
      .eq("id", user.id)
      .single();

    if (profile) {
      currentUser = profile;

      if (profile.role === "pelapor") {
        laporanSaya = await ambilLaporanSaya();
      } else if (profile.role === "petugas" || profile.role === "admin") {
        antreanVerifikasi = await ambilAntreanVerifikasi();
      }
    }
  }

  // 3. Gabungkan laporan publik dengan antrean verifikasi untuk petugas/admin
  //    agar titik kuning (menunggu_verifikasi) juga tampil di peta mereka.
  //    Hindari duplikat berdasarkan ID.
  let laporanAwal = laporanPublik || [];
  if (antreanVerifikasi.length > 0) {
    const idPublik = new Set(laporanAwal.map((l) => l.id));
    const tambahanAntrean = antreanVerifikasi.filter((l) => !idPublik.has(l.id));
    laporanAwal = [...laporanAwal, ...tambahanAntrean];
  }

  return (
    <main className="w-full h-[calc(100vh-70px)] relative overflow-hidden bg-[#0d2a20]">
      <PetaSipongiView
        laporanAwal={laporanAwal}
        daftarWilayah={daftarWilayah || []}
        currentUser={currentUser}
        laporanSaya={laporanSaya || []}
        antreanVerifikasi={antreanVerifikasi || []}
      />
    </main>
  );
}
