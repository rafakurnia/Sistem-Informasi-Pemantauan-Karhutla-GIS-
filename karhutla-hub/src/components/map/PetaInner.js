"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import MarkerKejadian from "./MarkerKejadian";
import "leaflet/dist/leaflet.css";

export default function PetaInner({ kejadian = [] }) {
  return (
    <div className="h-[55vh] min-h-[320px] max-h-[640px] w-full overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        aria-label="Peta lokasi kejadian kebakaran hutan dan lahan di Indonesia"
        center={[-2.5, 118]}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoom={5}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {kejadian.map((item) => (
          <MarkerKejadian key={item.id} kejadian={item} />
        ))}
      </MapContainer>
    </div>
  );
}
