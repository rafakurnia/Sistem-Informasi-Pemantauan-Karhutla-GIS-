// File: src/components/map/basemaps.js
// Konfigurasi layer peta — dipakai di PetaSipongiView (switcher UI)
// dan PetaSipongiInner (TileLayer). Dipisah agar Inner bisa di-dynamic-import
// tanpa menarik static import yang memicu SSR.

export const BASEMAPS = {
  satelit: {
    nama: "Satelit Asli",
    tile: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labels:
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attrib: "Tiles © Esri — Citra Satelit Resolusi Tinggi",
    background: "#0b1510",
  },
  topo: {
    nama: "Topografi & Hutan",
    tile: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attrib: "Tiles © Esri — Topografi & Kontur Vegetasi",
    background: "#dbe5dc",
  },
  dark: {
    nama: "Dark Command",
    tile: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attrib: "© CartoDB © OpenStreetMap — Mode Komando Malam",
    background: "#0e1310",
  },
  street: {
    nama: "Peta Terang",
    tile: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attrib: "© CartoDB © OpenStreetMap",
    background: "#e4ece6",
  },
};
