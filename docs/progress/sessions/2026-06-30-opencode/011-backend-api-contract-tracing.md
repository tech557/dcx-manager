## BACKEND-API-TRACE — API contract tracing for src/types/
Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: audit-review
Status: Completed
PO-Action: pending

Intent: Match exported types in src/types/ to REQ nodes and propose TRC links via proposal files. No TRC files are written directly — all proposals require PO sign-off via req:apply-after-signoff.
Trigger: PO-approved sweep — session 2026-06-30 Task I

### Type inventory
| File | Exported type names |
|------|---------------------|
| src/types/api.ts | ApiJsonValue, ApiTaskDate, ApiChannel, ApiSubtaskDefinition, ApiChannelComposition, ApiDCX, ApiVersion, ApiPhase, ApiPhaseIconType, ApiAction, ApiTask, ApiFieldCompletionState, ApiSubtask, ApiFileAttachment, ApiAssignedMember, ApiActivityEvent, ApiBuilderTree |
| src/types/lifecycle.ts | VersionStatus, VersionSourceType, LifecycleEventType, EDITABLE_VERSION_STATUSES, LOCKED_VERSION_STATUSES |
| src/types/domain.ts | ISODate, ISOTimestamp, AIContextFields, CollaborationFields, DCX, Version, Phase, Action, Task, Subtask |
| src/types/builder-node.types.ts | BuilderNodeKind, BuilderNodeBase, TaskCardData, ActionCardData, PhaseNodeData, TaskNode, ActionNode, PhaseNode, BuilderNode |
| src/types/card.types.ts | CardKind, CardCapability, MovementAxis, ReadinessState, ReadinessSource, FieldIndicator, CardEffectsConfig, CardConfig |
| src/types/dropzone.types.ts | DropzoneTarget, DropzoneEdge, DropCommand, Dropzone |
| src/types/editor.types.ts | DayDraft, EditorDraftData |
| src/types/stage.types.ts | ViewKind, StagePosition, StageContext, StageSurfaceBehavior, StageLayoutContract |

### Existing coverage (Step 2)
| MAN node | REQs already linked | Count |
|----------|---------------------|-------|
| MAN-type-src-types-api | REQ-BC-017, REQ-BC-028, REQ-CR-007, REQ-DM-001, REQ-DM-003, REQ-DM-009, REQ-DM-017, REQ-DM-018, REQ-DM-019, REQ-DM-023, REQ-PR-020, REQ-RV-008, REQ-RV-009, REQ-RV-010, REQ-RV-011, REQ-RV-012, REQ-RV-016, REQ-SC-002, REQ-UP-019, REQ-VL-018, REQ-VL-019, REQ-VL-030, RSP-AIM-SEED | 23 |
| MAN-type-src-types-lifecycle | REQ-CR-001, REQ-CR-002, REQ-CR-003, REQ-CR-010, REQ-VL-001, REQ-VL-029, REQ-VL-030 | 7 |
| MAN-type-src-types-domain | REQ-DM-001, REQ-DM-009, REQ-DM-018, REQ-DM-019, RSP-AIM-SEED | 5 |
| MAN-type-src-types-builder-node-types | REQ-DM-020 | 1 |
| MAN-type-src-types-card-types | (none) | 0 |
| MAN-type-src-types-dropzone-types | (none) | 0 |
| MAN-type-src-types-editor-types | (none) | 0 |
| MAN-type-src-types-stage-types | (none) | 0 |
| MAN-type-src-types-index | (none) | 0 |

