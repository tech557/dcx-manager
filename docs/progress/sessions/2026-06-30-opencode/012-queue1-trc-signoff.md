## QUEUE-1 — PO sign-off on 20 Task-I TRC proposals
Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: po-signoff
Status: Completed
PO-Action: pending

Intent: Review and apply (or skip) each of 20 Task-I TRC proposals one by one. Record PO decision per proposal.
Trigger: PO session after Task-I proposal generation.

### Sign-off log

| # | Proposal | REQ → MAN | confidence | PO decision | Applied | Notes |
|---|----------|-----------|------------|-------------|---------|-------|
| 1 | PRP-2026-06-30-trc-req-sbc-001-to-type-card-types | REQ-SBC-001 → card-types | 0.7 | pending | - | FLAG: REQ-SBC-001 — over-promises "common interaction layer"; PO says cards just share state model. Should be reworded to "consistent state model". |
| 2 | PRP-2026-06-30-trc-req-sbc-002-to-type-card-types | REQ-SBC-002 → card-types | 0.7 | pending | - | FLAG: REQ-SBC-002 — "each card type moves differently" is misleading. All cards drag-drop the same; what differs is drop targets. PO says this should be recategorized as a dropzone concern, and reworded to describe per-card drop target rules. |
| 3 | PRP-2026-06-30-trc-req-density-001-to-type-card-types | REQ-DENSITY-001 → card-types | 0.7 | redirected | - | Density lives in CSS/components, not card.types.ts. Needs to link elsewhere. PO: note for later. |
| 4 | PRP-2026-06-30-trc-req-dm-005-to-type-card-types | REQ-DM-005 → card-types | 0.7 | redirected | - | Wrong target — DM-005 is about date assignment (linked vs custom), not Day cards. Correct target: domain.ts (ISODate) or api.ts (ApiTaskDate). |
| 5 | PRP-2026-06-30-trc-req-dm-021-to-type-card-types | REQ-DM-021 → card-types | 0.7 | redirected | - | Wrong target. DM-021 describes user config JSON (Vercel/local storage), not card.types.ts. FLAG: reword + relink when backend discovery plan starts. Saved here — will recall when that plan activates. |
| 6 | PRP-2026-06-30-trc-req-dz-001-to-type-dropzone-types | REQ-DZ-001 → dropzone-types | 0.7 | approved | ✅ | Applied. REQ matches dropzone.types.ts directly. |
| 7 | PRP-2026-06-30-trc-req-dz-001-recovery-to-type-dropzone-types | REQ-DZ-001-RECOVERY → dropzone-types | 0.7 | redirected | - | PO says this is about newly received child state, covered elsewhere. Needs investigation — possibly stale REQ. |
| 8 | PRP-2026-06-30-trc-req-stg-004-to-type-dropzone-types | REQ-STG-004 → dropzone-types | 0.7 | approved | ✅ | Applied. Kanban off-stage dropzones map to DropzoneTarget/edge types. |
| 9 | PRP-2026-06-30-trc-req-stg-005-to-type-dropzone-types | REQ-STG-005 → dropzone-types | 0.7 | pending | - | PO feedback: "How can I move tasks between weeks in week view? We solely depend on island to navigate." — The types exist (DropzoneTarget 'day', edge zones) but the interactive Timeline behavior to drag tasks between weeks isn't built yet. Types are scaffolded, view logic is missing. Needs a Claude follow-up. |
| 10 | PRP-2026-06-30-trc-req-evi-001-to-type-editor-types | REQ-EVI-001 → editor-types | 0.7 | approved | ✅ | Applied. EditorDraftData powers the extensible editor, even if this scope is only task cards. |
| 11 | PRP-2026-06-30-trc-req-rv-010-to-type-editor-types | REQ-RV-010 → editor-types | 0.7 | delete-req | - | PO says delete this requirement entirely. |
| 12 | PRP-2026-06-30-trc-req-rv-011-to-type-editor-types | REQ-RV-011 → editor-types | 0.7 | delete-req | - | Same as RV-010 — PO flagged for deletion. |
| 13 | PRP-2026-06-30-trc-req-stg-001-to-type-stage-types | REQ-STG-001 → stage-types | 0.7 | approved | ✅ | Applied. |
| 14 | PRP-2026-06-30-trc-req-stg-002-to-type-stage-types | REQ-STG-002 → stage-types | 0.7 | delete-req | - | PO says delete this requirement. |
| 15 | PRP-2026-06-30-trc-req-stg-003-to-type-stage-types | REQ-STG-003 → stage-types | 0.7 | approved | ✅ | Applied. Layout contract maps directly to StageLayoutContract types. |
| 16 | PRP-2026-06-30-trc-req-stg-004-to-type-stage-types | REQ-STG-004 → stage-types | 0.7 | approved | ✅ | Applied. Kanban ViewKind + StagePosition for Stage. |
| 17 | PRP-2026-06-30-trc-req-stg-005-to-type-stage-types | REQ-STG-005 → stage-types | 0.7 | approved | ✅ | Applied. Timeline ViewKind + StagePosition for Stage. |
| 18 | PRP-2026-06-30-trc-req-bc-001-to-type-stage-types | REQ-BC-001 → stage-types | 0.7 | approved | ✅ | Applied. Kanban as default view. |
| 19 | PRP-2026-06-30-trc-req-cal-week-001-to-type-stage-types | REQ-CAL-WEEK-001 → stage-types | 0.7 | approved | ✅ | Applied. Weekly ViewKind for stage. |
| 20 | PRP-2026-06-30-trc-req-up-001-to-type-stage-types | REQ-UP-001 → stage-types | 0.7 | duplicate | - | PO says duplicate of BC-001 — flag for merge/delete. |
