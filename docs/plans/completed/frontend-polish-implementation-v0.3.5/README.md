---
plan: frontend-polish-implementation-v0.3.5
status: completed
completed: 2026-07-01 (PO directed close — all substantive sprints delivered, gates green on live tree; remaining polish + CC-OPT descoped to custom tasks)
version_context: v0.3.5
created: 2026-06-30
author: Claude (claude-opus-4-8) — scaffolded from FP-R5 at PO direction
prior-art: completed/frontend-polish-v0.3.5 (FP-R0..R5 discovery + RS-R11 reground brief), completed/requirements-system
sprint-spec-source: docs/plans/completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md (+ FP-R5 PATCH), FP-R4-finalize-spec.md (+ FP-R4 PATCH)
executor: per-sprint by skill/tool access (see Executor assignment discipline)
feeds-into: implementation (no further discovery)
---

# Plan: Front-End Polish IMPLEMENTATION (v0.3.5)

## Status: ✅ COMPLETED (2026-07-01) — all 22 substantive sprints delivered; live-tree gates green; moved to `docs/plans/completed/`. PO-directed close (`core.md §24/§29 plan level`).

> ### Plan Close summary (2026-07-01, Claude/claude-opus-4-8 — PO `tech@dotment.com` directed)
>
> **Closing level:** Plan (`dcx-sprint-close` §0 — every sprint closed + README→completed + folder moved).
>
> **Sprint disposition (23 files):**
> - **22 delivered ✅** — WM-1·2·3·4·5·6, CT-1·2·3, SK-1, OA-1, CC-1·2·3·4·5·6·7, HV-1·2·3·4.
> - **1 not a deliverable** — `CC-OPT` was opportunistic-only (runs only if a sprint touches an
>   over-target file; never triggered — CC-1 already brought the one hard-cap file under target).
>   Closed `NOT TRIGGERED`, descoped to custom tasks.
>
> **Header reconciliation (the real work of this close):** six sprint-file headers were **stale** and
> contradicted their own verified `output/` + review records. The PO flagged this; verification confirmed
> the headers were wrong, not the work:
> | Sprint | Stale header | Verified truth |
> |---|---|---|
> | WM-4 | Drafted | Completed — review PASS (`…WM-4-review.md`) |
> | WM-5 | Drafted | Completed — review PASS (`…WM-5-review.md`) |
> | WM-6 | In Progress | Completed — round-2 fixes verified PASS 5/6 (`043-…`); Fix-2 density PO-confirmed at close |
> | HV-3 | Drafted | Completed — round-2 audit PASS, 4/4 fixes (`046-…`) |
> | HV-4 | Drafted | Completed — output PASS, 3-viewport proof |
> | CC-OPT | Drafted | Closed NOT TRIGGERED (opportunistic) |
>
> **Live-tree gates at close (re-run 2026-07-01, not trusted from history):** typecheck ✅ · lint ✅ (0 warn)
> · test ✅ **85/85** · validate:architecture ✅ **298 modules, 0 violations** · `req:validate` ✅ (0 errors,
> 0 warnings) · production `build` ✅ (2393 modules) · version consistency ✅ (v0.3.5 across VERSION/pkg/metadata).
>
> **Descoped to the custom-task backlog (PO directive — "remaining polish handled as custom tasks"):**
> CC-OPT; WM-4 doc-debt (retract WM-3 E02 TRC); FL-HV1-01/02, FL-HV2-01..06, FL-HV3-01/02 follow-up flags;
> the per-sprint real-pointer PO Web Checks still marked PENDING/§28 (CC-3, CC-5, CC-6, CC-7, OA-1, WM-2/3,
> WM-6 density). These are polish/governance-cleanup items, not blockers — version stays v0.3.5.
>
> **Known non-blocking carry-out:** `req:completion-gate` is a per-change tool (needs `--changed`), already
> run green per-sprint; not a plan-level gate. `verify-plan-state.sh` reports a pre-existing unrelated
> mismatch on `completed/builder-refactor` (stale status word) — not introduced here.

## Status (historical): 🟢 ACTIVE — PO activated after `dcx-plan-audit` READY (`core.md §24/§34`)

This is the **implementation** plan that executes the graph-grounded discovery. Its sprint set, family
routing, Implementation Coverage Ledger, PO Web Checks, and Requirement Debt Burn-down are defined in
the authoritative source: **`completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md`** (with the
2026-06-30 FP-R5 PATCH) and the **FP-R4 finalize spec** (88 criteria after patch). Each sprint file
here carries its Requirement Trace + key fields and cites the FP-R5 section for full detail.

> **No version change** (`core.md §26`): version stays `v0.3.5`. This plan does not bump or suggest a
> version change.

### Lifecycle gate
- `dcx-plan-audit` returned **READY** on 2026-06-30 (`audit/2026-06-30-codex-reaudit.md`); PO activated and moved the plan to `active/` on 2026-06-30.
- Resolve **G-IMPECCABLE** (root `CLAUDE.md` QUARANTINED vs `agent-skills.md` enabled) **before** the
  first `change-token` sprint (CT-1). Discovery already cleared; this is pre-implementation.

---

## Executor assignment discipline (carried from discovery — assign ONLY to a capable agent)

| Family | Required skill | Required tool | Eligible executor | Never |
|---|---|---|---|---|
| `change-token` | `impeccable` (brand-only, if G-IMPECCABLE cleared; else direct brand-contract application) | Playwright/Preview for light-theme proof | **Claude** | components, logic, services |
| `change-component` | `dcx-frontend-refactor` | Playwright/Preview if criterion is browser/visual | Claude / opencode / Codex when Playwright MCP is active and required skill is available | brand identity, new features |
| `wire-mockup-data` | — | Playwright/Preview for behavior proof | Claude / opencode / Codex when Playwright MCP is active | visual redesign, new features |

**Hard rules:** (1) Browser/visual criteria on Codex require `playwright_mcp: available` in Step 0; otherwise use §29a handoff. (2) **PO Web Checks + E2E MUST use
REAL pointer/drag** — builder cards are pointer/long-press/drag driven; `.click()` does not trigger them
(proven live 2026-06-30). Add `data-testid` hooks during implementation. (3) Every sprint carries the
mandatory **Requirement Trace** (`core.md §35a`). (4) Every sprint closes only after **Requirement Debt
Burn-down** + `req:completion-gate --changed <files>` + `req:validate`.

---

## Sprint Index & execution order (token-first; WM-1 first)

```
WM-1 → CT-1 → CT-2 → CT-3 → SK-1 → CC-1 → CC-2 → OA-1 → CC-7 → CC-3 → CC-4 → CC-5 → CC-6
     → WM-2 → WM-3 → WM-4 → WM-5 → WM-6 → HV-1 → HV-2     (+ CC-OPT opportunistic)
```
> CC-2 scope was tightened (PO 2026-06-30): cards + unified 80%/10% card-height model only. **OA-1** (new)
> owns the overflow-awareness gradient fades spun out of CC-2; skeleton state/tiered work deferred to a SK-1
> follow-up; `REQ-COG-AWARE-001` folded into REQ-FP-CMA-003 + readiness (no new node).

