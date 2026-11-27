"use client";

// File: src/app/(auth)/login/page.js
// Halaman Login - tersambung ke loginAction milik Rafa

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ChevronDown } from "lucide-react";
import { loginAction } from "@/actions/auth";

// ── Kredensial demo untuk presentasi ─────────────────────────────────────────
// Ganti nilai di bawah sesuai akun yang sudah dibuat di Supabase
const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    email: "admin@sigapi.id",
    password: "Password123!",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    dot: "bg-purple-500",
  },
  {
    role: "Petugas 1",
    email: "petugas1@sigapi.id",
    password: "Password123!",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    role: "Pelapor 1",
    email: "pelapor1@sigapi.id",
    password: "Password123!",
    color: "bg-sky-100 text-sky-800 border-sky-200",
    dot: "bg-sky-500",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [showHint, setShowHint] = useState(true);

  function isiOtomatis(akun) {
    setEmailVal(akun.email);
    setPasswordVal(akun.password);
    setError("");
    setFieldErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const formData = new FormData(e.target);
    const result = await loginAction({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.ok) {
      setLoading(false);
      setError(result.error || "Login gagal.");
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      return;
    }

    window.location.href = result.data.redirectUrl;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2419] via-[#1a3a28] to-[#0f2419] px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image
              src="/karhutla-logo.svg"
              alt="SIGAPI"
              width={160}
              height={32}
              priority
            />
            <span className="text-xs text-[#a7c5b4] mt-1">
              Sistem Informasi Kebakaran Hutan dan Lahan
            </span>
          </Link>
        </div>

        {/* ── Hint Box Akun Demo ── */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white/90 hover:bg-white/5 transition"
          >
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Akun Demo untuk Presentasi
            </span>
            <ChevronDown className={`size-3.5 transition-transform ${showHint ? "rotate-180" : ""}`} />
          </button>

          {showHint && (
            <div className="px-4 pb-4 space-y-2.5 border-t border-white/10 pt-3">
              {DEMO_ACCOUNTS.map((akun) => (
                <div
                  key={akun.role}
                  className="bg-white/95 rounded-xl p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${akun.color}`}>
                      <span className={`size-1.5 rounded-full ${akun.dot}`} />
                      {akun.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => isiOtomatis(akun)}
                      className="text-[11px] font-semibold text-[#173f30] bg-[#edf4ee] hover:bg-[#daeede] px-2.5 py-1 rounded-lg transition"
                    >
                      Isi Otomatis ↓
                    </button>
                  </div>
                  <div className="space-y-0.5 text-xs text-[#40574d] font-mono">
                    <div className="flex gap-2">
                      <span className="text-[#86998f] w-16 shrink-0">Email</span>
                      <span className="font-semibold text-[#18372e]">{akun.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#86998f] w-16 shrink-0">Password</span>
                      <span className="font-semibold text-[#18372e]">{akun.password}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-white/50 text-center pt-1">
                Klik &quot;Isi Otomatis&quot; untuk langsung memasukkan kredensial ke form
              </p>
            </div>
          )}
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-xl font-bold text-[#18372e] mb-1">Masuk</h1>
          <p className="text-sm text-[#64776f] mb-6">
            Masuk ke akun SIGAPI Anda
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#18372e] mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b3a8] outline-none focus:ring-2 focus:ring-[#2d6a4f] transition disabled:bg-slate-100 disabled:cursor-not-allowed ${
                  fieldErrors.email ? "border-red-400 bg-red-50" : "border-[#c8ddd5] bg-white"
                }`}
                placeholder="nama@email.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#18372e] mb-1.5">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={loading}
                value={passwordVal}
                onChange={(e) => setPasswordVal(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b3a8] outline-none focus:ring-2 focus:ring-[#2d6a4f] transition disabled:bg-slate-100 disabled:cursor-not-allowed ${
                  fieldErrors.password ? "border-red-400 bg-red-50" : "border-[#c8ddd5] bg-white"
                }`}
                placeholder="Minimal 6 karakter"
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold py-2.5 text-sm transition disabled:opacity-75 disabled:cursor-not-allowed mt-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin shrink-0" />
                  <span>Memproses Masuk…</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#64776f]">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-[#2d6a4f] hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#6b8c7a]">
          Kembali ke{" "}
          <Link href="/" className="underline hover:text-white transition">
            Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
