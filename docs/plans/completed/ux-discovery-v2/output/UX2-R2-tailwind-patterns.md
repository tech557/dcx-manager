# UX2-R2 — Tailwind v4 Pattern Audit
Date: 2026-06-26 | Agent: opencode

## Session Environment

```
repository_version: v0.3.2
package_version: 0.2.0
active_plans: []
code_index_stale: true (1124 min)
mcp_operational: [eslint]
verify.sh: pass
```

## Summary

| Metric | Pre-P1 (expired baseline) | Post-P1 (this scan) | Delta |
|--------|--------------------------|---------------------|-------|
| Dead CSS classes | 48 | 3 newly dead | -45 |
| Duplication groups | 5 | 3 persistent + 2 partially resolved | -2 groups |
| Unique arbitrary Tailwind values | N/A | 211 unique patterns | — |

## 3 — Arbitrary Tailwind values (full list)

| Pattern | Occurrences |
|---------|-------------|
| text-[var(--theme-accent)] | 111 |
| text-[var(--text-xs)] | 94 |
| bg-[var(--theme-accent)] | 70 |
| border-[var(--theme-accent)] | 67 |
| text-[var(--text-2xs)] | 63 |
| text-[var(--text-sm)] | 37 |
| text-[var(--text-3xs)] | 27 |
| text-[var(--text-3xs-plus)] | 13 |
| text-[var(--text-md-plus)] | 9 |
| ring-[var(--theme-accent)] | 9 |
| w-[1px] | 8 |
| text-[var(--text-xs-plus)] | 7 |
| text-[var(--text-md)] | 7 |
| text-[var(--text-2xs-plus)] | 7 |
| h-[60px] | 7 |
| text-[var(--theme-text-primary)] | 6 |
| text-[var(--text-base)] | 6 |
| bg-[#0d0d0e] | 6 |
| w-[18px] | 5 |
| tracking-[0.08em] | 5 |
| text-[var(--text-4xs)] | 5 |
| border-[var(--theme-border-subtle)] | 5 |
| w-[260px] | 4 |
| text-[var(--theme-text-muted)] | 4 |
| shadow-[0_0_15px_var(--theme-selected-glow)] | 4 |
| h-[1px] | 4 |
| h-[18px] | 4 |
| w-[72px] | 3 |
| w-[220px] | 3 |
| tracking-[0.2em] | 3 |
| tracking-[0.25em] | 3 |
| tracking-[0.1em] | 3 |
| shadow-[0_0_8px_var(--theme-accent)] | 3 |
| shadow-[0_0_15px_var(--theme-accent-medium)] | 3 |
| shadow-[0_0_12px_var(--theme-accent-bg)] | 3 |
| scale-[1.01] | 3 |
| rounded-[2rem] | 3 |
| max-w-[200px] | 3 |
| max-h-[180px] | 3 |
| bg-[#050506] | 3 |
| z-[999] | 2 |
| z-[130] | 2 |
| w-[560px] | 2 |
| w-[4.5rem] | 2 |
| w-[200px] | 2 |
| tracking-[0.15em] | 2 |
| text-[var(--theme-muted)] | 2 |
| shadow-[inset_0_0_12px_var(--theme-accent-medium)] | 2 |
| shadow-[0_0_12px_var(--theme-selected-glow)] | 2 |
| shadow-[0_0_10px_var(--theme-success-bg)] | 2 |
| scale-y-[1.02] | 2 |
| scale-y-[1.01] | 2 |
| scale-[1.03] | 2 |
| rounded-[1.5rem] | 2 |
| right-[115%] | 2 |
| min-w-[140px] | 2 |
| max-h-[320px] | 2 |
| max-h-[280px] | 2 |
| max-h-[220px] | 2 |
| max-h-[140px] | 2 |
| h-[76px] | 2 |
| h-[64px] | 2 |
| h-[480px] | 2 |
| h-[320px] | 2 |
| border-t-[3px] | 2 |
| border-r-[3px] | 2 |
| border-l-[3px] | 2 |
| border-b-[3px] | 2 |
| bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.01),...)] | 2 |
| bg-[#121212] | 2 |
| bg-[#0c0d0f] | 2 |
| bg-[#0D0D0E] | 2 |
| z-[99999] | 1 |
| z-[60] | 1 |
| z-[45] | 1 |
| z-[1] | 1 |
| z-[120] | 1 |
| z-[100] | 1 |
| w-[clamp(280px,320px,360px)] | 1 |
| w-[70px] | 1 |
| w-[56px] | 1 |
| w-[450px] | 1 |
| w-[42%] | 1 |
| w-[320px] | 1 |
| w-[310px] | 1 |
| w-[280px] | 1 |
| w-[25rem] | 1 |
| w-[230px] | 1 |
| w-[210px] | 1 |
| w-[20px] | 1 |
| w-[14px] | 1 |
| translate-y-[-5%] | 1 |
| transition-[transform,box-shadow] | 1 |
| tracking-[0.12em] | 1 |
| top-[18%] | 1 |
| text-[var(--theme-warning)] | 1 |
| text-[var(--theme-error-alt)] | 1 |
| text-[var(--theme-error)] | 1 |
| text-[#F7F7F8] | 1 |
| text-[#55c2df] | 1 |
| text-[#006080] | 1 |
| stroke-[3] | 1 |
| shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),...] | 1 |
| shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),...] | 1 |
| shadow-[5px_0_15px_var(--theme-info-bg)] | 1 |
| shadow-[10px_0_30px_var(--theme-info-bg)] | 1 |
| shadow-[0_4px_20px_rgba(16,185,129,0.05)] | 1 |
| shadow-[0_15px_30px_rgba(0,0,0,0.8)] | 1 |
| shadow-[0_12px_45px_rgba(0,0,0,0.6)] | 1 |
| shadow-[0_12px_40px_rgba(0,0,0,0.4)] | 1 |
| shadow-[0_12px_40px_rgba(0,0,0,0.15)] | 1 |
| shadow-[0_12px_40px_rgba(0,0,0,0.06)] | 1 |
| shadow-[0_0_8px_var(--theme-warning-bg)] | 1 |
| shadow-[0_0_8px_var(--theme-error-bg-alt)] | 1 |
| shadow-[0_0_8px_var(--theme-accent-bg)] | 1 |
| shadow-[0_0_6px_rgba(82,82,82,0.5)] | 1 |
| shadow-[0_0_6px_rgba(163,163,163,0.5)] | 1 |
| shadow-[0_0_40px_rgba(52,211,153,0.35)] | 1 |
| shadow-[0_0_25px_var(--theme-accent-medium)] | 1 |
| shadow-[0_0_20px_var(--theme-selected-glow)] | 1 |
| shadow-[0_0_20px_var(--theme-accent-subtle)] | 1 |
| shadow-[0_0_16px_var(--theme-accent-strong)] | 1 |
| shadow-[0_0_14px_var(--theme-selected-glow)] | 1 |
| shadow-[0_0_14px_var(--theme-accent-medium)] | 1 |
| shadow-[0_0_12px_rgba(99,102,241,0.2)] | 1 |
| shadow-[0_0_10px_var(--theme-warning-glow),...] | 1 |
| shadow-[0_0_10px_var(--theme-success-glow),...] | 1 |
| shadow-[0_0_10px_var(--theme-success)] | 1 |
| shadow-[0_0_10px_var(--theme-accent)] | 1 |
| shadow-[0_0_10px_rgba(251,191,36,1)] | 1 |
| shadow-[-5px_0_15px_var(--theme-info-bg)] | 1 |
| shadow-[-10px_0_30px_var(--theme-info-bg)] | 1 |
| scale-[1.04] | 1 |
| scale-[0.99] | 1 |
| scale-[0.98] | 1 |
| rounded-tr-[20px] | 1 |
| rounded-tr-[12px] | 1 |
| rounded-tl-[20px] | 1 |
| rounded-tl-[12px] | 1 |
| rounded-br-[20px] | 1 |
| rounded-br-[12px] | 1 |
| rounded-bl-[20px] | 1 |
| rounded-bl-[12px] | 1 |
| rounded-[20px] | 1 |
| rounded-[12px] | 1 |
| p-[1.5px] | 1 |
| opacity-[0.92] | 1 |
| min-w-[90px] | 1 |
| min-w-[76px] | 1 |
| min-w-[72px] | 1 |
| min-w-[240px] | 1 |
| min-w-[120px] | 1 |
| min-w-[110px] | 1 |
| min-h-[400px] | 1 |
| min-h-[140px] | 1 |
| max-w-[90vw] | 1 |
| max-w-[72px] | 1 |
| max-w-[65px] | 1 |
| max-w-[480px] | 1 |
| max-w-[420px] | 1 |
| max-w-[380px] | 1 |
| max-w-[360px] | 1 |
| max-w-[320px] | 1 |
| max-w-[300px] | 1 |
| max-w-[275px] | 1 |
| max-w-[240px] | 1 |
| max-w-[230px] | 1 |
| max-w-[220px] | 1 |
| max-w-[210px] | 1 |
| max-w-[190px] | 1 |
| max-w-[160px] | 1 |
| max-w-[140px] | 1 |
| max-w-[130px] | 1 |
| max-w-[1200px] | 1 |
| max-h-[calc(100vh-24px)] | 1 |
| max-h-[90px] | 1 |
| max-h-[75vh] | 1 |
| max-h-[60vh] | 1 |
| max-h-[300px] | 1 |
| max-h-[240px] | 1 |
| max-h-[200px] | 1 |
| max-h-[150px] | 1 |
| left-[50%] | 1 |
| left-[200px] | 1 |
| left-[19px] | 1 |
| h-[56px] | 1 |
| h-[420px] | 1 |
| h-[35rem] | 1 |
| h-[32px] | 1 |
| h-[280px] | 1 |
| h-[20px] | 1 |
| h-[200px] | 1 |
| h-[14px] | 1 |
| h-[140px] | 1 |
| grid-cols-[88px_1fr] | 1 |
| drop-shadow-[0_0_8px_var(--theme-info)] | 1 |
| bottom-[64px] | 1 |
| bottom-[100px] | 1 |
| border-[#161617] | 1 |
| blur-[48px] | 1 |
| bg-[var(--theme-warning)] | 1 |
| bg-[var(--theme-error-alt)] | 1 |
| bg-[var(--theme-divider)] | 1 |
| bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.01),...)] | 1 |
| bg-[radial-gradient(circle_at_top,_var(--theme-accent-subtle),...)] | 1 |
| bg-[#241113] | 1 |
| bg-[#161617] | 1 |
| bg-[#0e0f12] | 1 |
| bg-[#0a0a0d] | 1 |
| backdrop-blur-[24px] | 1 |
| animate-[fadeIn_0.15s_ease-out] | 1 |

Total unique patterns: 211

## 4a — Dead CSS classes (zero TSX usages)

| Class | Notes |
|-------|-------|
| `.readiness-badge` | PhaseReadinessBadge was refactored to use Tailwind classes instead of this CSS class |
| `.editor-toggle-btn` | PhaseEditorSection now uses inline Tailwind classes instead |
| `.editor-toggle-btn-active` | PhaseEditorSection now uses inline Tailwind classes instead |

These are newly dead since the UX-R2 audit — P1 did not remove them. Candidates for deletion in folder-structure-v2 P1.

## 4b — Single-owner CSS classes

| Class | File |
|-------|------|
| `.action-card-header` | `src/builder/cards/templates/action/ActionCard.tsx` |
| `.app-nav` | `src/pages/RootLayout.tsx` |
| `.app-shell` | `src/pages/RootLayout.tsx` |
| `.builder-editor-panel` | `src/builder/BuilderPage.tsx` |
| `.builder-stage-area` | `src/builder/BuilderPage.tsx` |
| `.builder-stage-main` | `src/builder/BuilderPage.tsx` |
| `.card-template-header` | `src/builder/cards/templates/day/DayCard.tsx` |
| `.card-template-meta` | `src/builder/cards/templates/day/DayCard.tsx` |
| `.channel-pill` | `src/builder/cards/templates/task/task-properties/ChannelPill.tsx` |
| `.drop-target` | `src/builder/dropzones/DropTarget.tsx` |
| `.editor-field-label` | `src/builder/islands/EditorViewerIsland/PhaseEditorSection.tsx` |
| `.editor-input` | `src/builder/islands/TaskCreationFlow/CreateCompositionForm.tsx` |
| `.editor-island` | `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` |
| `.field-indicator` | `src/builder/cards/FieldIndicator.tsx` |
| `.field-indicator-popup` | `src/builder/cards/FieldIndicator.tsx` |
| `.field-indicator-wrap` | `src/builder/cards/FieldIndicator.tsx` |
| `.field-popup-edit` | `src/builder/cards/FieldIndicator.tsx` |
| `.field-popup-title` | `src/builder/cards/FieldIndicator.tsx` |
| `.glass-glow` | `src/builder/islands/HeaderBrandIsland.tsx` |
| `.header-container-floating` | `src/builder/islands/MetadataIsland/MetadataIsland.tsx` |
| `.header-island-pill` | `src/builder/islands/MetadataIsland/MetadataIsland.tsx` |
| `.island-toggle` | `src/builder/islands/FocusIsland/FocusIsland.tsx` |
| `.kanban-board` | `src/builder/stage/views/KanbanView.tsx` |
| `.kanban-builder-island` | `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` |
| `.kanban-column-drop` | `src/builder/stage/views/KanbanHiddenDropzones.tsx` |
| `.kanban-phase-column` | `src/builder/stage/views/KanbanView.tsx` |
| `.kanban-stage-drop` | `src/builder/stage/views/KanbanHiddenDropzones.tsx` |
| `.kanban-task-drop` | `src/builder/stage/views/KanbanHiddenDropzones.tsx` |
| `.metadata-island` | `src/builder/islands/MetadataIsland/MetadataIsland.tsx` |
| `.metadata-view-tabs` | `src/builder/islands/MetadataIsland/ViewTabSwitcher.tsx` |
| `.phase-card-header` | `src/builder/cards/templates/phase/PhaseCard.tsx` |
| `.stage-action-stack` | `src/builder/stage/views/SmokeStage.tsx` |
| `.stage-canvas` | `src/builder/stage/StageCore.tsx` |
| `.stage-phase-column` | `src/builder/stage/views/SmokeStage.tsx` |
| `.stage-phase-row` | `src/builder/stage/views/SmokeStage.tsx` |
| `.stage-smoke-meta` | `src/builder/stage/views/SmokeStage.tsx` |

## 4c — Shared CSS classes (2+ files)

| Class | Files |
|-------|-------|
| `.dark` | 17 files |
| `.expanded` | 15 files |
| `.glass` | 9 files |
| `.eyebrow` | 6 files |
| `.placeholder-screen` | 5 files |
| `.glass-dark` | 3 files |
| `.glass-light` | 3 files |
| `.island-shell` | 3 files |
| `.builder-canvas` | 2 files |

## 5 — Visual duplication groups

| Group | Pre-P1 status | Post-P1 status | Components involved |
|-------|---------------|----------------|---------------------|
| Pill-shaped elements | Present (7 components) | Partially resolved (newest components use CSS vars) | `.island-toggle`, `.channel-pill`, `.field-indicator`, inline buttons, FocusIsland toggle |
| Glass card surface | Present (6+ surfaces) | Mostly resolved (GlassSurface component exists, `.glass` class still used in 9 files) | `GlassSurface.tsx`, `BuilderIslandShell`, `StickyPopupShell`, `PopoverShell`, island headers |
| Status / Badge display | Present (5 variants) | Partially resolved (StatusBadge exists, `.readiness-badge` is now dead CSS) | `StatusBadge`, `LockBadge`, `StatusDropdownBadge`, `PhaseReadinessBadge` (inline Tailwind) |
| Input elements | Present (7 variants) | Persistent (no unification) | `TextInputSmall`, `TextInputLarge`, `TextInputInline`, `DualInput`, `ListInputLines`, `SpecsInput`, `DateInputTBD` |
| Toggle / Tab groups | Present (4 variants) | Persistent (no unification) | `PhaseEditorSection` toggle, `ViewTabSwitcher` tabs, `FocusIsland` toggle, `IslandToggleButton` |

### Duplicate controls detected by code-query.sh

| Control type | Variants |
|---|---|
| Button | 4: SelectionButtons, InlineIslandButton, IslandToggleButton, MenuSectionButton |
| Input | 7: DateInputTBD, DualInput, ListInputLines, SpecsInput, TextInputInline, TextInputLarge, TextInputSmall |
| Select | 8: ChannelCompositionSelect, InlineChannelCompositionSelector, CompletionStateSelect, InlineSelect, SearchableSelect, SearchableSelectIcons + SelectionIsland variants |

## 6 — Tailwind class clusters (used in 2+ components)

No shared className strings of 20+ characters were found duplicated across 2+ components. This confirms that all multi-class combinations are composed per-component rather than extracted to shared constants.

The only pattern of reuse is through individual CSS classes listed in §4c (`.dark`, `.expanded`, `.glass`, etc.) and through CSS var references in arbitrary Tailwind values (`var(--theme-accent)`, `var(--text-xs)`, etc.).

## Acceptance criteria

- [x] Arbitrary Tailwind value count is full (211 unique patterns, no truncation)
- [x] Dead CSS class list is produced by the Step 4 script (3 newly dead)
- [x] Duplication group status accounts for all 5 pre-P1 groups
- [x] Output written to `output/UX2-R2-tailwind-patterns.md`
- [x] No source files changed
