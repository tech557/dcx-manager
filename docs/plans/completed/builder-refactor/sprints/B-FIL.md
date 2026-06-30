# Sprint B-FIL — File Preview Migration ✅ BLD-FIL-001

**Status:** ✅ Completed  
**Requirements:** BLD-FIL-001 — file preview relocated to Project Meta Island  
**Rollback boundary:** Revert MetadataIsland/, ViewHelperIsland/ changes

This sprint is a prerequisite for B8 (View Context). ViewHelperIsland must be cleared of file preview before View Context content is added.

---

## B-FIL.1 — Extract file preview logic into shared hook

### Objective
Decouple file preview state from ViewHelperIsland. Create a standalone hook usable by MetadataIsland.

### Files to inspect
- `src/builder/islands/ViewHelperIsland/useViewHelper.ts` (contains file preview state)
- `src/ui/StickyPopupShell.tsx` (used by the preview popup)

### Files likely to change
- `src/builder/islands/ViewHelperIsland/useViewHelper.ts` (SHRINK)
- `src/builder/islands/MetadataIsland/useFilePreview.ts` (CREATE)

### Required behaviour
Create `useFilePreview.ts` at `src/builder/islands/MetadataIsland/useFilePreview.ts`:
- Move from `useViewHelper.ts`: `isPreviewOpen`, `previewUrl`, `previewTitle`, `previewContentType`, `previewEmbedAllowed`, `createdObjectUrlRef`, cleanup `useEffect`, `handleFileChange`, `handleRemotePreview`, `handleClosePreview`
- `useViewHelper.ts` retains ONLY: `isExpanded`, `setIsExpanded`
- `useFilePreview.ts` must have no imports from builder-specific files — it is a standalone utility hook

### Preserve-semantic boundaries
- Preserve URL.revokeObjectURL cleanup on unmount
- Do not change StickyPopupShell

### Acceptance criteria
```
□ useFilePreview.ts exports: isPreviewOpen, previewUrl, previewTitle, previewContentType, previewEmbedAllowed, handleFileChange, handleRemotePreview, handleClosePreview
□ useViewHelper.ts exports only: isExpanded, setIsExpanded
□ npm run typecheck passes
```

### Agent Execution Notes
**With terminal:** Run typecheck after. Verify useViewHelper and useFilePreview both compile cleanly.  
**Without terminal:** Return both files complete. Confirm useFilePreview has no builder-specific imports.

### Progress log
`docs/progress/sessions/[date]-[agent]/B-FIL-1-extract-hook.md`

---

## B-FIL.2 — Remove file preview from ViewHelperIsland

### Objective
Strip file preview UI, location jumper, and keyboard shortcuts from ViewHelperIsland. Leave only the island pill/shell that B8 will repopulate.

### Files to inspect
- `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx`
- `src/builder/islands/ViewHelperIsland/useViewHelper.ts` (after B-FIL.1)
- `src/builder/islands/ViewHelperIsland/useViewHelperScrollers.ts`

### Files likely to change
- `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx`

### Required behaviour
Remove from expanded popup content:
- "File & URL Preview" section (local file input, URL input, Preview button)
- "Location Jumper" section
- "Keyboard Shortcuts" section
- "Quick Summary Counts" section (phases/actions/tasks)

Remove imports: `Navigation2`, `HelpCircle`, `CheckCircle`, handlers from `useViewHelperScrollers` that are only used by removed sections.

Keep: island pill button, expanded popup shell (motion.div with resize), header bar with close button, footer label.

Replace popup content body with:
```tsx
<p className="text-xs opacity-40 p-4 text-center">
  View Context — coming in the next update.
</p>
```

The `StickyPopupShell` preview popup reference must be REMOVED from ViewHelperIsland.tsx.

### Preserve-semantic boundaries
- Keep popup shell dimensions, animation, z-index, positioning
- Keep `if (view === 'kanban') return null` — View Context is Timeline only
- Do not touch useViewHelper.ts, StickyPopupShell.tsx, or any card component

