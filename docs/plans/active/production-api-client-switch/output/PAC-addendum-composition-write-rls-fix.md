# PAC addendum — clear tracked debt: channel_compositions_write RLS fix

Date: 2026-07-01. Executor: Claude (claude-sonnet-4-6). Status: **Completed**.

Clears the tracked debt logged in `docs/progress/sessions/2026-07-01-claude-05/
010-production-api-client-switch-tracked-debt-composition-write-rls.md` (= PAC-R4 finding #3 in
`output/PAC-R4-parity.md`), the single remaining known blocker before PAC-R6 for real composition-create use.
Mid-plan addendum, outside PAC-R0..R6 sprint numbering — same pattern as the ClickUp-gated-auth addendum.

## What was wrong

`channel_compositions_write`'s `WITH CHECK` ran a raw `EXISTS (SELECT 1 FROM memberships ...)` under the
querying role. `memberships` has RLS enabled with **zero** SELECT policies (by design — only `SECURITY
DEFINER` helpers may read it), so the subquery always evaluated empty — every insert rejected, even for a
real editor/admin. Same fix class as PAC-R2's `getMyAccessReal`/`checkDCXAccessReal`, but this one is a
policy, needing a migration rather than an application-code edit.

## What was built

1. **`app_user_is_any_editor()`** (new `SECURITY DEFINER` helper, `schema-auth-additions.sql`) — checks
   editor/admin role across *any* of the user's workspaces, no target workspace needed (unlike
   `app_user_can_edit(target_workspace)`), because `channel_compositions` has no workspace column.
2. **`channel_compositions_write`** rewritten to `WITH CHECK (app_user_is_any_editor())` — preserves the
   original policy's intent verbatim, just routed through the helper.
3. **Second bug found live, same turn:** once the first insert succeeded, `createComposition`
   (`real-dispatch.ts`) cascades into `composition_definitions` and `channel_available_compositions` —
   both had **read-only** policies with no INSERT policy at all (invisible until the first blocker was
   cleared). Added `composition_definitions_write`/`channel_available_compositions_write`, same
   `app_user_is_any_editor()` check, PO-approved as an in-turn scope extension.
4. **`real-dispatch.parity.test.ts`** — the composition-write test rewritten from
   `rejects.toMatchObject({ code: '42501' })` (asserting the known-broken behavior) to a real
   success + shape-equivalence assertion, matching every other write-route test in the file.

Both migrations applied to `dcx-manager-dev` (`ibekkxqujqvlajeldpoa`) only. Approval record:
`docs/backend/switch/apply-approval-dev-2026-07-01-composition-write-rls-fix.md`.

## Verification

- `POST /api/channels/:channelId/compositions` via the real dispatcher now succeeds for the PAC-R4 fixture
  editor user (previously `42501`).
- `real-dispatch.parity.test.ts`: **23/23 pass** (was 22/23 with 1 KNOWN-BLOCKED expected-failure test).
- Full suite: **115/115 pass** (`npm run test`; 2 unrelated 5s-timeout flakes on network-bound tests,
  confirmed pre-existing and non-blocking by re-running each alone with a longer timeout — not caused by
  this change).
- `npm run typecheck` / `npm run lint`: PASS.
- `get_advisors` (security, dev): `app_user_is_any_editor()` shows the same pre-existing
  `authenticated_security_definer_function_executable` WARN as the other 3 helper functions
  (`app_user_can_edit`, `app_user_workspace_ids`, `app_version_workspace`) — no new issue class introduced.
- Prod (`xokgguodxjjwokngyquo`) confirmed untouched: `list_migrations` = `[]`.

## Gates

| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| test | PASS (115/115; 2 pre-existing network-timeout flakes, reproduced as non-blocking) |
| parity suite | PASS (23/23, was 22/23) |
| get_advisors security | no new issue class |
| prod untouched | PASS (`list_migrations` = `[]`) |
