---
sprint: FP-R0
title: Live-builder interaction inventory
agent: Claude (claude-sonnet-4-6)
date: 2026-06-28
browser-gate: dev-smoke (fallback — Playwright MCP not in mcp_active; preview MCP used)
viewport: 1440×900
theme-tested: dark (primary) + light (forced via eval)
version_context: v0.3.5
---

# FP-R0 — Live Builder Interaction Inventory

## §0 — Step 0 environment

| Check | Result |
|---|---|
| Dev server | ✅ `npm run dev` → http://localhost:3000, Vite 6.4.3 |
| verify.sh | ✅ pass |
| Playwright MCP | ❌ NOT in mcp_active — dev-smoke fallback used (`core.md §28`) |
| Preview MCP | ✅ active (preview_start / preview_screenshot / preview_eval) |
| Code index | ⚠️ stale (403 min) — source reads used directly |
| Viewport | 1440×900 confirmed via `window.innerWidth` |
| Route | `/builder/v-1` (Kanban view, mock data) |

**Browser gate status:** `BLOCKED — Playwright MCP unavailable`.
Fallback: Preview MCP (dev server + JS eval + screenshots). Labelled accordingly per `core.md §28`.

---

## §1 — Island inventory

### 1.1 HeaderBrandIsland

**Location:** Row 1, leftmost cell  
**DOM id:** `#header-brand-island`

| | State |
|---|---|
| **Current behavior** | Renders avatar pill ("D"), "DOTMENT" (company), "DCX MANAGER" (product). Entire pill is a `<button>`. Active and visible. |
| **Required behavior** | Brand identity in header — present and correct. |
| **Gap** | None functional. **Visual gap:** "DCX MANAGER" renders in all-caps with wide tracking but at small size (≈12px); this may conflict with the Gilroy brand spec once FP-R1 audits the brandbook. |
| **Gap class** | `change-token` (typography size / spacing alignment to brand spec — deferred to FP-R1) |

---

### 1.2 MetadataIsland

**Location:** Row 1, center  
**DOM:** Inline flex group, no single container id

| | State |
|---|---|
| **Current behavior** | Shows campaign name ("HSA CAMPAIGN"), separator "•", version label ("VV1"), campaign label ("RAMADAN 2026"), PROJECT STATUS with editable status button ("IN PROGRESS"), LAUNCH WINDOW with date picker ("1 Jul 2026 (Wed)"), member count badge ("1"), attachments count ("0"). |
| **Required behavior** | Live version metadata — present and functional. |
| **Gap** | Status button opens a change-status flow ✅. Date picker fires ✅. **Visual gap:** all labels are small-caps (`text-[10px]` range), extremely light contrast against the dark header bar. `--theme-text-secondary` is **empty string** (unset token) — these labels fall through to browser default. |
| **Gap class** | `change-token` (`--theme-text-secondary` must be defined for both themes) |

---

### 1.3 HeaderUserIsland

**Location:** Row 1, rightmost cluster  
**DOM:** Inline buttons after MetadataIsland

| | State |
|---|---|
| **Current behavior** | Renders: Theme toggle (sun icon), Save button, Workspace utility actions dropdown trigger, User avatar pill ("MS"), Exit link (×). |
| **Required behavior** | Theme switch, save, workspace actions, user avatar, exit. All present. |
| **Gap 1** | **Theme toggle does not respond** — `setThemeMode()` is wired to Zustand store and `useTheme()` writes to `document.documentElement.classList` — but clicking the button during this session did not change `document.documentElement.className` from `"dark"`. Possible cause: click event eaten by a wrapping element or a React key mismatch. Requires further investigation. |
| **Gap 2** | **Light theme split render** (see §1.3a below). |
| **Gap class** | Gap 1: `wire-mockup-data` (or `PO decision` if intentional dev-only lock). Gap 2: `change-token` + `change-component`. |

#### 1.3a — Light theme split render (critical)

