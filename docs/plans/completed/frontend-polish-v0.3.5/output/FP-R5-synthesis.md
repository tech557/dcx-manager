---
sprint: FP-R5
title: Synthesis -> three-family matrix + implementation coverage ledger + drafted implementation sprints
agent: codex
date: 2026-06-30
status: Complete
version_context: v0.3.5
source_of_truth: docs/product/requirements/graph/
---

# FP-R5 — Graph-Grounded Synthesis

## Requirement Trace

| Field | Value |
|---|---|
| Primary graph IDs | All FP-R4 IDs: `REQ-EVI-001`, `REQ-SBC-*`, `REQ-SBT-COPY-001`, `REQ-RDY-*`, `REQ-STG-*`, `REQ-KBI-001`, `REQ-TPL-001`, `REQ-VHB-001`, `REQ-DZ-*`, `REQ-FCS-*`, `REQ-IFX-001`, `REQ-KEY-*`, `REQ-UP-*`, `REQ-EFP-001`, `REQ-LOAD-SKEL-001`, `REQ-FP-CMA-*`, `REQ-FP-D01..D12`. |
| Governance IDs | `REQ-GOV-TRACE-001-FRONTEND`, `REQ-GOV-TRACE-001-AGENT` by process convention. |
| Inputs | FP-R0 live inventory, FP-R1 brand reconciliation, FP-R2 token audit, FP-R3 modularization audit, rewritten FP-R4 finalize spec, RS-R11 re-grounding brief, FP-R4 validation log. |
| Output | Ready-to-place implementation plan contents for `docs/plans/drafted/frontend-polish-implementation-v0.3.x/`; FP-R5 does not self-promote or create that folder. |

## Entry Verdict

FP-R5 can proceed because Claude independently validated the rewritten FP-R4 output as ready. While building the coverage ledger, I normalized one accounting issue: the FP-R4 prose total said 99 criteria, but the explicit checklist contains **84 criterion rows** plus **4 cross-surface skeleton policy rows**. This FP-R5 output uses the explicit row set so the PO and implementation agents can check every target change without inheriting a bad count.

## Three-Family Matrix

| Family | Required skill/tool | Eligible executor | Touches | Never |
|---|---|---|---|---|
| `change-token` | `impeccable` brand-only if G-IMPECCABLE is cleared; otherwise Claude applies `brand-ui-interpretation.md` directly. Browser/Preview proof required for light theme. | Claude | `src/brand/**`, token docs | component markup, behavior, services |
| `change-component` | `dcx-frontend-refactor`; browser/visual proof for UI-visible work. | Claude/opencode; Codex only for non-browser splits with handoff for visual proof | `src/ui/**`, `src/builder/**`, page component structure | brand identity, new product features |
| `wire-mockup-data` | graph tooling + behavior implementation; browser proof required. | Claude/opencode; Codex only with browser-capable handoff | builder/page behavior, state, `src/mock/*`, service seams | visual redesign, brand token changes |

## Implementation Sprint Set

Recommended plan folder: `docs/plans/drafted/frontend-polish-implementation-v0.3.x/`.

Execution order:

```text
WM-1 -> CT-1 -> CT-2 -> SK-1 -> CC-1 -> CC-2 -> CC-3 -> CC-4 -> CC-5 -> CC-6
     -> WM-2 -> WM-3 -> WM-4 -> WM-5 -> WM-6 -> HV-1 -> HV-2
     + CC-OPT only when touching an over-target file
```

Each sprint closes only after candidate links are confirmed/corrected/rejected, touched manifestations are linked/exempted, `npm run req:completion-gate -- --changed <files>` or the repo's current equivalent is recorded, and `npm run req:validate` passes.

### WM-1 — Theme Toggle + Local Preference Foundation

Requirement Trace: `REQ-FP-D05`, `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019`.

Scope: wire theme toggle through real app state, `html.dataset.theme`, class list, local scoped preference storage, and reload restore. Out: token values and light-surface component fixes.

Executor: Claude/opencode. Family: `wire-mockup-data`. Required proof: browser.

PO Web Check: route `/builder`; viewports 1440x900 and 390x844; seed `src/mock/versions.mock.ts` + builder mock state; click header theme toggle, reload, revisit Builder; expected visible result is dark/light toggle persists and no backend write occurs; evidence path `output/evidence/WM-1-theme-toggle/`; PO should check the toggle actually changes the app, not only the button icon.

Requirement Debt Burn-down: touch `REQ-FP-D05`, `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019`, expected `EMC-UP-SEED`; confirm/correct `TRC-RS-R7-REQ-UP-009-TO-MAN-service-src-services-mock-store`; before/after queue counts for touched `UP` links; run completion gate and `req:validate`.

### CT-1 — Brand Light/Dark Token Corrections

Requirement Trace: `REQ-FP-D08`, `REQ-FP-D05`, `REQ-UP-009`, `REQ-IFX-001`, `REQ-FP-D12` where page theme criteria consume token decisions.

Scope: fix pure-white/pure-black token offenders, add `--theme-text-secondary`, align shadcn light `--background`, and enforce main-blue-on-light via contrast-safe token. Out: component behavior.

