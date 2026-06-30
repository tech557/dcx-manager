# DCX Manager — AI Agent Instructions & Permanent Codegen Rules

## 1. Read This First
DCX Manager is a highly customized, visually striking React/Vite web application designed to help teams orchestrate and schedule digital content delivery campaigns (DCX). It operates with a responsive horizontal board view (Builder Canvas) and Kanban view to organize delivery phases, action modules/streams, and discrete delivery tasks. 

Every visual component in the application has been meticulously streamlined in a series of refactoring sprints to ensure architectural honesty, modularity, and tight alignment with a single design token system.

---

## 2. File Responsibility & Architectural Rules

You must strictly adhere to the following file responsibility matrix and code conventions. Any deviation from these rules represents a regression.

| Layer / File | Responsibility & Strict Rules |
| :--- | :--- |
| `src/styles/tokens.ts` | **Single Source of Truth** for all color, blur, radius, shadow, and motion constants. No custom color codes, shadows, or spring definitions should be written inline. Only use strings exported here. |
| `src/hooks/useTheme.ts` | **Unified Theme Provider**. Retrieve all theme properties (`surface`, `text`, `divider`, `inputBg`, etc.) and active theme status using the `useTheme()` hook. Never prop-rail `isDark` or manually compute color variants inline using `isDark ? "..." : "..."`. |
| `src/components/ui/GlassCard.tsx` | Standard glass overlay card used in high-level page views (e.g., `Home.tsx` and `VersionPage.tsx`). Never declare raw backdrop blurs directly inside list views or landing pages. |
| `src/components/ui/PopoverShell.tsx` | Standard floating tooltip, dropdown, datepicker, or popup overlay. Any floating UI popup must draw through this wrapper. |
| `src/components/ui/IslandCard.tsx` | Static content panel with a clean border, rounded corners, and elevated shadow — used when no expand/collapse transition is needed. |
| `src/pages/builder/components/elements/islands/BuilderIslandShell.tsx` | **Mandatory wrapper** for all expandable bottom/floating islands. No island may implement its own custom `motion.div` transition, springing mass, or expand/collapse toggle handling. |
| `src/pages/builder/components/elements/cards/BuilderCardShell.tsx` | **Mandatory wrapper** for all builder dashboard cards (`PhaseNode`, `ActionCard`, `FullTaskCard`, `SmallTaskCard`). This shell uniquely handles selection states, Cmd/Ctrl multi-selection, drag-and-drop state, and glowing highlights. |
| `src/types/domain.ts` | **Single Domain Type Schema** (`Task`, `Action`, `Phase`, `TaskDate`). Re-exported by `src/types.ts` for backward compatibility. |
| `src/utils/id.helpers.ts` | Core helper module owning safe ID and nanoid generation. |

### Absolute Negative Constraints (FORBIDDEN Patterns):
* **No Inline Glass/Blur Styling**: Never create standard glass panels using `backdrop-blur-3xl`, customized borders, or background transparency inline in the pages. You must compose them via `GlassCard`, `PopoverShell`, or using classes directly from `styles/tokens.ts`.
* **No Island/Card Boilerplate**: Never create an island from scratch. All islands *must* use `BuilderIslandShell`. All builder cards *must* use `BuilderCardShell`.
* **No `isDark` Prop-Drilling**: `isDark` must never be prop-drilled down the component tree past 2 levels. Use the `useTheme()` hook inside the relevant components.
* **No Stored Action/Task Counts**: Storing `taskCount`, `actionCount`, or derived counts in data structures is strictly forbidden. Always dynamically compute them at render-time using array lengths (e.g. `actionCards.length` or `tasks.length`).
* **No Window-Level Mutations**: Never mutate or store builder data, actions, or events directly on `(window as any)` or a global window handler. Leverage Zustand stores or custom DOM Events properly.
* **No `Date.now()` or `Math.random()` for IDs**: All generated elements must obtain unique, deterministic identifiers via `generateId()` from `src/utils/id.helpers.ts` (or `src/pages/builder/utils/...`).
* **No `@xyflow/react` Imports**: Do not import `Handle`, `Position`, `NodeProps`, or any other flow canvas classes from xyflow. The horizontal builder is an entirely custom HTML layout.
* **No Obsolete/Legacy Task Variables**: Do not extend any task interface or JSX rendering with legacy fields such as `communicationDate`, `isLinked`, `linkedWeek`, or `linkedDay`. Use the unified `task.date` schema.