| # | Sprint | Title | Family | Eligible executor |
|---|---|---|---|---|
| 1 | WM-1 | Theme toggle + local preference foundation ✅ | wire-mockup-data | Claude/opencode |
| 2 | CT-1 | Brand light/dark token corrections (+ app-wide typography L06) ✅ | change-token | Claude |
| 3 | CT-2 | Structural dimension tokens ✅ | change-token | Claude |
| 3.5 | **CT-3** | **Responsive layout: fluid dim tokens + builder viewport scaling 14″→85″ (REQ-RESP-001)** | change-token + change-component | Claude/opencode |
| 4 | SK-1 | App-wide skeleton loading (skeletons re-align to responsive geometry from CT-3/HV) | change-component | Claude/opencode |
| 5 | CC-1 | Editor state hard-cap split | change-component | any (Codex ok — no browser) |
| 6 | CC-2 | Responsive shared cards + unified 80%/10% card-height model (scope tightened 2026-06-30) | change-component | Claude/opencode |
| 6.5 | **OA-1** | **Overflow/spatial-awareness gradient fades ✅ (actions+tasks done; stage→phase still deferred to CC-6/WM-6)** | change-component | Claude/opencode |
| 6.6 | **CC-7** | **Compact action-card density — ~3 collapsed actions fit a phase (REQ-DENSITY-001) ✅** | change-component | Claude |
| 7 | CC-3 | Editor component fixes (enable-on-select, routing single-column) ✅ (code+gates; interactive PO Web Check BLOCKED §28) | change-component | Claude/opencode |
| 8 | CC-4 | Readiness accessibility (tooltip + aria) ✅ (code+gates+live a11y proof) | change-component | Claude/opencode |
| 9 | CC-5 | Motion + interaction feedback (reduced-motion) | change-component | Claude/opencode |
| 10 | CC-6 | Stage + island light surfaces | change-component | Claude/opencode |
| 11 | WM-2 | Typed drag/drop engine (refine — drag live-confirmed) | wire-mockup-data | Claude/opencode |
| 12 | WM-3 | Editor open paths + sessions | wire-mockup-data | Claude/opencode |
| 13 | WM-4 | Card interactions + card/subtask copy-paste | wire-mockup-data | Claude/opencode |
| 14 | WM-5 | Focus / selection / keyboard / readiness wiring | wire-mockup-data | Claude/opencode |
| 15 | WM-6 | Stage views / Kanban / Timeline / ViewHelper + day-card create (T06/T07) + scroll (K08) | wire-mockup-data | Claude/opencode |
| 16 | HV-1 | Homepage operational dashboard ✅ — **discovery-grounded**: spec [`tasks/HV-1-home-spec.md`](tasks/HV-1-home-spec.md) + components [`tasks/HV-1-HV-2-component-signoff.md`](tasks/HV-1-HV-2-component-signoff.md) §1; decisions D-1/D-2/D-3/D-6/D-7 resolved; `REQ-HOME-*` proposed + applied; REQ-VER-ROOM supersedes REQ-VR-001 | change-component + wire-mockup-data | Claude/opencode |
| 17 | HV-2 | Version workspace ✅ — **discovery-grounded**: spec [`tasks/HV-2-version-spec.md`](tasks/HV-2-version-spec.md) + components [`tasks/HV-1-HV-2-component-signoff.md`](tasks/HV-1-HV-2-component-signoff.md) §2; D-1/D-4/D-5 resolved; REQ-VER-ROOM confirmed; 7 REQ-VER-* proposed+implemented | change-component + wire-mockup-data | Claude/opencode |
| — | CC-OPT | Opportunistic file-size cleanup (only when touching an over-target file) | change-component | any w/ dcx-frontend-refactor |

Coverage: all **88 FP-R4 criteria** map 1:1 to a sprint (FP-R5 Implementation Coverage Ledger + PATCH). No `backend-deferred` rows.

> **HV-1 / HV-2 discovery (2026-06-30).** The two page sprints were deepened beyond the FP-R5 brief with
> a PO-led functional spec + per-page component plan, captured as **non-sprint supporting tasks** (see
> below). They carry: the full page composition, a **requirement-coverage map** (existing graph IDs vs
> gaps), **22 staged `REQ-HOME-*`/`REQ-VER-*` candidates** (14 Home + 8 Version; not yet in the graph — proposed at sprint
> time per `§35b`), and **5 resolved PO decisions** (D-1…D-5). Net effects on the plan: (a) clicking a
> version opens a **Version room** before the builder, which **supersedes canonical `REQ-VR-001`**;
> (b) HV component creation is **gated by per-component PO sign-off**; (c) two items are **backend/
> future-deferred** (live read-only builder preview; the client/project endpoint). Each sprint's
> *Discovery findings* section restates this locally; the specs are authoritative for page specifics.

---

## Supporting tasks (non-sprint)

These are PO-facing deliverables that support the sprint set but are **not sprints** themselves
(no acceptance set, no gates, no `output/` entry — `core.md §25/§29`). They live in `tasks/`.

| Task | Type | Status | Feeds | Doc |
|---|---|---|---|---|---|
| HV component plan & sign-off | Pre-build component inventory + PO sign-off | 🟢 **SIGNED OFF** (PO 2026-06-30) | HV-1, HV-2 | [`tasks/HV-1-HV-2-component-signoff.md`](tasks/HV-1-HV-2-component-signoff.md) |
| Home page functional spec | PO spec + requirement coverage map + 14 gap candidates | 🟢 **D-1/D-2/D-3/D-6/D-7 all resolved** | HV-1 | [`tasks/HV-1-home-spec.md`](tasks/HV-1-home-spec.md) |
| Version page functional spec | PO spec + requirement coverage map + 8 gap candidates (supersedes `REQ-VR-001`) | 🟢 **decisions resolved** (D-1, D-4, D-5; endpoint = backend-deferred) | HV-2 | [`tasks/HV-2-version-spec.md`](tasks/HV-2-version-spec.md) |

> Origin: Codex/GPT-5 discovery-only support note (2026-06-30), relocated out of `output/` and
> solidified into a per-page, component-by-component sign-off sheet. **HV-1 and HV-2 are blocked from
> creating any new Home/Version component until its row is PO-Approved in that doc.**
>
> **Codex audit round 1** (`output-review/2026-06-30-codex-HV-1-HV-2-discovery-review.md`, NEEDS REVISION): addressed — route `/`, shared `PageBrandBlock`/`PageUserBlock`, `useBuilderTreeQuery` data-only source, graph-authority caveats, D-6/D-7 raised, planning logged.
> **Codex audit round 2** (`output-review/2026-06-30-codex-HV-1-HV-2-discovery-reaudit.md`, NEEDS TARGETED REVISION): addressed —
> (P1) ordering deadlock fixed: **`REQ-VER-ROOM` is proposed + applied in HV-1 Step 0** before Home card→version nav;
> (P1) Home "Active" normalized to **Active DCXs** (derived status), not versions;
> (P1) **D-6/D-7 added to the sign-off block** — `status: SIGNED OFF` invalid until resolved;
> (P2) stale D-status summaries + HV-2 "mini-preview" language cleaned (now branded launch + structure summary, `REQ-VER-LAUNCH`);
> (P3) candidate count corrected to **22**. Revisions logged at `docs/progress/sessions/2026-06-30-claude/036-…md` + `037-…md`.

---

## Definition of Done (plan) — verdict at close 2026-07-01
- [x] Every sprint executed, each with Requirement Trace + Requirement Debt Burn-down + `req:completion-gate` (per-change) + `req:validate`. **Met** for all 22 substantive sprints (CC-OPT was opportunistic, not a deliverable). ⚠ *Partial on one clause:* several **real-pointer/drag PO Web Checks** remain PENDING/§28-fallback (CC-3, CC-5, CC-6, CC-7, OA-1, WM-2/3, WM-6 monthly density) — accepted by PO as documented debt, descoped to custom tasks (they need a populated mock + reliable shared-port preview, not code).
- [x] All 88 FP-R4 criteria `delivery: implemented`. **Met** (`req:validate` clean). ⚠ The acceptance-bound `verified` upgrade is gated on the PENDING real-pointer checks above for the affected criteria — carried to custom tasks; does not block close per PO direction.
- [x] Brand contract honored (no pure white/black; main-blue-on-light; `text-dcx-*` typography; glass density variants). **Met** (CT-1/CT-2/CT-3 + HV-3/HV-4; lint/build green).
- [x] Builder layout contract preserved (`core.md §10`); no builder-internal imports in Home/Version (`§13`). **Met** (validate:architecture 298 modules, 0 violations; HV-3/HV-4 §13 grep clean).
- [x] Touched RS-R7 candidate links confirmed/corrected/rejected; no silent unlinked manifestations (`§35d`). **Met** (`req:validate` 0 errors/0 warnings; per-sprint burn-downs recorded in carry-forward).
- [x] All gates green; carry-forward kept current (`§27`). **Met** — live-tree re-run at close: typecheck/lint/test 85/build/architecture/`req:validate` all green; carry-forward updated below.

