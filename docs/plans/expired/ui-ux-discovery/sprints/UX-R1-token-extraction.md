---
sprint: UX-R1
plan: ui-ux-discovery
title: Token Extraction
status: not-started
parallel-with: UX-R2
output: docs/plans/drafted/ui-ux-discovery/output/UX-R1-token-inventory.md
assigned-to: Claude or Codex (terminal required — runs grep and ts-morph scripts)
---

# UX-R1 — Token Extraction

## Intent

Grep every TSX, TS, and CSS file in `src/` to extract every unique design value in actual use. Compare against `src/brand/tokens.ts`. Produce an inventory that tells P1 exactly what to tokenise.

**This sprint produces data, not code. No file in `src/` is changed.**

---

## Extraction Tasks

### Task 1 — Colour values

Run:
```bash
# Hex colours in TSX/TS/CSS
grep -roh '#[0-9a-fA-F]\{3,8\}' src/ --include="*.tsx" --include="*.ts" --include="*.css" | sort | uniq -c | sort -rn > /tmp/colors-hex.txt

# rgba() in TSX/TS/CSS
grep -roh 'rgba([^)]\+)' src/ --include="*.tsx" --include="*.ts" --include="*.css" | sort | uniq -c | sort -rn > /tmp/colors-rgba.txt

# rgb() calls
grep -roh 'rgb([^)]\+)' src/ --include="*.tsx" --include="*.ts" --include="*.css" | sort | uniq -c | sort -rn > /tmp/colors-rgb.txt
```

For each unique value: record count, and sample the file + line where it appears.

Separate into:
- Values that already have a name in `tokens.ts` (map them)
- Values that do NOT appear in `tokens.ts` (these need new tokens)
- Values that appear in `tokens.ts` but are duplicated in JSX anyway (these show where CSS vars are not being used)

---

### Task 2 — Font size values

Run:
```bash
# Tailwind arbitrary font sizes
grep -roh 'text-\[0\.[0-9.]\+rem\]' src/ --include="*.tsx" | sort | uniq -c | sort -rn

# Inline style font sizes
grep -roh 'fontSize:[[:space:]]*'"'"'[0-9.rem]\+'"'"'' src/ --include="*.tsx" | sort | uniq -c | sort -rn

# CSS font-size rules in index.css
grep -oh 'font-size:[[:space:]]*[0-9.]\+rem' src/brand/index.css | sort | uniq -c | sort -rn
```

For each unique font-size value: count usage, check if it has a name in `typographyTokens` (from the existing `tokens.ts` — note: typography tokens do not yet exist, this confirms they are needed).

Map each value to a proposed token name using the scale: `2xs(0.65) xs(0.72) sm(0.78) base(0.85) md(0.9) lg(1.0) xl(1.1) 2xl(1.4)`. Note any values that fall outside this scale.

---

### Task 3 — Spacing values (gaps, padding, margins)

Run:
```bash
# Tailwind arbitrary spacing
grep -roh 'gap-\[0\.[0-9.]\+rem\]\|p-\[0\.[0-9.]\+rem\]\|px-\[0\.[0-9.]\+rem\]\|py-\[0\.[0-9.]\+rem\]\|pt-\[0\.[0-9.]\+rem\]\|pb-\[0\.[0-9.]\+rem\]\|pl-\[0\.[0-9.]\+rem\]\|pr-\[0\.[0-9.]\+rem\]\|m-\[0\.[0-9.]\+rem\]\|mx-\[0\.[0-9.]\+rem\]\|my-\[0\.[0-9.]\+rem\]\|mt-\[0\.[0-9.]\+rem\]\|mb-\[0\.[0-9.]\+rem\]' src/ --include="*.tsx" | sort | uniq -c | sort -rn

# CSS padding/gap/margin in index.css
grep -oh 'padding:[[:space:]]*[0-9. rem]\+\|gap:[[:space:]]*[0-9.]\+rem\|margin:[[:space:]]*[0-9. rem]\+' src/brand/index.css | sort | uniq -c | sort -rn
```

