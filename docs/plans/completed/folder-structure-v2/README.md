---
plan: folder-structure-v2
status: completed
version_context: v0.3.4
created: 2026-06-26
updated: 2026-06-28
completed: 2026-06-28
prior-art: expired/src-structure-refactor, expired/src-structure-audit
depends-on: ux-discovery-v2 (completed), frontend-discovery-v2 (completed), backend-discovery-v2 (completed)
---

# Plan: Folder Structure v2

## Status: COMPLETED — P1–P6 complete; closed with documented debt on 2026-06-28. The P5 "editor-panel blocker" was audited as a FALSE ALARM (the "Open Editor" button is a disabled drag-drop hint; the editor opens via drag/long-press — already captured in P3 evidence), NOT a regression. P6 finished bounded lint cleanup, durable structure truth, discovery supersession, version/storage decisions, agent-doc coherence, and follow-up routing. See `output/P6-closeout-coherence.md`.

Discovery complete. All three discovery plans archived in `docs/plans/completed/`.
Sprint files are archived in `docs/plans/completed/folder-structure-v2/sprints/` (P1–P6).
Next-plan pointer: FE-final-discovery, FE-final-implementation, BE-final-discovery, and BE-final-implementation must start from `docs/product/decisions/src-structure-decision.md` and `docs/product/follow-ups/builder-follow-ups.md`.

**Audit round 2 response — `audit/2026-06-27-claude.md` (4 blocking) + `audit/2026-06-27-codex.md`
(6 blocking, supersedes its own earlier READY).** Both re-checked the plan against live `v0.3.4`
code. All blockers resolved:
- **P1 re-scoped to typography-size only.** Removed phantom `font-/shadow-/radius-[var]` migration
  (0 live occurrences, source vars don't exist). All **11** `--text-*` variants migrated (incl. the
  four `-plus` variants). Added a **scope-boundary table** giving every token category an explicit
  disposition; the **287** theme color/border/ring arbitraries are declared **intentionally retained**
  (theme-reactive), with a `P1b` named if the PO wants them migrated. UX2-R3 token tasks (6 tokens,
  26 hex, 3 dead classes, 3 dead exports) are now first-class deliverables.
- **P2 rewritten as reconciliation onto the existing `atoms/*`** (Badge/Chip/Input/ToggleGroup already
  exist, dated 2026-06-25) — no duplicate `TextInput.tsx`. Orphan deletion now removes barrel
  re-exports and excludes barrel/`FieldIndicator`-type false positives; Chip verified, not re-extracted.
- **P5 visual spec aligned to real P1 scope** (hard gate = P1 deliverables; retained arbitraries are
  accepted-by-policy, not failures). Stale facts fixed: shadcn **is** installed (`components.json`,
  alias `@/ui/shadcn`), Storybook installed. Builder V1 acceptance-criteria citation added.
- Advisories: baselines marked "as of v0.3.2 discovery, re-verify at Step 1"; dead-class names inlined
  in P1; the recurring `build-log-index.sh` mislabel retained in follow-ups.

**Earlier round-1 response (`audit/2026-06-26-codex.md` lineage):** added P5 readiness sprint, P4
mock-API completeness matrix (Step 8f), Step 0 + executable browser gates in every sprint, and the
`production-api-client-switch` follow-up. Those remain in place.

---

## Carry-forward contract — current structural state (READ BEFORE EVERY SPRINT)

**This section is a binding fact sheet. Every sprint's Step 0 must read it and the previous
sprint's `output/*.md` before touching code, and must update this section when it changes the
structure.** Each sprint builds on the *actual current tree*, never on the pre-plan baseline.

### Hard rule — REUSE, do not RECREATE (applies to every sprint)
Before creating any token, CSS class, component, hook, or file: **grep the current tree first and
reuse what exists.** Do **not** create a new one that duplicates or competes with an existing one.
The canonical homes are now:

