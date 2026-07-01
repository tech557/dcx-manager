Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.11.0
Change-Class: source

# Fix: <input>/<textarea> ignored text-dcx-* font sizes (rendered 16px); expanded task name → 4xs

## The bug (PO-flagged)
PO said the expanded task name still looked wrong. Measured in-browser: SPANS rendered tokens correctly
(date span `dcx-4xs` = 7px), but the task-name **`<input>`** (`text-dcx-2xs`) and the action-title
**`<input>`** (`text-dcx-xs`) both rendered at **16px** — no font-size class worked on them, not even
default `text-xs` or `!important`.

**Root cause:** `components.css` had an **unlayered** `button, input, textarea, select { font: inherit }`.
Because it sits outside any `@layer`, it beats Tailwind's `@layer utilities` (unlayered > layered in the
cascade), forcing every input/textarea to its inherited 16px and ignoring its `text-dcx-*` class.
Tailwind preflight already does this reset in `@layer base` (correctly overridable) — this duplicate
just wasn't layered.

## Fix
| File | Change |
|---|---|
| `src/brand/styles/components.css` | Wrapped the `button/input/textarea/select { font: inherit }` reset in `@layer base` so `text-*` utilities override it again. |
| `TaskCard.tsx` | Expanded task name input `text-dcx-2xs → text-dcx-4xs` (~7px, per PO). (Working tree also carried a concurrent-session edit moving the expanded date span to `dcx-4xs` — kept, since it matches "expanded card at 4xs".) |

## Verification (Preview MCP)
- Before → after (getComputedStyle, now reporting real values):
  - expanded name input: **16px → 7px** (`dcx-4xs`)
  - action title input: **16px → 10px** (`dcx-xs`)
  - expanded date span: 7px (`dcx-4xs`); collapsed date span: 9px (`dcx-2xs`)
- Editor inputs (app-wide impact of the fix) now also honor tokens: sampled `dcx-xs`→10px, `dcx-4xs`→7px.
- Builder + editor screenshot: action titles now fit full text, editor panel well-proportioned, nothing
  broken.

## Gates
`npm run typecheck` PASS (0 errors). `eslint` clean for TaskCard (components.css is a CSS file, eslint-ignored).

## Environment note
This checkout is shared by multiple concurrent agent sessions doing large backend work (api-client /
supabase / telemetry) with dozens of uncommitted files, plus intermittent `useStageContext` runtime
errors from their uncommitted service edits (BuilderPage.tsx itself is unmodified). My commit includes
ONLY `components.css` + `TaskCard.tsx` + this log via `git commit -o`, excluding all of that. See
[[concurrent-session-shares-checkout]].
</content>
