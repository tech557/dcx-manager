# Builder — State Ownership

**Last verified:** v0.2.15

## Preserve-Semantic Boundaries

These systems define architectural contracts. They must not be changed in ways that violate their semantics. Controlled additions required by approved tasks are allowed.

| System | File(s) | Semantic contract |
|---|---|---|
| Domain data model | `types/domain.ts`, `types/lifecycle.ts` | Source of truth for all entities |
| Four-layer mapper | `services/api-mappers.ts`, `utils/node.helpers.ts` | API ↔ Domain ↔ Builder render; never skip layers |
| Readiness rules | `rules/readiness.rules.ts` | Single source of readiness truth; never computed in UI |
| Action boundary | `actions/` all files | All mutations through named commands; never setNodes from UI |
| Card registry | `builder/cards/card.registry.ts` | Card config source; extends OK; breaks existing config is not OK |
| Drag-drop logic | `builder/cards/useCardDrag.ts`, `handleCardDrop.ts`, `cardDrag.helpers.ts` | Must not create parallel drag systems |
| Stage context | `builder/stage/StageProvider.tsx` + sub-hooks | Stage-level state only; island state must not live here |
| Island chassis | `builder/islands/BuilderIslandShell.tsx` | Shared animation/pill/panel contract |
| Effects registry | `ui/motion/effects.registry.ts` | All named effects; never duplicate with inline animation |
| Autosave | `hooks/useAutosave.ts` | Correct mapper call; do not regress domainPhasesToApi |
| Brand tokens | `brand/tokens.ts` | Single visual constant source |

## State Location Map

| State | Owner | Notes |
|---|---|---|
| `nodes: BuilderNode[]` | `builderStore` | Single source of truth |
| `view: ViewKind` | `StageProvider` | Persisted via usePreferences |
| `selectedNodeIds` | `StageProvider` | |
| `expandedNodeIds` | `StageProvider` | Persisted |
| `isEditorOpen: boolean` | `StageProvider` | Set by useEditorPanel; replaces focusedNodeId (B0) |
| `isolatedNodeIds` | `StageProvider` | Focus isolation |
| `isDragging` + drag fields | `useDragState` (in StageProvider) | |
| `activeWeek` + week fields | `useWeekState` (in StageProvider) | |
| `isLocked` | `builderStore` | Set from version status |
| `saveStatus` | `builderStore` | |
| `isExpanded` (Focus Island) | `FocusIsland` local state | Not in stage context after B0 |
| `isEditorDirty` | `useEditorPanel` local state | Not in stage context after B0 |
| `sessions` (Editor) | `useEditorPanel` | Multi-session state after B5 |
| `isPopupOpen` (Task) | `TaskCard` local state | Independent of expanded state |
| File preview sessions | `useFilePreview` in MetadataIsland | After B-FIL |

## Island State Contracts (post-B0)

No island state may live in StageProvider. Each island owns its own expansion and session state.
