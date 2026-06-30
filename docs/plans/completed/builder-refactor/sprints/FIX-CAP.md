# Sprint FIX-CAP — File Size Cap Repairs

**Status:** 🔴 Not started  
**Prerequisite:** FIX-NLC (editor panel changes may affect EditorViewerIsland line count)  
**Audit finding:** Two files exceed the hard cap. AGENTS.md §6: React components hard cap is 250 lines. Files over the hard cap must be split before any other work proceeds.

| File | Current lines | Hard cap | Action |
|---|---|---|---|
| `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | 311 | 250 | Split |
| `src/builder/stage/views/DayGridCard.tsx` | 267 | 250 | Split |

**Rollback boundary:** `EditorViewerIsland.tsx`, `DayGridCard.tsx`, and any new files created by the split.

---

## FIX-CAP.1 — Split EditorViewerIsland.tsx

### Objective
`EditorViewerIsland.tsx` is 311 lines. Extract logical sub-sections into their own files until the main file is ≤ 250 lines. The island's external API (props, exports) must not change.

### Files to inspect first
`src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` — read fully before splitting.

### Approach
Look for self-contained sections to extract. Candidates:
- Session pill rendering section → `EditorSessionPillList.tsx` (already `EditorSessionPill.tsx` exists — extend or add a list wrapper)
- Header controls section (if not already in `EditorHeader.tsx`)
- Section router (the `switch(activeSection)` or equivalent) → inline remains acceptable if small

Extract into files within `src/builder/islands/EditorViewerIsland/`. Each extracted file must be ≤ 150 lines.

### Acceptance criteria
```
□ EditorViewerIsland.tsx ≤ 250 lines (wc -l confirmed)
□ All extracted files ≤ 150 lines each
□ No change to EditorViewerIsland's props or exported interface
□ No new imports of src/services/ or src/rules/ added
□ npm run typecheck passes
□ Browser: EditorViewerIsland still opens/closes and loads task data
```

---

## FIX-CAP.2 — Split DayGridCard.tsx

### Objective
`DayGridCard.tsx` is 267 lines. Extract until the main file is ≤ 250 lines. This file renders the day column card in the weekly/timeline view.

### Files to inspect first
`src/builder/stage/views/DayGridCard.tsx` — read fully before splitting.

### Approach
Look for self-contained rendering sections:
- Empty state JSX → `DayGridCardEmpty.tsx` within `src/builder/stage/views/`
- Task list items → already has a hook (`useDayGridCard.ts`); extract item rendering if needed

Each extracted file must be ≤ 150 lines.

### Acceptance criteria
```
□ DayGridCard.tsx ≤ 250 lines (wc -l confirmed)
□ All extracted files ≤ 150 lines each
□ DayGridCard renders identically before and after split
□ npm run typecheck passes
```

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-CAP-file-size-repairs.md`
