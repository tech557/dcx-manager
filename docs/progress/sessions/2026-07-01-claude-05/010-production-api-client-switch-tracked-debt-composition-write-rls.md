## production-api-client-switch — TRACKED DEBT: channel_compositions_write RLS policy broken
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: process-governance
Status: Resolved
PO-Action: none
Version: v1.0.3.0
Change-Class: non-source

**RESOLVED 2026-07-01** (later same-day session, `2026-07-01-claude-06`): PO approved and the fix was
applied to `dcx-manager-dev` — new `app_user_is_any_editor()` helper + rewritten `channel_compositions_write`
policy, plus two more write policies found live (`composition_definitions_write`/
`channel_available_compositions_write`). Full detail: `output/PAC-addendum-composition-write-rls-fix.md`,
approval: `docs/backend/switch/apply-approval-dev-2026-07-01-composition-write-rls-fix.md`. Parity test
23/23 pass (was 22/23 with an expected-failure test).

Intent: Stand-alone, easy-to-find debt entry for a real bug found during PAC-R4, deliberately not fixed — PO wants a separate log entry to point a future agent at, rather than it being buried inside PAC-R4's log.
Trigger: PO request — "flag it as debt in the session log separately so i can call out an agent later to clear the debt"
Requirements covered: none (tracked debt, not yet actioned)

### The debt

`docs/backend/auth/rls-policies.sql`'s `channel_compositions_write` policy (applied to `dcx-manager-dev` at
PAC-R1):
```sql
CREATE POLICY channel_compositions_write ON channel_compositions FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM memberships m
            WHERE m.user_id = auth.uid()::text AND m.role IN ('editor','admin'))
  );
```
The `WITH CHECK` runs a **raw** subquery against `memberships`, which has RLS enabled with **zero** SELECT
policies (by design — only the 3 `SECURITY DEFINER` helper functions may read it). The subquery always
evaluates against an empty result set under the querying role, so **every insert is rejected — even for a
real editor/admin**. Confirmed live in PAC-R4: `POST /api/channels/:channelId/compositions` fails with
Postgres error `42501` for a real, correctly-permissioned test user.

**Root cause is the same class of bug already fixed elsewhere in this plan** (PAC-R2's `getMyAccessReal`/
`checkDCXAccessReal` had the identical issue — direct `memberships` queries instead of calling the RPC
helpers `app_user_workspace_ids()`/`app_user_can_edit()`). This one is a **policy**, not application code, so
fixing it needs a migration, not a `real-dispatch.ts` edit.

### Why it wasn't fixed

Found during **PAC-R4** (route parity + dev data seed), whose `allowed-writes`/`required-tools` do not
include `apply_migration` — only **PAC-R1** was granted schema-apply rights in this plan. When offered the
fix during a later turn (alongside the ClickUp-gated-auth migration), the **PO explicitly declined it**
("Approve only the auth-gating one") to keep that turn's blast radius narrow. It remains open by choice, not
oversight.

### Suggested fix (for whoever picks this up)

Rewrite the policy's `WITH CHECK` to call the existing `SECURITY DEFINER` helper instead of querying
`memberships` directly — mirroring every other `_write` policy in `rls-policies.sql`:
```sql
DROP POLICY channel_compositions_write ON channel_compositions;
CREATE POLICY channel_compositions_write ON channel_compositions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE app_user_can_edit(m.workspace_id)  -- or equivalent: check the composition's channel's implicit workspace scope
    )
  );
```
Actual correct condition needs a design decision: `channel_compositions` has no direct `workspace_id`
column (channels/compositions are a shared catalog, not tenant-scoped) — the original policy's intent
("any editor/admin in *any* workspace may add a composition") should probably be preserved verbatim, just
routed through a role check that doesn't hit the RLS-blocked table. Simplest fix: add a small
`SECURITY DEFINER` helper `app_user_is_any_editor()` (checks membership role across all of a user's
workspaces, no target workspace needed) and use that in the `WITH CHECK`, OR call `app_user_can_edit(...)`
per-workspace via a different query shape. **This needs a short design pass, not a blind copy-paste** — flag
for the next agent to read `docs/backend/auth/auth-model.md` and `rls-policies.sql` in full before writing
the migration.

Apply to `dcx-manager-dev` only, first — this plan's governance requires a recorded PO approval before
`apply_migration`, same as every other schema change in this plan (see `docs/backend/switch/apply-approval-dev*.md`
for the pattern). **Must be resolved before PAC-R6** (or any real use of user-defined compositions) per
`output/PAC-R4-parity.md`.

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| `channel_compositions_write` RLS policy rejects all inserts, even from real editors — needs a migration fix (design + PO-approved apply) before PAC-R6 or real composition-create use | Schema/RLS change requires recorded PO approval per this plan's governance (core.md §26a); also needs a short design decision (see above) before writing the migration | When ready: assign an agent to (1) design the corrected `WITH CHECK` clause, (2) get your apply approval, (3) apply to `dcx-manager-dev`, (4) re-run the PAC-R4 parity test's composition-write case to confirm the fix |

### Consumer updates required
- None yet.

### Open issues / follow-ups
- This is the single remaining known blocker before PAC-R6 (prod promotion) that isn't just "run PAC-R5/R6 as planned." Cross-referenced in `docs/plans/active/production-api-client-switch/README.md` carry-forward and `output/PAC-R4-parity.md`.
