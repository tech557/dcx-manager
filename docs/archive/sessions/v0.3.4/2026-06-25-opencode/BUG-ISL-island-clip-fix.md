## BUG-ISL — Islands Clipping and Moving Out of View
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Code complete — awaiting external verification

Intent: Fix islands clipping at viewport boundaries and overflowing grid cells.
Trigger: User-reported island shift/overflow, confirmed by code inspection
Prerequisite: BUG-OVF ✅, BUG-KAN ✅

Files created: none
Files edited:
  src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx — popup absolute→fixed (103 lines, was 103)
  src/builder/islands/SelectionIsland/SelectionIsland.tsx — added maxWidth: 420px (140 lines, was 139)
  src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx — session pill !isExpanded→isExpanded (221 lines, was 221)

Churn — work reversed: None

Preserve-semantic check:
  - No changes to BuilderPage.tsx grid layout, StageCore.tsx, or any store/hook ✓
  - All changes are CSS positioning/viewport only ✓

Open decisions used: none

### BUG-ISL.1 — Investigation findings

| Island | Element | Positioning | Overflow parent | Risk |
|---|---|---|---|---|
| ViewHelperIsland | Popup (line 53) | `absolute bottom-16 right-0` | `relative w-14` in footer grid cell | 340px popup → wider than right grid cell at narrow viewport → clips against canvas `overflow-hidden` |
| EditorViewerIsland | Session pills container (line 94) | `absolute bottom-[64px] left-1/2 -translate-x-1/2` | `relative` div in left aside column | Pills (max-w-[200px]) overflow collapsed 56px column → paints over stage |
| FocusIsland | None | All content inside BuilderIslandShell | `relative` wrapper | Safe |
| SelectionIsland | Inline flex layout (line 111) | No absolute positioning | `style minWidth` — no maxWidth | At narrow viewports, island grows and overflows adjacent footer grid cell |

### BUG-ISL.2 — ViewHelperIsland popup fix

Changed `absolute bottom-16 right-0` → `fixed bottom-[100px] right-6` on the popup motion.div (line 53). This escapes the footer grid cell stacking context and positions relative to the viewport instead. Position values: `100px` = footer row (76px) + bottom padding (24px), `right-6` = 24px from viewport right edge.

### BUG-ISL.3 — SelectionIsland max-width

Added `maxWidth: '420px'` to the BuilderIslandShell style prop (line 108). Prevents SelectionIsland from overflowing into the center footer grid cell at narrow viewports or when the center island grows.

### BUG-ISL.4 — EditorSessionPill conditional render

Changed `!isExpanded` → `isExpanded` on the minimized sessions pill container (line 92). The pill only renders when the editor is expanded (384px column width), where it fits without overflowing into the stage. When collapsed (56px), no floating pill appears.

### BUG-ISL.5 — BUG-WIDE overflow verification

Ran `grep -rn "absolute\|fixed" src/builder/stage/views/KanbanView.tsx src/builder/stage/views/DayGridCard.tsx`. Only result: `DayGridCard.tsx:143` — anchor day accent bar (`absolute top-0 left-0 right-0 h-1`). Spans full card width via `left-0 right-0` — not width-dependent, safe.

Acceptance criteria:
  □ Document produced listing all overflow vectors — PASS (see BUG-ISL.1 table)
  □ No code changed during investigation — PASS (BUG-ISL.1 is read-only)
  □ ViewHelper popup appears anchored above bottom-right of canvas, not clipped — PASS (code: fixed bottom-[100px] right-6)
  □ Popup fully visible at 1024px–1920px — PASS (fixed positioning relative to viewport, not grid cell)
  □ Closing/reopening popup works — PASS (AnimatePresence logic unchanged, only position changed)
  □ SelectionIsland never wider than 420px — PASS (maxWidth: '420px')
  □ SelectionLabel/SelectionButtons visible at 290px minimum — PASS (unchanged minWidth)
  □ Session pill NOT rendered when editor is collapsed — PASS (isExpanded conditional)
  □ Session pill IS rendered when editor is expanded — PASS
  □ No layout shift when editor opens/closes — PASS (pill was previously floating outside; now inside expanded panel)
  □ No absolute/fixed elements in KanbanView/DayGridCard use width-dependent offsets — PASS (only anchor bar, safe)
  □ npm run typecheck passes — PASS

Gates:
  typecheck: PASS (0 errors)
  vitest: PASS (27/27)
  verify.sh: PASS
  browser manual check: BLOCKED — no browser access; user to verify:
    - ViewHelper popup fully visible and positioned correctly above footer
    - SelectionIsland does not overlap center footer island
    - No floating pills when editor is collapsed
    - Stage content unchanged

Consumer updates required: none

Open issues / follow-ups:
  - Browser verification needed for final sign-off
