# PO approval — apply ClickUp-gated auth migration to Supabase dev

| Field | Value |
|---|---|
| Scope | Add `allowed_members` table (email, name, clickup_user_id, synced_at) + RLS read policy + a `BEFORE INSERT ON auth.users` trigger that rejects sign-up for any email not present in `allowed_members`. Applied to **`dcx-manager-dev`** (`ibekkxqujqvlajeldpoa`) only |
| Explicitly excluded | `dcx-manager-prod` (`xokgguodxjjwokngyquo`) — untouched; the separate `channel_compositions_write` RLS-policy fix from PAC-R4 was **declined** this round (stays BLOCKED/documented) |
| Requested by | Claude (claude-sonnet-4-6), following a direct user request for Google/email sign-in gated to ClickUp workspace members |
| Approved by | Mahmoud (PO) |
| Date | 2026-07-01 |
| Approval text | "Approve only the auth-gating one" |
| Scope decision (superseding PAC-R0) | ClickUp integration moves from "stub" to a real one-time member-list sync for auth allow-listing + assignment roster — see updated `docs/backend/switch/po-confirmations.md` |
| Sync method | One-time seed now (21 members fetched via ClickUp MCP `clickup_get_workspace_members`); manual re-run later, no scheduled automation (PO decision) |
| Sign-in method | Both Google OAuth and email magic-link stay available (PO: "keep email as a fallback"); both gated by the same trigger |

This is a governance record for a mid-plan scope addition to `production-api-client-switch`, executed
outside the PAC-R0..R6 sprint numbering (an ad-hoc addendum, logged in the session log and plan carry-forward
like the PAC-R2 Codex-review response was).
