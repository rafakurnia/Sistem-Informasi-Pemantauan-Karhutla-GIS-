import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Navbar({
  eyebrow = "SISTEM INFORMASI GIS",
  description = "Pemantauan wilayah dan penanganan laporan",
  publicHref = "/",
}) {
  return (
    <header className="dashboard-topbar">
      <div>
        <p className="dashboard-topbar-kicker">{eyebrow}</p>
        <p className="dashboard-topbar-caption">{description}</p>
      </div>
      <Link className="dashboard-public-link" href={publicHref}>
        Peta publik <ExternalLink aria-hidden="true" className="size-3.5" />
      </Link>
    </header>
  );
}