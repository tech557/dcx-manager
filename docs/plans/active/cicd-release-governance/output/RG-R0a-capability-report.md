---
sprint: RG-R0a
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: complete
---

# RG-R0a — Discovery & capability report (audit-only)

Audit-only. No setup/init actions were taken. All commands below are read-only.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PLAT-018 (platform responsibilities), REQ-RG-AUTO-019 (mechanical bias) — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-0a-1, AC-RG-0a-2, AC-RG-0a-3, AC-RG-0a-4 — all PASS (see sprint file `sprints/RG-R0a.md`) |
| Verification (EVD) | this report has one row per platform (§1–§6) with state + the exact command used; §7 maps every gap to its closing sprint |

## §1 Git / repo

| Item | State | Evidence command | Gap | Closes in |
|---|---|---|---|---|
| `.git` | **absent** | `git status --short --branch` → `fatal: not a git repository (or any of the parent directories): .git` | No version control yet | RG-R0b |
| `vercel.json` | absent | `ls -ld vercel.json` → No such file | No Vercel project config | RG-R4 |
| `docs/releases` | absent | `ls -ld docs/releases` → No such file | No release registry dir | RG-R2 |
| `scripts/release` | absent | `ls -ld scripts/release` → No such file | No release scripts | RG-R2 |
| `CODEOWNERS` | absent | `ls -ld CODEOWNERS` → No such file | No ownership routing | RG-R3 (or RG-R0b) |
| `.github` | **present** (pre-existing, pre-git) | `ls -ld .github` → directory; `find .github -type f` → `.github/workflows/req-validate-on-graph-change.yml`, `.github/workflows/ci.yml` | Two workflow files exist with no `.git` to drive them (dead config until repo exists) | RG-R0b (repo init), RG-R3 (validate/wire these workflows — confirm they match the CI gates RG-R3 expects, replace or keep) |

## §2 GitHub

| Item | State | Evidence command |
|---|---|---|
| `gh` CLI | **not installed** | `command -v gh` → not found |
| `gh auth status` / `gh repo view` | not run (tool absent) | — |

**Verdict:** BLOCKED — `gh` unavailable; GitHub state (remote, auth, branch protection) to be confirmed in RG-R0b/RG-R3 once `gh` is installed or via the GitHub web UI / REST API.

## §3 Vercel

| Item | State | Evidence |
|---|---|---|
| Vercel MCP in-session | **available** (`mcp__855d0a56-c6f4-441f-85ee-6df5a23ca3f6__*` — `deploy_to_vercel`, `list_projects`, `list_deployments`, `get_deployment`, etc.) | present in this session's tool list |
| Linked Vercel project | not verified | must be confirmed live in RG-R4 (this sprint does not call write/list tools per scope) |

## §4 Supabase

| Item | State | Evidence |
|---|---|---|
| Supabase MCP in-session | **available** (`mcp__38e91b2d-4df5-46fb-b6cc-da2f37124612__*` — `list_projects`, `list_branches`, `apply_migration`, etc.) | present in this session's tool list |
| Production/preview project separation (D-RG-ENV) | not verified | must be confirmed live in RG-R5 |

## §5 ClickUp

| Item | State | Evidence |
|---|---|---|
| ClickUp MCP in-session | **available** (`mcp__911651c5-39cb-4ab0-a91e-fb1cb38039f1__*` — `clickup_create_task`, `clickup_create_list`, etc.) | present in this session's tool list |
| Release list/board configured | not verified | to be confirmed live in RG-R6 |

## §6 GAS (Google Apps Script sink)

| Item | State | Evidence |
|---|---|---|
| GAS endpoint configured | **not configured** | no `GAS_ENDPOINT` / `script.google.com` reference found outside this plan's own docs (`grep -rl` over `docs/`); prior session note (`docs/progress/sessions/2026-06-30-claude/010-...md`) records GAS only as a *fallback option*, not a live endpoint | RG-R6 (per plan, GAS is a secondary non-blocking sink; no live call required at this stage) |

## §7 Gap → sprint map

| Gap | Closing sprint |
|---|---|
| No `.git`, no GitHub remote, no `gh` CLI | RG-R0b |
| Stale/orphan `.github/workflows/*.yml` (predate repo) | RG-R0b (init), RG-R3 (wire/validate CI gates) |
| No `CODEOWNERS` | RG-R0b or RG-R3 |
| No `vercel.json` / linked Vercel project | RG-R4 |
| No `docs/releases/registry.csv`, no `scripts/release/*` | RG-R2 |
| Vercel/Supabase/ClickUp MCPs in-session but unverified live (no project linkage confirmed) | RG-R4 (Vercel), RG-R5 (Supabase), RG-R6 (ClickUp) |
| No GAS endpoint configured | RG-R6 (non-blocking secondary sink) |

## Commands run (verbatim)

```
$ find src -type f -exec shasum {} + | sort > /tmp/src-pre.sha   # pre-sprint manifest, 389 files
$ git status --short --branch
fatal: not a git repository (or any of the parent directories): .git
$ ls -ld .git .github vercel.json docs/releases scripts/release CODEOWNERS
ls: .git: No such file or directory
ls: CODEOWNERS: No such file or directory
ls: docs/releases: No such file or directory
ls: scripts/release: No such file or directory
ls: vercel.json: No such file or directory
drwxr-xr-x@ 3 mahmoudsamaha staff 96 Jun 30 21:39 .github
$ command -v gh
(not found)
```

No `init`, `connect`, or write action was taken against any platform.
