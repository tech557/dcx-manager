## RG-R7 — Concurrency enforcement + dogfood
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v0.4.1.0
Change-Class: source

Intent: Prove the CI/CD/version-assign/Vercel machinery end-to-end with real branches and real merges,
not simulation, and enforce the §4 branch-naming convention.
Trigger: PO instruction to execute the plan one sprint at a time; RG-R7 follows RG-R6 (skipped).
Requirements covered: REQ-RG-CONC-014, REQ-RG-BRANCH-015, REQ-RG-MAP-016, REQ-RG-SEED-017, REQ-RG-PREVIEW-001, REQ-RG-NOPREVIEW-002.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `scripts/release/vercel-ignore-build.sh` | classifies each Vercel deployment attempt, skips non-source | 22 |
| edited | `vercel.json` | added `ignoreCommand` | +1 |
| created | `.github/workflows/branch-lint.yml` | rejects non-conforming branch names | 22 |
| edited | `dogfood/source-probe.txt`, `dogfood/doc-probe.txt` | dogfood A/B edits (per RG-R2 fixture design) | +2/+1 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R7-dogfood.md` | full sprint evidence | 130 |
| edited | `docs/plans/active/cicd-release-governance/README.md` | carry-forward appended | +20 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R7.md` | status → Completed | 2 |

Real git activity this sprint: 2 feature branches created+merged+deleted (dogfood-ui, dogfood-doc), 1
disposable wiring branch (rg-r7-wiring), 1 disposable bad-name branch (created+rejected+deleted), plus a
fully local/unpushed git-conflict simulation for AC-RG-7-2.

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-7-1 — branch-lint rejects a bad branch | PASS — live |
| AC-RG-7-2 — same-version stamp = conflict + validator flag | PASS — local, real conflict + real catch |
| AC-RG-7-3 — source dogfood → Iteration bump + preview | PASS — live, Vercel API confirms READY |
| AC-RG-7-4 — non-source dogfood → Revision bump + no preview | PASS on the clean case; a contention edge case found and documented (see output doc) |
| AC-RG-7-5 — two parallel merges get distinct versions | PASS — live, no collision |
| AC-RG-7-6 — evidence not at repo root | PASS — N/A screenshots |
| AC-RG-7-7 — no `src/**` change | PASS |

### Gates
| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| CI green | PASS overall — one real transient failure (git-push race), retried, documented, fixed |
| `sprint-doctor.sh cicd-release-governance RG-R7 claude` | ✅ READY TO HAND OFF |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | Sprint closed clean; the two edge cases found (human-vs-bot push race, Vercel/registry classifier divergence) are documented findings, not blockers | — |

### Consumer updates required
None.

### Open issues / follow-ups
- Next sprint in order: **RG-R8** (first-production bootstrap, one-time). This is the highest-stakes
  remaining sprint — will read it fully and confirm scope with the PO before any production-affecting
  action, given the pattern established this session (Vercel/Supabase project creation, real
  promotions) always required explicit PO confirmation first.
