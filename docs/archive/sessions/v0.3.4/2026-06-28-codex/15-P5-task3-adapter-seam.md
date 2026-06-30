## P5 — Step 3 Adapter Seam
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Make the future library/MCP swap seam explicit without changing UI behavior.
Trigger: P5 Step 3.
Requirements covered: P5 Step 3; component-source-policy adapter boundary.

Files created: docs/progress/sessions/2026-06-28-codex/15-P5-task3-adapter-seam.md - task log (40 lines before final line-count patch)
Files edited: src/ui/PopoverShell.tsx - adapter seam comment added above props contract (30 lines, was 28); docs/plans/active/folder-structure-v2/output/P5-frontend-readiness.md - Step 3 seam and gate evidence added (309 lines, was 282); docs/plans/active/folder-structure-v2/sprints/P5-frontend-readiness.md - Step 3 marked complete (415 lines, was 415)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  PASS - No JSX structure, props, classes, theme behavior, default width, or imports changed. The edit is documentation-only inside the source file.

Open decisions used:
  None

Acceptance criteria:
  PASS - `src/ui/PopoverShell.tsx` is explicitly marked as the adapter seam.
  PASS - Future shadcn/MCP popover replacement must stay behind the `children` / `className` / `width` contract.
  PASS - Feature imports remain stable through `@/ui/PopoverShell`.
  PASS - Runtime behavior unchanged.

Gates:
  PASS - `npm run typecheck`
  PASS - `npx eslint src/ui/PopoverShell.tsx --max-warnings 0`
  FAIL (known backlog) - `npm run lint` reports 119 problems (114 errors, 5 warnings). No finding was reported for `src/ui/PopoverShell.tsx`.

Consumer updates required:
  None. Existing consumers keep importing `PopoverShell`.

Open issues / follow-ups:
  Step 4 must write the visual acceptance spec before any screenshot judgment.
