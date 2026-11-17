import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  ClipboardPlus,
  MapPinned,
  Radio,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const layanan = [
  {
    title: "Peta Hotspot",
    description:
      "Lihat sebaran kejadian karhutla dan telusuri berdasarkan status maupun wilayah.",
    href: "/peta",
    label: "Buka peta hotspot",
    icon: MapPinned,
    image: "/landing-peta-hotspot.jpg",
  },
  {
    title: "Pelaporan Kejadian",
    description:
      "Sampaikan laporan kebakaran hutan dan lahan melalui formulir pelaporan SIGAPI.",
    href: "/dashboard/pelapor",
    label: "Buat laporan",
    icon: ClipboardPlus,
    image: "/landing-pelaporan.jpg",
  },
  {
    title: "Status Penanganan",
    description:
      "Kenali status kejadian, mulai dari verifikasi hingga proses penanganan selesai.",
    href: "/peta",
    label: "Lihat status kejadian",
    icon: ShieldCheck,
    image: "/landing-status-penanganan.jpg",
  },
];

const beritaKarhutla = [
  {
    kategori: "Pencegahan",
    judul: "Kenali kondisi lahan yang rentan terhadap kebakaran",
    ringkasan:
      "Cuaca kering dan vegetasi yang mudah terbakar dapat meningkatkan risiko. Pemantauan lingkungan membantu warga lebih waspada.",
    icon: Flame,
    gaya: "prevention",
  },
  {
    kategori: "Deteksi dini",
    judul: "Informasi awal membantu penanganan lebih cepat",
    ringkasan:
      "Lokasi dan kondisi yang disampaikan dengan jelas membantu proses verifikasi serta tindak lanjut laporan karhutla.",
    icon: Radio,
    gaya: "detection",
  },
  {
    kategori: "Kolaborasi",
    judul: "Peran warga dan petugas dalam pemantauan karhutla",
    ringkasan:
      "Kewaspadaan masyarakat dan koordinasi dengan petugas mendukung upaya pencegahan dan penanganan di lapangan.",
    icon: UsersRound,
    gaya: "collaboration",
  },
];

export default function Home() {
  return (
    <main className="home-landing">
      <div className="home-landing-content">
        <section aria-labelledby="landing-heading" className="landing-hero">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">
              Sistem Informasi Pemantauan Karhutla
            </p>
            <h1 id="landing-heading">
              Pantau karhutla Indonesia, lebih mudah.
            </h1>
            <p className="landing-intro">
              Jelajahi sebaran kejadian kebakaran hutan dan lahan, telusuri
              informasi berdasarkan status atau wilayah, dan akses kanal
              pelaporan dalam satu platform SIGAPI.
            </p>
            <div className="landing-actions">
              <Link className="landing-primary-action" href="/peta">
                Jelajahi Peta Hotspot
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link className="landing-secondary-action" href="/dashboard/pelapor">
                Laporkan Kejadian
              </Link>
            </div>
          </div>

          <div className="landing-video">
            <video
              aria-label="Video tentang pemantauan kebakaran hutan dan lahan"
              autoPlay
              loop
              muted
              poster="/karhutla-video-poster.svg"
              playsInline
              preload="auto"
            >
              <source src="/karhutla-hero.mp4" type="video/mp4" />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          </div>
        </section>

        <section aria-labelledby="landing-services-heading" className="landing-services">
          <div className="landing-section-heading">
            <div>
              <p className="landing-section-kicker">Jelajahi SIGAPI</p>
              <h2 id="landing-services-heading">Informasi penting, dalam satu tempat</h2>
            </div>
            <p>
              Akses peta dan fitur yang membantu pemantauan kejadian karhutla.
            </p>
          </div>

          <div className="landing-service-grid">
            {layanan.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  className="landing-service-card"
                  href={item.href}
                  key={item.title}
                >
                  <div className="landing-service-copy">
                    <span className="landing-service-icon">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="landing-service-link">
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </div>
                  <span aria-hidden="true" className="landing-service-art">
                    <Image
                      alt=""
                      className="landing-service-image"
                      fill
                      sizes="(max-width: 680px) 42vw, (max-width: 900px) 25vw, 14vw"
                      src={item.image}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="landing-news-heading" className="landing-news">
          <div className="landing-section-heading">
            <div>
              <p className="landing-section-kicker">Informasi SIGAPI</p>
              <h2 id="landing-news-heading">Berita dan edukasi karhutla</h2>
            </div>
            <p>
              Contoh informasi seputar pencegahan, deteksi dini, dan penanganan
              kebakaran hutan dan lahan.
            </p>
          </div>

          <div className="landing-news-grid">
            {beritaKarhutla.map((berita) => {
              const Icon = berita.icon;

              return (
                <article className="landing-news-card" key={berita.judul}>
                  <div
                    aria-hidden="true"
                    className={`landing-news-visual landing-news-visual-${berita.gaya}`}
                  >
                    <Icon className="size-8" />
                    <span className="landing-news-visual-orbit" />
                  </div>
                  <div className="landing-news-copy">
                    <div className="landing-news-meta">
                      <span>Contoh berita</span>
                      <span>{berita.kategori}</span>
                    </div>
                    <h3>{berita.judul}</h3>
                    <p>{berita.ringkasan}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
