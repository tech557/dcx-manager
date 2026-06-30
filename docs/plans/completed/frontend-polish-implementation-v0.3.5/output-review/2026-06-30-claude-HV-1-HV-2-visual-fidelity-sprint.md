---
review: HV-1 / HV-2 visual-fidelity gap + recommended styling-refactor sprint
sprint: HV-1, HV-2 (review) → HV-3/HV-4 (recommended)
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: CONFIRMED — components correct & wired; gap is styling-only + one real token bug. Recommend a styling-refactor sprint (no logic/wiring/component-tree changes).
---

# HV-1 / HV-2 — Visual fidelity review vs v0.1.4 + recommended sprint

## 1. Verdict

The PO's read is correct. HV-1 and HV-2 produced the **right components, correctly wired**, but the
**styling is flat** vs the v0.1.4 reference. The gap is a **styling refactor**, not a rebuild. There is
also **one concrete bug** (undefined design tokens) that accounts for much of the washed-out look.

Root cause is structural, not careless: both HV sprint specs mandate `dcx-frontend-refactor` and
explicitly **"no impeccable"** (the visual-polish skill was quarantined). FP-R5 framed HV-1/HV-2 as
"rebuild the **operational** reference from v0.1.4" — functional parity, not visual parity. So the
agents built function and skipped the glass/depth/motion layer by design.

## 2. The one real bug (fix first — high leverage, low effort)

`--theme-surface-raised` (**26 uses**) and `--theme-border` (**37 uses**) are referenced across every
Home/Version component (`src/pages/**`, `src/ui/app-shell/PageUserBlock.tsx`) but are **defined nowhere**
in `src/` (verified: 0 definitions in CSS or JS). Consequences:
- `bg-[var(--theme-surface-raised)]` → invalid var → **transparent** fill (cards have no surface).
- `border-[var(--theme-border)]` → invalid var → border-color falls back to **currentColor** (text color).

So every card/panel/input on both pages renders as a near-transparent box with a text-colored hairline —
exactly the "flat, washed-out" look in the screenshots. The brand system DOES define the right tokens
under different names (`--theme-surface-deep/-void/-dark`, `--theme-component-fill-*`,
`--theme-component-border*`, `--theme-border-subtle`). **Either** alias the missing names **or** codemod
the usages to real tokens (the sprint below adds proper glass tokens and adopts them).

## 3. What already exists and should be REUSED (REUSE-don't-RECREATE, core.md §7)

- **Mouse-light background — `src/ui/BuilderBg/BuilderBg.tsx`** (canvas `LightRays`). It lives in
  `src/ui`, **not** `src/builder`, so rendering it on Home/Version is **§13-safe** (no builder import).
  Usage: render inside a `relative overflow-hidden` container, content at `z-10`. Props: `selectedNodeIds`
  (pass `[]` off-builder). This is the "same bg from the builder — mouse light" the PO asked for.
- **Glass classes already in the brand system** (`src/brand/styles/components.css`): `.glass`,
  `.glass-dark`, `.glass-light`, `.glass-glow`, `.island-shell` (24px backdrop-blur, inset highlight,
  shadow). Currently **unused** by HV pages.
- **Accent scale** (`tokens.css`): `--theme-accent` `#75E2FF` plus `-subtle/-soft/-bg/-medium/-strong/
  -selected-glow` and `-deep #006080`. Enough for tinted fills, borders, and glows without new colors.
- **Component depth tokens**: `--theme-component-fill-*`, `--theme-component-border*`,
  `--theme-component-inset-highlight*`, `--theme-component-shadow-*` (color values), `--theme-glass-bg`.
- **Motion**: `motion/react` (Framer) is already a dependency (used by StageCore/cards) — reuse for
  enter/hover, no new dep.

## 4. The v0.1.4 visual language (target) — distilled

From `docs/archive/dcx-manager-v0.1.4/src`:
- **Background**: pointer-tracked radial spotlight (`useSpring` damping 25 / stiffness 150), accent at
  `rgba(117,226,255,0.35)→0.1→transparent`, `blur(40px)`; + static corner glow; + faint scanning lines;
  + an 8s sweeping scan line. → our `BuilderBg` is the equivalent (canvas rays); reuse it.
