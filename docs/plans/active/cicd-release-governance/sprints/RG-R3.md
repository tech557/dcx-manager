---
sprint: RG-R3
plan: cicd-release-governance
title: GitHub CI wiring (gates + classify + version-assign + registry-append)
family: external-config
executor: Claude / opencode (browser to verify checks); PO applies branch protection
required-tools: git, gh CLI, GitHub Actions, browser/Playwright for PR-check verification
depends-on: RG-R0b (git), RG-R2
allowed-writes: .github/workflows/**, CODEOWNERS, output/RG-R3-*.md
forbidden-writes: src/**
status: drafted
---

# RG-R3 — GitHub CI wiring

Wires the mechanical gates: every push runs the gates; merges to `integration` assign the version
(serialized) and append the registry row; CODEOWNERS locks PO-only files.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PREVIEW-001, REQ-RG-NOPREVIEW-002, REQ-RG-ITER-008, REQ-RG-REV-009, REQ-RG-OWN-007, REQ-RG-SEED-017, REQ-RG-CONC-014 — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-3-1 … AC-RG-3-6 |
| Expected manifestations | `.github/workflows/gates.yml`, `.github/workflows/version-assign.yml`, `CODEOWNERS`; branch protection (PO-applied) |
| Verification (EVD) | a test PR shows required checks; a merge stamps the next version + appends a registry row |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward (repo exists per RG-R0b; registry+scripts per RG-R2); §3.2/§4.2.
2. `bash scripts/agent/build-current-state.sh`; log.

## Scope
- **Allowed:** workflows, CODEOWNERS, the merge-assign action (calls RG-R2 scripts).
- **Forbidden:** `src/**`; moving any stable alias (RG-R4); any auto-promotion.

## Steps (exact)
1. `gates.yml`: on PR/push run `npm ci`, `npm run typecheck`, `npm run lint`, `bash scripts/verify.sh`, `npm run validate:architecture`, `npm run test`, `bash scripts/release/validate-release-registry.sh`.
2. `version-assign.yml`: on merge to `integration`, run `classify-change.sh` → compute next Iteration/Revision (serialized via `concurrency:` group) → `append-release-row.sh` with commit SHA, branch, change_class, gates snapshot.
3. Preview wiring contract: source change → preview deploy (the actual deploy is Vercel, RG-R4); non-source → no preview (job skips).
4. `CODEOWNERS`: PO as owner of `docs/VERSION.md`, `docs/releases/**`, `.github/workflows/**`, promotion config.
5. Branch protection (**PO applies in GitHub UI**; agent documents the exact settings): required checks = the gates job; no direct pushes to `main`/`staging`/`integration`; PR review required.
6. Open a throwaway test PR (docs-only) → confirm gates run + version-assign stamps a `non-source` Revision row.

## Output
`output/RG-R3-github-ci.md` — workflow descriptions, the branch-protection settings checklist, and test-PR evidence (check names + the stamped registry row).

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-3-1 | Gates run on a PR | test PR shows the checks (browser/gh evidence) |
| AC-RG-3-2 | Merge to integration assigns the next version (serialized) | registry row appended with correct increment |
| AC-RG-3-3 | `concurrency:` serializes version-assign (no double-stamp) | two queued merges get distinct versions |
| AC-RG-3-4 | CODEOWNERS protects PO-only files | PR touching VERSION.md requires PO review |
| AC-RG-3-5 | Branch protection blocks direct push to main/staging/integration | documented + a rejected direct push |
| AC-RG-3-6 | no `src/**` changed | name-only diff |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| CI green on test PR | YES | gates job passes |
| browser | YES | screenshot the PR checks → `output/evidence/` (core.md §32) |

## Fallbacks (core.md §28)
- GitHub Actions not enabled on the plan/tier → document the exact YAML + run gates locally as `dev-smoke (fallback)`; mark CI criteria `BLOCKED — Actions unavailable`, not PASS.
- No browser MCP for the executor → hand the PR-check verification to a browser-capable agent who writes their own log (core.md §29a).

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R3 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: CI gates + version-assign + CODEOWNERS now live; branch protection settings.
4. Session log + `bash scripts/build-log-index.sh`.
