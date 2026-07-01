Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.5.0
Change-Class: source

# Metadata island — align rows, tighten spacing, reduce sizes

## Request
PO: labels and data aren't inline yet — no expanded spacing in the header; introduce a smaller
label token; ensure all labels sit on one line and all values/inputs on another; use the calendar
popup's font size for status and files (reduce them).

## What changed

| File | Change |
|---|---|
| `src/ui/atoms/labels.ts` | Label token shrunk `dcx-3xs → dcx-4xs`, tracking `0.18em → 0.16em`. |
| `MetadataIsland.tsx` | Header pill spacing tightened: `px-5 gap-5 → px-4 gap-2.5`. |
| `CampaignDetailsGroup.tsx` | Title `dcx-base → dcx-xs` (kept `font-black`); label row and value row pinned to `h-4`; version pill flattened (`py` removed); dropped `h-full`/`py-0.5`. |
| `StatusDropdownBadge.tsx` (minimalist) | Value `dcx-md/md-plus → dcx-xs` (calendar size); label + value rows `h-4`; icons `11/12 → 10`. |
| `CommunicationDateField.tsx` (minimalist) | Value `→ dcx-xs`, container gap `1.5 → 0.5`, value row `h-4`, icons `w-3.5 → w-2.5` (minimalist only; editor default unchanged). |
| `MetadataDetailsContent.tsx` | Date label uses `ISLAND_LABEL_CLASS + h-4` (no double margin). |

## Alignment approach
Every field is now an identical stack: label row `h-4` + `~2px` gap + value row `h-4` = **34px**. With
the pill's `items-center`, all three fields center identically, so labels share one line and values
share the next. The prior misalignment came from the status/date value buttons being 24px (icon +
line-height) vs the campaign value's 16px, making the fields unequal height.

## Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `eslint` (6 files) | PASS |
| `bash scripts/verify.sh` | `verify passed` |
| `npm run test` | PASS — 92/92 |

## Browser verification (Preview MCP + Playwright)
- Measured (layout `getBoundingClientRect`, which is reliable here — `getComputedStyle` fontSize is a
  known-broken 16px in this harness): all three fields **34px** tall; label tops all **35.4px**; value
  tops all **53.4px** → labels on one line, values on one line.
- Crisp Playwright element screenshot of `#project-details-island` confirms: `V1` pill, smaller
  Gilroy-light labels aligned on the top line, values (RAMADAN 2026 / IN PROGRESS / 1 Jul 2026 (Wed))
  aligned on the bottom line, tighter overall spacing, no console errors.
</content>
