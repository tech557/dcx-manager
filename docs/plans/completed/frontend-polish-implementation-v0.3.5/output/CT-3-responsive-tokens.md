---
sprint: CT-3
title: Responsive layout — fluid dimension tokens
status: Completed
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
---

# CT-3 — Fluid Dimension Tokens (Responsive Scaling 1280→3840px)

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-RESP-001 (primary), REQ-FP-D12, REQ-FP-D01, REQ-STG-001, REQ-STG-003, REQ-SBC-003 |
| Scope/type | frontend / ui-presentation (responsive sizing) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → `implemented` then `verified` |
| Source/lock | REQ-RESP-001 (PO 2026-06-30); CT-2 `--dim-*` tokens; reconciles `core.md §10`/`§21` |
| Expected EMC | EMC-STG-SEED, EMC-SBC-SEED, EMC-IFX-SEED |
| Gate result | ✅ PASS |

## G-IMPECCABLE

Direct brand-contract route. Fluid sizing only — no redesign, no structural change (§10 honored).

## What was done

**Debt fixes (from CT-1/CT-2 review):**
- `sprints/CT-2.md` status label: `Drafted` → `Completed`
- `sprints/SK-1.md` status label: `Drafted` → `Completed`

**CT-3 core change — `src/brand/styles/tokens.css`:**

Converted 6 fixed `--dim-*` tokens to `clamp()` fluid values. Consuming components already reference `var(--dim-*)` via inline styles (CT-2); no component changes needed.

| Token | CT-2 fixed | CT-3 fluid | @1280px | @1440px | @2560px |
|---|---|---|---|---|---|
| `--dim-phase-collapsed` | `4.5rem` | `clamp(3.5rem, 5vw, 5.5rem)` | 64px | 72px | 88px (cap) |
| `--dim-phase-expanded` | `260px` | `clamp(220px, 18.06vw, 340px)` | 231px | 260px | 340px (cap) |
| `--dim-editor-width` | `25rem` | `clamp(18rem, 27.78vw, 32rem)` | ~356px | 400px | 512px (cap) |
| `--dim-builder-header` | `64px` | `clamp(56px, 4.44vw, 80px)` | ~57px | 64px | 80px (cap) |
| `--dim-builder-footer` | `76px` | `clamp(64px, 5.28vw, 96px)` | ~68px | 76px | 96px (cap) |
| `--dim-selection-max-width` | `420px` | `clamp(320px, 29.17vw, 560px)` | ~373px | 420px | 560px (cap) |

**Decisions honored:**
- §10 (frozen layout): 3-row structure unchanged — only sizing changes
- §21 (density): `--dim-phase-expanded` at 1280px = 231px (≤260px floor cap honored); grows above 260px from ~1440px onward (additive, per CT-3 spec)

## Gates

| Gate | Result |
|---|---|
| `npm run typecheck` | ✅ PASS |
| `npm run lint` | ✅ PASS |
| `npm run test` | ✅ PASS (82 tests) |
| `npm run validate:architecture` | ✅ PASS (267 modules, 0 violations) |
| `npm run req:validate` | ✅ PASS (QST-VR-011 pre-existing, non-blocking) |
| `npm run req:completion-gate --changed tokens.css` | ✅ PASS |
| Multi-viewport browser proof (Preview MCP) | ✅ see evidence below |

## Browser evidence

Route `/builder/v-1` — Preview MCP, real computed values:

**1280×800:**
- headerH: 56.8px ← clamp(56px, 4.44vw=56.8px, 80px) ✓
- footerH: 67.6px ← clamp(64px, 5.28vw=67.6px, 96px) ✓
- 3-row structure intact, 8 phases visible, no horizontal scroll

**1512×982 (14" MBP):**
- headerH: 67.1px ← clamp(56px, 4.44vw=67.1px, 80px) ✓
- footerH: 79.8px ← clamp(64px, 5.28vw=79.8px, 96px) ✓
- 3-row structure intact, all phases readable

**2560×1440:**
- headerH: 80px ← clamp cap hit ✓
- footerH: 96px ← clamp cap hit ✓
- 3-row structure intact, columns scale proportionally

Screenshots: `output/evidence/CT-3-responsive/`

## Requirement Debt Burn-down

- Manifestations lacking requirements: 0 (no new MAN nodes)
- `req:completion-gate --changed`: Gate ✅ PASS
- `req:validate`: ✅ PASS (QST-VR-011 pre-existing)
- Candidate links: 2 (pre-existing; CT-3 did not create new ones)