---

## Carry-forward contract (READ in every Step 0; UPDATE in every final step — `core.md §27`)

### Canonical homes (from discovery FP-R1/R2/R3 + folder-structure-v2)
| Concern | Home |
|---|---|
| Theme/color tokens | `src/brand/styles/tokens.css` (`--theme-*`); typography `theme.css` (`text-dcx-*`) |
| Mock data seam | `src/services/api-client.ts → mock-dispatch.ts → src/services/mock/*` (frontend runs on mocks) |
| Cards/islands/stage | `src/builder/**` (BuilderIslandShell, StageProvider, useBuilderActions, GlassSurface — reuse) |
| Readiness | `rules/readiness.rules.ts` via `useCardBehavior` (never compute in UI) |

### Binding facts inherited
- **Responsiveness is a requirement (`REQ-RESP-001`, PO 2026-06-30) — NOT fixed-px.** Builder scales fluidly
  across desktop-class screens **14″ MacBook (~1280–1512px) → 85″ TV (4K ~3840px)**; **Home/Version also
  responsive on mobile + tablet** (builder is desktop-and-bigger only). **Reconciliation:** this does NOT
  contradict `§10` (which freezes the three-row **structure**, not pixel sizing) or `§21` (a density floor +
  ≤260px column cap, not a fixed width). CT-3 makes CT-2's `--dim-*` tokens fluid; HV-1/HV-2 add mobile/tablet.
  The earlier "fixed-1440" framing was a discovery misread, now corrected. `text-dcx-*` typography also scales.
- **Live-confirmed working (2026-06-30):** stage render @1440, create phase/action/task, 8-phase density
  with no horizontal scroll, expand/collapse (72↔260), selection→SelectionIsland, Focus island,
  task-creation channel flow, **drag-to-editor + action/task rearrangement drops**. → WM-2/WM-3 are
  *refinement*, not build-from-inert. FP-R0's "drag inert" is superseded.
- **Pointer-driven UI:** verification MUST use real pointer/drag; add `data-testid` hooks.
- **0 frontend reqs delivery-confirmed** at start (RS-R11): each sprint moves its touched reqs toward
  implemented→verified and burns down RS-R7 candidate-link debt for its area.
- **Open real-pointer items** (WM-2 ✅ edge-scroll done; WM-6): timeline task→day drop.
- **Known fix:** routing/endpoint fields truncate at editor width (CC-3 / E07/D10).
- Mocks live at `src/services/mock/` (`builder.mock.ts`, `versions.mock.ts`), version id `v-1`.

### Update obligation
Each sprint's final step appends: files touched, REQ/EMC/MAN/TRC touched, before/after debt counts,
gate results, PO Web Check evidence path. A sprint is not closeable until this is written.

### Completed sprint carry-forward — WM-3 (2026-06-30)
- Output: `output/WM-3-editor-open-paths-sessions.md`
- Files touched: `src/builder/cards/templates/action/ActionCard.tsx`; `src/builder/cards/templates/action/useActionCard.ts`; `output/WM-2-drag-drop-engine.md` (evidence claim fix); 2 TRC JSON files.
- **Key fix (E02):** ActionCard had no `onLongPress` hook — action long-press did not open the editor. Fixed: `useActionCard` now exposes `setFocusedNodeId` from `useStageContext()`; `ActionCard` passes `onLongPress={() => setFocusedNodeId(action.id)}` to `CardShell`. Action long-press now opens `EditorViewerIsland` with action context at 400ms/8px threshold (matching E01 task path).
- **Pre-existing (no change needed):** E01 task long-press ✅, E04 drag-to-editor ✅, E05 multi-session pills ✅, E06 dirty-close guard ✅ — all implemented in CC-1/CC-3.
- Requirement trace touched: `REQ-EVI-001`, `REQ-SBC-004`; new TRC `TRC-WM3-REQ-EVI-001-TO-MAN-react-component-src-builder-cards-templates-action-actioncard` (confirmed); confirmed `TRC-RS-R7-REQ-SBC-002-TO-MAN-...-actioncard`.
- Debt burn-down: changed-scope unlinked 1→0; candidate links 1→0.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(274) ✅, `req:validate` ✅, `req:completion-gate --changed` ✅ PASS.
- PO Web Check (action long-press real pointer): BLOCKED §28 — batch with WM-2 drag-glow/edge-scroll when Playwright/preview server is reliable.

### Completed sprint carry-forward — WM-2 (2026-06-30)
- Output: `output/WM-2-drag-drop-engine.md`
- Files touched: `src/builder/stage/views/KanbanView.tsx`; `src/builder/stage/views/useKanbanInteraction.ts`; `src/builder/cards/CardShell.tsx`; `src/builder/dropzones/DropTarget.tsx`; 2 TRC link JSON files.
- **Key fix:** `activeDrag` was hardcoded `null` in `KanbanView` — dropzones never activated. Now derived from `useStageContext()` (`isDragging`, `draggedNodeKind`, `draggedNodeId`). Dropzones correctly go `active=true` and show `dropTargetGlow` during compatible drags.
- **Edge-scroll:** `scrollKanbanEdge` helper + RAF loop in `useKanbanInteraction` scrolls `#kanban-scroller` when pointer is within 120px of left/right edge during drag (up to 18px/frame). Tears down on `isDragging=false`.
- **`data-testid` hooks added:** `card-{kind}-{id}` (CardShell), `drop-target-{zone.id}` (DropTarget), `kanban-phase-column-{phase.id}` (KanbanView column sections).
- Requirement trace touched: `REQ-DZ-001`, `REQ-SBC-001`; new TRCs `TRC-WM2-REQ-DZ-001-TO-MAN-hook-usekanbaninteraction`, `TRC-WM2-REQ-SBC-001-TO-MAN-react-component-cardshell`.
- Debt burn-down: changed-scope `manifestationsLackingRequirements` 2→0; global requirements lacking manifestations 252→251.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(274) ✅, `req:validate` ✅ (QST-VR-011 pre-existing), `req:completion-gate --changed` ✅ PASS.
- Browser evidence: port 3000, 0 errors, 8 phase cards `draggable=true`, 13 drop targets at rest `data-active=false`, `#kanban-scroller` present. PO Web Check (real-pointer drag) PENDING.

### Completed sprint carry-forward — WM-1 (2026-06-30)
- Output: `output/WM-1-theme-toggle.md`
- Files touched: `src/hooks/useTheme.ts`; `src/hooks/theme.test.ts`; `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx`; `src/builder/BuilderPage.tsx`; WM-1 trace links; `MAN-test-src-hooks-theme-test`; decision ledger.
- Requirement trace touched: `REQ-FP-D05`, `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019`; manifestations `MAN-hook-src-hooks-usetheme`, `MAN-test-src-hooks-theme-test`, `MAN-react-component-src-builder-islands-headeruserisland-headeruserisland`, `MAN-react-component-src-builder-builderpage`.
- Debt burn-down: changed-scope unlinked manifestations went from 3 to 0; final reconcile detectors reported 0 `manifestationsLackingRequirements` and 0 `testsDisconnected`. One non-blocking candidate remains queued for `BuilderPage` -> `REQ-VR-001` from route-name similarity.
- Gates: typecheck, targeted test, lint, full test, architecture, `verify.sh`, `req:folder-index`, `req:validate`, changed-scope reconcile, and product-file completion gate passed. `req:validate` still carries existing warning `QST-VR-011`.
- Browser evidence: `output/evidence/WM-1-theme-toggle/desktop-light-persisted.png` and `output/evidence/WM-1-theme-toggle/mobile-dark-persisted.png`; Playwright normal pointer clicks confirmed theme persistence across reload at 1440x900 and 390x844.

