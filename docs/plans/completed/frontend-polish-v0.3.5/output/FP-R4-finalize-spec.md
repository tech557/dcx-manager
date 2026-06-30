---
sprint: FP-R4
title: Builder / version / homepage finalize-behavior spec
agent: codex
date: 2026-06-30
status: Complete
version_context: v0.3.5
source_of_truth: docs/product/requirements/graph/
---

# FP-R4 — Graph-Grounded Finalize-Behavior Spec

## Executive Status

FP-R4 replaces the legacy 2026-06-28 finalize spec that cited `BLD-*` and `OD-*` pseudo IDs. The graph is now the source of truth. Every criterion below cites canonical `REQ-*` IDs and treats RS-R7 `implements` links as `review-input-not-proof`, because RS-R11 found **0 frontend requirements delivery-confirmed implemented or verified**.

The `docs/archive/dcx-manager-v0.1.4/src/pages/home/*` and `docs/archive/dcx-manager-v0.1.4/src/pages/version/*` reference is available, so homepage and version page are no longer blocked. They are finalized here as operational application surfaces, not placeholder marketing pages.

## Requirement Trace

| Field | Value |
|---|---|
| Primary graph IDs | `REQ-EVI-001`, `REQ-SBC-001..005`, `REQ-SBC-DES-001`, `REQ-SBC-DUP-001`, `REQ-SBT-COPY-001`, `REQ-RDY-001`, `REQ-RDY-003`, `REQ-STG-001..005`, `REQ-KBI-001`, `REQ-TPL-001`, `REQ-VHB-001`, `REQ-DZ-001`, `REQ-DZ-001-RECOVERY`, `REQ-FCS-001`, `REQ-FCS-002`, `REQ-IFX-001`, `REQ-KEY-001..007`, `REQ-UP-001..022`, `REQ-EFP-001`, `REQ-LOAD-SKEL-001`, `REQ-FP-CMA-001..004`, `REQ-FP-D01..D12` |
| Source/lock | `docs/product/requirements/graph/`; `docs/plans/completed/requirements-system/output/RS-R11-reground-brief.md`; v0.1.4 reference under `docs/archive/dcx-manager-v0.1.4/src/pages/{home,version}/` |
| Acceptance outcome | Finalize spec is graph-grounded, all surface criteria carry verification method and family tag, Home/Version are unblocked, and provisional RS-R7 links are review input rather than implementation proof. |
| Allowed writes | Plan docs/output, sprint file, README carry-forward, progress log; no `src/` writes. |

## Graph Grounding Notes

| Evidence | Result |
|---|---|
| RS-R11 re-grounding brief | 104 frontend requirements; 102 approved + 2 proposed-at-the-time/newly approved; 0 delivery-confirmed implemented/verified; 283 implements links; 238 active RS-R7 candidate links. |
| Graph node spot checks | `REQ-EVI-001`, `REQ-SBC-001`, `REQ-SBT-COPY-001`, and `REQ-LOAD-SKEL-001` all carry `delivery: not-assessed`. |
| Expected categories | Family seeds from `EMC-*`: `EMC-EVI-SEED`, `EMC-SBC-SEED`, `EMC-STG-SEED`, `EMC-DZ-SEED`, `EMC-IFX-SEED`, `EMC-VHB-SEED`, `EMC-UP-SEED`, `EMC-EFP-SEED`, `EMC-VR-SEED`, plus `EMC-GOV-TRACE-FRONTEND` and `EMC-GOV-TRACE-TESTQA` for implementation/test manifestations. |
| Decision closure | FP-R5/RS-R9 decisions are requirements `REQ-FP-D01..D12`; no bare unresolved decision marker is left in this spec. |

Definitions used below:
- `wire-mockup-data`: existing mock UI or store behavior must be connected to real state/interaction rules.
- `change-component`: component behavior/markup/layout-in-component must change without changing the frozen app shell.
- `change-token`: design token, theme token, or structural dimension token must change.
- `review-input-not-proof`: RS-R7 candidate link exists but implementation must confirm/correct it; it is not proof of delivered behavior.

## Surface Contract

The Builder shell keeps the existing three-row layout contract. FP-R4 finalization is behavior, state, token, and component polish inside existing boundaries.

| Row | Contract |
|---|---|
| 1 | Header/metadata/user readiness summary, height 64px; add live readiness summary per `REQ-FP-CMA-001`. |
| 2 | EditorViewerIsland left, Stage center, FocusIsland right; Editor narrows/pushes Stage per `REQ-EVI-001` and `REQ-STG-003`. |
| 3 | SelectionIsland left, builder controls center, ViewHelperIsland right when view-compatible per `REQ-VHB-001`, `REQ-UP-008`, `REQ-FP-D03`. |

No criterion below permits builder-internal imports into Home or Version routes. Home/Version may reuse app-level UI primitives and services, but must not import `src/builder/**`.

## Builder Finalize Checklist

