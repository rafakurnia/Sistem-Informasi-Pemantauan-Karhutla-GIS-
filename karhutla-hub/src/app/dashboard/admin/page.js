import {
  ClipboardList,
  CircleCheck,
  Clock3,
  Flame,
} from "lucide-react";
import AdminCharts from "../../../components/admin/AdminCharts";
import MetricCard from "../../../components/admin/MetricCard";
import DataTable from "../../../components/data-table/DataTable";

const reportColumns = [
  { key: "nomor", header: "Nomor laporan" },
  { key: "wilayah", header: "Wilayah" },
  { key: "status", header: "Status" },
  { key: "waktu", header: "Waktu laporan" },
];

export default function AdminPage() {
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
            Pantau laporan, status verifikasi, dan penanganan kejadian.
          </p>
        </div>
      </header>

      <section aria-label="Indikator laporan" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail="Menunggu data rekap" icon={Flame} label="Total kejadian" value="—" />
        <MetricCard detail="Menunggu data rekap" icon={Clock3} label="Perlu verifikasi" value="—" />
        <MetricCard detail="Menunggu data rekap" icon={ClipboardList} label="Dalam penanganan" value="—" />
        <MetricCard detail="Menunggu data rekap" icon={CircleCheck} label="Selesai ditangani" value="—" />
      </section>

      <AdminCharts trendData={[]} statusData={[]} />

      <section className="space-y-3" aria-labelledby="latest-reports-heading">
        <div>
          <h2 className="m-0 text-lg font-semibold text-[#18372e]" id="latest-reports-heading">
            Laporan terbaru
          </h2>
          <p className="mb-0 mt-1 text-sm text-[#64776f]">
            Daftar laporan akan muncul setelah sumber data tersedia.
          </p>
        </div>
        <DataTable
          columns={reportColumns}
          emptyDescription="Belum ada data laporan untuk ditampilkan."
          emptyTitle="Laporan belum tersedia"
          rows={[]}
        />
      </section>
    </div>
  );
}