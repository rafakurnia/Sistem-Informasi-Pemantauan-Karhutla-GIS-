// File: src/lib/supabase/public.js
// Client Supabase tanpa cookies — hanya untuk query publik yang tidak butuh sesi pengguna.
// Aman dipanggil dari mana saja termasuk luar request context (build time, cold start).

import { createClient } from "@supabase/supabase-js";

let _client = null;

export function createPublicClient() {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL dan Anon Key belum dikonfigurasi.");
  }

  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}
