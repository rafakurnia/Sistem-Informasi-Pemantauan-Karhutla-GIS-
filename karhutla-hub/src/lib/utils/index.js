// File: src/lib/utils/index.js
// Pemilik: Yujin (format tanggal, angka, helper tampilan)

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format standar Indonesia: '17 Agustus 2026, 14:30 WIB'
 */
export function formatTanggal(dateString) {
  if (!dateString) return "-";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "-";

  return (
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(date) + " WIB"
  );
}

/**
 * Format angka atau koordinat numerik
 */
export function formatAngka(value, decimalDigits = 2) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalDigits,
  }).format(value);
}

/**
 * Format koordinat Lintang dan Bujur
 */
export function formatKoordinat(lat, lng) {
  if (lat === null || lng === null || lat === undefined || lng === undefined) {
    return "-";
  }
  return `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;
}