### Editor / Viewer Island

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| E01 | Long-press on Task opens EditorViewerIsland with task context; hold threshold and movement cancel are explicit and testable. | `REQ-EVI-001`, `REQ-SBC-001` | browser + unit | `wire-mockup-data` |
| E02 | Action card selection/editor path sets focused action context, not only visual selection. | `REQ-EVI-001`, `REQ-SBC-004`, `REQ-FP-D09` | browser | `wire-mockup-data` |
| E03 | Collapsed editor affordance is enabled when a valid card is selected, not only during drag. | `REQ-EVI-001`, `REQ-FP-D09` | browser | `change-component` |
| E04 | Dragging a Task onto EditorViewerIsland opens or restores an editor session. | `REQ-EVI-001`, `REQ-DZ-001`, `REQ-SBC-002` | browser | `wire-mockup-data` |
| E05 | Multiple editor sessions preserve dirty state and expose visible/restorable session pills. | `REQ-EVI-001`, `REQ-UP-011`, `REQ-UP-012` | browser + unit | `wire-mockup-data` |
| E06 | Close editor clears active editor only after safe restore/dirty-state handling. | `REQ-EVI-001`, `REQ-UP-011`, `REQ-UP-014` | browser + unit | `wire-mockup-data` |
| E07 | Routing and Endpoint Directory fields render full-width, single-column at editor width. | `REQ-EVI-001`, `REQ-FP-D10` | visual | `change-component` |
| E08 | Editor skeleton matches final editor layout while data loads or restores. | `REQ-LOAD-SKEL-001`, `REQ-EVI-001`, `REQ-UP-004` | visual + browser | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-EVI-001` | not-assessed | not verified | `EMC-EVI-SEED`, `EMC-UP-SEED`, `EMC-GOV-TRACE-TESTQA` | `TRC-RS-R7-REQ-EVI-001-TO-MAN-react-component-src-builder-islands-editorviewerisland-editorviewerisland`; `TRC-RS-R7-REQ-EVI-001-TO-MAN-react-component-src-builder-islands-editorviewerisland-taskeditor-taskeditor`; review-input-not-proof |
| `REQ-FP-D09`, `REQ-FP-D10` | not-assessed | not verified | `EMC-EVI-SEED`, `EMC-SBC-SEED` | no delivery proof; verify against editor affordance and routing field components |
| `REQ-LOAD-SKEL-001` | not-assessed | not verified | `EMC-EVI-SEED`, `EMC-STG-SEED`, `EMC-GOV-TRACE-FRONTEND` | new requirement; create/confirm skeleton manifestations during implementation |

### Shared Builder Cards

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| C01 | Phase, Action, and Task share one card interaction layer for selection, focus, keyboard targeting, and motion feedback. | `REQ-SBC-001`, `REQ-IFX-001` | unit + browser | `wire-mockup-data` |
| C02 | Card movement follows card-specific rules: Phase horizontal, Action within/between phases, Task within/between actions and timeline days. | `REQ-SBC-002`, `REQ-DZ-001`, `REQ-DZ-001-RECOVERY` | browser | `wire-mockup-data` |
| C03 | Phase card remains a strategic visual container with 72px collapsed and 260px expanded variants, preserving readiness and name access. | `REQ-SBC-003`, `REQ-FP-D11`, `REQ-FP-D12` | visual | `change-token` |
| C04 | Action card stays simpler than Task but has non-truncating title/metadata affordance at target width. | `REQ-SBC-004`, `REQ-FP-D01` | visual | `change-component` |
| C05 | Task card is one responsive component, not separate collapsed/expanded implementations. | `REQ-SBC-005`, `REQ-FP-D01` | code + visual | `change-component` |
| C06 | Task card communicates name/channel/status, not only a date badge or tiny tile. | `REQ-SBC-005`, `REQ-FP-D01` | visual + PO | `change-component` |
| C07 | Card expanded state, popup state, selected state, focused state, and dirty/editor state are independent. | `REQ-SBC-001`, `REQ-EVI-001`, `REQ-FCS-001`, `REQ-UP-012` | unit + browser | `wire-mockup-data` |
| C08 | Multi-select copy/paste duplicates selected Phase/Action/Task cards through governed keyboard commands. | `REQ-SBC-DUP-001`, `REQ-KEY-002`, `REQ-KEY-003`, `REQ-KEY-007` | unit + browser | `wire-mockup-data` |
| C09 | Subtask copy/paste duplicates subtask instances inside same/other Task without rerunning generation and without blind overwrite. | `REQ-SBT-COPY-001`, `REQ-SBC-005`, `REQ-KEY-002`, `REQ-KEY-003` | unit + browser | `wire-mockup-data` |
| C10 | Newly-created/edited/receiving-parent states use shared feedback and reduced-motion branches. | `REQ-IFX-001`, `REQ-FP-D06` | visual + code | `change-component` |
| C11 | Card/list skeletons preserve dimensions during load and avoid layout shift. | `REQ-LOAD-SKEL-001`, `REQ-SBC-001` | visual | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-SBC-001..005` | not-assessed | not verified | `EMC-SBC-SEED`, `EMC-DZ-SEED`, `EMC-IFX-SEED`, `EMC-GOV-TRACE-TESTQA` | `TRC-RS-R7-REQ-SBC-001-TO-MAN-react-component-src-builder-cards-templates-task-taskcard`; `TRC-RS-R7-REQ-SBC-002-TO-MAN-react-component-src-builder-cards-templates-action-actioncard`; `TRC-RS-R7-REQ-SBC-003-TO-MAN-react-component-src-builder-cards-templates-phase-phasecard`; review-input-not-proof |
| `REQ-SBC-DUP-001`, `REQ-SBT-COPY-001` | not-assessed | not verified | `EMC-SBC-SEED`, `EMC-GOV-TRACE-FRONTEND`, `EMC-GOV-TRACE-TESTQA` | `TRC-RS-R7-REQ-SBC-DUP-001-TO-MAN-react-component-src-ui-forms-selects-select` looks suspicious and must be corrected; new subtask copy links required |
| `REQ-FP-D01`, `REQ-FP-D11`, `REQ-FP-D12` | not-assessed | not verified | `EMC-SBC-SEED`, `EMC-STG-SEED` | decision requirements must be manifested in card sizing, collapsed readiness tooltip/aria, and tokenized dimensions |

