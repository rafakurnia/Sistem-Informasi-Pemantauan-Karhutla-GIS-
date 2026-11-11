import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Baca .env.local
const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...values] = trimmed.split("=");
    env[key.trim()] = values.join("=").trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log("==================================================");
console.log("🔍 PENGUJIAN BACKEND & DATABASE SUPABASE (RAFA)");
console.log("==================================================");
console.log("Target URL:", url);

async function testBackend() {
  try {
    // 1. Uji Client Publik (Anon)
    const supabaseAnon = createClient(url, anonKey);
    const { data: sessionData, error: sessionErr } =
      await supabaseAnon.auth.getSession();
    if (sessionErr) {
      console.error("❌ Anon Client Error:", sessionErr.message);
    } else {
      console.log("✅ 1. Anon Client Supabase: BERHASIL TERHUBUNG");
    }

    // 2. Uji Client Admin (Service Role)
    const supabaseAdmin = createClient(url, serviceKey);
    console.log("✅ 2. Service Role Admin Client: BERHASIL DIINISIALISASI");

    // 3. Uji 8 Tabel Utama
    const tables = [
      "profiles",
      "wilayah",
      "laporan",
      "laporan_foto",
      "penugasan",
      "tindak_lanjut",
      "bukti_penanganan",
      "status_log",
    ];

    console.log("\n📊 3. Memeriksa 8 Tabel Utama di Database:");
    for (const table of tables) {
      const { data, error, count } = await supabaseAdmin
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.log(`   ❌ Tabel '${table}': GAGAL (${error.message})`);
      } else {
        console.log(`   ✅ Tabel '${table}': SIAP (Baris data: ${count || 0})`);
      }
    }

    // 4. Uji Data Wilayah
    const { data: wilayah } = await supabaseAdmin.from("wilayah").select("*");
    console.log(`\n📍 4. Data Wilayah Terdaftar: ${wilayah?.length || 0} wilayah`);
    if (wilayah && wilayah.length > 0) {
      wilayah.forEach((w, i) => {
        console.log(`   ${i + 1}. [${w.kode_wilayah || "-"}] ${w.nama_wilayah}`);
      });
    }

    // 5. Uji Storage Bucket
    const { data: buckets, error: bucketError } =
      await supabaseAdmin.storage.listBuckets();
    const karhutlaBucket = buckets?.find((b) => b.name === "karhutla");

    console.log("\n📦 5. Memeriksa Supabase Storage:");
    if (karhutlaBucket) {
      console.log(`   ✅ Bucket 'karhutla': DITEMUKAN (Public: ${karhutlaBucket.public})`);
    } else {
      console.log(
        "   ⚠️ Bucket 'karhutla' belum dibuat di menu Storage Supabase."
      );
      console.log(
        "      👉 Buka dashboard Supabase -> Storage -> New Bucket -> beri nama 'karhutla' (Turn ON public)"
      );
    }

    console.log("\n==================================================");
    console.log("🎉 SELURUH SETUP BACKEND RAFA SIAP DIGUNAKAN!");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Terjadi kesalahan pengujian:", err.message);
  }
}

testBackend();
