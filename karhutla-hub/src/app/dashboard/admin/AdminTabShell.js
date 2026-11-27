"use client";

// File: src/app/dashboard/admin/AdminTabShell.js
// Client wrapper — mengelola tab aktif agar page.js tetap Server Component.

import { useState } from "react";
import {
  BarChart3, ClipboardList, Users, MapPin,
} from "lucide-react";
import AdminCharts from "@/components/admin/AdminCharts";
import MetricCard from "@/components/admin/MetricCard";
import ManajemenPengguna from "./ManajemenPengguna";
import ManajemenLaporan from "./ManajemenLaporan";
import FormTambahWilayah from "./FormTambahWilayah";
import {
  Flame, Clock3, ClipboardList as Clip2, CircleCheck, Users as Users2, MapPin as MapPin2,
} from "lucide-react";

const TABS = [
  { id: "statistik", label: "Statistik",  icon: BarChart3 },
  { id: "laporan",   label: "Laporan",    icon: ClipboardList },
  { id: "pengguna",  label: "Pengguna",   icon: Users },
  { id: "wilayah",   label: "Wilayah",    icon: MapPin },
];

export default function AdminTabShell({ rekap, statusData, pengguna, laporan }) {
  const [tab, setTab] = useState("statistik");

  return (
    <>
      {/* ── Tab bar ── */}
      <nav className="flex gap-1 bg-[#f0f4f1] p-1 rounded-2xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? "bg-[#173f30] text-white shadow-sm"
                  : "text-[#40574d] hover:bg-white/70"
              }`}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Konten per tab ── */}
      <div className="mt-6">

        {/* TAB: STATISTIK */}
        {tab === "statistik" && (
          <div className="space-y-6">
            {/* Metric cards */}
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                icon={Flame}
                label="Total Kejadian Valid"
                value={rekap.totalKejadian.toString()}
                detail={`${rekap.totalSemua} total laporan masuk`}
              />
              <MetricCard
                icon={Clock3}
                label="Perlu Verifikasi"
                value={rekap.perluVerifikasi.toString()}
                detail="Menunggu tindakan petugas"
              />
              <MetricCard
                icon={Clip2}
                label="Dalam Penanganan"
                value={rekap.dalamPenanganan.toString()}
                detail="Sedang proses pemadaman"
              />
              <MetricCard
                icon={CircleCheck}
                label="Selesai Ditangani"
                value={rekap.selesaiDitangani.toString()}
                detail="Telah teratasi sepenuhnya"
              />
              <MetricCard
                icon={Users2}
                label="Jumlah Petugas"
                value={rekap.jumlahPetugas.toString()}
                detail="Petugas lapangan aktif"
              />
              <MetricCard
                icon={MapPin2}
                label="Wilayah Terdaftar"
                value={rekap.jumlahWilayah.toString()}
                detail="Wilayah pemantauan terdaftar"
              />
            </section>

            {/* Grafik distribusi status */}
            {statusData.length > 0 ? (
              <AdminCharts trendData={[]} statusData={statusData} />
            ) : (
              <div className="rounded-2xl border border-dashed border-[#c8ddd5] bg-white p-10 text-center text-sm text-[#64776f]">
                Belum ada data laporan untuk grafik.
              </div>
            )}

            {/* Ringkasan per status dalam tabel kecil */}
            <div className="rounded-2xl border border-[#e0ebe2] bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-[#e8eee8]">
                <h3 className="text-sm font-bold text-[#18372e] m-0">Ringkasan Status Laporan</h3>
              </div>
              <div className="divide-y divide-[#e8eee8]">
                {[
                  { label: "Menunggu Verifikasi", nilai: rekap.perluVerifikasi,  warna: "bg-amber-500" },
                  { label: "Terverifikasi",        nilai: Math.max(0, rekap.totalKejadian - rekap.dalamPenanganan - rekap.selesaiDitangani), warna: "bg-sky-500" },
                  { label: "Sedang Ditangani",     nilai: rekap.dalamPenanganan,  warna: "bg-orange-500" },
                  { label: "Selesai",              nilai: rekap.selesaiDitangani, warna: "bg-emerald-500" },
                  { label: "Ditolak",              nilai: rekap.ditolak,          warna: "bg-red-400" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="flex items-center gap-2 text-[#40574d]">
                      <span className={`size-2.5 rounded-full ${row.warna}`} />
                      {row.label}
                    </span>
                    <span className="font-bold text-[#18372e]">{row.nilai}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: LAPORAN */}
        {tab === "laporan" && (
          <ManajemenLaporan laporan={laporan} />
        )}

        {/* TAB: PENGGUNA */}
        {tab === "pengguna" && (
          <ManajemenPengguna pengguna={pengguna} />
        )}

        {/* TAB: WILAYAH */}
        {tab === "wilayah" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#18372e] m-0">Manajemen Wilayah</h2>
              <p className="text-sm text-[#64776f] mt-0.5">
                {rekap.jumlahWilayah} wilayah pemantauan aktif. Tambahkan wilayah baru di bawah.
              </p>
            </div>
            <FormTambahWilayah />
          </div>
        )}

      </div>
    </>
  );
}
