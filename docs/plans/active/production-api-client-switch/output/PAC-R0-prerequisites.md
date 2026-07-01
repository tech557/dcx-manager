# PAC-R0 output — Prerequisites, PO confirmations & switch architecture

Date: 2026-07-01. Executor: Claude (claude-sonnet-4-6). Status: **Completed** — all 5 acceptance criteria met.

## AC-PAC-0-1 — readiness prerequisite

`backend-discovery-v3` readiness = **READY**, cited from `docs/backend/readiness-scorecard.md`: "Gate verdict:
🟢 READY — all six criteria PASS as of 2026-07-01 (BE3-R7 debt clearance)." G1–G6 all PASS. Plan may proceed.

## AC-PAC-0-2 — PO confirmations

Recorded in [`docs/backend/switch/po-confirmations.md`](../../../../backend/switch/po-confirmations.md) — all
4 product-model points confirmed, no TBD:
1. Access model → workspace-scoped RLS (delegated, reconfirmed)
2. Version creation (**OD-PAC-01**) → **duplicate-only**, no new endpoint (PO: "it should be a duplicate yes") — **closed**
3. Files scope → external-URL-only v1 (delegated, reconfirmed)
4. Integrations scope → ClickUp stub / AI separate / GAS out (delegated, reconfirmed)

Also recorded a PO clarification on version-bump mechanics (Iteration only for source changes, not a new
product decision — see doc for detail).

## AC-PAC-0-3 — requirement intake queued

Three `create-node` proposals queued via `req:propose` (actor: Claude (claude-sonnet-4-6)), all
`governance: proposed` / `confirmation_status: agent-proposed` — awaiting PO sign-off (`req:apply-after-signoff`,
out of PAC-R0 scope):

| Proposal | Node | For |
|---|---|---|
| `PRP-2026-07-01-create-node-REQ-BE-SCHEMA-001.json` | `REQ-BE-SCHEMA-001` | PAC-R1 schema apply |
| `PRP-2026-07-01-create-node-REQ-BE-AUTH-001.json` | `REQ-BE-AUTH-001` | PAC-R3 auth/RLS wiring |
| `PRP-2026-07-01-create-node-REQ-BE-API-001.json` | `REQ-BE-API-001` | PAC-R2 real dispatcher |

`npm run req:validate` → `{"pass": true, "errors": [], "warnings": []}`.

**Per the plan's ID-lock rule:** these are proposed, not yet PO-signed. PAC-R1..R6 still carry placeholder
traces until the PO runs sign-off — that is the **next PO action**, not something PAC-R0 can do itself.

## AC-PAC-0-4 — switch architecture recorded

Recorded in [`docs/backend/switch/architecture.md`](../../../../backend/switch/architecture.md):
- Flag: `VITE_USE_REAL_BACKEND`, default off, read once at the `apiClient` composition root
- Cutover (**OD-PAC-04**) → **whole-dispatcher flip**, decided over per-route strangler — **closed**
- Real-dispatcher shape: `src/services/real-dispatch.ts`, same 22-route signature as `mock-dispatch.ts`, reuses `api-mappers.ts` unchanged
- Apply order: dev-first (PAC-R1) → build/wire on dev (PAC-R2/R3) → parity (PAC-R4) → flagged preview (PAC-R5) → prod (PAC-R6, PO-signed only)
- OD-PAC-02, OD-PAC-03 explicitly deferred to PAC-R2/PAC-R4 respectively (not blocking PAC-R0)

## AC-PAC-0-5 — no src/** changed, no Supabase apply

- `git diff --name-only -- src/` shows only `src/services/api-client.ts`, a **pre-existing uncommitted change
  from prior work** (BE3-R5a capture-tap instrumentation), not touched by this sprint. PAC-R0 itself wrote
  only `docs/backend/switch/**`, `docs/product/requirements/graph/proposals/**`, and this output file.
- `list_migrations` (Supabase MCP) on both `dcx-manager-dev` (`ibekkxqujqvlajeldpoa`) and `dcx-manager-prod`
  (`xokgguodxjjwokngyquo`) → `{"migrations":[]}` on both — confirms no schema apply occurred.

## Gate results (non-source sprint — docs-only closeout gate)

`npm run req:validate` → PASS (0 errors, 0 warnings). No `src/**`/`scripts/**` change originates from this
sprint, so the full source-sprint gate set (typecheck/lint/test/verify/etc., core.md §"Standard closeout
gates") does not apply — this is a planning/governance sprint per its own frontmatter (`family: planning /
governance`).

## What happens next (PO action required — stop point)

Per the plan's two-stage activation and ID-lock rule: **PAC-R1..R6 cannot execute yet.** The PO must:
1. Sign off the 3 queued `REQ-BE-*` proposals (`npm run req:apply-after-signoff -- --id <PRP-id> --signoff <ref>` for each), which mints the real `REQ-BE-SCHEMA-001` / `REQ-BE-AUTH-001` / `REQ-BE-API-001` node IDs into the graph.
2. Only then may PAC-R1 (and later sprints) replace their placeholder Requirement Trace with these exact signed IDs and execute.

This is a genuine PO-only action (signoff is a recorded human approval, not something an agent may self-sign) — execution stops here pending it.
