# Sprint FIX-FIL — File Preview Multi-Session (Re-work)

**Status:** 🔴 Not started  
**Prerequisite:** None (isolated to MetadataIsland)  
**Audit finding:** B-FIL audit result was PARTIAL. Migration location works. Multi-session (multiple open previews) and minimize-to-pill behavior are absent. `useFilePreview` stores only one URL, replacing the current preview on each open.

**Rollback boundary:** `useFilePreview.ts`, `MetadataFilesPopup.tsx`, `StickyPopupShell.tsx`

---

## FIX-FIL.1 — Multi-session file preview state

### Audit finding
`useFilePreview` holds a single `{ url, title, isOpen }` triple. Opening a second file replaces the first. Confirmed decision BLD-FIL-002 / OD-007 requires: multiple previews can remain open simultaneously; minimized previews become session pills.

### Files to change
- `src/builder/islands/MetadataIsland/useFilePreview.ts` — replace single-session state with session array

### Required behaviour
```typescript
type FileSession = { id: string; title: string; url: string; isMinimized: boolean };
// state: FileSession[]

function openFile(title: string, url: string): void  // appends new session
function closeFile(id: string): void                  // removes session
function minimizeFile(id: string): void               // sets isMinimized = true
function restoreFile(id: string): void                // sets isMinimized = false
```

Sessions are independent. Opening a new file never closes or replaces an existing session.

### Acceptance criteria
```
□ Opening two different files produces two independent preview sessions
□ Closing one session does not affect the other
□ useFilePreview.ts ≤ 80 lines
□ npm run typecheck passes
```

---

## FIX-FIL.2 — Minimize-to-pill behaviour

### Audit finding
`StickyPopupShell` minimizes in place. There are no session pills. BLD-FIL-002 requires minimized previews to appear as session pills (restored on click).

### Files to change
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx` — render session pills for minimized sessions; ≤ 120 lines
- `src/ui/StickyPopupShell.tsx` — expose a `onMinimize` callback prop if not already present

### Required behaviour
- When user minimizes a preview session, `StickyPopupShell` calls `onMinimize()`.
- `MetadataFilesPopup` renders one pill per minimized session at the bottom of the files panel.
- Clicking a pill calls `restoreFile(id)` — session reopens.
- Pill shows session title (truncated if long).

### Acceptance criteria
```
□ Minimizing a preview creates a visible session pill
□ Clicking the pill restores the preview
□ Multiple minimized sessions produce multiple pills
□ MetadataFilesPopup.tsx ≤ 120 lines (wc -l confirmed)
□ npm run typecheck passes
□ Browser check: open two files, minimize both, restore one via pill
```

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-FIL-multi-session-preview.md`
