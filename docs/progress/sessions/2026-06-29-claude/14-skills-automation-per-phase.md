## skills-automation — Skills × automation × PO-gate per phase (process-diagram gap)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: process-governance
Status: Completed
PO-Action: none

Intent: Make the skills, automation tier, and PO gates explicit per operational phase (the process diagram showed flow but not who/what runs each phase), and bind it into RS-R0b acceptance.
Trigger: PO request — "i dont see the skills needed in the process diagram? what skills needed for each phase what can be automated and whats not".
Requirements covered: Behavior-Sustaining Map preview (skills/automation/PO mapping); RS-R0b acceptance.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | docs/plans/active/requirements-system/README.md | New "Skills & automation per phase" table + 3-tier Mermaid | 619 (was 567) |
| edited | docs/plans/active/requirements-system/sprints/RS-R0b-architecture.md | Acceptance now requires a per-phase Skills × Automation × PO-gate view in the Map | 145 (was 138) |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — additive. |
| Preserve-semantic (§9) | N/A — docs only. |
| Open decisions used (⏱) | None. |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Skills named per phase | ✅ 6 existing + 3 new (RS-R4) mapped to 8 phases |
| Automatable vs not is explicit | ✅ 3 tiers: mechanical / skill / PO-gate, with the "cannot automate" list |
| Bound into RS-R0b so it can't recur | ✅ new RS-R0b acceptance criterion |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A — docs only |
| verify.sh | N/A — no `src/` change |
| build-log-index.sh smoke | ✅ re-ran; parsed; roll-up unchanged |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | Decision to greenlight RS-R0b execution is the live question (answered in chat); existing gates tracked in log 12 | — |

### Consumer updates required
- RS-R0b executor must produce the per-phase Skills × Automation × PO-gate view inside the Behavior-Sustaining Map.

### Open issues / follow-ups
- The 3 new skills (intake/maturation/reconcile) come online in RS-R4; before then existing skills + manual steps operate. The fully-automated loop is live from RS-R4 onward.
