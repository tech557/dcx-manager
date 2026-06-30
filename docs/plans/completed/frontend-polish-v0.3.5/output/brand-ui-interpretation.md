---
authored-by: FP-R1 (Claude claude-sonnet-4-6, 2026-06-28)
authority: This document is the canonical brand-to-UI interpretation contract for frontend-polish-v0.3.5.
  All implementation sprints (change-token, change-component, wire-mockup-data) must read this before
  making any visual decision. It supersedes ad-hoc judgment about brand intent.
---

# Brand / UI Interpretation Contract — DCX Manager v0.3.5

## Rule 1 — Scope cap: brandbook governs tokens only, not the interaction language

The brandbook is the authority on **color values, typography families, spacing rhythm, and radius
values**. It does NOT govern the product's interaction language.

**Specifically: the brandbook may NOT trigger:**
- Changes to the glass island visual pattern (pill header, glass-dark surfaces, blur layers)
- Changes to the hover-light glow effect on islands and cards
- Changes to the builder stage layout (3-row grid, island positions — frozen per core.md §10)
- Changes to any animation curve, spring stiffness, or easing function
- Changes to the density or hierarchy of the card templates

**The brandbook may trigger:**
- Token value corrections (hex/OKLCH color adjustments per reconciliation table)
- Font family additions (e.g., 29LT Zarid Slab for display headings — if PO confirms)
- Spacing scale corrections (if brandbook defines explicit grid that differs from current)
- Radius value corrections

If a brandbook recommendation conflicts with the product's glass/stage visual language, the product
language wins. Flag the conflict to the PO rather than silently resolving it by changing the glass
style.

---

## Rule 2 — Preserved interaction language + allowed glass density variants

The following patterns are **identity-locked** — they define what DCX Manager looks like and must
not be changed without a PO decision:

### Locked patterns

| Pattern | Description |
|---|---|
| Pill islands | Header islands render as `border-radius: 999px` pills that expand to `1.5rem` when open |
| Dark glass surfaces | All islands use `rgba(13,13,14, 0.72–0.92)` backgrounds with `backdrop-filter: blur(18–24px)` |
| Hover-light glow | Islands intensify shadow on hover (no border-color change on hover by default) |
| Accent glow selection | Selected nodes get `box-shadow: 0 0 15px var(--theme-selected-glow)` ring |
| Stage canvas background | Radial gradient from `--theme-accent-subtle` at corners over `--theme-component-surface-deep` |
| Component text base | All island text uses `--theme-component-text-*` (near-white scale) regardless of page theme |

### Allowed glass density variants

Three glass levels are defined and intentional. Implementation sprints must use these — not invent
new opacity levels:

| Variant | CSS class | Opacity | Use for |
|---|---|---|---|
| `glass-dark` | `.glass-dark` | `rgba(13,13,14,0.45)` | Stage-embedded card backgrounds |
| `glass-standard` | `.glass` / `.island-shell` | `rgba(13,13,14,0.72–0.92)` | All floating islands |
| `glass-light` | `.glass-light` | `rgba(255,255,255,0.65)` | Light-theme overlays only (if used) |

**No new glass opacity levels may be introduced.** If a surface needs more or less opacity, use the
nearest existing variant and flag for PO if neither fits.

---

## Rule 3 — No pure black or pure white tokens

All tokens must avoid `#000000` and `#FFFFFF`. These are violations of both PRODUCT.md and
`impeccable` product-register rules.

### Current violations (must be corrected in implementation sprint)

| Token | Theme | Current value | Required correction |
|---|---|---|---|
| `--theme-surface-void` | light | `#FFFFFF` — **pure white** | Replace with `oklch(0.99 0.004 220)` — near-white with minimal cyan tint toward brand accent hue |
| `--theme-dropdown-bg` | light | `#FFFFFF` — **pure white** | Replace with `oklch(0.985 0.004 220)` — slightly more saturated than surface-void for hierarchy |
| `--background` (shadcn) | light | `oklch(1 0 0)` — pure white in OKLCH | Replace with `oklch(0.99 0.004 220)` |

### Replacement rationale

OKLCH `(0.99, 0.004, 220)`:
- Lightness 0.99 = near-white, not pure white
- Chroma 0.004 = barely perceptible tint (not the warm/sand trap)
- Hue 220 = cool-cyan direction, aligned with `--theme-accent: #75E2FF` (which sits at ~hue 195–200 in OKLCH)
- Result: the surface reads as white but carries the product's cool-precise personality

No token may be set to `oklch(1 0 0)` (pure white) or `#FFFFFF` after implementation.

---

## Rule 4 — Dark + light theme token sets and the main-blue-on-light rule

Both themes must be fully specified. The current system has partial light-theme token coverage —
some tokens are defined only for dark and inherited unchanged in light, producing incorrect results.

### Dark theme — source of truth

Dark is the primary design mode (PRODUCT.md: "long sessions, often in low-light environments").
All component tokens (`--theme-component-*`) are dark-first and are intentionally shared between
themes — islands remain dark-glass regardless of page theme.

### Light theme — required corrections

