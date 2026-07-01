# BE3-R5b — Live CI data capture (output)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Version: v1.0.1.0 · Change-Class: non-source
**Status: PARTIAL** — CI trigger is PO/credential-blocked (allowed by the sprint's `may-close-partial: yes`).
The substrate is proven independently in BE3-R5a, so this does **not** stall the plan.

## What this sprint produced

The CI wiring that makes real backend data accumulate mechanically from previews — authored and locally
validated, but not yet run live (needs GitHub Actions write + a preview deploy of a source change).

| Artifact | Path | State |
|---|---|---|
| Capture workflow | `.github/workflows/backend-capture.yml` | authored; YAML valid (10 steps); reuses RG `deployment_status` trigger + `patch-release-row.sh` |
| Raw-capture ignore | `.gitignore` | raw captures ignored; only summaries committed (verified) |
| Captured summaries | `docs/backend/captured/<version>/summary.json` | produced by CI on a real preview (pending live run); local proof at `docs/backend/captured/local/summary.json` |

## Acceptance criteria

| Criterion | Verdict | Evidence |
|---|---|---|
| AC-BE3-5b-1 — workflow runs on a real preview + commits summary | 🟡 **PARTIAL — CI trigger PO/credential-blocked** | workflow authored + YAML-valid; **fallback ran locally**: `capture-contract-snapshot.sh` + `summarize-capture.sh` produced `docs/backend/captured/local/summary.json`. **No CI run faked.** Live run needs GitHub Actions write + preview creds |
| AC-BE3-5b-2 — summary referenced by version in registry; no parallel registry | 🟡 PARTIAL | workflow patches the matching row via `patch-release-row.sh` (best-effort — see PO item); **single** `registry.csv`, no parallel registry created |
| AC-BE3-5b-3 — seeded walk exercises every route; coverage gate reports per-route | 🟡 PARTIAL | coverage gate **works** at method+template granularity (**21/22** against the local full-route probe; only `PATCH /versions/:id/status` un-captured — mock rejects the transition); the workflow's seeded walk now **actually drives every route** via the dev server + `apiClient` (Codex P1-workflow fix); remaining gap = a **live** run |
| AC-BE3-5b-4 — contract-drift gate fails on mutated, passes on clean | ✅ PASS | clean → OK (exit 0); mutated contract → DRIFT (exit 1) — proven in R5a + re-run here |
| AC-BE3-5b-5 — no `src/**` changed | ✅ PASS | R5b changed no `src/`; the only `src` diff is R5a's tap |

## Why Partial (honest)
- A real preview capture requires the workflow to actually run in GitHub Actions on a source-change preview,
  which needs **repo Actions write access + a Vercel preview** — not available in-session.
- The seeded walk now **deterministically drives every contract route** (dev server serves `/src`, the walk
  imports `apiClient` and calls each route from `extract-routes.sh`). Locally it captured **21/22** at
  method+template granularity, 1 synthetic sample each. What remains is **organic, multi-preview accumulation
  to N≥3 real payloads/route** — only a **live** run produces that.
- Per `may-close-partial: yes`, this does not stall the plan — the substrate is proven in BE3-R5a, and BE3-R6
  records G5 as **FAIL** (no organic live capture yet) rather than letting the gate go green.

## Codex output-review remediation (2026-07-01)
Resolved all three findings from `output-review/2026-07-01-codex-output-review.md`:
- **P1 (type-check):** `capture-sink.ts` no longer references the bare `process` global (accesses via
  `globalThis`) — the isolated contract-check `tsc` is green again (exit 0).
- **P1 (workflow):** the seeded journey previously passed the route list to Playwright but never used it; it
  now imports `apiClient` and drives **every** route. The "accumulates automatically once live" claim is
  softened to reflect that live CI creds are still required.
- **P2/P3 (count):** coverage is now measured at **method+template** granularity (concrete paths normalized in
  `summarize-capture.mjs`); the corrected local number is **21/22** (was mis-stated as 6/22 against a 5-record
  artifact). Artifact re-run and committed.

## 🔔 PO action required
1. **CI credentials to run live capture** — GitHub Actions `contents: write` + a preview deploy of a source
   change so `backend-capture.yml` fires on `deployment_status`. Then AC-BE3-5b-1/2/3 complete.
2. **Registry capture-reference column** — the registry has no dedicated capture field, and `notes` is
   pre-filled by `version-assign.yml`, so `patch-release-row.sh` (which refuses non-empty overwrite) can't
   record the capture ref there. The sprint forbids adding a column. **Decision needed:** add a `capture_ref`
   column (a one-time registry-schema change the PO approves) vs. rely on the `<version>` path as the join
   key. Until decided, capture summaries are referenced by their `<version>` directory path only.

## Follow-ups
- Tune the seeded journey walk to deterministically hit all 22 routes (needs a small preview-only app hook to
  expose services for the walk, or fuller Playwright UI flows) — do this when CI creds land.
- Once live, BE3-R6 reads the accumulating `docs/backend/captured/**` to score G5.