### Readiness

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| R01 | Readiness is a shared feature across cards and version metadata, not a Task-only decoration. | `REQ-RDY-001`, `REQ-FP-CMA-001` | unit + browser | `wire-mockup-data` |
| R02 | Per-field readiness state is visible on Task fields and rolls up to Action/Phase/Version summaries. | `REQ-RDY-003`, `REQ-SBC-005`, `REQ-FP-CMA-001` | unit + visual | `wire-mockup-data` |
| R03 | Collapsed Phase readiness text is available through tooltip and `aria-label`, per PO decision. | `REQ-RDY-001`, `REQ-FP-D11` | visual + a11y | `change-component` |
| R04 | Empty days are neutral/empty and do not reduce version readiness. | `REQ-RDY-001`, `REQ-STG-002` | unit | `wire-mockup-data` |
| R05 | Loading readiness calculations show skeleton/placeholder states instead of blank jumps. | `REQ-LOAD-SKEL-001`, `REQ-RDY-001` | visual | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-RDY-001`, `REQ-RDY-003` | not-assessed | not verified | `EMC-SBC-SEED`, `EMC-STG-SEED`, `EMC-GOV-TRACE-TESTQA` | `TRC-RS-R7-REQ-RDY-003-TO-MAN-react-component-src-builder-cards-templates-task-taskcard`; `TRC-RS-R7-REQ-RDY-003-TO-MAN-function-src-mock-channels`; review-input-not-proof |
| `REQ-FP-CMA-001` | not-assessed | not verified | `EMC-STG-SEED`, `EMC-UP-SEED` | add/confirm live Version-readiness summary manifestation in metadata/header |

### Kanban / Stage

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| K01 | Default Builder view is Kanban for new versions unless safe user/version restore says otherwise. | `REQ-UP-001`, `REQ-UP-002`, `REQ-UP-003`, `REQ-UP-004` | unit + browser | `wire-mockup-data` |
| K02 | Stage is a first-class shared system with no hard reset when switching between compatible views. | `REQ-STG-001`, `REQ-STG-002` | browser | `wire-mockup-data` |
| K03 | Smart default expands active phase(s), collapses rest, and scales to 7-8 phases. | `REQ-FP-CMA-002`, `REQ-SBC-003` | visual + browser | `wire-mockup-data` |
| K04 | Selecting/navigating via card, focus, or view helper auto-centres the target without layout break. | `REQ-FP-CMA-003`, `REQ-STG-001` | browser | `wire-mockup-data` |
| K05 | Kanban Builder Island exposes drag-to-create Phase/Action/Task pills. | `REQ-KBI-001`, `REQ-FP-CMA-004`, `REQ-DZ-001` | browser | `wire-mockup-data` |
| K06 | Template popup entry points are wired for supported objects. | `REQ-TPL-001`, `REQ-FP-D04` | browser | `wire-mockup-data` |
| K07 | Stage and builder-control skeletons preserve row/column dimensions during load. | `REQ-LOAD-SKEL-001`, `REQ-STG-001`, `REQ-KBI-001` | visual | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-STG-001..005` | not-assessed | not verified | `EMC-STG-SEED`, `EMC-DZ-SEED`, `EMC-UP-SEED` | `TRC-RS-R7-REQ-STG-001-TO-MAN-react-component-src-ui-forms-selects-select` appears mis-targeted and must be corrected; `TRC-RS-R7-REQ-STG-003-TO-MAN-react-component-src-builder-islands-editorviewerisland-editorviewerisland`; review-input-not-proof |
| `REQ-KBI-001`, `REQ-TPL-001`, `REQ-FP-CMA-004` | not-assessed | not verified | `EMC-STG-SEED`, `EMC-TPL-SEED`, `EMC-DZ-SEED` | `TRC-RS-R7-REQ-KBI-001-TO-MAN-react-component-src-builder-islands-kanbanbuilderisland-kanbanbuilderisland`; `TRC-RS-R7-REQ-TPL-001-TO-MAN-react-component-src-builder-islands-templatepopup-templatepopup`; review-input-not-proof |
| `REQ-UP-001..004` | not-assessed | not verified | `EMC-UP-SEED`, `EMC-STG-SEED` | restore/default behavior needs tests; RS-R7 links are service/store candidates only |