### Completed sprint carry-forward — CC-1 (2026-06-30)
- Output: `output/CC-1-editor-split.md` (Claude/claude-sonnet-4-6).
- Files touched: `src/builder/islands/EditorViewerIsland/useEditorState.ts` (375→168 lines); `src/builder/islands/EditorViewerIsland/editor-node.helpers.ts` (new, 76 lines — DayNode/EditorNode types + pure helpers); `src/builder/islands/EditorViewerIsland/useDraftReducer.ts` (new, 21 lines — DraftState/DraftAction/draftReducer); `src/builder/islands/EditorViewerIsland/useEditorDragHandlers.ts` (new, 46 lines — drag state + handlers); `src/builder/islands/EditorViewerIsland/useEditorSessionManager.ts` (new, 63 lines — session close/discard lifecycle); `src/builder/islands/EditorViewerIsland/useEditorReadiness.ts` (import updated to `./editor-node.helpers`).
- REQ graph changes: 4 new MAN nodes; 5 TRC-CC1-REQ-EVI-001 links created. `REQ-EVI-001` delivery unchanged (partial — editor full wiring continues in CC-3).
- **Canonical homes (reuse):** EditorViewerIsland sub-modules live at `src/builder/islands/EditorViewerIsland/`. Public hook facade is `useEditorState.ts`; do not import sub-modules directly from outside the island. `DayNode`/`EditorNode` types: import from `./editor-node.helpers` within the island, or via re-export from `./useEditorState` outside.
- Files over hard cap: 1 → 0.
- Debt burn-down: changed-scope manifestationsLackingRequirements 5 → 0; completion gate ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(82) ✅ (no targeted test exists for useEditorState), architecture(271 modules) ✅, `req:validate` ✅, `req:completion-gate --changed` ✅.
- Browser evidence: `output/evidence/CC-1-editor-split/builder-1440-editor-split.png`; Playwright smoke — builder loads, no JS errors, phase selection + SelectionIsland intact.

### Completed sprint carry-forward — CC-2 (2026-06-30)
- Output: `output/CC-2-card-responsive.md` (Claude/claude-sonnet-4-6). Design checkpoint: `output/CC-2-design-checkpoint.md` (v4, PO resolved 2026-06-30 via audit). Audit brief: `output-review/2026-06-30-claude-CC-2-design-checkpoint-review.md`.
- Files touched: `src/brand/styles/tokens.css` (+`--dim-card-height-pct: 80%`); `src/brand/styles/components.css` (skeleton contrast 4-9% → 10-22% dark, 4-8% → 7-14% light); `src/builder/cards/templates/task/TaskCard.tsx` (unified `h-[60px]`, `px-1.5`/`px-2.5 py-1.5`); `src/builder/cards/CardShell.tsx` (selected→scrollIntoView for task kind); `src/builder/cards/templates/action/ActionCard.tsx` (remove `max-w-[200px]`); `src/builder/cards/templates/phase/HorizontalTaskFlow.tsx` (`gap-2`, expanded task `w-[calc(100%-1rem)] mx-2`, text-only empty state); `src/builder/cards/templates/phase/TaskBentoGrid.tsx` (remove `max-h-[300px] overflow-y-auto`, text-only empty state); `src/builder/cards/templates/phase/PhaseCard.tsx` (80%/10% wrapper both branches, "No actions yet" empty state); `src/builder/stage/views/DayGridCard.tsx` (`h-[480px]` → `h-[var(--dim-card-height-pct)]` weekly); `src/builder/stage/views/DayGridCardCollapsed.tsx` (same); `src/builder/stage/views/WeeklyView.tsx` (`min-h-full` → `h-full`, `flex gap-4 h-full items-center` for day card height context).
- REQ graph: no new MAN/TRC nodes required (all touched files had existing manifestations; skeleton/DayCard height are implementation changes traced to REQ-RESP-001 + REQ-SBC-003 family).
- **Carry-forward to next sprints:** overflow gradient fades (`useScrollEdge`) → **OA-1**; skeleton `state`/tiered loading → **SK-1b**; KanbanView stage horizontal overflow + magnetic snap → **CC-6/WM-6**.
- **Canonical homes (reuse):** `--dim-card-height-pct` token defined once in `tokens.css`; use it in any card needing 80% stage-height sizing. Do NOT hardcode fixed `h-[480px]` for any new stage card.
- Gates: typecheck ✅, lint ✅, test(82) ✅, architecture(271 modules) ✅, `req:validate` ✅ (QST-VR-011 pre-existing), `req:completion-gate --changed` ✅.
- Browser evidence: `output/evidence/CC-2-card-responsive/`; Preview MCP — phase cards at 80% stage height with 10% margins (both collapsed + expanded), "No tasks yet" text-only empty state, action names no longer truncated.

### Completed sprint carry-forward — SK-1 (2026-06-30)
- Output: `output/SK-1-skeletons.md` (Claude/claude-sonnet-4-6).
- Files touched: `src/brand/styles/components.css` (global `.skeleton-block` / `.skeleton-block-light` + `@media prefers-reduced-motion`); `src/ui/skeleton/SkeletonBlock.tsx` (new shared primitive); `src/builder/BuilderLoadingShell.tsx` (inline `<style>` removed, uses SkeletonBlock); `src/pages/home/HomeLoadingSkeleton.tsx` (new); `src/pages/home/HomePage.tsx` (renders skeleton); `src/pages/version/VersionLoadingSkeleton.tsx` (new); `src/pages/version/VersionPage.tsx` (renders skeleton).
- REQ graph changes: `REQ-LOAD-SKEL-001` `delivery: not-assessed → implemented`; both orphaned proposals archived to `proposals/applied/`.
- **Canonical homes (reuse):** Skeleton primitive lives at `src/ui/skeleton/SkeletonBlock.tsx`; shimmer CSS in `src/brand/styles/components.css`. Use `surface="light"` for Home/Version, `surface="dark"` for Builder. Do not inline `@keyframes shimmer` elsewhere.
- **Reduced-motion:** `@media (prefers-reduced-motion: reduce)` sets `animation: none` on both skeleton classes. No inline overrides needed.
- Debt burn-down: proposals orphan queue 2 → 0; no new manifestationsLackingRequirements; completion gate ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(82) ✅ (no targeted skeleton test exists), architecture(267 modules) ✅, `req:validate` ✅, `req:completion-gate --changed` ✅.
- Browser evidence: `output/evidence/SK-1-skeletons/` — home-skeleton-1440, version-skeleton-1440, builder-skeleton-1440 at 1440×900.