---

## 3. Core Component System Reference

When adding or editing UI elements, match the requirement against the following standardized system components:

1. **`BuilderIslandShell`**: Designed for any bottom-bar or sliding overlay utilities (e.g., Focus, Selection, or Creator panels). It supports transition spring animation physics, custom collapsed/expanded dimensions, and automatic theme adaptation.
2. **`BuilderCardShell`**: Serves as the interactive chassis for all cards in the builder. It handles selection, multi-selection, drag triggers (notifying the timeline drop listeners), and the visual create-pulse highlight.
3. **`GlassCard`**: Ideal for high-level main views, card lists, landing pages, and status boards that sit outside the builder canvas.
4. **`PopoverShell`**: Used for all contextual hover, overlay, or dropdown actions (e.g., date-pickers, search dialogs, subtask selectors, index navigations). It mounts as `absolute z-50` with high-contrast borders and elevated shadow styling.
5. **`IslandCard`**: Best suited for rendering static sidebar columns, navigation guides, or telemetry status sections that do not collapse.

---

## 4. Workspaces & Folder Structure Guidelines

* `/src/components/` — Global shared components: forms (`CreateDCXForm`, `EditVersionForm`), input controls, and standard overlay buttons.
* `/src/pages/` — Top-level layout and entry pages (e.g., `Home.tsx`, `VersionPage.tsx`, `BuilderPage.tsx`). Keep page-level logic concise and delegate layout building to modular components.
* `/src/pages/builder/` — Contains highly specialized sub-views (`BuilderTimelineView.tsx`, `BuilderKanbanView.tsx`) and local modules.
* `/src/pages/builder/components/elements/cards/` — Structured folders for specific cards (`cards/day/`, `cards/phase/`, `cards/action/`, `cards/task/`).
* `/src/pages/builder/components/elements/islands/` — All interactive floating controls.
* `/src/styles/` — Style configurations, CSS rules, and design tokens.
* `/src/types/` — Standard typescript domain schemas.
* `/src/utils/` — Non-component utility functions (date calculators, ID generators, formatting).

---

## 5. Pre-Flight Coding Checklist

Before making ANY edit or compiling:
1. **Analyze Types First**: Inspect `src/types/domain.ts` and `src/types.ts` to ensure compatibility.
2. **Consult Style Tokens**: Open `src/styles/tokens.ts` and use the defined colors, blurs, and spring presets.
3. **Check for Existing Assemblies**: Never duplicate code. If an action requires computing dates, check `src/pages/builder/utils/dateHelper.ts`. If it involves timeline positioning, check `src/pages/builder/utils/timelineHelpers.ts`.
4. **Keep Components Small & Focused**: If a file grows past 400 lines, extract secondary functions, forms, and renderers to helper sub-components in the same folder.

---

## 6. Historical Regressions & Anti-Patterns to Avoid

This codebase has undergone extensive refactoring to overcome several major architectural flaws:
* **Direct Phase Array Mutation**: Previously, mutating `currentVersion.phases` directly broke React's rendering pipeline. Always use deep cloning or proper Zustand action setters.
* **Prop-Drilling `isDark`**: 6-level deep prop-drilling caused extreme visual noise and made style changes impossible. Always use `useTheme()`.
* **Ad-Hoc Selection Handlers**: Each card used to implement its own click selection and multi-selection logic. This is now fully encapsulated in `BuilderCardShell`.
* **Double Maintenance of Counter Cache**: Storing `taskCount` and `actionCount` fields in states and DB objects led to synchronization bugs when items were added/deleted. Defer these to computed array length queries in rendering.
