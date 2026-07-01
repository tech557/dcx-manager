---
sprint: RG-R0a
plan: cicd-release-governance
title: Discovery & capability report (audit-only)
family: discovery
executor: any agent (no special skill/tool)
required-tools: bash; gh CLI if present (read-only)
depends-on: —
allowed-writes: docs/plans/active/cicd-release-governance/output/RG-R0a-*.md, README carry-forward section
forbidden-writes: src/**, any setup/init action, .git, .github/**, external services
status: Completed
Status: Completed
---

# RG-R0a — Discovery & capability report (audit-only)

Audit-only. Confirms the real state of git/GitHub/Vercel/Supabase/ClickUp/GAS so later sprints build on
facts, not assumptions. **No setup actions** — this sprint only reports.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PLAT-018 (platform responsibilities), REQ-RG-AUTO-019 (mechanical bias) — **Status: approved — canonical graph nodes, PO-locked 2026-06-30 (ledger LDG-2026-06-30-create-node-REQ-RG-*; OD-RG-07 closed)** |
| Acceptance IDs | AC-RG-0a-1 … AC-RG-0a-4 |
| Expected manifestations | `output/RG-R0a-capability-report.md` (one structured report) |
| Verification (EVD) | report contains a per-platform row with a verified/absent verdict + the command used |

## Step 0 — Continuity & environment (mandatory)
1. Read the README **Carry-forward contract** and the **Decisions** table.
2. Run `bash scripts/agent/build-current-state.sh`; log version, active plans, MCP operational/awaiting, code-index freshness.
3. Confirm the no-`src/**` boundary (D-RG-GIT).

## Scope
- **Allowed:** write the capability report under `output/`; update the carry-forward "Facts each sprint leaves behind".
- **Forbidden:** any init/connect/setup; writing `src/**`, `.git`, `.github/**`; calling external write APIs.

## Steps (exact)
1. Git: `git status --short --branch` (expect `fatal: not a git repository`) → record.
2. Repo artifacts: `ls -ld .git .github vercel.json docs/releases scripts/release CODEOWNERS 2>&1` → record present/absent.
3. GitHub: if `gh` present, `gh auth status` and `gh repo view` (read-only) → record; else record "gh unavailable".
4. Vercel: record whether a Vercel MCP/tool is available **in-session** (do not assume); note it must be verified in RG-R4.
5. Supabase / ClickUp: record MCP availability from the session tool list (do not call write tools).
6. GAS: record endpoint availability per existing docs (no live call required).
7. Write `output/RG-R0a-capability-report.md`: one row per platform = {state, evidence command, gap, which RG sprint closes it}.

## Output
`output/RG-R0a-capability-report.md` — sections: §1 git/repo, §2 GitHub, §3 Vercel, §4 Supabase, §5 ClickUp, §6 GAS, §7 gap→sprint map.

## Acceptance criteria
| ID | Criterion | Verification |
|---|---|---|
| AC-RG-0a-1 | Every platform has a state verdict + the exact command used | grep one row per platform |
| AC-RG-0a-2 | `no .git` confirmed with command output | report shows `git status` result |
| AC-RG-0a-3 | No setup action was taken | `git status` still `fatal` after sprint; no `.git`/`.github` created |
| AC-RG-0a-4 | Each gap maps to the RG sprint that closes it | §7 table complete |

## Gates (core.md §11)
| Gate | Applies | How |
|---|---|---|
| typecheck / lint / validate:architecture / test | N/A | no source changed |
| no-`src/**` proof | YES | **pre/post manifest** (git may not exist yet): before any work run `find src -type f -exec shasum {} + > /tmp/src-pre.sha`; at close run the same to `/tmp/src-post.sha`; `diff` must be empty. (Once git exists, prefer `git diff --name-only` excluding `src/`.) |
| browser | N/A | — |

## Fallbacks (core.md §28)
- `gh` not installed → record "BLOCKED — gh unavailable; GitHub state to be confirmed in RG-R0b/RG-R3", not a pass.
- A platform MCP not in-session → record "not available in this session", never assume connected.

## Close (core.md §29/§36a/§35c)
1. `bash scripts/agent/sprint-doctor.sh cicd-release-governance RG-R0a <agent>` — paste output in log.
2. **Requirement gates (core.md §35c):** record changed files (pre/post `find` manifest, since git may not exist yet), then run `npm run req:validate`, `npm run req:reconcile -- --mode changed -- --files <changed-files>`, and `npm run req:completion-gate -- --changed <changed-files>`. The `dcx-sprint-close` skill bundles steps 1–2 and must return PASS / PASS_WITH_QUEUED_REVIEW.
3. Update README carry-forward "Facts each sprint leaves behind" with confirmed current state.
4. Write session log + `bash scripts/build-log-index.sh`.
