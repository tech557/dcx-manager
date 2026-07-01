#!/usr/bin/env node
/**
 * Manual re-sync of `allowed_members` from ClickUp workspace members.
 *
 * PO decision (2026-07-01): one-time seed + manual refresh, no scheduled
 * automation for v1. Re-run this whenever the ClickUp workspace membership
 * changes and the allow-list needs updating.
 *
 * Requires:
 *   CLICKUP_API_TOKEN   (ClickUp personal/API token — Settings > Apps)
 *   CLICKUP_TEAM_ID      (ClickUp workspace/team id)
 *   SUPABASE_URL (or VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY  (bypasses RLS for the upsert; never the anon key)
 *
 * Idempotent: upserts on `email` (primary key). Removing someone from ClickUp
 * does NOT automatically revoke them here — this script only adds/updates;
 * deletions must be done deliberately (see the commented block below) since a
 * silent auto-revoke could lock someone out unexpectedly.
 */
import { createClient } from '@supabase/supabase-js';

const clickupToken = process.env.CLICKUP_API_TOKEN;
const teamId = process.env.CLICKUP_TEAM_ID;
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!clickupToken || !teamId || !supabaseUrl || !serviceKey) {
  console.error(
    'sync-allowed-members: CLICKUP_API_TOKEN, CLICKUP_TEAM_ID, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are all required.',
  );
  process.exit(1);
}

async function fetchClickUpMembers() {
  const response = await fetch(`https://api.clickup.com/api/v2/team/${teamId}`, {
    headers: { Authorization: clickupToken },
  });
  if (!response.ok) {
    throw new Error(`ClickUp API error: ${response.status} ${await response.text()}`);
  }
  const body = await response.json();
  return body.team.members.map((m) => ({
    email: m.user.email,
    name: m.user.username ?? m.user.email,
    clickup_user_id: String(m.user.id),
  }));
}

async function main() {
  const members = await fetchClickUpMembers();
  const db = createClient(supabaseUrl, serviceKey);

  const { error } = await db
    .from('allowed_members')
    .upsert(members, { onConflict: 'email' });
  if (error) throw new Error(`allowed_members upsert failed: ${error.message}`);

  console.log(`sync-allowed-members: OK — upserted ${members.length} members.`);

  // Deliberately NOT auto-deleting members who left ClickUp. To revoke someone
  // manually once you've confirmed it's intentional:
  //   delete from allowed_members where email = '<email>';
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
