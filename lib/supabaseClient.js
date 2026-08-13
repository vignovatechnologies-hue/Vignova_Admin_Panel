import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bzjkqopgtcwvisznmnkx.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6amtxb3BndGN3dmlzem5tbmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDY4MjAsImV4cCI6MjA5ODA4MjgyMH0.KAmHb7ap7-FswQcHBYKJUd32Y3JfmqFNGbFKgWZRPnQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);