"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Menu,
  UserRound,
  X,
  LogOut,
  LayoutDashboard,
  MapPinned,
  Check,
  Globe,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

const roleConfig = {
  admin: {
    label: "Admin",
    href: "/dashboard/admin",
    badgeClass: "bg-rose-500/25 text-rose-200 border-rose-400/40",
    avatarBg: "bg-rose-700 text-white",
  },
  petugas: {
    label: "Petugas",
    href: "/dashboard/petugas",
    badgeClass: "bg-sky-500/25 text-sky-200 border-sky-400/40",
    avatarBg: "bg-sky-700 text-white",
  },
  pelapor: {
    label: "Pelapor",
    href: "/dashboard/pelapor",
    badgeClass: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
    avatarBg: "bg-emerald-700 text-white",
  },
};

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function isCurrentPath(pathname, href) {
  if (!href || href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef(null);

  const navigationItems = [
    { label: t("nav_home"), href: "/" },
    {
      label: t("nav_hotspot_map"),
      href: "/peta",
      children: [
        { label: t("nav_view_map"), href: "/peta" },
        { label: t("nav_create_report"), href: "/dashboard/pelapor" },
      ],
    },
    {
      label: t("nav_data"),
      children: [
        { label: t("nav_data_karhutla"), href: "/data/karhutla" },
        { label: t("nav_hotspot_stats"), href: "/data/hotspot" },
      ],
    },
    {
      label: t("nav_publications"),
      children: [
        { label: t("nav_pub_list"), href: "/publikasi" },
        { label: t("nav_gis_guide"), href: "/publikasi/panduan-gis" },
      ],
    },
    { label: t("nav_news"), href: "/berita" },
    { label: t("nav_about"), href: "/tentang-kami" },
  ];

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setUserProfile(null);
          setLoadingUser(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, nama, role, no_hp")
          .eq("id", user.id)
          .maybeSingle();

        setUserProfile({
          id: user.id,
          email: user.email,
          nama:
            profile?.nama ||
            user.user_metadata?.nama ||
            user.email?.split("@")[0] ||
            "Pengguna",
          role: profile?.role || "pelapor",
        });
      } catch (err) {
        console.error("Gagal memuat profil pengguna:", err);
        setUserProfile(null);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser();
      } else {
        setUserProfile(null);
        setLoadingUser(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Close dropdowns on path change or click outside
  useEffect(() => {
    setProfileMenuOpen(false);
    setLangMenuOpen(false);
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    setProfileMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserProfile(null);
    router.push("/login");
    router.refresh();
  }

  if (pathname?.startsWith("/dashboard/admin")) return null;

  function closeMobileMenu() {
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  const currentRole =
    userProfile && roleConfig[userProfile.role]
      ? roleConfig[userProfile.role]
      : roleConfig.pelapor;

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
              {t("brand_tagline")}
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
                ? item.href === "/"
                  ? pathname === "/"
                  : isCurrentPath(pathname, item.href)
                : item.children.some(
                    (child) =>
                      (child.href !== "/" || pathname !== "/") &&
                      isCurrentPath(pathname, child.href),
                  );

              return (
                <li className="site-navigation-item" key={item.label}>
                  {item.children ? (
                    <div
                      className={`site-dropdown${openDropdown === item.label ? " is-open" : ""}`}
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.href ? (
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="site-navigation-link site-dropdown-trigger"
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                          <ChevronDown
                            aria-hidden="true"
                            className="site-dropdown-icon size-3.5"
                          />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          aria-expanded={openDropdown === item.label}
                          onClick={() =>
                            setOpenDropdown((curr) =>
                              curr === item.label ? null : item.label,
                            )
                          }
                          aria-current={active ? "page" : undefined}
                          className="site-navigation-link site-dropdown-trigger"
                        >
                          {item.label}
                          <ChevronDown
                            aria-hidden="true"
                            className="site-dropdown-icon size-3.5"
                          />
                        </button>
                      )}
                      <ul className="site-dropdown-panel">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              aria-current={
                                isCurrentPath(pathname, child.href)
                                  ? "page"
                                  : undefined
                              }
                              className="site-dropdown-link"
                              href={child.href}
                              onClick={closeMobileMenu}
                              prefetch={
                                child.href === "/" ||
                                child.href === "/dashboard/admin"
                              }
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`site-navigation-link${item.emphasis ? " site-navigation-link-emphasis" : ""}`}
                      href={item.href}
                      onClick={closeMobileMenu}
                      prefetch={
                        item.href === "/" ||
                        item.href === "/peta" ||
                        item.href === "/dashboard/admin"
                      }
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="site-navbar-actions">
          {/* PEMILIH BAHASA (ID / ENG) */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all text-xs font-semibold cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              aria-label="Pilih Bahasa / Select Language"
              aria-expanded={langMenuOpen}
            >
              <span aria-hidden="true" className="text-sm">
                {lang === "en" ? "🇬🇧" : "🇮🇩"}
              </span>
              <span className="tracking-wide">
                {lang === "en" ? "ENG" : "ID"}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`size-3 text-emerald-200/70 transition-transform duration-200 ${
                  langMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#143e2f] border border-emerald-800/80 shadow-2xl shadow-black/60 p-1.5 z-50 backdrop-blur-md">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300/70 border-b border-white/10 mb-1 flex items-center gap-1">
                  <Globe className="size-3" />
                  <span>Language / Bahasa</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLang("id");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                    lang === "id"
                      ? "bg-white/15 text-white font-bold"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇮🇩</span>
                    <span>Indonesia (ID)</span>
                  </span>
                  {lang === "id" && <Check className="size-3.5 text-emerald-300" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang("en");
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                    lang === "en"
                      ? "bg-white/15 text-white font-bold"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇬🇧</span>
                    <span>English (ENG)</span>
                  </span>
                  {lang === "en" && <Check className="size-3.5 text-emerald-300" />}
                </button>
              </div>
            )}
          </div>

          {loadingUser ? (
            <div className="h-9 w-24 rounded-full bg-white/10 animate-pulse" />
          ) : userProfile ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/50 cursor-pointer shadow-sm"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${currentRole.avatarBg}`}
                >
                  {getInitials(userProfile.nama)}
                </span>
                <span className="max-w-[110px] truncate font-medium text-white hidden sm:inline">
                  {userProfile.nama}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${currentRole.badgeClass}`}
                >
                  {currentRole.label}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 text-emerald-200/70 transition-transform duration-200 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#143e2f] border border-emerald-800/70 shadow-2xl shadow-black/60 p-2 z-50 backdrop-blur-md">
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <p className="text-[11px] text-emerald-200/70">
                      {t("signed_in_as")}
                    </p>
                    <p className="font-semibold text-white text-sm truncate mt-0.5">
                      {userProfile.nama}
                    </p>
                    <p className="text-[11px] text-emerald-200/60 truncate">
                      {userProfile.email}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border border-white/10 bg-black/20 text-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {userProfile.role === "admin"
                        ? t("role_admin")
                        : userProfile.role === "petugas"
                        ? t("role_petugas")
                        : t("role_pelapor")}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href={currentRole.href}
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="size-4 text-emerald-300" />
                      <span>{t("dashboard")} {currentRole.label}</span>
                    </Link>
                    <Link
                      href="/peta"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <MapPinned className="size-4 text-amber-300" />
                      <span>{t("nav_hotspot_map")} GIS</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="size-4 text-rose-400" />
                      <span>{t("logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link className="site-login-link" href="/login">
              <UserRound aria-hidden="true" className="size-4" />
              <span>{t("nav_login")}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
