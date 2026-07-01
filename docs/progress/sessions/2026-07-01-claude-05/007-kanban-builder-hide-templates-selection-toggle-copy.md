## User request — Hide templates from kanban builder island; simplify selection island toggle copy
Agent: Claude
Model: claude-sonnet-5
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
Status: Completed
PO-Action: none
Version: v1.0.7.0
Change-Class: source

Intent: Remove the Template entry point from the Kanban builder island and drop the "Present"/"Active" badge copy from the selection island's presentation-mode toggle, keeping the "X selected" text itself as the clickable toggle.
Trigger: User request — "hide templates from the kanban builder island and also remove the specific text to switch between presentation and active mode in selection island on the text (xxx selected is fine to click on toggle)"
Requirements covered: None (ad hoc UI request, not tied to an active sprint)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx | Removed the `Template` `InlineIslandButton` (REQ-TPL-001 entry point) and its now-unused `LayoutTemplate` icon import; `TemplatePopup`/`toggleTemplate` wiring left intact (no other trigger, but not requested to remove) | 195 (was 202) |
| edited | src/builder/islands/SelectionIsland/SelectionLabel.tsx | Removed the `Active`/`Present` badge `<span>` next to the presentation-mode toggle button; `natureLabel` ("X selected") remains the sole clickable content, `onClick`/`title` unchanged | 74 (was 80) |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Toggle click behavior (enter/exit presentation mode) and `title` tooltip unchanged; `TemplatePopup` component and its open/close state left wired, only the toolbar entry point removed |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Kanban builder island no longer shows a Template button | PASS |
| Selection island shows only "X selected" as clickable toggle text, no mode-name badge | PASS |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A — not run this task |
| verify.sh | N/A — not run this task |
| validate:architecture | N/A — not run this task |
| test | N/A — not run this task |
| browser manual check | Verified via Preview MCP: expanded Kanban builder island shows only Phase/Action/Task/AI Agent (no Template); selected a card and confirmed the selection island renders `button: "1 action selected"` with no additional badge text |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None — both files are leaf UI components with no other importers affected by the removed markup

### Open issues / follow-ups
- None
