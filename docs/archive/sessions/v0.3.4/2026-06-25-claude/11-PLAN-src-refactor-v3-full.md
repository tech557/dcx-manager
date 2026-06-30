## 11-PLAN — src-structure-refactor v3 Full Plan (PO rejected v2)
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-25
Status: In Progress

Task type: User-initiated (planning revision) — not a sprint task
Trigger: User message — "i dont think you are giving this the importance needed merging everything in one file. we need a plan overview and each part of the plan explained enough, and the sprints planned thoroughly each in file. You dont get it after this plan i should be able to integrate backend or be able to make UI changes without being afraid that i will ruin everything so all tokens, divs, text, inputs, colors shall be saved in modular format with responsive values"

PO rejection reason:
  - v2 was still a single-file plan covering only file moves
  - Missed the real goal: design system + token architecture so UI changes and backend integration are safe
  - Each sprint must be its own file with full acceptance criteria

Plan scope upgrade:
  - Part 1: Design Token System (colors, typography, spacing, responsive values)
  - Part 2: Atomic Component System (atoms → molecules → organisms)
  - Part 3: File Structure (moves + enforcement)
  - Part 4: Backend Integration Readiness (service layer, type contracts)

Files created:
  docs/plans/drafted/src-structure-refactor/README.md          — plan overview + sprint index
  docs/plans/drafted/src-structure-refactor/sprints/P1-tokens.md
  docs/plans/drafted/src-structure-refactor/sprints/P2-components.md
  docs/plans/drafted/src-structure-refactor/sprints/P3-structure.md
  docs/plans/drafted/src-structure-refactor/sprints/P4-backend-readiness.md

Gates: no source code changed: PASS
