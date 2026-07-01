# Backend Discovery v3 — Output-Review Resolution (Claude)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Type: audit-review (resolution) · Version: v1.0.1.0 · Change-Class: source

Resolves all three findings in [`2026-07-01-codex-output-review.md`](./2026-07-01-codex-output-review.md).
The gate verdict is unchanged (still **NOT READY** — G5/G6 fail); these fixes make the control documents
accurate and the workflow genuinely capable.

## P1 (type-check) — RESOLVED ✅
**Finding:** `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` failed after R5a —
`capture-sink.ts:39` referenced the bare `process` global, which the isolated config (`types: []`) can't
resolve (TS2591 ×3).
**Fix:** `src/telemetry/capture-sink.ts` now reads the node/CI env via
`(globalThis as {...}).process?.env` instead of the bare `process` identifier — no Node type globals needed.
**Verified:** `tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` → **exit 0**; root `npm run
typecheck` → pass; `capture-sink.test.ts` → 7/7; `npm run test` → 92/92. G1 evidence in R1/R6 is true again.

## P1 (workflow doesn't exercise every route) — RESOLVED ✅
**Finding:** the workflow's seeded journey passed the route list into `page.evaluate` but never used it — it
only read `window.__BE3_CAPTURE__` and flushed, so it could not satisfy AC-BE3-5b-3/G5. The README claim that
capture "accumulates automatically once live" was too strong.
**Fix:** `.github/workflows/backend-capture.yml` now runs the **Vite dev server** (which serves `/src`
modules), and the seeded walk **imports the real `apiClient` and drives every route** from
`extract-routes.sh` (ids substituted from seed; per-route best-effort). The overstated claim is softened in
`README.md` and `BE3-R5b-live-capture.md` — live CI creds are still required. Locally this walk captured
**21/22** method+template routes (only `PATCH /versions/:id/status` un-captured — the mock rejects that
transition). R5b remains **Partial** for the live run (credentials), not for workflow capability.

## P2/P3 (capture-count inconsistency + wrong granularity) — RESOLVED ✅
**Finding:** docs said local coverage was 6/22, but the artifact had 5 records / 5 routes; the coverage was
measured by path only, which over-credited (`POST /activity-logs` counted because `GET /activity-logs` was
seen) and fragmented parameterized routes.
**Fix:** `scripts/backend/summarize-capture.mjs` now **normalizes concrete captured paths to their contract
template** (via `extract-routes.sh`) and groups by **method+template**; the coverage gate compares at the same
granularity. The local artifact was **re-run and committed** (`docs/backend/captured/local/summary.json`, 23
records → 21 method+template routes). All control docs (scorecard G5, R5a/R5b/R6 outputs, README carry-forward)
now cite the accurate number: **21/22 method+template routes, 1 synthetic sample each** — still below the
OD-BE3-03 N≥3 organic threshold, so **G5 still FAILs**.

## Re-run checks
| Check | Result |
|---|---|
| `tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` | PASS (exit 0) |
| `npm run typecheck` | PASS |
| `npm run verify:frontend` | PASS (299 modules, 0 violations) |
| `npm run test` | PASS (92) |
| `capture-contract-snapshot.sh` | PASS (no drift) |
| `assert-capture-off-in-prod.sh` (prod+flag) | correctly FAILS |
| local summary scrub_check | PASS |
| `backend-capture.yml` YAML | valid (10 steps) |

## Note to PO — unrelated concurrent edits observed
While remediating, four UI files were modified in the shared working tree by a **concurrent process** (a
frontend-polish workstream — `src/ui/atoms/Input.tsx` `hint`/`locked` affordances,
`src/ui/forms/date/CommunicationDateField.tsx`, `src/builder/islands/EditorViewerIsland/*`). These are **not**
part of backend-discovery-v3 and were **left untouched**. Flagging so they are not mistakenly attributed to
this plan at commit time.
