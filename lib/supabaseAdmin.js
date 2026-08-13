import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this file from client components.
// Requires SUPABASE_SERVICE_ROLE_KEY (Settings -> API -> service_role key)
// in .env.local. This key can bypass Row Level Security, so it must never
// be exposed with the NEXT_PUBLIC_ prefix or shipped to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseAdmin() {
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing from .env.local. Add it from Supabase Settings -> API."
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
