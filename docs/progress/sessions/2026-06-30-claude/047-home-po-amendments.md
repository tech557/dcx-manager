---
log: 047-home-po-amendments
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-code
PO-Action: none
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: HV-3
---

# 047 — Homepage PO amendments (7)

PO gave 7 homepage tweaks (HV-4 already run separately). Applied + verified.

## Changes
1. **Brand header → DOTMENT**: `src/ui/app-shell/PageBrandBlock.tsx` "DCX Manager" → "DOTMENT"
   (shared block → also updates the Version page header; hero h1 stays "DCX Manager").
2. **Remove divider lines**: `HomeDashboard.tsx` dropped `border-b` between hero↔search and search/views↔list.
3. **Remove "Views" label**: `HomeSavedViews.tsx` removed the standalone "Views" span (pills remain).
4. **Active saved-view doesn't offer Save**: `HomeDashboard.tsx` `canSave={hasNonDefaultFilters && activeViewId === null}`.
5. **Disable Filters + "soon" tag**: `HomeSearchFilters.tsx` Filters button `disabled` with a branded
   `soon` pill; removed the active-count badge + clear-filters button (and unused `hasActiveFilters`,
   `clearFilters`, `X` import). Sidebar code retained (dead until re-enabled).
6. **Analytics icon alignment**: `HomeAnalyticsPanel.tsx` secondary stats → `items-center h-7 leading-none`
   so the Versions bar-glyph sits on the number's line, aligned with Total DCXs.
7. **Activity log restructure**: `HomeActivityPanel.tsx` now leads with **Client › Project** + the version
   **status badge** (reuses `STATUS_TOKEN` + `.status-badge` + `--status-*` tokens) + version number +
   mono timestamp; dropped the event-verb/avatar layout.

## Gates
typecheck ✅ · lint ✅ · test 85 ✅.

## Browser verification (Preview MCP, clean restart, /, 1440×900)
DOTMENT brand ✅ · hero "DCX Manager" above search, no dividers ✅ · no "Views" label ✅ · activating the
"Active" saved view shows **no** Save-view button ✅ · Filters disabled + SOON ✅ · analytics renders
"2 Active Campaigns (LIVE) · 3↑ Total DCXs · 6 Versions" in one glass panel ✅ · activity rows =
"ALMARAI › Summer Campaign / [SUPERSEDED] V2" etc ✅ · **zero console errors** on fresh load (the
`hasActiveFilters is not defined` spam seen mid-edit was stale HMR between the two-step edit; gone after
server restart).

## Notes
- Secondary analytics stats use v0.1.4-muted `opacity-30` labels (faint by design); raise if PO wants more contrast.
- PageBrandBlock is shared → DOTMENT now shows on the Version header too (consistent brand).
