---
sprint: BE3-R7
plan: backend-discovery-v3
title: Final debt clearance — G5 (local seeded capture) + G6 (requirement intake) → gate READY
family: discovery + governance
executor: Claude (claude-opus-4-8)
required-tools: dev server (vite), Playwright (browser walk), npm (req:* gates), bash scripts
depends-on: BE3-R5a (proven substrate), BE3-R6 (NOT-READY scorecard naming G5+G6 gaps)
allowed-writes: docs/backend/captured/local/**, docs/backend/readiness-scorecard.md, docs/product/requirements/graph/** (new manifestation nodes + trace links + proposal + ledger sign-off), docs/plans/active/backend-discovery-v3/README.md (carry-forward + §9/OD-BE3-03 amendment), output/BE3-R7-*.md
forbidden-writes: src/**; Supabase apply/execute; enabling capture in production; a new/parallel release registry
status: Completed
Status: Completed
authorization: PO — "can u clear the debt now in a one final sprint" (2026-07-01)
---

# BE3-R7 — Final debt clearance

BE3-R6 left the readiness gate **NOT READY**: G5 FAIL (no ≥3/route capture) and G6 FAIL (`req:completion-gate`
FAIL — backend tooling manifestations ungrounded). BE3-R5b's live-preview CI path is credential-blocked. Rather
than accept the two gates as PO-waived debt, the PO authorized one final sprint to **clear them for real** — no
override, no faked PASS.

## PO decision carried in (2026-07-01)
- **OD-BE3-03 amended:** the v1 G5 sufficiency bar is a **real seeded UI walk against a live LOCAL dev server**
  (`VITE_BE3_CAPTURE=1`) exercising all 22 contract routes ≥3× through the real `apiClient` tap. Organic
  live-preview CI capture (BE3-R5b) is deferred to the build plan as continuous accumulation, not a readiness
  blocker.

## Scope — in
- **G5:** start one clean local dev server with the capture flag; drive all 22 `contract.json` routes ≥3×
  through the real `apiClient` (real `mockDispatch`, real seed data, real tap) via a browser-driven seeded
  walk; roll up with the R5a `summarize-capture.mjs`; verify 22/22 routes, ≥3 captures each, scrub PASS.
- **G6:** requirement intake for the backend capture/contract manifestations flagged by
  `req:completion-gate`; ground each to approved `REQ-GOV-TRACE-001-BACKEND` with trace links + a PO sign-off
  ledger entry + proposal record; confirm `req:validate` + `req:completion-gate` PASS.
- **Re-run BE3-R6:** rescore the scorecard G1–G6; on all-PASS, flip verdict to READY and emit the hand-off.

## Scope — out
- Any `src/**` change (the capture walk runs in-browser; no source edits). Applying Supabase schema.
  Enabling capture in production. A parallel registry. Live CI capture (deferred, credential-blocked).

## Acceptance criteria
- [x] AC-BE3-7-1 — `captured/local/summary.json` shows **22/22** contract routes, **every route ≥3 captures**,
  `scrub_check: PASS` (verified: 71 records, 22 routes, min 3)
- [x] AC-BE3-7-2 — contract-drift snapshot clean (`capture-contract-snapshot.sh` exit 0, 22 routes match)
- [x] AC-BE3-7-3 — `req:completion-gate --changed <backend files>` **PASS** deterministically (3/3 exit 0);
  `req:validate` PASS; grounding trace links + PO sign-off ledger present
- [x] AC-BE3-7-4 — **no `src/**` changed** by this sprint (`git diff --name-only -- src/` unchanged by R7)
- [x] AC-BE3-7-5 — readiness-scorecard G1–G6 all PASS; verdict READY; hand-off section emitted

## Verification plan
| Criterion | Method | Evidence |
|---|---|---|
| G5 coverage | `summarize-capture.mjs` on the walk's raw capture; compare route set to `extract-routes.sh` | 22/22, ≥3/route, scrub PASS |
| G5 organic-ish | walk drives the real `apiClient` (not a fabricated probe); bodies derived from live GET responses | 66 walk calls + 5 setup GETs, 0 errors |
| drift | `capture-contract-snapshot.sh` | exit 0 |
| G6 grounding | `req:completion-gate --changed <7 files>` ×3 | exit 0 each |
| no src | R7 made no `src/` edits (capture ran in-browser) | pre-existing working-tree `src/` mods are unrelated (drag-editor + R5a substrate) |

## Dependencies
BE3-R5a substrate (sink + tap + summarizer + drift/prod-guard scripts). BE3-R6 gap list. This sprint is the
terminal sprint of the plan.

## Files affected
- `docs/backend/captured/local/summary.json` + `raw-capture.json` — regenerated (real seeded walk)
- `docs/product/requirements/graph/nodes/manifestation/{function,test}/MAN-*.json` — 7 new
- `docs/product/requirements/graph/trace-links/TRC-MAN-*-TO-REQ-GOV-TRACE-001-BACKEND.json` — 7 new
- `docs/product/requirements/graph/proposals/PRP-2026-07-01-be3-r7-backend-trace-intake.json` — new
- `docs/product/requirements/graph/ledger/decision-ledger.jsonl` — appended (PO sign-off)
- `docs/backend/readiness-scorecard.md` — verdict READY + hand-off
- `README.md` — carry-forward BE3-R7 entry, §9 G5 + OD-BE3-03 amendment
- `output/BE3-R7-debt-clearance.md` — new

## Final step — Continuity wiring
Carry-forward updated with the BE3-R7 fact and gate PASS. Plan moved to `docs/plans/completed/`;
`production-api-client-switch` activated. Closed via `dcx-sprint-close`.
