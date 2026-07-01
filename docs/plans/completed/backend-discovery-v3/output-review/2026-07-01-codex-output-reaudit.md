# Backend Discovery v3 Output Re-Audit — Codex

Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-07-01
Type: audit-review
Version: v1.0.1.0
Change-Class: non-source

## Verdict

**Previous blocking findings resolved.** The changed output is now acceptable as an honest **NOT READY**
control record: G1–G4 pass, G5/G6 remain failed for the right reasons, and the hand-off to
`production-api-client-switch` is still withheld.

## Findings

### P3 — Stale follow-up text in R5b should be cleaned up

`docs/plans/active/backend-discovery-v3/output/BE3-R5b-live-capture.md` now says the seeded walk imports
`apiClient` and drives every contract route, with 21/22 captured locally. But its follow-up still says to
"Tune the seeded journey walk to deterministically hit all 22 routes (needs a small preview-only app hook...)"
even though the current blocker is narrower: `PATCH /versions/:versionId/status` is not captured because the
mock rejects that transition. This is not a readiness blocker, but it should be rewritten to avoid sending the
next agent back toward the already-rejected app hook approach.

Recommended wording: tune the probe data/state so `PATCH /versions/:versionId/status` succeeds, or explicitly
document that the route requires a seeded version state that permits the transition.

## Prior Findings Rechecked

| Prior finding | Current verdict | Evidence |
|---|---|---|
| P1 contract-check failed on bare `process` | ✅ RESOLVED | `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` exits 0; `src/telemetry/capture-sink.ts` uses `globalThis.process?.env` |
| P1 workflow flushed sink without exercising routes | ✅ RESOLVED | `.github/workflows/backend-capture.yml` now imports `/src/services/api-client.ts`, iterates `extract-routes.sh`, substitutes ids, and calls each route best-effort |
| P2 capture count was inconsistent | ✅ RESOLVED | `docs/backend/captured/local/summary.json` has 23 records / 21 observed method+template routes; coverage computation reports 21/22 with only `PATCH /versions/:versionId/status` missing |

## Checks Run

| Check | Result |
|---|---|
| `bash scripts/agent/build-current-state.sh` | PASS; active plan `backend-discovery-v3`; code index stale |
| `bash scripts/agent/verify-tooling-state.sh` | PASS; verify.sh pass; code index stale |
| `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` | PASS |
| `npm run typecheck` | PASS |
| `bash scripts/backend/capture-contract-snapshot.sh` | PASS — no drift, 22 routes match committed contract |
| coverage recompute against `docs/backend/captured/local/summary.json` | PASS — 21/22; missing `PATCH /versions/:versionId/status` |
| `bash scripts/backend/summarize-capture.sh docs/backend/captured/local/raw-capture.json /private/tmp/be3-summary-check.json` | PASS — 21 routes, scrub PASS |
| `cmp` regenerated summary vs committed summary | PASS — byte-identical |

## Gate State

No change to readiness: **BE3 remains NOT READY** until:

1. G5 has live organic preview capture with at least 3 payloads per route.
2. G6 requirement intake links or exempts the 8 backend manifestations.

That is the correct state; no backend handoff should be emitted yet.
