---
sprint: BE3-R5b
plan: backend-discovery-v3
title: Live CI data capture (preview pipeline + registry patch)
family: devops
executor: Claude / Codex (GitHub Actions + Vercel preview + Supabase-dev)
required-tools: GitHub Actions, Vercel (preview), Supabase dev project
depends-on: BE3-R5a (proven substrate)
allowed-writes: .github/workflows/backend-capture.yml, .gitignore, docs/backend/captured/**, docs/releases/registry.csv (ONLY the capture-reference field on the matching `version` row, via patch-release-row.sh — never a new row, never another column), output/BE3-R5b-*.md
forbidden-writes: src/**; Supabase prod; enabling capture by default; a NEW/parallel release registry (patching the existing one's matching row is allowed and required)
status: Active
Status: Active
may-close-partial: yes — a GitHub/Vercel credential or preview block may close this Partial WITHOUT the plan pretending capture is live (the substrate is proven independently in BE3-R5a)
---

# BE3-R5b — Live CI data capture

Wire the proven BE3-R5a substrate into the `cicd-release-governance` preview pipeline so that **every
preview deploy** snapshots the contract and records real payloads/volumes into the readiness dataset,
referenced by `version` in the release registry — then keeps accumulating across all later previews.
(Split from the original BE3-R5 per audit blocking #5.)

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-GOV-TRACE-001-BACKEND` / `RSP-GOV-TRACE-BACKEND`. **NB (advisory #1):** `REQ-RG-PLAT-018` / `REQ-RG-AUTO-019` are **`proposed`**, not PO-locked — cited as *supporting* context only; this sprint's authority is the governance-trace backend node + the existing RG pipeline it reuses. |
| Scope/type | devops — CI wiring only; **no `src/**`** (the tap already exists from R5a) |
| Acceptance outcomes | AC-BE3-5b-1 … AC-BE3-5b-5 |
| Expected manifestations | `.github/workflows/backend-capture.yml`, `.gitignore` (raw-capture ignore), `docs/backend/captured/<version>/summary.json` |
| Actual manifestations (reuse) | `active/cicd-release-governance` previews + `docs/releases/registry.csv`; `.github/workflows/record-preview.yml` (`deployment_status` + `patch-release-row.sh` pattern to copy) |
| Evidence | a real preview producing a committed summary referenced by `version` in the registry — live, not simulated |
| Gate result | `req:validate` + `req:reconcile` + `req:completion-gate` PASS |

## Intent
Make real backend data accumulate mechanically from previews (plan §7.2–§7.3).

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh`; read plan §7.2 + BE3-R5a carry-forward (substrate paths) +
   the RG carry-forward for how `record-preview.yml` uses the Vercel `deployment_status` event +
   `patch-release-row.sh`.
2. **Reuse that pattern; do NOT build a parallel registry** (D-BE3-CONTRACT-SOT / RG carry-forward): capture
   summaries are referenced by `version` in the existing `docs/releases/registry.csv`.

## Scope — in
- `.github/workflows/backend-capture.yml`: on the preview's `deployment_status` (Vercel App), run the app's
  existing E2E/smoke journeys **plus a seeded journey walk** (every contract route from `extract-routes.sh`
  exercised) against the preview with `VITE_BE3_CAPTURE=1`; invoke `capture-contract-snapshot.sh` +
  `summarize-capture.sh` (from R5a); commit `docs/backend/captured/<version>/summary.json`; patch a capture
  reference into the matching `registry.csv` row by `version` (reusing `patch-release-row.sh`).
- `.gitignore`: raw captured payloads ignored; only committed summaries.
- Two **advisory** CI gates (promotable to required later — OD-BE3-06): *contract-drift* (committed
  contract ≡ code) and *capture-coverage* (summary covers every route the journey exercised).
- The workflow runs the R5a `assert-capture-off-in-prod.sh` as a guard step.

## Scope — out
- Any `src/**` change (the tap is R5a's). Enabling capture in production. Pointing at `dcx-manager-prod`.
- Making the two capture gates **required** status checks this plan (advisory only — OD-BE3-06).
- A second/parallel registry.

## Acceptance criteria
- [ ] AC-BE3-5b-1 — `backend-capture.yml` runs on a **real preview** and commits `docs/backend/captured/<version>/summary.json` (live-verified via GitHub API run id + committed file)
- [ ] AC-BE3-5b-2 — the summary is referenced by `version` in `docs/releases/registry.csv` via `patch-release-row.sh`; **no parallel registry** (code-verifiable: registry row patched, no new CSV)
- [ ] AC-BE3-5b-3 — the seeded journey walk exercises every route from `extract-routes.sh`; capture-coverage gate reports per-route coverage (code-verifiable: coverage report)
- [ ] AC-BE3-5b-4 — contract-drift gate fails on a mutated contract, passes on a matching one (test-verifiable)
- [ ] AC-BE3-5b-5 — no `src/**` changed (code-verifiable: name-only diff empty under `src/`)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| live preview capture | push a source change; observe the workflow run + committed summary via GitHub API | run id + committed file + patched registry row | if no CI write/credential path in-session: run `capture-contract-snapshot.sh` + `summarize-capture.sh` against a manual preview locally, attach the summary, and mark AC-BE3-5b-1 **`PARTIAL — CI trigger PO/credential-blocked`** with the exact missing credential logged (core.md §28). **Do not fake a CI run.** Per `may-close-partial`, this does not stall the plan — the substrate is proven in R5a. |
| registry patch | inspect the patched `registry.csv` row | capture ref present, single registry | same PARTIAL fallback |
| coverage gate | coverage report vs. `extract-routes.sh` route set | per-route coverage | — |
| drift gate | run on mutated + clean contract | fail then pass | — |
| no src | `git diff --name-only -- src/` | empty | — |

## Dependencies
BE3-R5a (proven substrate). Reuses the `cicd-release-governance` preview + registry pipeline. After it
lands, it runs **continuously** — every later preview (including frontend-polish work) feeds capture.

## Files likely affected
- `.github/workflows/backend-capture.yml` — create
- `.gitignore` — edit (ignore raw captures)
- `docs/backend/captured/<version>/summary.json` — created by CI on first real preview
- `docs/releases/registry.csv` — edit (via `patch-release-row.sh`: fill the capture-reference field on the matching `version` row **only** — no new row, no other column; reuses the existing registry, never a parallel one)
- `output/BE3-R5b-live-capture.md` — create

## Final step — Continuity wiring (MANDATORY, last step)
Append to carry-forward: workflow name, first captured `version`, the drift + coverage gate status
(advisory), and the note that capture now **accumulates automatically** — BE3-R6 reads the growing
`docs/backend/captured/**` to score G5. If closed Partial, record the exact blocking credential so the next
session can finish it without rediscovery. Close via `dcx-sprint-close`.
