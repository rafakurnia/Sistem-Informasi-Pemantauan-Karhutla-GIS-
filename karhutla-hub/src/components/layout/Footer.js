"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const relatedLinks = [
  { label: "Peta Interaktif", href: "/" },
  { label: "Dasbor Admin", href: "/dashboard/admin" },
  { label: "Area Pelapor", href: "/dashboard/pelapor" },
];

const guideLinks = [
  { label: "Data Karhutla", href: "/data/karhutla" },
  { label: "Publikasi", href: "/publikasi" },
  { label: "Panduan Peta GIS", href: "/publikasi/panduan-gis" },
];

function FooterLinks({ links }) {
  return (
    <ul className="site-footer-links">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} prefetch={link.href === "/"}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/peta") return null;

  return (
    <footer className="site-footer">
      <div className="site-footer-brand-row">
        <Link className="site-footer-brand" href="/" id="footer-brand">
          <Image
            alt=""
            height={42}
            src="/karhutla-icon.svg"
            width={42}
          />
          <span>SIGAPI</span>
          <span className="site-footer-brand-tagline">
            SISTEM INFORMASI PEMANTAUAN KARHUTLA
          </span>
        </Link>
      </div>

      <div className="site-footer-main">
        <section aria-labelledby="footer-explore-heading">
          <h2 id="footer-explore-heading">Jelajahi</h2>
          <FooterLinks links={relatedLinks} />
        </section>

        <section aria-labelledby="footer-info-heading">
          <h2 id="footer-info-heading">Informasi</h2>
          <FooterLinks links={guideLinks} />
        </section>

        <section className="site-footer-about" aria-labelledby="footer-about-heading">
          <h2 id="footer-about-heading">Tentang SIGAPI</h2>
          <p>
            SIGAPI menyajikan informasi geografis untuk membantu pemantauan
            kejadian kebakaran hutan dan lahan. Data ditampilkan sesuai sumber
            dan pembaruan yang tersedia.
          </p>
        </section>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 Sistem Informasi Pemantauan Karhutla.</p>
        <p>Informasi data mengikuti sumber yang tersedia.</p>
      </div>
    </footer>
  );
}
