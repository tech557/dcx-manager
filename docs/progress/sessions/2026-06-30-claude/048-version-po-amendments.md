---
log: 048-version-po-amendments
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-code
PO-Action: none
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: HV-4
---

# 048 — Version page PO amendments (5)

PO amendments to the Version page (HV-4). Applied + browser-verified.

## Changes
1. **Remove version number from header**: `VersionWorkspace.tsx` brand strip no longer renders
   `activeVersion.versionNumber`.
2. **Bigger title size token**: `VersionHeader.tsx` h1 `text-2xl sm:text-3xl` → `text-4xl sm:text-5xl
   font-black tracking-tighter`.
3. **Single status control via the builder dropdown** (REUSE-don't-RECREATE):
   - Extracted `StatusDropdownBadge` from `src/builder/islands/MetadataIsland/` → `src/ui/status/`
     (§13-safe; only importer was `MetadataDetailsContent.tsx`, re-pointed; old builder copy deleted).
   - `VersionHeader` now renders one `StatusDropdownBadge` (version status) wired to a
     `updateVersionStatus` mutation; removed the derived read-only campaign-status badge **and** the whole
     `VersionStatusControls` component (deleted) → no more duplicate status.
4. **Version column moved left, below title**: `VersionWorkspace` body — `VersionSwitchboard` is now the
   left column (`lg:w-56 xl:w-64`); the version command is the main area.
5. **Summary + builder opener in one viewport**: `VersionSummaryPanel` is now a 2-col grid
   (left: builder opener + structure; right: resources + crew with internal scroll); body is
   `overflow-hidden` → **no page scroll** on desktop.

## Gates
typecheck ✅ · lint ✅ · test 85 ✅.

## Browser verification (Preview MCP, clean restart, /version/v-1, 1440×900)
DOTMENT brand, no version # in strip ✅ · title "Brand Awareness Q3" at the larger size ✅ · single status
**dropdown** opens ✅ and a valid transition applies (In Progress → Ready for Approval changed the badge) ✅
· version column (V1/V2) on the left ✅ · builder opener + structure (11/59/329) + docs + crew all in one
viewport, **no page v/h scroll** ✅. Screenshot matches the intended layout.

## Notes (non-blocking)
- The dropdown (being the builder's exact component) offers all statuses; **invalid/backward transitions**
  (e.g. In Progress → Draft) are rejected by the mock service and log `[mock error report]` with no change —
  same behavior as the builder. If the PO wants only valid transitions selectable, that's a follow-up.
- `[mock error report]` also fires a few times on **version-page load** — pre-existing (these amendments
  add no load-time service calls; it comes from existing version queries via `withServiceErrorHandler`).
  Flagged for separate investigation.
- `StatusDropdownBadge` moved to `src/ui/status/` — builder still uses it (import re-pointed); both pages
  now share one component.
