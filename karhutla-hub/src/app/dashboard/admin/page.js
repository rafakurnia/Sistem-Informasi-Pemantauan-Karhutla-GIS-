import {
  ClipboardList,
  CircleCheck,
  Clock3,
  Flame,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import AdminCharts from "../../../components/admin/AdminCharts";
import MetricCard from "../../../components/admin/MetricCard";
import DataTable from "../../../components/data-table/DataTable";
import { ambilRekapStatistik, ambilDaftarPetugas } from "@/queries/rekap";
import { ambilSemuaLaporanAdmin } from "@/queries/laporan";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal } from "@/lib/utils";
import FormTambahWilayah from "./FormTambahWilayah";

const reportColumns = [
  { key: "nomor", header: "Nomor Laporan" },
  { key: "wilayah", header: "Wilayah" },
  { key: "pelapor", header: "Pelapor" },
  { key: "status", header: "Status" },
  { key: "waktu", header: "Waktu Laporan" },
];

const petugasColumns = [
  { key: "nama", header: "Nama Petugas" },
  { key: "nomor_hp", header: "No. HP" },
  { key: "sejak", header: "Terdaftar Sejak" },
];

// Badge warna per status
function statusBadge(status) {
  const map = {
    menunggu_verifikasi: "bg-amber-100 text-amber-800 border-amber-200",
    terverifikasi: "bg-sky-100 text-sky-800 border-sky-200",
    ditangani: "bg-orange-100 text-orange-800 border-orange-200",
    selesai: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ditolak: "bg-red-100 text-red-800 border-red-200",
  };
  return map[status] || "bg-gray-100 text-gray-700 border-gray-200";
}

export default async function AdminPage() {
  const [rekap, daftarPetugas, { data: daftarLaporan }] = await Promise.all([
    ambilRekapStatistik(),
    ambilDaftarPetugas(),
    ambilSemuaLaporanAdmin({ limit: 20 }),
  ]);

  const statusData = [
    { label: "Menunggu Verifikasi", jumlah: rekap.perluVerifikasi, warna: "#d8a443" },
    { label: "Dalam Penanganan", jumlah: rekap.dalamPenanganan, warna: "#ef7045" },
    { label: "Selesai", jumlah: rekap.selesaiDitangani, warna: "#77ad72" },
    { label: "Ditolak", jumlah: rekap.ditolak, warna: "#9fbaaa" },
  ].filter((item) => item.jumlah > 0);

  const reportRows = (daftarLaporan || []).map((lap) => ({
    id: lap.id,
    nomor: `#${lap.id.slice(0, 8).toUpperCase()}`,
    wilayah: lap.wilayah?.nama_wilayah || "Tidak terdaftar",
    pelapor: lap.pelapor?.nama || "Masyarakat",
    status: (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge(lap.status)}`}
      >
        {STATUS_LAPORAN_LABEL?.[lap.status] ?? lap.status}
      </span>
    ),
    waktu: formatTanggal(lap.waktu_kejadian || lap.created_at),
  }));

  const petugasRows = (daftarPetugas || []).map((p) => ({
    id: p.id,
    nama: p.nama || "—",
    nomor_hp: p.nomor_hp || "—",
    sejak: formatTanggal(p.created_at),
  }));

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#64776f]">
            Pusat Pengelolaan
          </p>
          <h1 className="m-0 text-2xl font-semibold text-[#18372e]">
            Ringkasan Admin
          </h1>
          <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#64776f]">
            Pantau laporan, status verifikasi, penanganan, dan rekap petugas di
            seluruh wilayah karhutla Indonesia.
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

      {/* ── 6 Metric Cards ── */}
      <section
        aria-label="Indikator sistem"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
      >
        <MetricCard
          detail={`${rekap.totalSemua} total laporan masuk`}
          icon={Flame}
          label="Total Kejadian Valid"
          value={rekap.totalKejadian.toString()}
        />
        <MetricCard
          detail="Menunggu tindakan petugas"
          icon={Clock3}
          label="Perlu Verifikasi"
          value={rekap.perluVerifikasi.toString()}
        />
        <MetricCard
          detail="Sedang proses pemadaman"
          icon={ClipboardList}
          label="Dalam Penanganan"
          value={rekap.dalamPenanganan.toString()}
        />
        <MetricCard
          detail="Telah teratasi sepenuhnya"
          icon={CircleCheck}
          label="Selesai Ditangani"
          value={rekap.selesaiDitangani.toString()}
        />
        <MetricCard
          detail="Petugas lapangan aktif"
          icon={Users}
          label="Jumlah Petugas"
          value={rekap.jumlahPetugas.toString()}
        />
        <MetricCard
          detail="Wilayah pemantauan terdaftar"
          icon={MapPin}
          label="Wilayah Terdaftar"
          value={rekap.jumlahWilayah.toString()}
        />
      </section>

      {/* ── Grafik Distribusi Status ── */}
      {statusData.length > 0 && (
        <AdminCharts trendData={[]} statusData={statusData} />
      )}

      {/* ── Daftar Petugas Aktif ── */}
      <section className="space-y-3" aria-labelledby="petugas-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              className="m-0 text-lg font-semibold text-[#18372e]"
              id="petugas-heading"
            >
              Daftar Petugas Aktif
            </h2>
            <p className="mb-0 mt-1 text-sm text-[#64776f]">
              {rekap.jumlahPetugas} petugas lapangan terdaftar di sistem.
            </p>
          </div>
        </div>
        {petugasRows.length > 0 ? (
          <DataTable
            columns={petugasColumns}
            emptyDescription="Belum ada petugas yang terdaftar."
            emptyTitle="Petugas belum tersedia"
            rows={petugasRows}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#c2d8c6] bg-[#f8fdf6] p-8 text-center text-sm text-[#64776f]">
            Belum ada petugas aktif.
          </div>
        )}
      </section>

      {/* ── Tambah Wilayah Baru ── */}
      <FormTambahWilayah />

      {/* ── Daftar Semua Laporan ── */}
      <section className="space-y-3" aria-labelledby="all-reports-heading">
        <div>
          <h2
            className="m-0 text-lg font-semibold text-[#18372e]"
            id="all-reports-heading"
          >
            Semua Laporan Kejadian
          </h2>
          <p className="mb-0 mt-1 text-sm text-[#64776f]">
            Menampilkan 20 laporan terbaru dari seluruh wilayah.
          </p>
        </div>
        <DataTable
          columns={reportColumns}
          emptyDescription="Belum ada data laporan untuk ditampilkan."
          emptyTitle="Laporan belum tersedia"
          rows={reportRows}
        />
      </section>
    </div>
  );
}
