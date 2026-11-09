import Image from "next/image";
import Link from "next/link";

const relatedLinks = [
  { label: "Beranda", href: "/" },
  { label: "Peta Hotspot", href: "/" },
  { label: "Data Karhutla", href: "/data/karhutla" },
  { label: "Berita", href: "/berita" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

const guideLinks = [
  { label: "Panduan Penggunaan Website", href: "/panduan" },
  { label: "Panduan Peta GIS", href: "/panduan/peta-gis" },
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  { label: "Disclaimer", href: "/disclaimer" },
];

function FooterLinks({ links }) {
  return (
    <ul className="site-footer-links">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} prefetch={link.href === "/"}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <section className="site-footer-identity" aria-labelledby="footer-brand">
          <Link className="site-footer-brand" href="/" id="footer-brand">
            <Image
              alt=""
              height={42}
              src="/karhutla-icon.svg"
              width={42}
            />
            <span>SIGAPI</span>
          </Link>
          <p>
            Sistem informasi berbasis Geographic Information System (GIS) untuk
            memantau, menyajikan, dan mengelola informasi kebakaran hutan dan
            lahan di Indonesia.
          </p>
          <p className="site-footer-muted">
            Informasi pengelola dan kontak resmi akan ditampilkan setelah
            tersedia.
          </p>
        </section>

        <section aria-labelledby="footer-related-heading">
          <h2 id="footer-related-heading">Link Terkait</h2>
          <FooterLinks links={relatedLinks} />
        </section>

        <section aria-labelledby="footer-guide-heading">
          <h2 id="footer-guide-heading">Panduan</h2>
          <FooterLinks links={guideLinks} />
        </section>

        <section aria-labelledby="footer-info-heading">
          <h2 id="footer-info-heading">Informasi Data</h2>
          <ul className="site-footer-information">
            <li>Statistik hotspot tersedia setelah sumber data terhubung.</li>
            <li>Rekap kejadian mengikuti data yang telah diverifikasi.</li>
            <li>Pembaruan mengikuti sinkronisasi sumber data aplikasi.</li>
          </ul>
        </section>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 Sistem Informasi Pemantauan Karhutla.</p>
        <p>
          Dikembangkan untuk mendukung pemantauan dan penanggulangan kebakaran
          hutan dan lahan di Indonesia.
        </p>
      </div>
    </footer>
  );
}