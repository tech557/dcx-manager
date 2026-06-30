## Activate cicd-release-governance plan + RG-R0a — Discovery & capability report
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: mixed
Status: Completed
PO-Action: pending

Intent: PO instructed: "codex marked the drafter plan as ready, move it to active and then execute the
plan sprints one sprint at a time, log the plan output and task in session, then move on to next sprint."
Two components this turn: (1) activate `cicd-release-governance` (drafted → active), per the READY
final-approval audit; (2) execute sprint RG-R0a (audit-only discovery), the first sprint in dependency
order.
Trigger: User request (quoted above), final-approval audit `audit/2026-07-01-codex.md` (verdict READY, 0
blocking, 4 advisory).
Requirements covered: REQ-RG-PLAT-018, REQ-RG-AUTO-019 (RG-R0a's Requirement Trace).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| moved | `docs/plans/drafted/cicd-release-governance/` → `docs/plans/active/cicd-release-governance/` | plan activation per core.md §24, PO-directed | — |
| edited | `docs/plans/active/cicd-release-governance/README.md` | frontmatter/status → active; banner updated; carry-forward "Facts each sprint leaves behind" appended with RG-R0a findings | +18 |
| edited | `docs/plans/active/cicd-release-governance/sprints/RG-R0a.md` | `allowed-writes` path corrected (drafted→active); status set to Completed | 3 (was 11) |
| edited | `docs/plans/active/README.md` | plan now listed as the one active plan | +6 (was 28) |
| edited | `docs/plans/drafted/README.md` | removed cicd-release-governance row; added pointer note to active/ | -1/+3 |
| created | `docs/plans/active/cicd-release-governance/output/RG-R0a-capability-report.md` | RG-R0a deliverable — per-platform state report | 107 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — docs/plan files only, no `src/**` touched |
| Open decisions used (⏱) | None — activation and D-RG-GIT were already PO-decided in the plan README |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-RG-0a-1 — every platform has a state verdict + exact command used | PASS |
| AC-RG-0a-2 — `no .git` confirmed with command output | PASS |
| AC-RG-0a-3 — no setup action was taken | PASS — pre/post `src/**` shasum manifest diff empty; no `.git`/`.github` created (`.github` pre-existed, confirmed not created by this sprint) |
| AC-RG-0a-4 — each gap maps to the RG sprint that closes it | PASS — report §7 |

### Gates
| Gate | Result |
|---|---|
| typecheck / lint / validate:architecture / test | N/A — no source changed (per sprint spec) |
| no-`src/**` proof | PASS — `find src -type f -exec shasum` pre/post diff empty |
| `sprint-doctor.sh cicd-release-governance RG-R0a claude` | ✅ READY TO HAND OFF (2 informational warnings — determinism reminders, eyeballed) |
| `npm run req:validate` | PASS — 0 errors, 0 warnings |
| `npm run req:reconcile -- --mode changed` | ran; surfaced pre-existing repo-wide trace debt unrelated to the 5 changed docs files (no new issue introduced by this change) |
| `npm run req:completion-gate -- --changed <5 files>` | **FAIL** — the 5 changed files (plan README/sprint/report housekeeping docs) are not registered as requirement-graph manifestations. This is structural: RG-R0a's own Requirement Trace cites REQ-RG-PLAT-018/REQ-RG-AUTO-019 at the sprint level, but the completion-gate checks file-level manifestation links, which plan-governance docs were never modeled to have. The 299 "requirements lacking manifestations" / 33 "acceptance outcomes without evidence" counts are pre-existing repo-wide state, not introduced by this change. Treated as **PASS WITH DOCUMENTED DEBT** for this docs-only governance sprint — flagged to PO below rather than silently passed. |
| `verify-plan-state.sh` | 1 pre-existing unrelated MISMATCH (`completed/builder-refactor`, not touched this session) + 1 WARN ("active plan has no sprint files") — false positive: the script's flat-file check doesn't know about the `sprints/` subdirectory convention already used by `frontend-polish-implementation-v0.3.5`; sprint files are present at `sprints/RG-R0a.md` etc. |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| RG-R0b is explicitly **PO-owned** per the plan (first git/GitHub init — irreversible, external/shared-state action) | The plan's own README lists RG-R0b as "PO executes; agent writes the runbook." I stopped after RG-R0a rather than auto-running git init / GitHub setup on your behalf. | Confirm whether you want me to (a) write the RG-R0b runbook only and you execute it, or (b) execute RG-R0b directly (git init, first commit with secret scan, optional GitHub repo) under the already-approved D-RG-GIT boundary (no `src/**`). |
| `req:completion-gate` returns FAIL for docs-only governance changes (see Gates row above) | Not a defect in RG-R0a's work, but a gap in how the requirements graph models plan/process docs — every future docs-only RG sprint will likely hit the same FAIL. | Either accept this as expected/non-blocking for plan-housekeeping docs (recommended), or have a future sprint register plan README/output files as manifestations of REQ-RG-PLAT-018/REQ-RG-AUTO-019 in the graph. |
| Discrepancy found: `.github/workflows/ci.yml` and `.github/workflows/req-validate-on-graph-change.yml` already exist despite no `.git` | The plan's drafting-time assumption was "no `.github/`" — false. These are orphaned configs that predate any git history. | RG-R0b/RG-R3 will reconcile rather than overwrite; flagging now so it's not a surprise later. |

### Consumer updates required
None — no code/exports changed.

### Open issues / follow-ups
- Next sprint in order: **RG-R0b** (repo + integration setup, PO-owned) — paused for PO direction per the
  item above before proceeding.
- `verify-plan-state.sh` flat-file sprint-file check is a known false positive for plans using a
  `sprints/` subdirectory; not fixed in this session (out of RG-R0a's scope — `forbidden-writes` excludes
  unrelated tooling).
