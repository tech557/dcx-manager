## RG-PLAN — Clarify audit status + correct versioning model (OD-RG-01 decided)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: mixed
Status: Completed
PO-Action: pending

Intent: Answer the PO's two questions (empty sprints folder; whether Codex approved) and apply the PO's versioning correction (stay in v0.3.x; manual "version 0" bootstrap; automation only after GitHub).
Trigger: PO message: "why i cant see the sprints files in folder ? and how did codex approve that in audit ? … the system … starts from v0.3.6.0.0 the first deployment will be called version 0 and will take the existing version (manual) then the automation will be triggered after the github already setup"
Sub-tasks (mixed):
- audit-review: clarified that `sprints/` is empty by design (Path 2 brief) and that Codex did NOT approve — verdict was NOT READY (blocker #1 = no sprint files).
- user-request-planning: resolved OD-RG-01 versioning via AskUserQuestion and updated the plan.

### Decisions captured (AskUserQuestion)
| Question | PO answer |
|---|---|
| Version structure (4 vs 5 segments) | **4-part** as first defined (Major.Stage.Iteration.Revision) — the `v0.3.6.0.0` 5-segment form was a typo |
| Bootstrap value | **Carry existing v0.3.5 as-is** (not bump to v0.3.6) |
| → Resolved bootstrap | **v0.3.5.0** = Major0.Stage3.Iteration5.Revision0; manual "version 0"; automation only after GitHub setup; no jump to v0.4 |

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | docs/plans/drafted/cicd-release-governance/README.md | Added §3.2a Migration & bootstrap (v0.3.5→v0.3.5.0, manual version-0, automation-after-GitHub); set frontmatter `introduction-version: v0.3.5.0`; marked OD-RG-01 DECIDED; updated VERSION.md migration note; updated scope banner to OD-RG-02..09 | ~6 edits |
| edited | docs/plans/drafted/README.md | Index version `v0.4.0.0`→`v0.3.5.0 (4-part)`; "Runs when" reworded to architecture-brief/Path-1 | 1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | Reversed my own earlier OD-RG-01 default (v0.4.0.0) per PO correction — intentional, logged here |
| Preserve-semantic (§9) | N/A — no source changed |
| Open decisions used (⏱) | OD-RG-01 now DECIDED; OD-RG-02..09 remain open (not silently decided) |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Explain empty sprints folder | PASS |
| Correct "Codex approved" misread (verdict was NOT READY) | PASS |
| Apply PO versioning model (v0.3.5.0, manual bootstrap, automation post-GitHub, no v0.4) | PASS |
| No stray v0.4.0.0 version strings remain (only "no jump to v0.4" prose) | PASS |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A — docs only |
| verify.sh | N/A — docs only |
| validate:architecture | N/A — docs only |
| test | N/A — docs only |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Re-audit by Codex (as a brief) | PO intends Codex re-audit; brief now corrected | Run dcx-plan-audit judging architecture, not execution-readiness |
| OD-RG-02..09 still open | Needed before any Path-1 promotion | Decide when promoting to executable plan |
| `no .git` blocker (G2) | PO-owned; gates RG-R3 automation | Init/connect git+GitHub when ready (manual v0.3.5.0 bootstrap happens here) |

### Consumer updates required
- None.

### Open issues / follow-ups
- OD-RG-02 (Iteration bump resets Revision?) still recommended-yes, unconfirmed.
- index: run `bash scripts/build-log-index.sh`.
