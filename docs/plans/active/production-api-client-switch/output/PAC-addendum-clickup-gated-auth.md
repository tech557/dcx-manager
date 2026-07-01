# PAC addendum — ClickUp-gated Google/email sign-in + assignable roster

Date: 2026-07-01. Executor: Claude (claude-sonnet-4-6). Status: **Completed** (auth-gating scope; roster-UI
wiring explicitly deferred).

Mid-plan scope addition, requested directly by the PO, executed outside the PAC-R0..R6 sprint numbering —
same governance pattern as the PAC-R2 Codex-review response. Supersedes part of the PAC-R0 "ClickUp stays a
stub" decision — see `docs/backend/switch/po-confirmations.md` for the formal record.

## What was built

1. **`allowed_members` table** (`dcx-manager-dev`) — `email` (PK), `name`, `clickup_user_id`, `synced_at`.
   RLS: `SELECT` for any authenticated user (catalog-style, matches `channels_read`'s pattern); no write
   policy (only `service_role`/elevated access writes it, by design — this is an allow-list, not user data).
2. **`enforce_allowed_signup()` trigger** — `BEFORE INSERT ON auth.users`, `SECURITY DEFINER`. Rejects the
   insert (raises an exception, aborting the whole sign-up transaction) if the new user's email isn't in
   `allowed_members`. Fires identically for Google OAuth and email magic-link sign-ups — enforced at the
   database level, not the UI, so it can't be bypassed by calling Supabase Auth directly.
3. **Seeded 21 members** from ClickUp's `clickup_get_workspace_members` (fetched live 2026-07-01) — mostly
   `@dotment.com`, one `@gmail.com` (Nourhan), unchanged verbatim from what ClickUp returned (including
   generic entries like "Tech Bot" and "Freelancer" — not pruned; the PO can remove any of these from
   `allowed_members` directly if undesired).
4. **`scripts/backend/sync-allowed-members.mjs`** (new) — the reusable, documented re-sync script for future
   manual refreshes (PO decision: one-time seed now, manual re-run later, no scheduled automation). Needs a
   ClickUp API token + `SUPABASE_SERVICE_ROLE_KEY` (neither available to this session directly — this
   session's seed was done via the ClickUp MCP + `execute_sql`, elevated access).

## Verification

- **Blocked case** (SQL-level, via a rolled-back transaction simulating GoTrue's insert): a non-listed email
  → `ERROR: P0001: Sign-up not allowed: ... is not an authorized team member`. Insert aborted, transaction
  rolled back — no partial state.
- **Allowed case** (same method): a real roster email (`mahmoud.samaha@dotment.com`) → insert succeeds
  cleanly (rolled back afterward, no real row persisted).
- **Live GoTrue signup** (via the actual anon-key + `db.auth.signUp()`, the real code path): confirmed the
  reject path triggers (500 error) for an unlisted email. The allow path via live signup hit Supabase's
  built-in signup rate limit (a handful of signups/hour) before it could be re-verified live — the SQL-level
  test above is the authoritative proof for the allow path, since the trigger logic itself is identical
  regardless of which path (SQL insert vs. GoTrue API) inserts the row.
- **`get_advisors` security**: found and fixed a real issue — `enforce_allowed_signup()` defaulted to
  `PUBLIC`-executable (exposed via `/rest/v1/rpc/enforce_allowed_signup`), same class of issue as PAC-R1's
  RLS-helper-function finding. Revoked `EXECUTE` from `anon`, `authenticated`, **and `PUBLIC`** (the actual
  source of the grant — `REVOKE FROM anon/authenticated` alone doesn't remove a `PUBLIC` grant, confirmed via
  `information_schema.routine_privileges`). Re-verified the trigger still fires correctly after the revoke
  (trigger execution is independent of RPC-exposure grants). Final grantees: `postgres`, `service_role` only.

## Explicitly deferred (not built in this pass)

**Wiring `allowed_members` into the app's assignee/team pickers.** The PO's ask was "this will also work as
users that u can assign in the app" — the data now exists (`allowed_members`, readable by any authenticated
user), but there is no route in the frozen 22-route contract to serve it, and no UI change was made. Building
this properly needs: a new contract route (e.g. `GET /api/team-members`), `real-dispatch.ts` + `mock-dispatch.ts`
wiring, an `Api*` type, mapper coverage, and a UI picker component change — a real, if small, scope addition
requiring its own design pass. Flagged here rather than bolted on ad hoc.

## Gates

| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| req:validate | PASS |
| get_advisors security | 1 new finding found + fixed (PUBLIC-exposed trigger function); baseline otherwise unchanged from PAC-R3 |
| prod untouched | PASS — `list_migrations` (`xokgguodxjjwokngyquo`) = `[]` |
