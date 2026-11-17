import { Suspense } from "react";
import PetaPublikKonten from "@/components/map/PetaPublikKonten";

export default function PetaHotspotPage({ searchParams }) {
  return (
    <main className="map-home flex-1">
      <div className="map-home-content">
        <header className="map-page-heading">
          <div>
            <p className="map-page-kicker">
              Pemantauan kebakaran hutan dan lahan
            </p>
            <h1>Peta Hotspot Karhutla</h1>
            <p>
              Lihat sebaran kejadian karhutla di Indonesia. Gunakan filter untuk
              menelusuri kejadian berdasarkan status atau wilayah.
            </p>
          </div>
        </header>

        <Suspense
          fallback={
            <div
              aria-live="polite"
              className="map-loading-state"
              role="status"
            >
              Menyiapkan data peta...
            </div>
          }
        >
          <PetaPublikKonten searchParams={searchParams} />
        </Suspense>

        <p className="map-data-note">
          Tampilan ini menggunakan data contoh sementara. Data kejadian akan
          dihubungkan ke sumber data aplikasi setelah query tersedia.
        </p>
      </div>
    </main>
  );
}
