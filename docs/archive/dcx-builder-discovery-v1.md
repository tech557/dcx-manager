# DCX Builder — Final Execution Plan v2

**Version:** Final — approved for execution  
**Date:** June 2026  
**Baseline:** v0.2.15  
**Status:** Sprint B0 cleared to proceed to Codex

> This document supersedes `dcx-builder-discovery.md` (draft). All blocking product decisions are resolved. Every item is labelled with its decision type. Do not proceed with any sprint until the preceding sprint's acceptance criteria are confirmed.

---

## Labels Used Throughout This Document

| Label | Meaning |
|---|---|
| ✅ Confirmed product requirement | Fixed. Cannot be changed without a product decision. |
| 🔵 Existing behaviour to preserve | Must not regress. |
| 🟡 Technical recommendation | Architectural choice made by the plan author. |
| ⏱ Temporary assumption | Valid for V1 execution. Must be revisited before V2. |
| ❓ Open product decision | Not yet decided. Listed but not implemented. |
| 🔮 Deferred V2 item | Out of scope for this plan. |

---

## Requirement Identifiers

Two new identifiers introduced in this revision:

```
BLD-FIL-001   File preview relocation to Project Meta Island
BLD-CRD-INT-002   Independent popup and expanded card state coexistence
```

These identifiers appear in the traceability matrix, sprint assignments, and testing plan.

---

## 1. Executive Summary

The DCX Builder has a correct architectural foundation. The data model, action boundary, card registry, drag-drop logic, readiness rules, and autosave are all sound and must not be changed. The gaps are product behaviour additions, not architectural failures.

**Six critical product gaps identified:**

1. **No Task read-only popup on single-click** (BLD-CRD-INT-002)
2. **No long-press or drag-to-editor to open editor sessions**
3. **No multi-session editor with pill restore**
4. **No presentation mode in Selection Island**
5. **ViewHelperIsland is not View Context** — it contains file preview, which must move to Project Meta Island (BLD-FIL-001), and View Context must be built fresh
6. **Loading state is a text placeholder**

**Resolved blocking decisions (now confirmed requirements):**

- **Q4 — File preview:** Kept and relocated to Project Meta Island → Files section. View Context contains zero file preview logic.
- **Q5 — Popup vs expanded state:** Independent coexistence. Single-click opens popup. Double-click toggles expand. Neither closes or prevents the other.

**Recommended direction:** Controlled incremental refactor — Option A. No rewrite.

---

## 2. Product Understanding

### 2.1 Builder purpose ✅

The DCX Builder is the central workspace for planning, viewing, editing and managing a DCX campaign. V1 scope: planning, viewing, editing task details, arranging communication structure, assigning communication dates, readiness checking.

Long-term direction: a DCX control room. V1 must remain extensible without overengineering for V2 capabilities.

### 2.2 V1 confirmed views ✅

Kanban, Timeline Weekly, Timeline Monthly.

### 2.3 Planning directions ✅

**Top-down (Kanban):** Phase → Action → Task → Task details → Communication date  
**Bottom-up (Timeline):** Week → Day → Task → assign Phase/Action

Both directions write to the same version. Switching view must feel like the same workspace.

### 2.4 Stage behaviour ✅

- Stage is persistent across view switches
- Switching views replaces the card system inside the same stage
- Opening/closing islands must not reset: card states, selection, focus, scroll position, active week/month, current view, open editor sessions
- Stage uses fixed-height working area
- Horizontal navigation allowed; vertical stage scroll not required

### 2.5 Card interaction model — Kanban ✅

| Interaction | Result |
|---|---|
| Single click | Selects card. For Tasks: also opens read-only popup (BLD-CRD-INT-002) |
| Double click | Toggles collapse/expand. Popup state unaffected. |
| Long press on Task (400ms) ⏱ | Opens Task in Editor Island |
| Drag Task to Editor Island | Opens Task in Editor Island |

Phase and Action: click selects. Names editable inline. No read-only popup.

### 2.6 Card states — all independent dimensions ✅

- Display: collapsed / expanded
- Interaction: default / selected / disabled
- Children: all collapsed / all expanded / mixed
- Change feedback: none / newly created / newly edited
- Receiving: none / receiving child
- Presentation override: normal / selection-presentation-mode

### 2.7 Stage density target — 14-inch MacBook ✅

Three expanded Phase cards, two to three expanded Actions per Phase, two to three collapsed Tasks per Action. No horizontal scrolling at this baseline.

### 2.8 Editor Island session model ✅

- Opening a Task creates an editor session
- Unsaved changes are preserved when switching sessions
- Maximum 5 sessions ⏱ (temporary V1 default — exact limit is an open product decision)
- Minimising the editor returns open Tasks as round session pills on the island
- Clicking a pill restores that Task's editing context
- Sessions persist until explicitly saved / discarded / cleared
- Unsaved sessions must never be silently replaced or discarded ✅

### 2.9 Presentation mode ✅

Triggered by clicking the selection count in Selection Island.

- V1: single selection only ⏱ (multi-selection presentation mode is deferred V2 item)
- Required parents expand
- Unrelated cards collapse
- Stage centres the selected object (object-specific centring)
- Previous card states are preserved
- States fully restore when presentation mode ends or selection is cleared

### 2.10 View Context Island ✅

- Timeline only (returns null in Kanban — current behaviour is correct)
- Shows undated Tasks in a Kanban-style list
- User drags Task from View Context onto a Day → Task's date set → Task becomes disabled in View Context
- Resizable sticky popup — overlays stage, does not shift cards
- Minimise returns to View Context island pill
- **Contains zero file preview functionality** (BLD-FIL-001)

### 2.11 File preview ✅ (BLD-FIL-001)

- File preview lives in Project Meta Island → Files section
- Supports: sticky resizable preview panel, multiple open file sessions, minimise to Files section, restore from Files section
- Existing functionality from ViewHelperIsland is preserved and relocated — no regression

### 2.12 Focus Island ✅

- Four child categories: Week, Phase, Action, Task Properties
- Phase, Action, Week: open fixed selection popups
- Task Properties: nested inline pills (property shown only if ≥1 Task has a valid value)
- Multiple filters: AND/OR toggle appears when 2+ filters are active; default AND
- Applied state persists on collapsed island pill (count badge)
- Applied Focus is cleared from Selection Island

### 2.13 Timeline Builder Island ✅

- Synchronised with stage (bidirectional)
- Controls: prev/next period, active indicator, weekly/monthly toggle, add weeks
- No month-add control
- Only weeks are added

### 2.14 Readiness model ✅

- Task ready: all required fields filled + at least one valid Subtask with duration
- Action ready: all Tasks ready
- Phase ready: all Actions ready
- Day ready: all assigned Tasks ready
- Version ready: all Phases ready + required objects exist

### 2.15 Project Meta Island ✅

Contains: launch date, files, team, other version metadata.

**Team:** fixed popup — team members + information  
**Files:** fixed popup — all project files listed. Opening a file: loads from Google Drive → opens in sticky resizable popup → minimise/restore as session pill. File preview state lives here. ✅ (BLD-FIL-001)

---

## 3. Current Builder Architecture

### 3.1 Component hierarchy

```
BuilderPage
  ├── BuilderLoadingShell (MISSING — text placeholder)
  ├── StageProvider (context: view, selection, drag, week, expansion)
  └── BuilderWorkspaceContent
      ├── Row 1: MetadataIsland (header — brand, project meta, user)
      ├── Row 2:
      │   ├── EditorViewerIsland (left — single session only)
      │   ├── StageCore → stage.registry → KanbanView / WeeklyView / MonthlyView
      │   └── FocusIsland (right)
      └── Row 3:
          ├── SelectionIsland (no presentation mode)
          ├── KanbanBuilderIsland / TimelineBuilderIsland
          └── ViewHelperIsland (WRONG product — contains file preview, scroll helpers)
```

### 3.2 State ownership map

| State | Owner | Notes |
|---|---|---|
| `nodes: BuilderNode[]` | `builderStore` | Single source of truth 🔵 |
| `view: ViewKind` | `StageProvider` | Persisted via usePreferences 🔵 |
| `selectedNodeIds` | `StageProvider` | 🔵 |
| `expandedNodeIds` | `StageProvider` | Persisted 🔵 |
| `focusedNodeId` | `StageProvider` | ⚠️ Semantically wrong — used as "is editor open" boolean |
| `isDragging` | `useDragState` | 🔵 |
| `activeWeek` | `useWeekState` | 🔵 |
| `isLocked` | `builderStore` | Set from version status 🔵 |
| `saveStatus` | `builderStore` | 🔵 |
| `isFocusIslandExpanded` | `StageProvider` | ⚠️ Island state in stage context — causes unnecessary re-renders |
| `isEditorDirty` | `StageProvider` | ⚠️ Same problem |

### 3.3 Key files — status

