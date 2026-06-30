---
review: HV-3 round 2 — PO visual fixes
sprint: HV-3
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: IN PROGRESS — HV-3 glass foundation landed and is a big improvement; 4 PO visual fixes required before close (1 background swap, 1 removal, 2 layout/hierarchy).
---

# HV-3 review (round 2) — PO visual fixes

HV-3 shipped the glass foundation + token-bug fix and the page reads far better. The PO reviewed the live
build and requires **4 fixes**. All are **styling/layout only** (no logic/query/store/router changes).
Grounded in v0.1.4 (`docs/archive/dcx-manager-v0.1.4/src`).

---

## Fix 1 — Replace the builder ray background with the v0.1.4 mouse-glow (builder keeps the rays)

**Current:** `src/pages/home/HomeDashboard.tsx` imports and renders `<BuilderBg selectedNodeIds={[]} />`
(L6, L76) — the canvas `LightRays` volumetric rays. PO: the rays belong to the **builder only**; Home
should use the **v0.1.4 mouse-glow** (a soft radial spotlight that follows the cursor).

**Do:**
1. Remove the `BuilderBg` import + element from `HomeDashboard.tsx`. Leave `BuilderBg` untouched and
   builder-only (`src/builder/BuilderPage.tsx`).
2. Create a reusable, theme-aware `src/ui/MouseGlowBackground/MouseGlowBackground.tsx` porting v0.1.4
   `components/Background.tsx` (the "library" is **`motion/react`**, already a dep — `useMotionValue` +
   `useSpring` + animated `style`). Use the brand accent token, not hardcoded hex.

```tsx
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';

// Soft pointer-tracked radial spotlight (v0.1.4 parity). pointer-events-none, sits behind content.
export function MouseGlowBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]" aria-hidden>
      {/* static corner glow (accent) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--theme-accent-soft),transparent_60%)]" />
      {/* cursor-following spotlight */}
      <motion.div
        className="absolute h-[1000px] w-[1000px] rounded-full opacity-60"
        style={{
          x, y, translateX: '-50%', translateY: '-50%', filter: 'blur(40px)',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--theme-accent) 32%, transparent) 0%, ' +
            'color-mix(in srgb, var(--theme-accent) 10%, transparent) 40%, transparent 70%)',
        }}
      />
    </div>
  );
}
```
   Render it in `HomeDashboard` in place of `<BuilderBg/>` (same z-[1] slot; content already at z-10).
   This component is reused by **HV-4** for the Version page (drop the per-page ray there too).
   Optional: also port the faint static corner glow / `edge-glow` inset for extra depth (low priority).

---

## Fix 2 — Remove the top navigation bar (navigation is inline)

**Current:** `src/pages/RootLayout.tsx` renders `<nav className="app-nav">` with DCX Manager / Version /
Builder links on every non-builder route (L8–L14). PO: all navigation is inline now (brand/user blocks +
version cards → version room → launch builder), so the bar is redundant.

