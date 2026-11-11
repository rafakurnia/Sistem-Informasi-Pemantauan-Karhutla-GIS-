// File: src/lib/supabase/admin.js
// Pemilik: Rafa
// ==============================================================================
// PERINGATAN KEAMANAN:
// File ini HANYA boleh di-import dari `src/actions/` dan `src/app/api/`.
// JANGAN PERNAH di-import dari komponen UI atau sisi klien (browser)!
// ==============================================================================

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Kredensial Admin Supabase belum lengkap. Pastikan SUPABASE_SERVICE_ROLE_KEY terisi di .env.local"
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

