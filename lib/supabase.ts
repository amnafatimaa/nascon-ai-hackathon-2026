// lib/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Global variables to persist clients across Next.js re-renders in dev
declare global {
  var __supabaseInstance: SupabaseClient | undefined;
  var __supabaseAdminInstance: SupabaseClient | undefined;
}

// 1. Standard Client (Public / Client-side)
export const supabase =
  globalThis.__supabaseInstance ??
  createClient(supabaseUrl, supabaseAnonKey);

if (process.env.NODE_ENV !== "production") {
  globalThis.__supabaseInstance = supabase;
}

// 2. Admin Client (Server-side / API routes only)
// Falls back to anon key if service role key isn't provided
export const supabaseAdmin =
  globalThis.__supabaseAdminInstance ??
  createClient(
    supabaseUrl,
    supabaseServiceRoleKey || supabaseAnonKey
  );

if (process.env.NODE_ENV !== "production") {
  globalThis.__supabaseAdminInstance = supabaseAdmin;
}