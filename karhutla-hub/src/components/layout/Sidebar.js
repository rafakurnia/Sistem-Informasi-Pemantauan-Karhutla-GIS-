"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/actions/auth";

// Nav items setiap role hanya melihat area kerjanya sendiri.
// Admin juga mendapat akses ke area petugas untuk memantau.
const NAV_BY_ROLE = {
  pelapor: [
    { href: "/dashboard/pelapor", label: "Area Pelapor", icon: ClipboardList },
  ],
  petugas: [
    { href: "/dashboard/petugas", label: "Area Petugas", icon: ShieldCheck },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Administrasi", icon: LayoutDashboard },
    { href: "/dashboard/petugas", label: "Area Petugas", icon: ShieldCheck },
  ],
};

export default function Sidebar({ role = "pelapor" }) {
  const pathname = usePathname();
  const isAdminArea = role === "admin";
  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.pelapor;

  return (
    <aside
      className={`dashboard-sidebar${isAdminArea ? " dashboard-sidebar-admin" : ""}`}
    >
      <Link
        className="dashboard-brand"
        href="/"
        aria-label="SIGAPI, halaman utama"
      >
        <Image
          src="/karhutla-icon.svg"
          alt=""
          width={38}
          height={38}
          priority
        />
        <span className="dashboard-brand-copy">
          <strong>SIGAPI</strong>
          <span>Pemantauan Karhutla</span>
        </span>
      </Link>

      <p className="dashboard-nav-label">RUANG KERJA</p>
      <nav className="dashboard-navigation" aria-label="Navigasi dashboard">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            aria-current={pathname.startsWith(href) ? "page" : undefined}
            className="dashboard-nav-link"
            href={href}
            key={href}
            prefetch={href === "/dashboard/admin"}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="dashboard-sidebar-footer">
        <div className="dashboard-sidebar-note">
          <p>
            Sistem informasi pemantauan kebakaran hutan dan lahan berbasis
            wilayah.
          </p>
        </div>
        <form action={logoutAction}>
          <button className="dashboard-logout-button" type="submit">
            <LogOut aria-hidden="true" className="size-4 shrink-0" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
