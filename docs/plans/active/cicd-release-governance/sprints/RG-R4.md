---
sprint: RG-R4
plan: cicd-release-governance
title: Vercel preview/promote wiring (exact-build promotion)
family: external-config
executor: Claude / opencode (Vercel tool + browser); PO approves promotions
required-tools: Vercel (MCP or CLI), browser/Playwright
depends-on: RG-R3
allowed-writes: vercel.json, scripts/release/promote.sh, output/RG-R4-*.md
forbidden-writes: src/**
status: drafted
---

# RG-R4 — Vercel preview/promote wiring

Preview-per-commit (automatic) + exact-build promotion to staging/prod aliases (gated). Implements
Pattern A (promote the exact deployment). **First acceptance criterion is a recorded Vercel capability
proof** — Pattern A is a hypothesis until verified here.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PREVIEW-001, REQ-RG-STAGING-003, REQ-RG-PROD-004, REQ-RG-APPROVAL-005, REQ-RG-RESET-010, REQ-RG-MAP-016 — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-4-1 … AC-RG-4-7 |
| Expected manifestations | `vercel.json`, `scripts/release/promote.sh`, env scoping (preview/staging/prod) |
| Verification (EVD) | a preview URL per commit recorded in registry; a staging alias re-pointed at an exact deployment id without rebuild |

## Step 0 — Continuity & environment (mandatory)
1. Read carry-forward (CI live per RG-R3; registry per RG-R2); §2.2/§2.3.
2. `bash scripts/agent/build-current-state.sh`; confirm a Vercel tool is available in-session — if not, see Fallbacks.

## Scope
- **Allowed:** `vercel.json`, `promote.sh`, env-var scoping.
- **Forbidden:** `src/**`; auto-promotion (promotion must require an approval record).

## Steps (exact)
1. **Capability proof (AC-RG-4-1, gate-first):** confirm the Vercel tier supports immutable deployments + alias/promotion + deployment protection. Record the evidence. If unsupported → Pattern B fallback (see below).
2. `vercel.json`: per-environment env scoping; preview on every branch commit; **domains** = production `dcx.dotment.com`, staging `staging.dcx.dotment.com` (both as **manual-promote** aliases, no auto-promote); previews use auto `*.vercel.app` immutable URLs.
3. CI (from RG-R3): on source-change merge, capture the Vercel `deployment_id` + the immutable `preview_url` (`*.vercel.app`) into the registry row.
4. `promote.sh <version> <staging|production>`: verify the four §2.3 layers (verified row, on integration, registry row, **approval record exists**) → re-alias the exact `deployment_id` to the target domain. Refuse otherwise. **No rebuild.**
5. **`promote.sh --rollback <staging|production>` (safety):** re-alias the target domain back to the **previous** `promoted-*` deployment_id from the registry — a one-command rollback to the last-good build (no rebuild, no approval needed for rollback-to-prior). This is what makes an accidental promotion recoverable, not fatal.
6. Deployment protection on the production domain.
7. Test: push a source commit → preview row recorded; create a dummy approval record → `promote.sh` moves the `staging.dcx.dotment.com` alias to that exact deployment; remove approval → `promote.sh` refuses; `--rollback` restores the previous alias target.

## Output
`output/RG-R4-vercel.md` — capability proof, `vercel.json` summary, `promote.sh` contract, preview→registry mapping evidence, and the refuse-without-approval test. Screenshots → `output/evidence/`.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-4-1 | **Vercel capability proof recorded** (immutable deploy + alias + protection) | evidence in output; if absent → Pattern B + PO accept |
| AC-RG-4-2 | Preview deploy per source commit; URL+id in registry | registry row shows preview_url + deployment_id |
| AC-RG-4-3 | Non-source change → no preview | CI skips deploy; no preview row |
| AC-RG-4-4 | `promote.sh` re-aliases the **exact** deployment (no rebuild) | same deployment_id before/after; build count unchanged |
| AC-RG-4-5 | `promote.sh` **refuses without an approval record** | test: removed approval → non-zero exit, alias unmoved |
| AC-RG-4-6 | prod domain has deployment protection | Vercel setting recorded |
| AC-RG-4-7 | `--rollback` re-aliases to the previous promoted deployment (no rebuild) | rollback test: alias returns to prior deployment_id |
| AC-RG-4-8 | no `src/**` changed | name-only diff |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| no-`src/**` proof | YES | name-only diff |
| browser | YES | screenshot preview + alias move → evidence/ |
| capability-proof | YES | AC-RG-4-1 is gate-first |

## Fallbacks (core.md §28)
- **Pattern A unavailable** (tier limits) → document Pattern B (git-branch-per-env); **explicitly note it does NOT satisfy the exact-build requirement** unless the PO accepts the rebuild tradeoff (record the PO decision). Mark REQ-RG-STAGING-003/PROD-004 `BLOCKED — exact-build not guaranteed` until resolved.
- No Vercel MCP in-session → use Vercel CLI; if neither, mark RG-R4 `BLOCKED — Vercel access unavailable` and stop (do not fake a promotion).

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R4 <agent>`.
2. **Requirement gates (core.md §35c):** `<changed-files>` via `git diff --name-only`, then `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2; must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Carry-forward: preview wiring + promote.sh + env scoping live; which pattern (A/B) is in force.
4. Session log + `bash scripts/build-log-index.sh`.
