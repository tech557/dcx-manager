## Lint Cleanup — 42 pre-existing `no-explicit-any` errors cleared
Agent: OpenCode (big-pickle)
Model: big-pickle
Provider: Anthropic
Date: 2026-06-29
Type: sprint-execution
Status: Completed
PO-Action: none

Intent: Clear 43 pre-existing lint errors (actual: 42) so RS-R3 (which reads src/) can run without lint pollution.
Trigger: RS-R3 sprint plan § preamble — "clear the 43 pre-existing lint errors before RS-R3"
Requirements covered: BLD-DEV-001 (code quality), RS-R3 dependency

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | `src/builder/BuilderErrorBoundary.tsx` | replaced `as any` with `as LifecycleEventType` | 69 (was 68) |
| edited | `src/builder/import/import.helpers.ts` | `any` → `Record<string, unknown>` on 6 function params; `as any[]` → `as Record<string, unknown>[]` | 206 (unchanged) |
| edited | `src/builder/import/useImport.ts` | `useState<any>` → `useState<ImportDiffGroup \| null>` | 88 (unchanged) |
| edited | `src/builder/import/__tests__/import.helpers.test.ts` | removed `as any`, `a: any` → typed params | 36 (was 35) |
| edited | `src/builder/islands/AIChatPopup/AIChatPopup.tsx` | `as any` → `as PhaseNodeData` with all required fields | 73 (was 68) |
| edited | `src/builder/islands/MetadataIsland/MetadataIsland.tsx` | `phases as any` → `phases as Phase[]` | 198 (unchanged) |
| edited | `src/builder/islands/MetadataIsland/MetadataModalsContainer.tsx` | typed `versionData`, `siblings`, `domainTree`, `importFlow` with real interface types | 111 (unchanged) |
| edited | `src/builder/islands/PreviewReviewModal/ReviewModal.tsx` | `(n.data as any).label` → `(n.data as unknown as Record<string, unknown>).label` | 37 (unchanged) |
| edited | `src/builder/islands/TemplatePopup/TemplatePopup.tsx` | `as any` → `as PhaseNodeData` with all required fields | 75 (was 69) |
| edited | `src/builder/stage/views/DayGridCardCollapsed.tsx` | `DragEvent<any>` → `DragEvent<HTMLDivElement>`, same for MouseEvent | 125 (unchanged) |
| edited | `src/builder/stage/views/KanbanHiddenDropzones.tsx` | replaced custom `DropZoneConfig` `any` interface with typed `Dropzone` | 51 (unchanged) |
| edited | `src/builder/ui/modals/ImportPreviewModal.tsx` | `diff: any` → `ImportDiffGroup \| null`; removed inline `: any` param types | 155 (unchanged) |
| edited | `src/rules/readiness.rules.ts` | `(phase as any).actionCards` → `(phase as Phase & { actionCards?: Action[] }).actionCards` | 111 (unchanged) |
| edited | `src/ui/motion/effects.registry.ts` | `any` → `unknown` on 4 props; added `Variants` type from motion/react | 132 (unchanged) |

### Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS (clean) |
| `npm run lint` | PASS (0 errors, 0 warnings) |
| `npm run test` | PASS (8 files, 37 tests) |
| `npm run validate:architecture` | PASS (0 violations) |
