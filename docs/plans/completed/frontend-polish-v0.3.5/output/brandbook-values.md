---
source: brandbook.pdf
extracted-by: codex
date: 2026-06-28
method: pypdf text extraction + Poppler page render check
pages-reviewed: 9-14, 17-21, 31, 35-39
status: extracted
---

# Brandbook Values Extract

This file resolves the FP-R1 D-08 extraction blocker. The PDF is not fully image-only in this
environment: `pypdf` extracts text from the brandbook, and Poppler renders the relevant pages.

Rendered evidence:

- `output/evidence/brandbook-colors-page-11.png`
- `output/evidence/brandbook-colors-page-12.png`
- `output/evidence/brandbook-colors-page-13.png`
- `output/evidence/brandbook-colors-page-14.png`

## Primary Colors

| Name | RGB | CMYK | HEX | Brandbook note |
|---|---|---|---|---|
| Blue | R:117 G:226 B:255 | C:50 M:0 Y:5 K:0 | `#75E2FF` | Light blue is used to evoke tranquility, freshness, and belonging. |
| Black | R:0 G:0 B:0 | C:20 M:20 Y:20 K:100 | `#000000` | Used to symbolize authority, power, professionalism, and trustworthiness. |
| Grey | R:227 G:228 B:229 | C:0 M:0 Y:0 K:10 | `#E3E4E5` | Primary neutral. |
| White | R:255 G:255 B:255 | C:0 M:0 Y:0 K:0 | `#FFFFFF` | Brandbook says use as-is and never create varying shades or tints. For web UI, this conflicts with the project rule against pure white tokens; use the Brand/UI interpretation contract to adapt it to near-white UI tokens. |

## Distribution Guidance

The color pages describe different distribution mixes for brand attributes:

| Brand attribute | Extracted distribution text | Implementation note |
|---|---|---|
| Built for People | 80% / 15% shown on page 12 near the primary color list | Use as static-brand guidance, not an app UI ratio. |
| Trustworthy | 90% / 5% shown on page 13 near the primary color list | Use as static-brand guidance, not an app UI ratio. |

The extraction order on pages 12-13 does not unambiguously map each percentage to a named color.
Do not convert these percentages into implementation rules without visual or PO confirmation.

## Secondary Colors

Brandbook says secondary colors are for rare usage in limited applications, such as graphs and
limited coloring. Use them on white or grey backgrounds only.

| Name | RGB | CMYK | HEX |
|---|---|---|---|
| Mellow Yellow | R:255 G:223 B:160 | C:0 M:12 Y:42 K:0 | `#FFDFA0` |
| Mellow Yellow shade | R:235 G:205 B:147 | C:7 M:18 Y:47 K:0 | `#EBCD93` |
| Mellow Yellow tint | R:255 G:247 B:230 | C:0 M:2 Y:9 K:0 | `#FFF7E6` |
| Vivid Tangerine | R:255 G:160 B:137 | C:0 M:46 Y:41 K:0 | `#FFA089` |
| Vivid Tangerine shade | R:235 G:147 B:126 | C:4 M:51 Y:46 K:0 | `#EB937E` |
| Vivid Tangerine tint | R:255 G:224 B:217 | C:0 M:14 Y:10 K:0 | `#FFE0D9` |
| Magic Mint | R:208 G:239 B:218 | C:18 M:0 Y:18 K:0 | `#D0EFDA` |
| Magic Mint shade | R:193 G:222 B:202 | C:24 M:2 Y:24 K:0 | `#C1DECA` |
| Magic Mint tint | R:240 G:248 B:241 | C:5 M:0 Y:5 K:0 | `#F0F8F1` |
| Blue Purple | R:173 G:177 B:232 | C:31 M:27 Y:0 K:0 | `#ADB1E8` |
| Blue Purple shade | R:151 G:155 B:205 | C:41 M:36 Y:0 K:0 | `#979BCD` |
| Blue Purple tint | R:235 G:236 B:250 | C:6 M:5 Y:0 K:0 | `#EBECFA` |

## Typography

| Family | Evidence | Implementation note |
|---|---|---|
| Gilroy | Page 17: "GILROY TYPEFACE FAMILY" | Primary Latin/UI brand family. Keep as the main app UI font unless a later PO decision says otherwise. |
| 29LT Zarid Slab | Page 19: "29LTZARID SLAB TYPEFACE FAMILY" with Arabic glyph text | Present as a brand typography family, likely for Arabic/display contexts. Do not add it to the app font stack unless the PO confirms app usage and font licensing/source files. |

## Layout Typography Sizes

The layout examples include static/social/email design sizes:

| Context | Size / weight |
|---|---|
| Horizontal email | 35 pt Bold main title, 15 pt Medium subtitle, 12 pt Bold website |
| Semi-square / square email | 35 pt Bold main title, 15 pt Medium subtitle, 12 pt Bold website |
| Square article post | 13 pt Semi Bold post type, 17 pt Medium subtitle, 47 pt Bold main title |
| Square webinar post | 23 pt Bold post type |

These are static-media sizes, not direct app UI type tokens. Use them as hierarchy evidence only.

## Motion

Page 21 describes animation as "Sleek & Smooth" and asks to apply the rolling ments outro in major
communications, with reference: `https://vimeo.com/910078366?share=copy`.

For web UI implementation, keep this as tone guidance only. It does not override reduced-motion
requirements or existing builder interaction rules.

## Iconography / Dynamic Dot

The brandbook includes:

- icons section starting on page 15,
- middle dot usage for words ending in "ment" on page 18,
- dynamic dot guidance on page 27.

These are brand/static identity elements. They should not automatically create new builder UI
controls or decorative app backgrounds.

## Spacing, Radius, And Grid

No reusable app-scale spacing tokens, border-radius values, or web layout grid values were found in
the extracted text. The layout system pages are static-format examples. Treat spacing and radius as
brand influence only unless the PO supplies a more explicit design-token source.

## Impact On FP-R1

Claude's FP-R1 output should be revised as follows:

- D-08 should no longer say the PDF is unreadable or image-only.
- `BLOCKED ↓` color rows can now be filled from this file.
- The project rule against pure black/pure white still stands for app UI tokens, even though the
  static brandbook contains `#000000` and `#FFFFFF`.
- `29LT Zarid Slab` should stay a PO/app-usage decision, not an automatic app font change.
