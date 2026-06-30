# 001 — Triage document + PO sign-off

Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: process-governance
Status: Completed
PO-Action: none

Intent: Create the burn-down triage document, get PO approval, prepare for P1 execution.
Trigger: User request — "systematically close OPEN items in the requirements graph by category"
Requirements covered: §35, RS-R7, RS-R8

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/product/requirements/graph/BURN-DOWN-TRIAGE.md | Triage doc grouping all open items by type/family with proposed execution order | 163 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no code changes |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Read VERSION.md → core.md §35 → log-format.md → agent-guide | PASS |
| Run build-current-state.sh | PASS |
| Run req:validate | PASS — 0 errors, 1 warning |
| Run req:reconcile --mode inventory | PASS — captured all counts |
| Write triage doc with open-type + family grouping | PASS |
| Propose priority: P1→P2→P3→P4→P5 | PASS |
| Wait for PO sign-off before any mutation | PASS — PO approved |

### Gates
| Gate | Result |
|---|---|
| req:validate | PASS (0 errors) |
| req:reconcile --mode inventory | PASS |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
None — document-only change.

### Open issues / follow-ups
- Next: P1a execution — confirm RS-R7 trace links (confidence ≥ 0.80, auto-apply per §35b)
