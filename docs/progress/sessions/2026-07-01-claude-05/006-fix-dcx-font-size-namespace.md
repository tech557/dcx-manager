Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.8.0
Change-Class: source

# Fix: text-dcx-* font-size tokens were silently no-ops (rendered 16px app-wide)

## The bug (PO-diagnosed)
PO noticed a task date set to a tiny token still rendered ~16px. Investigation confirmed it app-wide:
every `text-dcx-*` class rendered at **~16px** regardless of token. Calibrated the real task date span
in-browser (set 10px/20px inline, measured widths, back-solved): `text-dcx-5xs`, `text-dcx-4xs`,
`text-dcx-base`, `text-dcx-md` all measured ~15.6px, while stock `text-xs` correctly measured 10px.

**Root cause:** Tailwind v4's font-size theme namespace is `--text-*`. The project declared the scale as
`--font-size-dcx-*` inside `@theme` — a namespace v4 does **not** recognize — so **no `text-dcx-*`
utilities were ever generated**, and all ~300 usages across 79 files inherited 16px. Changing the token
values did nothing.

## Fix (PO chose "global root-cause fix + verify")
| File | Change |
|---|---|
| `src/brand/styles/theme.css` | Renamed the whole scale `--font-size-dcx-* → --text-dcx-*` (the v4 font-size namespace) so `text-dcx-*` utilities generate and every existing usage takes effect. No code referenced the old var directly (verified by grep), so the rename is safe. |
| `src/brand/styles/tokens.css` + `theme.css` | Removed the now-orphaned `--text-5xs` / `dcx-5xs` token added the prior session (no longer used after the task re-tune). |
| `TaskCard.tsx` | Re-tuned to the PO's target now that tokens apply: collapsed date `dcx-2xs` (~9px), expanded name `dcx-xs` (~10px), expanded date/no-date `dcx-2xs` (~9px). |
| `TaskHoverCard.tsx` | Name `dcx-md` (~12px). |

## Impact
This makes the whole app's `text-dcx-*` sizing finally render as designed (smaller, with real hierarchy)
instead of a uniform 16px. Blast radius: ~300 usages / 79 files — but all were already *intended* to be
these sizes; the fix reveals the designed typography.

## Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `eslint` | PASS |
| `bash scripts/verify.sh` | `verify passed` |
| `npm run test` | PASS — 92/92 |

## Browser verification (Preview MCP)
- Confirmed the fix live: re-measured the task date via inline-fontSize calibration — tokens now
  **scale** (dcx-5xs<dcx-2xs<dcx-md<dcx-base) instead of all being 15.6px. Before: identical no-op.
- Builder screenshot after the fix: header labels now properly small with real hierarchy, task cards
  legible (dates "1 Jul"/"2 Jul" readable ~9px), nothing clipped/overlapping. No console errors.
- Home/`/version` routes render blank — pre-existing placeholders (`CLAUDE.md §13`), not regressed
  (no console errors); they were blank before this change too.
- Note: `getComputedStyle().fontSize` reads 16px for everything in this preview harness (a harness
  quirk) — sizing was verified via layout width calibration + screenshots, not computed style.
</content>
