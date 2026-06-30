---
plan: ui-ux-discovery
status: expired
version_context: v0.3.2
created: 2026-06-25
feeds-into: src-structure-refactor (P1-tokens, P2-components)
---

# Plan: UI/UX Discovery

## Goal

Extract a complete, data-driven picture of every design value and component style pattern currently used in the running codebase. No assumptions. No reading of `tokens.ts` and assuming it matches the JSX. Actually grep, script, and audit what is in the files.

After this plan, we know exactly which values to tokenise, exactly which component classes to extract, and exactly where duplication exists in the visual layer.

---

## Why This Must Run Before Any Refactor

`tokens.ts` defines colours. The JSX and CSS use colours too. They do not fully match. Running a grep over the codebase before we write P1 will show us:
- Colour values in JSX that are NOT in `tokens.ts`
- CSS classes in `index.css` that are used by 0 components (dead code)
- Font sizes, spacing values, and radius values that have no token equivalent

Without this data, P1 would create a "complete" token system that still misses 30% of the values actually in use.

---

## Sprint Index

| Sprint | Title | Parallel? | Output |
|---|---|---|---|
| [UX-R1](./sprints/UX-R1-token-extraction.md) | Token Extraction | ✓ with UX-R2 | `output/UX-R1-token-inventory.md` |
| [UX-R2](./sprints/UX-R2-component-catalog.md) | Component → CSS Class Map | ✓ with UX-R1 | `output/UX-R2-component-css-map.md` |
| [UX-R3](./sprints/UX-R3-style-synthesis.md) | Style Pattern Synthesis | After UX-R1 + UX-R2 | `output/UX-R3-style-synthesis.md` |

UX-R1 and UX-R2 run in parallel. UX-R3 requires both outputs.

---

## Definition of Done

- [ ] `output/UX-R1-token-inventory.md` — every unique colour, font-size, spacing, radius value with usage count
- [ ] `output/UX-R2-component-css-map.md` — every CSS class in `index.css` mapped to which TSX files use it
- [ ] `output/UX-R3-style-synthesis.md` — synthesis with gaps, dead code, and recommended token names for P1
- [ ] No source code changed across all three sprints
