## P2 — Task 4 input reconciliation
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-27
Status: Completed

Intent: Reconcile input variants onto the existing `src/ui/atoms/Input.tsx` atom.
Trigger: continuing P2 after Task 3 per the user-requested per-task logging methodology.
Requirements covered: P2 Step 4 Input reconciliation.

Files created:
  docs/progress/sessions/2026-06-27-codex/17-P2-task4-input-reconciliation.md

Files edited:
  src/ui/atoms/Input.tsx
  src/builder/islands/EditorViewerIsland/ActionEditorSection.tsx
  src/builder/islands/EditorViewerIsland/DayEditorSection.tsx
  src/builder/islands/EditorViewerIsland/TaskEditor/TaskSection1.tsx
  src/builder/islands/EditorViewerIsland/EditorHeader.tsx
  src/ui/forms/inputs/index.ts
  docs/plans/active/folder-structure-v2/sprints/P2-component-consolidation.md
  docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md
  docs/progress/index.csv

Files deleted:
  src/ui/forms/inputs/TextInputLarge.tsx
  src/ui/forms/inputs/TextInputInline.tsx

Churn — work reversed:
  None.

Preserve-semantic check:
  Reused the existing `Input` atom. `ListInputLines` and `SpecsInput` remain as genuine compound wrappers. No new base `TextInput.tsx` was created.

Implementation:
```text
- Added textarea support to `Input`.
- Migrated large textarea consumers to `Input as="textarea"`.
- Migrated the one inline editor consumer to local `EditorHeader` edit state using `Input`.
- Deleted visual variant wrappers `TextInputLarge` and `TextInputInline`.
```

Verification:
```text
`npm run typecheck` PASS
rg old input variants: 0
forms/inputs component files: 2 plus index.ts
```

Gates:
```text
typecheck: PASS
lint: N/A — known repo-wide debt; full lint gate deferred to sprint gate task
validate:architecture: N/A — full architecture gate deferred to sprint gate task
test: N/A — full test gate deferred to sprint gate task
browser: N/A — browser spot-check deferred to sprint gate task
```

Next task:
  P2 Task 5 — Select consolidation.
