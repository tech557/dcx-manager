---
sprint: SK-1
title: App-wide skeleton loading
status: Completed
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
---

# SK-1 — App-Wide Skeleton Loading

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-LOAD-SKEL-001, REQ-EVI-001, REQ-SBC-001, REQ-RDY-001, REQ-STG-001, REQ-KBI-001, REQ-FCS-001, REQ-FP-D07, REQ-EFP-001, REQ-UP-004, REQ-FP-D06 |
| Scope/type | frontend / ui-presentation (loading) |
| States | `delivery: not-assessed` → `delivery: implemented` |
| Source/lock | FP-R5-synthesis.md §SK-1; FP-R4 E08/C11/R05/K07/T05/F07 |
| EMC covered | EMC-EVI-SEED, EMC-STG-SEED, EMC-UP-SEED, EMC-EFP-SEED, EMC-GOV-TRACE-FRONTEND |

## What was done

### 1. Global shimmer CSS (`src/brand/styles/components.css`)
Added `.skeleton-block` (dark surfaces) and `.skeleton-block-light` (light surfaces) CSS classes with:
- 200%-wide gradient shimmer animation (`shimmer 1.6s infinite linear`)
- `@media (prefers-reduced-motion: reduce)` block: `animation: none` + static background — shimmer disabled, layout preserved

### 2. Shared primitive (`src/ui/skeleton/SkeletonBlock.tsx`)
Reusable `<SkeletonBlock surface="dark|light" className style />` component. References global CSS classes — no inline styles for animation. Single source of truth for reduced-motion compliance.

### 3. Builder skeleton refactored (`src/builder/BuilderLoadingShell.tsx`)
Removed inline `<style>` block (was duplicating animation keyframes per-render). Now uses `<SkeletonBlock>`. Skeleton geometry preserved (uses `--dim-*` tokens from CT-2).

### 4. Home skeleton (`src/pages/home/HomeLoadingSkeleton.tsx`)
Matches v0.1.4 Home layout geometry:
- 2-column layout (2.1fr / 0.9fr) with divider
- Left: hero bar + search/filter row + saved-view pills + 5 version card rows
- Right: workspace analytics (3 stat cards) + recently-opened activity list (6 rows)
- Uses `skeleton-block-light` (light-theme surface)

### 5. Version skeleton (`src/pages/version/VersionLoadingSkeleton.tsx`)
Matches v0.1.4 Version layout geometry:
- Header: back button + version title + status badge + action button
- Version switch bar (4 tabs)
- 2-column body: left (summary + dates + resources) / right (collaborators + crew tags)
- Uses `skeleton-block-light`

### 6. Pages updated
- `src/pages/home/HomePage.tsx` → renders `<HomeLoadingSkeleton />` (supersedes placeholder-screen until HV-1)
- `src/pages/version/VersionPage.tsx` → renders `<VersionLoadingSkeleton />` (supersedes placeholder-screen until HV-2)

### 7. REQ-LOAD-SKEL-001 updated
`delivery: not-assessed` → `delivery: implemented` in `nodes/requirement/REQ-LOAD-SKEL-001.json`

### 8. Proposals archived
Both applied proposals moved to `proposals/applied/`:
- `PRP-2026-06-29-create-node-REQ-LOAD-SKEL-001.json` ← SK-1 work done
- `PRP-2026-06-29-create-node-REQ-SBT-COPY-001.json` ← node existed, orphaned proposal

## no-targeted-test-exists evidence
`grep -r "SkeletonBlock\|skeleton\|shimmer" src --include="*.test.*"` → 0 hits. No skeleton unit tests exist. Full test suite (82 tests) passed.

## Gates

| Gate | Result |
|---|---|
| `npm run typecheck` | ✅ PASS |
| `npm run lint` | ✅ PASS |
| `npm run test` (82 tests) | ✅ PASS — no targeted test exists (code-query evidence above) |
| `npm run validate:architecture` | ✅ PASS (267 modules, 0 violations) |
| `npm run req:validate` | ✅ PASS (QST-VR-011 pre-existing) |
| `npm run req:completion-gate --changed` | ✅ PASS |
| Browser/visual proof | ✅ Playwright screenshots at 1440×900 for /home, /version, /builder |
| Reduced-motion | ✅ `@media (prefers-reduced-motion: reduce) { animation: none }` in compiled CSS |

## Browser evidence

Screenshots at 1440×900:
- `output/evidence/SK-1-skeletons/home-skeleton-1440.png` — Home skeleton layout (light surface)
- `output/evidence/SK-1-skeletons/version-skeleton-1440.png` — Version skeleton layout (light surface)
- `output/evidence/SK-1-skeletons/builder-skeleton-1440.png` — Builder skeleton (dark surface, now uses SkeletonBlock)

No layout jump on resolve: skeletons match the final 2-column geometry from v0.1.4. Reduced-motion compliance confirmed via `@media` rule in source CSS.

## Requirement Debt Burn-down

- `REQ-LOAD-SKEL-001` delivery: `not-assessed` → `implemented` ✅
- Proposals orphan queue: 2 → 0 (both archived to `proposals/applied/`)
- Changed-scope manifestationsLackingRequirements: 0 new unlinked
- `req:completion-gate --changed`: 1 manifestation in scope, gate ✅ PASS
- `req:validate`: ✅ PASS (QST-VR-011 pre-existing, non-blocking)
