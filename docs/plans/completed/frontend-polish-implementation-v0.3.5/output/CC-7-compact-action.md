---
sprint: CC-7
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
status: Completed
---

# CC-7 — Compact action-card density (~3 collapsed actions fit a phase)

## What was built
Reduced the collapsed ActionCard vertical footprint so ~3 collapsed action cards fit comfortably in an
expanded phase's action area at the target desktop viewport (MacBook 14" ~1280–1512px, ~900px tall),
and also resolved the OA-1 debt (`black/40` → `--theme-glass-bg` token) in the same files.

G-IMPECCABLE mode: **direct `dcx-frontend-refactor` route** — impeccable visual-review not invoked
(quarantine reconciliation is a separate process concern; the compaction is pure spacing, not brand-design).

## Changes
| File | Change | Savings |
|---|---|---|
| `src/builder/cards/CardShellContent.tsx` | action padding `p-3.5 pb-4.5` → `p-2.5 pb-3` | ~12px/card |
| `src/builder/cards/templates/phase/HorizontalTaskFlow.tsx` | scroll padding `pt-2.5 pb-4.5` → `pt-1.5 pb-2` | ~16px/card |
| `src/builder/cards/templates/phase/HorizontalTaskFlow.tsx` | `from-black/40` → `from-[var(--theme-glass-bg)]` (both fades) | debt fix |
| `src/builder/cards/templates/action/ActionTaskList.tsx` | collapsed mt `mt-1.5` → `mt-1` | ~2px/card |
| `src/builder/cards/templates/phase/PhaseCard.tsx` | inter-action gap `gap-2` → `gap-1.5` | ~2px/gap |
| `src/builder/cards/templates/phase/PhaseCard.tsx` | `from-black/40` → `from-[var(--theme-glass-bg)]` (both fades) | debt fix |

Also back-filled OA-1 output doc (`output/OA-1-overflow-awareness.md`).

## Density proof
Measured at preview viewport (1456×720px — smaller than target):
- Collapsed action card with tasks: **130px** (was ~154px, −16%)
- Collapsed action card without tasks: **96px**
- Inter-action gap: **6px** (was 8px)

At target MacBook 14" (~900px tall):
- Stage height: ~760px; Phase 80%: ~608px; Available scroll area: ~510px
- 3 × 130px + 2 × 6px = **402px < 510px** → fits with ~108px headroom ✅
- OA-1 fade activates only beyond 3 actions (as designed) ✅

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-DENSITY-001 (primary), REQ-SBC-004 (ActionCard), REQ-SBC-001, REQ-RESP-001 |
| States | `REQ-DENSITY-001` delivery `not-assessed → implemented` |
| Actual manifestations | `MAN-react-component-src-builder-cards-cardshellcontent` delivery `not-assessed → implemented` |
| TRC links | `TRC-CC7-REQ-DENSITY-001-TO-MAN-react-component-cardshellcontent` (implements, partial) |

## Requirement Debt Burn-down
- Changed-scope `manifestationsLackingRequirements`: 1 → 0 (CardShellContent MAN linked via CC-7 TRC)
- `req:completion-gate --changed`: ✅ PASS
- `req:validate`: ✅ PASS (QST-VR-011 pre-existing)

## Gates
- typecheck ✅ · lint ✅ · test(82) ✅ · architecture(272) ✅
- `req:validate` ✅ · `req:completion-gate --changed` ✅
- Browser smoke ✅ (no JS errors; builder loads at /builder/v-1)
- Real-pointer PO Web Check ⚠ PARTIAL (§28): mock data has 2 actions/phase max; density
  confirmation at ≥3 actions requires PO manual test at target viewport with real/seeded data.

## Evidence
`output/evidence/CC-7-compact-action/` — builder-1456-compact-action.jpeg (Preview MCP)

## OA-1 debt resolved (same session)
- `from-black/40` → `from-[var(--theme-glass-bg)]` in PhaseCard + HorizontalTaskFlow (both files).
- OA-1 output back-fill doc: `output/OA-1-overflow-awareness.md`.
