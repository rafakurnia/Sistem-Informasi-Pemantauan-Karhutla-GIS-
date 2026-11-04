import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Baca .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...values] = trimmed.split('=');
    env[key.trim()] = values.join('=').trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

async function test() {
  try {
    const supabaseAdmin = createClient(url, serviceKey);

    // Ambil SEMUA data wilayah tanpa limit
    const { data: wilayah, error, count } = await supabaseAdmin
      .from('wilayah')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('❌ Error mengambil data wilayah:', error.message);
      return;
    }

    console.log(`\n🎉 Total data wilayah di database: ${wilayah.length}`);
    console.log('--------------------------------------------------');
    wilayah.forEach((w, index) => {
      console.log(`${index + 1}. [${w.kode_wilayah || 'NO-CODE'}] ${w.nama_wilayah} (Lat: ${w.latitude}, Lng: ${w.longitude})`);
    });
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Terjadi kesalahan:', err.message);
  }
}

test();