| File | Lines | Status |
|---|---|---|
| `BuilderPage.tsx` | 183 | 🔵 Correct structure; loading shell needs replacement |
| `StageProvider.tsx` | 108 | 🟡 Two island states must move out (B0) |
| `StageCore.tsx` | 129 | 🔵 Correct; stage sizing to review |
| `CardShell.tsx` | 119 | 🟡 Needs parallel state support (B-CRD) |
| `useCardDrag.ts` | 119 | 🟡 Needs long-press timer |
| `card.registry.ts` | 71 | 🔵 Correct |
| `handleCardDrop.ts` | 170 | 🔵 Correct pure function |
| `readiness.rules.ts` | ~100 | 🔵 Correct — do not touch |
| `api-mappers.ts` | 228 | 🔵 Correct — mapper fix applied |
| `useAutosave.ts` | ~60 | 🔵 Correct — domainPhasesToApi fix applied |
| `ViewHelperIsland.tsx` | 256 | ⚠️ Wrong product — file preview must move (B-FIL) |
| `useViewHelper.ts` | 110 | ⚠️ File preview state — moves to MetaIsland |
| `MetadataIsland.tsx` | 184 | 🟡 Files section needs file preview added |
| `EditorViewerIsland.tsx` | 239 | ⚠️ Single session only — session model needed |
| `SelectionIsland.tsx` | 112 | ⚠️ No presentation mode |

---

## 4. UX Findings

### What works

- Three-row layout is spatially correct
- Phase collapsed/expanded states functional
- Drag-drop rearrangement correct after RF-4
- Card registry/effects system correctly separates visual state
- Island pill/panel transitions via BuilderIslandShell are smooth
- Dark glass aesthetic appropriate

### What does not feel like a control room

**Loading flashes text.** BuilderPage returns a plain `<section>` with "Preparing workspace." Layout shifts when data arrives.

**Editor is single-session.** The island expands to one width. No pills. No multi-task context.

**Single click on Task does nothing beyond selecting.** Read-only popup missing.

**Long press not implemented.** No timer in useCardDrag or CardShell.

**Presentation mode absent.** Clicking the selection count does nothing special.

**ViewHelperIsland is a file viewer.** Not View Context. Contains file preview, keyboard shortcuts, location jumper — none of these belong here per the brief.

**Focus Island applied state disappears when collapsed.** No summary pill.

**Stage fixed at max-width 1280px.** At larger screens with editor closed, the stage does not use available width.

---

## 5. Requirement-to-Code Traceability Matrix

| ID | Requirement area | Expected behaviour | Current implementation | Files | Gap | Risk | Treatment |
|---|---|---|---|---|---|---|---|
| — | Builder shell loading | Skeleton → progressive reveal | Text placeholder | `BuilderPage.tsx` | ❌ Missing | High | Sprint B1 |
| — | Stage sizing | Fills available space | `max-w-[1280px]` hardcoded | `StageCore.tsx` | ❌ Partial | Medium | Sprint B2 |
| — | Kanban density (14-inch) | 3 phases, 2-3 actions, 2-3 tasks | Phase `w-[360px]` — may be too wide | `KanbanView.tsx` | ❌ Partial | Medium | Sprint B3 |
| BLD-CRD-INT-002 | Task single-click popup | Select + read-only popup (independent of expand) | Select only, no popup | `TaskCard.tsx`, `CardShell.tsx` | ❌ Missing | High | Sprint B-CRD |
| BLD-CRD-INT-002 | CardShell parallel states | Popup and expanded coexist independently | No popup; double-click expands | `CardShell.tsx` | ❌ Missing | High | Sprint B-CRD |
| — | Task long-press → editor | Opens editor (400ms ⏱) | Not implemented | `CardShell.tsx`, `useCardDrag.ts` | ❌ Missing | Medium | Sprint B-CRD |
| — | Drag Task to editor | Opens editor | Not implemented | `EditorViewerIsland.tsx` | ❌ Missing | Medium | Sprint B-CRD |
| — | Newly created card reveal | Highlight → bring into view → temp select → auto-deselect | Highlight only, no scroll-to, no auto-deselect | `useCardEffects.ts` | ❌ Partial | Medium | Sprint B-CRD |
| — | Editor multi-session | Up to 5 sessions, pill restore, minimise | Single session, no pills | `EditorViewerIsland.tsx`, `useEditorPanel.ts` | ❌ Missing | High | Sprint B5 |
| — | Unsaved session preservation | Never silently replaced | N/A (single session only) | — | ❌ Missing | High | Sprint B5 |
| — | Presentation mode | Collapse unrelated, centre selected, restore | Not implemented | `SelectionIsland.tsx` | ❌ Missing | High | Sprint B6 |
| — | Delete confirmation | Multi/ready objects need confirmation | No confirmation | `SelectionIsland.tsx` | ❌ Missing | Medium | Sprint B6 |
| BLD-FIL-001 | File preview → Project Meta | File preview in Meta Island → Files | File preview in ViewHelperIsland | `ViewHelperIsland.tsx`, `MetadataIsland/` | ❌ Wrong location | High | Sprint B-FIL |
| BLD-FIL-001 | View Context has no file preview | Zero file preview in View Context | File preview IS the view helper | `ViewHelperIsland.tsx` | ❌ Wrong product | High | Sprint B-FIL |
| — | View Context — undated task list | Shows undated tasks, drag-to-Day | Not implemented | — | ❌ Missing | High | Sprint B8 |
| — | View Context — task disabled after assign | Task greys out after date set | Not implemented | — | ❌ Missing | High | Sprint B8 |
| — | Focus applied summary on pill | Count badge when collapsed with active filters | Not implemented | `FocusIsland.tsx` | ❌ Missing | Low | Sprint B7 |
| — | Focus AND/OR toggle | Toggle when 2+ filters active | Not implemented | `FocusIsland.tsx` | ❌ Missing | Medium | Sprint B7 |
| — | Timeline Builder sync | Island ↔ stage bidirectional | useWeekState shared — works | `TimelineBuilderIsland.tsx` | ✅ Present | — | Verify |
| — | Edge auto-scroll | Continuous scroll near edge, no green zone | StageEdgeNavigation opacity-0 zones | `StageCore.tsx` | ✅ Present | — | Verify |
| — | Multi-select drag grouping | Same-level cards drag together | Single-card drag only | `useCardDrag.ts` | ❌ Partial | Medium | Sprint B9 |
| — | Day readiness | All assigned Tasks ready | Not in readiness.rules.ts | `readiness.rules.ts` | ❌ Missing | Low | Sprint B11 |
| — | View transition animation | Cards animate out/in on view switch | Instant switch | `StageCore.tsx` | ❌ Missing | Low | Sprint B10 |
| — | Loading skeletons | Skeleton matches live layout | Text only | `BuilderPage.tsx` | ❌ Missing | High | Sprint B1 |
| — | Autosave + Ctrl+S + beforeunload | All three | All present | `useAutosave.ts`, `BuilderPage.tsx` | ✅ Present | — | Keep |
| — | Readiness rules (Task/Action/Phase) | Correct upward inheritance | Correct | `readiness.rules.ts` | ✅ Present | — | Keep |
| — | Import/export JSON | Round-trip with reconciliation | Implemented | `import/`, `export.helpers.ts` | ✅ Present | — | Keep |
| — | Light/dark mode | All elements correct in both | Mostly correct | `brand/index.css` | 🟡 Verify on B12 | Low | Sprint B12 |
| — | Responsive layout | 14-inch + larger desktop | Stage max-width constraint | `StageCore.tsx` | ❌ Partial | Medium | Sprint B2 |

---

## 6. Existing Strengths — Do Not Touch

🔵 These systems are correct and must not be modified by any sprint in this plan:

1. `types/domain.ts`, `types/lifecycle.ts` — data model
2. `services/api-mappers.ts`, `utils/node.helpers.ts` — mapper layer
3. `rules/readiness.rules.ts` — readiness rules (Day readiness is an addition, not a change)
4. `actions/` (all files) — action boundary
5. `builder/cards/card.registry.ts` — card config (effects block may be extended, not changed)
6. `builder/cards/useCardDrag.ts` — drag logic (long-press is an addition)
7. `builder/cards/handleCardDrop.ts` — pure drop function
8. `builder/cards/cardDrag.helpers.ts` — including latest hierarchy rules
9. `builder/stage/StageProvider.tsx` (108 lines) and sub-hooks
10. `builder/islands/BuilderIslandShell.tsx` — island animation chassis
11. `ui/motion/effects.registry.ts` — named effects
12. `hooks/useAutosave.ts` — autosave with correct mapper
13. `brand/tokens.ts` — design tokens

---

## 7. Gaps and Architectural Risks

### Critical gaps

