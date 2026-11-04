import { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { KONFIGURASI_STATUS } from "./data-tiruan";
import PopupKejadian from "./PopupKejadian";

export default function MarkerKejadian({ kejadian }) {
  const konfigurasiStatus = KONFIGURASI_STATUS[kejadian.status];
  const warna = konfigurasiStatus?.warna ?? "#64748b";
  const labelStatus = konfigurasiStatus?.label ?? "Status kejadian";
  const ikon = useMemo(
    () =>
      L.divIcon({
        className: "bg-transparent border-0",
        html: `<span aria-hidden="true" style="display:block;width:20px;height:20px;border:3px solid #fff;border-radius:9999px;background-color:${warna};box-shadow:0 1px 5px rgba(15,23,42,.55)"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      }),
    [warna],
  );

  return (
    <Marker
      position={[kejadian.lat, kejadian.lng]}
      icon={ikon}
      title={`${kejadian.wilayah} — ${labelStatus}`}
    >
      <Popup>
        <PopupKejadian kejadian={kejadian} />
      </Popup>
    </Marker>
  );
}