### Proposals written (Step 4)
| Proposal file | REQ ID | MAN node | confidence | match reason |
|---|---|---|---|---|
| PRP-2026-06-30-trc-req-sbc-001-to-type-card-types | REQ-SBC-001 | card-types | 0.7 | Common card interaction layer maps to CardKind, CardCapability, and CardConfig |
| PRP-2026-06-30-trc-req-sbc-002-to-type-card-types | REQ-SBC-002 | card-types | 0.7 | Card-specific movement rules map to MovementAxis and CardCapability |
| PRP-2026-06-30-trc-req-density-001-to-type-card-types | REQ-DENSITY-001 | card-types | 0.7 | Builder card density model maps to CardConfig and CardEffectsConfig |
| PRP-2026-06-30-trc-req-dm-005-to-type-card-types | REQ-DM-005 | card-types | 0.7 | Day role maps to CardKind 'day' type |
| PRP-2026-06-30-trc-req-dm-021-to-type-card-types | REQ-DM-021 | card-types | 0.7 | UI state exclusion for cards maps to FieldIndicator |
| PRP-2026-06-30-trc-req-dz-001-to-type-dropzone-types | REQ-DZ-001 | dropzone-types | 0.7 | Typed shared dropzone engine maps to Dropzone, DropzoneTarget, DropCommand, DropzoneEdge |
| PRP-2026-06-30-trc-req-dz-001-recovery-to-type-dropzone-types | REQ-DZ-001-RECOVERY | dropzone-types | 0.7 | Dropzone behavior recovery maps to Dropzone, DropzoneEdge, DropCommand |
| PRP-2026-06-30-trc-req-stg-004-to-type-dropzone-types | REQ-STG-004 | dropzone-types | 0.7 | Kanban off-stage dropzones map to DropzoneTarget |
| PRP-2026-06-30-trc-req-stg-005-to-type-dropzone-types | REQ-STG-005 | dropzone-types | 0.7 | Timeline date dropzones map to DropzoneTarget 'day' |
| PRP-2026-06-30-trc-req-evi-001-to-type-editor-types | REQ-EVI-001 | editor-types | 0.7 | Editor/Viewer Island maps to EditorDraftData and DayDraft |
| PRP-2026-06-30-trc-req-rv-010-to-type-editor-types | REQ-RV-010 | editor-types | 0.7 | Missing data field rule maps to EditorDraftData field-level draft state |
| PRP-2026-06-30-trc-req-rv-011-to-type-editor-types | REQ-RV-011 | editor-types | 0.7 | Specs field rule maps to EditorDraftData field-level draft state |
| PRP-2026-06-30-trc-req-stg-001-to-type-stage-types | REQ-STG-001 | stage-types | 0.7 | Stage as first-class system maps to StageContext, StageLayoutContract, ViewKind |
| PRP-2026-06-30-trc-req-stg-002-to-type-stage-types | REQ-STG-002 | stage-types | 0.7 | View switching maps to ViewKind, StagePosition, StageContext |
| PRP-2026-06-30-trc-req-stg-003-to-type-stage-types | REQ-STG-003 | stage-types | 0.7 | Layout contract maps directly to StageLayoutContract and StageSurfaceBehavior |
| PRP-2026-06-30-trc-req-stg-004-to-type-stage-types | REQ-STG-004 | stage-types | 0.7 | Kanban movement maps to ViewKind 'kanban' and StagePosition |
| PRP-2026-06-30-trc-req-stg-005-to-type-stage-types | REQ-STG-005 | stage-types | 0.7 | Timeline movement maps to ViewKind 'timeline' and StagePosition |
| PRP-2026-06-30-trc-req-bc-001-to-type-stage-types | REQ-BC-001 | stage-types | 0.7 | Default Kanban creation view maps to ViewKind and StageContext |
| PRP-2026-06-30-trc-req-cal-week-001-to-type-stage-types | REQ-CAL-WEEK-001 | stage-types | 0.7 | Weekly calendar view maps to ViewKind 'weekly' and StageContext |
| PRP-2026-06-30-trc-req-up-001-to-type-stage-types | REQ-UP-001 | stage-types | 0.7 | Default Builder view state maps to ViewKind and StageContext |

### Proposals by MAN node
| MAN node | Proposals |
|---|---|
| card-types | 5 (SBC-001, SBC-002, DENSITY-001, DM-005, DM-021) |
| dropzone-types | 4 (DZ-001, DZ-001-RECOVERY, STG-004, STG-005) |
| editor-types | 3 (EVI-001, RV-010, RV-011) |
| stage-types | 8 (STG-001-005, BC-001, CAL-WEEK-001, UP-001) |
| index | 0 (barrel file — no REQ directly maps to re-exports) |

### Skipped (no match found)
| MAN node | Reason |
|---|---|
| MAN-type-src-types-index | Barrel/re-export only; no REQ directly references it; skipped per instructions |

### Final gates
| Gate | Result |
|---|---|
| Proposals written | 20 |
| req:validate (final) | pass: true |
| Churn — work reversed | None |
| No TRC files written directly | CONFIRMED — proposals/ only |
| No TRC links touched | CONFIRMED — 1015 unchanged |

### PO follow-up required
PO-Action: pending — review proposals in docs/product/requirements/graph/proposals/
Run `npm run req:apply-after-signoff -- --proposal <prp-id> --signoff <po-ref>` for each approved link.
All 20 proposals use confidence 0.7 (keyword match only, no affected_modules directly naming the type file).