| Gap | Product impact | Sprint |
|---|---|---|
| No Task popup (BLD-CRD-INT-002) | Core Kanban interaction wrong | B-CRD |
| No CardShell parallel states (BLD-CRD-INT-002) | Popup + expand cannot coexist | B-CRD |
| No long-press to editor | Core editor opening missing | B-CRD |
| No editor multi-session | Required editor UX missing | B5 |
| File preview in wrong island (BLD-FIL-001) | View Context cannot be built on current shell | B-FIL |
| View Context missing entirely | Core Timeline feature absent | B8 |
| Presentation mode missing | Selection Island incomplete | B6 |
| Loading state is text | First-impression failure | B1 |

### Architectural risks

**Risk 1 — `focusedNodeId` is semantically wrong.**  
Used to control editor column width. With multi-session, "is editor open" is not a single node ID. Sprint B0 replaces this with `isEditorOpen: boolean`.

**Risk 2 — `isFocusIslandExpanded` and `isEditorDirty` in StageProvider.**  
Island state in stage context causes re-renders of all consumers. Sprint B0 removes both.

**Risk 3 — File preview migration must complete before View Context is built.**  
ViewHelperIsland currently owns the popup shell AND the file preview logic. Sprint B-FIL separates them before B8 adds View Context content.

**Risk 4 — CardShell parallel state must be established before Kanban interactions are finalised.**  
Sprint B-CRD must precede any sprint that assumes the Kanban interaction model is complete.

---

## 8. Gemini Capability Assessment

Based on 40+ documented sessions in this project:

| Capability | Assessment |
|---|---|
| Reads files | Given full file content in session prompt — does not navigate repo autonomously |
| Edits files | Produces whole files — not patches |
| Multi-file tasks | Reliable up to 4 files; >5 introduces drift |
| Runs app | Cannot |
| Runs tests | Cannot |
| Browser inspection | Cannot — relies on product owner manual check |
| Screenshots | Can use reference images for visual direction |
| Type updates | Requires full types file to be provided — invents types otherwise |
| Import updates | Updates imports in edited files; misses consumer files |
| Log maintenance | Writes good entries when format is given explicitly |
| Architecture intent | Follows file-level rules; cannot infer architectural purpose from naming |

**Gemini task requirements:**
- Each task names every file to read AND every file to write
- Relevant type files provided in full
- "Do not touch" list included in every task
- Acceptance criteria are verifiable without running the app
- Tasks over 4 files are split

---

## 9. Resolved Blocking Questions

All blocking questions are now resolved. Listed here for traceability.

| Question | Decision | Label |
|---|---|---|
| Q4 — File preview | Keep and relocate to Project Meta Island → Files. No regression. | ✅ BLD-FIL-001 |
| Q5 — Popup vs expanded state | Independent coexistence. Single-click → popup. Double-click → expand. Neither affects the other. | ✅ BLD-CRD-INT-002 |
| Long-press duration | 400ms | ⏱ Temporary assumption |
| Maximum editor sessions | 5 | ⏱ Temporary assumption |
| Presentation mode scope | Single selection only in V1 | ⏱ Temporary assumption |

**Remaining open decisions (not blocking — do not silently decide):**

| Decision | Impact | Sprint when it becomes blocking |
|---|---|---|
| ❓ Exact max editor sessions (beyond 5) | EditorSessionManager overflow behaviour | After B5 |
| ❓ Empty Day readiness (no tasks = ready?) | getDayReadiness edge case | B11 |
| ❓ Long-press movement threshold (exact px) | useCardDrag cancel threshold | B-CRD |
| ❓ Multi-selection presentation mode | B6 scope | After B6 |
| ❓ Popup dimensions and position | TaskReadOnlyPopup sizing | B-CRD |
| ❓ Card dimensions at specific breakpoints | B3 density targets | B3 |
| ❓ Animation durations exact values | B10 transitions | B10 |

---

## 10. Refactor Options

### Option A — Controlled incremental refactor (recommended)

**Scope:** Fix product behaviour gaps sprint by sprint. No architectural rewrite.  
**Preserved:** Data model, action boundary, card registry, drag-drop, rules, autosave, type system, all island shells.  
**Replaced:** ViewHelperIsland content (shell kept), editor session model, loading shell.  
**Added:** Task popup, long-press, parallel card states, multi-session editor, presentation mode, View Context task list, file preview in Meta Island.  
**Gemini suitability:** High — bounded file lists per task.  
**Risk:** Medium — StageProvider state shape touches many consumers (managed by B0 first).  
**Extensibility:** High — each feature is independently toggleable.

### Option B — Builder workspace shell refactor first

**Scope:** Replace `BuilderPage` + `StageCore` with new workspace shell, then re-attach views.  
**Risk:** High for Gemini execution — too many files in parallel.  
**Recommendation:** Use only if Option A reveals context cannot support multi-session without full context redesign.

### Option C — Larger Builder rewrite

**Recommendation:** Rejected. Code evidence does not support it.

---

## 11. Recommended Direction

**Option A — Controlled incremental refactor.**

The architecture survived 50+ sessions intact because it was correct. The gaps are product behaviour additions, not structural failures. Every sprint is independently reversible.

**Systems to preserve:** types, domain model, rules, actions, services, card registry, drag-drop, autosave, StageProvider sub-hooks, island shells, effects registry.

**Systems to refactor:** StageProvider state shape (B0), EditorViewerIsland session model (B5), SelectionIsland (B6).

**Systems to relocate:** File preview from ViewHelperIsland → Project Meta Island (B-FIL).

**Systems to build fresh:** BuilderLoadingShell (B1), TaskReadOnlyPopup (B-CRD), EditorSessionManager (B5), PresentationModeEngine (B6), ViewContextIsland content (B8).

**Deferred V2:** AI creation, template library, freeform view, real-time collaboration, analytics, multi-selection presentation mode.

---

## 12. Target Architecture After This Plan

```
BuilderPage
  ├── BuilderLoadingShell          ← B1
  ├── StageProvider (cleaned)      ← B0
  └── BuilderWorkspaceContent
      ├── Row 1: MetadataIsland
      │   ├── HeaderBrandIsland
      │   ├── MetadataDetailsContent (Files → file preview sessions)  ← B-FIL
      │   └── HeaderUserIsland
      │
      ├── Row 2:
      │   ├── EditorViewerIsland
      │   │   ├── EditorSessionManager (up to 5 sessions)  ← B5
      │   │   ├── EditorSessionPill[] (minimised sessions)  ← B5
      │   │   └── TaskEditorSession (active)
      │   │
      │   ├── StageCore (fills available width)  ← B2
      │   │   ├── KanbanView (density corrected)  ← B3
      │   │   │   └── PhaseCard → ActionCard → TaskCard
      │   │   │       └── TaskReadOnlyPopup (independent)  ← B-CRD
      │   │   ├── WeeklyView → DayGridCard
      │   │   └── MonthlyView
      │   │
      │   └── FocusIsland (applied summary, AND/OR)  ← B7
      │
      └── Row 3:
          ├── SelectionIsland (presentation mode)  ← B6
          ├── KanbanBuilderIsland / TimelineBuilderIsland
          └── ViewContextIsland (undated tasks, drag-to-Day)  ← B8
```

---

## 13. Sprint Roadmap

```
B0     StageProvider state cleanup           Codex       Prerequisite for all
B-FIL  File preview migration                Gemini+Codex Prerequisite for B8
B-CRD  CardShell parallel states + Task popup Codex+Gemini Prerequisite for B4, B5
B1     Loading shell with skeletons          Gemini
B2     Stage sizing + responsive             Gemini
B3     Kanban density                        Gemini
B4     Task interaction — reveal, scroll     Codex
B5     Editor multi-session model            Codex+Gemini
B6     Selection — presentation + delete     Codex
B7     Focus Island — applied + AND/OR       Gemini
B8     View Context island                   Gemini+Codex
B9     Multi-select drag grouping            Codex
B10    View transition animation             Gemini
B11    Day readiness                         Codex
B12    Visual polish                         Gemini
B13    Regression and acceptance review      Product owner
```

### Sprint dependency graph

```
B0 ──────────────────────────────────────────────► all sprints
B-FIL ───────────────────────────────────────────► B8
B-CRD ───────────────────────────────────────────► B5
B1, B2, B3 (independent, run in parallel after B0)
B4 (after B-CRD)
B5 (after B-CRD + B0)
B6 (after B0)
B7 (after B0)
B8 (after B-FIL)
B9, B10, B11 (independent after B0)
B12 (after B1–B11 complete)
B13 (final)
```

---

## 14. Detailed Sprint Tasks

---

### Sprint B0 — StageProvider State Cleanup

**Owner:** Codex  
**Objective:** Remove island-level state from stage context. Prepare StageProvider for the multi-session editor.  
**Preconditions:** None. Run first.

---

#### Task B0.1 — Remove `isFocusIslandExpanded` from StageProvider

**Purpose:** Island state in stage context causes all consumers to re-render when the Focus Island opens.

**Files and systems:**
- `src/builder/stage/StageProvider.tsx`
- `src/builder/stage/stageContext.types.ts`
- `src/builder/islands/FocusIsland/FocusIsland.tsx`