| You need… | Canonical home (reuse this) | Never do |
|---|---|---|
| A color/surface/border value | a `--theme-*` token in `src/brand/styles/tokens.css` | hard-code a hex/rgba/rgb literal in a CSS rule or JSX |
| A typography size | a `text-dcx-*` utility (registered in `src/brand/styles/theme.css`) | reintroduce `text-[var(--text-*)]` arbitrary syntax |
| A global component CSS class | `src/brand/styles/components.css` | recreate `index.css` as a monolith or add a parallel CSS file |
| A base UI primitive | `src/ui/atoms/{Badge,Chip,Input,ToggleGroup}.tsx` (+ `atoms/index.ts`) | create a second base primitive (e.g. a new `TextInput.tsx`) |
| A token name in TS | `src/brand/tokens.ts` | redefine token objects deleted in P1 (`typographyTokens`/`radiusTokens`/`shadowTokens`) |

If something genuinely doesn't exist, add it to the canonical home above (e.g. a new token goes in
`styles/tokens.css`), and **record the addition in this section** so the next sprint inherits it.

### State after P1 (completed 2026-06-27, Codex) — these are now FACTS
- **`src/brand/index.css` is a 10-line entry point** (external `@import`s + the three partials +
  `@source not` lines). It is no longer a monolith. The real content lives in:
  - `src/brand/styles/theme.css` — `@custom-variant`, `@theme`, `@theme inline` (the `text-dcx-*` /
    `color-dcx-*` utility registrations). **Token *utilities* live here.**
  - `src/brand/styles/tokens.css` — `@font-face`, `:root`, `--theme-*` palette, `--text-*` sizes,
    shadcn oklch vars, `.dark` overrides. **The 136 `--theme-*` token *values* live here only.**
  - `src/brand/styles/components.css` — the global component/layout classes; **0 raw color literals**
    (every color is `var(--theme-*)`).
- **Typography is fully migrated:** 0 `text-[var(--text-*)]` left; every size is a `text-dcx-*`
  utility (the 11 variants incl. the four `-plus`). Do not reintroduce arbitrary typography.
- **P1 added a `--theme-component-*` token family** (nav/pill/header/editor surfaces, component
  borders/fills/text, ~34 tokens) to replace former in-rule literals. **Reuse these** — they cover the
  glass/surface/border values P2's GlassSurface/component work will need; do not re-invent them.
- **Existing atoms (created 2026-06-25, reuse — see P2):** `src/ui/atoms/{Badge,Chip,Input,ToggleGroup}.tsx`.
- **Retained-by-policy (do NOT migrate unless a sprint explicitly says so):** theme color/border/ring
  arbitrary `[var(--theme-*)]` (~311 live), arbitrary `shadow-[…]`/`rounded-[…]`/layout sizes.
- **Documented debt carried forward:** repo-wide lint backlog (157 problems, 0 introduced by P1);
  Playwright Chromium binary missing in this env (screenshot gates blocked — dev-smoke via HTTP 200).

### State after P2 (completed 2026-06-27, Codex) — these are now FACTS
- **Deleted orphaned component files:** `src/ui/LockBadge.tsx`, `src/ui/StatusBadge.tsx`,
  `src/ui/ReadinessBadge.tsx`, `src/builder/cards/FieldIndicator.tsx`,
  `src/ui/forms/inputs/DateInputTBD.tsx`, `src/ui/forms/inputs/DualInput.tsx`,
  `src/ui/forms/inputs/TextInputSmall.tsx`, `src/ui/forms/selects/SearchableSelect.tsx`,
  `src/ui/forms/selects/SearchableSelectIcons.tsx`, and
  `src/builder/cards/templates/day/DayCard.tsx`. The empty `templates/day/` folder and `.gitkeep`
  were also removed.
- **Barrels updated with deletions:** `src/ui/forms/inputs/index.ts` and
  `src/ui/forms/selects/index.ts` no longer export deleted files. `ReadinessBadge` now exists only
  as the domain wrapper `PhaseReadinessBadge`, which renders `atoms/Badge`.
