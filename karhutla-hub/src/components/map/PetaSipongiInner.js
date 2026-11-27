"use client";

// File: src/components/map/PetaSipongiInner.js
// Peta Geospasial Karhutla Realistik — hanya Leaflet + marker.
// State basemap & radar dikelola di PetaSipongiView (parent) agar UI switcher
// tidak terkubur dalam stacking context isolate milik MapContainer.

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { STATUS_LAPORAN_LABEL } from "@/lib/constants/status";
import { formatTanggal, formatKoordinat } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BASEMAPS } from "./basemaps";

const WARNA_STATUS = {
  ditangani: { utama: "#dc2626", aksen: "#f97316", glow: "rgba(220, 38, 38, 0.6)" },
  terverifikasi: { utama: "#2563eb", aksen: "#38bdf8", glow: "rgba(37, 99, 235, 0.5)" },
  menunggu_verifikasi: { utama: "#d97706", aksen: "#fde047", glow: "rgba(217, 119, 6, 0.5)" },
  selesai: { utama: "#16a34a", aksen: "#86efac", glow: "rgba(22, 163, 74, 0.4)" },
  ditolak: { utama: "#64748b", aksen: "#cbd5e1", glow: "rgba(100, 116, 139, 0.3)" },
};

function buatIkonMarker(status, isSelected = false) {
  const conf = WARNA_STATUS[status] || WARNA_STATUS.ditangani;
  const isApiAktif = status === "ditangani";
  const size = isSelected ? 32 : 24;

  return L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        ${
          isApiAktif
            ? `<span style="position:absolute;width:220%;height:220%;border-radius:9999px;background:radial-gradient(circle,rgba(239,68,68,0.45) 0%,rgba(249,115,22,0.15) 55%,transparent 75%);animation:thermalWave 2s ease-out infinite;"></span>
               <span style="position:absolute;width:160%;height:160%;border-radius:9999px;border:2px solid ${conf.aksen};opacity:0.75;animation:thermalWave 2s ease-out 0.6s infinite;"></span>`
            : status === "terverifikasi"
            ? `<span style="position:absolute;width:180%;height:180%;border-radius:9999px;border:2px solid ${conf.aksen};opacity:0.6;animation:thermalWave 2.5s ease-out infinite;"></span>`
            : status === "menunggu_verifikasi"
            ? `<span style="position:absolute;width:160%;height:160%;border-radius:9999px;background-color:${conf.utama};opacity:0.25;animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></span>`
            : ""
        }
        <div style="position:relative;z-index:2;width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle at 35% 35%,${conf.aksen},${conf.utama});border:${isSelected ? "3px" : "2.5px"} solid #ffffff;box-shadow:0 0 14px ${conf.glow},0 4px 8px rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;transform:${isSelected ? "scale(1.2)" : "scale(1)"};transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);">
          ${
            isApiAktif
              ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 1px 1px rgba(0,0,0,0.5));"><path d="M12 23C7.58172 23 4 19.4183 4 15C4 11.6667 6 8.5 7.5 7C7.8 8.8 8.9 9.8 10 10.5C10.5 7.5 12.5 3 15.5 1C15.8 3.5 17 5.5 18 7.5C19.3 10.1 20 12.5 20 15C20 19.4183 16.4183 23 12 23Z"/></svg>`
              : status === "selesai"
              ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
              : `<span style="width:6px;height:6px;border-radius:9999px;background-color:#ffffff;"></span>`
          }
        </div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 6],
  });
}