**Required behaviour:**
- Remove `isFocusIslandExpanded` and `setFocusIslandExpanded` from `StageProvider` and `stageContext.types.ts`
- Add `const [isExpanded, setIsExpanded] = useState(false)` as local state inside `FocusIsland.tsx`
- Replace all reads of `context.isFocusIslandExpanded` in `FocusIsland.tsx` with local `isExpanded`

**Preserve:** All other StageProvider state. Focus Island visual behaviour must be identical.

**Do not touch:** `CardShell.tsx`, any card component, any other island, `readiness.rules.ts`

**Acceptance criteria:**
```
□ grep -rn "isFocusIslandExpanded" src/builder/stage/ → 0 results
□ FocusIsland opens and closes correctly using local state
□ npm run typecheck passes
```

**Progress log:** `docs/progress/sessions/[date]/B0-1-focus-island-state.md`

---

#### Task B0.2 — Remove `isEditorDirty` from StageProvider; add `isEditorOpen`

**Purpose:** Replace the semantically incorrect `focusedNodeId` usage as "is editor open" with a clean boolean, and remove `isEditorDirty` from the stage context.

**Files and systems:**
- `src/builder/stage/StageProvider.tsx`
- `src/builder/stage/stageContext.types.ts`
- `src/builder/BuilderPage.tsx`
- `src/builder/islands/EditorViewerIsland/useEditorPanel.ts`

**Required behaviour:**
- Remove `isEditorDirty` and `setIsEditorDirty` from StageProvider and stageContext.types.ts
- Add `isEditorOpen: boolean` and `setIsEditorOpen: (v: boolean) => void` to StageProvider and types
- In `BuilderPage.tsx`: replace `hasFocusedNode` with `isEditorOpen` from context
- In `useEditorPanel.ts`: call `setIsEditorOpen(true)` when a session opens, `setIsEditorOpen(false)` when all sessions are closed
- Move dirty-state tracking (`isEditorDirty`) to local state inside `useEditorPanel.ts`

**Preserve:** Editor column width animation (was driven by `hasFocusedNode` → now driven by `isEditorOpen`)

**Do not touch:** `card.registry.ts`, any card component, `readiness.rules.ts`

**Acceptance criteria:**
```
□ grep -rn "focusedNodeId" src/builder/ → used nowhere for layout decisions
□ grep -rn "isEditorDirty" src/builder/stage/ → 0 results
□ isEditorOpen in stageContext.types.ts
□ Editor column transitions between 4.5rem (closed) and 25rem (open) correctly
□ npm run typecheck passes
```

**Progress log:** `docs/progress/sessions/[date]/B0-2-editor-open-state.md`

---

### Sprint B-FIL — File Preview Migration ✅ BLD-FIL-001

**Owner:** Gemini (UI relocation) + Codex (state wiring)  
**Objective:** Move file preview functionality from ViewHelperIsland into Project Meta Island → Files section. Zero regression. View Context island shell left empty but intact.  
**Preconditions:** B0 complete.

**This sprint is a prerequisite for Sprint B8 (View Context). View Context content cannot be built on top of a shell that still contains file preview logic.**

---

#### Task B-FIL.1 — Extract file preview logic into a shared hook (Codex)

**Purpose:** Decouple file preview state from ViewHelperIsland so it can be moved without rewriting.

**Files:**
- `src/builder/islands/ViewHelperIsland/useViewHelper.ts`
- `src/builder/islands/MetadataIsland/useFilePreview.ts` (CREATE)

**Required behaviour:**
- Create `useFilePreview.ts` by extracting the following from `useViewHelper.ts`:
  - `isPreviewOpen` state
  - `previewUrl`, `previewTitle`, `previewContentType`, `previewEmbedAllowed` states
  - `createdObjectUrlRef` and its cleanup `useEffect`
  - `handleFileChange`, `handleRemotePreview`, `handleClosePreview` functions
- `useViewHelper.ts` retains only: `isExpanded`, `setIsExpanded`
- `useFilePreview.ts` is a standalone hook, no imports from builder-specific files

**Preserve:** Existing cleanup behaviour (URL.revokeObjectURL on unmount)

**Do not touch:** ViewHelperIsland.tsx (rendered UI — changed in B-FIL.2), MetadataIsland.tsx (changed in B-FIL.3)

**Acceptance criteria:**
```
□ useFilePreview.ts exists in MetadataIsland/ folder
□ useFilePreview.ts exports: { isPreviewOpen, previewUrl, previewTitle, previewContentType, previewEmbedAllowed, handleFileChange, handleRemotePreview, handleClosePreview }
□ useViewHelper.ts reduced to isExpanded + setIsExpanded only
□ npm run typecheck passes
```

---

#### Task B-FIL.2 — Remove file preview from ViewHelperIsland (Gemini)

**Purpose:** Strip file preview UI from ViewHelperIsland. Also remove location jumper and keyboard shortcuts (those belong to a workspace helper, not a timeline-specific View Context island). Leave only the island pill/shell that B8 will repopulate.

**Files:**
- `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx`

**Required behaviour:**
- Remove from the expanded popup content:
  - "File & URL Preview" section (local file input + remote URL input + Preview button)
  - "Location Jumper" section
  - "Keyboard Shortcuts" section
  - Quick Summary Counts (phases/actions/tasks)
- Remove imports: `Navigation2`, `HelpCircle`, `CheckCircle`, `handleScrollToPhase`, `phases`, `actionCards`, `tasks` from `useViewHelperScrollers`
- Keep: the island pill button, the expanded popup shell (motion.div with resize), the header bar, close button, footer label
- The popup content body should be empty with a placeholder: `<p className="text-xs opacity-40 p-4">View Context content coming in Sprint B8.</p>`
- Import `useViewHelper` (the slimmed version from B-FIL.1) instead of the old version

**Preserve:** Popup shell dimensions, animation, pill appearance, z-index, positioning logic

**Do not touch:** `useViewHelper.ts` (already updated in B-FIL.1), `useViewHelperScrollers.ts`, `StickyPopupShell.tsx`

**Acceptance criteria:**
```
□ ViewHelperIsland renders the pill correctly in Timeline view
□ Expanding shows empty popup with placeholder text
□ No file input elements in ViewHelperIsland.tsx
□ No location jumper in ViewHelperIsland.tsx
□ StickyPopupShell preview popup NOT rendered in ViewHelperIsland
□ npm run typecheck passes
```

---

#### Task B-FIL.3 — Add Files section with file preview to MetadataIsland (Gemini)

**Purpose:** The Files count in MetadataDetailsContent becomes a clickable trigger that opens a fixed popup. The popup lists project files and provides the file preview functionality (moved from ViewHelper).

**Files:**
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx` (CREATE)
- `src/builder/islands/MetadataIsland/MetadataDetailsContent.tsx` (EDIT)
- `src/builder/islands/MetadataIsland/MetadataIsland.tsx` (EDIT — pass filesCount and attachments)

**Required behaviour:**
- `MetadataFilesPopup.tsx` (≤120 lines):
  - Props: `isOpen`, `onClose`, `attachments: FileAttachment[]`, and all from `useFilePreview`
  - Shows a fixed glass popup (not sticky/resizable in V1 — ❓ resizable behaviour is an open decision)
  - Lists all `attachments` (title + source badge + open button)
  - "Open local file" input and "Open remote URL" input with Preview button — moved from ViewHelper
  - File preview renders using `StickyPopupShell` (same as before)
  - Close button
- `MetadataDetailsContent.tsx`:
  - The Paperclip + count `<div>` becomes `<button>` that calls `onFilesClick()`
  - Add prop: `onFilesClick: () => void`
- `MetadataIsland.tsx`:
  - Import `useFilePreview`
  - Add `isFilesOpen` local state
  - Pass `isFilesOpen`, `setIsFilesOpen(false)`, `attachments`, and file preview props to `MetadataFilesPopup`
  - Pass `onFilesClick={() => setIsFilesOpen(true)}` to `MetadataDetailsContent`

**Preserve:** All existing MetadataIsland behaviour (status transitions, date picker, team count, view tabs)

**Do not touch:** `useViewHelper.ts`, `ViewHelperIsland.tsx`, `StickyPopupShell.tsx`, `readiness.rules.ts`, any card component

**Acceptance criteria:**
```
□ Clicking the Paperclip/files area in MetadataIsland opens MetadataFilesPopup
□ MetadataFilesPopup lists version attachments
□ Local file input opens preview via StickyPopupShell
□ Remote URL input opens preview via StickyPopupShell
□ File preview closes correctly
□ No file preview UI in ViewHelperIsland
□ BLD-FIL-001 confirmed: View Context has zero file preview functionality
□ npm run typecheck passes
```

**Progress log:** `docs/progress/sessions/[date]/B-FIL-file-preview-migration.md`

---

### Sprint B-CRD — CardShell Parallel States + Task Popup ✅ BLD-CRD-INT-002

**Owner:** Codex (long-press + state model) + Gemini (popup UI)  
**Objective:** Establish the parallel-state interaction model in CardShell. Task popup and expanded state are independent systems.  
**Preconditions:** B0 complete.  
**This sprint is a prerequisite for B5 (editor sessions require the long-press trigger).**

---

#### Task B-CRD.1 — Add long-press detection to CardShell (Codex)

**Purpose:** Long press (400ms hold ⏱, <4px movement ❓) on a Task card triggers `onLongPress`. Drag start cancels the timer.

**Files:**
- `src/builder/cards/CardShell.tsx`
- `src/builder/cards/useCardDrag.ts`

**Required behaviour:**
Add to `useCardDrag`:
```typescript
// Long press detection
const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const pointerStartPos = useRef<{ x: number; y: number } | null>(null);
const LONG_PRESS_MS = 400; // ⏱ temporary assumption