Executor: Claude. Family: `change-token`. Required skill: `impeccable` brand-only if G-IMPECCABLE is cleared; otherwise direct brand contract application. Required proof: browser/visual.

PO Web Check: routes `/builder`, `/home`, `/version/:id`; viewports 1440x900 and 390x844; seed standard mock version; switch light/dark; expected no pure white token surfaces, no unreadable brand-blue text on light surfaces, screenshots in `output/evidence/CT-1-theme-tokens/`; PO should check legibility, not new layout.

Requirement Debt Burn-down: touch `REQ-FP-D08`, `REQ-IFX-001`, `REQ-FP-D05`, expected `EMC-IFX-SEED`, `EMC-UP-SEED`; confirm no misleading token manifestations; record before/after pure-white, missing-token, contrast counts; completion gate + `req:validate`.

### CT-2 — Structural Dimension Tokens

Requirement Trace: `REQ-FP-D12`, `REQ-STG-003`, `REQ-SBC-003`, `REQ-FP-D11`.

Scope: define tokens for phase 72/260px, editor 382px, header 64px, footer 76px, selection max width, and card sizing support; values unchanged. Out: consuming component refactors except minimal safe usage where token definitions require it.

Executor: Claude. Family: `change-token`. Required proof: code + visual no-diff.

PO Web Check: route `/builder`; viewport 1440x900; expected dimensions look unchanged while DevTools/computed style proves values come from tokens; evidence `output/evidence/CT-2-structural-tokens/`; PO should check no layout redesign happened.

Requirement Debt Burn-down: touch `REQ-FP-D12`, `REQ-STG-003`, `REQ-SBC-003`, expected `EMC-STG-SEED`, `EMC-SBC-SEED`; update MAN/TRC for token manifestations; before/after arbitrary layout-token count; completion gate + `req:validate`.

### SK-1 — App-Wide Skeleton Loading

Requirement Trace: `REQ-LOAD-SKEL-001` plus surface IDs `REQ-EVI-001`, `REQ-SBC-001`, `REQ-RDY-001`, `REQ-STG-001`, `REQ-KBI-001`, `REQ-FCS-001`, `REQ-FP-D07`, `REQ-EFP-001`, `REQ-UP-004`, `REQ-FP-D06`.

Scope: create/reuse skeleton states for Builder shell/stage/cards/editor/focus, Home list/analytics/activity/create, Version header/status/switch/resources/crew/mini-preview. Reduced motion disables shimmer. Out: full Home/Version behavior and token color decisions.

Executor: Claude/opencode. Family: `change-component`. Required proof: browser/visual.

PO Web Check: routes `/builder`, `/home`, `/version/:id`; throttle data or use mock loading fixture; expected skeletons match final geometry with no spinner-only blank state; evidence `output/evidence/SK-1-skeletons/`; PO should check there is no layout jump when data resolves.

Requirement Debt Burn-down: create/confirm manifestations for `REQ-LOAD-SKEL-001` across `EMC-EVI-SEED`, `EMC-STG-SEED`, `EMC-UP-SEED`, `EMC-EFP-SEED`, `EMC-GOV-TRACE-FRONTEND`; before/after count for skeleton-linked MAN/TRC; completion gate + `req:validate`.

### CC-1 — Editor State Hard-Cap Split

Requirement Trace: governance/file-size debt from FP-R3; supports `REQ-EVI-001`, `REQ-UP-011`, `REQ-UP-012`.

Scope: split `useEditorState.ts` internally under `EditorViewerIsland/`, keep public `useEditorState()` facade, do not revive deleted hook names. Out: behavior changes.

Executor: any with `dcx-frontend-refactor`; Codex eligible because browser proof is not required if no behavior changes. Family: `change-component`.

PO Web Check: no visible PO check beyond smoke opening Builder/editor; evidence `output/evidence/CC-1-editor-split/`; PO should check the editor still opens if a browser-capable executor runs the smoke.

Requirement Debt Burn-down: link split manifestations to `REQ-EVI-001`/`REQ-UP-*` only if touched; before/after file cap count 1 -> 0; completion gate + `req:validate`.

### CC-2 — Responsive Shared Card Components

Requirement Trace: `REQ-SBC-003`, `REQ-SBC-004`, `REQ-SBC-005`, `REQ-FP-D01`, `REQ-FP-D11`, `REQ-FP-D12`.

Scope: one responsive Task card, non-truncating Action card, Phase collapsed/expanded states, token-driven spacing. Includes PO design-exploration checkpoint before code. Out: drag/drop logic and copy/paste.

Executor: Claude/opencode. Family: `change-component`. Required proof: browser/visual.

PO Web Check: route `/builder`; viewports 1440x900 and 390x844; seed version with Phase/Action/Task cards; inspect collapsed/expanded cards; expected name/channel/status visible at target states and no text clipping; evidence `output/evidence/CC-2-card-responsive/`; PO should approve the resize model before implementation starts.

Requirement Debt Burn-down: touch `REQ-SBC-003..005`, `REQ-FP-D01`, `REQ-FP-D11`, `REQ-FP-D12`, expected `EMC-SBC-SEED`, `EMC-STG-SEED`; confirm/correct card RS-R7 links to actual card components; before/after queue count; completion gate + `req:validate`.

