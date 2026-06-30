# Builder — Current Source Structure Decision

Status: accepted current-state record
Updated: 2026-06-28
Supersedes: stale 2026-06-27 assessment that referenced deleted `src/components/`
Source plan: `docs/plans/active/folder-structure-v2/`

This document is the durable source of truth for the Builder source tree after `folder-structure-v2`
P1-P6. Future FE/BE final-discovery plans must start here, then re-check the live tree.

## Non-Negotiable Placement Rule

Reuse before creating. Before adding any token, CSS class, component, hook, service, or file, search
the current tree and reuse the canonical home below. Do not recreate a competing primitive.

| Need | Canonical home | Do not do |
|---|---|---|
| Typography size utility | `src/brand/styles/theme.css` as `text-dcx-*` | Reintroduce `text-[var(--text-*)]` |
| Theme/color/surface token value | `src/brand/styles/tokens.css` as `--theme-*` | Hard-code color literals in JSX/CSS |
| Global component/layout CSS | `src/brand/styles/components.css` | Rebuild `src/brand/index.css` as a monolith |
| Base UI atom | `src/ui/atoms/` | Create duplicate base primitives |
| Brand surface | `src/ui/surfaces/`, `src/ui/PopoverShell.tsx`, `src/ui/StickyPopupShell.tsx`, `src/ui/BuilderBg/` | Move surfaces into feature folders without a plan |
| Raw shadcn primitive | `src/ui/shadcn/` | Import `@/ui/shadcn/*` from feature code |
| DCX adapter over a library primitive | `src/ui/<role>/` or existing shell file | Expose raw library components to features |
| Builder card/island/stage behavior | `src/builder/` | Promote builder-specific behavior to `src/ui/` |
| Backend/mock seam | `src/services/api-client.ts` -> `src/services/mock-dispatch.ts` -> `src/services/mock/*` | Add direct service `localStorage` bypasses |

## Current Tree

Top-level source areas:
- `src/actions/` — Builder mutation/actions boundary.
- `src/brand/` — CSS entrypoint, tokens, theme utility registration, component CSS, fonts.
- `src/builder/` — Builder-only cards, islands, stage views, dropzones, import, shared helpers, and builder UI.
- `src/hooks/` — shared hooks.
- `src/mock/` — fixture data retained for the mock backend.
- `src/pages/` — route pages.
- `src/queries/` — query adapters.
- `src/rules/` — business/readiness rules.
- `src/services/` — API client, service facades, and mock backend dispatch.
- `src/store/` — client state stores.
- `src/types/` — domain/API/UI types.
- `src/ui/` — shared UI primitives, forms, surfaces, auth wrappers, motion, and raw shadcn landing folder.
- `src/utils/` — shared utilities.

There is no `src/components/` folder. Any document that still references `src/components/` as current
state is pre-refactor prior art.

## Brand And Token State

`src/brand/index.css` is intentionally a small entrypoint. Its real content lives in:
- `src/brand/styles/theme.css` — Tailwind v4 utility registration, including `text-dcx-*`.
- `src/brand/styles/tokens.css` — `@font-face`, `:root`, `--theme-*`, `--text-*`, shadcn oklch vars, dark overrides.
- `src/brand/styles/components.css` — global component/layout classes.

Facts:
- Typography size migration is complete: `text-[var(--text-*)]` count is 0.
- Use `text-dcx-*` utilities for typography size.
- Theme-reactive `[var(--theme-*)]` values are retained by policy.
- Arbitrary shadows, radii, and layout sizes are retained by policy unless a future sprint explicitly creates a token scale.
- Do not invent `font-dcx-*`, `rounded-dcx-*`, or `shadow-dcx-*` purity requirements.

## UI Structure