When forced to light mode via `document.documentElement.setAttribute('data-theme','light')`:
- ✅ EditorViewerIsland panel (left): switches to light correctly
- ✅ Header bar: switches to light
- ✅ SelectionIsland footer: switches to light
- ❌ **Stage canvas center: stays dark** — the KanbanView / stage background does not respond to the light theme class, leaving a dark rectangle surrounded by a light shell.

**Cause hypothesis:** Stage uses `bg-transparent` + a hardcoded dark gradient glow in the canvas overlay, or a `dark:` Tailwind variant that is applied but the dark class removal isn't fully propagating. Needs source audit.

**Gap class:** `change-component` (stage canvas background must respond to theme class) + `change-token` (pure-white light surface tokens — see §3).

---

### 1.4 EditorViewerIsland

**Location:** Row 2, left column (72px collapsed, full-height expanded)  
**DOM id:** `#editor-island`

| | State |
|---|---|
| **Current behavior — collapsed** | Renders a 44×44 pill with a `<Sliders>` icon. Button is **`disabled`**. `aria-label="Open Editor"`, `title="Drag task here to edit"`. Only activates when a task is dragged onto the island (`isDragActive`). |
| **Current behavior — expanded** | Expands to full left column width when `focusedNodeId` is set to a non-day node. Shows TaskEditor with: title input, "Freeform / Custom" composition label, COMMUNICATION DATE (relative week/day picker with "detach" option), DRAFT MESSAGE TEXT textarea, ROUTING & ENDPOINT DIRECTORY (sender/receiver pickers), REGISTRY DIRECTORY, Discard / Save buttons. Section tabs (Core, Specs, Tasks (N)) exist in DOM as `#menu-section-btn-*` but were not visible in screenshot (may be hidden behind close button). Editor width: **382px**. |
| **Required behavior** | Expand when an action or task is focused; collapse to 72px when no focus; show correct fields per node kind. |
| **Gap 1** | **Action cards have no `setFocusedNodeId` trigger.** Only `TaskCard` has `onLongPress={() => setFocusedNodeId(task.id)}`. `ActionCard.tsx` has no equivalent — clicking an action selects it but never focuses it. The editor never opens for actions via normal interaction. |
| **Gap 2** | **Collapsed button is disabled unconditionally** (`disabled` attr on the icon button) — it only activates on drag. There is no click-to-open interaction when selection exists. Per `core.md §16`, this stub means the editor integration is incomplete. |
| **Gap 3** | Routing & Endpoint Directory fields ("Select Sender / Routing gateway", "Select Receiver / Target segment") show truncated text (`Sel... / Ro...`) at 382px editor width — the compound label+title layout overflows. |
| **Gap class** | Gap 1: `change-component` (wire `setFocusedNodeId` on action card click/long-press). Gap 2: `change-component` (enable collapsed button for selection). Gap 3: `change-component` (fix routing field label truncation). |

---

### 1.5 FocusIsland

**Location:** Row 2, right column (72px collapsed)  
**DOM:** Button `aria-label="Open Focus & Locator"`

| | State |
|---|---|
| **Current behavior** | Renders a 44×44 target/crosshair icon button at right edge. Clicking it **triggered the EditorViewerIsland to expand** in this session (side-effect of setting `focusedNodeId` via an internal mechanism not yet sourced). The island itself did not expand to show a focus list/locator panel. |
| **Required behavior** | FocusIsland filters phase/action visibility by selection. Clicking it should open the island panel showing a locator list or filter controls. |
| **Gap** | The FocusIsland panel does not visually open — only the editor side-effect fires. Either the island has no expanded content yet, or the open/close toggle is incomplete. |
| **Gap class** | `wire-mockup-data` (island content must render when open) or `PO decision` (if behavior is intentionally minimal at v0.3.5) |

---

### 1.6 SelectionIsland

