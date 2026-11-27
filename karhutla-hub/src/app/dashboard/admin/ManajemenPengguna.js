"use client";

// File: src/app/dashboard/admin/ManajemenPengguna.js
// CRUD pengguna: lihat semua akun, buat akun baru, ubah role, hapus akun.

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  buatAkunAction,
  hapusAkunAction,
  ubahRolePenggunaAction,
} from "@/actions/admin";
import {
  Plus, Trash2, ChevronDown, Loader2, X,
  User, ShieldCheck, Crown, Search,
} from "lucide-react";
import { formatTanggal } from "@/lib/utils";

const ROLE_LABEL = { pelapor: "Pelapor", petugas: "Petugas", admin: "Admin" };
const ROLE_STYLE = {
  pelapor: "bg-sky-100 text-sky-800 border-sky-200",
  petugas: "bg-amber-100 text-amber-800 border-amber-200",
  admin: "bg-purple-100 text-purple-800 border-purple-200",
};
const ROLE_ICON = { pelapor: User, petugas: ShieldCheck, admin: Crown };

const FORM_DEFAULT = { nama: "", email: "", nomor_hp: "", password: "", role: "pelapor" };

export default function ManajemenPengguna({ pengguna = [] }) {
  const router = useRouter();
  const [cari, setCari] = useState("");
  const [filterRole, setFilterRole] = useState("semua");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_DEFAULT);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSukses, setFormSukses] = useState(false);
  const [hapusId, setHapusId] = useState(null); // id yang sedang dikonfirmasi hapus
  const [hapusLoading, setHapusLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(null); // id user yang sedang diubah role

  // ── Filter ────────────────────────────────────────────────────────────────
  const daftarTersaring = pengguna.filter((u) => {
    const cocokRole = filterRole === "semua" || u.role === filterRole;
    const kata = cari.toLowerCase();
    const cocokCari =
      !cari ||
      (u.nama || "").toLowerCase().includes(kata) ||
      (u.nomor_hp || "").includes(kata);
    return cocokRole && cocokCari;
  });

  // ── Buat akun baru ────────────────────────────────────────────────────────
  async function handleBuat(e) {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFieldErrors({});
    const res = await buatAkunAction(form);
    setFormLoading(false);
    if (!res.ok) {
      setFormError(res.error || "Gagal membuat akun.");
      if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      return;
    }
    setFormSukses(true);
    setForm(FORM_DEFAULT);
    setTimeout(() => { setFormSukses(false); setShowForm(false); }, 1800);
    router.refresh();
  }

  // ── Hapus akun ────────────────────────────────────────────────────────────
  async function handleHapus(id) {
    setHapusLoading(true);
    const res = await hapusAkunAction(id);
    setHapusLoading(false);
    if (!res.ok) { alert(res.error); return; }
    setHapusId(null);
    router.refresh();
  }

  // ── Ubah role ─────────────────────────────────────────────────────────────
  async function handleUbahRole(userId, roleBaru) {
    setRoleLoading(userId);
    const res = await ubahRolePenggunaAction({ target_user_id: userId, role_baru: roleBaru });
    setRoleLoading(null);
    if (!res.ok) { alert(res.error); return; }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* ── Header & tombol tambah ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#18372e] m-0">Manajemen Pengguna</h2>
          <p className="text-sm text-[#64776f] mt-0.5">
            {pengguna.length} akun terdaftar di sistem
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setFormError(""); setFieldErrors({}); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173f30] hover:bg-[#103024] text-white text-sm font-semibold shadow transition"
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Tutup Form" : "Buat Akun Baru"}
        </button>
      </div>

      {/* ── Form buat akun ── */}
      {showForm && (
        <div className="rounded-2xl border border-[#c8ddd5] bg-[#f8faf8] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#18372e]">Form Pembuatan Akun</h3>

          {formSukses && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-medium">
              ✓ Akun berhasil dibuat!
            </div>
          )}
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleBuat} className="grid gap-4 sm:grid-cols-2">
            {/* Nama */}
            <div>
              <label className="block text-xs font-semibold text-[#40574d] uppercase mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nama}
                onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-[#c8ddd5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
              />
              {fieldErrors.nama && <p className="text-xs text-red-600 mt-1">{fieldErrors.nama}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#40574d] uppercase mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="budi@email.com"
                className="w-full rounded-xl border border-[#c8ddd5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
              />
              {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Nomor HP */}
            <div>
              <label className="block text-xs font-semibold text-[#40574d] uppercase mb-1">
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nomor_hp}
                onChange={(e) => setForm((p) => ({ ...p, nomor_hp: e.target.value }))}
                placeholder="08123456789"
                className="w-full rounded-xl border border-[#c8ddd5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
              />
              {fieldErrors.nomor_hp && <p className="text-xs text-red-600 mt-1">{fieldErrors.nomor_hp}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#40574d] uppercase mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-[#c8ddd5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
              />
              {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Role */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#40574d] uppercase mb-1">
                Role Akun <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {["pelapor", "petugas", "admin"].map((r) => {
                  const Icon = ROLE_ICON[r];
                  return (
                    <label
                      key={r}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer text-sm font-semibold transition ${
                        form.role === r
                          ? "border-[#173f30] bg-[#173f30] text-white"
                          : "border-[#c8ddd5] bg-white text-[#40574d] hover:border-[#173f30]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={form.role === r}
                        onChange={() => setForm((p) => ({ ...p, role: r }))}
                        className="sr-only"
                      />
                      <Icon className="size-4" />
                      {ROLE_LABEL[r]}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Tombol */}
            <div className="sm:col-span-2 flex gap-3 justify-end pt-1">
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(FORM_DEFAULT); setFormError(""); }}
                className="px-4 py-2 rounded-xl border border-[#c8ddd5] bg-white text-sm font-medium text-[#40574d] hover:bg-[#f0f4f1] transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#173f30] hover:bg-[#103024] text-white text-sm font-semibold shadow transition disabled:opacity-60"
              >
                {formLoading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                {formLoading ? "Membuat…" : "Buat Akun"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter & Cari ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#86998f]" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama / nomor HP…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c8ddd5] bg-white text-sm outline-none focus:ring-2 focus:ring-[#173f30]/30"
          />
        </div>
        <div className="flex gap-1.5">
          {["semua", "pelapor", "petugas", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterRole === r
                  ? "bg-[#173f30] text-white"
                  : "bg-white border border-[#c8ddd5] text-[#40574d] hover:bg-[#f0f4f1]"
              }`}
            >
              {r === "semua" ? "Semua" : ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabel pengguna ── */}
      {daftarTersaring.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#c8ddd5] bg-white p-10 text-center text-sm text-[#64776f]">
          Tidak ada pengguna yang sesuai filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e0ebe2]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f0f4f1] text-xs text-[#40574d] uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">No. HP</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Terdaftar</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eee8] bg-white">
              {daftarTersaring.map((u) => {
                const Icon = ROLE_ICON[u.role] || User;
                return (
                  <tr key={u.id} className="hover:bg-[#f8faf8] transition">
                    <td className="px-4 py-3 font-medium text-[#18372e]">
                      {u.nama || <span className="text-[#86998f] italic">Tanpa nama</span>}
                    </td>
                    <td className="px-4 py-3 text-[#64776f]">{u.nomor_hp || "—"}</td>
                    <td className="px-4 py-3">
                      {/* Select ubah role */}
                      <div className="relative inline-flex items-center">
                        <span className={`inline-flex items-center gap-1.5 pl-2.5 pr-7 py-1 rounded-lg border text-xs font-semibold ${ROLE_STYLE[u.role] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                          {roleLoading === u.id
                            ? <Loader2 className="size-3 animate-spin" />
                            : <Icon className="size-3" />
                          }
                          {ROLE_LABEL[u.role] || u.role}
                        </span>
                        <select
                          value={u.role}
                          onChange={(e) => handleUbahRole(u.id, e.target.value)}
                          disabled={roleLoading === u.id}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        >
                          <option value="pelapor">Pelapor</option>
                          <option value="petugas">Petugas</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown className="absolute right-1.5 size-3 text-current pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#86998f] text-xs">{formatTanggal(u.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {hapusId === u.id ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="text-xs text-red-600 font-semibold">Hapus akun ini?</span>
                          <button
                            onClick={() => handleHapus(u.id)}
                            disabled={hapusLoading}
                            className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-lg transition"
                          >
                            {hapusLoading ? <Loader2 className="size-3 animate-spin" /> : "Ya, Hapus"}
                          </button>
                          <button
                            onClick={() => setHapusId(null)}
                            className="text-xs text-[#64776f] hover:text-[#18372e] px-2 py-1 rounded-lg hover:bg-[#f0f4f1] transition"
                          >
                            Batal
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setHapusId(u.id)}
                          title="Hapus akun"
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-[#86998f]">
        Menampilkan {daftarTersaring.length} dari {pengguna.length} pengguna.
        Klik badge role pada baris untuk mengubah role pengguna tersebut.
      </p>
    </div>
  );
}