const ikonPinInput = L.divIcon({
  className: "bg-transparent border-0",
  html: `
    <div style="position:relative;width:38px;height:38px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;width:100%;height:100%;border-radius:9999px;background-color:#ef4444;opacity:0.35;animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></span>
      <span style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9999px;background:radial-gradient(circle at 30% 30%,#f87171,#dc2626);border:3px solid #ffffff;box-shadow:0 0 16px rgba(239,68,68,0.7),0 4px 10px rgba(0,0,0,0.4);color:#ffffff;font-weight:bold;font-size:16px;">📍</span>
    </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 36],
});

function MapClickHandler({ pickMode, onSelectCoordinate }) {
  useMapEvents({
    click(e) {
      if (pickMode && onSelectCoordinate) {
        onSelectCoordinate(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapCenterController({ selectedKejadian, targetProvinsi }) {
  const map = useMap();

  useEffect(() => {
    if (selectedKejadian) {
      const lat = selectedKejadian.latitude || selectedKejadian.lat;
      const lng = selectedKejadian.longitude || selectedKejadian.lng;
      if (lat && lng) map.flyTo([lat, lng], 9, { duration: 1.2 });
    }
  }, [selectedKejadian, map]);

  useEffect(() => {
    if (targetProvinsi?.lat && targetProvinsi?.lng) {
      map.flyTo([targetProvinsi.lat, targetProvinsi.lng], targetProvinsi.zoom || 8, {
        duration: 1.4,
      });
    }
  }, [targetProvinsi, map]);

  return null;
}

export default function PetaSipongiInner({
  kejadian = [],
  selectedKejadian = null,
  onSelectKejadian,
  pickMode = false,
  pickedCoord = null,
  onSelectCoordinate,
  targetProvinsi = null,
  activeBasemap = "satelit",
  radarEffect = true,
}) {
  const basemap = BASEMAPS[activeBasemap] || BASEMAPS.satelit;

  return (
    <div className="relative w-full h-full">
      <style jsx global>{`
        @keyframes thermalWave {
          0%   { transform: scale(0.6); opacity: 0.95; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {radarEffect && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-20">
          <div
            className="w-full h-32 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent"
            style={{ animation: "scanline 8s linear infinite" }}
          />
        </div>
      )}

      <MapContainer
        center={[-1.5, 116.5]}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", background: basemap.background }}
      >
        <TileLayer
          key={activeBasemap}
          attribution={basemap.attrib}
          url={basemap.tile}
          maxZoom={19}
        />
        {basemap.labels && (
          <TileLayer
            key={`${activeBasemap}-labels`}
            url={basemap.labels}
            maxZoom={19}
            opacity={0.85}
          />
        )}

        <MapClickHandler pickMode={pickMode} onSelectCoordinate={onSelectCoordinate} />
        <MapCenterController selectedKejadian={selectedKejadian} targetProvinsi={targetProvinsi} />

        {pickedCoord && (
          <Marker position={[pickedCoord.lat, pickedCoord.lng]} icon={ikonPinInput}>
            <Popup>
              <div className="text-xs font-semibold p-1">
                📍 Titik Koordinat Terpilih:<br />
                {pickedCoord.lat.toFixed(5)}, {pickedCoord.lng.toFixed(5)}
              </div>
            </Popup>
          </Marker>
        )}

        {kejadian.map((item) => {
          const lat = item.latitude ?? item.lat;
          const lng = item.longitude ?? item.lng;
          if (lat === undefined || lng === undefined) return null;

          const isSelected = selectedKejadian?.id === item.id;
          const namaWilayah = item.wilayah?.nama_wilayah || item.wilayah || "Wilayah Indonesia";
          const labelStatus = STATUS_LAPORAN_LABEL[item.status] || item.status;
          const conf = WARNA_STATUS[item.status] || WARNA_STATUS.ditangani;

          return (
            <Marker
              key={item.id}
              position={[lat, lng]}
              icon={buatIkonMarker(item.status, isSelected)}
              eventHandlers={{ click: () => onSelectKejadian?.(item) }}
            >
              <Popup>
                <div className="p-1 min-w-[210px] text-slate-800">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
                    <span className="text-[10px] font-mono text-slate-500">
                      #{item.id.slice(0, 8)}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: conf.utama }}
                    >
                      {labelStatus}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#143e2f] m-0 mb-1">{namaWilayah}</h4>
                  <p className="text-xs text-slate-600 m-0 mb-2 line-clamp-2">{item.deskripsi}</p>
                  <div className="text-[11px] text-slate-500 space-y-0.5 mb-2.5">
                    <div>📍 Koordinat: {formatKoordinat(lat, lng)}</div>
                    <div>🕒 Waktu: {formatTanggal(item.waktu_kejadian || item.waktu)}</div>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectKejadian?.(item)}
                      className="text-xs font-semibold text-[#166534] hover:underline"
                    >
                      Buka Rincian
                    </button>
                    <Link
                      href={`/kejadian/${item.id}`}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                    >
                      <span>Halaman Lengkap</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