- **Glass surfaces everywhere** (`GlassCard`): `backdrop-blur-2xl/3xl`, translucent fill
  (`bg-black/40` dark / `bg-white/60` light), hairline border (`white/5`), shadow
  `0_8px_32px_rgba(0,0,0,0.4)`, hover glow `0_0_25px_rgba(117,226,255,0.1)`.
- **Per-card mouse-follow glow**: each version card paints a local `radial-gradient(400px circle at
  mouseX mouseY, accent/0.05, transparent 80%)` on hover.
- **Status as a system** (badge = tinted bg + colored text + border + glow; "Ready" `animate-pulse`):
  Approved=emerald, Ready=accent, In-Progress=amber, Draft=neutral, Superseded=muted.
- **Typography**: heavy `font-black tracking-tightest`; hero `text-5xl`, accent-colored first word;
  micro-labels `text-[10px] tracking-[0.2em–0.3em] uppercase opacity-30`; mono for dates/version nums.
- **Motion**: Framer enter (`opacity/x/scale`, ease `[0.16,1,0.3,1]`, small stagger), hover `scale 1.002`,
  chevron translate-x, avatar grayscale→color on hover.

## 5. Per-surface gap map (current → target)

| Surface | Current (flat) | Target (v0.1.4 parity) | Mechanism |
|---|---|---|---|
| Page bg | static `.app-shell` linear gradient, no motion | builder mouse-light spotlight | render `<BuilderBg/>` in RootLayout/page, content `z-10` |
| Version row / card | `bg-[var(--theme-surface-raised)]`(undefined)+border | glass fill + blur + shadow + hover accent glow + mouse-follow radial | `.glass-glow` + new `--shadow-card`/`--glow-accent` + local radial util |
| Hero title | `text-dcx-lg font-black` | `text-4xl/5xl font-black tracking-tightest`, accent first word | typography pass |
| Primary button (Add/Launch) | `bg-accent hover:opacity-90`, no depth | branded: glow ring + blur + hover scale | new `.btn-brand` / BrandedButton pattern |
| Status badge | hardcoded hex / mixed tailwind colors | token-driven badge (bg+text+border+glow), Ready pulse | new `--status-*` token set + `.status-badge` |
| Inputs / search | flat `surface-raised`+border | glass field, focus accent ring + bg lift | glass field class + accent focus |
| Panels (analytics/activity/resources/crew/switchboard/summary) | flat boxes | glass panels w/ inset highlight + section micro-labels | `.glass` + inset-highlight token |
| Dividers | `border-[var(--theme-border)]`(→currentColor) | `--theme-divider` / `border-subtle` | token fix |
| Motion | none | Framer enter+hover, status pulse | `motion/react` |

## 6. Recommended sprint(s)

Scope is real — recommend splitting into **two** sequenced sprints to keep each reviewable. Both are
**styling-only**: no component-tree changes, no prop/logic/wiring changes, no requirement-graph changes
(pure presentation; existing `REQ-HOME-*`/`REQ-VER-*` manifestations already cover these components — no
new `req:propose`). `impeccable` is **permitted in `src/brand/` only** (quarantine lifted 2026-06-28);
all page edits are hand-authored Tailwind/token swaps. **No `src/builder/**` imports (§13).**

### HV-3 — Brand glass foundation + shared ambient background + Home restyle
**Phase A — Brand system expansion (`src/brand/` only; impeccable allowed):**
1. **Fix tokens**: add `--theme-surface-raised`, `--theme-surface-raised-hover`, `--theme-border`
   (light+dark) as proper aliases, so the 63 existing usages render correctly immediately. (Dark:
   raised ≈ `rgba(255,255,255,0.04)`, raised-hover ≈ `rgba(255,255,255,0.07)`, border ≈
   `--theme-border-subtle`. Light: mirror with black alphas.)
2. **Elevation scale** — full box-shadow presets as CSS vars + utility classes:
   `--shadow-card: 0 8px 32px rgba(0,0,0,0.30)`, `--shadow-island: 0 12px 40px rgba(0,0,0,0.20)`,
   `--shadow-overlay: 0 20px 50px rgba(0,0,0,0.30)`, `--glow-accent: 0 0 25px rgba(117,226,255,0.12)`.
