# BE2-R1 — Type System Health
Date: 2026-06-27 | Agent: opencode

## Session Environment
- repository_version: v0.3.4
- package_version: 0.2.0
- metadata_version: v0.3.3
- Active plans: none
- code_index: fresh (0 min old)
- All gates available

## 3 — TypeScript strict errors

**Total errors: 0**

`npm run typecheck` passed cleanly with no errors.

## 4 — any-type violations (ESLint)

**Total no-explicit-any violations: 63** (was 0 in services/actions pre-cleanup; pre-cleanup had only `draftData: any` in builderStore)

| File | Count | Lines |
|------|-------|-------|
| `builder/stage/views/KanbanHiddenDropzones.tsx` | 7 | 5,7,8,9,27,35,36 |
| `builder/import/import.helpers.ts` | 6 | 5,10,15,35,51,67 |
| `builder/stage/views/DayGridCardCollapsed.tsx` | 6 | 22,23,24,25,28,29 |
| `builder/BuilderErrorBoundary.tsx` | 1 | 29 |
| `builder/focus/focus.engine.ts` | 4 | 12,16,26,28 |
| `builder/focus/useFocus.ts` | 1 | 27 |
| `builder/import/__tests__/import.helpers.test.ts` | 4 | 22,26,27,31 |
| `builder/import/useImport.ts` | 1 | 11 |
| `builder/islands/AIChatPopup/AIChatPopup.tsx` | 1 | 32 |
| `builder/islands/EditorViewerIsland/DayEditorSection.tsx` | 1 | 13 |
| `builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | 4 | 62,143,143,174 |
| `builder/islands/EditorViewerIsland/UnsavedChangesModal.tsx` | 1 | 5 |
| `builder/islands/EditorViewerIsland/useEditorDraft.ts` | 3 | 48,66,83 |
| `builder/islands/EditorViewerIsland/useEditorPanel.ts` | 3 | 37,55,72 |
| `builder/islands/EditorViewerIsland/useEditorReadiness.ts` | 4 | 15,24,31,31 |
| `builder/islands/MetadataIsland/MetadataIsland.tsx` | 1 | 98 |
| `builder/islands/MetadataIsland/MetadataModalsContainer.tsx` | 4 | 8,9,10,16 |
| `builder/islands/PreviewReviewModal/ReviewModal.tsx` | 1 | 24 |
| `builder/islands/TemplatePopup/TemplatePopup.tsx` | 1 | 32 |
| `builder/ui/modals/ImportPreviewModal.tsx` | 4 | 9,64,88,112 |
| `rules/readiness.rules.ts` | 1 | 87 |
| `ui/motion/effects.registry.ts` | 4 | 19,20,21,23 |

## 5 — api.ts / domain.ts duplication

- API types found: **17** in `src/types/api.ts`
- Domain types found: **10** in `src/types/domain.ts` (was 21 pre-cleanup — **11 removed**)
- Exact name matches: **0**
- Semantic matches (Api-prefix stripped): **6**

### Still duplicate (semantic pairs):
| api.ts type | domain.ts type | Base name |
|-------------|---------------|-----------|
| ApiAction | Action | Action |
| ApiDCX | DCX | DCX |
| ApiPhase | Phase | Phase |
| ApiSubtask | Subtask | Subtask |
| ApiTask | Task | Task |
| ApiVersion | Version | Version |

**Total duplicate pairs: 6** (was 10 pre-cleanup — 4 resolved: ApiJsonValue/JsonValue, ApiTaskDate/TaskDate, ApiFieldCompletionState/FieldCompletionState, ApiPhaseIconType/PhaseIconType, ApiChannel/Channel, ApiSubtaskDefinition/SubtaskDefinition, ApiChannelComposition/ChannelComposition, ApiFileAttachment/FileAttachment, ApiAssignedMember/AssignedMember, ApiActivityEvent/ActivityEvent)

P4 removed 4+ pure duplicates (exact copies), but left 6 semantic pairs where domain types add mixins (`AIContextFields`, `CollaborationFields`).

## 6 — draftData type status

**Typed as `EditorDraftData`** — not `any`.

Evidence:
- `src/store/builderStore.ts:12` — `draftData: EditorDraftData;`
- `src/builder/islands/EditorViewerIsland/useEditorDraft.ts:93` — `useState<EditorDraftData | null>(null)`

P4 correctly typed `draftData` from `any` to `EditorDraftData`. However, there are still 13 `as any` casts when consuming `draftData` across the editor (e.g. `(draftData as any).name` in EditorViewerIsland.tsx:143, `as unknown as any` in useEditorReadiness.ts:31).

## 7 — Mock data type coverage

**4 mock files** found (`channels.ts`, `compositions.ts`, `constants.ts`, `subtask-definitions.ts`).
**0 `any` usages** in mock files — all properly typed.

## Delta from expired BE-R1

| Metric | BE-R1 (pre-cleanup) | BE2-R1 (post-P4) | Δ |
|--------|--------------------|--------------------|---|
| TypeScript errors | not measured | 0 | baseline set |
| any-type violations (total) | 1 (draftData in builderStore) | 63 | +62 |
| any-type violations (services/actions) | 0 | 0 | 0 ✓ |
| api.ts types | 17 | 17 | 0 |
| domain.ts types | 21 | 10 | -11 |
| Duplicate type pairs | 10 | 6 | -4 resolved |
| draftData type | `any` | `EditorDraftData` | typed ✓ |
| Mock data any usage | not measured | 0 | baseline set |

**P4 completion status: PARTIAL**
- Type deduplication: 4/10 pure duplicates removed ✓
- draftData typed ✓
- 6 semantic duplicates remain (domain types add mixins — intentional)
- No `any` in mock files or services ✓
- 63 any violations exist in builder/ code (outside services/actions) — new code or existing code not cleaned

## Blocking issues for folder-structure-v2 P3/P4

1. **63 no-explicit-any violations** — concentrated in `builder/stage/views/` (13), `builder/import/` (11), and `builder/islands/EditorViewerIsland/` (17). These block strict mode enablement and hide real type errors.
2. **6 remaining api.ts/domain.ts semantic duplicates** — While not identical copies, `Phase`/`ApiPhase`, `Action`/`ApiAction`, `Task`/`ApiTask`, `Subtask`/`ApiSubtask`, `DCX`/`ApiDCX`, `Version`/`ApiVersion` could share a base type and add mixins via `Omit` + `extends`. Not a P4 blocker but should be documented.
3. **`as any` casts in editor components** — EditorViewerIsland.tsx:143, useEditorReadiness.ts:24,31 use `as any` on draftData. These are runtime-unsafe and should use proper discriminated union narrowing.
