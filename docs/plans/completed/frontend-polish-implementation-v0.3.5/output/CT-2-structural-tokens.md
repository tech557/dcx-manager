---
sprint: CT-2
title: Structural dimension tokens
status: Completed
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
---

# CT-2 — Structural Dimension Tokens

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-FP-D12, REQ-STG-003, REQ-SBC-003, REQ-FP-D11 |
| Scope/type | frontend / ui-presentation (structural tokens) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → `implemented` |
| Source/lock | FP-R5-synthesis.md §CT-2; FP-R4 §L04/S08/C03 |
| Expected EMC | EMC-STG-SEED, EMC-SBC-SEED |

## G-IMPECCABLE

Direct brand-contract route (same as CT-1). No visual redesign — token-sourcing only. Logged.

## What was done

Defined 6 structural dimension tokens in `src/brand/styles/tokens.css` under `:root` (theme-agnostic; same in light/dark):

| Token | Value | Sourced from |
|---|---|---|
| `--dim-phase-collapsed` | `4.5rem` | BuilderPage `w-[4.5rem]`, KanbanView `w-[72px]` |
| `--dim-phase-expanded` | `260px` | KanbanView `w-[260px]`, DayGridCard `w-[260px]` |
| `--dim-editor-width` | `25rem` | BuilderPage `w-[25rem]` |
| `--dim-builder-header` | `64px` | BuilderPage `h-[64px]`, BuilderLoadingShell |
| `--dim-builder-footer` | `76px` | BuilderPage `h-[76px]`, BuilderLoadingShell |
| `--dim-selection-max-width` | `420px` | SelectionIsland `maxWidth: '420px'` |

> **Note on editor width discrepancy:** FP-R5 cites "editor 382px" but current code uses `w-[25rem]` = 400px at 16px base. Token set to `25rem` to preserve current behavior. No value changed per sprint scope.

Updated consuming components to use `style={{ ... 'var(--dim-*)' ... }}` for the structural dimensions:

- `src/builder/BuilderPage.tsx` — header `h`, footer `h`, editor panel `w`, focus panel `w`
- `src/builder/BuilderLoadingShell.tsx` — header skeleton `h`, footer skeleton `h`, phase column skeletons `w`
- `src/builder/stage/views/KanbanView.tsx` — phase column `w` / `minW` / `maxW`
- `src/builder/stage/views/DayGridCard.tsx` — day card `w` when not monthly
- `src/builder/islands/SelectionIsland/SelectionIsland.tsx` — `maxWidth` inline style

## Gates

| Gate | Result |
|---|---|
| `npm run typecheck` | ✅ PASS |
| `npm run lint` | ✅ PASS |
| `npm run test` | ✅ PASS (82 tests) |
| `npm run validate:architecture` | ✅ PASS (264 modules, 0 violations) |
| `npm run req:validate` | ✅ PASS (QST-VR-011 pre-existing) |
| `npm run req:folder-index` | ✅ 784 nodes indexed |
| `npm run req:completion-gate --changed` | ✅ PASS |
| Browser/visual proof | ✅ Playwright real-pointer; computed values confirmed token-sourced |

## Browser evidence

Route `/builder/v-1` at 1440×900. DevTools computed values:

```
headerHeight: 64px   ← var(--dim-builder-header: 64px)
footerHeight: 76px   ← var(--dim-builder-footer: 76px)
editorWidth:  72px   ← var(--dim-phase-collapsed: 4.5rem) [no node focused]
focusWidth:   72px   ← var(--dim-phase-collapsed: 4.5rem)
selectionMaxWidth: 420px ← var(--dim-selection-max-width: 420px)
```

Screenshot: `output/evidence/CT-2-structural-tokens/builder-1440-token-sourced.png`

Layout visually unchanged — no redesign introduced.

## Requirement Debt Burn-down

- Changed-scope `manifestationsLackingRequirements`: 0 (no new MAN nodes created)
- `req:completion-gate --changed`: 1 manifestation in scope, gate ✅ PASS
- `req:validate`: ✅ PASS (QST-VR-011 pre-existing, non-blocking)
- Candidate links: 165 total (pre-existing from prior reconcile; CT-2 did not create new ones)
- RS-R7 candidate link for `tokens.css → REQ-FP-D12` queued from CT-1 is now confirmed by this sprint's work; no new rejections.
