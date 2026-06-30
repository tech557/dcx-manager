## P2 — Task 2 orphan deletion
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-27
Status: Completed

Intent: Delete confirmed-dead P2 orphan components and remove their barrel exports in small batches.
Trigger: continuing P2 after Task 1 per the user-requested per-task logging methodology.
Requirements covered: P2 Step 2 deletion scope for confirmed-dead files; `ReadinessBadge` deferred to Task 3 migration.

Files created:
  docs/progress/sessions/2026-06-27-codex/15-P2-task2-orphan-deletion.md

Files edited:
  src/ui/forms/inputs/index.ts
  src/ui/forms/selects/index.ts
  docs/plans/active/folder-structure-v2/sprints/P2-component-consolidation.md
  docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md
  docs/progress/index.csv

Files deleted:
  src/ui/LockBadge.tsx
  src/ui/StatusBadge.tsx
  src/builder/cards/FieldIndicator.tsx
  src/ui/forms/inputs/DateInputTBD.tsx
  src/ui/forms/inputs/DualInput.tsx
  src/ui/forms/inputs/TextInputSmall.tsx
  src/ui/forms/selects/SearchableSelect.tsx
  src/ui/forms/selects/SearchableSelectIcons.tsx
  src/builder/cards/templates/day/DayCard.tsx
  src/builder/cards/templates/day/.gitkeep

Churn — work reversed:
  None.

Preserve-semantic check:
  Deleted only files verified as dead in Task 1. `ReadinessBadge.tsx` was not deleted because it has real consumers through `PhaseReadinessBadge`.

Batch gates:
```text
Batch 1 deletion typecheck: PASS
Batch 2 deletion + input barrel cleanup typecheck: PASS
Batch 3 deletion + select barrel cleanup typecheck: PASS
Final Task 2 typecheck after empty day folder removal: PASS
```

Verification:
```text
Deleted candidate grep: PASS — no hits for deleted components.
Expected remaining false positive: src/types/card.types.ts FieldIndicator interface.
Input form files after Task 2: 5 files including index.ts.
Select form files after Task 2: 3 files including index.ts.
```

Gates:
```text
typecheck: PASS
lint: N/A — known repo-wide debt; full lint gate deferred to sprint gate task
validate:architecture: N/A — deletion-only batch; full architecture gate deferred to sprint gate task
test: N/A — full test gate deferred to sprint gate task
browser: N/A — no rendered behavior expected from deleted dead files
```

Next task:
  P2 Task 3 — Badge reconciliation, including migrating `PhaseReadinessBadge` away from `ReadinessBadge` so `ReadinessBadge.tsx` can be deleted safely.