function startLongPress(e: React.PointerEvent, onLongPress?: () => void) {
  pointerStartPos.current = { x: e.clientX, y: e.clientY };
  if (!onLongPress) return;
  longPressTimerRef.current = setTimeout(() => onLongPress(), LONG_PRESS_MS);
}

function cancelLongPress() {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }
}

// In handleDragStart: call cancelLongPress()
// In handlePointerMove: if movement > 4px (❓ open decision), call cancelLongPress()
```

Add to `CardShell`:
- New optional prop: `onLongPress?: () => void`
- Pass to `useCardDrag` options
- Wire `onPointerDown` to `startLongPress`, `onPointerUp` to `cancelLongPress`

**Preserve:** All existing drag behaviour. Long-press must not fire during normal click or drag.

**Do not touch:** `handleCardDrop.ts`, `card.registry.ts`, `readiness.rules.ts`, any island component

**Acceptance criteria:**
```
□ Holding a Task card for 400ms without moving fires onLongPress callback
□ Starting a drag within 400ms cancels the long-press timer
□ Normal single-click and double-click unaffected
□ onLongPress prop is optional — no change to Phase/Action cards
□ npm run typecheck passes
```

---

#### Task B-CRD.2 — Add parallel popup state to TaskCard (Codex)

**Purpose:** Establish independent state tracking for popup open/closed, separate from expanded state (BLD-CRD-INT-002).

**Files:**
- `src/builder/cards/templates/task/TaskCard.tsx`

**Required behaviour:**
- Add `const [isPopupOpen, setIsPopupOpen] = useState(false)` to TaskCard
- Single click (in `onClick` handler, which currently calls `onSelect`): also call `setIsPopupOpen(true)`
- Double click (already handled by CardShell `handleDoubleClick`): does NOT affect `isPopupOpen`
- Pass `isPopupOpen` and `onClosePopup={() => setIsPopupOpen(false)}` to `TaskReadOnlyPopup` (created in B-CRD.3)
- Pass `onLongPress={() => openInEditor(task.id)}` to `CardShell` (editor open function wired in B5)

**Preserve:** Existing click → select behaviour. Double-click expand behaviour in CardShell is unchanged.

**Critical:** Popup open does NOT affect `expandedNodeIds`. Expanded state does NOT close popup. These are independent. (BLD-CRD-INT-002)

**Do not touch:** `CardShell.tsx` (except the new props from B-CRD.1), `useCardDrag.ts`, `card.registry.ts`

**Acceptance criteria:**
```
□ Single click: card is selected AND isPopupOpen becomes true
□ Double click: card expand toggles AND isPopupOpen is unaffected
□ With popup open, double-clicking expands card while keeping popup open
□ With card expanded, single-clicking elsewhere opens popup — expansion unaffected
□ npm run typecheck passes
```

---

#### Task B-CRD.3 — Create TaskReadOnlyPopup (Gemini)

**Purpose:** Visual read-only popup shown on Task single-click.

**Files:**
- `src/builder/cards/templates/task/TaskReadOnlyPopup.tsx` (CREATE)

**Required behaviour:**
- Props: `task: TaskCardData`, `isOpen: boolean`, `onClose: () => void`
- When `isOpen` is false: returns null
- Renders as a fixed-position glass panel positioned near the Task card (🟡 position is a technical recommendation — anchor to card via portal or relative positioning)
- Content:
  - Task name (bold)
  - Channel pill (using existing `ChannelPill.tsx`)
  - Sender / Receiver (display names from IDs)
  - Date display (mode + value)
  - Readiness badge (use `PhaseReadinessBadge` pattern or shared component)
  - Subtask count
- Close button (X) in top-right
- Click outside closes popup (use `useRef` + document `mousedown` listener, remove on close)
- Uses `ui/surfaces/GlassSurface.tsx` for the glass container

**Preserve:** No existing files affected — this is a new file only.

**Do not touch:** `CardShell.tsx`, `useCardDrag.ts`, `TaskCard.tsx` (except adding the import)

**Popup dimensions:** ❓ Open product decision — use 280px width, auto height as a technical default until decided.

**Acceptance criteria:**
```
□ TaskReadOnlyPopup.tsx exists, ≤ 100 lines
□ Popup renders with glass surface
□ Shows task name, channel, sender, receiver, date, readiness, subtask count
□ Close button closes popup
□ Clicking outside closes popup
□ BLD-CRD-INT-002: popup open/close never affects card expanded state
□ npm run typecheck passes
```

**Progress log:** `docs/progress/sessions/[date]/B-CRD-card-parallel-states.md`

---

### Sprint B1 — Builder Loading Shell

**Owner:** Gemini  
**Preconditions:** B0 complete.

#### Task B1.1 — Create BuilderLoadingShell and replace text placeholder

**Purpose:** Replace "Preparing workspace" text with a skeleton that matches the three-row builder layout. Prevent layout jumps on data arrival.

**Files:**
- `src/builder/BuilderLoadingShell.tsx` (CREATE)
- `src/builder/BuilderPage.tsx` (EDIT — swap placeholder)

**Required behaviour:**
- `BuilderLoadingShell` renders the same three-row grid as `BuilderWorkspaceContent`
- Row 1: glass pill skeleton (same height as MetadataIsland, ~64px)
- Row 2: left column skeleton (56px — editor collapsed), centre with 3 phase-width skeleton columns, right column skeleton (56px — focus island)
- Row 3: three island pill skeletons
- Skeletons use CSS shimmer animation (not JS)
- Skeleton colours from `brand/tokens.ts` — no hardcoded hex
- Error state: dark glass container with error message and retry button (not text in a `<section>`)
- Dimensions of skeleton rows must match live workspace exactly (same padding, gap, row heights)

**Do not touch:** Any island, card, or stage component.

**Acceptance criteria:**
```
□ BuilderLoadingShell.tsx ≤ 80 lines
□ No "Preparing workspace" text visible anywhere
□ Skeleton uses identical row heights and gaps to the live workspace
□ Shimmer is CSS-only animation
□ No layout shift when data arrives (skeleton → live)
□ Error state shows retry button
□ npm run typecheck passes
```

---

### Sprint B2 — Stage Sizing

**Owner:** Gemini  
**Preconditions:** B0 complete.

#### Task B2.1 — Remove fixed max-width from StageCore

**Purpose:** Stage should fill available horizontal space rather than being capped at 1280px.

**Files:**
- `src/builder/stage/StageCore.tsx`

**Required behaviour:**
- Remove `max-w-[1280px]` from the canvas wrapper `div` inside StageCore
- Replace with `w-full h-full` — outer flex container already bounds the width
- Keep `max-h-[620px]` only if needed to prevent stage from growing taller than Row 2 — verify in testing
- `pointer-events-auto`, `overflow-hidden`, `transition-all` must remain

**Do not touch:** `StageProvider.tsx`, `KanbanView.tsx`, any card component

**Acceptance criteria:**
```
□ At 1440px screen with editor closed: stage fills available width
□ Phase cards not cut off on right edge at default density
□ Stage does not overflow vertically
□ Editor column open + stage side-by-side: stage narrows correctly
□ npm run typecheck passes
```

---

### Sprint B3 — Kanban Density

**Owner:** Gemini  
**Preconditions:** B2 complete.

#### Task B3.1 — Correct phase column widths for 14-inch MacBook target density

**Purpose:** At 1440×900 (14-inch MacBook), three expanded Phase cards should be visible without horizontal scrolling. ❓ Exact card dimensions are an open product decision — this sprint uses technical defaults.

**Files:**
- `src/builder/stage/views/KanbanView.tsx`
- `src/builder/cards/templates/phase/PhaseCard.tsx`

**Required behaviour:**
- Phase column width: use fluid sizing. At 1440px stage (≈1300px after islands), three columns + two gaps of 24px = `(1300 - 48) / 3 ≈ 417px`. Use `w-[400px] min-w-[400px]` as a starting default (❓ final value awaits product decision on card dimensions)
- When editor opens (stage narrows to ~875px): three phases may not all be visible — horizontal scroll should engage
- Phase card height: `h-full` — fills Row 2 height correctly
- Collapsed phase: keep existing `w-[72px]` pill

**Do not touch:** `CardShell.tsx`, `card.registry.ts`, `useCardDrag.ts`

**Acceptance criteria:**
```
□ Three expanded phase cards visible at 1440px without horizontal scrolling
□ Collapsed phase shows as 72px pill
□ Phase height fills Row 2 (no overflow below)
□ npm run typecheck passes
```

---

### Sprint B4 — Newly Created Card Reveal

**Owner:** Codex  
**Preconditions:** B-CRD complete.

#### Task B4.1 — Bring newly created cards into view and temporarily select them

**Purpose:** ✅ When a new card is created: newly-created feedback, brought into view, temporarily selected, then auto-deselected.

**Files:**
- `src/actions/phase.actions.ts`
- `src/actions/action.actions.ts`
- `src/actions/task.actions.ts`
- `src/builder/stage/StageProvider.tsx`

**Required behaviour:**
- After `createPhase`, `createAction`, `createTask` succeed: add the new node ID to `selectedNodeIds`
- After 1500ms: remove the new ID from `selectedNodeIds` (auto-deselect)
- `isJustCreated` timer in `CardShell` already handles the visual highlight — wire the selection to use the same node ID
- For sequences (multiple created/duplicated): reveal sequentially from first to last

**Preserve:** Existing highlight timer in CardShell (850ms). This is additive — selection lasts longer than the highlight.

**Do not touch:** `CardShell.tsx`, `card.registry.ts`, `readiness.rules.ts`

**Acceptance criteria:**
```
□ Creating a Phase: new Phase selected + highlight effect for ~850ms
□ After ~1.5s: auto-deselects
□ Creating an Action: same behaviour
□ Creating a Task: same behaviour
□ npm run typecheck passes
```

---

### Sprint B5 — Editor Multi-Session Model

**Owner:** Codex (state) + Gemini (pill UI)  
**Preconditions:** B0 and B-CRD complete.

---

#### Task B5.1 — Session state model (Codex)

**Purpose:** Replace single-task editor with multi-session state. Unsaved sessions must never be silently replaced. ✅

**Files:**
- `src/builder/islands/EditorViewerIsland/useEditorPanel.ts`

**Required behaviour:**

```typescript
interface EditorSession {
  taskId: string;
  isMinimized: boolean;
  hasDraft: boolean;      // whether unsaved changes exist in this session
  openedAt: number;       // timestamp for ordering
}

