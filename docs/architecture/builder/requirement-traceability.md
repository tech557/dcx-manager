# Builder — Requirement Traceability Matrix

| ID | Requirement | Status | Sprint | Files |
|---|---|---|---|---|
| BLD-OVR-001 | AI creation deferred to V2 | 🔮 Deferred | — | — |
| BLD-FIL-001 | File preview in Project Meta Island | ✅ Planned | B-FIL | MetadataIsland/, ViewHelperIsland/ |
| BLD-CRD-INT-002 | Task popup + expand independent | ✅ Planned | B-CRD | TaskCard.tsx, CardShell.tsx |
| BLD-STG-001 | Stage persistent across view switch | ✅ Implemented | — | StageProvider |
| BLD-STG-002 | Island open/close does not reset context | ✅ Implemented | — | StageProvider |
| BLD-STG-003 | Stage fills available width | ❌ Gap | B2 | StageCore.tsx |
| BLD-KAN-001 | Kanban density 3-phase default | ❌ Gap | B3 | KanbanView.tsx |
| BLD-KAN-002 | Task single-click read-only popup | ❌ Gap | B-CRD | TaskCard.tsx |
| BLD-KAN-003 | Task long-press opens editor | ❌ Gap | B-CRD | CardShell.tsx, useCardDrag.ts |
| BLD-KAN-004 | Task drag-to-editor opens session | ❌ Gap | B-CRD | EditorViewerIsland |
| BLD-KAN-005 | Double-click toggles expand | ✅ Implemented | — | CardShell.tsx |
| BLD-KAN-006 | Phase/Action inline name edit | ✅ Implemented | — | PhaseCard, ActionCard |
| BLD-EDT-001 | Editor multi-session (no hard limit ✅ BLD-EDT-002 / OD-001) | ❌ Gap | B5 | useEditorPanel.ts |
| BLD-EDT-002 | Unsaved sessions never silently replaced | ❌ Gap | B5 | useEditorPanel.ts |
| BLD-EDT-003 | Session pill restore | ❌ Gap | B5 | EditorViewerIsland |
| BLD-SLC-001 | Presentation mode (single select ⏱ TA-003) | ❌ Gap | B6 | SelectionIsland |
| BLD-SLC-002 | Delete confirmation (multi/ready) | ❌ Gap | B6 | SelectionIsland |
| BLD-FOC-001 | AND/OR toggle (2+ filters) | ❌ Gap | B7 | FocusIsland |
| BLD-FOC-002 | Applied filter badge on pill | ❌ Gap | B7 | FocusIsland |
| BLD-VCX-001 | View Context unassigned tasks active | ❌ Gap | B8 | ViewHelperIsland |
| BLD-VCX-002 | View Context assigned tasks visible+disabled | ❌ Gap | B8 | ViewHelperIsland |
| BLD-VCX-003 | Drag-to-Day assigns date | ❌ Gap | B8 | DayGridCard, useDayGridDrag |
| BLD-CRD-001 | Newly-created card reveal + temp select | ❌ Partial | B4 | actions/, StageProvider |
| BLD-CRD-002 | Newly-edited state after editor save | ❌ Gap | B-CRD | TaskCard, EditorViewerIsland |
| BLD-CRD-003 | Receiving-child state on drop | ❌ Gap | B-CRD | handleCardDrop, ActionCard |
| BLD-DND-001 | Multi-select drag (same level) | ❌ Partial | B9 | useCardDrag.ts |
| BLD-DND-002 | Edge auto-scroll | ✅ Implemented | — | StageEdgeNavigation |
| BLD-RDY-001 | Task readiness | ✅ Implemented | — | readiness.rules.ts |
| BLD-RDY-002 | Action/Phase readiness | ✅ Implemented | — | readiness.rules.ts |
| BLD-RDY-003 | Day readiness | ❌ Gap | B11 | readiness.rules.ts |
| BLD-USR-001 | User Island (save, exit protection) | ✅ Implemented | — | HeaderUserIsland |
| BLD-TML-001 | Timeline Builder sync | ✅ Implemented | — | TimelineBuilderIsland |
| BLD-TML-002 | Weekly view Day cards | ✅ Implemented | — | WeeklyView, DayGridCard |
| BLD-TML-003 | Monthly view | ✅ Implemented | — | MonthlyView |
| BLD-ANM-001 | View transition animation | ❌ Gap | B10 | StageCore |
| BLD-LOD-001 | Loading skeleton | ❌ Gap | B1 | BuilderPage |
