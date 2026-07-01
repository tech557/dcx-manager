# PO approval — apply channel_compositions_write RLS fix to Supabase dev

| Field | Value |
|---|---|
| Scope | (1) Add `app_user_is_any_editor()` SECURITY DEFINER helper; (2) rewrite `channel_compositions_write`'s `WITH CHECK` to call it instead of a raw `memberships` subquery; (3) add missing `composition_definitions_write`/`channel_available_compositions_write` INSERT policies (discovered live, same design gap). Applied to **`dcx-manager-dev`** (`ibekkxqujqvlajeldpoa`) only |
| Explicitly excluded | `dcx-manager-prod` (`xokgguodxjjwokngyquo`) — untouched |
| Requested by | Claude (claude-sonnet-4-6), clearing the tracked debt logged in `docs/progress/sessions/2026-07-01-claude-05/010-production-api-client-switch-tracked-debt-composition-write-rls.md` (PAC-R4 finding #3) |
| Approved by | Mahmoud (PO) |
| Date | 2026-07-01 |
| Approval text | "Yes, apply to dev only" (first policy); "Yes, add both write policies now" (join-table extension, discovered live after the first migration exposed the second gap) |
| Design | New helper `app_user_is_any_editor()` — no target-workspace argument, mirrors `app_user_workspace_ids()`/`app_user_can_edit()`. Needed because `channel_compositions` (and its join tables) are a shared catalog with no `workspace_id` column; the original policy's intent ("any editor/admin in *any* workspace may add a composition") is preserved verbatim, just routed through `SECURITY DEFINER` so it can read `memberships` despite that table having zero SELECT policies |
| Verification | `src/services/__tests__/real-dispatch.parity.test.ts`'s composition-write test rewritten from an expected-failure assertion to a real success assertion; 23/23 parity tests + 115/115 full suite pass; `get_advisors` security shows no new issue class (same pre-existing WARN pattern as the other 3 helper functions) |

This is a governance record for a mid-plan debt-clearance addendum to `production-api-client-switch`, executed
outside the PAC-R0..R6 sprint numbering — same pattern as the ClickUp-gated-auth addendum
(`apply-approval-dev-2026-07-01-clickup-gated-auth.md`).
