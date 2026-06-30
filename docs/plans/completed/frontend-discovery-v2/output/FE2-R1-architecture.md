# FE2-R1 — Architecture + Boundary Audit
Date: 2026-06-26 | Agent: opencode

## Session Environment
```
repository_version: v0.3.2
package_version: 0.2.0
active_plans: []
code_index: fresh (0 min old)
mcp_operational: [eslint]
mcp_awaiting: [storybook, shadcn, semgrep, sonarqube]
```

All gates available (typecheck, lint, test, build, validate:architecture, verify:frontend, generate:code-index).
semgrep CLI not installed; Storybook not installed.

## 3 — dep-cruiser violations

No violations found — 265 modules, 550 dependencies cruised.

| Rule | Violating file | Import target | Known pre-P1? |
|------|---------------|---------------|---------------|
| (none) | — | — | — |

Total: **0 violations**
P1 fully resolved all 3 previously identified layer violations.

## 4 — File size violations

| File | Lines | Cap | Excess |
|------|-------|-----|--------|
| `src/builder/islands/EditorViewerIsland/useEditorPanel.ts` | 249 | 200 | +49 |
| `src/builder/islands/EditorViewerIsland/useEditorDraft.ts` | 215 | 200 | +15 |

Total: **2 over-cap files** (both in EditorViewerIsland hooks, cap: 200 for use*.ts)

No .tsx files, actions, services, rules, or registries exceed their caps.

## 5 — Component inventory

- Total components: **135** (was 98 pre-P1 in FE-R1, **+37** net increase)
- Orphaned (0 consumers): **15**

**Top 10 by consumer count:**
| Component | Consumers |
|-----------|-----------|
| StickyPopupShell | 7 |
| DividerLine | 6 |
| CardShell | 6 |
| Chip | 4 |
| EffectLayer | 4 |
| TaskDropZone | 4 |
| TaskCard | 4 |
| QuickEditPopover | 4 |
| ReadinessCheckModal | 4 |
| PopoverShell | 3 |

**Orphaned components (0 consumers):**
LockBadge, ReadinessBadge, StatusBadge, FieldIndicator, AIChatPopup, TemplatePopup, KanbanView, SmokeStage, TimelineView, DateInputTBD, DualInput, TextInputSmall, SearchableSelect, SearchableSelectIcons, DayCard

Note: Orphaned count needs review — KanbanView, SmokeStage, TimelineView are likely orphans due to the dynamic stage registry pattern (resolved via `stage.registry.ts`, not direct JSX import). The true "dead" count is lower.

## 6 — Folder placement

| Folder | .tsx files | Status |
|--------|-----------|--------|
| `src/ui/` | 33 | exists |
| `src/builder/` | 102 | exists |
| `src/components/` | — | **does not exist** (migrated) |
| `src/components/forms/` | — | **does not exist** (migrated to `src/ui/forms/`) |

P1 migration completed: `src/components/*` fully relocated.
- `src/components/elements/buttons/` → `src/builder/ui/buttons/`
- `src/components/feedback/` → `src/builder/ui/feedback/`
- `src/components/modals/` → `src/builder/ui/modals/`
- `src/components/forms/` → `src/ui/forms/`
- `src/components/auth/` → `src/ui/auth/`

## Delta from expired FE-R1

| Dimension | FE-R1 (pre-P1) | FE2-R1 (post-P1) | Δ |
|-----------|---------------|-------------------|---|
| Component count | 98 | 135 | +37 |
| Layer violations | 3 (upward) | 0 | 3 resolved ✓ |
| Over-cap files | ~24 (150-line cap) | 2 (200-250 cap) | 22 fewer |
| src/components/ | exists | removed | migrated ✓ |
| src/components/forms/ | exists | removed | migrated ✓ |

Resolved violations (from SA-R1):
1. `src/ui/BuilderBg/LightRays.tsx` → `@/builder/stage/StageProvider` — now compliant
2. `src/components/forms/channel/CompositionLibraryModal.tsx` → `@/builder/cards/...` — moved, now compliant
3. `src/components/forms/channel/InlineChannelCompositionSelector.tsx` → `@/builder/cards/...` — moved, now compliant

## Blocking issues for folder-structure-v2 P2/P3

1. **useEditorPanel.ts (249 lines, cap 200)** — EditorViewerIsland hook must be split. This is the most over-cap file.
2. **useEditorDraft.ts (215 lines, cap 200)** — Same module cluster. Consider extracting draft persistence logic.
3. **15 orphaned components** — Investigate which are truly dead vs. dynamically resolved. KanbanView, SmokeStage, TimelineView are likely stage.registry entries (not true orphans). LockBadge, ReadinessBadge, StatusBadge, FieldIndicator, AIChatPopup, TemplatePopup, DateInputTBD, DualInput, TextInputSmall, SearchableSelect, SearchableSelectIcons, DayCard need manual review.
4. **Component team grew by +37 (98→135)** — No new folder boundaries added. Growth concentrated in `src/builder/` (102 .tsx files). Consider sub-folder boundaries for builder/.