### CC-3 — Editor Component Fixes

Requirement Trace: `REQ-EVI-001`, `REQ-FP-D09`, `REQ-FP-D10`.

Scope: enable collapsed editor button on valid selection and make routing/endpoint fields single-column/full-width at 382px. Out: editor session wiring and drag-to-editor behavior.

Executor: Claude/opencode. Family: `change-component`. Required proof: browser/visual.

PO Web Check: `/builder`, 1440x900; select Task/Action; click editor pill; inspect Routing and Endpoint Directory; expected pill opens and no labels truncate; evidence `output/evidence/CC-3-editor-component/`; PO should check the editor width did not change.

Requirement Debt Burn-down: touch `REQ-EVI-001`, `REQ-FP-D09`, `REQ-FP-D10`, expected `EMC-EVI-SEED`; confirm editor candidate links to real `EditorViewerIsland`/`TaskEditor` files; completion gate + `req:validate`.

### CC-4 — Readiness Accessibility

Requirement Trace: `REQ-RDY-001`, `REQ-FP-D11`.

Scope: tooltip + `aria-label` for collapsed Phase readiness; visible readiness indicators where component-only. Out: readiness computation.

Executor: Claude/opencode. Family: `change-component`. Required proof: browser/a11y.

PO Web Check: `/builder`, 1440x900; collapse a Phase; hover/focus readiness marker; expected tooltip and screen-reader label expose readiness text; evidence `output/evidence/CC-4-readiness-a11y/`; PO should check collapsed columns remain compact.

Requirement Debt Burn-down: touch `REQ-RDY-001`, `REQ-FP-D11`, expected `EMC-SBC-SEED`; confirm readiness manifestations; completion gate + `req:validate`.

### CC-5 — Motion + Interaction Feedback

Requirement Trace: `REQ-FP-D06`, `REQ-IFX-001`, `REQ-DZ-001`, `REQ-LOAD-SKEL-001`.

Scope: reduced-motion branches for effects, card feedback, drop previews, and skeleton shimmer; reusable valid/invalid drop feedback. Out: drag data movement.

Executor: Claude/opencode. Family: `change-component`. Required proof: browser with reduced motion emulation.

PO Web Check: `/builder`; reduced-motion enabled; drag/expand/select/create flows; expected instant/static or <=100ms fade behavior and clear feedback; evidence `output/evidence/CC-5-reduced-motion/`; PO should check motion is reduced, not removed from state clarity.

Requirement Debt Burn-down: touch `REQ-IFX-001`, `REQ-FP-D06`, `REQ-DZ-001`, `REQ-LOAD-SKEL-001`, expected `EMC-IFX-SEED`, `EMC-DZ-SEED`; correct generic IFX links; completion gate + `req:validate`.

### CC-6 — Stage + Island Light Surfaces

Requirement Trace: `REQ-FP-D05`, `REQ-IFX-001`.

Scope: consume CT-1 tokens so Stage canvas and row-1/row-3 islands switch fully in light theme. Out: token values.

Executor: Claude/opencode. Family: `change-component`. Required proof: browser/visual.

PO Web Check: `/builder`; light theme; viewports 1440x900 and 390x844; expected no dark canvas/island patches after toggle; evidence `output/evidence/CC-6-light-surfaces/`; PO should check the stage itself, not just header/footer.

Requirement Debt Burn-down: touch `REQ-FP-D05`, `REQ-IFX-001`, expected `EMC-IFX-SEED`; confirm surface manifestations; completion gate + `req:validate`.

### WM-2 — Typed Drag/Drop Engine

Requirement Trace: `REQ-DZ-001`, `REQ-DZ-001-RECOVERY`, `REQ-STG-004`, `REQ-STG-005`, `REQ-SBC-001`, `REQ-SBC-002`.

Scope: active drag state, view-generated dropzones, hierarchy constraints, same-level multi-drag, edge/off-stage behavior, drag-to-editor handoff trigger. Out: card visual redesign.

Executor: Claude/opencode. Family: `wire-mockup-data`. Required proof: browser.

PO Web Check: `/builder`; drag Phase/Action/Task in Kanban and Task to Timeline day; expected valid targets light up, invalid targets reject, no lost drag at edges; evidence `output/evidence/WM-2-drag-drop/`; PO should check one valid and one invalid drag for each card type.

Requirement Debt Burn-down: touch `REQ-DZ-001`, `REQ-DZ-001-RECOVERY`, `REQ-STG-004`, `REQ-STG-005`, `REQ-SBC-002`; expected `EMC-DZ-SEED`, `EMC-STG-SEED`; correct dropzone candidate links; completion gate + `req:validate`.

### WM-3 — Editor Open Paths + Sessions

Requirement Trace: `REQ-EVI-001`, `REQ-SBC-001`, `REQ-SBC-004`, `REQ-FP-D09`, `REQ-DZ-001`, `REQ-UP-011`, `REQ-UP-012`, `REQ-UP-014`.

Scope: long-press Task/Action, drag-to-editor, session pills, safe close/restore, dirty preservation. Out: visual routing layout already owned by CC-3.