// State in useEditorPanel:
const [sessions, setSessions] = useState<EditorSession[]>([]);
const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

// openSession(taskId): 
//   If session for taskId exists → restore it (setActiveTaskId)
//   If sessions.length < 5 → add new session
//   If sessions.length === 5 → do NOT silently replace; set a local error state
//     errorMessage = "Maximum sessions open. Please close a session before opening a new task."
// minimizeSession(taskId): set isMinimized = true; if this was active, setActiveTaskId(null)
// closeSession(taskId): 
//   If session has hasDraft = true: require explicit discard confirmation (do not auto-close)
//   Remove session; setActiveTaskId to next available session or null
// switchSession(taskId): set isMinimized=false for taskId; setActiveTaskId(taskId)
```

Maximum sessions: 5 ⏱ (temporary assumption — exact limit is an open product decision)  
Unsaved session must never be silently replaced or discarded ✅

**Preserve:** Existing `useEditorGuard.ts` logic (unsaved changes guard before navigation)

**Acceptance criteria:**
```
□ openSession adds a session entry
□ Opening a 6th session shows error message, does not replace existing session
□ minimizeSession sets isMinimized without clearing draft state
□ closeSession with hasDraft=true does not close without explicit discard
□ npm run typecheck passes
```

---

#### Task B5.2 — Session pill UI (Gemini)

**Purpose:** Minimised sessions appear as round pills near the Editor Island collapsed state.

**Files:**
- `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx`
- `src/builder/islands/EditorViewerIsland/EditorSessionPill.tsx` (CREATE)

**Required behaviour:**
- When `sessions` has a minimised entry: render an `EditorSessionPill` for each
- Pills appear above/beside the Editor island collapsed icon
- Each pill: first character of task name + readiness colour dot
- Clicking a pill calls `switchSession(taskId)`
- When active session exists and is not minimised: editor expands to 25rem (existing behaviour)
- When all sessions minimised: editor returns to 4.5rem collapsed

**Do not touch:** `useEditorPanel.ts` (updated in B5.1), `useEditorDraft.ts`, `CardShell.tsx`

**Acceptance criteria:**
```
□ EditorSessionPill.tsx ≤ 50 lines
□ Minimise button returns editor to collapsed state + shows pill
□ Clicking pill restores the editor to that session
□ Multiple pills stack correctly
□ npm run typecheck passes
```

---

### Sprint B6 — Selection Island: Presentation Mode + Delete Confirmation

**Owner:** Codex  
**Preconditions:** B0 complete.

---

#### Task B6.1 — Presentation mode engine (Codex)

**Purpose:** ✅ Single selection: clicking count in SelectionIsland triggers presentation mode. V1: single selection only ⏱.

**Files:**
- `src/builder/islands/SelectionIsland/usePresentationMode.ts` (CREATE)
- `src/builder/stage/StageProvider.tsx`
- `src/builder/stage/stageContext.types.ts`
- `src/builder/islands/SelectionIsland/SelectionIsland.tsx`
- `src/builder/islands/SelectionIsland/SelectionLabel.tsx`

**Required behaviour:**

Add to StageProvider: `isPresentationActive: boolean`, `enterPresentationMode()`, `exitPresentationMode()`

```typescript
// usePresentationMode.ts
function enterPresentationMode(selectedId: string) {
  // 1. Store current expandedNodeIds as previousExpandedIds (ref, not state)
  // 2. Find ancestors of selectedId in nodes
  // 3. Set expandedNodeIds = [...ancestors, selectedId]
  // 4. Set isolatedNodeIds = null (remove isolation if active)
  // 5. Set isPresentationActive = true
  // 6. Scroll selected card into centre view (use scrollIntoView on the card's DOM element)
}

