---
plan: ux-discovery-v2
status: completed
version_context: v0.3.2
created: 2026-06-26
activated: 2026-06-26
completed: 2026-06-27
prior-art: expired/ui-ux-discovery
feeds-into: folder-structure-v2 (P1-tokens, P2-components)
---

# Plan: UX Discovery v2

> ⚠️ SUPERSEDED by `folder-structure-v2` execution (P1-P6, 2026-06). Counts and
> structure here are PRE-refactor and must not be treated as live current-state
> truth. The FE/BE/UX final-discovery plans must re-discover against the live tree;
> see `docs/product/decisions/src-structure-decision.md` for current structure.

## Before starting — read prior art

Read `docs/plans/expired/ui-ux-discovery/` in full before executing any sprint:
- `output/UX-R1-token-inventory.md` — what hardcoded values were found pre-P1
- `output/UX-R2-component-css-map.md` — CSS class → component mapping pre-P1
- `output/UX-R3-style-synthesis.md` — what P1 was told to do

Then ask: which of those findings are still true after P1 executed? That delta is what this plan discovers.

---

## Goal

Produce a data-driven picture of the visual system **as it actually exists today** — not as it was before P1.
P1 executed design tokens. Verify what was actually tokenized vs what remains raw. Map the Tailwind v4 patterns
that are now in use. Identify the next round of visual debt that folder-structure-v2 P1/P2 must address.

This plan uses deterministic scripts and the new toolchain, not manual grep. Every finding must be reproducible
by running a command.

---

## Why v2 is needed

The v1 discovery (now expired) was done before:
- ESLint v9 was installed (can now lint for hardcoded values)
- `code-query.sh hardcoded-tokens` script existed
- P1 design tokens sprint executed (partial tokenization happened)
- dep-cruiser was installed (can verify CSS/token import boundaries)

Running v1's conclusions against the current codebase would give wrong numbers. P1 changed the token system
significantly; the CSS dead-code map is different; the Tailwind arbitrary value count is different.

---

## Sprint Index

| Sprint | Title | Parallel? | Executor | Output |
|---|---|---|---|---|
| [UX2-R1](./sprints/UX2-R1-token-verification.md) | Token Verification + Gap Analysis | ✓ with UX2-R2 | Codex / opencode | `output/UX2-R1-token-status.md` ✅ |
| [UX2-R2](./sprints/UX2-R2-tailwind-audit.md) | Tailwind v4 Pattern Audit | ✓ with UX2-R1 | Codex / opencode | `output/UX2-R2-tailwind-patterns.md` ✅ |
| [UX2-R3](./sprints/UX2-R3-visual-synthesis.md) | Visual System Synthesis | After UX2-R1 + UX2-R2 | Codex / opencode | `output/UX2-R3-synthesis.md` |

UX2-R1 and UX2-R2 run in parallel. UX2-R3 requires both.

---

## What this plan does NOT do

- Does not change any source file
- Does not add or remove tokens
- Does not install Storybook
- Does not produce CSS or component changes

---

## Definition of Done

- [x] `output/UX2-R1-token-status.md` — list of remaining raw hex values, arbitrary Tailwind values, and unreferenced tokens after P1
- [x] `output/UX2-R2-tailwind-patterns.md` — every Tailwind class pattern used across components, frequency, duplication
- [x] `output/UX2-R3-synthesis.md` — synthesis: what P1 succeeded at, what remains, exact recommendations for folder-structure-v2
- [x] No source code changed across all three sprints
- [x] All findings produced by running scripts or CLI tools, not by reading files manually
