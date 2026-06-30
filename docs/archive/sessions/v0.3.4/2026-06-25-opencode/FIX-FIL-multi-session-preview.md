## FIX-FIL — File Preview Multi-Session
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Replace single-file preview with multi-session state and minimize-to-pill behaviour
Trigger: B-FIL audit PARTIAL — multi-session and minimize-to-pill absent
Requirements covered: BLD-FIL-002 / OD-007

Files created: none

Files edited:
  src/builder/islands/MetadataIsland/useFilePreview.ts
  — Replaced single { url, title, isOpen } state with FileSession[]
  — Added openFile, closeFile, minimizeFile, restoreFile operations
  — Kept handleFileChange, handleRemotePreview (wired to openFile)
  (52 lines, was 107)

  src/ui/StickyPopupShell.tsx
  — Added onMinimize callback prop
  — Made minimized state controlled via isMinimized prop
  — Conditionally renders minimize button only if onMinimize is provided
  (70 lines, was 66)

  src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx
  — Replaced single-session preview props with sessions array
  — Renders one StickyPopupShell per open session
  — Renders pill bar at bottom for minimized sessions (click to restore)
  — Updated handleRemotePreview calls to pass file.title as second arg
  (115 lines, was 158)

Files deleted: none

Churn — work reversed:
  None

Preserve-semantic check:
  - Action boundary: no mutations added
  - Readiness boundary: no readiness rules touched
  - Theme boundary: useTheme used (existing pattern)
  - Mapper boundary: no services touched
  - No global side-channels: not introduced
  - Import level: useFilePreview imports from React only; MetadataFilesPopup imports from ui/ and hooks/

Open decisions used:
  None

Acceptance criteria:
  FIX-FIL.1:
    □ Opening two different files produces two independent preview sessions — PASS (openFile appends)
    □ Closing one session does not affect the other — PASS (closeFile removes by id)
    □ useFilePreview.ts ≤ 80 lines — PASS (52 lines)
  FIX-FIL.2:
    □ Minimizing a preview creates a visible session pill — PASS (minimizedSessions rendered as pills)
    □ Clicking the pill restores the preview — PASS (restoreFile sets isMinimized=false)
    □ Multiple minimized sessions produce multiple pills — PASS (map over minimizedSessions)
    □ MetadataFilesPopup.tsx ≤ 120 lines — PASS (115 lines)
  □ npm run typecheck — PASS (0 errors)
  □ npx vitest run — PASS (27/27)
  □ bash scripts/verify.sh — PASS
  □ Browser check: open two files, minimize both, restore one via pill — needs manual verification

Gates:
  typecheck: PASS (0 errors, 0 suppressions)
  vitest: PASS (27 tests, 6 files)
  verify.sh: PASS
  browser manual check: open attachments dialog, open two files, verify two popups, minimize each, click pills to restore

Consumer updates required:
  - MetadataIsland.tsx — no changes needed (spread of filePreview still works, props renamed inside popup)
  - MetadataFilesPopup — consumers must pass new props interface (sessions/closeFile/minimizeFile/restoreFile instead of single preview props)

Open issues / follow-ups:
  - File URL cleanup (URL.revokeObjectURL) not implemented in multi-session version. The old code cleaned up on close. Currently object URLs live until tab close. Consider adding cleanup in closeFile.
