## BUG-WIDE — Expanded Card Width Reduction
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Code complete — awaiting external verification

Intent: Reduce expanded card/column width from 360px to 260px so 4+ cards fit at 1440px viewport without horizontal scroll for typical load.
Trigger: Screenshot evidence — only 2 expanded day columns visible, phases too wide for comfortable view
Requirements covered: AGENTS.md §22 (layout viewport planning: max 260px for repeating columns)

Files created: none
Files edited:
  src/builder/stage/views/DayGridCard.tsx — expanded width 360→260px (248 lines, was 248)
  src/builder/stage/views/KanbanView.tsx — phase column width 360→260px, EXPANDED_COL_WIDTH 360→260 (146 lines, was 146)
  src/builder/BuilderLoadingShell.tsx — skeleton 360→260px (64 lines, was 64)

Churn — work reversed: None

Preserve-semantic check:
  - All changes are CSS width values only — no logic, hooks, or state changes ✓
  - Task card height (h-[60px]) untouched — per sprint constraint ✓
  - ActionCard max-w unchanged — still fits in 228px inner width ✓

Open decisions used: none

Acceptance criteria:
  BUG-WIDE.1:
  □ Expanded day cards are 260px — PASS (code: hasAnyExpandedTask ? 'w-[260px]')
  □ Non-expanded day cards remain 220px — PASS (unchanged)
  □ Task card height stays 60px — PASS (h-[60px] in TaskCard.tsx untouched)
  □ Task card content visible — PASS (same content, narrower container; title truncation acceptable)

  BUG-WIDE.2:
  □ Expanded phase columns are 260px — PASS (w-[260px])
  □ Collapsed phase columns remain 72px — PASS (unchanged)
  □ shouldCenter calculation uses 260 — PASS (EXPANDED_COL_WIDTH = 260)

  BUG-WIDE.3:
  □ LoadingShell skeleton phase columns are 260px — PASS (w-[260px])

  BUG-WIDE.4:
  □ No hardcoded 360 in WeeklyView.tsx or useWeeklyView.ts — PASS
  □ No hardcoded 360 in KanbanView.tsx after changes — PASS
  □ grep -rn "w-\[360" src/builder/stage returns 0 results — PASS

  Gates:
  □ npm run typecheck passes — PASS
  □ npx vitest run (27/27) — PASS
  □ verify.sh — PASS
  □ Browser gate — BLOCKED: no browser access (user to verify: 3+ expanded day columns visible without scrolling in Timeline, 3+ expanded phases visible in Kanban)

Consumer updates required: none

Open issues / follow-ups:
  - Browser verification required for final sign-off
