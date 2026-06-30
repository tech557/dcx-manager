# UX-R1: Token Inventory

Generated: 2026-06-25 | Method: grep + manual review

---

## Colour Values

### In tokens.ts AND in JSX/CSS (correctly tokenised)

| Value | Token name | Usage count |
|---|---|---|
| #75E2FF | colorTokens.accent | 269 |
| #0D0D0E | colorTokens.dark.base | 3 |
| #151516 | colorTokens.dark.raised | 3 |
| #F7F7F8 | colorTokens.dark.text / light.raised | 4 |
| #FFFFFF | colorTokens.light.base | 2 |
| #0D0D0E → #0d0d0e | colorTokens.dark.base (case mismatch) | 6 |
| #151516 → #151516 | colorTokens.dark.raised | 3 |
| #050506 | — not in tokens | 3 |
| #161617 | — not in tokens | 2 |
| #121212 | — not in tokens | 2 |
| #0c0d0f | — not in tokens | 2 |
| #FF7575 | — not in tokens | 2 |
| #FF6464 | — not in tokens | 2 |
| #F8C458 | — not in tokens | 2 |
| #006080 | — not in tokens | 1 |
| #0e0f12 | — not in tokens | 1 |
| #0a0a0d | — not in tokens | 1 |
| #241113 | — not in tokens | 1 |
| #55c2df | — not in tokens | 1 |
| #F4C975 | — not in tokens | 1 |

### In JSX/CSS but NOT in tokens.ts (gaps — need new tokens)

| Value | Usage count | Files (sample) | Proposed token name |
|---|---|---|---|
| #050506 | 3 | PopoverShell, StickyPopupShell | color.dark.deepBg |
| #161617 | 2 | — | color.dark.surface |
| #121212 | 2 | SearchableSelect, SearchableSelectIcons | color.dark.dropdownBg |
| #0c0d0f | 2 | — | color.dark.alternateBg |
| #FF7575 | 2 | — | color.status.error |
| #FF6464 | 2 | — | color.status.errorAlt |
| #F8C458 | 2 | — | color.status.warning |
| #006080 | 1 | — | color.accent.deep |
| #0e0f12 | 1 | — | color.dark.deepest |
| #0a0a0d | 1 | — | color.dark.deepestAlt |
| #241113 | 1 | — | color.status.error.bg |
| #55c2df | 1 | — | color.accent.variant |
| #F4C975 | 1 | — | color.status.warning.light |
| rgba(248,196,88,0.2) | 1 | — | color.status.warning.bg |
| rgba(248, 196, 88, 0.1) | 1 | — | color.status.warning.bgSubtle |
| rgba(245,158,11,0.35) | 1 | — | color.status.warning.glow |
| rgba(255,117,117,0.12) | 1 | — | color.status.error.bg |
| rgba(255,100,100,0.2) | 1 | — | color.status.error.bgAlt |
| rgba(255, 100, 100, 0.1) | 1 | — | color.status.error.bgSubtle |
| rgba(16,185,129,0.2) | 2 | — | color.status.success.bg |
| rgba(16,185,129,0.35) | 1 | — | color.status.success.glow |
| rgba(16,185,129,0.05) | 1 | — | color.status.success.bgSubtle |
| rgba(52,211,153,1) | 1 | — | color.status.success |
| rgba(52,211,153,0.35) | 1 | — | color.status.success.glow |
| rgba(56,189,248,0.1) | 4 | — | color.info.bg |
| rgba(56,189,248,0.7) | 1 | — | color.info |
| rgba(59,130,246,0.03) | 1 | — | color.info.bgSubtle |
| rgba(99,102,241,0.2) | 1 | — | color.indigo.bg |
| rgba(82,82,82,0.5) | 1 | — | color.neutral.muted |
| rgba(163,163,163,0.5) | 1 | — | color.neutral.mutedAlt |
| rgba(21, 21, 22, 0.4) | 1 | — | color.light.muted (matches --theme-muted light) |
| rgba(21, 21, 22, 0.68) | 1 | — | color.light.textMuted (in tokens as mutedText) |
| rgba(13, 13, 14, 0.72) | 1 | — | color.dark.glassStrong |
| rgba(13, 13, 14, 0.88) | 1 | — | color.dark.glassBg (matches --theme-glass-bg dark) |
| rgba(13, 13, 14, 0.86) | 1 | — | color.dark.glass |
| rgba(13, 13, 14, 0.84) | 1 | — | color.dark.glassAlt |
| rgba(13, 13, 14, 0.45) | 1 | — | color.dark.mutedAlt |
| rgba(13, 13, 14, 0.92) | 1 | — | color.dark.glassStronger |

