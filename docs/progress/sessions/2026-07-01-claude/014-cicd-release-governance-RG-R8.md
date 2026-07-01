## RG-R8 — First-production bootstrap (one-time)
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: pending
Version: v1.0.0.0
Change-Class: non-source

Intent: Execute the plan's final sprint — bind the first production release, get an explicit PO
approval, and set the real production alias for the first time.
Trigger: PO instruction to execute the plan one sprint at a time; RG-R8 follows RG-R7. Before writing
anything, found the sprint's "bind the approved existing build" instruction was ambiguous against real
state (production alias was on an accidental first deployment; main had never deployed on its own) and
asked the PO twice — once to resolve which build, once to explicitly confirm the exact binding — before
touching the registry, the approval file, or the alias.
Requirements covered: REQ-RG-PROD-004, REQ-RG-APPROVAL-005, REQ-RG-VER-006, REQ-RG-RESET-010.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited (via `append-release-row.sh`) | `docs/releases/registry.csv` | seed row `v0.3.5.0` (bootstrap) + `v1.0.0.0` (promoted-prod, via `promote.sh`) | +2 |
| created | `docs/releases/approvals/v0.3.5.0-production.md` | quotes the PO's explicit in-chat approval verbatim | 22 |
| edited (via `promote.sh`) | `docs/VERSION.md` | `current` → `v1.0.0.0` | 1 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R8-first-production.md` | sprint deliverable | 90 |
| edited | `docs/plans/active/cicd-release-governance/README.md` | carry-forward + plan-level status section (RG-R0b/R3/R4 still Partial — not moving to `completed/`) | +40 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R8.md` | status → Completed | 2 |
| (real, external) | Vercel alias `dcx-manager-gov.vercel.app` | now serves the bound build for real | — |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched |
| Open decisions used (⏱) | None — both decisions (which build to bind, explicit production approval) were direct PO statements, confirmed twice before any write |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-8-1 — v0.3.5.0 seed row, carry-as-is | PASS |
| AC-RG-8-2 — bound to exact deployment_id | PASS — verified via Vercel API |
| AC-RG-8-3 — approval record precedes alias move | PASS — committed+pushed before `promote.sh` ran |
| AC-RG-8-4 — alias set once, no rebuild | PASS — unchanged build timestamps confirmed |
| AC-RG-8-5 — no second bootstrap path | PASS — `promote.sh` has no bootstrap branch |
| AC-RG-8-6 — no `src/**` changed | PASS |

### Gates
| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| §2.3 promotion gate | PASS — live, all four layers enforced |
| `sprint-doctor.sh cicd-release-governance RG-R8 claude` | ✅ READY TO HAND OFF |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |
| Live production check | PASS — `curl` → `200`; Vercel `get_deployment` confirms exact build |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| **Deployment protection on production is unconfirmed and now matters for real** | Production is live and public (plain `200`, no auth challenge observed); AC-RG-4-6 was never resolved (no MCP/CLI path exists) | Check Vercel dashboard → Project Settings → Deployment Protection for `dcx-manager-gov` |
| Branch protection (RG-R3) still not applied | Needs GitHub admin UI access | Apply the documented settings in `output/RG-R3-github-ci.md` |
| Repo still public (RG-R0b) | PO said this was temporary | Set up a durable private-auth path, then flip to private |
| **Plan should NOT move to `docs/plans/completed/` yet** | 3 sprints (RG-R0b, RG-R3, RG-R4) are Partial with the items above still open | Either resolve them or explicitly accept them as permanent debt before closing the plan |

### Consumer updates required
None.

### Open issues / follow-ups
- This closes the sprint sequence the PO asked to execute "one sprint at a time." All 9 sprints
  (RG-R0a → RG-R8) have run at least once. Three remain Partial; one (RG-R6) was skipped by PO decision.
  The plan itself stays in `docs/plans/active/` until those Partial items are resolved.
