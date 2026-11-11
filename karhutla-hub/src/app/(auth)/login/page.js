"use client";

// File: src/app/(auth)/login/page.js
// Halaman Login - tersambung ke loginAction milik Rafa

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

    setLoading(false);

    if (!result.ok) {
      setError(result.error || "Login gagal.");
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      return;
    }

    // Redirect sesuai role yang dikembalikan action
    router.push(result.data.redirectUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2419] via-[#1a3a28] to-[#0f2419] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
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

        {/* Card */}
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#18372e] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b3a8] outline-none focus:ring-2 focus:ring-[#2d6a4f] transition ${
                  fieldErrors.email
                    ? "border-red-400 bg-red-50"
                    : "border-[#c8ddd5] bg-white"
                }`}
                placeholder="nama@email.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#18372e] mb-1.5"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b3a8] outline-none focus:ring-2 focus:ring-[#2d6a4f] transition ${
                  fieldErrors.password
                    ? "border-red-400 bg-red-50"
                    : "border-[#c8ddd5] bg-white"
                }`}
                placeholder="Minimal 8 karakter"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold py-2.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#64776f]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#2d6a4f] hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#6b8c7a] mt-6">
          Kembali ke{" "}
          <Link href="/" className="underline hover:text-white transition">
            Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}