Canonical shared UI homes:
- `src/ui/atoms/Badge.tsx`
- `src/ui/atoms/Chip.tsx`
- `src/ui/atoms/Input.tsx`
- `src/ui/atoms/ToggleGroup.tsx`
- `src/ui/forms/date/*`
- `src/ui/forms/inputs/ListInputLines.tsx`
- `src/ui/forms/inputs/SpecsInput.tsx`
- `src/ui/forms/selects/Select.tsx`
- `src/ui/forms/selects/CompletionStateSelect.tsx`
- `src/ui/surfaces/GlassSurface.tsx`
- `src/ui/PopoverShell.tsx`
- `src/ui/StickyPopupShell.tsx`
- `src/ui/BuilderBg/*`
- `src/ui/motion/*`
- `src/ui/auth/*`
- `src/ui/shadcn/button.tsx`

P5 component-source policy:
- Durable policy: `docs/product/component-source-policy.md`.
- Custom DCX components remain default for brand atoms, glass surfaces, and domain controls.
- shadcn/MCP/library primitives are candidates only for interaction-heavy generic primitives such as
  Dialog, Popover, Combobox/Command, and Tooltip.
- Raw shadcn primitives must land under `src/ui/shadcn/`.
- Feature code must use DCX adapters, not raw `@/ui/shadcn/*` imports.
- Current adapter seam: `src/ui/PopoverShell.tsx` with public `children`, `className?`, `width?` contract.

## Builder Structure

Builder-owned areas:
- `src/builder/cards/` — card shell, behavior, drag/drop helpers, and phase/action/task card templates.
- `src/builder/islands/` — Builder islands including EditorViewer, Metadata, Focus, Selection, Timeline,
  Kanban, ViewHelper, AI/Template/Preview UI.
- `src/builder/stage/` — Stage provider, stage core, registry, edge navigation, timeline/kanban/monthly views.
- `src/builder/dropzones/` — generic drop target infrastructure.
- `src/builder/import/` — import helpers and import tests.
- `src/builder/shared/` — builder-shared icons/helpers.
- `src/builder/ui/` — builder-specific buttons, forms, feedback, and modals.

Editor state:
- `src/builder/islands/EditorViewerIsland/useEditorState.ts` is the merged editor state hook.
- `useEditorPanel.ts`, `useEditorDraft.ts`, and `useEditorGuard.ts` were deleted during P3.
- The collapsed editor control is intentionally disabled as a drop hint; the editor opens through
  drag/drop onto the island or long-press focus.

Do not move card, island, or stage files without a new plan and full verification. The flat
`src/builder/stage/views/` folder is known dense but intentionally not reorganized by P6.

## Service And Backend Seam

All app-facing storage-backed services route through:

```text
service facade -> apiClient -> mockDispatch -> src/services/mock/*
```

Current mock route homes:
- `src/services/mock/access.mock.ts`
- `src/services/mock/builder.mock.ts`
- `src/services/mock/channels.mock.ts`
- `src/services/mock/logs.mock.ts`
- `src/services/mock/store.ts`
- `src/services/mock/subtasks.mock.ts`
- `src/services/mock/versions.mock.ts`

`readMockJson`, `writeMockJson`, and `src/utils/safe-storage.ts` were removed. Service files must not
reintroduce direct storage bypasses.

Known follow-up:
- `production-api-client-switch` will replace the mock backend seam with production API wiring later.
- `src/utils/browser-storage.helpers.ts` remains for UI-local browser storage such as editor/day-note
  drafts until BE-final-implementation decides whether it enters the backend seam.

## Current Debt And Follow-Ups

Known durable follow-ups:
- `typed-any-cleanup` — 42 explicit `any` usages remain after P6 bounded lint cleanup.
- `production-api-client-switch` — wire production backend/API client after mock seam readiness.
- `P1b-color-tokens` — optional future migration of retained theme arbitrary values, only if PO approves.
- Builder quality-gates source doc needs a formal `BLD-*` ID.
- Version authority mismatch remains PO-owned until resolved: `docs/VERSION.md` vs `metadata.json`.
- MCP setup debt remains for Storybook, shadcn, Semgrep, and SonarQube in this Codex session.

## Superseded Guidance

The old recommendations to move `src/components/forms/channel` or resolve a `src/components` cycle are
obsolete because `src/components/` no longer exists. Treat v2 discovery outputs as prior art only; the
FE/BE final-discovery plans must re-discover against the live tree and this decision record.