### In tokens.ts but still hard-coded in JSX/CSS (not using the token)

| Value | Token that exists | Usage count of raw value | Action |
|---|---|---|---|
| rgba(117,226,255,0.15) | colorTokens.dark.selectedGlow | 12 | Replace with --theme-selected-glow or similar CSS var |
| rgba(117,226,255,0.3) | — (no token) | 5 | Create token (accent glow medium) |
| rgba(117,226,255,0.25) | — (no token) | 4 | Create token (accent glow soft) |
| rgba(117,226,255,0.2) | — (no token) | 4 | Create token (accent bg) |
| rgba(117, 226, 255, 0.5) | — (no token) | 3 | Create token (accent glow strong) |
| rgba(117,226,255,0.28) | — (no token) | 2 | Create token (accent glow medium 28%) |
| rgba(117,226,255,0.08) | — (no token) | 2 | Create token (accent border) |
| rgba(117,226,255,1) | — (no token) | 1 | — (is accent + full opacity) |
| rgba(117,226,255,0.45) | — (no token) | 1 | — |
| rgba(117,226,255,0.4) | — (no token) | 1 | — |
| rgba(117,226,255,0.20) | — (no token) | 1 | — |
| rgba(117,226,255,0.12) | — (no token) | 1 | — |
| rgba(117,226,255,0.1) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.34) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.3) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.25) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.12) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.1) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.08) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.07) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.06) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.04) | — (no token) | 1 | — |
| rgba(117, 226, 255, 0.03) | — (no token) | 1 | — |

---

## Font Size Values

### Tailwind arbitrary font-size classes (text-[Xpx])

| Value | Usage count | Proposed token |
|---|---|---|
| text-[10px] | 81 | text-xs (or 10px) |
| text-[9px] | 65 | text-2xs |
| text-[11px] | 43 | text-sm |
| text-[8px] | 27 | text-3xs |
| text-[8.5px] | 13 | text-3xs (variant) |
| text-[9.5px] | 7 | text-2xs (variant) |
| text-[10.5px] | 7 | text-xs (variant) |
| text-[7px] | 4 | text-4xs |
| text-[15px] | 3 | text-base |
| text-[13px] | 3 | text-md |
| text-[12px] | 3 | text-sm (variant) |
| text-[7.5px] | 1 | — |
| text-[14px] | 1 | — |
| text-[11.5px] | 1 | — |

### CSS font-size rules in index.css

| Value | Usage count |
|---|---|
| font-size: 0.78rem | 4 |
| font-size: 0.85rem | 3 |
| font-size: 0.7rem | 3 |
| font-size: 0.9rem | 2 |
| font-size: 0.75rem | 2 |
| font-size: 0.72rem | 2 |
| font-size: 1rem | 1 |
| font-size: 1.05rem | 1 |
| font-size: 0.86rem | 1 |
| font-size: 0.82rem | 1 |
| font-size: 0.65rem | 1 |

### Conversion table (px → rem at 16px base)

| px | rem | Usage | Proposed scale name |
|---|----|---|---|
| 7px | 0.4375rem | 4 | text-4xs |
| 7.5px | 0.46875rem | 1 | — (one-off) |
| 8px | 0.5rem | 27 | text-3xs |
| 8.5px | 0.53125rem | 13 | text-3xs+ |
| 9px | 0.5625rem | 65 | text-2xs |
| 9.5px | 0.59375rem | 7 | text-2xs+ |
| 10px | 0.625rem | 81 | text-xs |
| 10.5px | 0.65625rem | 7 | text-xs+ |
| 11px | 0.6875rem | 43 | text-sm |
| 11.5px | 0.71875rem | 1 | — (one-off) |
| 12px | 0.75rem | 3 | text-md |
| 13px | 0.8125rem | 3 | text-md+ |
| 14px | 0.875rem | 1 | — (one-off) |
| 15px | 0.9375rem | 3 | text-base |

Note: No `typographyTokens` exist yet. All font sizes are gaps.

---

## Spacing Values (appearing 3+ times in CSS)

### CSS spacing rules in index.css

