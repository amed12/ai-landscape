import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Singleton for auth — avoids multiple GoTrueClient instances
let _client: ReturnType<typeof createSupabaseClient> | null = null;
export function getClient() {
  if (!_client) _client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  return _client;
}
