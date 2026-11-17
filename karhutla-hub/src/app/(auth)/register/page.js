"use client";

// File: src/app/(auth)/register/page.js
// Halaman Registrasi Pelapor - tersambung ke registerAction milik Rafa

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerAction } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const konfirmasi = formData.get("konfirmasi_password");

    if (password !== konfirmasi) {
      setFieldErrors({ konfirmasi_password: "Kata sandi tidak cocok." });
      setLoading(false);
      return;
    }

    const result = await registerAction({
      nama: formData.get("nama"),
      email: formData.get("email"),
      nomor_hp: formData.get("nomor_hp"),
      password,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error || "Pendaftaran gagal.");
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2419] via-[#1a3a28] to-[#0f2419] px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h2 className="text-xl font-bold text-[#18372e] mb-2">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-sm text-[#64776f] mb-6">
            Akun Anda telah dibuat. Silakan cek email untuk verifikasi, lalu
            masuk ke SIGAPI.
          </p>
          <Link
            href="/login"
            className="inline-block w-full rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold py-2.5 text-sm text-center transition"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2419] via-[#1a3a28] to-[#0f2419] px-4 py-12">
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
          <h1 className="text-xl font-bold text-[#18372e] mb-1">
            Buat Akun Pelapor
          </h1>
          <p className="text-sm text-[#64776f] mb-6">
            Daftar untuk melaporkan kejadian karhutla di wilayah Anda
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-[#18372e] mb-1.5"
              >
                Nama Lengkap
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                autoComplete="name"
                required
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b3a8] outline-none focus:ring-2 focus:ring-[#2d6a4f] transition ${
                  fieldErrors.nama
                    ? "border-red-400 bg-red-50"
                    : "border-[#c8ddd5] bg-white"
                }`}
                placeholder="Nama sesuai KTP"
              />
              {fieldErrors.nama && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.nama}</p>
              )}
            </div>

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
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="nomor_hp"
                className="block text-sm font-medium text-[#18372e] mb-1.5"
              >
                Nomor HP <span className="text-[#a0b3a8] font-normal">(opsional)</span>
              </label>
              <input
                id="nomor_hp"
                name="nomor_hp"
                type="tel"
                autoComplete="tel"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b3a8] outline-none focus:ring-2 focus:ring-[#2d6a4f] transition ${
                  fieldErrors.nomor_hp
                    ? "border-red-400 bg-red-50"
                    : "border-[#c8ddd5] bg-white"
                }`}
                placeholder="08123456789"
              />
              {fieldErrors.nomor_hp && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.nomor_hp}
                </p>
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
                autoComplete="new-password"
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

            <div>
              <label
                htmlFor="konfirmasi_password"
                className="block text-sm font-medium text-[#18372e] mb-1.5"
              >
                Konfirmasi Kata Sandi
              </label>
              <input
                id="konfirmasi_password"
                name="konfirmasi_password"
                type="password"
                autoComplete="new-password"
                required
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#18372e] placeholder:text-[#a0b3a8] outline-none focus:ring-2 focus:ring-[#2d6a4f] transition ${
                  fieldErrors.konfirmasi_password
                    ? "border-red-400 bg-red-50"
                    : "border-[#c8ddd5] bg-white"
                }`}
                placeholder="Ulangi kata sandi"
              />
              {fieldErrors.konfirmasi_password && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.konfirmasi_password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold py-2.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Mendaftar…" : "Buat Akun"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#64776f]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#2d6a4f] hover:underline"
            >
              Masuk di sini
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