Executor: Claude/opencode. Family: `wire-mockup-data`. Required proof: browser.

PO Web Check: `/builder`; long-press Task and Action, drag Task to editor, open more than five sessions; expected correct context and no unsaved discard; evidence `output/evidence/WM-3-editor-sessions/`; PO should check Action opens too.

Requirement Debt Burn-down: touch `REQ-EVI-001`, `REQ-UP-011`, `REQ-UP-012`, `REQ-UP-014`; expected `EMC-EVI-SEED`, `EMC-UP-SEED`; confirm/correct editor RS-R7 candidates; completion gate + `req:validate`.

### WM-4 — Card Interactions + Copy/Paste

Requirement Trace: `REQ-SBC-001`, `REQ-SBC-002`, `REQ-SBC-DUP-001`, `REQ-SBT-COPY-001`, `REQ-KEY-002`, `REQ-KEY-003`, `REQ-KEY-007`, `REQ-EVI-001`, `REQ-FCS-001`, `REQ-UP-012`.

Scope: single/double click behavior, independent popup/expanded states, receiving/new-card feedback wiring, card copy/paste, subtask copy/paste. Out: responsive visual card redesign.

Executor: Claude/opencode. Family: `wire-mockup-data`. Required proof: browser.

PO Web Check: `/builder`; click/double-click Task/Action/Phase, copy/paste selected cards, copy/paste subtasks between Tasks; expected duplicated objects preserve definition/fields without overwrite; evidence `output/evidence/WM-4-card-copy/`; PO should check subtask copy is distinct from card copy.

Requirement Debt Burn-down: touch `REQ-SBC-DUP-001`, `REQ-SBT-COPY-001`, `REQ-KEY-002`, `REQ-KEY-003`, expected `EMC-SBC-SEED`, `EMC-GOV-TRACE-TESTQA`; reject generic Select candidate links; add tests/manifests; completion gate + `req:validate`.

### WM-5 — Focus, Selection, Keyboard, Readiness Wiring

Requirement Trace: `REQ-FCS-001`, `REQ-FCS-002`, `REQ-FP-D02`, `REQ-FP-CMA-001`, `REQ-FP-CMA-003`, `REQ-RDY-001`, `REQ-RDY-003`, `REQ-SBC-DES-001`, `REQ-KEY-001..007`, `REQ-UP-005`, `REQ-UP-006`, `REQ-UP-012`.

Scope: Focus highlight/spotlight, opt-in isolation only, selection actions, keyboard shortcuts, readiness computation/rollup, auto-centre from focus. Out: card visual redesign.

Executor: Claude/opencode. Family: `wire-mockup-data`. Required proof: browser.

PO Web Check: `/builder`; apply focus filters, use Ctrl+A/C/V/Delete/Escape/Ctrl+S, inspect readiness summary; expected non-matches stay visible by default, keyboard shortcuts guard text inputs, readiness updates; evidence `output/evidence/WM-5-focus-selection/`; PO should check default focus is highlight, not hide.

Requirement Debt Burn-down: touch `REQ-FCS-*`, `REQ-KEY-*`, `REQ-SBC-DES-001`, `REQ-RDY-*`, expected `EMC-SBC-SEED`, `EMC-UP-SEED`, `EMC-GOV-TRACE-TESTQA`; correct generic keyboard links; completion gate + `req:validate`.

### WM-6 — Stage Views, Kanban Builder, Timeline, ViewHelper

Requirement Trace: `REQ-UP-001..004`, `REQ-STG-001..005`, `REQ-FP-CMA-002..004`, `REQ-KBI-001`, `REQ-TPL-001`, `REQ-FP-D04`, `REQ-VHB-001`, `REQ-UP-007`, `REQ-UP-008`, `REQ-FP-D03`.

Scope: default/restore view state, smart expanded phases, auto-centre, creator pills, template entry, Timeline weekly/monthly, ViewHelper in timeline, task-to-day assignment. Out: low-level drag engine owned by WM-2.

Executor: Claude/opencode. Family: `wire-mockup-data`. Required proof: browser.

PO Web Check: `/builder`; switch Kanban/Timeline, use creator pills, open Template popup, inspect ViewHelper only in timeline; expected state preservation and visible timeline helper; evidence `output/evidence/WM-6-stage-views/`; PO should check ViewHelper in Timeline, not Kanban.

Requirement Debt Burn-down: touch `REQ-STG-*`, `REQ-KBI-001`, `REQ-TPL-001`, `REQ-VHB-001`, `REQ-UP-*`; expected `EMC-STG-SEED`, `EMC-VHB-SEED`, `EMC-TPL-SEED`, `EMC-UP-SEED`; correct mis-targeted `REQ-STG-001` link; completion gate + `req:validate`.

### HV-1 — Homepage Operational Dashboard

Requirement Trace: `REQ-FP-D07`, `REQ-UP-001`, `REQ-UP-004`, `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019`, `REQ-EFP-001`.

Scope: rebuild Home from v0.1.4 operational reference: hero/create, search, filters, saved views, version cards, analytics, activity, empty states. Preserve no builder-internal imports. Out: Builder implementation.

Executor: Claude/opencode. Family: mixed `change-component` + `wire-mockup-data`; no `impeccable`. Required proof: browser.

