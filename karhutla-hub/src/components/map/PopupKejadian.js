import Link from "next/link";
import { KONFIGURASI_STATUS } from "./data-tiruan";

function formatWaktu(waktu) {
  if (!waktu) {
    return "Waktu tidak tersedia";
  }

  const tanggal = new Date(waktu);
  if (Number.isNaN(tanggal.getTime())) {
    return waktu;
  }

  return tanggal.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function PopupKejadian({ kejadian }) {
  const konfigurasiStatus = KONFIGURASI_STATUS[kejadian.status];

  return (
    <article className="w-56 space-y-2 text-sm text-slate-700">
      <h2 className="font-semibold text-slate-900">{kejadian.wilayah}</h2>
      <p className="font-medium text-slate-800">
        Status: {konfigurasiStatus?.label ?? kejadian.status}
      </p>
      <p className="text-xs text-slate-600">{formatWaktu(kejadian.waktu)}</p>
      <p className="leading-relaxed">
        {kejadian.deskripsi || "Ringkasan kejadian belum tersedia."}
      </p>
      <Link
        className="inline-flex min-h-11 items-center font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        href={`/kejadian/${encodeURIComponent(kejadian.id)}`}
      >
        Lihat detail kejadian
      </Link>
    </article>
  );
}