Group by value. Identify which spacing values appear 5+ times (candidates for named tokens) vs appear once (likely one-off).

---

### Task 4 — Border radius values

Run:
```bash
grep -roh 'rounded-\[[^\]]\+\]\|rounded-[a-z0-9]\+' src/ --include="*.tsx" | sort | uniq -c | sort -rn
grep -oh 'border-radius:[[:space:]]*[0-9.a-zrem]\+' src/brand/index.css | sort | uniq -c | sort -rn
```

Map each to the existing `radiusTokens` names: `pill, island, card, panel, chip, sm`. Note any values not covered by existing tokens.

---

### Task 5 — Shadow values

Run:
```bash
grep -roh 'shadow-\[[^\]]\+\]' src/ --include="*.tsx" | sort | uniq -c | sort -rn
grep -oh 'box-shadow:[^;]\+' src/brand/index.css | sort | uniq -c | sort -rn
```

Map each to `shadowTokens` names: `island, card, overlay, glow`. Note new shadow values not in tokens.

---

### Task 6 — CSS vars currently in use

Run:
```bash
grep -roh 'var(--[^)]\+)' src/ --include="*.tsx" --include="*.ts" --include="*.css" | sort | uniq -c | sort -rn
```

This shows which CSS vars are actually referenced in code vs which are defined in `:root` but never used.

Cross-reference:
- Vars defined in `index.css` `:root` but NOT in this grep result → unused/dead vars
- Vars in this grep result but NOT defined in `index.css` → missing vars (will cause silent failures)

---

## Output Format

`docs/plans/drafted/ui-ux-discovery/output/UX-R1-token-inventory.md`

```markdown
# UX-R1: Token Inventory
Generated: YYYY-MM-DD | Method: grep + manual review

## Colour Values

### In tokens.ts AND in JSX/CSS (correctly tokenised)
| Value | Token name | Usage count |
|---|---|---|
| #75E2FF | colorTokens.accent | 23 |

### In JSX/CSS but NOT in tokens.ts (gaps — need new tokens)
| Value | Usage count | Files | Proposed token name |
|---|---|---|---|
| rgba(248,196,88,0.1) | 8 | StatusBadge, index.css | color.status.incomplete.bg |

### In tokens.ts but still hard-coded in JSX/CSS (not using the token)
| Value | Token that exists | Usage count of raw value | Action |
|---|---|---|---|
| rgba(117,226,255,0.15) | colorTokens.dark.selectedGlow | 6 | Replace with CSS var |

## Font Size Values
| Value | Usage count | Proposed token | In typographyTokens? |
|---|---|---|---|
| 0.85rem | 34 | text-base | No (token doesn't exist yet) |

## Spacing Values (appearing 5+ times)
| Value | Usage count | Proposed token |
|---|---|---|
| 0.75rem | 18 | space-3 |

## Border Radius Values
| Value | Usage count | Existing token | Gap? |
|---|---|---|---|
| 2.2rem | 12 | radiusTokens.card | No gap |

## Shadow Values
| Value | Usage count | Existing token | Gap? |
|---|---|---|---|

## CSS Vars: Defined but Never Used (dead vars to remove)
| Var | Defined in | Used? |
|---|---|---|

## CSS Vars: Used but Not Defined (bugs)
| Var | Used in | Defined? |
|---|---|---|

## Summary
- Total unique colour values in codebase: N
- Colour values not in tokens.ts: N
- Font sizes not in any token: N
- Spacing values with 5+ uses not in any token: N
- Dead CSS vars: N
- Broken CSS vars (used, not defined): N
```

---

## Acceptance Criteria

- [ ] All 6 extraction tasks ran and produced data
- [ ] Output file exists at `output/UX-R1-token-inventory.md`
- [ ] Every colour value in the codebase is listed — not sampled
- [ ] Font size values are mapped to proposed token names
- [ ] CSS var audit (defined-but-unused, used-but-undefined) is complete
- [ ] No source file changed
- [ ] Session log written and references output file
