"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/actions/auth";

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

      <div className="dashboard-sidebar-footer">
        <div className="dashboard-sidebar-note">
          <p>
            Sistem informasi pemantauan kebakaran hutan dan lahan berbasis
            wilayah.
          </p>
        </div>
        {isAdminArea && (
          <form action={logoutAction}>
            <button className="dashboard-logout-button" type="submit">
              <LogOut aria-hidden="true" className="size-4 shrink-0" />
              <span>Logout sebagai Admin</span>
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}