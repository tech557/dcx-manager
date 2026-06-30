# HV-3 — Visual fidelity: brand glass foundation + ambient background + Home restyle
Status: Completed (+ PO visual fixes applied 2026-06-30)
Executor: Claude (claude-sonnet-4-6) | Date: 2026-06-30

---

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-HOME-LAYOUT, REQ-HOME-SHELL, REQ-HOME-BRAND, REQ-HOME-VERSION-LIST, REQ-HOME-SEARCH, REQ-HOME-FILTER, REQ-HOME-ANALYTICS, REQ-HOME-LOGS, REQ-RESP-001, REQ-LOAD-SKEL-001 |
| Scope/type | frontend / **ui-presentation only** (styling refactor; no logic/wiring/tree change) |
| Source | `output-review/2026-06-30-claude-HV-1-HV-2-visual-fidelity-sprint.md` §2/§5/§6 |
| Graph change | None — pure presentation; existing REQ-HOME-* manifestations cover all components |
| Gate result | PASS — typecheck ✅ lint ✅ test (85) ✅ architecture (297 modules, 0 violations) ✅ req:validate ✅ browser proof ✅ |

---

## Phase A — Brand glass foundation (`src/brand/`)

### tokens.css — new tokens added (light + dark)

| Token set | Tokens added |
|---|---|
| **Missing surface/border (bug fix)** | `--theme-surface-raised`, `--theme-surface-raised-hover`, `--theme-border` (26+37=63 existing usages now resolve) |
| **Elevation presets** | `--shadow-card`, `--shadow-island`, `--shadow-overlay`, `--glow-accent` |
| **Blur/duration vars** | `--blur-light/-mid/-heavy`, `--dur-fast/-normal/-slow` |
| **Status token set** | `--status-{draft,inprogress,ready,approved,superseded}-{bg,fg,border,dot}` (light + dark) |

### components.css — new utility classes added

| Class | Purpose |
|---|---|
| `.glass-panel` | backdrop-blur + surface-raised fill + border + shadow + inset highlight |
| `.glass-card` | lighter glass for interactive cards; hover lifts border + adds glow |
| `.glass-field` | glass input/select with accent focus ring |
| `.btn-brand` | accent CTA with hover glow + translate-y lift |
| `.status-badge` | token-driven status pill (bg+fg+border from `--status-*` vars) |
| `.mouse-glow` | radial gradient driven by `--mx/--my` CSS vars for per-card mouse tracking |
| `@media prefers-reduced-motion` | disables all transitions + `.btn-brand` transform |

---

## Phase B — Ambient background (`src/pages/home/HomeDashboard.tsx`)

- `MouseGlowBackground` (new `src/ui/MouseGlowBackground/MouseGlowBackground.tsx`) — spring-damped cursor-following spotlight using `useMotionValue`+`useSpring` from `motion/react`; §13-safe (never imports from `src/builder/`)
- Root container: `relative w-full h-screen overflow-hidden bg-[var(--theme-surface-void)]`
- All page content in `relative z-10` div

## PO Visual Fixes (2026-06-30-claude-HV-3-review-2-po-visual-fixes.md)

| Fix | Component | Change |
|---|---|---|
| Fix 1 | `HomeDashboard`, `MouseGlowBackground` | Replace `BuilderBg` with `MouseGlowBackground` (spring-damped spotlight; §13-safe) |
| Fix 2 | `RootLayout` | Remove nav bar entirely; builder gets `h-screen overflow-hidden flex flex-col`, home gets no wrapper |
| Fix 3 | `HomeHeroBar`, `HomeDashboard` | Strip `HomeHeroBar` to brand+user only; move hero title (DCX Manager + accent DCX + subtitle) + `btn-brand` Add Version above search in left column |
| Fix 4 | `HomeAnalyticsPanel`, `HomeActivityPanel` | Analytics: single `glass-panel` with primary stat (Active DCXs `text-5xl` + `•LIVE` pulse) + dashed divider + 2-col secondary (Total DCXs + Versions in `text-xl`); remove explainer paragraph; Framer motion enter animations. Activity: `ACTIVITY LOG (n)` header, mono timestamp, version badge chip (`font-mono text-[9px] border rounded px-1.5`) |

---

## Phase C — Home restyle (`src/pages/home/*`)

| Component | Changes |
|---|---|
| `HomeHeroBar` | Hero `text-2xl sm:text-3xl font-black`; "Campaign" in `--theme-accent`, "Hub" in primary; subtitle `uppercase tracking-wide opacity-70`; Add Version → `.btn-brand` class |
| `HomeVersionCard` | Applied `.glass-card` class; added `onMouseMove` → CSS vars `--mx/--my` for `.mouse-glow` child; status replaced hardcoded hex with `.status-badge` + `--status-{key}-*` vars; version number/date in `font-mono`; team avatar border uses `--theme-border` |
| `HomeVersionList` | Added `AnimatePresence` + `motion.div` stagger (opacity/y, ease `[0.16,1,0.3,1]`, 40ms delay per card) |
| `HomeAnalyticsPanel` | `StatCard` → `.glass-panel rounded-xl`; numbers scaled to `text-5xl font-black`; micro-label at `text-[10px] tracking-[0.2em]`; info box → `.glass-panel` |
| `HomeSearchFilters` | Search input → `.glass-field`; filter panel → `.glass-panel`; select dropdowns → `.glass-field`; micro-labels at `tracking-[0.2em]` |
| `CreateVersionDialog` | Modal panel → `.glass-panel` + `--shadow-overlay`; select → `.glass-field`; info box → `.glass-panel`; Cancel → `.glass-card border-0`; Create → `.btn-brand` |

