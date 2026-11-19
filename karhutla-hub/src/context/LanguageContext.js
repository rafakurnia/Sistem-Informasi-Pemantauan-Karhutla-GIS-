"use client";

// File: src/context/LanguageContext.js
// Context penyedia bahasa (ID & ENG) untuk seluruh aplikasi SIGAPI

import { createContext, useContext, useState, useEffect } from "react";

export const DICTIONARY = {
  id: {
    brand_tagline: "SISTEM INFORMASI PEMANTAUAN KARHUTLA",
    nav_home: "Beranda",
    nav_hotspot_map: "Peta Hotspot",
    nav_view_map: "Lihat Peta",
    nav_create_report: "Buat Laporan",
    nav_data: "Data",
    nav_data_karhutla: "Data Karhutla",
    nav_hotspot_stats: "Statistik Hotspot",
    nav_publications: "Publikasi",
    nav_pub_list: "Daftar Publikasi",
    nav_gis_guide: "Panduan Peta GIS",
    nav_news: "Berita",
    nav_about: "Tentang Kami",
    nav_login: "Masuk",
    signed_in_as: "Masuk sebagai",
    dashboard: "Dashboard",
    logout: "Keluar (Logout)",
    role_admin: "Administrator",
    role_petugas: "Petugas Lapangan",
    role_pelapor: "Masyarakat / Pelapor",
  },
  en: {
    brand_tagline: "FOREST & LAND FIRE MONITORING INFORMATION SYSTEM",
    nav_home: "Home",
    nav_hotspot_map: "Hotspot Map",
    nav_view_map: "View Map",
    nav_create_report: "Submit Report",
    nav_data: "Data",
    nav_data_karhutla: "Fire Incident Data",
    nav_hotspot_stats: "Hotspot Statistics",
    nav_publications: "Publications",
    nav_pub_list: "Publication List",
    nav_gis_guide: "GIS Map Guide",
    nav_news: "News",
    nav_about: "About Us",
    nav_login: "Sign In",
    signed_in_as: "Signed in as",
    dashboard: "Dashboard",
    logout: "Sign Out (Logout)",
    role_admin: "Administrator",
    role_petugas: "Field Officer",
    role_pelapor: "Citizen / Reporter",
  },
};

const LanguageContext = createContext({
  lang: "id",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sigapi_lang");
      if (saved === "id" || saved === "en") {
        setLang(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("sigapi_lang", newLang);
    } catch (e) {
      // ignore
    }
  };

  const t = (key) => {
    return DICTIONARY[lang]?.[key] || DICTIONARY.id?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
