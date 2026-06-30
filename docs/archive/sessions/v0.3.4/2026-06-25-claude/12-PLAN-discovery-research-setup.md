## 12-PLAN — Discovery Research Plan Setup
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-25
Status: In Progress

Task type: User-initiated (planning correction) — not a sprint task
Trigger: User message — "are you sure you dont need to create UX research plan first, run all needed test and scripts using the installed tools to extract the tokens and components and include this UI/UX proper research for how to structure that without changing functionality? Also for backend and front end discovery plans. Final ones so u can consider the three plans outputs and finalize the actual sprints for the final structure"

PO decision:
  - src-structure-refactor sprint files (P1-P4) were premature — written as assumptions, not data
  - Three discovery plans must run first and produce output before any refactor sprint is written
  - Only after all three discovery outputs exist should the final execution sprints be planned

Actions taken:
  1. Moved src-structure-refactor sprints to /sprints/DRAFT-PENDING-RESEARCH/ (not executable)
  2. Updated src-structure-refactor README to reflect that it is a synthesis target, not a sprint plan
  3. Created three new drafted discovery plans:
     - ui-ux-discovery   — extract token inventory, component map, style patterns
     - frontend-discovery — catalog components, state, data flow, duplication
     - backend-discovery  — service layer, type contracts, mock-to-API gap

Files created:
  docs/plans/drafted/ui-ux-discovery/README.md
  docs/plans/drafted/ui-ux-discovery/sprints/UX-R1-token-extraction.md
  docs/plans/drafted/ui-ux-discovery/sprints/UX-R2-component-catalog.md
  docs/plans/drafted/ui-ux-discovery/sprints/UX-R3-style-pattern-audit.md
  docs/plans/drafted/frontend-discovery/README.md
  docs/plans/drafted/frontend-discovery/sprints/FE-R1-component-tree.md
  docs/plans/drafted/frontend-discovery/sprints/FE-R2-state-and-data-flow.md
  docs/plans/drafted/frontend-discovery/sprints/FE-R3-duplication-map.md
  docs/plans/drafted/backend-discovery/README.md
  docs/plans/drafted/backend-discovery/sprints/BE-R1-type-inventory.md
  docs/plans/drafted/backend-discovery/sprints/BE-R2-service-audit.md
  docs/plans/drafted/backend-discovery/sprints/BE-R3-integration-gap.md

Files edited:
  docs/plans/drafted/src-structure-refactor/README.md — marked as synthesis target, sprint stubs moved to pending

Gates: no source code changed: PASS
