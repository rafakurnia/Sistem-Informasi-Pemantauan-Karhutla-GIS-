"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

const navigationItems = [
  { label: "Beranda", href: "/" },
  { label: "Peta Hotspot", href: "/" },
  {
    label: "Data",
    children: [
      { label: "Data Karhutla", href: "/data/karhutla" },
      { label: "Statistik Hotspot", href: "/data/hotspot" },
    ],
  },
  {
    label: "Publikasi",
    children: [
      { label: "Daftar Publikasi", href: "/publikasi" },
      { label: "Panduan Peta GIS", href: "/publikasi/panduan-gis" },
    ],
  },
  { label: "Berita", href: "/berita" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Pelaporan", href: "/dashboard/pelapor" },
  { label: "Masuk", href: "/login", emphasis: true },
];

function isCurrentPath(pathname, href) {
  if (!href || href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link
          className="site-brand"
          href="/"
          aria-label="SIGAPI, kembali ke beranda"
          onClick={closeMobileMenu}
        >
          <Image
            alt=""
            className="site-brand-logo"
            height={48}
            priority
            src="/karhutla-icon.svg"
            width={48}
          />
          <span className="site-brand-copy">
            <span className="site-brand-name">SIGAPI</span>
            <span className="site-brand-tagline">
              Sistem Informasi Pemantauan Karhutla
            </span>
          </span>
        </Link>

        <button
          aria-controls="site-primary-navigation"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="site-menu-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>

        <nav
          aria-label="Navigasi utama"
          className={`site-primary-navigation${mobileOpen ? " is-open" : ""}`}
          id="site-primary-navigation"
        >
          <ul className="site-navigation-list">
            {navigationItems.map((item) => {
              const active = item.href
                ? isCurrentPath(pathname, item.href)
                : item.children.some((child) => isCurrentPath(pathname, child.href));

              return (
                <li className="site-navigation-item" key={item.label}>
                  {item.children ? (
                    <details className="site-dropdown">
                      <summary
                        aria-current={active ? "page" : undefined}
                        className="site-navigation-link site-dropdown-trigger"
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className="site-dropdown-icon size-3.5"
                        />
                      </summary>
                      <ul className="site-dropdown-panel">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              aria-current={isCurrentPath(pathname, child.href) ? "page" : undefined}
                              className="site-dropdown-link"
                              href={child.href}
                              onClick={closeMobileMenu}
                              prefetch={child.href === "/" || child.href === "/dashboard/admin"}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`site-navigation-link${item.emphasis ? " site-navigation-link-emphasis" : ""}`}
                      href={item.href}
                      onClick={closeMobileMenu}
                      prefetch={item.href === "/" || item.href === "/dashboard/admin"}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