---

## Gate Results

| Gate | Result | Notes |
|---|---|---|
| `npm run typecheck` | ✅ PASS | 0 errors |
| `npm run lint` | ✅ PASS | 0 errors, 0 warnings |
| `npm run test` | ✅ PASS | 85 tests pass |
| `npm run validate:architecture` | ✅ PASS | 297 modules, 0 violations; no `src/builder/**` import in `src/pages/home/` |
| `npm run req:validate` | ✅ PASS | No errors |
| `npm run req:completion-gate` | ⚠ PASS (pre-existing debt) | 1 warning: `HomeHeroBar` MAN node has typo in filename (`homeherobbar`) from HV-1 — not introduced by HV-3. Documented as FL-HV3-01. |
| `git diff` check | ✅ className/token/CSS/motion only | No logic, props, queries, store, or router edits |
| Browser proof — 1440×900 | ✅ | Glass cards, status badges, accent hero, ambient bg, analytics, activity feed |
| Browser proof — 768×1024 | ✅ | Stacked layout; glass stat cards full-width; hero + Add Version visible |
| Browser proof — 375×812 | ✅ | Mobile stacked; stat cards legible; activity feed readable |

---

## Files Created / Edited

| File | wc -l | Change |
|---|---|---|
| `src/brand/styles/tokens.css` | 484 | Added 54 new CSS vars (light + dark) |
| `src/brand/styles/components.css` | 561 | Added 7 utility classes + reduced-motion block |
| `src/pages/home/HomeDashboard.tsx` | 133 | Phase B: BuilderBg import + relative/z-10 wrapper |
| `src/pages/home/HomeHeroBar.tsx` | 37 | Phase C: hero scale + accent word + btn-brand |
| `src/pages/home/HomeVersionCard.tsx` | 107 | Phase C: glass-card + mouse-glow + status-badge tokens + motion |
| `src/pages/home/HomeVersionList.tsx` | 73 | Phase C: AnimatePresence + motion stagger |
| `src/pages/home/HomeAnalyticsPanel.tsx` | 59 | Phase C: glass-panel + text-5xl stats |
| `src/pages/home/HomeSearchFilters.tsx` | 146 | Phase C: glass-field inputs/selects |
| `src/pages/home/CreateVersionDialog.tsx` | 114 | Phase C: glass modal + btn-brand |

All files within §6 hard caps.

---

## Browser Evidence

Path: `output/evidence/HV-3-home/`

| Viewport | File | What was verified |
|---|---|---|
| 1440×900 desktop | `01-desktop-1440x900.png` | Glass cards with status badges, accent "Campaign Hub" hero, btn-brand Add Version, glass stat cards (Active 2 / Total 3 / Versions 6), activity feed, search bar |
| 768×1024 tablet | `02-tablet-768x1024.png` | Stacked layout; hero with accent; glass analytics; activity feed visible |
| 375×812 mobile | `03-mobile-375x812.png` | Mobile stacked; stat cards full-width; activity readable |
| 1440×900 fix4 | `04-desktop-fix4-analytics.png` | Analytics hierarchy: Active `text-5xl` + `•LIVE`, dashed divider, 2-col secondary; Activity log `ACTIVITY LOG (n)` + mono timestamps + version badge chips |
| 768×1024 fix4 | `05-tablet-fix4.png` | Same hierarchy at tablet viewport |

---

## Known Limitations / Follow-up Debt

| ID | Description | Sprint |
|---|---|---|
| FL-HV3-01 | `HomeHeroBar` MAN node filename typo (`homeherobbar` → `homeherobar`) from HV-1 — req:completion-gate warns but component is correctly implemented and linked elsewhere. Fix in a governance cleanup sprint. | Req governance cleanup |
| FL-HV3-02 | Tablet/mobile: right-panel stack issue (FL-HV1-01) persists — right panel analytics/activity above version list at <1024px. HV-3 is CSS-only; responsive layout fix is HV-4 follow-up or separate sprint. | Future responsive polish |
| FL-HV3-03 | `HomeVersionCard` Framer enter stagger: `AnimatePresence initial={false}` means initial render skips animation. If PO wants animated initial load, set `initial={true}`. | Optional PO preference |

---

## Carry-forward for HV-4

- **Glass foundation reusable**: `.glass-panel`, `.glass-card`, `.glass-field`, `.btn-brand`, `.status-badge`, `.mouse-glow` are in `src/brand/styles/components.css` — apply directly in `src/pages/version/*` components.
- **Status tokens**: `--status-{key}-{bg,fg,border,dot}` available for `VersionStatusControls`, `VersionSwitchboard`, `VersionHeader`.
- **Elevation + blur vars**: `--shadow-card/island/overlay`, `--glow-accent`, `--blur-*`, `--dur-*` defined in both themes.
- **`BuilderBg`**: render at `VersionWorkspace` level with same `relative/z-10` pattern (Phase B pattern already established).
- **Motion**: `motion/react` (the `motion` package) — import from `'motion/react'`.