- **Canonical component state after consolidation:**
  - `src/ui/atoms/Badge.tsx` owns badge variants: `default`, `status`, `readiness`, `lock`.
  - `src/ui/atoms/Input.tsx` owns base input styling and textarea support via `as="textarea"`;
    `src/ui/forms/inputs/` now contains only genuine compound wrappers (`ListInputLines.tsx`,
    `SpecsInput.tsx`) plus `index.ts`. Do not recreate `TextInput*.tsx`.
  - `src/ui/forms/selects/Select.tsx` is the governed generic select control; `CompletionStateSelect`
    remains as a domain-specific segmented completion-state control. `src/ui/forms/selects/` now has
    exactly `Select.tsx`, `CompletionStateSelect.tsx`, and `index.ts`.
  - `src/ui/atoms/ToggleGroup.tsx` already handles tab/toggle groups used by `ViewTabSwitcher` and
    `PhaseEditorSection`; `IslandToggleButton` intentionally remains a single animated `Chip`-based
    island action button, not a group toggle.
  - `src/ui/surfaces/GlassSurface.tsx` owns `radius: 'sm' | 'md' | 'lg'` and
    `intensity: 'low' | 'medium' | 'high'`, maps radius to existing `--radius-*` variables, and uses
    existing `--theme-*` tokens for reflection/surface colors. All live `GlassSurface` consumers pass
    `radius` and `intensity`.
  - `src/ui/atoms/Chip.tsx` was verified, not recreated. Clear duplicate metadata action/status pills
    now use `Chip`; circular icon buttons, dots, switches, skeleton pills, and domain quick-edit
    triggers remain intentionally bespoke.
- **P2 verification state:** typecheck PASS; focused lint on touched P2 files PASS; architecture PASS;
  tests PASS (27/27); build PASS; dev smoke PASS on `http://localhost:3002/` with HTTP 200.
- **Documented debt carried forward after P2:** full repo lint still fails with 156 known problems
  (149 errors, 7 warnings), down from the prior 157 after P2 removed its local lint regression.
  Playwright Chromium remains missing, so screenshot and browser-console capture gates are
  `BLOCKED — Playwright unavailable`; P2 used the allowed dev-smoke fallback. P5 must still capture
  the systematic 1440/1920/2560 visual baseline once browser tooling is operational.
  (Update: browser evidence was later captured via the Playwright MCP — 8 screenshots, 0 app console
  errors at 1440/1920 — so the P1+P2 browser debt is closed; the systematic P5 baseline still pending.)