### Timeline / View Helper

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| T01 | Timeline weekly/monthly views preserve context and selection when switching from Kanban. | `REQ-STG-002`, `REQ-VHB-001`, `REQ-UP-007` | browser | `wire-mockup-data` |
| T02 | ViewHelperIsland is view-gated: hidden in Kanban, available in timeline/calendar contexts. | `REQ-VHB-001`, `REQ-UP-008`, `REQ-FP-D03` | browser | `wire-mockup-data` |
| T03 | View Helper bridges unassigned and scheduled Tasks across views without losing card identity. | `REQ-VHB-001`, `REQ-SBC-005`, `REQ-STG-005` | browser | `wire-mockup-data` |
| T04 | Timeline task-to-day assignment uses typed dropzones and preserves valid date assignment. | `REQ-STG-005`, `REQ-DZ-001`, `REQ-DZ-001-RECOVERY` | browser | `wire-mockup-data` |
| T05 | Timeline load/switch skeletons match the final day/week/month layout. | `REQ-LOAD-SKEL-001`, `REQ-STG-002` | visual | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-VHB-001` | not-assessed | not verified | `EMC-VHB-SEED`, `EMC-STG-SEED`, `EMC-UP-SEED` | `TRC-RS-R7-REQ-VHB-001-TO-MAN-react-component-src-builder-islands-viewhelperisland-viewhelperisland`; `TRC-RS-R7-REQ-VHB-001-TO-MAN-react-component-src-builder-stage-views-timelineview`; review-input-not-proof |
| `REQ-STG-002`, `REQ-STG-005` | not-assessed | not verified | `EMC-STG-SEED`, `EMC-DZ-SEED` | timeline switching and date dropzones require browser proof |

### Drag / Drop

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| D01 | Drag starts through typed shared drag/drop state, not inert `activeDrag` placeholders. | `REQ-DZ-001`, `REQ-DZ-001-RECOVERY` | unit + browser | `wire-mockup-data` |
| D02 | Dropzones are generated by view rules, not hardcoded one-offs. | `REQ-DZ-001`, `REQ-STG-004`, `REQ-STG-005` | code + unit | `wire-mockup-data` |
| D03 | Valid and invalid drop targets show distinct reusable feedback. | `REQ-DZ-001`, `REQ-IFX-001` | visual + browser | `change-component` |
| D04 | Off-stage and edge-scroll behavior prevents lost drag context. | `REQ-STG-004`, `REQ-DZ-001-RECOVERY` | browser | `wire-mockup-data` |
| D05 | Same-level multi-select drag works; mixed-level drag is blocked with clear feedback. | `REQ-SBC-002`, `REQ-SBC-001`, `REQ-DZ-001` | browser | `wire-mockup-data` |
| D06 | Drag previews and drop feedback respect reduced motion. | `REQ-IFX-001`, `REQ-FP-D06` | visual + code | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-DZ-001`, `REQ-DZ-001-RECOVERY` | not-assessed | not verified | `EMC-DZ-SEED`, `EMC-STG-SEED`, `EMC-IFX-SEED`, `EMC-GOV-TRACE-TESTQA` | `TRC-RS-R7-REQ-IFX-001-TO-MAN-react-component-src-builder-dropzones-droptarget`; `TRC-RS-R7-REQ-KBI-001-TO-MAN-react-component-src-builder-dropzones-droptarget`; recovery requirement needs new/corrected links; review-input-not-proof |

