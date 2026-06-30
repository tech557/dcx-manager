## P5 — Step 1 Component Inventory
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Build the current post-P4 `src/ui/` component inventory for P5 governance.
Trigger: P5 Step 1.
Requirements covered: P5 Step 1; UX2/FE2 component-surface discovery carry-forward.

Files created: docs/progress/sessions/2026-06-28-codex/13-P5-task1-component-inventory.md - task log (41 lines)
Files edited: docs/plans/active/folder-structure-v2/output/P5-frontend-readiness.md - added component inventory table (258 lines, was 219); docs/plans/active/folder-structure-v2/sprints/P5-frontend-readiness.md - Step 1 marked complete (415 lines, was 415)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  No source behavior changed. This was inventory documentation only. `src/ui/shadcn/button.tsx`, `src/stories/*`, atoms, forms, and surfaces were preserved.

Open decisions used:
  None

Acceptance criteria:
  PASS - `find src/ui -name "*.tsx" | sort` was run.
  PASS - `src/ui/atoms`, `src/ui/forms/inputs`, `src/ui/forms/selects`, `src/ui/surfaces`, and `src/ui/shadcn` were checked.
  PASS - P5 output contains one inventory row per current `src/ui/*.tsx` component.
  PASS - Each row includes path, role, prop contract summary, and live consumer count.

Gates:
  typecheck: N/A - documentation-only inventory
  dev: N/A - documentation-only inventory
  verify.sh: N/A - Step 0 already captured environment gate
  browser manual check: N/A - documentation-only inventory

Consumer updates required:
  None

Open issues / follow-ups:
  The raw shadcn `Button` has no app feature consumers; the only visible sample usage is Storybook scaffolding. Step 2 must preserve the rule that feature code imports adapters, not `@/ui/shadcn/*` directly.
