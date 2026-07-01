---
sprint: RG-R7
plan: cicd-release-governance
title: Concurrency enforcement + dogfood
family: dogfood
executor: Claude / opencode (browser for live proof)
required-tools: git, GitHub Actions, Vercel, browser/Playwright
depends-on: RG-R3, RG-R4, RG-R5, RG-R6
allowed-writes: scripts/release/* (branch-lint, conflict checks), output/RG-R7-*.md, output/evidence/**
forbidden-writes: src/**
status: Completed
Status: Completed
---

# RG-R7 — Concurrency enforcement + dogfood

Proves the machinery end-to-end and enforces the §4 concurrency model. This is the proof that coordination
is mechanical, not agent-memory-based.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-CONC-014, REQ-RG-BRANCH-015, REQ-RG-MAP-016, REQ-RG-SEED-017, REQ-RG-PREVIEW-001, REQ-RG-NOPREVIEW-002 — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-7-1 … AC-RG-7-7 |
| Expected manifestations | branch-name lint; registry conflict validation; two parallel-branch dogfood runs (1 source, 1 non-source) |
| Verification (EVD) | evidence in `output/evidence/`: two branches, two registry rows, distinct versions, one preview / one no-preview |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward (CI, Vercel, Supabase, ClickUp all live); §4 concurrency model.
2. `bash scripts/agent/build-current-state.sh`; log.

## Scope
- **Allowed:** branch-lint + conflict-validation scripts; dogfood evidence.
- **Forbidden:** `src/**`; promoting to production (that is RG-R8).

## Steps (exact)
1. Branch-name lint: enforce `agent/<session>/<topic>` / `docs/<session>/<topic>` in CI; reject non-conforming branches.
2. Conflict validation: confirm two branches stamping the same version produce a git conflict on `registry.csv` AND `validate-release-registry.sh` flags duplicates.
3. **Dogfood A (source):** branch `agent/<session>/dogfood-ui`, edit the dedicated disposable fixture **`dogfood/source-probe.txt`** (defined + allowlisted as source in RG-R2) → expect Iteration bump + a preview row. **No product `src/**` change** — the fixture is purpose-built and removed after the run.
4. **Dogfood B (non-source):** branch `docs/<session>/dogfood-doc`, edit **`dogfood/doc-probe.txt`** (non-source) → expect Revision bump + **no** preview row.
5. Merge both via the queue → confirm distinct versions (serialized assign), correct preview/no-preview, correct registry rows.
6. Capture evidence to `output/evidence/` (core.md §32); reference plan-relative paths only.

## Output
`output/RG-R7-dogfood.md` — the two runs side by side, the conflict-detection demo, branch-lint results, and an evidence index.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-7-1 | Branch-name lint rejects a bad branch | CI rejects `feature/x` not matching pattern |
| AC-RG-7-2 | Two same-version stamps = git conflict + validator flag | demonstrated |
| AC-RG-7-3 | Source dogfood → Iteration bump + preview | registry + preview URL |
| AC-RG-7-4 | Non-source dogfood → Revision bump + no preview | registry; no preview row |
| AC-RG-7-5 | Two parallel merges get distinct versions | serialized assign proof |
| AC-RG-7-6 | Evidence under `output/evidence/`, not repo root | path check |
| AC-RG-7-7 | no `src/**` product change | name-only diff (dogfood touches only `dogfood/source-probe.txt` + `dogfood/doc-probe.txt`) |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| CI green | YES | both dogfood PRs pass gates |
| browser | YES | screenshot preview present / absent → evidence/ |

## Fallbacks (core.md §28)
- Browser MCP unavailable → hand live-preview proof to a browser-capable agent (own log, core.md §29a).
- The source dogfood uses the dedicated `dogfood/source-probe.txt` fixture (RG-R2) — never edit product `src/**` to manufacture a "source" change.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R7 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: concurrency enforcement live; dogfood proven; ready for first-production bootstrap.
4. Session log + `bash scripts/build-log-index.sh`.