PO Web Check: `/home`; viewports 1440x900 and 390x844; seed mock versions; search, filter, save view, create flow, select version; expected dashboard matches operational workflows from v0.1.4; evidence `output/evidence/HV-1-home/`; PO should check a user can find and enter a version.

Requirement Debt Burn-down: touch `REQ-FP-D07`, `REQ-UP-*`, `REQ-EFP-001`; expected `EMC-UP-SEED`, `EMC-EFP-SEED`; create/correct Home route manifestations; completion gate + `req:validate`.

### HV-2 — Version Workspace

Requirement Trace: `REQ-FP-D07`, `REQ-UP-004`, `REQ-UP-005`, `REQ-UP-011`, `REQ-UP-012`, `REQ-UP-021`, `REQ-UP-022`, `REQ-STG-001`, `REQ-EFP-001`.

Scope: rebuild Version from v0.1.4 operational reference: missing fallback, header, collaborators, status bar, switchboard, create sequence, summary/mini preview, resources, crew, launch Builder. Preserve no builder-internal imports.

Executor: Claude/opencode. Family: mixed `change-component` + `wire-mockup-data`; no `impeccable`. Required proof: browser.

PO Web Check: `/version/:id`; viewports 1440x900 and 390x844; seed mock version with files/team; switch versions, change status, inspect resources/crew, launch builder; expected workspace is usable and not a placeholder; evidence `output/evidence/HV-2-version/`; PO should check missing-version fallback too.

Requirement Debt Burn-down: touch `REQ-FP-D07`, `REQ-UP-*`, `REQ-EFP-001`, `REQ-STG-001`; expected `EMC-UP-SEED`, `EMC-EFP-SEED`, `EMC-STG-SEED`; correct EFP/Version route manifestations; completion gate + `req:validate`.

### CC-OPT — Opportunistic File-Size Cleanup

Requirement Trace: FP-R3 file-size governance; linked only to requirement families touched by the owning sprint.

Scope: split over-target files only when the same file is already touched by a scoped implementation sprint. Out: standalone broad cleanup.

PO Web Check: none unless the owning sprint has one; evidence goes under the owning sprint.

Requirement Debt Burn-down: record before/after line counts and link/exempt any new manifestations created by extraction.

## Implementation Coverage Ledger

Every explicit FP-R4 criterion row is assigned below. Cross-surface skeleton policies are assigned after the table.

