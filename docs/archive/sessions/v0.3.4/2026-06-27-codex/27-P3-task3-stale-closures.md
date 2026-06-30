## P3 — Task 3 stale closures
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-27
Status: Completed

Intent: Fix or verify the three stale-closure bugs named by P3.
Trigger: continuing P3 after Task 2 per the user-requested per-task logging methodology.
Requirements covered: P3 Step 3 Fix 3 stale-closure bugs.

Files created:
  docs/progress/sessions/2026-06-27-codex/27-P3-task3-stale-closures.md

Files edited:
  src/builder/stage/StageCore.tsx
  docs/plans/active/folder-structure-v2/sprints/P3-structure-quality.md
  docs/plans/active/folder-structure-v2/output/P3-structure-quality.md
  docs/progress/index.csv

Files deleted:
  None.

Churn — work reversed:
  None.

Preserve-semantic check:
  Did not touch shell/component structure, `src/ui/shadcn/*`, or `src/stories/*`. Scope was limited to the named stale-closure files.

Implementation:
```text
- Re-read live `useDayGridDrag.ts`, `DayTaskCreator.tsx`, and `StageCore.tsx`.
- Confirmed the discovery-specific missing deps in `useDayGridDrag` and `DayTaskCreator` no longer exist in current code.
- Stabilized `StageCore` cleanup callbacks by declaring `stopScrolling` and `cancelWeekNav` with `useCallback` before the cleanup effect.
- Removed unused `focusedNodeId` destructuring from `StageCore`.
```

Verification:
```text
focused lint on useDayGridDrag, DayTaskCreator, StageCore PASS
targeted exhaustive-deps grep for the three files: 0 lines
`npm run typecheck` PASS
`npm run test` PASS — 6 files, 27 tests
```

Gates:
```text
typecheck: PASS
focused lint on named files: PASS
test: PASS
browser: N/A — deferred to P3 full gate task/opencode handoff if needed
```

Next task:
  P3 Task 4 — remove `as any` casts from EditorViewerIsland cluster.
