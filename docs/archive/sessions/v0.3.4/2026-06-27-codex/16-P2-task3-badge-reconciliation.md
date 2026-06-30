## P2 — Task 3 badge reconciliation
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-27
Status: Completed

Intent: Reconcile badge variants onto the existing `src/ui/atoms/Badge.tsx` atom and safely remove `ReadinessBadge`.
Trigger: continuing P2 after Task 2 per the user-requested per-task logging methodology.
Requirements covered: P2 Step 3 Badge reconciliation.

Files created:
  docs/progress/sessions/2026-06-27-codex/16-P2-task3-badge-reconciliation.md

Files edited:
  src/ui/atoms/Badge.tsx
  src/builder/cards/templates/phase/PhaseReadinessBadge.tsx
  docs/plans/active/folder-structure-v2/sprints/P2-component-consolidation.md
  docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md
  docs/progress/index.csv

Files deleted:
  src/ui/ReadinessBadge.tsx

Churn — work reversed:
  None.

Preserve-semantic check:
  Preserved the existing `PhaseReadinessBadge` builder-facing semantic wrapper and moved its implementation onto the existing `Badge` atom. No readiness rule, store, action, service, or mock backend behavior changed.

Implementation:
```text
- Added `variant?: 'default' | 'status' | 'readiness' | 'lock'` to `BadgeProps`.
- Migrated `PhaseReadinessBadge.tsx` off the `@/ui/ReadinessBadge` re-export.
- Deleted `src/ui/ReadinessBadge.tsx`.
```

Verification:
```text
npm run typecheck PASS
rg "ReadinessBadge|StatusBadge|LockBadge": only PhaseReadinessBadge semantic wrapper references remain.
```

Gates:
```text
typecheck: PASS
lint: N/A — known repo-wide debt; full lint gate deferred to sprint gate task
validate:architecture: N/A — full architecture gate deferred to sprint gate task
test: N/A — full test gate deferred to sprint gate task
browser: N/A — component wrapper implementation unchanged visually by contract; browser spot-check deferred to sprint gate task
```

Next task:
  P2 Task 4 — Input reconciliation onto existing `src/ui/atoms/Input.tsx`.
