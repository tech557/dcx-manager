## RG-PLAN — Draft CI/CD & Release Governance plan
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-planning
Status: Completed
PO-Action: pending

Intent: Author a separate drafted plan for a mechanically-enforced CI/CD + release governance workflow (preview-per-source-change, exact-build promotion to staging/prod gated by PO approval, 4-part split-ownership versioning, CSV release registry, parallel-session safety) without implementing anything.
Trigger: PO request — "create a separate draft plan for introducing a simple CI/CD and Release Governance workflow … This is a planning task only. Do not implement anything."
Requirements covered: proposed REQ-RG-* / GOV-RG-* (intake pending per core.md §35a — see plan §8, OD-RG-07). No existing graph IDs claimed.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/plans/drafted/cicd-release-governance/README.md | Full draft plan, 9 PO-requested deliverables | 360 |
| created | docs/plans/drafted/cicd-release-governance/sprints/ | empty — sprint files written only after audit READY + PO activation | — |
| created | docs/plans/drafted/cicd-release-governance/audit/ | empty — for dcx-plan-audit verdicts | — |
| edited | docs/plans/drafted/README.md | Registered the new drafted plan in the index table | +1 row |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — net-new draft; no existing plan/log/source altered |
| Preserve-semantic (§9) | Respected — no `src/` writes, no boundary touched; plan is docs-only in drafted/ |
| Open decisions used (⏱) | 9 open decisions surfaced as register (OD-RG-01..09) with recommended defaults; none silently decided |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Plan stays planning-only, no implementation (core.md §34 Plan stage) | PASS |
| Delivers all 9 requested sections (gap → matrix → risks) | PASS |
| Grounded in real repo state (no .git, 3-part PO-only version, index.csv pattern) | PASS |
| Does not disrupt active frontend-polish plan (no src/ writes) | PASS |
| Registered in drafted index; audit-required flagged | PASS |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A — no source changed |
| verify.sh | N/A — no source changed |
| validate:architecture | N/A — no source changed |
| test | N/A — no source changed |
| browser manual check | N/A — docs/planning only |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Resolve `no .git` blocker | Working copy is not a git repo; blocks all CI/CD (RG-R0 precondition) | Initialize + connect git/GitHub before RG-R3 |
| 9 open decisions (OD-RG-01..09) | Version intro point, revision-reset, authority of registry vs ClickUp, Supabase env model, etc. | Review plan §9.2; confirm/adjust recommended defaults |
| 4-part scheme changes core.md §26 + VERSION.md | Reverses "agents never change version" → split ownership | Approve the rule change before any auto-assign tooling |
| Run dcx-plan-audit before activation | core.md §34 — never activate without READY | Audit, then move drafted/ → active/ if READY |

### Consumer updates required
- None (no exported code changed). Downstream doc edits (VERSION.md, core.md §26, log-format.md §0) are scoped *inside* the plan as future RG-R1 work — not done now.

### Open issues / follow-ups
- Proposed REQ-RG-* IDs need intake via `dcx-requirement-intake` (`req:propose` → PO sign-off) before activation (OD-RG-07).
- Vercel plan tier must be verified to support exact-deployment aliasing/promotion + deployment protection (Pattern A) — RG-R4.
- index: run `bash scripts/build-log-index.sh` to index this entry + refresh po-actions roll-up.
