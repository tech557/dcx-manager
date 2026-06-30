# HV-4 — Visual fidelity: Version page restyle + motion polish
Status: Completed
Executor: Claude (claude-sonnet-4-6) | Date: 2026-06-30

---

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-VER-LAYOUT, REQ-VER-HEADER, REQ-VER-COLLAB-DISPLAY, REQ-VER-LAUNCH, REQ-VER-DOCS, REQ-VER-STRUCTURE-SUMMARY, REQ-VER-SWITCHBOARD, REQ-RESP-001, REQ-LOAD-SKEL-001 |
| Scope/type | frontend / **ui-presentation only** (styling refactor; no logic/wiring/tree/prop/query/store/router change) |
| Depends on | HV-3 — brand glass foundation (`tokens.css`, `components.css`, `MouseGlowBackground`) already in place |
| Gate result | PASS — typecheck ✅ lint ✅ test (85) ✅ §13 grep (0 builder imports) ✅ browser proof ✅ |

---

## Changes Applied

### VersionWorkspace
- Added `MouseGlowBackground` ambient bg (same as Home, §13-safe)
- Container: `relative` + `z-10` content wrapper
- Brand strip: matches Home (thin `pt-4 pb-3`, `border-[var(--theme-border)]/40`, version number in `font-mono text-[10px]`)
- Body dividers: `divide-[var(--theme-border)]/25` (floating, not cutting)

### VersionHeader
- Breadcrumb: `text-[10px] tracking-[0.15em] uppercase` — hover → accent
- Campaign title: `text-2xl sm:text-3xl font-black` in `--theme-accent`; client as micro-label above; product as micro-label below
- Status pill: `.status-badge` with `--status-{key}-*` CSS vars (token-driven, matches Home cards)
- Collaborator avatars: accent ring

### VersionStatusControls
- Current status: `.status-badge` + token colours; "Ready for Approval" dot gets `animate-pulse`
- Transition buttons: `.glass-card` style, accent hover, `text-[10px] tracking-[0.1em] uppercase`

### VersionSwitchboard
- Status dots: `--status-{key}-dot` CSS vars (no more hardcoded colours)
- Active item: `.glass-card` + `border-[var(--theme-accent)]/50` + accent dot with glow shadow
- Inactive: transparent → subtle glass hover
- Version number: `font-mono text-[11px]`; status: `text-[9px] uppercase tracking`
- `AnimatePresence` + `motion.button` stagger (40ms delay per item)

### VersionStructureSummary
- `CountCard` → `.glass-panel` with accent number (`text-[var(--theme-accent)]`)
- Hover popup → `glass-panel` with `AnimatePresence` scale/opacity animation
- Cards animate in with `motion.div` stagger (0 / 50ms / 100ms)

### VersionResourcesPanel
- Each attachment row → `.glass-card` with `motion.a` + `whileHover={{ x: 2 }}`
- Enter animation: `opacity/x` stagger per row

### VersionCrewPanel
- Each member row: `motion.div` enter stagger (`opacity/x`)
- Lead badge: accent token colours (`bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/20 text-[var(--theme-accent)]/60`)

### VersionBuilderPanel (D-5 "more than a button")
- `motion.div` enter + `whileHover={{ scale: 1.01 }}` when editable
- Glow ring: `radial-gradient` accent accent behind content
- Icon container: accent glow shadow when editable
- CTA: `.btn-brand` (full-width, accent bg, hover lift)
- Locked state: muted, no glow, no hover scale

### VersionSummaryPanel
- Section dividers: `border-dashed border-[var(--theme-border)]/25` (floating)

### VersionMissingState
- `MouseGlowBackground` ambient bg
- Center card: `glass-panel rounded-2xl`
- Icon: accent tint container
- CTA: `.btn-brand`
- `motion.div` enter animation

---

## Gate Results

| Gate | Result | Notes |
|---|---|---|
| `npm run typecheck` | ✅ PASS | 0 errors |
| `npm run lint` | ✅ PASS | 0 warnings |
| `npm run test` | ✅ PASS | 85 tests pass |
| §13 grep (`src/builder/**` in `src/pages/version/`) | ✅ PASS | 0 matches |
| Browser proof — 1440×900 | ✅ | Glass header/panels, accent campaign title, status tokens, builder panel glow, structure cards, crew, switchboard with active accent |
| Browser proof — 768×1024 | ✅ | Stacked layout; all panels visible |
| Browser proof — 375×812 | ✅ | Mobile stacked; readable at all sizes |

---

## Files Edited

| File | Change |
|---|---|
| `src/pages/version/VersionWorkspace.tsx` | MouseGlowBackground, z-10 wrapper, floating dividers |
| `src/pages/version/VersionHeader.tsx` | Accent title, breadcrumb micro-label, status-badge tokens, collab avatars |
| `src/pages/version/VersionStatusControls.tsx` | status-badge + token vars, glass-card buttons, pulse on Ready |
| `src/pages/version/VersionSwitchboard.tsx` | Token dots, glass-card active + glow, font-mono, motion stagger |
| `src/pages/version/VersionStructureSummary.tsx` | glass-panel cards, accent numbers, AnimatePresence popup, motion stagger |
| `src/pages/version/VersionResourcesPanel.tsx` | glass-card rows, motion.a + whileHover |
| `src/pages/version/VersionCrewPanel.tsx` | motion stagger, accent Lead badge |
| `src/pages/version/VersionBuilderPanel.tsx` | motion enter + whileHover scale, glow ring, btn-brand CTA |
| `src/pages/version/VersionSummaryPanel.tsx` | Dashed floating dividers |
| `src/pages/version/VersionMissingState.tsx` | MouseGlowBackground, glass-panel, btn-brand, motion enter |

---

## Browser Evidence

Path: `output/evidence/HV-4-version/`

| Viewport | File |
|---|---|
| 1440×900 desktop | `01-desktop-1440x900.png` |
| 768×1024 tablet | `02-tablet-768x1024.png` |
| 375×812 mobile | `03-mobile-375x812.png` |
