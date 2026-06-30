## FP-R1 — Brandbook Screenshot Package for impeccable

**Agent:** opencode (browser/playwright executor)
**Date:** 2026-06-28
**Status:** Completed

**Intent:** Fulfill the follow-up request in Codex task 06-FP-R1-pdf-help — render a full brandbook screenshot package so Claude's `impeccable` skill can extract color relationships, layout rhythm, typography personality, motion tone, and dynamic-dot usage.

### Tool used

- `PyMuPDF` (pymupdf 1.26.5) via Python 3.9 — renders PDF pages to PNG at 2x zoom
- `Pillow` 11.3.0 — assembled the contact sheet

No MCP or browser was needed because the brandbook.pdf is a local file with no viewer dependency. PyMuPDF renders directly from the PDF stream.

### Files created

All in `docs/plans/active/frontend-polish-v0.3.5/output/evidence/brandbook-impeccable/`:

| File | Page | Topic | Source |
|------|------|-------|--------|
| `brandbook-colors-page-11.png` | 11 | Color palette | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-colors-page-12.png` | 12 | Color palette cont. | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-colors-page-13.png` | 13 | Color palette cont. | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-colors-page-14.png` | 14 | Color usage | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-typography-page-17.png` | 17 | Typography | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-typography-page-18.png` | 18 | Typography cont. | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-typography-page-19.png` | 19 | Typography cont. | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-motion-page-21.png` | 21 | Motion guidelines | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-patterns-page-24.png` | 24 | Patterns | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-dynamic-dot-page-27.png` | 27 | Dynamic dot | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-layout-page-31.png` | 31 | Layout examples | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-layout-page-35.png` | 35 | Layout examples | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-layout-page-37.png` | 37 | Layout examples | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-layout-page-39.png` | 39 | Layout examples | brandbook.pdf (PyMuPDF @2x) |
| `brandbook-contact-sheet.png` | all | Thumbnail grid contact sheet | Pillow composite (1624×3490px) |

All full-page PNGs are 2398×1341px at 2x zoom.

### Purpose

These are visual reference evidence only — not implementation artifacts. Claude can load them alongside `impeccable` to extract:
- Color relationships and hierarchy
- Layout rhythm and composition patterns
- Typography personality and pairings
- Motion tone and timing cues
- Dynamic-dot usage patterns
- What should/should-not transfer into web UI tokens