### Completed sprint carry-forward — CT-2 (2026-06-30)
- Output: `output/CT-2-structural-tokens.md` (Claude/claude-sonnet-4-6). G-IMPECCABLE: direct brand-contract route (same as CT-1).
- Files touched: `src/brand/styles/tokens.css` (6 `--dim-*` tokens added); `src/builder/BuilderPage.tsx`; `src/builder/BuilderLoadingShell.tsx`; `src/builder/stage/views/KanbanView.tsx`; `src/builder/stage/views/DayGridCard.tsx`; `src/builder/islands/SelectionIsland/SelectionIsland.tsx`.
- Requirement trace touched: `REQ-FP-D12`, `REQ-STG-003`, `REQ-SBC-003`, `REQ-FP-D11`; EMC categories `EMC-STG-SEED`, `EMC-SBC-SEED` covered by token definitions.
- **New tokens (consume, don't redefine):** `--dim-phase-collapsed: 4.5rem` / `--dim-phase-expanded: 260px` / `--dim-editor-width: 25rem` / `--dim-builder-header: 64px` / `--dim-builder-footer: 76px` / `--dim-selection-max-width: 420px`. All theme-agnostic (defined once in `:root`).
- **Editor width note:** token is `25rem` (matches current code `w-[25rem]`); FP-R5 cites 382px — discrepancy noted, no value changed per sprint scope.
- Debt burn-down: no new manifestationsLackingRequirements; completion gate PASS; `req:validate` PASS (QST-VR-011 pre-existing).
- Gates: typecheck ✅, lint ✅, test(82) ✅, architecture ✅, `req:folder-index`(784) ✅, `req:validate` ✅, `req:completion-gate --changed` ✅.
- Browser evidence: `output/evidence/CT-2-structural-tokens/builder-1440-token-sourced.png`; Playwright computed values confirm all dimensions token-sourced at 1440×900; no visual diff.

### Completed sprint carry-forward — CT-1 (2026-06-30)
- Output: `output/CT-1-theme-tokens.md` (Claude/claude-opus-4-8). **G-IMPECCABLE resolved as: direct brand-contract route selected and logged** (impeccable not invoked). PO follow-up flagged: reconcile root `CLAUDE.md` (QUARANTINED) vs `docs/agent-skills.md` (enabled brand-only).
- Files touched: `src/brand/styles/tokens.css`; `src/brand/styles/components.css`; `src/ui/shadcn/button.tsx`; new MAN nodes `MAN-function-src-brand-styles-tokens`, `MAN-function-src-brand-styles-components`; 4 `TRC-CT1-*` links; decision ledger `LDG-2026-06-30-CT-1-brand-token-trace`.
- **Canonical homes confirmed (reuse, don't recreate):** theme/color + `--text-*` font tokens live in `src/brand/styles/tokens.css` (light `:root`, dark `.dark`); `text-dcx-*` mapping in `theme.css`; app-shell/placeholder/eyebrow component CSS in `components.css`.
- **New tokens added (consume, don't redefine):** `--theme-text-secondary` (light `rgba(21,21,22,0.82)` / dark `rgba(247,247,248,0.82)`); `--theme-accent-text` = contrast-safe brand-blue foreground (light `#006080` / dark `#75E2FF`) — **use `--theme-accent-text` for brand-blue text on theme-aware/light surfaces; keep `--theme-accent` (#75E2FF) for builder dark-glass surfaces and glows/borders.**
- **Pure-white removed:** light `--theme-surface-void`/`--theme-dropdown-bg` now `#FDFDFB`; shadcn `--background`/`--card`/`--popover` now near-white oklch (not `oklch(1 0 0)`). Do not reintroduce `#FFFFFF`/`oklch(1 0 0)` as a token surface.
- **L06:** 0 arbitrary font sizes outside `src/brand` (`button.tsx` now `text-dcx-md-plus`). Named Tailwind `text-xs/sm` utilities NOT migrated — that needs design-exploration + PO sign-off per REQ-FP-D01 (out of CT-1).
- **CT-2 note:** `--theme-surface-deep-alt`, `--theme-surface-dark` already exist; CT-2 dimension tokens (REQ-FP-D12: 72/260/382/64/76px) are the queued candidate `tokens.css→REQ-FP-D12` left for CT-2 to confirm.
- Debt burn-down: changed-scope `manifestationsLackingRequirements` 2→0; pure-white token surfaces 5→0; `--theme-text-secondary` 0→2; arbitrary font sizes 1→0. Completion gate FAIL→✅ PASS. 9 candidate links remain queued (non-blocking) on the two brand-CSS manifestations.
- Gates: typecheck, lint, `verify.sh`, `validate:architecture`, test(82), `req:folder-index`(784), `req:validate`(QST-VR-011 pre-existing), `req:completion-gate --changed` all green. Real-pointer Playwright MCP browser proof via §28 fallback (Preview MCP port held by another chat).
- Browser evidence: `output/evidence/CT-1-theme-tokens/` — `builder-dark-1440`, `builder-light-1440`, `home-light-1440`, `home-light-390`, `version-light-1440`, `version-light-390`. /home + /version render light by default (WM-1 theme pref is version-scoped); dark token correctness proven on /builder + computed values.

### Completed sprint carry-forward — OA-1 (2026-06-30)
- Output: `output/OA-1-overflow-awareness.md` (Claude/claude-sonnet-4-6).
- Files touched: `src/hooks/useScrollEdge.ts` (new, 28 lines — shared scroll-edge hook, vertical + horizontal axes, reduced-motion safe); `src/builder/cards/templates/phase/PhaseCard.tsx` (vertical top/bottom gradient fades on action-list scroll container); `src/builder/cards/templates/phase/HorizontalTaskFlow.tsx` (horizontal left/right gradient fades on task row scroll container, outer relative wrapper).
- REQ graph changes: `MAN-hook-src-hooks-usescrolledge` (new, `delivery: implemented`); `TRC-OA1-REQ-FP-CMA-003-TO-MAN-hook-usescrolledge` (implements, partial). PhaseCard + HorizontalTaskFlow component MAN nodes pre-existed.
- **Canonical homes (reuse):** `useScrollEdge` lives at `src/hooks/useScrollEdge.ts`; reuse for any future scroll-edge fade signal; do not inline equivalent logic.
- **Fade gradient colour:** `from-black/40` — matches builder dark-glass surface; update if surface changes.
- Debt burn-down: changed-scope `manifestationsLackingRequirements` 1 → 0; `req:completion-gate --changed` ✅ PASS; `req:validate` ✅ PASS (QST-VR-011 pre-existing).
- Gates: typecheck ✅, lint ✅, test(82) ✅, architecture(272) ✅, `req:validate` ✅, `req:completion-gate --changed` ✅. Browser smoke ✅ (no JS errors). Real-pointer PO Web Check ⚠ BLOCKED (§28/§29a): phase expand requires real pointer; mock data has 1 action/phase — PO must verify manually with ≥5 actions expanded and scrolled.
- Browser evidence: `output/evidence/OA-1-overflow-awareness/builder-smoke-1280.jpeg`.

### Completed sprint carry-forward — CC-3 (2026-06-30)
- Output: `output/CC-3-editor-component.md` (Claude/claude-opus-4-8). G-IMPECCABLE: direct `dcx-frontend-refactor` route.
- Files touched: `src/builder/islands/EditorViewerIsland/useEditorState.ts` (derive + expose `selectedEditableNodeId`); `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` (collapsed pill enable-on-select + `data-testid="editor-pill"`); `src/builder/islands/EditorViewerIsland/TaskEditor/RoutingDirectorySection.tsx` (`grid-cols-2` → `grid-cols-1`). Also reconciled root `CLAUDE.md` impeccable line (G-IMPECCABLE doc debt).
- REQ graph: `REQ-EVI-001`, `REQ-FP-D09`, `REQ-FP-D10` delivery `not-assessed → implemented`; MANs `...-editorviewerisland-editorviewerisland`, `...-taskeditor-routingdirectorysection`, `MAN-hook-...-useeditorstate` delivery `not-assessed → implemented`; RS-R7 candidate `TRC-RS-R7-REQ-EVI-001-TO-MAN-...-editorviewerisland` **confirmed**; new `TRC-CC3-REQ-FP-D09-...` + `TRC-CC3-REQ-FP-D10-...`. **No `verified`** claimed — interactive proof BLOCKED.
- **Canonical homes (reuse):** enable-on-select lives in `useEditorState` (`selectedEditableNodeId` via `findEditorNode`) + the `#editor-island` collapsed pill (`[data-testid="editor-pill"]`); routing layout is single-column in `RoutingDirectorySection`. Opening the editor from any source goes through `setFocusedNodeId` — reuse, don't add a parallel open path.
- Debt burn-down: RS-R7 candidate needing-confirmation for touched reqs 1 → 0; changed-scope unlinked manifestations 0; completion gate ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(82) ✅, architecture(272) ✅, `req:validate` ✅ (QST-VR-011 pre-existing), `req:completion-gate --changed` ✅. Dev-smoke ✅ (Vite compiled changed files, 0 build errors, 0 console errors at mount).
- **Interactive PO Web Check ⚠ BLOCKED (§28):** Preview MCP wedges to `chrome-error` after mount; sandboxed Vite port unreachable from Bash/Playwright; :3000 held by another chat (Vite → 3001). Same as logs 025/026. PO real-pointer steps + non-visual evidence: `output/evidence/CC-3-editor-component/README.md`.
- **Open:** live-verify path still flaky — fix a reliable shared-port preview before WM-5's presentation check and to retire this CC-3 BLOCKED item.

### Completed sprint carry-forward — CC-4 (2026-06-30)
- Output: `output/CC-4-readiness-a11y.md` (Claude/claude-opus-4-8). G-IMPECCABLE: direct `dcx-frontend-refactor` route.
- Files touched: `src/builder/cards/templates/phase/readiness-label.ts` (new — `READINESS_LABEL` + `readinessAriaLabel`/`readinessTooltip`); `src/builder/cards/templates/phase/readiness-label.test.ts` (new — 3 tests); `src/builder/cards/templates/phase/PhaseCard.tsx` (collapsed + expanded readiness buttons: `aria-label` + readiness `title` + `data-testid="phase-readiness-collapsed"`/`-expanded"` + `focus-visible` ring); `src/builder/cards/templates/phase/PhaseReadinessBadge.tsx` (sr-only from `READINESS_LABEL`).
- REQ graph: `REQ-FP-D11` + `REQ-RDY-001` delivery `not-assessed → implemented`; MANs PhaseCard/PhaseReadinessBadge + new `MAN-function-...-readiness-label` + `MAN-test-...-readiness-label-test` → `implemented`; new TRCs `TRC-CC4-REQ-FP-D11-TO-{phasecard,phasereadinessbadge,readiness-label}`, `TRC-CC4-REQ-RDY-001-TO-{phasereadinessbadge,readiness-label}` (partial), `TRC-CC4-MAN-test-...-VERIFIES-REQ-FP-D11`; evidence node `EVD-cc4-readiness-a11y-1782833731000` → AC-RDY-SEED (`verified`).
- **Canonical home (reuse):** all phase readiness presentation text lives in `readiness-label.ts` (`READINESS_LABEL` / `readinessAriaLabel` / `readinessTooltip`) — do not inline readiness strings. Markers are keyboard-focusable buttons with `data-testid="phase-readiness-collapsed"|"-expanded"`.
- Debt burn-down: changed-scope `manifestationsLackingRequirements` 3 → 0; acceptance-without-evidence (global) 27 → 26; completion gate ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(85, +3 new targeted) ✅, architecture(273) ✅, `req:validate` ✅ (QST-VR-011 pre-existing), `req:completion-gate --changed` ✅.
- **Browser a11y proof ✅ (Preview MCP, clean port 3000 — retires the CC-3 stray-server debt):** `/builder/v-1` Kanban 1440×900, real `dblclick` to collapse phase-1; collapsed readiness marker `title`/`aria-label`/`sr-only` correct (`blocked`), keyboard focus reaches it, 7 expanded markers identical, no console errors, compact rail. Evidence: `output/evidence/CC-4-readiness-a11y/`.
- **CC-3 follow-up retired:** enable-on-select confirmed live (editor pill enabled + selection-aware title with a card selected); routing single-column stays source-confirmed.

### Completed sprint carry-forward — CC-5 (2026-06-30)
- Output: `output/CC-5-reduced-motion.md` (Claude/claude-sonnet-4-6).
- Files touched: `src/hooks/useReducedMotion.ts` (new — reactive `matchMedia('(prefers-reduced-motion: reduce)')` hook); `src/ui/motion/effects.registry.ts` (new `reducedEffectsRegistry` — all 12 `EffectName` entries with no-spring/no-scale/no-shake variants); `src/ui/motion/useEffect.ts` (added `reduced` param, routes to `reducedEffectsRegistry`); `src/ui/motion/EffectLayer.tsx` (calls `useReducedMotion()`, forwards to `useLayerEffect`).
- REQ graph: `REQ-IFX-001`, `REQ-FP-D06`, `REQ-DZ-001` delivery `not-assessed → implemented`; MANs effects-registry/useEffect/EffectLayer `not-assessed → implemented`; new `MAN-hook-src-hooks-usereducedmotion` created + `implemented`; TRCs `TRC-CC5-REQ-IFX-001-TO-{effects-registry,usereducedmotion}`, `TRC-CC5-REQ-FP-D06-TO-MAN-function-effects-registry`, `TRC-CC5-REQ-DZ-001-TO-MAN-function-effects-registry`.
- **Canonical homes (reuse):** `useReducedMotion` at `src/hooks/useReducedMotion.ts`; `reducedEffectsRegistry` in `effects.registry.ts`; `EffectLayer` is the single injection point — do not call `useReducedMotion` in card/island components directly.
- Reduced variants: `invalidDrop` → opacity pulse (not x-shake); `expandCollapse` → opacity-only fade; all spring/scale/rotate effects → instant or ≤100ms fade. Skeleton shimmer unchanged (SK-1 CSS handles it).
- Debt burn-down: changed-scope `manifestationsLackingRequirements` 0 (new MAN linked at creation); `req:completion-gate --changed` ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(274 modules, +1) ✅, `req:validate` ✅ (QST-VR-011 pre-existing), `req:completion-gate --changed` ✅.
- Browser smoke ✅ (Preview MCP, clean port 3000): `/builder/v-1`, 26 EffectLayer wrappers in DOM, 0 console errors, `matchMedia` API confirmed. Evidence: `output/evidence/CC-5-reduced-motion/README.md`.
- **PO Web Check ⚠ PENDING (§28):** reduced-motion emulation requires OS toggle or Playwright `emulateMedia({ reducedMotion: 'reduce' })`; Preview MCP does not expose this knob. PO should toggle OS "Reduce Motion" setting, navigate `/builder`, drag/expand/select, and confirm instant/fade behavior with no springs or x-shakes.

### Completed sprint carry-forward — CC-7 (2026-06-30)
- Output: `output/CC-7-compact-action.md` (Claude/claude-sonnet-4-6). G-IMPECCABLE: direct `dcx-frontend-refactor` route (impeccable not invoked).
- Files touched: `src/builder/cards/CardShellContent.tsx` (action padding `p-3.5 pb-4.5` → `p-2.5 pb-3`); `src/builder/cards/templates/phase/HorizontalTaskFlow.tsx` (scroll padding `pt-2.5 pb-4.5` → `pt-1.5 pb-2`; `from-black/40` → `from-[var(--theme-glass-bg)]`); `src/builder/cards/templates/action/ActionTaskList.tsx` (mt `mt-1.5` → `mt-1` collapsed); `src/builder/cards/templates/phase/PhaseCard.tsx` (gap `gap-2` → `gap-1.5`; `from-black/40` → `from-[var(--theme-glass-bg)]`).
- Also back-filled: `output/OA-1-overflow-awareness.md` (OA-1 process debt).
- Requirement trace: `REQ-DENSITY-001` delivery `not-assessed → implemented`; `MAN-react-component-src-builder-cards-cardshellcontent` delivery `not-assessed → implemented`; TRC `TRC-CC7-REQ-DENSITY-001-TO-MAN-react-component-cardshellcontent` created.
- **Collapsed action card height:** ~154px → ~130px (with tasks, −16%); 96px (no tasks). Inter-action gap: 8px → 6px.
- **Density at target MacBook 14" (~900px):** 3 × 130px + 2 × 6px = 402px < ~510px available ✅. OA-1 fade signals beyond 3 actions as designed.
- **`black/40` token debt resolved:** `from-[var(--theme-glass-bg)]` now used in PhaseCard + HorizontalTaskFlow fade overlays.
- **Canonical homes (reuse):** action card padding lives in `CardShellContent.tsx`; HorizontalTaskFlow scroll padding in its own `pt-*/pb-*`; inter-action gap in PhaseCard's scroll container `gap-*` class.
- Debt burn-down: changed-scope `manifestationsLackingRequirements` 1 → 0; `req:completion-gate --changed` ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(82) ✅, architecture(272) ✅, `req:validate` ✅, `req:completion-gate --changed` ✅. Browser smoke ✅ (no JS errors, /builder/v-1).
- PO Web Check ⚠ PARTIAL (§28): mock data has ≤2 actions/phase; real-pointer confirm with ≥3 actions at MacBook viewport needed by PO.

### Completed sprint carry-forward — CC-6 (2026-06-30)
- Output: `output/CC-6-light-surfaces.md` (Claude/claude-sonnet-4-6). G-IMPECCABLE: direct `dcx-frontend-refactor` route (impeccable not invoked for surface token fix).
- Files touched: `src/brand/styles/components.css` (`.builder-canvas` background: `--theme-component-surface-deep` → `--theme-surface-deep`); `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` (added `useTheme`, `isDark`-gated "Controls" heading + 3 dividers for light theme).
- Requirement trace: REQ-FP-D05 + REQ-IFX-001 touched; MAN-function-src-brand-styles-components + MAN-react-component-src-builder-islands-kanbanbuilderisland delivery `not-assessed → implemented`; TRC-CC6-REQ-FP-D05-TO-MAN-function-src-brand-styles-components + TRC-CC6-REQ-IFX-001-TO-MAN-react-component-kanbanbuilderisland created.
- **Root cause of dark canvas:** `--theme-component-surface-deep: rgb(13,13,14)` was identical in both light and dark themes. Switched `.builder-canvas` to use `--theme-surface-deep` which is already correctly `#FAF9F6` (light) / `#050506` (dark) from CT-1. One CSS line changed.
- **Island shells:** row-1 (MetadataIsland/HeaderBrandIsland) already `glass-light` in light. Row-3 island shells already light via `island-shell` CSS (`--theme-glass-bg` = `rgba(255,255,255,0.85)` in light) and `BuilderIslandShell.tsx` `isDark` branching. Only KanbanBuilderIsland expanded inner-text needed fixing.
- **Canonical homes (reuse):** canvas surface uses `--theme-surface-deep` from `tokens.css`; do not reintroduce `--theme-component-surface-deep` as builder canvas bg. `KanbanBuilderIsland` island-shell bg already light via `island-shell` CSS class (no per-component override needed).
- Debt burn-down: `manifestationsLackingRequirements` 256 → 255; changed-scope unlinked 1 → 0; `req:completion-gate --changed` ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(274) ✅, `req:validate` ✅ (QST-VR-011 pre-existing), `req:completion-gate --changed` ✅.
- Browser proof: Preview MCP + playwright screenshot; `#builder-canvas` computed `background-color: rgb(250,249,246)` in light theme; 0 console errors; no dark canvas/island patches. Evidence: `output/evidence/CC-6-light-surfaces/builder-light-1440.png`, `builder-light-390.png`.
- **PO Web Check ⚠ PENDING:** Real theme toggle via header button → inspect stage + islands in light mode. Expect no dark patches. Note: `InlineIslandButton` dark-pill styling retained (design intent — contrast element, not a patch).

### Completed sprint carry-forward — HV-1 (2026-06-30)
- Output: `output/HV-1-home.md` (Claude/claude-sonnet-4-6).
- Files touched (new): `src/pages/home/HomeDashboard.tsx`, `HomeHeroBar.tsx`, `HomeSearchFilters.tsx`, `HomeSavedViews.tsx`, `HomeVersionList.tsx`, `HomeVersionCard.tsx`, `HomeAnalyticsPanel.tsx`, `HomeActivityPanel.tsx`, `CreateVersionDialog.tsx`; `src/ui/app-shell/PageBrandBlock.tsx`, `PageUserBlock.tsx`; `src/queries/logs.queries.ts`.
- Files touched (modified): `src/pages/home/HomePage.tsx` (renders HomeDashboard); `src/services/mock/versions.mock.ts` (6-version enriched seed, `getAllVersionsFromMock`); `src/services/mock/logs.mock.ts` (seed logs, `getAllActivityLogsFromMock`); `src/services/mock-dispatch.ts` (GET /versions, GET /activity-logs routes); `src/services/versions.service.ts` (`getAllVersions()`); `src/services/logs.service.ts` (`getAllActivityLogs()`); `src/queries/QUERY_KEYS.ts` (`versions.all`); `src/queries/versions.queries.ts` (`useAllVersionsQuery()`).
- REQ graph: REQ-VER-ROOM (new, supersedes REQ-VR-001) + 14 REQ-HOME-* nodes → `delivery: implemented`; REQ-VR-001 → `governance: superseded`; 17 MAN nodes + 25 TRC-HV1-* links created; `req:validate` ✅, `req:completion-gate` ✅ PASS.
- **Canonical homes (reuse):** app-shell shared blocks live in `src/ui/app-shell/` (PageBrandBlock, PageUserBlock). All-versions seam: `GET /versions` → `getAllVersions()` → `useAllVersionsQuery()`. All-logs seam: `GET /activity-logs` → `getAllActivityLogs()` → `useAllActivityLogsQuery()`. No `src/builder/**` import in any Home or app-shell file.
- **Mock seed:** 6 versions across 3 DCXs (dcx-1 HSA Brand Awareness Q3, dcx-2 SNB Product Launch 2026, dcx-3 Almarai Summer Campaign). Analytics: Active DCXs = 2, Total DCXs = 3, Total Versions = 6.
- **DCX active definition (D-2):** derived in memory from member versions: all Superseded → superseded; any Approved → approved; else active.
- **Navigation (REQ-VER-ROOM, D-1):** HomeVersionCard `onClick` → `navigate('/version/:id')`. Applied + implemented before card build.
- Debt burn-down: changed-scope unlinked MANs 0 → 0 (all new MANs linked at creation); REQ-HOME-* candidates 15 → 0 pending; candidate link count 25 created.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(287 modules, 0 violations) ✅, `req:validate` ✅, `req:completion-gate` ✅. Browser/Preview MCP ✅ 1440×900.
- **Known debt:** (a) tablet/mobile (<1024px) right panel `shrink-0` takes full height before left panel version list — stack ordering/height-split fix needed (FL-HV1-01); (b) SK-1 HomeLoadingSkeleton must be realigned to final responsive layout (FL-HV1-02); (c) ClickUp/Supabase backend integration deferred (D-7); (d) WM-6 monthly view 6 visual regressions still open (unrelated to HV-1).
- PO Web Check: browser verified via Preview MCP at 1440×900 — full dashboard rendered, 6 version cards, analytics correct, activity feed, search/filter/saved-views controls. Real-pointer drag not required for Home (no drag-driven cards). Mobile/tablet screenshots captured.

### Completed sprint carry-forward — HV-2 (2026-06-30)
- Output: `output/HV-2-version.md` (Claude/claude-sonnet-4-6).
- Files touched (new): `src/pages/version/VersionWorkspace.tsx`, `VersionMissingState.tsx`, `VersionHeader.tsx`, `VersionStatusControls.tsx`, `VersionSwitchboard.tsx`, `VersionSummaryPanel.tsx`, `VersionResourcesPanel.tsx`, `VersionCrewPanel.tsx`, `VersionBuilderPanel.tsx`, `VersionStructureSummary.tsx`.
- Files touched (modified): `src/pages/version/VersionPage.tsx` (renders VersionWorkspace); `src/services/mock/versions.mock.ts` (attachments on v-1/v-2, 3-member team on v-2).
- REQ graph: 7 new REQ-VER-* nodes → `delivery: implemented`; REQ-VER-ROOM confirmed (applied in HV-1); 10 MAN nodes + 13 TRC-HV2-* links created; `req:validate` ✅ PASS.
- **Canonical homes (reuse):** Version page components in `src/pages/version/`; no `src/builder/**` imports anywhere in this directory. Structure data via `useBuilderTreeQuery` (data-only, from `src/queries/` — not a §13 violation). Siblings via `useVersionsQuery(version.dcxId)`. Active-version switching is page-local state (no URL change needed when switchboard is clicked).
- **D-5 Option B:** `VersionBuilderPanel` is a full-width branded section (icon + description + "Open Builder →" CTA). Disabled with explanation for locked statuses. No builder embed, no `src/builder/**` import.
- **VersionStructureSummary (V-C10 — NEW):** counts from `useBuilderTreeQuery`; hover popup lists phase/action/task names. Data only — no builder store/UI imported.
- **TRANSITION_LABEL fix:** labels keyed by TARGET status; "Send Back" used when transitioning from Ready for Approval → In Progress.
- Debt burn-down: changed-scope `manifestationsLackingRequirements` 0 (all 10 new MANs linked at creation); `req:completion-gate` ✅ PASS.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(297 modules, 0 violations) ✅, `req:validate` ✅. Browser/Preview MCP ✅ — version room renders with header/controls/structure/docs/crew/switchboard; missing-state fallback confirmed.
- **Known debt:** tablet/mobile stack ordering (FL-HV2-01); structure summary hover clip at edge (FL-HV2-02); crew initials only, no user directory (FL-HV2-03); product type from mock proxy, real ClickUp field deferred (FL-HV2-04); SK-1 VersionLoadingSkeleton needs realignment (FL-HV2-06).
- PO Web Check: browser verified at ~800px viewport — header, status controls, builder panel, structure (11 phases/69 actions/339 tasks), 2 document attachments, crew, V1+V2 switchboard all rendered. Missing-state (`/version/v-999`): "Version not found" + back button confirmed.

### Completed sprint carry-forward — WM-4 (2026-06-30; backfilled at plan close 2026-07-01)
- Output: `output/WM-4-card-interactions-copy-paste.md`. Review ✅ PASS (`output-review/2026-06-30-claude-WM-4-review.md`).
- Single/double-click select+expand, anchored task popup, card duplicate, subtask cloning all confirmed pre-existing; Ctrl+C/V copy-paste + keyboard guard-in-inputs wired.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(275) ✅, `req:validate` ✅.
- **Doc debt (→ custom task):** PO rolled back E02 (action long-press) after WM-3; the WM-3 `TRC-WM3-REQ-EVI-001` link must be retracted in a governance-cleanup task.

### Completed sprint carry-forward — WM-5 (2026-06-30; backfilled at plan close 2026-07-01)
- Output: `output/WM-5-focus-selection-keyboard-readiness.md`. Review ✅ PASS (`output-review/2026-06-30-claude-WM-5-review.md`).
- REQ-PRESENT-001 bug fixed; FocusIsland filtering, focus isolation, readiness rollup confirmed pre-existing; `isLocked` guard added on paste/delete (governance-aligned, REQ-KEY-004 intent); all keyboard gaps closed.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture ✅, `req:validate` ✅. No regressions.

### Completed sprint carry-forward — WM-6 (2026-06-30 + round-2; PO-confirmed at plan close 2026-07-01)
- Output: `output/WM-6-stage-views.md`. Round-1 review PASS was **static-only**; round-2 PO-visual review (`…WM-6-review-2-po-visual-fixes.md`) requested 6 fixes — all applied (`042-wm6-round2-visual-fixes`) + verified ✅ PASS 5/6 (`043-wm6-round2-verification`).
- Files (round-2): `MonthlyView.tsx` (grid `[grid-template-rows:minmax(0,1fr)]`, vertical week-gutter labels), `DayGridCard.tsx` (deleted `MonthlyTaskChip` → reuse collapsed `TaskCard disableExpand`, wrapping flex + internal scroll, `min-w-0`), `TaskCard.tsx` (`disableExpand` prop), `TimelineBuilderIsland.tsx` (Month a/b switch derived from weeks; Add Week is the only growth control).
- **Canonical homes (reuse):** monthly day cells render the real collapsed `TaskCard` (no bespoke chip); month nav derives `monthCount=ceil(totalWeeks/4)` in `TimelineBuilderIsland` — do not add a parallel month state.
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(275) ✅, `req:validate` ✅, `req:completion-gate --changed` ✅.
- Browser (Preview MCP, clean restart): 7×4 grid, 122.5px definite row track, 0 chip remnants, no document v/h scroll @1440, Month 1/1 → Add Week ×4 → Month 1/2 → Month 2/2. **Open (→ custom task):** Fix-2 density not screenshottable (`v-1` mock has no tasks in visible weeks) — mechanism verified, PO confirmed at close.

### Completed sprint carry-forward — HV-3 (2026-06-30 + PO visual fixes; backfilled at plan close 2026-07-01)
- Output: `output/HV-3-home-glass.md`. Round-2 audit ✅ PASS all 4 fixes (`046-hv3-round2-audit`).
- Brand glass foundation + ambient `MouseGlowBackground` (new `src/ui/MouseGlowBackground/`, §13-safe); nav bar removed (builder `h-screen overflow-hidden`); hero restructured; analytics single glass-panel with `Active DCXs` primary stat + `•LIVE` pulse; activity log mono timestamps + version badge chips.
- **Canonical homes (reuse):** `MouseGlowBackground` is the home ambient spotlight; `.glass-panel`/`.glass-card`/`.status-badge` + `--status-*` vars; `--theme-surface-raised`/`-hover`/`--theme-border` now resolve (bug-fix, 63 existing usages).
- Gates: typecheck ✅, lint ✅, test(85) ✅, architecture(297) ✅, `req:validate` ✅; browser proof 1440/768/375.
- **Known debt (→ custom task):** FL-HV3-01 (`homeherobbar` MAN filename typo from HV-1; component correct, completion-gate warns); FL-HV3-02 (tablet/mobile right-panel stack order, CSS-only sprint deferred it).

### Completed sprint carry-forward — HV-4 (2026-06-30; backfilled at plan close 2026-07-01)
- Output: `output/HV-4-version-glass.md`. Depends on HV-3 (consumed its glass foundation + status tokens).
- Version page restyle + motion polish; glass header/panels, accent campaign title, status tokens, builder-panel glow, structure cards, crew, switchboard active accent.
- **Canonical homes (reuse):** Version page styling consumes HV-3's brand glass + `--status-*` tokens; no `src/builder/**` import (§13 grep clean).
- Gates: typecheck ✅, lint ✅, test(85) ✅, `req:validate` ✅; browser proof 1440×900 / 768×1024 / 375×812 (stacked, readable at all sizes).

---

## Plan closed 2026-07-01
All 22 substantive sprints delivered; CC-OPT closed NOT TRIGGERED. Live-tree gates green (typecheck/lint/test 85/build/architecture/`req:validate`). Folder moved `active/ → completed/`. Remaining real-pointer PO Web Checks + FL-* follow-ups + WM-4 TRC retraction descoped to the custom-task backlog per PO. Version unchanged: **v0.3.5**.
