## P5 — Step 2 Component Source Policy
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Create the durable custom-vs-library policy and adapter seam rules for future frontend polish.
Trigger: P5 Step 2.
Requirements covered: P5 Step 2; component-source governance.

Files created: docs/product/component-source-policy.md - source matrix, adapter rules, shadcn candidates, landing folder, and seam location (97 lines); docs/progress/sessions/2026-06-28-codex/14-P5-task2-component-source-policy.md - task log (44 lines before final line-count patch)
Files edited: docs/plans/active/folder-structure-v2/output/P5-frontend-readiness.md - added source decision matrix and policy reference (282 lines, was 258); docs/plans/active/folder-structure-v2/sprints/P5-frontend-readiness.md - Step 2 marked complete (415 lines, was 415)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  No source behavior changed. This was policy documentation only. Custom atoms/surfaces remain default; raw shadcn remains unconsumed by feature code.

Open decisions used:
  None

Acceptance criteria:
  PASS - `docs/product/component-source-policy.md` exists.
  PASS - Policy includes the inventory-backed source matrix.
  PASS - Policy records the adapter-boundary rule and swap seam.
  PASS - Policy names `src/ui/shadcn/` as raw shadcn landing folder.
  PASS - Policy names first shadcn candidates: Dialog, Popover, Combobox/Command, Tooltip.
  PASS - Current shadcn state is recorded in P5 output.
  PASS - Feature imports of `@/ui/shadcn/*` outside `src/ui/` are 0.

Gates:
  typecheck: N/A - documentation-only policy
  dev: N/A - documentation-only policy
  verify.sh: N/A - Step 0 already captured environment gate
  browser manual check: N/A - documentation-only policy

Consumer updates required:
  Future feature code must import DCX adapters, not raw `@/ui/shadcn/*` components.

Open issues / follow-ups:
  Step 3 must make the adapter seam explicit in `src/ui/PopoverShell.tsx` without changing behavior.
