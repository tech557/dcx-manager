Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.12.0
Change-Class: source

# Expanded task card — move the date below the channel icon (mirror the collapsed layout)

## Request
PO: rearrange the expanded task card so the date sits below the channel icon, the same vertical
arrangement the collapsed card uses (icon on top, date beneath). PO also noted the pending backend
work in the shared checkout is NOT to be previewed — so this commit is frontend-only.

## What changed (`TaskCard.tsx`, expanded branch only)
- Left column is now a vertical stack: **channel icon on top, date beneath it** (dot/Link2 glyph +
  `dcx-4xs` date, or a small Calendar icon when no date) — matching the collapsed card's arrangement.
- Line 2 of the center column is now just `TaskProperties` (the date was removed from there).
- Name input + editor button unchanged.

## Gates
`npm run typecheck` PASS (0 errors).

## Browser verification (Playwright, own server)
- Expanded card screenshot: channel icon on top with the date ("⇔ 10 Jul") directly below it, name +
  property pins in the center, editor button on the right — the date now mirrors the collapsed layout.

## Environment note
Shared checkout still has the concurrent sessions' large uncommitted backend work (api-client / supabase
/ telemetry). Committed ONLY `TaskCard.tsx` + this log via `git commit -o`; none of the backend work is
in this commit or its preview. See [[concurrent-session-shares-checkout]].
</content>
