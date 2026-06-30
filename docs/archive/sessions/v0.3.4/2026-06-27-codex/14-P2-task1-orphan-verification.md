## P2 — Task 1 orphan verification
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-27
Status: Completed

Intent: Verify the P2 orphan deletion candidates before deleting any component files.
Trigger: continuing P2 after Task 0 per the user-requested per-task logging methodology.
Requirements covered: P2 Step 1 orphan verification, including barrel false positives and `FieldIndicator` type-name collision.

Files created:
  docs/progress/sessions/2026-06-27-codex/14-P2-task1-orphan-verification.md

Files edited:
  docs/plans/active/folder-structure-v2/sprints/P2-component-consolidation.md
  docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md
  docs/progress/index.csv

Files deleted:
  None

Churn — work reversed:
  None.

Preserve-semantic check:
  Verification-only task. No source code, UI behavior, service behavior, readiness logic, store logic, or mock backend behavior changed.

Verification commands:
```text
rg -n "LockBadge|ReadinessBadge|StatusBadge|FieldIndicator|DateInputTBD" src --glob '*.{ts,tsx}' --glob '!*.test.*'
rg -n "DualInput|TextInputSmall|SearchableSelect|SearchableSelectIcons|DayCard" src --glob '*.{ts,tsx}' --glob '!*.test.*'
bash scripts/agent/code-query.sh consumers <ComponentName>
```

Findings:
```text
Confirmed dead for Task 2 deletion:
- src/ui/LockBadge.tsx
- src/ui/StatusBadge.tsx
- src/builder/cards/FieldIndicator.tsx
- src/ui/forms/inputs/DateInputTBD.tsx
- src/ui/forms/inputs/DualInput.tsx
- src/ui/forms/inputs/TextInputSmall.tsx
- src/ui/forms/selects/SearchableSelect.tsx
- src/ui/forms/selects/SearchableSelectIcons.tsx
- src/builder/cards/templates/day/DayCard.tsx

Deferred to Task 3 migration:
- src/ui/ReadinessBadge.tsx is used through `PhaseReadinessBadge.tsx`, which has real consumers in PhaseCard, DayGridCard, and DayGridCardCollapsed.

False positives:
- Barrel re-exports in `src/ui/forms/inputs/index.ts` and `src/ui/forms/selects/index.ts` are not real consumers and must be removed with deletion.
- `src/types/card.types.ts` `FieldIndicator` is an unrelated interface/type collision, not a component consumer.
```

Gates:
```text
typecheck: N/A — verification-only task
lint: N/A — verification-only task
validate:architecture: N/A — verification-only task
test: N/A — verification-only task
browser: N/A — verification-only task
```

Next task:
  P2 Task 2 — delete the 9 confirmed-dead files and matching barrel exports in small batches, with typecheck after each batch. Do not delete `ReadinessBadge.tsx` until Task 3 migrates `PhaseReadinessBadge`.