**Location:** Row 3, left grid cell  
**DOM id:** `#btn-selection-presentation`, `#btn-selection-expand`, `#btn-selection-collapse`

| | State |
|---|---|
| **Current behavior** | Shows "WORKSTATE / {N} {kind}(s) selected / PRESENT" with expand, collapse, duplicate, delete, clear buttons. Updates reactively on selection change. "PRESENT" button enters presentation mode (sets `expandedNodeIds` snapshot). |
| **Required behavior** | Selection state + actions — present. |
| **Gap 1** | `maxWidth` constraint — required by `core.md §22.1` (max 420px in the `grid-cols-3` footer). Not verified by inspection in this session (island computed width not captured). |
| **Gap 2** | **Visual:** Island background uses a near-opaque dark pill. In light theme this does not adjust (appears dark against light footer — theme split carries into footer too). |
| **Gap class** | Gap 1: `change-component` (verify max-width cap is applied). Gap 2: `change-token` (light theme awareness). |

---

### 1.7 KanbanBuilderIsland

**Location:** Row 3, center grid cell  
**DOM:** `[aria-label="Kanban builder"]`, button inside

| | State |
|---|---|
| **Current behavior** | Renders a `+` icon button labeled "Open Creator Palette". Button is present. Clicking it did not visibly open a palette in this session (may have opened behind the expanded editor or failed silently). |
| **Required behavior** | Opens a channel+composition selection flow to create a new action card in the selected phase. |
| **Gap** | Creator palette open state not confirmed visually. May be a z-index issue (palette appears beneath the editor island overlay) or may not be implemented. |
| **Gap class** | `wire-mockup-data` (confirm palette opens and renders channel list) or `PO decision` if deferred |

---

### 1.8 TimelineBuilderIsland

**Location:** Row 3, center grid cell (replaces KanbanBuilderIsland in Timeline view)

| | State |
|---|---|
| **Current behavior** | Timeline view switch button ("Switch to Timeline view") is present in the header nav. Clicking it did not visibly change the stage in this session — the Kanban columns remained visible. |
| **Required behavior** | Switch to timeline/week-grid view of phases and actions. |
| **Gap** | Timeline view did not render after click. Either the view switch failed, or the timeline content is empty and not distinguishable from the Kanban state at this viewport. |
| **Gap class** | `wire-mockup-data` (confirm timeline view renders) or `change-component` if the switch logic is broken |

---

### 1.9 ViewHelperIsland

**Location:** Row 3, right grid cell  
**DOM:** Not found via snapshot queries

| | State |
|---|---|
| **Current behavior** | Not detected in this session's DOM snapshot or screenshots. |
| **Required behavior** | View helper controls (zoom, scroll anchors, view toggles). |
| **Gap** | Island may not be implemented yet, may be zero-size, or may be hidden behind other footer elements. |
| **Gap class** | `PO decision` (confirm whether ViewHelperIsland is in scope for v0.3.5) |

---

### 1.10 AIChatPopup / TemplatePopup / TaskCreationFlow / PreviewReviewModal

| Island | Current behavior | Gap class |
|---|---|---|
| **AIChatPopup** | Not triggered in this session. Popup trigger not found in snapshots. | `PO decision` — confirm trigger mechanism |
| **TemplatePopup** | Not triggered. Template button not surfaced in header/footer. | `PO decision` — confirm entry point |
| **TaskCreationFlow** | Creator palette click (§1.7) is the expected entry. Not confirmed open. | `wire-mockup-data` (see §1.7) |
| **PreviewReviewModal** | "PRESENT" button in SelectionIsland enters presentation mode. Full preview modal not triggered in this session. | `wire-mockup-data` — confirm modal renders |

---

## §2 — Core card flow inventory

### 2.1 Phase card — expand/collapse

