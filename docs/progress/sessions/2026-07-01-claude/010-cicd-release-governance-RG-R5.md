## RG-R5 — Supabase environment separation
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: pending
Version: v0.4.0.0
Change-Class: non-source

Intent: Continue the cicd-release-governance plan, sprint RG-R5 — separate Supabase data by
environment so preview/staging can never touch production data, and gate prod migrations on a
recorded approval.
Trigger: PO instruction to execute the plan one sprint at a time; RG-R5 follows RG-R4. Before creating
anything, checked Supabase MCP availability and cost, found a real cost mismatch in the original spec
(branching is paid, not free) and paused for a PO decision rather than assuming.
Requirements covered: REQ-RG-PLAT-018, REQ-RG-APPROVAL-005, REQ-RG-AUTO-019.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `scripts/release/gate-prod-migration.sh` | pure approval-record gate check; never touches a database itself | 30 |
| edited | `scripts/release/tests/run-tests.sh` | added 3 gate-prod-migration.sh tests (blocked/allowed/incomplete-record) | +20 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R5-supabase.md` | sprint deliverable | 78 |
| edited | `docs/plans/active/cicd-release-governance/README.md` | carry-forward + D-RG-ENV/OD-RG-05 refinement + corrected a stale D-RG-DOMAIN claim about RG-R4 | +30 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R5.md` | status → Completed | 2 |
| (external, not a repo file) | Supabase project `dcx-manager-prod` (`xokgguodxjjwokngyquo`, us-east-1) | real, `$0/month`, `ACTIVE_HEALTHY` | — |
| (external) | Supabase project `dcx-manager-dev` (`ibekkxqujqvlajeldpoa`, us-east-1) | real, `$0/month`, shared by preview+staging | — |
| (external, via Vercel CLI) | 4 Vercel env vars on `dcx-manager-gov` | `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` scoped Production vs. Preview+Development | — |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None — "use a free shared dev project instead of paid branching" was an explicit PO decision in-session after I surfaced the real cost, not an agent assumption |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-5-1 — OD-RG-05 decided + recorded | PASS — pre-decided, refined this sprint |
| AC-RG-5-2 — keys scoped per env, none in-repo | PASS — `vercel env ls` + `git grep` confirm |
| AC-RG-5-3 — preview never targets prod data | PASS — separate projects by construction |
| AC-RG-5-4 — prod migration gated to an approved release | PASS (mechanism, disposable-fixture tested); real live test deliberately skipped — no fake approval fabricated, see output doc |
| AC-RG-5-5 — no `src/**` changed | PASS |

### Gates
| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| migration-gate test | PASS — 3/3 new, 26/26 total suite |
| advisors | PASS — zero security findings on both new Supabase projects |
| `sprint-doctor.sh cicd-release-governance RG-R5 claude` | ✅ READY TO HAND OFF |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Real production-migration test still pending | Needs an actual production approval + actual migration content, neither of which exists yet (app is still mocked) | No action needed now — will happen naturally with the first real backend release |
| Confirm `VITE_SUPABASE_*` naming convention | Agent chose the standard Vite convention since no existing convention was found in `src/` | None needed unless you want different names before backend code starts consuming them |

### Consumer updates required
None — no `src/**` code reads these env vars yet (still 100% mocked).

### Open issues / follow-ups
- Next sprint in order: **RG-R6** (ClickUp release board + GAS sink) — will check ClickUp MCP
  availability and scope before starting, same pattern as RG-R3/RG-R4/RG-R5.
