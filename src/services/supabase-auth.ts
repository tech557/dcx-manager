/**
 * Real Supabase Auth session wiring (PAC-R3). Provider = email magic-link +
 * OAuth (OD-BE3-04). This module owns the Supabase Auth session; it does not
 * change the `MyAccess`/`DCXAccess` interface (`access.service.ts` /
 * `real-dispatch.ts` read the session via `supabase.auth.getUser()` directly).
 */
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase-client';

export async function signInWithEmail(email: string): Promise<void> {
  const db = getSupabaseClient();
  const { error } = await db.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function signInWithOAuth(provider: 'google'): Promise<void> {
  const db = getSupabaseClient();
  const { error } = await db.auth.signInWithOAuth({ provider });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const db = getSupabaseClient();
  const { error } = await db.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession(): Promise<Session | null> {
  const db = getSupabaseClient();
  const { data, error } = await db.auth.getSession();
  if (error) throw error;
  return data.session;
}

/** Returns an unsubscribe function — call it on unmount. */
export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): () => void {
  const db = getSupabaseClient();
  const {
    data: { subscription },
  } = db.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}