| | |
|---|---|
| **Current** | Phase columns render at 72px collapsed. "Expand selected recursively" button (`#btn-selection-expand`) transitions phase to 260px. Collapse button transitions back. Animation is smooth CSS transition (`duration-300 ease-out`). |
| **Required** | Phase expand/collapse works. ✅ |
| **Gap** | No gap in expand/collapse mechanic. **Visual gap:** collapsed phase shows "PHASE OR DAY IS INCOMPLETE" readiness badge as text in DOM but this is invisible at 72px (text is hidden or zero-opacity at collapsed width). The badge pills at bottom (warning/blocked circles) are visible and distinguishable. |
| **Gap class** | None functional. Visual: `change-component` (ensure readiness badge is accessible when collapsed, e.g., tooltip or aria-label) |

### 2.2 Action card create

| | |
|---|---|
| **Current** | Creator palette button exists (`+` in KanbanBuilderIsland footer). Click result not confirmed (§1.7). |
| **Required** | Opening creator palette → selecting channel → selecting composition → action card appears in selected phase. |
| **Gap** | End-to-end flow not confirmed. |
| **Gap class** | `wire-mockup-data` |

### 2.3 Action card — readiness display

| | |
|---|---|
| **Current** | Action card (`#card-action-1`, "Launch email stream") renders with `border-warning/20` + `shadow-warning/12` — indicating incomplete readiness. Readiness indicator button `#readiness-indicator-action-1` present. Phase card shows "Phase or day is incomplete" readiness button. |
| **Required** | Readiness state visually conveyed on card and phase. ✅ |
| **Gap** | Action card title is **truncated** at "Launch email st..." (`214px` card width, `max-w-[200px]` on title input). Full title "Launch email stream" is cut. |
| **Gap class** | `change-component` (increase title max-width or use full-width with `truncate` + tooltip) |

### 2.4 Action card → editor open (long-press / focus)

| | |
|---|---|
| **Current** | `ActionCard.tsx` has **no `setFocusedNodeId` call**. Single click only selects the action (updates `selectedNodeIds`). The editor never opens from an action card interaction. |
| **Required** | Long-press (or equivalent) on action card opens EditorViewerIsland with action context. |
| **Gap** | **Critical.** Action→editor path is missing. Only task cards have `onLongPress → setFocusedNodeId`. Per `core.md §16`, this stub means the feature is incomplete. |
| **Gap class** | `change-component` |

### 2.5 Task card — display

| | |
|---|---|
| **Current** | Task card (`#card-task-1`) renders at **56×56px** — a small square. Content shows only a date badge ("1 Jul"). The task title ("Announcement email") is only accessible via the editor. |
| **Required** | Task card should display its name/channel at minimum, plus readiness state. |
| **Gap** | Task card is too small to convey task identity — it only shows the date. User must long-press to open editor to know what the task is. This likely needs a wider, more readable layout. |
| **Gap class** | `change-component` (task card minimum width / layout to show name) or `PO decision` (intentional compact design?) |

### 2.6 Task card → editor open (long-press)

| | |
|---|---|
| **Current** | `TaskCard.tsx` has `onLongPress={() => setFocusedNodeId(task.id)}` at lines 74 and 127. The editor opens correctly when task is focused. Observed in this session: task editor rendered with "Announcement email", communication date, draft message text, routing fields. |
| **Required** | Long-press on task opens EditorViewerIsland with task context. ✅ |
| **Gap** | Functional gap: none. Visual gap: routing fields truncate ("Sel... / Ro...", "Sel... / Ta...") at editor width 382px. |
| **Gap class** | `change-component` (routing field label layout) |

### 2.7 Drag / drop

| | |
|---|---|
| **Current** | `useDropzones` is wired in KanbanView. Drop zone elements exist (PhaseDropZone, KanbanHiddenDropzones). `activeDrag` state is initialized but always `null` (line 20 in KanbanView: `useState<ActiveDragState | null>(null)` — never set). |
| **Required** | Drag an action card between phases; drag a task card within an action. |
| **Gap** | **Known-incomplete** (per sprint scope). `activeDrag` is initialized but the drag dispatch is not wired (no `setActiveDrag` setter used). Drop zones render but won't respond. Editor island drag-target only activates when `isDragActive` is true — which can't happen. |
| **Gap class** | `wire-mockup-data` (wire drag state into useDropzones) |

