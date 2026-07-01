# PO confirmations — `production-api-client-switch` (PAC-R0)

Records the four product-model points the plan's README (§"Decisions carried in from discovery") required
confirming before PAC-R1+ can execute. All four are confirmed — no "TBD".

| # | Point | Decision | Confirmed |
|---|---|---|---|
| 1 | Access model | **Workspace-scoped RLS** (`MyAccess.workspaceIds`), not per-DCX. Carried from `backend-discovery-v3` OD-BE3-02. | ✅ 2026-07-01 — PO confirmed as delegated (no change) |
| 2 | Version creation (**OD-PAC-01**) | **Duplicate-only** for v1 — no create-from-scratch `POST /versions` route added. The existing `POST /versions/:sourceVersionId/duplicate` stays the only way to create a version. | ✅ 2026-07-01 — PO: "it should be a duplicate yes" |
| 3 | Files scope | **External-URL-only** for v1 (no Supabase Storage). Attachments UI is not wired today; matches `backend-discovery-v3` OD-BE3-05. | ✅ 2026-07-01 — PO confirmed as delegated (no change) |
| 4 | Integrations scope | **ClickUp stub, AI build-next (separate plan), GAS out.** Matches `backend-discovery-v3` decision-matrix. | ✅ 2026-07-01 — PO confirmed as delegated (no change) — **SUPERSEDED 2026-07-01, see below** |

## Decision #4 superseded — ClickUp is now a real integration (auth allow-listing + roster)

**2026-07-01, mid-plan scope addition.** The PO requested Google/email sign-in restricted to ClickUp
workspace members, with the same roster usable for in-app assignment. This makes ClickUp a **real**
integration, not a stub, for this specific purpose (member-list sync) — the "AI build-next (separate)" and
"GAS out" parts of decision #4 are unaffected.

| Field | Value |
|---|---|
| Mechanism | `allowed_members` table (email/name/clickup_user_id) synced from ClickUp's `clickup_get_workspace_members`; a `BEFORE INSERT ON auth.users` trigger (`enforce_allowed_signup`) rejects sign-up for any email not on the list — enforced at the database level, for both Google OAuth and email magic-link |
| Sync method | **One-time seed now** (21 members fetched 2026-07-01), **manual re-run later** — PO explicitly declined scheduled/automated sync for v1 |
| Sign-in method | **Both** Google OAuth and email magic-link stay available (PO: "keep email as a fallback") — both gated by the same trigger, no UI change needed |
| Applied to | `dcx-manager-dev` only — see `apply-approval-dev-2026-07-01-clickup-gated-auth.md` |
| Assignable-in-app roster | `allowed_members` is the intended source for assignment pickers — **wiring the actual UI/contract route is a follow-up**, not done in this pass (would need a new contract route + UI change, both out of this plan's original frozen-contract scope) |

## Related PO note — versioning mechanics (not a product-model point, recorded for continuity)

While confirming point #2, the PO clarified a **`docs/VERSION.md` governance point**, not a product decision:
when PAC-R2+ sprints touch `src/**`, the mechanical version bump is the **Iteration** field only (per the
4-part `Major.Stage.Iteration.Revision` scheme, `core.md §26` / `VERSION.md`) — **not** Major/Stage, which stay
PO-only and are untouched by this build plan. This is already the standing rule; no new decision was made,
just confirmed as the plan begins touching source code.

## Resolution status

All 4 points resolved. **OD-PAC-01 is now closed**: duplicate-only, no new endpoint — PAC-R2's contract
surface is unchanged (still the frozen 22 routes, no addition). This removes the "or add a create endpoint"
branch from the open-decisions table in the plan README.