| Value | Usage count | Proposed token |
|---|---|---|
| gap: 0.5rem | 9 | space-2 |
| gap: 1rem | 4 | space-4 |
| gap: 1.5rem | 4 | space-6 |
| gap: 0.75rem | 4 | space-3 |
| gap: 0.35rem | 4 | space-1.5 |
| gap: 0.25rem | 3 | space-1 |
| padding: 1rem | 3 | space-4 |
| padding: 0.75rem | 2 | space-3 |
| padding: 0.5rem | 1 | space-2 |
| padding: 1.5rem | 1 | space-6 |
| padding: 1.25rem | 1 | space-5 |
| padding: 2rem | 1 | space-8 |
| margin: 0 | 6 | — (zero) |
| gap: 0.6rem | 1 | — (one-off) |
| gap: 0.65rem | 1 | — (one-off) |
| gap: 0.625rem | 1 | — (one-off) |
| gap: 0.4rem | 1 | — (one-off) |
| gap: 0.45rem | 1 | — (one-off) |
| gap: 0.3rem | 1 | — (one-off) |

### Tailwind arbitrary spacing in TSX

| Value | Usage count |
|---|---|
| p-[1.5px] | 1 |

---

## Border Radius Values

### Tailwind rounded classes in TSX

| Class | Usage count | Existing token | Gap? |
|---|---|---|---|
| rounded-full | 88 | radiusTokens.pill | No gap |
| rounded-lg | 80 | radiusTokens.sm | No gap |
| rounded-xl | 33 | radiusTokens.chip | No gap |
| rounded-md | 22 | — (no token) | Gap |
| rounded-2xl | 17 | — (no token) | Gap |
| rounded-r | 4 | — (direction) | — |
| rounded-l | 3 | — (direction) | — |
| rounded-tr | 2 | — (direction) | — |
| rounded-tl | 2 | — (direction) | — |
| rounded-t | 2 | — (direction) | — |
| rounded-br | 2 | — (direction) | — |
| rounded-bl | 2 | — (direction) | — |

### CSS border-radius rules in index.css

| Value | Usage count | Existing token | Gap? |
|---|---|---|---|
| border-radius: 999px | 15 | radiusTokens.pill | No gap |
| border-radius: 1rem | 2 | — | Gap (matches rounded-lg?) |
| border-radius: 1.5rem | 2 | — | Gap |
| border-radius: 1.4rem | 1 | — | Gap |
| border-radius: 0.8rem | 1 | — | Gap |
| border-radius: 0.85rem | 1 | — | Gap |
| border-radius: 0.75rem | 1 | — | Gap |
| border-radius: 0.6rem | 1 | — | Gap |
| border-radius: 0.5rem | 1 | — | Gap |

---

## Shadow Values

### Tailwind shadow-* classes in TSX

No `shadow-[...]` arbitrary classes found in TSX files.

### CSS box-shadow rules in index.css

| Value | Usage count | Existing token | Gap? |
|---|---|---|---|
| 0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05) | 1 | shadowTokens.island | Variant (inset added) |
| 0 12px 40px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25) | 1 | — | Gap (light mode island) |
| 0 12px 40px rgba(0, 0, 0, 0.45), 0 0 35px rgba(117, 226, 255, 0.25) | 1 | shadowTokens.island + glow | Combined |
| 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(117, 226, 255, 0.15) | 1 | shadowTokens.island + glow | Combined |
| 0 8px 32px rgba(0, 0, 0, 0.3) | 1 | shadowTokens.card | No gap |
| 0 8px 32px rgba(0, 0, 0, 0.2) | 1 | — | Gap (card variant) |
| 0 0 0 1px rgba(117, 226, 255, 0.15) | 1 | — | Gap (accent border ring) |
| box-shadow: none | 1 | — | No token needed |

---

## CSS Vars: Defined but Never Used (dead vars to remove)

| Var | Defined in | Used? |
|---|---|---|
| — (all vars are used) | — | — |

No dead CSS vars found. All 6 CSS vars (`--theme-muted`, `--theme-divider`, `--theme-glass-bg`, `--theme-text-primary`, `--theme-text-muted`, `--theme-border-subtle`) are referenced in code.

## CSS Vars: Used but Not Defined (bugs)

| Var | Used in | Defined? |
|---|---|---|
| — (all used vars are defined) | — | — |

No undefined CSS var references found. All `var(--...)` references match a definition in `index.css` `:root`.

---

## Summary

- Total unique hex colour values in codebase: 19
- Hex colours NOT in tokens.ts: 13
- Unique rgba values in codebase: ~50 (many unique opacity variants of accent colour #75E2FF)
- Font sizes not in any token: All — no typography token system exists yet
- Font size usage dominated by 3 values: 10px (81), 9px (65), 11px (43)
- Spacing values with 5+ uses: 1 (gap: 0.5rem at 9 uses)
- Dead CSS vars: 0
- Broken CSS vars (used, not defined): 0
- Border radius gap: rounded-md (22 uses) and rounded-2xl (17 uses) have no token
- Shadow values: mostly covered by existing tokens, with inset variants as gaps
