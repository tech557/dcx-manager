---
review-of: docs/plans/active/folder-structure-v2/output/P1-token-system.md
sprint: P1-token-system
reviewer: Claude (claude-opus-4-8, Anthropic)
date: 2026-06-27
verdict: ACCEPT MIGRATION — RE-OPEN SPRINT (CSS-cleanup plan gap)
method: read P1 output + live grep/ls against src/brand/index.css (827 lines), tokens.ts, src/
---

# P1 Output Review — Token System

## Verdict

**The source migration Codex performed is correct and gate-clean.** But P1 as originally scoped
left a real **plan gap** the PO has now rejected: `src/brand/index.css` was never decomposed and its
in-rule literal colors were never tokenized. **P1 is re-opened** with two new steps (8 + 9) added to
the sprint file. Codex should read this review, then execute the new steps; it must **not** redo the
already-correct typography/hex/dead-code work.

> Per-decision: the PO directed that this CSS work be folded into P1 now — **not deferred to a
> separate `P6` sprint.** This review and the amended sprint reflect that.

---

## 1. What P1 did correctly (verified — keep as-is)

- All **11** `--text-*` size variants registered as `@theme` `text-dcx-*` utilities (incl. the four
  `-plus` variants). Confirmed in `index.css` lines 173–183.
- **272** arbitrary `text-[var(--text-*)]` usages → **0** (`rg` remaining = empty).
- Phantom categories confirmed **0** — no `font-[var]`/`shadow-[var]`/`rounded-[var]` work performed.
  Correct per the corrected scope.
- Raw hex in **app JSX/TSX** → 0. 3 dead CSS classes + 3 dead token exports removed. 6 surface/accent
  tokens added (and exposed in `tokens.ts`). 311 theme color/border/ring arbitraries correctly
  **retained** (theme-reactive).
- Gates: typecheck / validate:architecture / test / build / dev-smoke all **PASS**.

## 2. Lint "blocker" — not actually blocking

P1 output marks sign-off blocked on `npm run lint` (157 problems). Those are **pre-existing
repo-wide debt**; P1 introduced **0 new** (the one `LightRays prefer-const` it touched was fixed).
The plan's own execution gate reads `npm run lint ← max-warnings 0 (or pre-existing documented)`.
So the lint state does not block P1 on its own — the **real** reason to keep P1 open is the CSS gap
below, not lint.

## 3. The plan gap (PO-confirmed) — what P1 must now also do

`src/brand/index.css` is a single **827-line** file mixing four concerns:

| Region | Lines (approx) | Content |
|---|---|---|
| External imports | 1–4 | `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, font |
| `@theme` registrations | 171–189 | the new `text-dcx-*` + `color-dcx-*` utilities |
| `:root` / shadcn / `.dark` tokens | ~192–314 | `--text-*` sizes, `--theme-*` palette, oklch shadcn vars |
| **~57 global component classes** | ~340–752 | `.app-shell`, `.stage-canvas`, `.kanban-board`, `.metadata-island`, `.field-indicator`, … |
| `@theme inline` | 752+ | second theme block |

Two debts, neither touched by P1 or any other sprint:

**(a) In-rule literal colors duplicate existing tokens.** The ~57 global classes contain **~49 raw
hex/rgba literals** — e.g. `border-bottom: 1px solid rgba(255,255,255,0.08)` (≈L353),
`background: rgba(13,13,14,0.72)` (≈L354), many `color: rgba(247,247,248,0.x)`. These duplicate
`--theme-*` tokens that **already exist** (`--theme-border-subtle`, `--theme-glass-bg`,
`--theme-text-muted`, …). P1's hex cleanup explicitly **excluded** `index.css` (`grep -v "index.css"`),
so these were never in scope. (The literals in `:root`/`.dark` are legitimate — a token must resolve
to a literal somewhere. The debt is the literals **inside the component rules**.)

**(b) The file is not broken down.** 827 lines in one file is hard to scan and edit.

## 4. Resolution applied to the sprint (Steps 8 + 9)

The chosen approach (reviewer's call, per PO delegation):

- **Step 8 — Tokenize in-rule literals.** Replace the ~49 raw hex/rgba inside the global component
  rules with the existing `--theme-*` vars they duplicate. Add a new `--theme-*` var only when no
  equivalent exists (document any). Do **not** touch the `:root`/`.dark` definitions themselves.
- **Step 9 — Decompose `index.css` into partials.** Split into
  `src/brand/styles/tokens.css` (`:root` light + `.dark` + size vars + shadcn oklch),
  `src/brand/styles/theme.css` (`@theme` + `@theme inline`), and
  `src/brand/styles/components.css` (the ~57 global classes). `index.css` becomes the entry that keeps
  the 4 external `@import`s then imports the three partials **in the same cascade order**. Tailwind v4
  must still see the `@theme` blocks — verify the build after.

> **Why partials, not inline-migration:** moving all 57 single-owner classes inline into their React
> components is the deeper end-state and aligns with the inherited "single-owner CSS goes inline"
> decision — but it is component-level work that overlaps P2/P3 and would bloat the token sprint.
> Partials break the file down now with low risk and zero behavior change. The inline migration is
> noted as ongoing direction for the component sprints (P2/P3) as they touch each component — it is
> **not** a new deferred sprint.

## 5. Minor reconcile (non-blocking)

P1 reports **272** migrated vs the ~275 audit baseline. Likely 3 usages were in comments or
already-deleted dead files. Worth a one-line note in the final output; does not affect the
0-remaining result.

## 6. Hand-off to Codex

1. Read this review.
2. Keep all Section-1 work as-is — do **not** redo typography/hex/dead-code migration.
3. Execute the new **Step 8** (tokenize literals) and **Step 9** (decompose `index.css`).
4. Re-run the full gate (Step 10) incl. build + dev-smoke; record before/after `index.css` line count
   and the in-rule literal count (target 0 raw hex/rgba inside component rules).
5. Document the pre-existing lint backlog as accepted (it does not block P1).
