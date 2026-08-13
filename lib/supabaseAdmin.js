import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Requires SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bzjkqopgtcwvisznmnkx.supabase.co";

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6amtxb3BndGN3dmlzem5tbmt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjUwNjgyMCwiZXhwIjoyMDk4MDgyODIwfQ.g1-3MCNpHzJUXRLtMCZ3Bytd_0uuLQRlxotHyEh8tzY";

export function getSupabaseAdmin() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