**Do:** delete the `<nav>` block so `RootLayout` is just:
```tsx
export function RootLayout() {
  const location = useLocation();
  const isBuilder = location.pathname.startsWith('/builder');
  return (
    <main className={`app-shell ${isBuilder ? 'h-screen overflow-hidden flex flex-col' : ''}`}>
      <Outlet />
    </main>
  );
}
```
Drop the now-unused `Link` import (keep `useLocation`). Confirm there is no remaining link that *only*
existed in the nav (Builder is reachable via the Version room's launch panel; Version via Home cards). The
`.app-nav` CSS class can stay (harmless) or be removed in a brand cleanup.

---

## Fix 3 — Move the hero title + subtitle above the search; compact header

**Current:** `HomeHeroBar` packs `[brand | divider | title/subtitle]` on the left and `[Add | user]` on
the right of a full-width header band (`HomeDashboard` L80–83). PO wants the **title/subtitle above the
search**, with a more compact top.

**Do (match v0.1.4 `pages/home/Hero.tsx` placement):**
- Slim the top band to **brand block (left) + user block (right)** only (smaller `py`). This is the
  thin identity strip.
- Move the **hero** — big title + subtitle + the **Add Version** button — into the **left column, directly
  above `HomeSearchFilters`** (i.e., into the left zone at `HomeDashboard` L88, before the search wrapper).
- Hero styling per v0.1.4: `text-4xl/5xl font-black tracking-tightest leading-none`, accent first word,
  subtitle `text-sm font-medium` muted, Add button as the branded CTA beside the title.
- **Title text:** the PO's reference screenshot shows **"DCX Manager"** (accent "DCX") + subtitle
  *"Create and manage detailed communication experiences. Structure campaigns across phases, actions, and
  messages."* Current code says "Campaign Hub" / "Manage your DCX versions and campaigns" — restore the
  v0.1.4 hero copy unless the PO prefers the new wording.
- Net effect: header row shrinks; the left column reads hero → search → saved views → list (v0.1.4 order).

---

## Fix 4 — Workspace Analytics: compact + glass + hierarchy; drop the explainer note (+ logs parity)

**Current:** `HomeAnalyticsPanel` renders **three equal** `text-5xl` stat cards (Active/Total DCXs, Total
Versions) — no hierarchy — plus a verbose paragraph: *"Active = DCXs with at least one version not yet
Approved or Superseded. Live Supabase analytics coming in a future sprint."* (L52–56).

**Do (match v0.1.4 `pages/home/StatsOverview.tsx` — the PO's reference screenshot):**
- **Remove the explanatory paragraph note** entirely.
- **Establish hierarchy:** ONE primary hero stat + a small live indicator, then a thin dashed divider,
  then a **2-column row** of two smaller secondary stats:
  - Primary: **Active DCXs** as `text-5xl font-black tracking-tighter`, with a compact `STATUS / • LIVE`
    cluster beside it (`w-1 h-1 rounded-full bg-[var(--theme-accent)] animate-pulse` + `text-[8px]
    tracking-[0.15em] uppercase`), and an `Active Campaigns`/`Active DCXs` micro-label below
    (`text-[9px] tracking-[0.25em] uppercase opacity-40`).
  - Divider: `w-full h-px border-t border-dashed border-[var(--theme-border)]`.
  - Secondary row (`grid grid-cols-2 gap-6`): **Total DCXs** (`text-xl font-black` + accent `↑`) and
    **Total Versions** (`text-xl font-black` + the 3-bar indicator). Labels `text-[10px] tracking-[0.2em]
    uppercase opacity-30`.
- **Glass:** wrap the whole analytics block in a single `glass-panel`/`glass-card` (one framed glass
  surface), not three separate boxed stat cards — the figures sit *inside* the glass with the hierarchy
  above. Keep the DCX-derived metrics (D-2 semantics) — only the **presentation** changes.
- Keep `motion/react` enter animations (primary slides in `x:20`; secondaries fade-up with small delay)
  per v0.1.4 for the polish.

**Activity Log (parity check):** `HomeActivityPanel` is close to v0.1.4 `RecentlyOpened`. Align to the
reference screenshot: header `ACTIVITY LOG (n)`; rows = avatar + event text + **mono timestamp top-right**
+ a small **version badge** (e.g. `V2`) on the right (`font-mono text-[9px] border rounded px-1.5`).
Current rows put the timestamp under the text and have no version chip — nudge toward the v0.1.4 row shape.

---

## Constraints & gates
- Styling/layout only: `git diff` should show classNames / token / CSS / `motion/react` wrappers + the new
  `MouseGlowBackground` component + the `HomeHeroBar`/hero relocation. **No** query/store/router/handler
  changes; metric math in `HomeAnalyticsPanel` unchanged.
- No `src/builder/**` import (the new bg lives in `src/ui`). `BuilderBg` stays builder-only.
- Gates: typecheck · lint · validate:architecture · test · **browser proof at 1440/768/375** (before/after)
  → `output/evidence/HV-3-home/`. Confirm the mouse-glow tracks the cursor and there's no scroll/perf
  regression; confirm no nav bar; confirm hero-above-search and the analytics hierarchy.

## Files to touch
`src/pages/RootLayout.tsx` · `src/pages/home/HomeDashboard.tsx` · `src/pages/home/HomeHeroBar.tsx`
(+ hero relocation) · `src/pages/home/HomeAnalyticsPanel.tsx` · `src/pages/home/HomeActivityPanel.tsx`
(minor) · **new** `src/ui/MouseGlowBackground/MouseGlowBackground.tsx`.
Carry the `MouseGlowBackground` into **HV-4** (Version) instead of `BuilderBg`.