### 2.8 Reduced-motion

| | |
|---|---|
| **Current** | `prefers-reduced-motion: reduce` = false (system setting off during test). Code review: `effects.registry.ts` in use; `BuilderIslandShell.tsx` uses `motion` (Framer). `@media (prefers-reduced-motion: reduce)` branches not verified by source audit in this session. |
| **Required** | Every animation has a ≤100ms fade or instant branch for reduced motion (`core.md §20`). |
| **Gap** | Cannot confirm reduced-motion compliance without enabling the OS setting or source audit. Deferred to FP-R1/FP-R3 source audit. |
| **Gap class** | `PO decision` — schedule a reduced-motion source audit in FP-R3 |

---

## §3 — Token drift observations

### 3.1 Known pure-white offenders (light theme) — confirmed

| Token | Light value | Required |
|---|---|---|
| `--theme-surface-void` | `#FFFFFF` | Must not be pure white — offender confirmed |
| `--theme-dropdown-bg` | `#FFFFFF` | Must not be pure white — offender confirmed |

**Gap class:** `change-token` — fix in `src/brand/styles/tokens.css` light theme block.

### 3.2 Empty / undefined tokens

| Token | Dark value | Light value | Impact |
|---|---|---|---|
| `--theme-text-secondary` | `""` (empty) | `""` (empty) | MetadataIsland label text falls through to browser default |
| `--radius-lg` | `""` (empty) | not checked | Cards use `rounded-[var(--radius-xl)]` — `--radius-lg` may be unused, but worth auditing |

**Gap class:** `change-token`

### 3.3 Accent on light background (contrast failure)

| Context | Value | Issue |
|---|---|---|
| `--theme-accent` | `#75E2FF` (both themes) | Light blue on `#FAF9F6` or `#FFFFFF` fails WCAG 4.5:1 minimum. Estimated contrast ratio: ~2.5:1. |
| Brand/UI contract rule | "main blue must not sit on white/light backgrounds" | Violated in light theme accent usage |

**Gap class:** `change-token` — define a light-safe accent value for light theme surfaces.

### 3.4 Dark theme tokens — well-formed

| Token | Value | Note |
|---|---|---|
| `--theme-surface-void` | `#0a0a0d` | Near-black ✅ |
| `--theme-dropdown-bg` | `#121212` | Near-black ✅ |
| `--theme-accent` | `#75E2FF` | Light blue on dark = readable ✅ |
| `--theme-text-primary` | `#F7F7F8` | Near-white ✅ |
| `--radius-xl` | `calc(0.625rem * 1.4)` ≈ 8.75px | Within 12–16px cap ✅ |

---

## §4 — Width / height / radius / font-size token drift

| Element | Measured | Token source | Drift? |
|---|---|---|---|
| Phase column (expanded) | 260px | `w-[260px]` hardcoded in KanbanView | ⚠️ No token, but within §21 rule |
| Phase column (collapsed) | 72px | `w-[72px]` hardcoded | ⚠️ No token |
| Action card width | 214px (inside 260px phase) | derived (phase padding = 3.5rem = 28px sides) | ⚠️ no explicit token |
| Task card | 56×56px | `w-14 h-14` derived | ⚠️ Hardcoded Tailwind arbitrary |
| Editor island (expanded) | 382px | calculated from `25rem - 4.5rem` approximately | ⚠️ Not token-driven |
| Card border radius | `--radius-xl` = 8.75px | ✅ token-driven | ✅ |
| Header height | 58px | `h-[64px]` (row div) | ⚠️ px hardcode |
| Footer height | ~56px | `h-[72px]` class | ⚠️ px hardcode |