### Selection / Keyboard

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| S01 | SelectionIsland shows count/type and actions for selected card(s). | `REQ-SBC-001`, `REQ-SBC-DES-001` | browser | `wire-mockup-data` |
| S02 | Manual deselect works through Escape and empty-stage click. | `REQ-SBC-DES-001`, `REQ-KEY-005` | browser | `wire-mockup-data` |
| S03 | Ctrl+A selects eligible builder cards in the active scope. | `REQ-KEY-001`, `REQ-SBC-001` | browser + unit | `wire-mockup-data` |
| S04 | Ctrl+C/Ctrl+V copy and paste selected builder cards into smart targets. | `REQ-KEY-002`, `REQ-KEY-003`, `REQ-SBC-DUP-001` | browser + unit | `wire-mockup-data` |
| S05 | Delete/Backspace removes selected builder items through governed deletion rules. | `REQ-KEY-004`, `REQ-SBC-001` | browser + unit | `wire-mockup-data` |
| S06 | Ctrl+S triggers manual save without bypassing autosave governance. | `REQ-KEY-006`, `REQ-UP-004` | browser + unit | `wire-mockup-data` |
| S07 | Keyboard shortcuts are guarded while typing in text inputs. | `REQ-KEY-007` | unit + browser | `wire-mockup-data` |
| S08 | SelectionIsland max width and responsive constraints prevent overlap with center builder controls. | `REQ-STG-003`, `REQ-FP-D12` | visual | `change-token` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-KEY-001..007` | not-assessed | not verified | `EMC-SBC-SEED`, `EMC-UP-SEED`, `EMC-GOV-TRACE-TESTQA` | Existing RS-R7 keyboard links mostly point at generic `Select`/`Input` manifestations and must be corrected to real shortcut handlers/tests; review-input-not-proof |
| `REQ-SBC-DES-001`, `REQ-SBC-DUP-001` | not-assessed | not verified | `EMC-SBC-SEED`, `EMC-GOV-TRACE-FRONTEND` | `TRC-RS-R7-REQ-SBC-DES-001-TO-MAN-react-component-src-ui-forms-selects-select`; `TRC-RS-R7-REQ-SBC-DUP-001-TO-MAN-react-component-src-ui-forms-selects-select`; likely incorrect, must confirm/correct |

### Focus

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| F01 | FocusIsland opens locator/filter controls instead of only triggering unrelated editor expansion. | `REQ-FCS-001`, `REQ-FP-D02` | browser | `wire-mockup-data` |
| F02 | Default mode is highlight/spotlight: matches are activated/highlighted while non-matches remain visible. | `REQ-FCS-001`, `REQ-FP-D02` | browser + visual | `wire-mockup-data` |
| F03 | Optional hide/isolation behavior is not MVP default and must not be introduced as default. | `REQ-FCS-002`, `REQ-FP-D02` | code + visual | `change-component` |
| F04 | Filter categories include Week, Phase, Action, and valid Task properties. | `REQ-FCS-001`, `REQ-SBC-005` | browser | `wire-mockup-data` |
| F05 | Applying focus auto-centres the best target and preserves layout context. | `REQ-FCS-001`, `REQ-FP-CMA-003` | browser | `wire-mockup-data` |
| F06 | Focus state persists only where safe and excludes temporary hover/drag states. | `REQ-UP-005`, `REQ-UP-006`, `REQ-UP-012` | unit | `wire-mockup-data` |
| F07 | Focus panels show skeleton states for async/derived filter data. | `REQ-LOAD-SKEL-001`, `REQ-FCS-001` | visual | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-FCS-001`, `REQ-FCS-002` | not-assessed | not verified | `EMC-EVI-SEED`, `EMC-STG-SEED`, `EMC-UP-SEED` | `TRC-RS-R7-REQ-FCS-001-TO-MAN-react-component-src-builder-islands-focusisland-focusisland`; `TRC-RS-R7-REQ-FCS-002-TO-MAN-react-component-src-ui-forms-selects-select`; second link likely mis-targeted; review-input-not-proof |

