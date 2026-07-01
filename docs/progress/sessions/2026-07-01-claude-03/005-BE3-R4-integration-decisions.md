## BE3-R4 — External integration decisions
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.1.0
Change-Class: non-source

Intent: Record a v1 build/stub decision + owner + data-need per external integration (ClickUp, AI, Files, GAS); no TBD.
Trigger: backend-discovery-v3 execution (BE3-R4).
Requirements covered: RG-R6 decision record (ClickUp scope), REQ-DM-017 (AI/ClickUp payload shapes)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/backend/integrations/decision-matrix.md | 4-integration decision matrix + OD-BE3-05 + build hand-offs | 46 |
| created | docs/plans/active/backend-discovery-v3/output/BE3-R4-integrations.md | sprint output | 40 |
| edited | docs/plans/active/backend-discovery-v3/README.md | carry-forward: R4 facts | +6 |
| edited | docs/backend/README.md | dataset index: integrations → COMPLETE | ~1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no src |
| Open decisions used (⏱) | OD-BE3-05 recorded (external-URL-only); carried RG-R6 (ClickUp task-init / GAS out) without relitigating |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-BE3-4-1 — every row: decision + owner + data-need, no TBD | PASS (4/4; 0 blank cells) |
| AC-BE3-4-2 — OD-BE3-05 recorded | PASS (external-URL-only) |
| AC-BE3-4-3 — build decisions name contract/schema additions | PASS (ClickUp source_task_id; AI proposedActions) |
| AC-BE3-4-4 — no src/** changed | PASS |

### Gates
| Gate | Result |
|---|---|
| no-TBD | PASS |
| build→needs cross-ref | PASS |
| no-src diff | PASS |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None.

### Open issues / follow-ups
- Queue REQ-BE-AI-* intake to type AIReviewDraft.proposedActions before AI build.
- versions.source_task_id noted as HYPOTHESIS column for the later ClickUp-linking build.
