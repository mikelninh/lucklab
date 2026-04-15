/**
 * Supabase client — optional.
 *
 * Kairos Lab MVP does not require Supabase. When we add it (for persistent
 * readings, the Synchronicity Journal, 90-day Return automation, and gift
 * code redemption), this is the single place we instantiate the client.
 *
 * Env vars required when enabled:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY   (public — safe in browser)
 *   SUPABASE_SERVICE_ROLE_KEY       (server-only — DO NOT expose)
 *
 * Run `supabase/schema.sql` in the Supabase SQL editor to create tables.
 *
 * Install when ready:
 *   npm install @supabase/supabase-js
 */

// import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Public (anon) client — for reads that pass RLS.
 * Returns null if Supabase is not configured (MVP fallback).
 */
export function getSupabaseAnon(): unknown {
  if (!isSupabaseConfigured()) return null;
  // Uncomment when @supabase/supabase-js is installed:
  // return createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // );
  return null;
}

/**
 * Service-role client — server-only, bypasses RLS.
 * Use from API routes / webhooks only.
 */
export function getSupabaseAdmin(): unknown {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  // return createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY!,
  //   { auth: { autoRefreshToken: false, persistSession: false } },
  // );
  return null;
}
