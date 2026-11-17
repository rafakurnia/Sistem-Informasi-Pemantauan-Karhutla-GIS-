"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, ShieldCheck } from "lucide-react";

const dashboardAreas = [
  { href: "/dashboard/admin", label: "Administrasi", icon: LayoutDashboard },
  { href: "/dashboard/pelapor", label: "Area pelapor", icon: ClipboardList },
  { href: "/dashboard/petugas", label: "Area petugas", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/dashboard/admin");
  const visibleAreas = isAdminArea
    ? dashboardAreas.filter(({ href }) => href !== "/dashboard/pelapor")
    : dashboardAreas;

  return (
    <aside className="dashboard-sidebar">
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
        {visibleAreas.map(({ href, label, icon: Icon }) => (
          <Link
            aria-current={pathname === href ? "page" : undefined}
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

      <div className="dashboard-sidebar-note">
        <p>Sistem informasi pemantauan kebakaran hutan dan lahan berbasis wilayah.</p>
      </div>
    </aside>
  );
}