function exitPresentationMode() {
  // 1. Restore expandedNodeIds from previousExpandedIds ref
  // 2. Set isPresentationActive = false
}
```

In `SelectionLabel.tsx`:
- When `selectedNodeIds.length === 1` and `!isPresentationActive`: the count is a `<button>` that calls `enterPresentationMode`
- When `isPresentationActive`: show an "Exit Presentation" indicator

**Multi-selection presentation mode:** ❓ open decision — V1 deferred ⏱. No button shown when multiple cards selected.

**Preserve:** Expand/collapse/duplicate/delete buttons in SelectionIsland

**Acceptance criteria:**
```
□ Single card selected → count is clickable
□ Clicking count: unrelated cards collapse, selected card visible in centre
□ Exit: previous expanded states exactly restored
□ Multiple cards selected: no presentation mode button shown
□ npm run typecheck passes
```

---

#### Task B6.2 — Delete confirmation (Codex)

**Purpose:** ✅ Confirmation required when deleting multiple items or ready items.

**Files:**
- `src/builder/islands/SelectionIsland/SelectionIsland.tsx`
- `src/builder/islands/SelectionIsland/SelectionButtons.tsx`
- `src/builder/islands/SelectionIsland/DeleteConfirmation.tsx` (CREATE)

**Required behaviour:**
- `DeleteConfirmation.tsx`: small inline glass panel (not a modal) with "Delete [N] items?" and Delete/Cancel buttons
- Show when: `selectedNodeIds.length > 1` OR any selected node has `readiness.state === 'ready'`
- Clicking Delete: fires existing `handleDeleteSelected`
- Clicking Cancel: hides the confirmation
- Otherwise: Delete fires immediately (single non-ready item)

**Acceptance criteria:**
```
□ Deleting 2+ items shows inline confirmation
□ Deleting a ready Phase/Action/Task shows inline confirmation
□ Deleting a single non-ready item fires immediately
□ Cancel dismisses without deleting
□ npm run typecheck passes
```

---

### Sprint B7 — Focus Island: Applied State + AND/OR

**Owner:** Gemini  
**Preconditions:** B0 complete.

#### Task B7.1 — Applied filter summary on collapsed pill

**Files:**
- `src/builder/islands/FocusIsland/FocusIsland.tsx`
- `src/builder/islands/BuilderIslandShell.tsx`

**Required behaviour:**
- When FocusIsland is collapsed and active filters exist: show a small count badge on the collapsed pill
- Badge uses accent colour, shows the number of active filters
- "Active filter" means: at least one value is selected in any Focus category

**Acceptance criteria:**
```
□ Collapsed FocusIsland with 1 active filter: shows badge "1"
□ Two filters: badge shows "2"
□ No filters: no badge
□ npm run typecheck passes
```

---

#### Task B7.2 — AND/OR toggle

**Files:**
- `src/builder/islands/FocusIsland/FocusIsland.tsx`
- `src/builder/islands/FocusIsland/options/WeekOption/WeekOption.tsx`
- `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx`

**Required behaviour:**
- When 2+ Focus filters are active: show `[AND] [OR]` toggle inside expanded FocusIsland
- Default: AND ✅
- `focusMode: 'and' | 'or'` as local state in FocusIsland
- Pass `focusMode` as prop to WeekOption and PropertyOption (they control isolation logic)

**Do not touch:** `focus.engine.ts`, `focus/useFocus.ts`

**Acceptance criteria:**
```
□ Single filter active: no AND/OR toggle visible
□ Two filters active: AND/OR toggle appears
□ Default is AND
□ Toggle switches between AND and OR visually
□ npm run typecheck passes
```

---

### Sprint B8 — View Context Island ✅

**Owner:** Gemini (UI) + Codex (drag-to-Day assignment)  
**Preconditions:** B-FIL complete (ViewHelperIsland shell is empty of file preview logic).

---

#### Task B8.1 — View Context task list UI (Gemini)

**Purpose:** ✅ Replace ViewHelperIsland content with a Kanban-style list of undated Tasks. Zero file preview functionality. (BLD-FIL-001)

**Files:**
- `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx` (EDIT)
- `src/builder/islands/ViewHelperIsland/ViewContextTaskList.tsx` (CREATE)
- `src/builder/islands/ViewHelperIsland/ViewContextTaskItem.tsx` (CREATE)

**Required behaviour:**
- View Context is Timeline-only (current `if (view === 'kanban') return null` stays) ✅
- Expanded popup content:
  - Header: "View Context" title
  - List of Tasks with `date.mode === 'unset'` — grouped by Phase > Action
  - Each Task item: channel pill, task name, action name, phase name (breadcrumb)
  - Each Task item is draggable: `beginCardDrag(event, { id: task.id, kind: 'task', fromViewContext: true }, 'move')`
  - Tasks with dates set: displayed greyed/disabled, not draggable
  - Empty state: "All tasks have dates assigned."
- Import task data from `useViewHelperScrollers.ts` (already queries nodes, has `tasks`)

**Confirmed:** Zero file preview UI, zero keyboard shortcuts, zero location jumper in this component (BLD-FIL-001)

**Do not touch:** `useViewHelper.ts`, `StickyPopupShell.tsx`, `handleCardDrop.ts`

**Acceptance criteria:**
```
□ ViewHelperIsland shows undated task list when expanded in Timeline
□ Tasks grouped by Phase > Action
□ Assigned tasks shown greyed
□ No file preview, no keyboard shortcuts, no location jumper in ViewHelperIsland.tsx
□ BLD-FIL-001 confirmed
□ npm run typecheck passes
```

---

#### Task B8.2 — Drag-to-Day task assignment (Codex)

**Purpose:** ✅ Dropping a View Context task onto a Day assigns the Day's date to the Task.

**Files:**
- `src/builder/stage/views/DayGridCard.tsx`
- `src/builder/stage/views/useDayGridDrag.ts`
- `src/actions/task.actions.ts`

**Required behaviour:**
- In `useDayGridDrag.ts`: detect when the drag payload has `fromViewContext: true`
- On drop: call `actions.updateTask({ taskId: payload.id, changes: { date: { mode: 'fixed', date: dayDateString } } })`
- Task does NOT change `actionId` — it stays in its Phase/Action structure
- After update: task's `date.mode` is no longer `'unset'` → it becomes disabled in ViewContextTaskList

**Preserve:** Existing day-grid drag for task rescheduling

**Acceptance criteria:**
```
□ Dragging a task from View Context onto a Day sets task.date to fixed + day's date
□ Task then appears in Day card in Timeline
□ Task becomes disabled (greyed) in View Context
□ Task remains in its original Phase/Action
□ npm run typecheck passes
```

---

### Sprint B9 — Multi-Select Drag Grouping (Codex)

**Preconditions:** B-CRD complete (drag payload already handles `ids` array).

#### Task B9.1 — Multi-card drag group

**Files:**
- `src/builder/cards/useCardDrag.ts`
- `src/actions/phase.actions.ts`, `action.actions.ts`, `task.actions.ts`

**Required behaviour:**
- `beginCardDrag` already passes `ids` array — when multi-selected, `ids = selectedNodeIds`
- In drop handlers: if `ids.length > 1` and all same kind, move all in preserved visual order
- Mixed-level selection: drag behaves as single-card (only the dragged card moves)

**Acceptance criteria:**
```
□ Three tasks selected, drag one → all three move to target
□ Phase + Action selected, drag Phase → only Phase moves
□ Internal visual order preserved after multi-move
□ npm run typecheck passes
```

---

### Sprint B10 — View Transition Animation (Gemini)

**Preconditions:** B2 complete.

#### Task B10.1 — Animate view switch

**Files:**
- `src/builder/stage/StageCore.tsx`
- `src/ui/motion/effects.registry.ts`

**Required behaviour:**
- Wrap `<Renderer>` in `<AnimatePresence mode="wait">`
- Each renderer has `key={view}`
- Add `viewTransitionIn` and `viewTransitionOut` to effects registry
- Kanban → Timeline: current view translates left + fades, new view enters from right + fades
- Timeline → Kanban: reverse
- Duration: ❓ open product decision — use 250ms as technical default ⏱

**Animation durations:** ❓ open product decision.

**Do not touch:** Card components, StageProvider, any island

**Acceptance criteria:**
```
□ View switch has smooth directional animation
□ Selection state preserved after transition
□ No layout jump during transition
□ npm run typecheck passes
```

---

### Sprint B11 — Day Readiness (Codex)

#### Task B11.1 — Add getDayReadiness to readiness.rules.ts

**Files:**
- `src/rules/readiness.rules.ts`
- `src/builder/stage/views/DayGridCard.tsx`

**Required behaviour:**
```typescript
export function getDayReadiness(dayDate: string, allTasks: Task[]): ReadinessResult {
  const dayTasks = allTasks.filter(t =>
    t.date.mode === 'fixed' && t.date.date === dayDate
  );
  // Empty day: ❓ open product decision — default to ready (no work = nothing incomplete)
  if (dayTasks.length === 0) return { state: 'ready', reasons: [] };
  const results = dayTasks.map(getTaskReadiness);
  const reasons = results.flatMap(r => r.reasons);
  return { state: reasons.length > 0 ? 'incomplete' : 'ready', reasons };
}
```

Empty Day readiness: ❓ open product decision. Temporary default: ready.

Wire into `DayGridCard` to show a readiness indicator (use existing `PhaseReadinessBadge` or shared component).

**Acceptance criteria:**
```
□ getDayReadiness exported from readiness.rules.ts
□ Day with all ready tasks: ready indicator
□ Day with incomplete tasks: incomplete indicator
□ Empty day: ready (temporary default ⏱)
□ npm run typecheck passes
```

---

### Sprint B12 — Visual Polish (Gemini)

**Preconditions:** B1–B11 complete.  
**Scope:** Only card templates, island content files, `brand/index.css`. No hooks, state, or interaction logic.

Areas:
1. Phase card header typography and icon alignment
2. Action card compact/expanded visual states
3. Task card property indicator row alignment
4. Footer island visual consistency (all three same register)
5. Empty state: zero phases in Kanban
6. Empty state: zero tasks on a Day
7. Light mode full pass
8. Dark mode consistency
9. Loading → content transition smoothness
10. MetadataFilesPopup visual polish (matches brand system)

---

### Sprint B13 — Regression and Acceptance Review

**Owner:** Product owner  
**Preconditions:** B12 complete.

#### Pixel-perfect review checklist

| Scenario | Screen | What to verify |
|---|---|---|
| Empty version | 14-inch MacBook | Empty state, no layout issues |
| 3 expanded phases, 2 actions, 3 tasks each | 14-inch MacBook | Default density without horizontal scroll |
| Editor open, 3 phases visible | 14-inch MacBook | Stage narrows correctly, phases still accessible |
| Task single click | Any | Popup appears, card selected, expand state unaffected |
| Task double click with popup open | Any | Card expands, popup stays open |
| Task long press 400ms | Any | Editor session opens |
| 2 editor sessions, 1 minimised | Any | Pills appear, restore works |
| 6th session attempt | Any | Error message, no silent replacement |
| Presentation mode | Any | Collapse/expand/restore correct |
| Exit presentation mode | Any | Previous states restored exactly |
| Focus filter applied, island collapsed | Any | Count badge shows on pill |
| Focus AND/OR toggle | Any | Toggle appears with 2+ filters |
| View Context: drag task to day | Timeline | Task assigned, greys out in View Context |
| File preview from MetadataIsland Files | Any | Preview opens in StickyPopupShell |
| No file preview in ViewHelperIsland | Any | Confirmed absent |
| Drag phase to distant position | Kanban | Edge scroll triggers, correct drop |
| Multi-select 3 tasks, drag | Kanban | All 3 move |
| View switch Kanban → Timeline | Any | Smooth animation, selection preserved |
| Day with incomplete tasks | Timeline | Readiness indicator shows |
| Loading state | Any | Skeleton renders, no text placeholder |
| Light mode | All scenarios | All elements legible |
| Dark mode | All scenarios | All elements legible |

#### Screenshot capture requirements

Capture and save after each of these sprints:
- After B3: Kanban default density at 1440px
- After B-CRD: Task popup open + card expanded simultaneously
- After B5: Editor with 2 sessions, 1 minimised (pills visible)
- After B6: Presentation mode active
- After B8: View Context open in Timeline with task list
- After B-FIL: MetadataIsland Files popup with file preview
- After B12: Full builder light mode and dark mode

---

## 15. Gemini Execution Guidance

### Session setup template

```
You are working on the DCX Manager — a React/TypeScript campaign planning workspace.

