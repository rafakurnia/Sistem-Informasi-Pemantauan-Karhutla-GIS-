// File: src/app/dashboard/admin/page.js
// Dashboard Admin — Server Component: fetch semua data, render ke AdminTabShell.

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { ambilRekapStatistik } from "@/queries/rekap";
import { ambilSemuaPengguna, ambilSemuaLaporanLengkap } from "@/queries/rekap";
import AdminTabShell from "./AdminTabShell";

export const metadata = {
  title: "Dashboard Admin | SIGAPI",
};

export default async function AdminPage() {
  // Fetch semua data secara paralel
  const [rekap, pengguna, laporan] = await Promise.all([
    ambilRekapStatistik(),
    ambilSemuaPengguna(),
    ambilSemuaLaporanLengkap(),
  ]);

  // Siapkan data grafik pie chart
  const statusData = [
    { label: "Menunggu Verifikasi", jumlah: rekap.perluVerifikasi,  warna: "#d8a443" },
    { label: "Dalam Penanganan",    jumlah: rekap.dalamPenanganan,  warna: "#ef7045" },
    { label: "Selesai",             jumlah: rekap.selesaiDitangani, warna: "#77ad72" },
    { label: "Ditolak",             jumlah: rekap.ditolak,          warna: "#9fbaaa" },
  ].filter((d) => d.jumlah > 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#64776f]">
            Pusat Pengelolaan
          </p>
          <h1 className="m-0 text-2xl font-semibold text-[#18372e]">
            Dashboard Admin
          </h1>
          <p className="mb-0 mt-1.5 max-w-2xl text-sm leading-6 text-[#64776f]">
            Kelola akun pengguna, monitor seluruh laporan karhutla, lihat statistik,
            dan atur wilayah pemantauan.
          </p>
        </div>
        <Link
          href="/peta"
          className="inline-flex items-center gap-2 rounded-xl bg-[#173f30] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e5540] transition-colors"
        >
          <MapPin className="size-4" />
          Lihat Peta
          <ArrowRight className="size-4" />
        </Link>
      </header>

      {/* ── Tab shell (client component) ── */}
      <AdminTabShell
        rekap={rekap}
        statusData={statusData}
        pengguna={pengguna}
        laporan={laporan}
      />
    </div>
  );
}