| Token group | Current state | Required state |
|---|---|---|
| Surface tokens | `surface-void` and `dropdown-bg` are pure white | Corrected per Rule 3 |
| Text tokens | `--theme-text-secondary` is empty string | Must be defined: `rgba(21,21,22,0.78)` |
| Component surfaces | Same dark-glass values as dark theme | Keep — islands stay dark-glass in light mode (preserves visual language, reduces context-switch confusion) |
| Glass bg | `rgba(255,255,255,0.85)` | Re-evaluate after surface-void correction; may need opacity reduction |

### Brandbook primary blue: confirmed

`--theme-accent: #75E2FF` is the **exact brandbook primary Blue** (C50 M0 Y5 K0, extracted from
brandbook.pdf by Codex). Identity confirmed — this value must not be changed.

### The main-blue-on-light rule

`--theme-accent: #75E2FF` **must never be used as text color on light backgrounds.**

Contrast: `#75E2FF` on `oklch(0.99 0.004 220)` ≈ 2.6:1 — fails WCAG AA for all text sizes.

**Enforcement:**
- Light theme: accent is allowed as **border color, indicator dot, glow, and background tint only**
- Light theme: for blue-family interactive text/links, use `--theme-accent-deep: #006080` (≈4.7:1 on near-white ✅)
- Dark theme: accent is freely usable as text/icon color (≈9.4:1 on `#0a0a0d` ✅)
- Any component that renders accent-colored text must gate on theme: dark → `--theme-accent`, light → `--theme-accent-deep`

---

## Rule 5 — v0.1.4 reference status

**Status: ABSENT from workspace.**

The plan README carry-forward references a v0.1.4 UI as a prior visual baseline for homepage and
version page. No v0.1.4 assets, screenshots, Figma exports, or design files were found anywhere
in the repository.

**Decision register:** D-07 tracks the PO decision on whether to waive this requirement or supply
the assets.

**Impact on FP-R1:** The absence of v0.1.4 reference does not block FP-R1 (brand audit is against
`src/brand/` tokens, not against a prior UI). It blocks only FP-R4 (finalize-behavior spec for
homepage/version page) and FP-R5 (implementation sprint scoping for those surfaces).

**Default if D-07 unresolved:** proceed without v0.1.4 reference — treat current `src/builder/`
as the live baseline and scope implementation to observed state.

---

## Appendix A — Token correction candidates summary

From `FP-R1-brand-reconciliation.md` §13. Implementation sprint (`change-token` family) must address
these before any other token changes:

### Critical (block light-theme shipping)
1. `--theme-surface-void` light: `#FFFFFF` → `oklch(0.99 0.004 220)`
2. `--theme-dropdown-bg` light: `#FFFFFF` → `oklch(0.985 0.004 220)`
3. `--theme-text-secondary`: `""` → dark: `rgba(247,247,248,0.78)` / light: `rgba(21,21,22,0.78)`

### High (fix before FP-R5)
4. `theme.css` Geist Variable override: remove `--font-sans: 'Geist Variable'` from `@theme inline` block (line 26) — or confirm it is intentional and document why
5. `--theme-info`: solidify opacity (0.7 → 1.0 if used as text; keep 0.7 if indicator-only)
6. `--radius-lg` runtime empty: verify via computed style and hardcode if Tailwind resolution fails

### Blocked on D-08 (brandbook values export)
All BLOCKED ↓ rows in `FP-R1-brand-reconciliation.md` §1–§3. Cannot finalize until PO supplies
color values from brandbook. Place export at `output/brandbook-values.md`.

---

## Appendix C — Brandbook secondary palette scope rule

The brandbook defines 4 secondary color families (12 tokens total: Mellow Yellow, Vivid Tangerine,
Magic Mint, Blue Purple — each with shade and tint). These are:

- **Not present** in `src/brand/` currently
- **Scoped by the brandbook** to: "rare usage in limited applications, such as graphs and limited
  coloring. Use them on white or grey backgrounds only."
- **Not to be used** for primary UI chrome, island surfaces, card headers, or component states

**App usage rule:** Secondary colors are allowed only as `--theme-chart-*` data-viz tokens, added
only when a charting/visualization use case is confirmed. Until that use case exists, do not add
them to `tokens.css`. The current semantic status colors (`--theme-error`, `--theme-warning`,
`--theme-success`) are product-defined and are NOT the same as these brandbook secondary colors
(they happen to share color families but have different values and different purposes).

---

## Appendix B — Impeccable audit judgments applied

These decisions are informed by `impeccable` product-register rules and are binding for this sprint
cycle. They do not require brandbook confirmation.

| Rule | Application |
|---|---|
| No gradient text | Confirmed absent. Do not introduce. |
| No glassmorphism as default | Glass is purposeful here (product identity). Allowed per Rule 2. Do not add new glass surfaces beyond the three defined variants. |
| Body text ≥4.5:1 | `--theme-text-primary` passes in both themes. `--theme-text-muted` marginal in light — use sparingly on tinted surfaces. |
| Reduced motion mandatory | Not auditable without OS setting — assigned to FP-R3 source audit (D-06). |
| 150–250ms transitions | `springTokens.gentle` at 500ms is above range. Acceptable for island expand (a deliberate slow expand); button/hover transitions should stay ≤250ms. |
| No decorative motion | All spring tokens tied to state changes (selection, expansion). Compliant. |