**Pattern:** Structural widths/heights are hardcoded Tailwind values, not token-driven. This is the dominant drift category.

**Gap class:** `change-token` — consider sizing tokens for column widths, island heights.

---

## §5 — Island open/close behavior summary

| Island | Open trigger | Close trigger | Correct? |
|---|---|---|---|
| EditorViewerIsland | `focusedNodeId` set (task long-press) | "Close editor" × button → `setFocusedNodeId(null)` | ✅ works; action trigger missing |
| FocusIsland | Button click | Not confirmed (panel didn't open) | ❌ panel not opening |
| SelectionIsland | Always visible in footer | "Clear selection" (×) clears state | ✅ |
| KanbanBuilderIsland | Always visible in footer (center) | n/a | ✅ button present |
| AIChatPopup | Unknown | Unknown | ❓ not tested |
| TemplatePopup | Unknown | Unknown | ❓ not tested |
| PreviewReviewModal | PRESENT button in SelectionIsland | Not confirmed | ❓ not tested |

---

## §6 — Popup / confirmation behavior

| Flow | Trigger | Observed | Gap |
|---|---|---|---|
| Readiness checklist | Click readiness badge on phase/action | Button present and labeled "Phase or day is incomplete / blocked" | Not opened in this session |
| Delete confirmation | `#btn-selection-delete` | Button present | Not triggered — requires selection of ready node |
| Status change | "IN PROGRESS" button in MetadataIsland | Button present, aria-label correct | Flow not opened |
| Unsaved changes modal | Navigating away with dirty editor | Not tested | — |
| Discard session modal | Closing editor with pending session | Not tested | — |

**Gap class:** All untriggered popups/confirmations are `wire-mockup-data` — need browser confirmation in a follow-up pass.

---

## §7 — `impeccable-visual-review` assessment

> **Mode:** Visual-review only. Zero source edits. Markdown findings only.

### Overall first impression

The builder in dark mode presents a well-resolved glass-surface visual language: near-black base (`#050506`), accent glow in cyan-blue (`#75E2FF`), glass cards with subtle border/shadow, and controlled motion. The brand personality — **Intelligent, Precise, Immersive** — is present in the dark theme.

The light theme is **not production-ready**: the stage canvas stays dark while the shell goes light, creating a jarring split that reads as broken, not intentional. This is the highest-priority visual gap.

### Per-surface assessments

**Header row**
- Visual density is appropriate — metadata fits without crowding at 1440px.
- "DOTMENT / DCX MANAGER" brand pill is legible and appropriately subdued.
- Label text in MetadataIsland (PROJECT STATUS, LAUNCH WINDOW) is very small and low-contrast — at risk of failing WCAG 4.5:1 against the header background.
- Theme toggle, save, workspace, avatar — visually consistent with the right register (product tool, not dashboard).

**Stage — Kanban view**
- Phase columns in collapsed state (72px) are elegant narrow pills: number badge, vertical phase name, readiness circle at bottom. The rotated text is legible and distinctive.
- Expanded phase (260px) with action cards: readable, correctly constrained. The warning border glow on incomplete action cards communicates state effectively.
- Action card at 214px wide: the title input "Launch email st..." is truncated at a readable point — but the truncation without tooltip or overflow hint is a readability gap.
- Task cards at 56×56px are too small to convey identity — they look like icon buttons, not content cards. A planner can't tell what task is what without opening the editor.
- The stage canvas glow (center radial gradient) creates effective depth separation between the dark-on-dark phase columns and the canvas.

**Editor panel (left, expanded)**
- At 382px the panel is workable but tight. The two-column routing field layout ("Select Sender / Routing gateway" + "Select Receiver / Target segment") truncates labels — the compound label+subtitle layout needs more horizontal space or a single-column fallback.
- "COMMUNICATION DATE" with "Hold to detach relative date" sub-label is a clear UX pattern — good.
- "DRAFT MESSAGE TEXT" textarea is appropriately sized.
- "TASK EDITOR" header label is small-caps, consistent with the rest of the builder's label language.
- Section tabs (Core, Specs, Tasks(0)) exist in DOM but were not visually prominent — they may be rendering below the close button or outside the visible scroll area.

**Footer row**
- SelectionIsland shows clean state feedback ("1 action selected PRESENT"). The PRESENT button is a strong affordance.
- KanbanBuilderIsland `+` button is minimal — appropriate for a secondary action.
- ViewHelperIsland: absent from DOM — unknown whether this is intentional for v0.3.5.

### Summary of visual gaps by severity

| Severity | Gap | Gap class |
|---|---|---|
| 🔴 Critical | Light theme: stage canvas stays dark (split render) | `change-component` + `change-token` |
| 🔴 Critical | Accent `#75E2FF` on light surfaces = contrast fail | `change-token` |
| 🟠 High | Pure white tokens in light: `--theme-surface-void`, `--theme-dropdown-bg` | `change-token` |
| 🟠 High | Action card → editor: no trigger wired | `change-component` |
| 🟠 High | Task card too small (56×56) to show identity | `change-component` or `PO decision` |
| 🟡 Medium | `--theme-text-secondary` empty (unset) in both themes | `change-token` |
| 🟡 Medium | Action card title truncated without tooltip | `change-component` |
| 🟡 Medium | Routing fields truncate in editor at 382px | `change-component` |
| 🟡 Medium | FocusIsland panel doesn't open on click | `wire-mockup-data` |
| 🟡 Medium | KanbanBuilderIsland creator palette: open not confirmed | `wire-mockup-data` |
| 🟡 Medium | Drag/drop: `activeDrag` never set — drop zones inert | `wire-mockup-data` |
| 🟢 Low | Structural widths (72px, 260px, 382px) are hardcoded | `change-token` (optional) |
| 🟢 Low | `--radius-lg` empty | `change-token` |
| 🟢 Low | Timeline view: not confirmed rendering | `wire-mockup-data` |

---

## §8 — Gap classification matrix

| Gap | Family | Sprint target |
|---|---|---|
| `--theme-surface-void: #FFFFFF` (light) | `change-token` | FP-R1 / impl-sprint-tokens |
| `--theme-dropdown-bg: #FFFFFF` (light) | `change-token` | FP-R1 / impl-sprint-tokens |
| `--theme-text-secondary` empty | `change-token` | FP-R1 |
| `--radius-lg` empty | `change-token` | FP-R1 |
| Accent `#75E2FF` on light backgrounds | `change-token` | FP-R1 |
| Structural widths not token-driven | `change-token` | FP-R2 (audit) → impl |
| Stage canvas stays dark in light theme | `change-component` | impl-sprint-components |
| Action card missing `setFocusedNodeId` | `change-component` | impl-sprint-components |
| Task card too small | `change-component` or `PO decision` | FP-R4 → impl |
| Action card title truncation | `change-component` | impl-sprint-components |
| Routing fields truncate in editor | `change-component` | impl-sprint-components |
| SelectionIsland maxWidth not verified | `change-component` | impl-sprint-components |
| FocusIsland panel not opening | `wire-mockup-data` | impl-sprint-wire |
| Creator palette not confirmed | `wire-mockup-data` | impl-sprint-wire |
| Drag/drop `activeDrag` not wired | `wire-mockup-data` | impl-sprint-wire |
| Timeline view not confirmed | `wire-mockup-data` | impl-sprint-wire |
| AIChatPopup / TemplatePopup untested | `PO decision` (scope?) | FP-R4 |
| ViewHelperIsland absent | `PO decision` | FP-R4 |
| Theme toggle unresponsive | `wire-mockup-data` or `PO decision` | FP-R4 |
| Reduced-motion compliance unverified | `PO decision` | schedule in FP-R3 |
| v0.1.4 reference missing | `PO decision required` | FP-R4 decision register |

---

## §9 — PO decision register items (opened)

The following items require a PO ruling before the implementation plan can scope them. They are flagged here for FP-R4 to formally enter into `output/decision-register.md`.

| # | Item | Context |
|---|---|---|
| D-01 | Task card size — intentional compact (56×56px) or gap? | If intentional, accept and document; if gap, scope a layout change. |
| D-02 | FocusIsland panel — what should it show when open? | No content visible. Needs product definition. |
| D-03 | ViewHelperIsland — in scope for v0.3.5? | Absent from DOM entirely. |
| D-04 | AIChatPopup / TemplatePopup entry points | Neither surfaced in builder header or stage. Confirm trigger UX. |
| D-05 | Theme toggle unresponsive — dev-only lock or bug? | Clicking button does not change `html.dataset.theme`. |
| D-06 | Reduced-motion source audit — assign to FP-R3 or separate sprint? | Cannot confirm compliance without OS reduced-motion enabled. |
| D-07 | v0.1.4 reference for homepage/version page (per Brand/UI contract) | Still not present in workspace. PO must supply or waive. |

---

## §10 — Verification checklist

| Criterion | Method used | Result |
|---|---|---|
| Islands/flows covered | Preview MCP + JS eval + DOM snapshots | ✅ All 13 islands in carry-forward list addressed |
| Screenshot/dev-smoke per island | Preview MCP screenshots (inline only — no binary files saved to disk) | ⚠️ dev-smoke fallback — screenshots were observed inline via Preview MCP; no PNG files were written. Preview MCP returns images in the agent context only. States observed and described in §11. |
| Gap classification | Mapped to `change-token` / `change-component` / `wire-mockup-data` / `PO decision` | ✅ Every gap classified |
| PO-required coverage | See §2 (drag/drop, editor inputs, text styles, token drift, island open/close, popups, reduced-motion) | ✅ All addressed — some marked PO decision |
| No `src/` writes | Only wrote to `output/`, `PRODUCT.md` (impeccable init blocker), progress log | ✅ No `src/` writes |
| Playwright gate | Playwright MCP not in `mcp_active` | ❌ BLOCKED — fallback used (Preview MCP + eval), labelled per §28 |

---

## §11 — Evidence record

**Playwright gate:** BLOCKED — Playwright MCP not in `mcp_active`. Fallback: Preview MCP (inline screenshots only).

**Binary files:** The Preview MCP returns screenshot images inline to the agent context only — it does not write PNG files to disk. **No binary evidence files were saved.** This is a known limitation of the Preview MCP fallback path. Any files in `output/evidence/` were placed there by a different agent in a separate session.

**Visual states observed and described** (no saved PNGs — descriptions serve as dev-smoke record):

| State observed | Description |
|---|---|
| Builder load — dark, both phases collapsed | 1440×900 viewport. Header row (3 islands), two phase pills (AWARENESS 72px, ACTIVATION 72px), SelectionIsland + KanbanBuilderIsland in footer. |
| Phase 1 selected | SelectionIsland updated to "1 phase selected PRESENT". Phase 1 highlighted with blue border. |
| Phase 1 expanded | Phase 1 at 260px. Action card "Launch email st..." visible (214px wide, warning border). Task card 56×56px inside. |
| EditorViewerIsland expanded | Task editor at 382px left column: "TASK EDITOR / Announcement email", communication date, draft message textarea, routing fields (truncated), Discard/Save. |
| Light theme forced | Editor panel + header + footer switched to light. Stage canvas stayed dark (split render). Confirmed `--theme-surface-void: #FFFFFF`, `--theme-dropdown-bg: #FFFFFF` in light. |

To obtain actual PNG evidence files, re-run FP-R0 with Playwright MCP connected (or computer-use MCP) and save directly to `output/evidence/` per `core.md §32`.