| Criterion | Sprint | Likely files | Graph IDs | PO Web Check | Graph gate |
|---|---|---|---|---|---|
| E01 | WM-3 | EditorViewerIsland state/session hooks; card long-press handlers | REQ-EVI-001, REQ-SBC-001 | /builder; long-press Task/Action and drag-to-editor open sessions | completion-gate changed files + req:validate |
| E02 | WM-3 | EditorViewerIsland state/session hooks; card long-press handlers | REQ-EVI-001, REQ-SBC-004, REQ-FP-D09 | /builder; long-press Task/Action and drag-to-editor open sessions | completion-gate changed files + req:validate |
| E03 | CC-3 | EditorViewerIsland; TaskEditor/RoutingDirectorySection | REQ-EVI-001, REQ-FP-D09 | /builder; select card; editor pill opens; routing fields do not truncate | completion-gate changed files + req:validate |
| E04 | WM-3 | EditorViewerIsland state/session hooks; card long-press handlers | REQ-EVI-001, REQ-DZ-001, REQ-SBC-002 | /builder; long-press Task/Action and drag-to-editor open sessions | completion-gate changed files + req:validate |
| E05 | WM-3 | EditorViewerIsland state/session hooks; card long-press handlers | REQ-EVI-001, REQ-UP-011, REQ-UP-012 | /builder; long-press Task/Action and drag-to-editor open sessions | completion-gate changed files + req:validate |
| E06 | WM-3 | EditorViewerIsland state/session hooks; card long-press handlers | REQ-EVI-001, REQ-UP-011, REQ-UP-014 | /builder; long-press Task/Action and drag-to-editor open sessions | completion-gate changed files + req:validate |
| E07 | CC-3 | EditorViewerIsland; TaskEditor/RoutingDirectorySection | REQ-EVI-001, REQ-FP-D10 | /builder; select card; editor pill opens; routing fields do not truncate | completion-gate changed files + req:validate |
| E08 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-EVI-001, REQ-UP-004 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| C01 | WM-4 | card interaction hooks; shortcut/copy paste handlers; subtask form state | REQ-SBC-001, REQ-IFX-001 | /builder; click/double-click/copy/paste/subtask copy behavior | completion-gate changed files + req:validate |
| C02 | WM-4 | card interaction hooks; shortcut/copy paste handlers; subtask form state | REQ-SBC-002, REQ-DZ-001, REQ-DZ-001-RECOVERY | /builder; click/double-click/copy/paste/subtask copy behavior | completion-gate changed files + req:validate |
| C03 | CT-2 | src/brand/styles/tokens.css; consuming token docs | REQ-SBC-003, REQ-FP-D11, REQ-FP-D12 | /builder, 1440; dimensions unchanged while sourced from tokens | completion-gate changed files + req:validate |
| C04 | CC-2 | TaskCard/PhaseCard/ActionCard; card templates | REQ-SBC-004, REQ-FP-D01 | /builder, 1440+390; inspect responsive card states after PO design signoff | completion-gate changed files + req:validate |
| C05 | CC-2 | TaskCard/PhaseCard/ActionCard; card templates | REQ-SBC-005, REQ-FP-D01 | /builder, 1440+390; inspect responsive card states after PO design signoff | completion-gate changed files + req:validate |
| C06 | CC-2 | TaskCard/PhaseCard/ActionCard; card templates | REQ-SBC-005, REQ-FP-D01 | /builder, 1440+390; inspect responsive card states after PO design signoff | completion-gate changed files + req:validate |
| C07 | WM-4 | card interaction hooks; shortcut/copy paste handlers; subtask form state | REQ-SBC-001, REQ-EVI-001, REQ-FCS-001, REQ-UP-012 | /builder; click/double-click/copy/paste/subtask copy behavior | completion-gate changed files + req:validate |
| C08 | WM-4 | card interaction hooks; shortcut/copy paste handlers; subtask form state | REQ-SBC-DUP-001, REQ-KEY-002, REQ-KEY-003, REQ-KEY-007 | /builder; click/double-click/copy/paste/subtask copy behavior | completion-gate changed files + req:validate |
| C09 | WM-4 | card interaction hooks; shortcut/copy paste handlers; subtask form state | REQ-SBT-COPY-001, REQ-SBC-005, REQ-KEY-002, REQ-KEY-003 | /builder; click/double-click/copy/paste/subtask copy behavior | completion-gate changed files + req:validate |
| C10 | CC-5 | src/ui/motion; effects.registry.ts; feedback/dropzone styles | REQ-IFX-001, REQ-FP-D06 | /builder with reduced motion; transitions become static/fade only | completion-gate changed files + req:validate |
| C11 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-SBC-001 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| R01 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-RDY-001, REQ-FP-CMA-001 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| R02 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-RDY-003, REQ-SBC-005, REQ-FP-CMA-001 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| R03 | CC-4 | PhaseCard/readiness UI; tooltip/aria helpers | REQ-RDY-001, REQ-FP-D11 | /builder; collapsed phase hover and screen-reader label show readiness | completion-gate changed files + req:validate |
| R04 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-RDY-001, REQ-STG-002 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| R05 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-RDY-001 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| K01 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-UP-001, REQ-UP-002, REQ-UP-003, REQ-UP-004 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| K02 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-STG-001, REQ-STG-002 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| K03 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-FP-CMA-002, REQ-SBC-003 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| K04 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-FP-CMA-003, REQ-STG-001 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| K05 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-KBI-001, REQ-FP-CMA-004, REQ-DZ-001 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| K06 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-TPL-001, REQ-FP-D04 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| K07 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-STG-001, REQ-KBI-001 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| T01 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-STG-002, REQ-VHB-001, REQ-UP-007 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| T02 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-VHB-001, REQ-UP-008, REQ-FP-D03 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| T03 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-VHB-001, REQ-SBC-005, REQ-STG-005 | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| T04 | WM-6 | Stage views; KanbanBuilderIsland; TimelineBuilderIsland; ViewHelperIsland | REQ-STG-005, REQ-DZ-001, REQ-DZ-001-RECOVERY | /builder; kanban/timeline switch, creator pills, ViewHelper in timeline | completion-gate changed files + req:validate |
| T05 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-STG-002 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| D01 | WM-2 | builder/dropzones; handleCardDrop; useCardDrag | REQ-DZ-001, REQ-DZ-001-RECOVERY | /builder; drag Phase/Action/Task; valid/invalid/drop edge behavior | completion-gate changed files + req:validate |
| D02 | WM-2 | builder/dropzones; handleCardDrop; useCardDrag | REQ-DZ-001, REQ-STG-004, REQ-STG-005 | /builder; drag Phase/Action/Task; valid/invalid/drop edge behavior | completion-gate changed files + req:validate |
| D03 | CC-5 | src/ui/motion; effects.registry.ts; feedback/dropzone styles | REQ-DZ-001, REQ-IFX-001 | /builder with reduced motion; transitions become static/fade only | completion-gate changed files + req:validate |
| D04 | WM-2 | builder/dropzones; handleCardDrop; useCardDrag | REQ-STG-004, REQ-DZ-001-RECOVERY | /builder; drag Phase/Action/Task; valid/invalid/drop edge behavior | completion-gate changed files + req:validate |
| D05 | WM-2 | builder/dropzones; handleCardDrop; useCardDrag | REQ-SBC-002, REQ-SBC-001, REQ-DZ-001 | /builder; drag Phase/Action/Task; valid/invalid/drop edge behavior | completion-gate changed files + req:validate |
| D06 | CC-5 | src/ui/motion; effects.registry.ts; feedback/dropzone styles | REQ-IFX-001, REQ-FP-D06 | /builder with reduced motion; transitions become static/fade only | completion-gate changed files + req:validate |
| S01 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-SBC-001, REQ-SBC-DES-001 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| S02 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-SBC-DES-001, REQ-KEY-005 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| S03 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-KEY-001, REQ-SBC-001 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| S04 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-KEY-002, REQ-KEY-003, REQ-SBC-DUP-001 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| S05 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-KEY-004, REQ-SBC-001 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| S06 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-KEY-006, REQ-UP-004 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| S07 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-KEY-007 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| S08 | CT-2 | src/brand/styles/tokens.css; consuming token docs | REQ-STG-003, REQ-FP-D12 | /builder, 1440; dimensions unchanged while sourced from tokens | completion-gate changed files + req:validate |
| F01 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-FCS-001, REQ-FP-D02 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| F02 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-FCS-001, REQ-FP-D02 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| F03 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-FCS-002, REQ-FP-D02 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| F04 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-FCS-001, REQ-SBC-005 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| F05 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-FCS-001, REQ-FP-CMA-003 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| F06 | WM-5 | FocusIsland; SelectionIsland; readiness selectors; keyboard shortcuts | REQ-UP-005, REQ-UP-006, REQ-UP-012 | /builder; focus filters, selection shortcuts, readiness summary visible | completion-gate changed files + req:validate |
| F07 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-FCS-001 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| L01 | WM-1 | src/hooks/useTheme.ts; HeaderUserIsland; local preference store | REQ-FP-D05, REQ-UP-009, REQ-UP-010 | /builder, 1440+390, click theme toggle; reload; theme persists | completion-gate changed files + req:validate |
| L02 | CC-6 | StageCore; BuilderIslandShell; surface classes | REQ-FP-D05, REQ-IFX-001 | /builder light theme; stage/islands no dark split-render patches | completion-gate changed files + req:validate |
| L03 | WM-1 | src/hooks/useTheme.ts; HeaderUserIsland; local preference store | REQ-UP-009, REQ-UP-010, REQ-UP-019 | /builder, 1440+390, click theme toggle; reload; theme persists | completion-gate changed files + req:validate |
| L04 | CT-2 | src/brand/styles/tokens.css; consuming token docs | REQ-FP-D12, REQ-STG-003 | /builder, 1440; dimensions unchanged while sourced from tokens | completion-gate changed files + req:validate |
| L05 | CT-1 | src/brand/styles/tokens.css; theme.css | REQ-FP-D08, REQ-IFX-001 | /builder + /home + /version, light/dark screenshots; no pure white/blue text failures | completion-gate changed files + req:validate |
| M01 | CC-5 | src/ui/motion; effects.registry.ts; feedback/dropzone styles | REQ-FP-D06, REQ-IFX-001 | /builder with reduced motion; transitions become static/fade only | completion-gate changed files + req:validate |
| M02 | CC-5 | src/ui/motion; effects.registry.ts; feedback/dropzone styles | REQ-LOAD-SKEL-001, REQ-FP-D06 | /builder with reduced motion; transitions become static/fade only | completion-gate changed files + req:validate |
| H01 | HV-1 | src/pages/home/**; app UI primitives; services/mock versions | REQ-FP-D07, REQ-UP-001, REQ-UP-004 | /home; search/filter/save view/create/select version | completion-gate changed files + req:validate |
| H02 | HV-1 | src/pages/home/**; app UI primitives; services/mock versions | REQ-FP-D07, REQ-UP-004 | /home; search/filter/save view/create/select version | completion-gate changed files + req:validate |
| H03 | HV-1 | src/pages/home/**; app UI primitives; services/mock versions | REQ-FP-D07, REQ-UP-004 | /home; search/filter/save view/create/select version | completion-gate changed files + req:validate |
| H04 | HV-1 | src/pages/home/**; app UI primitives; services/mock versions | REQ-UP-009, REQ-UP-010, REQ-UP-019, REQ-FP-D07 | /home; search/filter/save view/create/select version | completion-gate changed files + req:validate |
| H05 | HV-1 | src/pages/home/**; app UI primitives; services/mock versions | REQ-FP-D07, REQ-UP-004 | /home; search/filter/save view/create/select version | completion-gate changed files + req:validate |
| H06 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-FP-D07, REQ-LOAD-SKEL-001 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| H07 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-FP-D07 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| H08 | HV-1 | src/pages/home/**; app UI primitives; services/mock versions | REQ-FP-D07, REQ-EFP-001 | /home; search/filter/save view/create/select version | completion-gate changed files + req:validate |
| H09 | CT-1 | src/brand/styles/tokens.css; theme.css | REQ-FP-D05, REQ-FP-D08, REQ-UP-009 | /builder + /home + /version, light/dark screenshots; no pure white/blue text failures | completion-gate changed files + req:validate |
| V01 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-FP-D07, REQ-UP-004, REQ-UP-022 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V02 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-FP-D07, REQ-UP-004 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V03 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-FP-D07, REQ-UP-004 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V04 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-FP-D07, REQ-UP-004, REQ-UP-021 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V05 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-FP-D07, REQ-UP-004 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V06 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-FP-D07, REQ-STG-001, REQ-UP-004 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V07 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-EFP-001, REQ-FP-D07 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V08 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-FP-D07, REQ-UP-004 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V09 | HV-2 | src/pages/version/**; resources/version switch/status components | REQ-UP-005, REQ-UP-011, REQ-UP-012, REQ-UP-021, REQ-UP-022 | /version/:id; switch/status/resources/crew/launch builder | completion-gate changed files + req:validate |
| V10 | SK-1 | BuilderLoadingShell; Home/Version load states; skeleton primitives | REQ-LOAD-SKEL-001, REQ-FP-D07 | /builder /home /version; throttle/fixture loading; skeleton matches layout | completion-gate changed files + req:validate |
| V11 | CT-1 | src/brand/styles/tokens.css; theme.css | REQ-FP-D05, REQ-FP-D08, REQ-FP-D12 | /builder + /home + /version, light/dark screenshots; no pure white/blue text failures | completion-gate changed files + req:validate |

Cross-surface policy rows from FP-R4:

| Policy | Sprint | Graph IDs | PO Web Check |
|---|---|---|---|
| Builder shell/stage/cards/editor/focus skeleton policy | SK-1 | `REQ-LOAD-SKEL-001`, `REQ-EVI-001`, `REQ-STG-001`, `REQ-SBC-001` | `/builder` loading fixture |
| Homepage skeleton policy | SK-1 | `REQ-LOAD-SKEL-001`, `REQ-FP-D07`, `REQ-UP-009` | `/home` loading fixture |
| Version page skeleton policy | SK-1 | `REQ-LOAD-SKEL-001`, `REQ-FP-D07`, `REQ-EFP-001`, `REQ-UP-004` | `/version/:id` loading fixture |
| Reduced-motion skeleton policy | CC-5 + SK-1 | `REQ-LOAD-SKEL-001`, `REQ-FP-D06`, `REQ-IFX-001` | reduced-motion emulation on all three routes |

No row is `backend-deferred`. Backend integration may add a quick sprint later, but all frontend polish targets currently have a frontend sprint and a PO-visible check.

## Metrics Summary

Metrics are rewritten in `output/metrics-baseline.md`. Key FP-R5 baselines:

| Metric | Baseline |
|---|---:|
| Explicit FP-R4 criterion rows | 84 |
| Cross-surface skeleton policy rows | 4 |
| Builder rows | 64 |
| Home rows | 9 |
| Version rows | 11 |
| Family rows: `wire-mockup-data` / `change-component` / `change-token` | 49 / 29 / 6 |
| Frontend requirements delivery-confirmed implemented / verified | 0 / 0 per RS-R11 |
| Hardcoded-token script arbitrary Tailwind baseline | 108 |
| Pure-white token offenders | 2 + shadcn light background |
| Over-hard-cap files | 1 |
| Open PO decisions | 0 |

## Plan Close Recommendation

After audit of this FP-R5 output, the PO should move `frontend-polish-v0.3.5` to `completed/` and create `docs/plans/drafted/frontend-polish-implementation-v0.3.x/` from the sprint set above. That drafted implementation plan must be audited before activation. First implementation sprint should be WM-1 because CT-1 light-theme verification depends on a working theme toggle.

---

## FP-R5 PATCH — 2026-06-30 (Claude): ledger amendment for FP-R4 patch + live-confirmation

Amends the ledger/metrics for the 4 criteria added by the FP-R4 patch (logs 011/012/013). Adds to — does not replace — the ledger above.

### Coverage Ledger additions
| Criterion | Sprint | Graph IDs | PO Web Check | Graph gate |
|---|---|---|---|---|
| T06 (timeline day-card quick-create) | WM-6 | REQ-BC-007, REQ-BC-008 | /builder Timeline; create task from a day card; quick-create popup appears | completion-gate + req:validate |
| T07 (timeline task parent + minimal data) | WM-6 | REQ-BC-009, REQ-BC-010 | /builder Timeline; created task nests under/creates phase/action; minimal data then complete | completion-gate + req:validate |
| L06 (app-wide typography tokens) | CT-1 | REQ-FP-D08, REQ-FP-D01 | /builder+/home+/version; computed font-size sourced from text-dcx tokens, no arbitrary sizes | completion-gate + req:validate |
| K08 (bounded-height/internal column scroll; no scroll wall) | WM-6 | REQ-STG-001, REQ-STG-004, REQ-FP-CMA-002 | /builder; dense phase scrolls internally; 7–8 phases fit; edge-scroll preserves drag | completion-gate + req:validate |

No row is `backend-deferred`.

### Revised counts
- Explicit criterion rows: **84 → 88** (+T06, T07, K08, L06).
- Surfaces: builder 64→67, home 9, version 11, +1 cross-cutting (L06).
- Sprint set unchanged (WM-6 absorbs T06/T07/K08; CT-1 absorbs L06) — still **17 named sprints + CC-OPT**
  (corrects the earlier "16" headline tally).

### Live-confirmation (logs 012/013) — affects acceptance, not scope
- D-series drag + E04 drag-to-editor are **live-confirmed working** (supersedes FP-R0 "inert"). The
  WM-2/WM-3 acceptance should verify *refinement*, not build-from-inert.
- Every implementation sprint's PO Web Check MUST use **real pointer/drag** (not `.click()`); add
  `data-testid` hooks. Open real-pointer items: off-stage/edge-scroll drag, timeline task→day drop.
