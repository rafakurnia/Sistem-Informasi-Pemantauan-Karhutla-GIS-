import Image from "next/image";
import Link from "next/link";
import { ClipboardList, LayoutDashboard, ShieldCheck } from "lucide-react";

const dashboardAreas = [
  { href: "/dashboard/admin", label: "Administrasi", icon: LayoutDashboard },
  { href: "/dashboard/pelapor", label: "Area pelapor", icon: ClipboardList },
  { href: "/dashboard/petugas", label: "Area petugas", icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <Link
        className="dashboard-brand"
        href="/"
        aria-label="Pemantauan Karhutla, halaman utama"
      >
        <Image
          src="/karhutla-logo.svg"
          alt="Pemantauan Karhutla"
          width={220}
          height={43}
          priority
        />
      </Link>

      <p className="dashboard-nav-label">RUANG KERJA</p>
      <nav className="dashboard-navigation" aria-label="Navigasi dashboard">
        {dashboardAreas.map(({ href, label, icon: Icon }) => (
          <Link className="dashboard-nav-link" href={href} key={href}>
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="dashboard-sidebar-note">
        <p>Pemantauan kebakaran hutan dan lahan berbasis wilayah.</p>
      </div>
    </aside>
  );
}