import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Read Vite env safely from either the browser (import.meta.env) or Node/CI
 * (process.env) — mirrors the pattern in telemetry/capture-sink.ts so this
 * compiles under the isolated contract-check tsconfig (`types: []`).
 */
function readEnv(key: string): string | undefined {
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (viteEnv && viteEnv[key] !== undefined) return viteEnv[key];
  const nodeEnv = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  return nodeEnv?.[key];
}

export function isRealBackendEnabled(): boolean {
  return readEnv('VITE_USE_REAL_BACKEND') === '1' || readEnv('VITE_USE_REAL_BACKEND') === 'true';
}

let client: SupabaseClient<Database> | undefined;

/**
 * Lazily constructed singleton — avoids throwing at module-load time in
 * environments (tests, mock-only dev) that never touch the real backend.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) return client;

  const url = readEnv('VITE_SUPABASE_URL');
  const anonKey = readEnv('VITE_SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    throw new Error(
      'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are required when VITE_USE_REAL_BACKEND is enabled.',
    );
  }

  client = createClient<Database>(url, anonKey);
  return client;
}
