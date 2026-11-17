import {
  ClipboardList,
  CircleCheck,
  Clock3,
  Flame,
} from "lucide-react";
import AdminCharts from "../../../components/admin/AdminCharts";
import MetricCard from "../../../components/admin/MetricCard";
import DataTable from "../../../components/data-table/DataTable";
import { ambilRekapStatistik } from "@/queries/rekap";
import { ambilSemuaLaporanAdmin } from "@/queries/laporan";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal } from "@/lib/utils";

const reportColumns = [
  { key: "nomor", header: "Nomor laporan" },
  { key: "wilayah", header: "Wilayah" },
  { key: "pelapor", header: "Pelapor" },
  { key: "status", header: "Status" },
  { key: "waktu", header: "Waktu laporan" },
];

export default async function AdminPage() {
  const rekap = await ambilRekapStatistik();
  const { data: daftarLaporan } = await ambilSemuaLaporanAdmin({ limit: 10 });

  const statusData = [
    { label: "Menunggu Verifikasi", jumlah: rekap.perluVerifikasi, warna: "#d8a443" },
    { label: "Dalam Penanganan", jumlah: rekap.dalamPenanganan, warna: "#ef7045" },
    { label: "Selesai", jumlah: rekap.selesaiDitangani, warna: "#77ad72" },
    { label: "Ditolak", jumlah: rekap.ditolak, warna: "#9fbaaa" },
  ].filter((item) => item.jumlah > 0);

  const reportRows = (daftarLaporan || []).map((lap, idx) => ({
    id: lap.id,
    nomor: `#${lap.id.slice(0, 8)}`,
    wilayah: lap.wilayah?.nama_wilayah || "Tidak terdaftar",
    pelapor: lap.pelapor?.nama || "Masyarakat",
    status: STATUS_LAPORAN_LABEL[lap.status] || lap.status,
    waktu: formatTanggal(lap.waktu_kejadian || lap.created_at),
  }));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-[#64776f]">
            PUSAT PENGELOLAAN
          </p>
          <h1 className="m-0 text-2xl font-semibold text-[#18372e]">
            Ringkasan admin
          </h1>
          <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#64776f]">
            Pantau laporan, status verifikasi, dan penanganan kejadian karhutla di seluruh wilayah.
          </p>
        </div>
      </header>

      <section aria-label="Indikator laporan" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={`${rekap.totalSemua} total laporan masuk`}
          icon={Flame}
          label="Total kejadian valid"
          value={rekap.totalKejadian.toString()}
        />
        <MetricCard
          detail="Menunggu tindakan petugas"
          icon={Clock3}
          label="Perlu verifikasi"
          value={rekap.perluVerifikasi.toString()}
        />
        <MetricCard
          detail="Sedang proses pemadaman"
          icon={ClipboardList}
          label="Dalam penanganan"
          value={rekap.dalamPenanganan.toString()}
        />
        <MetricCard
          detail="Telah teratasi"
          icon={CircleCheck}
          label="Selesai ditangani"
          value={rekap.selesaiDitangani.toString()}
        />
      </section>

      <AdminCharts
        trendData={[]}
        statusData={statusData}
      />

      <section className="space-y-3" aria-labelledby="latest-reports-heading">
        <div>
          <h2 className="m-0 text-lg font-semibold text-[#18372e]" id="latest-reports-heading">
            Laporan terbaru
          </h2>
          <p className="mb-0 mt-1 text-sm text-[#64776f]">
            Daftar 10 laporan kejadian karhutla terbaru yang masuk ke sistem.
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