### Acceptance criteria
```
□ ViewHelperIsland renders pill in Timeline view
□ Expanding shows placeholder text (no file preview, no jumper, no shortcuts)
□ StickyPopupShell NOT rendered in ViewHelperIsland
□ No file input element in ViewHelperIsland.tsx
□ BLD-FIL-001: ViewHelperIsland contains zero file preview logic
□ npm run typecheck passes
```

### Agent Execution Notes
**With terminal:** Run typecheck. Open builder in Timeline, expand ViewHelper, verify placeholder text.  
**Without terminal:** Return ViewHelperIsland.tsx complete. State which imports were removed.

### Progress log
`docs/progress/sessions/[date]-[agent]/B-FIL-2-strip-view-helper.md`

---

## B-FIL.3 — Add Files section with preview to MetadataIsland

### Objective ✅ BLD-FIL-001
Add a clickable Files area to MetadataIsland. Clicking opens a fixed popup listing project files. Files can be opened in sticky preview sessions.

### Files to inspect
- `src/builder/islands/MetadataIsland/MetadataIsland.tsx`
- `src/builder/islands/MetadataIsland/MetadataDetailsContent.tsx`
- `src/builder/islands/MetadataIsland/useFilePreview.ts` (created in B-FIL.1)
- `src/ui/StickyPopupShell.tsx`
- `src/types/domain.ts` (for FileAttachment type)

### Files likely to change
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx` (CREATE — ≤120 lines)
- `src/builder/islands/MetadataIsland/MetadataDetailsContent.tsx` (EDIT)
- `src/builder/islands/MetadataIsland/MetadataIsland.tsx` (EDIT)

### Required behaviour

**`MetadataFilesPopup.tsx`:**
- Props: `isOpen: boolean`, `onClose: () => void`, `attachments: FileAttachment[]`, plus all from `useFilePreview` spread
- Fixed glass popup (not resizable in V1 ✅ BLD-FIL-002 / OD-007)
- Lists all `attachments` as rows: title + source badge + "Open" button
- "Open" button calls `handleRemotePreview(attachment.url)` or loads as local file
- Local file input (for opening files not in the list)
- Remote URL input + Preview button
- File preview renders via `StickyPopupShell` (the same StickyPopupShell that was previously in ViewHelperIsland)
- Close button

**`MetadataDetailsContent.tsx`:**
- Paperclip + filesCount `<div>` becomes `<button>` calling `onFilesClick()`
- Add prop: `onFilesClick: () => void`

**`MetadataIsland.tsx`:**
- Import `useFilePreview`
- Add `const [isFilesOpen, setIsFilesOpen] = useState(false)` local state
- Render `<MetadataFilesPopup>` with file preview props spread + `attachments={versionData?.attachments ?? []}`
- Pass `onFilesClick={() => setIsFilesOpen(true)}` to MetadataDetailsContent

### State and data implications
File preview state is now in MetadataIsland scope, not in ViewHelperIsland.

### Preserve-semantic boundaries
- All existing MetadataIsland behaviour: status transitions, date picker, team count, view tabs — unchanged
- Do not change useViewHelper.ts or ViewHelperIsland.tsx
- Do not change StickyPopupShell.tsx

### Acceptance criteria
```
□ Clicking Paperclip/files area in MetadataIsland opens MetadataFilesPopup
□ Popup lists version attachments
□ Local file input opens preview via StickyPopupShell
□ Remote URL opens preview via StickyPopupShell
□ Preview closes correctly
□ MetadataFilesPopup.tsx ≤ 120 lines
□ BLD-FIL-001 confirmed: View Context has zero file preview
□ npm run typecheck passes
```

### Agent Execution Notes
**With terminal:** Run typecheck. Open builder, click Paperclip icon in top bar, verify popup opens with attachments list. Open a file, verify preview panel appears.  
**Without terminal:** Return MetadataFilesPopup.tsx, MetadataDetailsContent.tsx, MetadataIsland.tsx complete. List all new imports added.

### Progress log
`docs/progress/sessions/[date]-[agent]/B-FIL-3-meta-island-files.md`