READ FIRST: The complete AGENTS.md (pasted below).

Your task this session is Sprint [ID]: [Title].
Requirement identifiers covered: [list from matrix]

Task specification:
[paste full task from this document]

Current file contents (read these before writing anything):
[paste each file listed in "Files and systems" in full]

Type files you must reference:
[paste relevant types — always include types/domain.ts when task touches data]

After completing your work:
1. List every acceptance criterion and confirm it is met
2. List any files you changed that are NOT in the task scope — explain why
3. Write your progress log entry in the required format (see AGENTS.md §12)
4. State the line count (wc -l equivalent) for every file you created or changed
```

### What Gemini must always produce

1. Every changed file in FULL (not as a diff)
2. Real line count for each file
3. Confirmation of each acceptance criterion (pass/fail per item)
4. Files changed outside scope (must be zero or justified)
5. Full progress log entry

### Common failure modes and prevention

| Failure mode | Prevention |
|---|---|
| Invents types | Provide `types/domain.ts` in full for any task touching typed data |
| Misses consumer import updates | After each new file, explicitly say: "Check all files that imported the old version of [file] and update them" |
| Edits out-of-scope files | Include "Do not touch" list in every task |
| Omits log entry | Include log format in every task prompt |
| Self-reports green without verifying | Remind: "Confirm each acceptance criterion individually, not as a group" |

---

## 16. Codex Execution Guidance

Codex receives per task:
1. Task specification
2. All relevant files in full
3. Relevant type files (`types/domain.ts`, `stageContext.types.ts` as appropriate)
4. Existing test file if one covers the changed area

For StageProvider changes: provide `stageContext.types.ts` first, update types, then update `StageProvider.tsx`. Types always before implementation.

For action changes: provide `types/domain.ts`, `types/builder-node.types.ts`, and the relevant action file. Require typecheck confirmation in output.

---

## 17. Testing and Visual Validation

### Per sprint

```bash
npm run typecheck    # must pass — 0 errors — after every task
```

### After B-CRD

Product owner verifies manually:
- Task single-click: popup opens, card selected, expand unaffected (BLD-CRD-INT-002)
- Task double-click with popup open: expand toggles, popup stays (BLD-CRD-INT-002)
- Existing drag-drop still works (create Phase, Action, Task — drag each)

### After B-FIL

Product owner verifies:
- File preview accessible from MetadataIsland → Files (BLD-FIL-001)
- No file preview in ViewHelperIsland (BLD-FIL-001)

### After B8

Product owner verifies:
- View Context shows undated tasks in Timeline
- Drag task to day assigns date
- No file preview in View Context (BLD-FIL-001)

### After B12

Full pixel-perfect review checklist (Sprint B13).

### Maintained test files

- `cards/__tests__/handleCardDrop.test.ts` — must pass after B-CRD
- `cards/__tests__/cardDrag.helpers.test.ts` — must pass after B9
- `import/__tests__/import.helpers.test.ts` — must pass throughout

---

## 18. Risks and Rollback Plan

| Risk | Likelihood | Sprint | Mitigation |
|---|---|---|---|
| B5 multi-session breaks single-task editor | Medium | B5 | Codex part first; Gemini pills second; rollback = revert useEditorPanel.ts only |
| B6 presentation mode corrupts expanded state | Medium | B6 | usePresentationMode.ts isolated; rollback = revert that file only |
| B-FIL migration regressions in MetadataIsland | Medium | B-FIL | Task B-FIL.1 (extract) before B-FIL.2/3 (UI); regression check after B-FIL.1 |
| B8 View Context interferes with Day drag | Medium | B8 | Codex part (B8.2) tested before Gemini applies UI (B8.1) |
| Gemini edits out-of-scope files | High | Every Gemini sprint | Include "Do not touch" list in every prompt |
| StageProvider re-renders after B0 | Low | B0 | Codex-only; visual smoke immediately after |

Rollback: every sprint is a bounded git commit. Revert the sprint's commits if gates fail. Prior sprints are not affected.

---

## 19. Definition of Done

The DCX Builder V1 is complete when all of the following are confirmed:

### BLD-FIL-001 — File preview relocation ✅
- [ ] File preview functionality accessible from Project Meta Island → Files section
- [ ] File preview: sticky resizable panel, multiple sessions, minimise/restore
- [ ] View Context contains zero file preview functionality
- [ ] MetadataIsland files section confirmed working — no regression
- [ ] Old ViewHelper file preview code fully removed

### BLD-CRD-INT-002 — Independent card states ✅
- [ ] Single click on Task: selects AND opens read-only popup
- [ ] Double click: toggles expand/collapse, popup state unaffected
- [ ] Popup open + card expanded: coexist without conflict
- [ ] Closing popup does not affect expanded state
- [ ] Expanding/collapsing does not close popup
- [ ] CardShell supports independent interaction layers

### Interaction model
- [ ] Long press on Task (400ms ⏱): opens editor session
- [ ] Drag Task to Editor Island: opens editor session
- [ ] Newly created card: highlight → briefly selected → auto-deselected

### Editor
- [ ] Up to 5 simultaneous editor sessions ⏱
- [ ] Minimised sessions shown as pills
- [ ] Clicking pill restores session
- [ ] Unsaved session never silently replaced or discarded ✅

### Selection
- [ ] Presentation mode: collapse unrelated, centre selected, restore on exit
- [ ] V1 single-selection only ⏱
- [ ] Delete with confirmation for multiple or ready items

### Focus
- [ ] Applied filter summary badge on collapsed island pill
- [ ] AND/OR toggle when 2+ filters active
- [ ] Default AND ✅

### View Context ✅
- [ ] Shows undated Tasks in Timeline
- [ ] Grouped by Phase → Action
- [ ] Drag-to-Day assigns date
- [ ] Assigned Tasks disabled in View Context
- [ ] Zero file preview in View Context

### Loading
- [ ] Skeleton loading shell — no text placeholder, no layout jump
- [ ] Error state shows retry button

### Readiness
- [ ] Day readiness calculated and displayed
- [ ] Empty Day: ready ⏱ (pending final product decision)

### Views
- [ ] Kanban density correct on 14-inch MacBook
- [ ] Timeline weekly/monthly functional with Day readiness
- [ ] View transition animation

### Quality
- [ ] `npm run typecheck` passes — 0 errors
- [ ] All existing tests pass
- [ ] Pixel-perfect review checklist complete (Sprint B13)
- [ ] Light mode and dark mode reviewed
- [ ] All open product decisions (❓) logged in a follow-up decisions register

---

## 20. Open Decisions Register

These must not be silently decided. Log the outcome in `docs/decisions/open-decisions.md` when resolved:

| ID | Decision | Blocking sprint | Default used |
|---|---|---|---|
| OD-001 | Maximum editor sessions (exact limit beyond 5) | After B5 | 5 ⏱ |
| OD-002 | Empty Day readiness (no tasks = ready or n/a?) | B11 | Ready ⏱ |
| OD-003 | Long-press movement threshold (exact px) | B-CRD | 4px ⏱ |
| OD-004 | Multi-selection presentation mode | After B6 | Deferred V2 🔮 |
| OD-005 | Task popup dimensions and anchor position | B-CRD.3 | 280px width, auto height ⏱ |
| OD-006 | Phase/Action/Task card dimensions at breakpoints | B3 | 400px phase ⏱ |
| OD-007 | View transition animation duration | B10 | 250ms ⏱ |
| OD-008 | Files popup: fixed or resizable? | B-FIL.3 | Fixed in V1 ⏱ |
| OD-009 | Selection presentation: scroll behaviour per object type | B6 | scrollIntoView centre ⏱ |

---

*DCX Builder Final Execution Plan v2 — June 2026 — Sprint B0 cleared for Codex*
