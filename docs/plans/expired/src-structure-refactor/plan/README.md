---
plan: src-structure-refactor
status: expired
version_context: v0.3.2
created: 2026-06-25
updated: 2026-06-26 (P1 complete; P2 active)
depends-on: ui-ux-discovery (completed), frontend-discovery (completed), backend-discovery (completed)
---

# Plan: src/ Structure Refactor

## Why This Plan Exists

The src/ folder structure and coding conventions make it unsafe to make UI changes or backend integration
without risk of breaking something. Specifically:

- No design token system — 269 raw `#75E2FF` usages, no typography tokens at all
- 50+ accent color opacity variants with no canonical scale
- 5 duplicate visual component groups (badges, chips, inputs, glass surfaces, toggles)
- 48 dead CSS classes (50% of index.css)
- All src/components/ files are builder-only but live in a "shared" folder
- 3 import layer violations
- 2 files over 250-line cap
- 50% of domain.ts is exact duplicates of api.ts
- 0 service files make network calls — all localStorage, no real fetch seam wired

After this plan executes, a developer can:
- Change any color or font size in one place (token) and see it everywhere
- Add or modify a component without worrying about CSS class conflicts
- Know exactly which folder contains what kind of code
- Integrate a real backend by swapping 8 service files, no other changes needed

Backend integration is NOT executed in this plan. The goal is mock-readiness: every endpoint
has typed mock data that matches the API contract, and the service seam is ready to swap.

---

## Discovery Outputs Consumed

| Output | Key finding used in plan |
|---|---|
| UX-R1 | 269 raw #75E2FF usages; 50+ accent opacity variants; no typography token system; 13 untokenized hex colors |
| UX-R2 | 48 dead CSS classes (50%); 5 duplicate visual patterns; 11 files using inline styles (card templates) |
| UX-R3 | Canonical token set for P1; accent opacity scale (6 levels); rem-based typography scale; CSS modules recommendation (challenged below) |
| FE-R1 | 98 components; 35 leaf atoms safe to extract; ~20 context-coupled components not safe to move; all src/components/ are builder-only |
| FE-R2 | 131 useState; StageContext has 28 values (too large); split selection state in builderStore; clean action boundary |
| FE-R3 | 5 duplication groups (Badge, Chip, Glass, Input, Toggle); 48 dead CSS classes; 0 orphaned components; useToggle should be extracted |
| BE-R1 | 50% of domain.ts = exact duplicate of api.ts; mock data matches types exactly; clean boundary (services import api.ts, UI imports domain.ts) |
| BE-R2 | 0 `any` in services/actions; 100% mapper coverage bi-directional; 8 services need localStorage → fetch swap; apiClient() seam exists but throws |
| BE-R3 | Scenario A (same shape): 8 services swap, everything else survives; camelizeKeys() utility needed for Scenario B/C |

---

## Challenges to Discovery Recommendations

**UX-R3 recommended CSS Modules for tier-1 CSS classes.**
Challenge: This project is Tailwind-first. Introducing CSS modules adds build complexity (import styles from '*.module.css', className bindings, PostCSS overhead) with minimal benefit. The right answer is: delete the 48 dead classes, convert single-owner classes to co-located Tailwind in JSX, and keep global CSS only for the 13 truly shared classes (.glass, .expanded, .dark, .eyebrow, etc.). No CSS modules in this plan.

**FE-R3 recommended merging useEditorPanel/Draft/Guard into useEditorState.**
Adopt. These 3 hooks are co-located in EditorViewerIsland/, always consumed together, and share context subscriptions. P2 merges them.

**BE-R3 noted StageContext has 28 values and is too large.**
Partial adopt. Full context split is too risky in P3 (too many consumers). P3 documents the split as a future intent and extracts only drag state into its own context (lowest-risk split). Full decomposition is post-v1.

**FE-R1 recommended against moving 20 context-coupled components.**
Adopt fully. These components stay in-place. Only the 35 safe leaf atoms move.

---

## Sprint Index

| Sprint | Goal | Estimated files changed |
|---|---|---|
| [P1 — Design Token System](./sprints/P1-design-tokens.md) | All colors, font sizes, spacing tokenized. 48 dead CSS classes deleted. | ~30 files |
| [P2 — Atomic Component System](./sprints/P2-atomic-components.md) | 5 duplication groups consolidated. Leaf atoms in src/ui/. src/components/ empty. | ~50 files |
| [P3 — File Structure](./sprints/P3-file-structure.md) | 3 layer violations fixed. 2 files split. Folder rules enforced by dep-cruiser. | ~15 files |
| [P4 — Backend Readiness](./sprints/P4-backend-readiness.md) | Mock data for all endpoints. Type deduplication. draftData typed. Service swap-ready. | ~45 files |

**Execution order**: P1 → P2 → P3 → P4 (sequential). Each sprint must pass its gates before the next begins.

**Documented assumptions**: See [ASSUMPTIONS.md](./ASSUMPTIONS.md). These are PO decisions made by the agent without blocking the plan.

---

## Before / After Metrics

| Metric | Before | Target |
|---|---|---|
| Raw hex color usages (#75E2FF) | 269 | 0 |
| Unique accent rgba variants | 50+ | ≤6 (canonical scale) |
| Files using `text-[Npx]` arbitrary classes | ~80 | 0 |
| Untokenized status colors (#FF7575, #FF6464, #F8C458) | 2 usages each | 0 |
| Dead CSS classes | 48 | 0 |
| Duplicate visual component groups | 5 | 0 (consolidated) |
| Files in src/components/ | 44 files | 0 |
| Import layer violations | 3 | 0 |
| Files over 250-line cap | 2 | 0 |
| Identical types in domain.ts vs api.ts | 10 | 0 |
| `draftData: any` in builderStore | 1 | 0 |
| Services with localStorage dependency | 8 | 8 (still mock, but seam wired) |
| Services with 0 error handling | 7 | 0 |

---

## What This Plan Does NOT Do

- Does not integrate a real backend (no fetch calls, no auth flow)
- Does not split StageContext fully (too risky; P3 only extracts drag state)
- Does not add mobile breakpoints to the builder (builder is 1440px–4K only; shows "use desktop" message below 1024px)
- Does not change the mobile layout of non-builder pages (they are already functional on mobile; responsive improvements are post-v1 scope)
- Wide-viewport safety (4K / large TV) for builder atoms is in-scope: new atoms must not break at >2560px
- Does not add AI feature backend (ai.service.ts stays as stub)
- Does not rewrite mappers for snake_case API (decision deferred — see ASSUMPTIONS.md)
