## FIX-POL — Visual Polish Re-run
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-25
Status: Completed

Intent: Verify visual correctness after all FIX-* and BUG-* sprints — loading shell dimensions, theme-adaptive surfaces, empty states.
Trigger: B12 audit FAIL; FIX-POL sprint file.
Requirements covered: BLD-LOD-001, BLD-POL-001, BLD-POL-002, BLD-POL-003

Prerequisites verified before starting:
  - FIX-NDX ✅ (Codex)
  - FIX-CRD ✅ (Codex)
  - FIX-DEN ✅ (opencode)
  - FIX-NLC ✅ (opencode, 27/27 tests)
  - FIX-FIL ✅ (opencode)
  - FIX-MOT ✅ (opencode)
  - FIX-CAP ✅ (opencode)
  - BUG-OVF ✅ (Claude)
  - BUG-KAN ✅ (opencode — code verified by Claude)

---

Files created:    none
Files edited:     none (all checks passed as-is)
Files deleted:    none

---

## FIX-POL.1 — Loading shell geometry

Inspected `src/builder/BuilderLoadingShell.tsx` (64 lines):

| Element | Skeleton value | Live value | Match |
|---------|---------------|-----------|-------|
| Header row | `h-[64px]` | `h-16` (64px) | ✅ |
| Left column | `w-[72px]` | `w-[4.5rem]` (72px) | ✅ |
| Right column | `w-[72px]` | `w-[4.5rem]` (72px) | ✅ |
| Phase skeleton cols | `w-[360px]` × 3 | `w-[360px]` (FIX-DEN) | ✅ |
| Footer row | `h-[76px]` | `h-14` + padding = 76px | ✅ |

Result: PASS

## FIX-POL.2 — Theme-adaptive surfaces

`TimelineBuilderIsland.tsx`: uses `island-shell` class + `useTheme()` + `dark:` Tailwind prefixes throughout. All text, borders, hover states have light/dark variants. PASS ✅

`MetadataFilesPopup.tsx`: uses `useTheme()` → `isDark` for conditional classes on container, list items, inputs, and buttons. Both light and dark branches present. PASS ✅

`brand/index.css`: `.island-shell` uses CSS variables (`var(--theme-glass-bg)`, `var(--theme-border-subtle)`). PASS ✅

Result: PASS

## FIX-POL.3 — Empty states

`KanbanView.tsx` zero-phases empty state: present at lines 97–119, inline JSX with cyan CTA button "Add First Phase". Renders when `phaseNodes.length === 0`. PASS ✅

`DayGridCardEmpty.tsx`: extracted component (42 lines), imported and rendered in `DayGridCard.tsx` when `tasks.length === 0` and the day is enabled. PASS ✅

Result: PASS

## FIX-POL.4 — Screenshots

Skipped per product owner instruction.

---

Churn — work reversed:
  None — no code changes made in this sprint.

Preserve-semantic check:
  N/A — no code changes.

Acceptance criteria:
  ☑ LoadingShell skeleton dimensions match live layout after FIX-DEN phase width change — PASS
  ☑ All islands are theme-adaptive (light/dark) — PASS
  ☑ Empty states render correctly in both Kanban and weekly Day view — PASS (code verified)
  ☑ Six screenshots — SKIPPED per PO
  ☑ No .ts hook or store files changed — PASS (no changes made)
  ☑ No interaction behaviour changed — PASS
  ☑ npm run typecheck passes — PASS (0 errors)
  ☑ npx vitest run passes — PASS (27/27)
  ☑ verify.sh passes — PASS

Gates:
  typecheck: PASS (0 errors, 0 suppressions)
  vitest: PASS (27/27, 6 files)
  verify.sh: PASS
  browser manual check: SKIPPED per PO — code inspection confirms all three POL items are structurally correct

Consumer updates required: none

Open issues / follow-ups:
  B13 (acceptance review) is next and is now unblocked.