### Theme / Tokens / Reduced Motion

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| L01 | Theme toggle updates `html.dataset.theme`, class list, and all app surfaces in one action. | `REQ-FP-D05`, `REQ-UP-009`, `REQ-UP-010` | browser + visual | `wire-mockup-data` |
| L02 | Light theme removes split-render bugs where Stage remains dark. | `REQ-FP-D05`, `REQ-IFX-001` | visual | `change-component` |
| L03 | UI preferences are local-browser, scoped by user/DCX/version, and do not create backend writes. | `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019` | unit + browser | `wire-mockup-data` |
| L04 | Layout dimensions use tokens for phase 72/260px, editor 382px, header 64px, footer 76px. | `REQ-FP-D12`, `REQ-STG-003` | code | `change-token` |
| L05 | Brand theme tokens avoid pure white/black surfaces where brand contract disallows them. | `REQ-FP-D08`, `REQ-IFX-001` | code + visual | `change-token` |
| M01 | Every effect has a reduced-motion branch: <=100ms fade or instant state change. | `REQ-FP-D06`, `REQ-IFX-001` | code + visual | `change-component` |
| M02 | Skeleton shimmer respects reduced motion and falls back to static placeholders. | `REQ-LOAD-SKEL-001`, `REQ-FP-D06` | code + visual | `change-component` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-IFX-001`, `REQ-FP-D05`, `REQ-FP-D06`, `REQ-FP-D08`, `REQ-FP-D12` | not-assessed | not verified | `EMC-IFX-SEED`, `EMC-UP-SEED`, `EMC-STG-SEED`, `EMC-GOV-TRACE-FRONTEND` | `TRC-RS-R7-REQ-IFX-001-TO-MAN-react-component-src-ui-forms-selects-select`; `TRC-RS-R7-REQ-IFX-001-TO-MAN-react-component-src-builder-dropzones-droptarget`; incomplete and review-input-not-proof |
| `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019` | not-assessed | not verified | `EMC-UP-SEED`, `EMC-GOV-TRACE-TESTQA` | `TRC-RS-R7-REQ-UP-009-TO-MAN-service-src-services-mock-store`; backend/service-looking link must be checked against local preference contract |

## Homepage Finalize Spec

### v0.1.4 Reference Summary

The archived Home page is a two-column dashboard: left side Hero, search/filter/saved views, and a scrollable version list; right side workspace analytics and activity/recently-opened feed. It includes create-DCX popup flow, saved filter views, status/client/product filtering, search across project/version/product/client/tags, empty result state, active campaign stats, and activity sync affordance.

### Home Checklist

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| H01 | Home is a functional dashboard for versions/campaigns, not a placeholder route. | `REQ-FP-D07`, `REQ-UP-001`, `REQ-UP-004` | browser + PO | `change-component` |
| H02 | Hero includes product identity and primary create action, wired to create-version/DCX flow or approved mock equivalent. | `REQ-FP-D07`, `REQ-UP-004` | browser | `wire-mockup-data` |
| H03 | Search filters versions by project, version number, product, client, and tags. | `REQ-FP-D07`, `REQ-UP-004` | unit + browser | `wire-mockup-data` |
| H04 | Advanced filters support status, client, product, active filter count, clearing, and saved views. | `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019`, `REQ-FP-D07` | unit + browser | `wire-mockup-data` |
| H05 | Version list renders selectable cards with status, client/project/product, version number, team/date metadata, and empty result state. | `REQ-FP-D07`, `REQ-UP-004` | visual + browser | `change-component` |
| H06 | Workspace analytics show active/total/average version summaries and do not block core navigation if unavailable. | `REQ-FP-D07`, `REQ-LOAD-SKEL-001` | visual | `change-component` |
| H07 | Activity/recently-opened feed has loading skeletons and an empty/error state; no spinner-only layout. | `REQ-LOAD-SKEL-001`, `REQ-FP-D07` | visual + browser | `change-component` |
| H08 | Create popup uses app-level modal/form primitives and never imports `src/builder/**`. | `REQ-FP-D07`, `REQ-EFP-001` | code | `change-component` |
| H09 | Home theme follows the same light/dark token contract as Builder. | `REQ-FP-D05`, `REQ-FP-D08`, `REQ-UP-009` | visual | `change-token` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-FP-D07` | not-assessed | not verified | `EMC-UP-SEED`, `EMC-EFP-SEED`, `EMC-GOV-TRACE-FRONTEND` | v0.1.4 archive is reference, not implementation proof; current `src/pages/home/HomePage.tsx` must be checked during implementation |
| `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019` | not-assessed | not verified | `EMC-UP-SEED` | saved view/filter preference behavior needs local-storage scoped manifestation and tests |
| `REQ-LOAD-SKEL-001` | not-assessed | not verified | `EMC-EVI-SEED`, `EMC-UP-SEED`, `EMC-GOV-TRACE-FRONTEND` | new skeleton links required for home list, activity, analytics, and create popup |

## Version Page Finalize Spec

### v0.1.4 Reference Summary

The archived Version page is a sandbox workspace: campaign header with back navigation, client/product/project identity, collaborators, status bar, version switchboard, version creation popup, version summary console, mini builder preview, workspace resources, active crew, and launch-builder action. Missing-version state returns users to Home.

### Version Checklist

| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| V01 | Version route renders a real workspace for the selected version and a friendly missing-version fallback. | `REQ-FP-D07`, `REQ-UP-004`, `REQ-UP-022` | browser | `change-component` |
| V02 | Header exposes back navigation, client/product/project identity, and campaign collaborators. | `REQ-FP-D07`, `REQ-UP-004` | visual + browser | `change-component` |
| V03 | Status bar supports Draft/In Progress/Ready for Review/Approved transitions through governed action handlers. | `REQ-FP-D07`, `REQ-UP-004` | browser + unit | `wire-mockup-data` |
| V04 | Version switchboard lists same-campaign versions, active state, created date, status, and create-new sequence action. | `REQ-FP-D07`, `REQ-UP-004`, `REQ-UP-021` | browser | `wire-mockup-data` |
| V05 | Version creation popup supports from-scratch path and labels duplicate-existing as unavailable unless implemented. | `REQ-FP-D07`, `REQ-UP-004` | browser | `wire-mockup-data` |
| V06 | Summary console includes mini builder preview and launch-builder action without importing Builder internals into route components. | `REQ-FP-D07`, `REQ-STG-001`, `REQ-UP-004` | code + browser | `change-component` |
| V07 | Workspace resources render file tags/links, empty state, and future embedded preview path. | `REQ-EFP-001`, `REQ-FP-D07` | browser | `wire-mockup-data` |
| V08 | Active crew/collaborator inspection renders names/roles and empty state. | `REQ-FP-D07`, `REQ-UP-004` | visual | `change-component` |
| V09 | Version page stores/restores safe local UI state only; locked/deleted versions follow restore rules. | `REQ-UP-005`, `REQ-UP-011`, `REQ-UP-012`, `REQ-UP-021`, `REQ-UP-022` | unit + browser | `wire-mockup-data` |
| V10 | Version skeletons cover header, status bar, switchboard, resources, crew, mini preview, and launch area. | `REQ-LOAD-SKEL-001`, `REQ-FP-D07` | visual | `change-component` |
| V11 | Version theme and responsive behavior follow brand tokens and no pure-white/pure-black violations. | `REQ-FP-D05`, `REQ-FP-D08`, `REQ-FP-D12` | visual + code | `change-token` |

Coverage gap:

| REQ family | Delivery | Verification | Expected EMC | RS-R7 candidate links to confirm/correct |
|---|---|---|---|---|
| `REQ-FP-D07` | not-assessed | not verified | `EMC-UP-SEED`, `EMC-EFP-SEED`, `EMC-STG-SEED`, `EMC-GOV-TRACE-FRONTEND` | v0.1.4 route source is reference; current v0.3.5 Version route must be inspected during implementation |
| `REQ-EFP-001` | not-assessed | not verified | `EMC-EFP-SEED`, `EMC-FI-SEED` | `TRC-RS-R7-REQ-EFP-001-TO-MAN-react-component-stickypopupshell-stickypopupshell`; `TRC-RS-R7-REQ-EFP-001-TO-MAN-react-component-src-main`; likely insufficient for resources/preview; review-input-not-proof |
| `REQ-UP-004`, `REQ-UP-005`, `REQ-UP-011`, `REQ-UP-012`, `REQ-UP-021`, `REQ-UP-022` | not-assessed | not verified | `EMC-UP-SEED`, `EMC-GOV-TRACE-TESTQA` | restore/local-state links must be corrected to version route and preference modules |
| `REQ-LOAD-SKEL-001` | not-assessed | not verified | `EMC-UP-SEED`, `EMC-EFP-SEED`, `EMC-STG-SEED` | new skeleton manifestations required for every async version section |

## Cross-Surface Skeleton Requirements

| Surface | Required skeleton states | Graph REQ IDs | Family |
|---|---|---|---|
| Builder shell | header metadata, editor, stage, islands, builder controls, cards/dropzones, focus/filter panels | `REQ-LOAD-SKEL-001`, `REQ-EVI-001`, `REQ-STG-001`, `REQ-SBC-001` | `change-component` |
| Homepage | hero/create action readiness, search/filter restore, version list, analytics, activity feed, create popup | `REQ-LOAD-SKEL-001`, `REQ-FP-D07`, `REQ-UP-009` | `change-component` |
| Version page | header, collaborators, status bar, switchboard, summary/mini-preview, resources, crew, create sequence popup | `REQ-LOAD-SKEL-001`, `REQ-FP-D07`, `REQ-EFP-001`, `REQ-UP-004` | `change-component` |
| Motion rule | shimmer disabled under reduced motion; static placeholders or <=100ms fade only | `REQ-LOAD-SKEL-001`, `REQ-FP-D06`, `REQ-IFX-001` | `change-component` |

## Implementation Matrix Input

| Family | Builder | Home | Version | Total |
|---|---:|---:|---:|---:|
| `wire-mockup-data` | 41 | 3 | 5 | 49 |
| `change-component` | 22 | 5 | 2 | 29 |
| `change-token` | 1 | 1 | 4 | 6 |
| **Explicit criterion rows** | **64** | **9** | **11** | **84** |
| Cross-surface skeleton policy rows | — | — | — | 4 |

Recommended implementation ordering for the later implementation plan:
1. Theme toggle and local preference foundation: `REQ-FP-D05`, `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019`.
2. Structural token pass: `REQ-FP-D12`, then card/stage dimensions.
3. Skeleton system before broad async surfaces: `REQ-LOAD-SKEL-001`.
4. Drag/drop engine and card identity: `REQ-DZ-001`, `REQ-SBC-001..005`.
5. Editor, selection, keyboard, focus, timeline/view helper behavior.
6. Home and Version routes using v0.1.4 workflows, with no builder-internal imports.

## RS-R7 Candidate Links Flagged For Implementation Review

These are the highest-risk candidate links because they either point to generic UI components or likely predate the graph-grounded behavior:

| Link | Action |
|---|---|
| `TRC-RS-R7-REQ-STG-001-TO-MAN-react-component-src-ui-forms-selects-select` | Correct or replace; a stage requirement should not be proven by a generic select. |
| `TRC-RS-R7-REQ-SBC-DES-001-TO-MAN-react-component-src-ui-forms-selects-select` | Correct or replace with real deselect handler/tests. |
| `TRC-RS-R7-REQ-SBC-DUP-001-TO-MAN-react-component-src-ui-forms-selects-select` | Correct or replace with copy/paste handler/tests. |
| `TRC-RS-R7-REQ-KEY-*` links to `Select`/`Input` | Confirm keyboard guard coverage, then add real shortcut manifestations. |
| `TRC-RS-R7-REQ-UP-009-TO-MAN-service-src-services-mock-store` | Check against local preference storage; no backend writes per `REQ-UP-019`. |
| `TRC-RS-R7-REQ-EFP-001-*` | Confirm file/preview route coverage; current candidates do not prove Home/Version resource behavior. |

## No New Decisions Opened

No new `PO decision required` rows are opened by FP-R4. All former D-01..D-12 outcomes are covered as `REQ-FP-D01..D12`, with the important constraints carried into the criteria above:

| Decision REQ | Applied as |
|---|---|
| `REQ-FP-D01` | One responsive Task card component. |
| `REQ-FP-D02` | Focus default is highlight/spotlight, not hide. |
| `REQ-FP-D03` | ViewHelperIsland is view-gated, not absent. |
| `REQ-FP-D04` | AIChat/Template entry points in scope. |
| `REQ-FP-D05` | Theme toggle must actually switch app theme. |
| `REQ-FP-D06` | Dedicated reduced-motion branches. |
| `REQ-FP-D07` | v0.1.4 Home/Version archive is the reference. |
| `REQ-FP-D08` | Brandbook-derived UI/token contract. |
| `REQ-FP-D09` | Editor collapsed button opens on selection. |
| `REQ-FP-D10` | Routing fields are single-column/full-width. |
| `REQ-FP-D11` | Collapsed Phase readiness uses tooltip + aria-label. |
| `REQ-FP-D12` | Structural dimensions are tokenized. |

## FP-R4 Close Criteria Met

| Requirement | Result |
|---|---|
| Every criterion cites canonical graph REQ IDs | Met. |
| Coverage-gap table per area includes delivery, verification, EMC categories, RS-R7 candidates | Met. |
| Home and Version specs complete and grounded in v0.1.4 archive | Met. |
| `REQ-SBT-COPY-001` included | Met in Cards/Keyboard criteria. |
| `REQ-LOAD-SKEL-001` included across all surfaces | Met in Builder, Home, Version, cross-surface table. |
| Every gap has family tag | Met. |
| Provisional RS-R7 links labeled review-input-not-proof | Met. |
| No source writes | To be verified in session log. |

---

## FP-R4 PATCH — 2026-06-30 (Claude): coverage additions + live confirmation

Closes the coverage gaps from the PO readiness check (log 011) and records the live stress/drag test
(logs 012/013). **Adds** to — does not replace — the criteria above. All are existing graph reqs (no new scope).

### Added criteria

**Timeline day-card quick-create (the significant missing gap):**
| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| T06 | Create a task from inside a Timeline **day card** (inline quick-create); timeline allows task creation only. | `REQ-BC-007`, `REQ-BC-008` | browser | `wire-mockup-data` |
| T07 | Timeline-created task selects/creates a parent phase/action and accepts minimal data first, completed later. | `REQ-BC-009`, `REQ-BC-010` | browser | `wire-mockup-data` |

Coverage: `REQ-BC-007..010` not-assessed/not-verified; expected `EMC-STG-SEED`,`EMC-SBC-SEED`; code
exists (`DayGridCard`, `DayTaskCreator`) — confirm/correct links at implementation; review-input-not-proof.

**App-wide typography token criterion (was only card-level FP-D01):**
| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| L06 | App-wide font sizes flow through brand typography tokens (`text-dcx-*`); no arbitrary font sizes outside `src/brand`. | `REQ-FP-D08`, `REQ-FP-D01` | code + visual | `change-token` |

**Explicit stage/column scroll criterion (legacy K01 dropped in the rewrite):**
| ID | Criterion | Graph REQ IDs | Verify | Family |
|---|---|---|---|---|
| K08 | Phase columns bounded-height with internal scroll for dense lists; edge/off-stage scroll preserves drag context; no "wall of scroll" at 7–8 phases. | `REQ-STG-001`, `REQ-STG-004`, `REQ-FP-CMA-002` | browser + visual | `change-component` |

### Live-confirmation updates (2026-06-30 — logs 012/013)
- **Drag/drop is LIVE, not inert** — FP-R0's "activeDrag never set / drop zones inert" is **superseded**.
  Confirmed at 1440px with real pointer/drag: E04 (drag Task→Editor opens editor + stage push `REQ-STG-003`);
  D-series rearrangement (task between actions; action between phases; 13 `.drop-target`); selection→
  SelectionIsland; expand/collapse 72↔260; create phase/action/task; **8-phase density with NO horizontal
  scroll** (`REQ-FP-CMA-002`); Focus island; task-creation channel flow. Mark D-series + E04 **live-confirmed**.
- **PO Web Check methodology:** cards are pointer/long-press/drag driven — `.click()` does NOT trigger them.
  PO Web Checks + E2E MUST use real pointer/drag (Playwright real mouse); add `data-testid` hooks at implementation.
- **Open for implementation (not discovery gaps):** off-stage/edge-scroll drag + timeline task→day drop need
  a real-pointer pass; routing/endpoint fields truncate at editor width (confirms E07/D10).

### Revised criterion total
84 explicit rows + **4 added (T06, T07, K08, L06)** = **88 explicit criterion rows** (builder 67, home 9,
version 11, +1 cross-cutting typography). FP-R5 ledger amended accordingly (see FP-R5 patch).
