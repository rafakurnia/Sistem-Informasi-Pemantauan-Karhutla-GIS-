"use client";

// File: src/components/map/PetaSipongiView.js
// Peta Komprehensif Karhutla Full-Screen ala SiPongi KLHK

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Flame,
  Filter,
  Layers,
  X,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  User,
  Satellite,
  Mountain,
  Moon,
  Map as MapIcon,
  Radio,
} from "lucide-react";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal, formatKoordinat } from "@/lib/utils";
import { buatLaporanAction } from "@/actions/laporan";
import { uploadFotoAction } from "@/actions/upload";
import { BASEMAPS } from "./basemaps";

const PetaLeaflet = dynamic(() => import("./PetaSipongiInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#173f30]/5 text-[#173f30] gap-3">
      <div className="w-10 h-10 border-4 border-[#173f30] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-semibold tracking-wide">
        Menyiapkan Peta Geospasial Karhutla SIGAPI...
      </p>
    </div>
  ),
});

export default function PetaSipongiView({
  laporanAwal = [],
  daftarWilayah = [],
  currentUser = null,
  laporanSaya = [],
  antreanVerifikasi = [],
}) {
  // State Filter
  const [filterStatus, setFilterStatus] = useState("");
  const [filterWaktu, setFilterWaktu] = useState("semua"); // "semua", "24jam", "7hari", "30hari"
  const [filterProvinsi, setFilterProvinsi] = useState(""); // filter berdasarkan provinsi Indonesia

  // State Peta & Interaksi
  const [selectedKejadian, setSelectedKejadian] = useState(null);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [activePanel, setActivePanel] = useState(null); // null, "form-laporan", "status-saya"

  // State Basemap & Radar — dikelola di sini agar UI switcher bisa dirender
  // di luar MapContainer dan tidak terkubur stacking context-nya Leaflet.
  const [activeBasemap, setActiveBasemap] = useState("satelit");
  const [radarEffect, setRadarEffect] = useState(true);

  // State provinsi yang di-fly-to
  const [targetProvinsi, setTargetProvinsi] = useState(null);

  // Handler ganti provinsi (dari data Supabase)
  function handleFilterProvinsi(e) {
    const wilayahId = e.target.value;
    setFilterProvinsi(wilayahId);
    if (wilayahId) {
      const w = daftarWilayah.find((item) => String(item.id) === String(wilayahId));
      if (w && w.latitude && w.longitude) {
        setTargetProvinsi({
          lat: Number(w.latitude),
          lng: Number(w.longitude),
          zoom: 8,
          nama: w.nama_wilayah,
        });
      }
    } else {
      setTargetProvinsi(null);
    }
  }

  // State Form Laporan
  const [formPickMode, setFormPickMode] = useState(false);
  const [pickedCoord, setPickedCoord] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // State Laporan Lokal (untuk optimistic update)
  // Gabungkan laporan publik dengan laporan milik user sendiri (termasuk menunggu_verifikasi)
  // agar pin laporan sendiri tetap muncul di peta meski belum terverifikasi.
  const [laporanList, setLaporanList] = useState(() => {
    if (!laporanSaya || laporanSaya.length === 0) return laporanAwal;
    // Hindari duplikat: laporan publik sudah mencakup yang terverifikasi/ditangani/selesai,
    // tambahkan hanya laporan milik user yang belum ada di daftar publik.
    const idPublik = new Set(laporanAwal.map((l) => l.id));
    const tambahanSaya = laporanSaya.filter((l) => !idPublik.has(l.id));
    return [...laporanAwal, ...tambahanSaya];
  });

  // State terpisah untuk panel "Laporan Saya" agar sinkron setelah optimistic update
  const [laporanSayaList, setLaporanSayaList] = useState(laporanSaya);

  // Filter Data Kejadian
  const kejadianTersaring = useMemo(() => {
    return laporanList.filter((item) => {
      // 1. Filter Provinsi/Wilayah dari Database Supabase
      if (filterProvinsi) {
        const idWilayah = item.wilayah?.id ?? item.wilayah_id;
        if (String(idWilayah) !== String(filterProvinsi)) {
          return false;
        }
      }

      // 2. Filter Status
      if (filterStatus && item.status !== filterStatus) {
        return false;
      }

      // 3. Filter Waktu
      if (filterWaktu !== "semua") {
        const waktuItem = new Date(
          item.waktu_kejadian || item.created_at || item.waktu
        ).getTime();
        const now = Date.now();
        const diffMs = now - waktuItem;
        if (filterWaktu === "24jam" && diffMs > 24 * 60 * 60 * 1000) return false;
        if (filterWaktu === "7hari" && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
        if (filterWaktu === "30hari" && diffMs > 30 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    });
  }, [laporanList, filterProvinsi, filterStatus, filterWaktu]);

  // Ringkasan Jumlah
  const ringkasan = useMemo(() => {
    return {
      total: kejadianTersaring.length,
      ditangani: kejadianTersaring.filter((k) => k.status === "ditangani").length,
      terverifikasi: kejadianTersaring.filter((k) => k.status === "terverifikasi").length,
      menunggu: kejadianTersaring.filter((k) => k.status === "menunggu_verifikasi").length,
      selesai: kejadianTersaring.filter((k) => k.status === "selesai").length,
    };
  }, [kejadianTersaring]);

  // Handler klik peta untuk ambil koordinat
  function handleSelectCoordinate(lat, lng) {
    setPickedCoord({ lat, lng });
    const latInput = document.getElementById("peta-form-lat");
    const lngInput = document.getElementById("peta-form-lng");
    if (latInput && lngInput) {
      latInput.value = lat.toFixed(5);
      lngInput.value = lng.toFixed(5);
    }
  }

  // Handler submit form laporan
  async function handleSubmitLaporan(e) {
    e.preventDefault();
    if (!currentUser) {
      alert("Anda harus login terlebih dahulu untuk mengirimkan laporan.");
      return;
    }

    setFormLoading(true);
    setFormError("");

    const form = new FormData(e.target);
    const lat = parseFloat(form.get("latitude"));
    const lng = parseFloat(form.get("longitude"));
    const wilayahId = form.get("wilayah_id");
    const waktu = form.get("waktu_kejadian");
    const alamat = form.get("alamat")?.trim();
    const deskripsiInput = form.get("deskripsi")?.trim();
    const deskripsi = alamat
      ? `[Alamat: ${alamat}] ${deskripsiInput}`
      : deskripsiInput;

    // Upload foto jika dipilih oleh pelapor
    const fotoPaths = [];
    const fotoFile = form.get("foto");
    if (fotoFile && fotoFile.size > 0) {
      const uploadData = new FormData();
      uploadData.append("file", fotoFile);
      const uploadRes = await uploadFotoAction(uploadData);
      if (uploadRes.ok && uploadRes.data?.path) {
        fotoPaths.push(uploadRes.data.url || uploadRes.data.path);
      }
    }

    const res = await buatLaporanAction({
      wilayah_id: wilayahId,
      latitude: lat,
      longitude: lng,
      waktu_kejadian: new Date(waktu).toISOString(),
      deskripsi,
      foto_paths: fotoPaths,
    });

    setFormLoading(false);

    if (!res.ok) {
      setFormError(res.error || "Gagal membuat laporan.");
      return;
    }

    // Tambah optimis ke peta & laporan saya
    const targetWilayah = daftarWilayah.find((w) => String(w.id) === String(wilayahId));
    const newIncident = {
      id: res.data?.id || `lap-${Date.now()}`,
      latitude: lat,
      longitude: lng,
      waktu_kejadian: new Date(waktu).toISOString(),
      deskripsi,
      status: "menunggu_verifikasi",
      wilayah: targetWilayah,
      fotos: fotoPaths.map((p, idx) => ({ id: `foto-${idx}`, foto_url: p })),
    };

    setLaporanList((prev) => [newIncident, ...prev]);
    setLaporanSayaList((prev) => [newIncident, ...prev]);
    setSelectedKejadian(newIncident);
    setFormSuccess(true);
    setFormPickMode(false);
    setTimeout(() => {
      setFormSuccess(false);
      setActivePanel(null);
    }, 2000);
  }

  // Handler pilih wilayah di form (auto set koordinat)
  function handleWilayahChangeForm(e) {
    const val = e.target.value;
    const w = daftarWilayah.find((item) => String(item.id) === String(val));
    if (w) {
      handleSelectCoordinate(Number(w.latitude), Number(w.longitude));
    }
  }

  return (
    <div className="relative w-full h-[calc(100vh-70px)] bg-[#0d2a20] select-none">
      {/* 1. Leaflet Interactive Map — absolute stretch ke seluruh container */}
      <div className="absolute inset-0 z-0">
        <PetaLeaflet
          kejadian={kejadianTersaring}
          selectedKejadian={selectedKejadian}
          onSelectKejadian={(item) => {
            setSelectedKejadian(item);
            setActivePanel(null);
          }}
          pickMode={formPickMode}
          pickedCoord={pickedCoord}
          onSelectCoordinate={handleSelectCoordinate}
          targetProvinsi={targetProvinsi}
          activeBasemap={activeBasemap}
          radarEffect={radarEffect}
        />
      </div>

      {/* 2. BASEMAP SWITCHER — pojok kanan bawah, di atas Leaflet */}
      <div className="absolute bottom-6 right-4 z-[200] pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-1 flex-wrap">
          {Object.entries(BASEMAPS).map(([key, item]) => {
            const isActive = activeBasemap === key;
            // Pilih ikon sesuai key
            const Icon =
              key === "satelit" ? Satellite
              : key === "topo"   ? Mountain
              : key === "dark"   ? Moon
              : MapIcon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveBasemap(key)}
                title={item.attrib}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#173f30] text-white shadow-md shadow-emerald-950/20"
                    : "text-slate-700 hover:bg-slate-100/80"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-[#8ecf91]" : "text-slate-500"}`} />
                <span className="hidden sm:inline">{item.nama}</span>
              </button>
            );
          })}

          <div className="h-5 w-px bg-slate-200 mx-0.5" />

          <button
            type="button"
            onClick={() => setRadarEffect((v) => !v)}
            title="Efek Pemindai Sensor Satelit Real-time"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              radarEffect
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Radio className={`size-3.5 ${radarEffect ? "text-emerald-600 animate-pulse" : "text-slate-400"}`} />
            <span className="text-[11px] font-bold hidden md:inline">
              Radar {radarEffect ? "ON" : "OFF"}
            </span>
          </button>
        </div>
      </div>

      {/* 3. TOP BAR OVERLAY: Filter, Ringkasan Hotspot, & Action Controls */}
      <div className="absolute top-4 inset-x-4 z-[200] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pointer-events-none">
        {/* Filter Controls (Card Glassmorphism) */}
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/40 flex flex-wrap items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#143e2f] pr-2 border-r border-slate-200">
            <Filter className="size-3.5 text-[#166534]" />
            <span>FILTER</span>
          </div>

          {/* Filter Provinsi Indonesia (Langsung dari Database Supabase) */}
          <div className="relative">
            <select
              value={filterProvinsi}
              onChange={handleFilterProvinsi}
              className="text-xs bg-[#f4f7f5] hover:bg-[#ebf2ed] text-[#143e2f] font-medium py-1.5 px-3 rounded-lg border border-[#c8ddd5] outline-none cursor-pointer transition max-w-[170px]"
            >
              <option value="">Semua Provinsi</option>
              {daftarWilayah.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.nama_wilayah}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-[#f4f7f5] hover:bg-[#ebf2ed] text-[#143e2f] font-medium py-1.5 px-3 rounded-lg border border-[#c8ddd5] outline-none cursor-pointer transition"
            >
              <option value="">Semua Status</option>
              <option value="ditangani">Sedang Ditangani</option>
              <option value="terverifikasi">Terverifikasi</option>
              <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          {/* Filter Waktu */}
          <div className="relative">
            <select
              value={filterWaktu}
              onChange={(e) => setFilterWaktu(e.target.value)}
              className="text-xs bg-[#f4f7f5] hover:bg-[#ebf2ed] text-[#143e2f] font-medium py-1.5 px-3 rounded-lg border border-[#c8ddd5] outline-none cursor-pointer transition"
            >
              <option value="semua">Semua Waktu</option>
              <option value="24jam">24 Jam Terakhir</option>
              <option value="7hari">7 Hari Terakhir</option>
              <option value="30hari">30 Hari Terakhir</option>
            </select>
          </div>

          {(filterProvinsi || filterStatus || filterWaktu !== "semua") && (
            <button
              onClick={() => {
                setFilterProvinsi("");
                setFilterStatus("");
                setFilterWaktu("semua");
                setTargetProvinsi(null);
              }}
              className="text-[11px] text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Ringkasan Jumlah & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Counter Badges (SiPongi Style) */}
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-white/40 flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1 text-[#143e2f] pr-2 border-r border-slate-200">
              <Flame className="size-3.5 text-orange-500 fill-orange-500" />
              <span>{ringkasan.total} Titik</span>
            </span>
            <span className="flex items-center gap-1 text-red-600" title="Sedang Ditangani">
              <span className="size-2 rounded-full bg-red-600"></span>
              {ringkasan.ditangani}
            </span>
            <span className="flex items-center gap-1 text-blue-600" title="Terverifikasi">
              <span className="size-2 rounded-full bg-blue-600"></span>
              {ringkasan.terverifikasi}
            </span>
            <span className="flex items-center gap-1 text-amber-600" title="Menunggu Verifikasi">
              <span className="size-2 rounded-full bg-amber-500"></span>
              {ringkasan.menunggu}
            </span>
            <span className="flex items-center gap-1 text-emerald-600" title="Selesai">
              <span className="size-2 rounded-full bg-emerald-600"></span>
              {ringkasan.selesai}
            </span>
          </div>

          {/* Tombol Buat Laporan */}
          <button
            onClick={() => {
              setActivePanel(activePanel === "form-laporan" ? null : "form-laporan");
              setSelectedKejadian(null);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white text-xs font-bold shadow-lg shadow-red-900/25 transition active:scale-95"
          >
            <Plus className="size-4" />
            <span>+ Laporkan Karhutla</span>
          </button>

          {/* Tombol Panel Peran / Akun Saya */}
          {currentUser ? (
            <button
              onClick={() => {
                setActivePanel(activePanel === "status-saya" ? null : "status-saya");
                setSelectedKejadian(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#173f30] hover:bg-[#103024] text-white text-xs font-bold shadow-lg shadow-black/20 transition active:scale-95"
            >
              <User className="size-3.5 text-[#8ecf91]" />
              <span>
                {currentUser.role === "pelapor"
                  ? `Laporan Saya (${laporanSayaList.length})`
                  : currentUser.role === "petugas"
                  ? `Antrean Tugas (${antreanVerifikasi.length})`
                  : "Panel Admin"}
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#173f30] hover:bg-[#103024] text-white text-xs font-bold shadow-lg shadow-black/20 transition"
            >
              <User className="size-3.5 text-[#8ecf91]" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4. FLOATING LEGENDA STATUS (Pojok Kiri Bawah) */}
      <div className="absolute bottom-6 left-4 z-[200]">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-3.5 min-w-[210px] text-xs transition">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <span className="font-bold text-[#143e2f] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Layers className="size-3.5 text-[#166534]" />
              Legenda Hotspot
            </span>
            <button
              onClick={() => setIsLegendOpen(!isLegendOpen)}
              className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold"
            >
              {isLegendOpen ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>

          {isLegendOpen && (
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#dc2626] border-2 border-white shadow-sm shrink-0"></span>
                <span className="font-medium">Sedang Ditangani (Api Aktif)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#2563eb] border-2 border-white shadow-sm shrink-0"></span>
                <span className="font-medium">Terverifikasi Valid</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#d97706] border-2 border-white shadow-sm shrink-0"></span>
                <span className="font-medium">Menunggu Verifikasi</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#16a34a] border-2 border-white shadow-sm shrink-0"></span>
                <span className="font-medium">Pemadaman Selesai</span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* 5. DETAIL KEJADIAN FLOATING CARD (Pojok Kanan Bawah/Samping) */}
      {selectedKejadian && (
        <div className="absolute right-4 top-24 bottom-20 w-full max-w-sm z-[200] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#173f30] to-[#143628] text-white p-4 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-emerald-300">
                ID: #{selectedKejadian.id.slice(0, 8)}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {selectedKejadian.wilayah?.nama_wilayah ||
                  selectedKejadian.wilayah ||
                  "Kejadian Karhutla"}
              </h3>
            </div>
            <button
              onClick={() => setSelectedKejadian(null)}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Konten Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700">
            {/* Status Badge & Koordinat */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-medium text-slate-500">Status Kejadian:</span>
              <span
                className={`px-2.5 py-1 rounded-full font-bold text-white text-[10px] ${
                  selectedKejadian.status === "ditangani"
                    ? "bg-[#dc2626]"
                    : selectedKejadian.status === "terverifikasi"
                    ? "bg-[#2563eb]"
                    : selectedKejadian.status === "menunggu_verifikasi"
                    ? "bg-[#d97706]"
                    : "bg-[#16a34a]"
                }`}
              >
                {STATUS_LAPORAN_LABEL[selectedKejadian.status] ||
                  selectedKejadian.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 block">Koordinat Lat</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedKejadian.latitude || selectedKejadian.lat}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Koordinat Lng</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedKejadian.longitude || selectedKejadian.lng}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">
                Waktu Deteksi / Laporan
              </span>
              <div className="font-medium text-slate-800 flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" />
                <span>
                  {formatTanggal(
                    selectedKejadian.waktu_kejadian ||
                      selectedKejadian.created_at ||
                      selectedKejadian.waktu
                  )}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">
                Kondisi Lapangan
              </span>
              <p className="bg-[#f8faf8] border border-[#e8eee8] p-3 rounded-xl text-slate-700 leading-relaxed m-0">
                {selectedKejadian.deskripsi}
              </p>
            </div>

            {selectedKejadian.catatan_petugas && (
              <div className="bg-[#fff9f0] border border-[#fed7aa] p-3 rounded-xl">
                <span className="font-bold text-[#9a3412] block mb-1">
                  Catatan Petugas Lapangan:
                </span>
                <p className="text-[#9a3412] m-0 leading-relaxed">
                  {selectedKejadian.catatan_petugas}
                </p>
              </div>
            )}
          </div>

          {/* Footer Card */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
            <Link
              href={`/kejadian/${selectedKejadian.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173f30] hover:bg-[#103024] text-white font-bold text-xs shadow transition"
            >
              <span>Buka Detail Lengkap</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 6. FORM BUAT LAPORAN MENGAMBANG (Drawer SiPongi) */}
      {activePanel === "form-laporan" && (
        <div className="absolute left-4 top-24 bottom-6 w-full max-w-md z-[300] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200">
          {/* Header Drawer */}
          <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="size-5" />
              <h3 className="text-base font-bold text-white m-0">
                Formulir Laporan Karhutla
              </h3>
            </div>
            <button
              onClick={() => setActivePanel(null)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-700">
            {formSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">
                  Laporan Berhasil Terkirim!
                </h4>
                <p className="text-xs text-slate-500">
                  Titik laporan Anda telah ditambahkan ke peta dengan status{" "}
                  <span className="font-bold text-amber-600">Menunggu Verifikasi</span>.
                </p>
              </div>
            ) : !currentUser ? (
              <div className="p-6 text-center space-y-4">
                <ShieldAlert className="size-12 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  Login Diperlukan
                </h4>
                <p className="text-xs text-slate-500">
                  Untuk menjaga validitas laporan dan menghindari laporan fiktif,
                  silakan masuk terlebih dahulu dengan akun pelapor.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl bg-[#173f30] text-white font-bold text-xs"
                  >
                    Masuk Sekarang
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Daftar Baru
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitLaporan} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Provinsi / Wilayah Kejadian
                  </label>
                  <select
                    name="wilayah_id"
                    required
                    onChange={handleWilayahChangeForm}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#166534]"
                  >
                    <option value="">-- Pilih Provinsi / Wilayah --</option>
                    {daftarWilayah.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nama_wilayah} ({w.kode_wilayah})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tombol Ambil Titik di Peta */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Koordinat Lokasi Api
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormPickMode(!formPickMode)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                        formPickMode
                          ? "bg-red-600 text-white animate-pulse"
                          : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      }`}
                    >
                      {formPickMode ? "📍 Klik lokasi di peta..." : "👆 Pilih Titik di Peta"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        id="peta-form-lat"
                        name="latitude"
                        type="number"
                        step="any"
                        required
                        placeholder="Latitude (cth: 0.812)"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <input
                        id="peta-form-lng"
                        name="longitude"
                        type="number"
                        step="any"
                        required
                        placeholder="Longitude (cth: 102.062)"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Waktu Kejadian Terlihat
                  </label>
                  <input
                    name="waktu_kejadian"
                    type="datetime-local"
                    required
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Alamat / Patokan Lokasi
                  </label>
                  <input
                    name="alamat"
                    type="text"
                    placeholder="Contoh: Desa Rimba Panjang, KM 18 pinggir jalan poros"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-[#166534]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Deskripsi Situasi Lapangan
                  </label>
                  <textarea
                    name="deskripsi"
                    rows={3}
                    required
                    placeholder="Sebutkan perkiraan luas kebakaran, vegetasi (gambut/semak), dan akses jalan pemadam..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#166534]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Foto Bukti Kejadian <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    name="foto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePanel(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition disabled:opacity-60"
                  >
                    {formLoading ? "Mengirim Laporan…" : "Kirim Laporan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. STATUS LAPORAN / PANEL ROLE PENGGUNA MENGAMBANG */}
      {activePanel === "status-saya" && currentUser && (
        <div className="absolute right-4 top-24 bottom-20 w-full max-w-sm z-[300] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="bg-[#173f30] text-white p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8ecf91] block">
                Ruang Kerja ({currentUser.role.toUpperCase()})
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5 m-0">
                {currentUser.nama}
              </h3>
            </div>
            <button
              onClick={() => setActivePanel(null)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs text-slate-700">
            {currentUser.role === "pelapor" && (
              <>
                <h4 className="font-bold text-slate-800 text-xs mb-2">
                  Riwayat Laporan Saya ({laporanSayaList.length}):
                </h4>
                {laporanSayaList.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">
                    Anda belum memiliki riwayat laporan. Gunakan tombol &quot;+ Laporkan Karhutla&quot; untuk mengirimkan laporan.
                  </p>
                ) : (
                  laporanSayaList.map((lap) => (
                    <div
                      key={lap.id}
                      onClick={() => {
                        setSelectedKejadian(lap);
                        setActivePanel(null);
                      }}
                      className="p-3 bg-slate-50 hover:bg-[#eef5f1] border border-slate-200 rounded-xl cursor-pointer transition space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-slate-400">
                          #{lap.id.slice(0, 8)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                          {STATUS_LAPORAN_LABEL[lap.status] || lap.status}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 line-clamp-1">
                        {lap.wilayah?.nama_wilayah}
                      </p>
                      <p className="text-slate-500 text-[11px] line-clamp-2">
                        {lap.deskripsi}
                      </p>
                    </div>
                  ))
                )}
              </>
            )}

            {currentUser.role === "petugas" && (
              <>
                <h4 className="font-bold text-slate-800 text-xs mb-2">
                  Antrean Verifikasi Lapangan ({antreanVerifikasi.length}):
                </h4>
                {antreanVerifikasi.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">
                    Semua laporan telah diverifikasi!
                  </p>
                ) : (
                  antreanVerifikasi.map((lap) => (
                    <div
                      key={lap.id}
                      className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#b45309]">
                          {lap.wilayah?.nama_wilayah}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{lap.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {lap.deskripsi}
                      </p>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedKejadian(lap);
                            setActivePanel(null);
                          }}
                          className="text-[11px] font-semibold text-blue-600 underline"
                        >
                          Lihat di Peta
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {currentUser.role === "admin" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Anda memiliki akses penuh untuk memantau, memverifikasi, dan mengelola seluruh penugasan pemadaman karhutla.
                </p>
                <Link
                  href="/dashboard/admin"
                  className="block w-full py-2.5 px-4 bg-[#173f30] text-white text-center rounded-xl font-bold hover:bg-[#103024] transition"
                >
                  Buka Dashboard Pengelolaan Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
