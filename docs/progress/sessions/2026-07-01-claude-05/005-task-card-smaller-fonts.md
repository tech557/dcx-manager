Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.7.0
Change-Class: source

# Task card — every font smaller (card size unchanged)

## Request
PO: make every font in the task card smaller without reducing the card size.

## What changed
Only `text-*` classes changed — no box/spacing/icon sizes touched, so card dimensions are unchanged.

| Font | Before | After |
|---|---|---|
| Collapsed date | `dcx-4xs` | `dcx-5xs` (new token) |
| Expanded name input | `dcx-2xs-plus` | `dcx-3xs` |
| Expanded date value | `dcx-3xs` | `dcx-4xs` |
| Expanded "No Date" | `dcx-3xs` | `dcx-4xs` |
| Hover card name | `dcx-xs` | `dcx-2xs` |

New token (the collapsed date was already at the smallest existing token `dcx-4xs`):
- `src/brand/styles/tokens.css`: `--text-5xs: 0.375rem;` (6px)
- `src/brand/styles/theme.css`: `--font-size-dcx-5xs: var(--text-5xs);`

## Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `eslint` | PASS |
| `bash scripts/verify.sh` | `verify passed` |
| `npm run test` | PASS — 92/92 |

## Browser verification (Preview MCP + Playwright)
- New `dcx-5xs` token confirmed applied, not a silent 16px fallback: crisp Playwright screenshot shows
  collapsed cards with tiny dates and unchanged card size (a fallback would have ballooned the date to
  16px and broken the w-14 card — it did not).
- Expanded card screenshot: smaller name + date, card box unchanged, open-editor button intact.
- No console errors. (Note: `getComputedStyle`/probe font-size reads are pinned to 16px in this preview
  harness — a known limitation — so sizing was verified visually via device-scale screenshots.)
</content>