3. **Glass page surfaces**: extend/add `.glass-panel`, `.glass-card`, `.glass-field`, `.btn-brand`,
   `.status-badge` classes that compose existing tokens (blur + translucent fill + inset highlight +
   border + shadow + hover glow). Add a `.mouse-glow` helper (CSS var `--mx/--my` driven radial).
4. **Status token set**: `--status-{draft,inprogress,ready,approved,superseded}-{bg,fg,border,dot}` for
   both themes (emerald/accent/amber/neutral) — replaces hardcoded hex in `HomeVersionCard`,
   `VersionHeader`, `VersionStatusControls`, `VersionSwitchboard`.
5. **Blur + duration vars**: `--blur-light/-mid/-heavy`, `--dur-fast/-normal/-slow`.

**Phase B — Shared ambient background:** wrap Home + Version content with `<BuilderBg/>` (or a thin
`<AmbientBackground/>` re-export in `src/ui` so the page doesn't reference a builder-flavored name);
container `relative overflow-hidden`, content `z-10`. Verify pointer-light tracks and there is no
scroll/perf regression. Keep `app-shell` gradient as the base layer beneath it.

**Phase C — Home restyle** (`src/pages/home/*`, no tree changes): apply `.glass-*` + tokens to
HomeDashboard shell, HomeHeroBar (hero `text-4xl/5xl`, accent first word, BrandedButton), HomeSearchFilters
(glass fields + focus accent), HomeSavedViews (pill states), **HomeVersionCard** (glass-glow + mouse-follow
radial + status badge + chevron motion + avatar hover), HomeAnalyticsPanel (big `text-5xl` figure + glass
stat cards), HomeActivityPanel (timeline rows + hover), CreateVersionDialog (glass modal + overlay blur).
Framer enter/stagger on the list.

### HV-4 — Version restyle + motion polish
Apply the same foundation to `src/pages/version/*`: VersionWorkspace shell + ambient bg, VersionHeader
(breadcrumb micro-labels, accent title, collaborator stack), VersionStatusControls (token status +
active glow), VersionSwitchboard (glass items, active accent state, status flags), VersionSummaryPanel /
VersionStructureSummary (glass count cards + glass hover popups), VersionResourcesPanel (FileTag-style
glass tags + lift on hover), VersionCrewPanel, **VersionBuilderPanel** (the branded launch — glow ring +
blur + hover scale, "more than a button" per HV-2 D-5). Add Framer enter/hover across both pages; "Ready"
status pulse; optional scan-line accent. Re-align SK-1 skeletons to the new glass geometry
(REQ-LOAD-SKEL-001).

## 7. Constraints & gates (both sprints)
- **No** component add/remove/rename; **no** prop/handler/query/store/router changes; diffs are
  className/token/CSS + optional `motion/react` wrappers only. Reviewer should `git diff` to confirm no
  logic touched.
- **No `src/builder/**` import** in `src/pages/**` (grep gate). `BuilderBg` is `src/ui` → allowed.
- Gates: `typecheck` · `lint` · `validate:architecture` · `test` · `req:validate` (no graph change
  expected) · **browser proof at 3 viewports** (desktop 1440×900, tablet 768×1024, mobile 375×812 —
  REQ-RESP-001) with before/after screenshots → `output/evidence/HV-3-home/`, `output/evidence/HV-4-version/`.
- Perf: confirm the canvas bg doesn't cause jank on Home/Version (it's `pointer-events-none`, GPU canvas).

## 8. Effort / sequencing
Foundation (Phase A) is the unlock and is small + high-leverage (also fixes the token bug for the whole
app). Do HV-3 then HV-4. If the PO wants one sprint, ship Phase A + B + Home (HV-3) first and review
before Version — the glass foundation is reusable, so HV-4 is then mostly mechanical application.

## 9. Files (reference, no edits made this review)
Reference: `docs/archive/dcx-manager-v0.1.4/src/{components/Background.tsx,components/ui/GlassCard.tsx,
styles/tokens.ts,pages/home/*,pages/version/*}`.
Reuse: `src/ui/BuilderBg/BuilderBg.tsx`, `src/brand/styles/{tokens,theme,components}.css`.
Restyle targets: `src/pages/home/*` (HV-3), `src/pages/version/*` (HV-4), `src/ui/app-shell/PageUserBlock.tsx`.
