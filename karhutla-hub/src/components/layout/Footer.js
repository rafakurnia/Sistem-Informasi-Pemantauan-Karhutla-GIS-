import Link from "next/link";

export default function Footer({
  children,
  year = "2026",
  systemName = "SIGAPI",
}) {
  return (
    <footer className="border-t border-[#dce5dd] bg-white/70 px-5 py-4 text-xs text-[#64776f] sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div>
          <p className="m-0 font-medium text-[#18372e]">
            &copy; {year} {systemName}
          </p>
          <p className="m-0 text-[11px] text-[#859890]">
            Sistem Informasi Pemantauan Kebakaran Hutan dan Lahan (GIS)
          </p>
        </div>

        {children ? (
          <div>{children}</div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#64776f]">
            <Link href="/" className="hover:text-[#174a3a] transition-colors">
              Peta Publik
            </Link>
            <span>&bull;</span>
            <Link href="/dashboard/admin" className="hover:text-[#174a3a] transition-colors">
              Panel Admin
            </Link>
            <span>&bull;</span>
            <span className="text-[#859890]">Tim Rafa, Sabar, Yujin</span>
          </div>
        )}
      </div>
    </footer>
  );
}