- **Number refresh (P1-P2-final-audit, 2026-06-27):** retained theme color/border/ring arbitraries are
  now **~297 live** (the P1-section "~311" predates P2's file deletions); `text-dcx-*` usages are now
  **260** (was 272). These are deletions, not regressions; `text-[var(--text-*)]` is still **0**.

### Pre-P5 scaffolding — present but owned by NO sprint (do NOT delete as dead)
- `src/ui/shadcn/button.tsx` (a raw shadcn primitive, **0 consumers/adapter yet**),
  `src/stories/Button.stories.ts`, and the Storybook install were added during shadcn/Storybook setup.
  They are **pre-positioned for P5** (component-source governance / adapter seam) — P3 must **not**
  treat them as dead orphans, and feature code must **not** import `@/ui/shadcn/*` directly until P5
  defines the adapter. Track, don't remove.

### Structure authority is STALE (read before any structure work)
- `docs/product/decisions/src-structure-decision.md` describes a `src/components/` folder that **no
  longer exists** (merged into `src/ui/`) and lists primitives P2 deleted. It carries a ⚠️ STALE
  banner. Do **not** execute its D1/D2 moves; await a PO refresh. Current homes are listed in the P1/P2
  facts above.

### State after P3 code pass (2026-06-27, Codex) — pending opencode browser evidence
- **EditorViewer hook merge:** `useEditorPanel.ts`, `useEditorDraft.ts`, and `useEditorGuard.ts`
  were merged into `src/builder/islands/EditorViewerIsland/useEditorState.ts` (375 lines). The old
  hook files were deleted and `EditorViewerIsland.tsx` now consumes `useEditorState`.
- **Unused hooks removed:** `src/hooks/usePreferences.ts`, `src/hooks/usePermissions.ts`,
  `src/builder/focus/useFocus.ts`, `src/queries/users.queries.ts`, and orphaned
  `src/builder/focus/focus.engine.ts` were deleted after live consumer verification.
- **Stale-closure fixes:** `StageCore.tsx` cleanup handlers are stable callbacks declared before the
  cleanup effect. The discovery-era missing dependency findings in `useDayGridDrag.ts` and
  `DayTaskCreator.tsx` are no longer present in the live code.
- **EditorViewer `any` cleanup:** the EditorViewerIsland cluster has 0 explicit `any` hits. Repo-wide
  `no-explicit-any` lint hits are now 42, down from the P3 baseline of 63.
- **Drag state decision:** drag state is already delegated to `src/builder/stage/useDragState.ts`;
  no new `DragContext` was created because that would require a broad context-coupled migration.
- **Structure guard preserved:** shell files and atom/form/surface homes remain unchanged; pre-P5
  `src/ui/shadcn/button.tsx` and `src/stories/Button.stories.ts` remain intact.
- **P3 code gate state:** typecheck PASS, focused lint on touched P3 areas PASS, architecture PASS,
  tests PASS (27/27), build PASS, dev smoke PASS on `http://localhost:3000/`.
- **P3 documented debt / opencode handoff:** full repo lint still fails with 125 known problems
  (120 errors, 5 warnings). Codex could not run browser-interactive validation because local
  Playwright Chromium is missing. Opencode must still verify stage render, drag-and-drop,
  editor save/discard/pending-action flows, view switching, screenshots, and console output before
  P3 can be sprint-closed.

### State after P4 code pass (2026-06-28, Codex) — pending opencode browser/MCP evidence
- **All app-facing storage-backed services now route through `apiClient` -> `mockDispatch`:**
  `logs.service.ts`, `subtask-definitions.service.ts`, `channels.service.ts`, `access.service.ts`,
  `files.service.ts`, `versions.service.ts`, and `builder.service.ts`.
- **Old service storage seam removed:** `readMockJson` / `writeMockJson` were removed from
  `src/services/api-client.ts`; `src/utils/safe-storage.ts` was deleted. Grep proof:
  `readMockJson|writeMockJson` under `src/services/` = 0, `safe-storage|safeLocalStorage` under
  `src/` = 0, and `readMockJson|writeMockJson|localStorage` in `src/services/*.service.ts` = 0.
- **Retained dev/mock backend:** `src/services/mock-dispatch.ts` remains as the route dispatcher, and
  focused handlers live in `src/services/mock/*` to stay below file-size caps. `src/mock/*` fixture
  files are intentionally retained until the follow-up `production-api-client-switch` plan.
- **Mock API completeness matrix is recorded in**
  `docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md`: channels/compositions,
  builder, versions, files, activity logs, subtask definitions, and access are covered by mock routes;
  clickup and AI are explicitly labelled pure stubs, not hidden localStorage bypasses.
- **File attachment gap fixed:** `attachVersionFile` now persists onto the matching version's
  attachments through the mock backend.
- **No component/shell regression:** P4 did not change `src/ui/*` component homes or shell structure.
  It touched `useEditorState.ts` only to replace the deleted storage helper import with
  `src/utils/browser-storage.helpers.ts`; the pre-existing P3 file-size overage remains unchanged as
  documented debt, not a P4 backend refactor target.
- **P4 local gate state:** typecheck PASS; architecture PASS; tests PASS (27/27); build PASS; focused
  lint on touched files PASS. Full repo lint still fails with known backlog, now 119 problems
  (114 errors, 5 warnings), down from P3's 125.
- **P4 documented debt / opencode handoff:** browser/MCP proof is intentionally left for opencode per
  user request. Opencode must verify builder load, channel/composition flow, version metadata,
  file-attach persistence, mock-route network evidence, and console-error count using the configured
  browser/MCP stack.

### State after P5 governance + polish-gate pass (2026-06-28, Codex) — accepted after P6 false-alarm resolution
- **Component-source policy created:** `docs/product/component-source-policy.md` now governs when to
  use custom DCX components vs shadcn/MCP/library primitives. Custom remains default for brand-owned
  atoms/surfaces and domain controls; interaction-heavy generic primitives such as Dialog, Popover,
  Combobox/Command, and Tooltip are the first shadcn candidates.
- **shadcn boundary recorded:** raw shadcn primitives land in `src/ui/shadcn/`; feature code must not
  import `@/ui/shadcn/*` directly. Live P5 check found 0 feature imports of raw shadcn.
- **Adapter seam made explicit:** `src/ui/PopoverShell.tsx` now documents the stable adapter contract
  (`children`, `className?`, `width?`). Future shadcn/MCP popover swaps must stay behind this file so
  feature imports continue to use `@/ui/PopoverShell`.
- **P5 component inventory recorded:** `docs/plans/active/folder-structure-v2/output/P5-frontend-readiness.md`
  lists all 24 current `src/ui/**/*.tsx` files with role, prop contract summary, and consumer count.
- **Visual acceptance spec written before screenshots:** hard gate = P1 deliverables and real visual
  failures only: 0 `text-[var(--text-*)]`, 0 app-rendered raw hex, no clipping/overlap, readable
  supported theme states, and 0 console errors. Retained `[var(--theme-*)]`, arbitrary shadows,
  radii, and layout sizing are accepted-by-policy and must not be treated as failures.
- **P5 screenshots captured:** 6 screenshots were saved under
  `docs/plans/active/folder-structure-v2/output/evidence/P5-polish-baseline/` for 1440x900,
  1920x1080, and 2560x1440 in dark and light states. Browser console errors were 0 for all captured
  states, and browser-reported viewport overflow was false at all three sizes.
- **P5 editor blocker resolved by P6:** `Open Editor` is intentionally disabled because it is a
  drag-drop hint. The editor opens by dragging a task onto the editor island or via task long-press;
  P3 evidence already captured the editor-open state.
- **P5 local gate state:** typecheck PASS; architecture PASS; tests PASS (27/27); focused lint on the
  touched source file (`src/ui/PopoverShell.tsx`) PASS. Full repo lint still fails with the known
  backlog of 119 problems (114 errors, 5 warnings); P5 introduced no source lint finding.
- **No quarantined visual skill used:** P5 did not use `impeccable`; it followed the sprint's own
  visual acceptance spec.

### State after P6 closeout (2026-06-28, Codex) — plan archived with documented debt
- **P6 close verdict:** PASS WITH DOCUMENTED DEBT. Typecheck, verify script, architecture, tests
  (27/27), and build passed. Lint intentionally remains at 42 explicit `any` findings only and is
  routed to `typed-any-cleanup`.
- **Durable structural truth:** `docs/product/decisions/src-structure-decision.md` now records the
  live post-refactor tree, canonical UI homes, token policy, and mock backend seam.
- **v2 discovery outputs protected:** UX/FE/BE v2 discovery READMEs now carry superseded banners;
  future discovery plans must re-check the live tree.
- **Version/storage decisions recorded:** `docs/VERSION.md` remains authoritative at `v0.3.4`;
  `metadata.json` sync is PO-owned. Day-note/editor-draft browser storage remains temporary UI-local
  until BE-final-discovery/implementation decides whether it becomes backend app data.
- **Agent/doc coherence:** `impeccable` is visible as quarantined in `AGENTS.md` and `CLAUDE.md`.
  Durable follow-ups live in `docs/product/follow-ups/builder-follow-ups.md`.
- **Plan archive:** this plan moved to `docs/plans/completed/folder-structure-v2/`.

*(Update this block at the end of each sprint with what changed.)*

---

## The token problem — what "island texts" means

Typography size CSS variables (`--text-xs`, `--text-2xs`, etc. — 11 in total) are defined in
`src/brand/index.css` but consumed via Tailwind's arbitrary value syntax everywhere:

```tsx
className="text-[var(--text-xs)]"
```

~275 such usages exist across the codebase (live v0.3.4 count; discovery measured 274 at v0.3.2).
This is valid but verbose, bypasses IDE autocomplete, and makes agent-read code harder to scan.

The fix (P1) is to register these size vars as proper Tailwind v4 `@theme` utilities:
```css
@theme {
  --font-size-dcx-xs: var(--text-xs);
  --font-size-dcx-2xs: var(--text-2xs);
}
```
Then `text-[var(--text-xs)]` → `text-dcx-xs` everywhere. Clean, scannable, autocomplete-ready.

> **Scope (corrected 2026-06-27 audit).** P1 promotes **typography size only**. There is **no**
> equivalent treatment for font weight, border radius, or shadow: `font-[var(--font-*)]`,
> `shadow-[var(--shadow-*)]`, and `rounded-[var(--radius-*)]` each have **0 occurrences** in code,
> and the `--font-weight-*` / `--shadow-*` source vars don't exist. The large **color/border/ring**
> arbitrary surface (`[var(--theme-*)]`, ~287) is **intentionally retained** as arbitrary syntax
> because it is theme-reactive. See the P1 scope-boundary table and the metrics table below.

---

## Before starting — read prior art

This plan supersedes `src-structure-refactor`. Before executing any sprint:

1. Read `docs/plans/expired/src-structure-refactor/plan/README.md`
2. Read `docs/plans/expired/src-structure-refactor/plan/sprints/P1-design-tokens.md` — what P1 did
3. Check `docs/plans/expired/src-structure-refactor/output/` — what P1 actually produced

Then confirm the discovery outputs are complete before running sprints.

---

## Why this plan exists

P1 of `src-structure-refactor` completed (components migrated, dep-cruiser violations resolved).
P2–P4 were never executed. The current codebase (`v0.3.4`) has:

- A working folder structure post-P1, but lingering UX/token debt
- 26 raw hex values still in JSX (was 269 pre-P1)
- ~275 arbitrary `text-[var(--text-X)]` typography usages — the "island texts" problem (P1 migrates)
- ~287 arbitrary `[var(--theme-*)]` color/border/ring usages — theme-reactive, **intentionally retained** (not P1)
- 10 confirmed dead orphaned components not yet deleted (but the unified `atoms/*` already exist)
- 5 visual duplication groups (Input×7, Select×8, Toggle, Badge, Glass variants)
- 2 over-cap hook files in EditorViewerIsland (never split/merged after P1)
- 8 services still reading from localStorage — apiClient seam wired but unused
- 63 no-explicit-any violations in builder/ code (new since P1)

> All counts above are **as of v0.3.2 discovery unless marked live**; discovery ran at v0.3.2 and the
> plan is v0.3.4. Treat every number as a baseline — each sprint's Step 1 re-greps before editing.

---

## Sprint plan

| Sprint | Goal | Primary inputs | Executor |
|---|---|---|---|
| **P1 — Token system** | Promote 11 typography-size vars to `text-dcx-*`; replace 26 raw hex; add 6 tokens; delete 3 dead classes + 3 dead exports; **(re-opened)** tokenize ~49 in-rule literals in `index.css` + decompose it into partials | UX2-R1, UX2-R2, UX2-R3 | Codex |
| **P2 — Component consolidation** | Delete dead orphans; consolidate Input×7, Select×8, Toggle, Badge, Glass duplicates | UX2-R3, FE2-R3 | opencode |
| **P3 — Structure + code quality** | Merge EditorViewer hooks; delete unused hooks; fix critical stale closures; reduce any violations | FE2-R1, FE2-R2, FE2-R3 | Codex |
| **P4 — Backend readiness** | Wire 8 localStorage services to apiClient(); post-swap cleanup; complete mock-API coverage matrix | BE2-R1, BE2-R2, BE2-R3 | Codex |
| **P5 — Frontend system readiness** | Component-source governance (custom vs library/MCP) + adapter seam; visual polish gate with screenshot evidence at 1440/1920/2560 | UX2-R2, UX2-R3, FE2-R3, P1+P2 output | opencode |
| **P6 — Closeout + doc/agent coherence** | Resolve P5 editor false-alarm; bounded lint cleanup (clean 51 unused-vars + fix ~24 react-hooks bugs, defer 42 `any`); promote structural truth to `src-structure-decision.md`; supersede v2 discovery; reconcile version/code-index/agent docs; **then plan-level close** | P5 review, carry-forward contract | Codex |

Each sprint passes all gates before the next begins.

### Frontend readiness chain (explicit scope boundary)

This plan is local cleanup + mock-API seam readiness. It deliberately does **not** include real
backend integration. The chain is:

1. **P1–P4** — local structure, token system, component consolidation, code quality, and a complete
   **mock API seam** (every app-facing domain routes through `apiClient` → `mockDispatch`; mock data
   is retained on purpose as the dev backend).
2. **P5** — frontend component-source governance (`docs/product/component-source-policy.md`) and a
   visual **polish-readiness gate** with multi-viewport screenshot/console evidence. Leaves the next
   polish agent a documented source policy and a measured visual baseline.
3. **Follow-up plan (NOT here): `production-api-client-switch`** — production integration discovery/
   setup for Vercel, GitHub, Supabase, and ClickUp secrets. Replaces `apiClient → mockDispatch` with
   `apiClient → fetch` and retires `src/mock/`. Mock retention in P4 is **not** backend completion.

---

## Before/After metrics (filled from discovery outputs)

Counts are **as of v0.3.2 discovery** (re-verified live at v0.3.4 where noted); each sprint Step 1
refreshes them before editing.

| Metric | Pre-P1 | Discovery / live baseline | v2 Target |
|---|---|---|---|
| Raw hex color usages | 269 | **26** (UX2-R1) | 0 |
| Arbitrary typography usages `text-[var(--text-*)]` (11 vars) | ~274 | **275 live** (UX2-R2; v0.3.4) | 0 (→ `text-dcx-*`) |
| Arbitrary **color/border/ring** `[var(--theme-*)]` | — | **287 live** (text 126 / bg 74 / border 77 / ring 10) | **287 — intentionally retained** (theme-reactive; P1 scope table). Migration = separate `P1b` if PO wants it |
| Phantom `font/shadow/radius-[var]` | — | **0 each** (no source vars) | 0 — no work (not migrated) |
| Arbitrary `shadow-[…]` / `rounded-[…]` / layout sizes | — | **62 / 14 / ~187 live** | retained or named polish follow-up (not P1) |
| Dead CSS classes | 48 (FE-R3 claim) | **3** (`.readiness-badge`, `.editor-toggle-btn`, `.editor-toggle-btn-active`) | 0 |
| Duplicate visual component groups | 5 | **5** (UX2-R2: Input×7, Select×8, Toggle, Badge, Glass) | 0 — reconciled onto existing `atoms/*` (Badge/Chip/Input/ToggleGroup already exist), no new base primitives |
| dep-cruiser violations | 3 | **0** (FE2-R1 confirmed) | 0 ✓ |
| Files over 200-line hook cap | ~24 (150-line cap) | **2** (FE2-R1: useEditorPanel+249, useEditorDraft+215) | 0 |
| api.ts/domain.ts duplicate types | 10 | **6** semantic pairs (BE2-R1; domain adds mixins) | 6 intentional |
| Services using localStorage | 8 | **8** (BE2-R2; apiClient wired but unused) | 0 |
| no-explicit-any violations | 1 (draftData) | **63** (BE2-R1; new post-P1 code) | ≤5 |
| Orphaned dead components | 0 (claimed) | **10** confirmed dead (FE2-R3) | 0 |
| Unused hooks | not measured | **4** (usePreferences, usePermissions, useFocus, users.queries) | 0 |
| App-facing domains routing through mock API seam | — | services use localStorage directly | 100% via `apiClient`→`mockDispatch` (P4 matrix) |
| Component-source policy | none | undocumented | `docs/product/component-source-policy.md` (P5) |
| Visual polish baseline (1440/1920/2560 evidence) | none | none | captured + spec-checked (P5) |

---

## Decisions inherited from expired src-structure-refactor (not re-opened)

1. **No CSS modules** — Tailwind-first. Single-owner CSS classes go inline.
2. **StageContext full decomposition is post-v1** — only drag state extraction is in scope (P3).
3. **No mobile builder breakpoints** — builder is 1440px–4K only.
4. **`ai.service.ts` stays as stub** — no real AI backend in this plan.
5. **Mapper strategy** — snake_case camelization deferred.
6. **Context-coupled components stay in-place** — 24 components cannot be moved without context refactor.
7. **KanbanView, SmokeStage, TimelineView are NOT dead** — dynamically resolved via stage.registry.ts; do not delete.

To re-open a decision: create an entry in `docs/product/open-questions/builder-open-decisions.md`.

---

## Execution gates (each sprint)

```
Step 0: bash scripts/agent/build-current-state.sh + verify-tooling-state.sh  ← every sprint logs this
        + read the Carry-forward contract + previous sprint output (core.md §27)
npm run typecheck        ← 0 errors
npm run lint             ← max-warnings 0 (or pre-existing documented)
npm run validate:architecture  ← 0 dep-cruiser violations
npm run test             ← all 27 tests pass
Browser (executable): npm run dev → http://localhost:3000, open builder via Playwright
  (baseURL localhost:3000) or chrome-devtools MCP, record console-error count (0), attach screenshot
Final step: update the Carry-forward contract with what this sprint changed (core.md §27)
```

**Tooling fallback (core.md §28).** If the Playwright/chrome-devtools MCP or the Chromium binary is
unavailable in-session (known gap in this env — see Carry-forward "documented debt"), do not fake the
screenshot gate: run dev-smoke (`npm run dev` + HTTP 200 + console capture), mark the screenshot gate
`BLOCKED — Playwright unavailable`, and log it. That is `PASS WITH DOCUMENTED DEBT`, not `PASS`.

The systematic multi-viewport visual polish gate (1440/1920/2560 with a written acceptance spec)
runs once in **P5**, not in every sprint. P1–P4 capture per-change browser evidence; P5 captures the
full visual baseline.

> **Process contract:** this plan follows core.md §27 (continuity wiring — every sprint reads & updates
> the Carry-forward contract), §28 (tooling fallbacks — log, don't fake), §29 (closing levels —
> task/multi-task/sprint/plan), and §30 (output audit — optional, in `output-review/`). See
> `output-review/post-P1-process-review.md`.

---

## Sprint dependencies

```
P1 (token system)
  └─► P2 (components depend on clean token names)
        └─► P3 (structure assumes dead code removed)
              └─► P4 (backend swap needs clean service layer)
              └─► P5 (governance + polish gate on the consolidated, stable component set)

P1 and P4 can run in parallel if needed — P4 is token-independent.
P2 must wait for P1 (new utility class names used in consolidated components).
P5 must wait for P3 (governs/polishes the post-consolidation component set); P5 is independent of P4.
```

---

## Follow-ups / tooling debt (surfaced by 2026-06-27 audit)

- **`scripts/agent/sync-skills.sh` truncates the `dcx-plan-audit` adapter** (35 lines vs 233-line
  canonical; awk body-extraction breaks on its tables/fences). Read the canonical
  `agent-skills/dcx-plan-audit/SKILL.md` for plan-audit methodology until fixed. Logged per core.md §28.
- **`scripts/build-log-index.sh` mislabels logs.** The index builder appears to key off a later `##`
  heading rather than the real log title (entries had to be manually renamed in
  `docs/progress/index.csv`, and a rebuild re-inserted a mislabeled duplicate). Fix: parse the first
  log heading only, or prefer the filename/sprint title over later section headings. Tooling debt —
  not a blocker for activation.
- **Builder "Quality gates" has no requirement ID.** `docs/product/requirements/builder/acceptance-criteria.md`
  `## Quality gates` carries no `BLD-*` ID, yet `builder/README.md` asks sprints to cite IDs. P5 cites
  it by anchor and records "no requirement ID assigned in source doc." Product-doc follow-up: assign a
  formal `BLD-*` ID to the Quality Gates section so future sprints can cite it cleanly.
- **`index.css` token hygiene + decomposition — FOLDED INTO P1 (re-opened 2026-06-27), not a P6.**
  The PO rejected leaving `src/brand/index.css` as a single ~827-line file with ~49 raw hex/rgba
  literals inside its ~57 global component rules (duplicating existing `--theme-*` tokens). Rather than
  defer to a new sprint, **P1 was re-opened** with Step 8 (tokenize the in-rule literals) and Step 9
  (decompose `index.css` into `src/brand/styles/{tokens,theme,components}.css`). Codex finishes these.
  Deeper inline-migration of single-owner global classes into their components (per the
  "single-owner CSS goes inline" decision) is delegated to the component sprints **P2/P3** as they
  touch each component — also not a separate deferred sprint. See
  `output-review/P1-token-system-review.md`.

---

## Executor assignments (by PO)

To activate: move this plan to `docs/plans/active/` and assign executor in sprint frontmatter.
