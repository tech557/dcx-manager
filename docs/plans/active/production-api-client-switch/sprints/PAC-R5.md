---
sprint: PAC-R5
plan: production-api-client-switch
title: Cutover behind flag on a preview (dev backend)
family: backend / release / source
executor: Claude / Codex (Vercel preview + Supabase dev)
required-tools: npm (build), Vercel preview, Playwright/preview MCP
depends-on: PAC-R4
allowed-writes: src/config/**, .env.preview (non-secret flags), docs/backend/switch/**, output/PAC-R5-*.md
forbidden-writes: dcx-manager-prod, production promotion, enabling real backend in production
status: Drafted
Status: Drafted
---

# PAC-R5 — Cutover behind flag on a preview

Enable `VITE_USE_REAL_BACKEND` on a **preview** (pointing at `dcx-manager-dev`), run the app end-to-end, and
confirm real capture matches the contract — proving the switch works before any production promotion.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-BE-API-001`, `REQ-BE-AUTH-001`; `EVD-*` (preview evidence) |
| Scope/type | release rehearsal (preview only; prod untouched) |
| Acceptance outcomes | AC-PAC-5-1 … AC-PAC-5-5 |
| Expected manifestations | preview config enabling the flag; captured summary of the real-backend preview |
| Actual manifestations (reuse) | `.github/workflows/backend-capture.yml` (BE3-R5b), `cicd-release-governance` preview pipeline |
| Gate result | end-to-end app flows work on real backend; capture + advisors clean |

## Requirement Trace — 🔒 ID LOCK (audit blocking #1)
MUST NOT execute until `REQ-BE-*` / `EVD-*` are replaced with the exact PO-signed IDs from PAC-R0.

> **Consumes LIVE capture, not the local synthetic proof (audit advisory #1).** This sprint's capture evidence
> is the eventual **live** `docs/backend/captured/<version>/summary.json` produced by `backend-capture.yml` on
> this preview — **not** the current local synthetic 21/22 @1-sample proof from discovery. Activation is gated
> on backend-discovery-v3 = READY (real G5 capture exists).

## Intent
De-risk the cutover: exercise the real backend in a production-like preview, with mock still default everywhere
else, before promotion.

## Step 0 — Session environment + carry-forward (MANDATORY)
1. `bash scripts/agent/build-current-state.sh`; read carry-forward + the RG preview pipeline + BE3-R5b workflow.
2. Confirm env hygiene (one clean server) before any preview/Playwright verification.

## Scope — in
- Enable `VITE_USE_REAL_BACKEND=1` for a **preview build** targeting `dcx-manager-dev` (never prod).
- Run the app's real user journeys (Home → Version → Builder → task creation → status change) against the real
  backend on the preview; verify each feature works (the endpoint→feature map is the checklist).
- Let `backend-capture.yml` capture the real-backend preview; confirm contract-drift + coverage gates green.
- `get_advisors` on dev after real usage; record.

## Scope — out
- Production apply/promotion (PAC-R6). Enabling the flag in production. Pointing preview at prod.

## Acceptance criteria
- [ ] AC-PAC-5-0 — the exact PO-signed `REQ-BE-*` / `EVD-*` IDs from PAC-R0 are present in the trace (no wildcard) — else BLOCKED (doc-verifiable)
- [ ] AC-PAC-5-1 — a preview runs with `VITE_USE_REAL_BACKEND=1` against dev; the core journeys work (browser-verifiable: evidence in `output/evidence/`)
- [ ] AC-PAC-5-2 — every feature group (A–F from the overview) verified on real backend; integrations (G) still stubbed (browser-verifiable)
- [ ] AC-PAC-5-3 — contract-drift + capture-coverage gates green on the preview (code-verifiable)
- [ ] AC-PAC-5-4 — `get_advisors` clean after real usage (tool-verifiable)
- [ ] AC-PAC-5-5 — production untouched; mock remains the default outside this preview (tool/code-verifiable)

## Verification plan
| Criterion | Method | Evidence |
|---|---|---|
| e2e on real backend | Playwright journeys on the preview | screenshots in `output/evidence/` (core.md §32) |
| feature coverage | endpoint→feature checklist | each group verified |
| gates | drift + coverage on preview | green |
| prod untouched | prod `list_tables` | still empty |

## Standard closeout gates + fallbacks (README §Standard closeout gates; audit blocking #3)
- Build/source gates: `npm run build` (capture build), `typecheck` · `lint` · `validate:architecture` · `test` · `verify:frontend` · `req:validate` · `req:reconcile` (changed) · `req:completion-gate` · `sprint-doctor`.
- **Browser/preview fallback (§28):** if Playwright/preview MCP or a Vercel preview is unavailable, run the capture build + a local `vite preview`/dev server and verify HTTP 200 + console via a reachable method — record it as `dev-smoke (fallback)`, mark the screenshot gate `BLOCKED — browser/preview MCP unavailable`, and log the missing tool. Never claim browser verification without a running server.

## Server/preview cleanup (audit advisory #2)
On close: **record the preview URL + GitHub run id** (and the captured `<version>` summary path); **stop any
local server** started for the walk (free port 3000 per env-hygiene); save all screenshots under
`output/evidence/` (core.md §32 — never the repo root).

## Dependencies
PAC-R4 (parity). Blocks PAC-R6.

## Files likely affected
- `src/config/**`, `.env.preview` — edit (flag; non-secret)
- `output/PAC-R5-cutover.md` (+ `output/evidence/`) — create

## Final step — Continuity wiring (MANDATORY)
Append to carry-forward: preview cutover proven (journeys, gates, advisors), mock still default, prod untouched
— ready for PO-gated promotion. Close via `dcx-sprint-close`.
