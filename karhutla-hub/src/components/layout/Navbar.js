import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogIn } from "lucide-react";

export default function Navbar({
  variant = "public", // "public" atau "dashboard"
  brand = "SIGAPI",
  actionHref = "/login",
  actionLabel = "Login",
  publicHref = "/",
  children,
}) {
  const isDashboard = variant === "dashboard";
  const targetHref = isDashboard ? publicHref : actionHref;
  const targetLabel = isDashboard ? "Peta publik" : actionLabel;

  return (
    <header className="min-h-[72px] flex items-center justify-between gap-4 px-4 sm:px-8 bg-[#10392f] text-white border-b border-[#1b4d3f] shadow-sm">
      <div className="flex items-center gap-3">
        {/* Brand SIGAPI dengan logo karhutla-icon.svg */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          aria-label="SIGAPI - Halaman Utama"
        >
          <Image
            src="/karhutla-icon.svg"
            alt="Logo SIGAPI"
            width={38}
            height={38}
            className="h-9 w-9 shrink-0 drop-shadow-sm"
            priority
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-wider text-white leading-none">
              {brand}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-tight text-[#8ecf91] mt-1 leading-none">
              Sistem Informasi Kebakaran Hutan dan Lahan
            </span>
          </div>
        </Link>
      </div>

      {/* Navigasi Aksi Kanan (Login untuk publik / Peta untuk admin) */}
      <div className="flex items-center gap-3">
        {children}

        <Link
          className="inline-flex items-center justify-center min-h-[38px] gap-2 px-4 py-1.5 rounded-lg bg-[#174a3a] hover:bg-[#1d5c48] border border-[#2d735d] text-white text-xs font-semibold shadow-xs transition-colors"
          href={targetHref}
        >
          {isDashboard ? (
            <>
              <span>{targetLabel}</span>
              <ExternalLink aria-hidden="true" className="size-3.5 text-[#8ecf91]" />
            </>
          ) : (
            <>
              <LogIn aria-hidden="true" className="size-3.5 text-[#8ecf91]" />
              <span>{targetLabel}</span>
            </>
          )}
        </Link>
      </div>
    </header>
  );
}
