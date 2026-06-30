# P1 — Token System Output
Date: 2026-06-27 | Agent: Codex

Status: Completed with documented debt.

## Session Environment

build-current-state.sh:
```text
repository_version: v0.3.4
package_version: 0.2.0
metadata_version: v0.3.3
active_plans: []
mcp_operational: [eslint]
mcp_awaiting: [storybook, shadcn, semgrep, sonarqube]
code_index_stale: true
documentation_contradictions: docs/VERSION.md=v0.3.4 vs metadata.json=v0.3.3
```

verify-tooling-state.sh:
```text
typecheck: available
lint: available
test: available
build: available
validate:architecture: available
test:e2e: available but no e2e tests found
verify:frontend: available
generate-code-index: available
inspect-react: available
verify.sh: pass
dependency_cruiser: available
semgrep_cli: not_installed
playwright_test: available
storybook: installed
code_index: stale
MCP active: eslint
MCP awaiting: storybook, shadcn, semgrep, sonarqube
```

Note: the plan was moved from `docs/plans/drafted/folder-structure-v2` to `docs/plans/active/folder-structure-v2` after the final READY audit, so the active-plan list above reflects the pre-move session-start snapshot.

## Typography Utilities Registered

Added these `@theme` font-size utilities in `src/brand/index.css`:
- `--font-size-dcx-4xs`
- `--font-size-dcx-3xs`
- `--font-size-dcx-3xs-plus`
- `--font-size-dcx-2xs`
- `--font-size-dcx-2xs-plus`
- `--font-size-dcx-xs`
- `--font-size-dcx-xs-plus`
- `--font-size-dcx-sm`
- `--font-size-dcx-md`
- `--font-size-dcx-md-plus`
- `--font-size-dcx-base`

## Surface Tokens Added

Added CSS variables and `@theme` color utilities for:
- `--theme-surface-void` / `--color-dcx-surface-void`
- `--theme-surface-deep-alt` / `--color-dcx-surface-deep-alt`
- `--theme-surface-dark` / `--color-dcx-surface-dark`
- `--theme-error-deep-bg` / `--color-dcx-error-deep-bg`
- `--theme-accent-variant` / `--color-dcx-accent-variant`
- `--theme-accent-deep` / `--color-dcx-accent-deep`

Also exposed the new names in `src/brand/tokens.ts`.

## Phantom Categories Confirmed 0

```text
font-[var(--font-*)]: 0
shadow-[var(--shadow-*)]: 0
rounded-[var(--radius-*)]: 0
```

No font-weight, shadow, or radius `dcx-*` utility migration was performed because those categories had no source occurrences.

## Migration Counts

| Pattern | Before | After |
|---------|--------|-------|
| `text-[var(--text-xs)]` | 94 | 0 |
| `text-[var(--text-2xs)]` | 63 | 0 |
| `text-[var(--text-sm)]` | 37 | 0 |
| `text-[var(--text-3xs)]` | 27 | 0 |
| `text-[var(--text-3xs-plus)]` | 13 | 0 |
| `text-[var(--text-md-plus)]` | 9 | 0 |
| `text-[var(--text-xs-plus)]` | 7 | 0 |
| `text-[var(--text-md)]` | 7 | 0 |
| `text-[var(--text-2xs-plus)]` | 7 | 0 |
| `text-[var(--text-base)]` | 6 | 0 |
| `text-[var(--text-4xs)]` | 5 | 0 |

Totals:
- `text-[var(--text-*)]` patterns replaced: 272 live source replacements; target source grep is now 0.
- `text-dcx-*` usages after migration: 272.
- Raw app-side hex colors outside allowed token files: 0.
- Dead CSS classes removed: 3 (`.readiness-badge`, `.editor-toggle-btn`, `.editor-toggle-btn-active`).
- Dead token exports removed: 3 (`typographyTokens`, `radiusTokens`, `shadowTokens`).
- New surface/accent/error tokens added: 6.
- Theme color/border/ring arbitrary syntax intentionally retained: 311 live usages after raw-hex replacement (`text` 129 / `bg` 93 / `border` 79 / `ring` 10).

## Remaining Pattern Greps

```text
rg -n "text-\[var\(--text-" src --glob '*.{ts,tsx}'
No results.

rg -n "#[0-9A-Fa-f]{3,8}" src --glob '*.{ts,tsx}' | rg -v "tokens.ts|index.css|\.test\.|//.*#"
No results.

rg -n "font-\[var\(--font-|shadow-\[var\(--shadow-|rounded-\[var\(--radius-" src --glob '*.{ts,tsx}'
No results.

rg -n "\.(readiness-badge|editor-toggle-btn|editor-toggle-btn-active)|typographyTokens|radiusTokens|shadowTokens|brandTokens\.(typography|radius|shadow)" src
No results.
```

## Gate Results

- `npm run typecheck`: PASS.
- `npm run validate:architecture`: PASS — no dependency violations found across 276 modules / 559 dependencies.
- `npm run test`: PASS — 6 files, 27 tests.
- `npm run build`: PASS. Initial build exposed Tailwind scanning stale docs/code-index examples; fixed by excluding `../../docs` and `../../code-index` with `@source not`, then rebuild passed without CSS optimizer warnings.
- Browser/dev smoke: PASS — Vite served on `http://localhost:3002/` because ports 3000 and 3001 were occupied; `curl -I` returned `HTTP/1.1 200 OK`.
- `npm run lint`: PASS WITH DOCUMENTED DEBT — repo-wide existing lint debt remains at 157 problems (150 errors, 7 warnings). The P1 review explicitly accepts this as pre-existing and unrelated to the sprint; representative failures remain unused vars, `no-explicit-any`, `react-hooks/set-state-in-effect`, and `react-hooks/static-components`.
- `npx playwright screenshot`: BLOCKED — Playwright is installed, but the Chromium binary is missing from the local cache and network is restricted, so screenshot capture could not run. Dev smoke still passed via Vite + HTTP 200.

## Remaining Work Before P1 Sign-Off

P1 is closed as completed with documented debt. Remaining debt is outside P1:
- Repo-wide lint cleanup remains tracked separately from this token/CSS sprint.
- Playwright browser binary setup is needed before future screenshot gates can be satisfied in this environment.

---

## Reviewer feedback — see the review folder

Detailed Claude review of this P1 output (verdict, confirmed gate status, and the index.css plan-gap
analysis) lives in **`output-review/P1-token-system-review.md`**. P1 has been **re-opened** with two
new steps (8 — tokenize in-rule literals; 9 — decompose `index.css`) added to
`sprints/P1-token-system.md` to close the gap.

## Review Completion — CSS Tokenization And Split

Completed the two re-opened P1 tasks:
- Tokenized in-rule color literals inside the global component CSS rules.
- Split `src/brand/index.css` into three partials while preserving it as the brand CSS entrypoint.

CSS file structure after split:
```text
src/brand/index.css                         10 lines
src/brand/styles/theme.css                  65 lines
src/brand/styles/tokens.css                386 lines
src/brand/styles/components.css            434 lines
```

Component-rule literal color count:
```text
Before review completion: 51 raw hex/rgb/rgba literals in the component-rule region.
After review completion: 0 raw hex/rgb/rgba literals in src/brand/styles/components.css.
```

New partial responsibilities:
- `theme.css`: `@custom-variant`, `@theme`, and `@theme inline`.
- `tokens.css`: local Gilroy font faces, `:root`, DCX theme vars, shadcn vars, and `.dark` token overrides.
- `components.css`: global component/layout classes.

Implementation note: moving `@font-face` rules into `styles/tokens.css` required changing font URLs
from `./fonts/...` to `../fonts/...`; the final build confirms the fonts are bundled again.

## Browser Evidence — P1+P2 Debt Close (2026-06-27)

> ⚠️ **Provenance note (added by Claude P3 audit, 2026-06-28).** Captured in an **unlogged session** —
> no session-log entry / `index.csv` row, and no agent named (presumed opencode via Playwright MCP,
> **unverified**). Screenshots relocated from repo root → `output/evidence/`. Accepted because the
> artifacts exist and gates re-verify, but the audit trail was broken — see core.md §29a.

This section closes the browser-evidence debt originally left as `BLOCKED — Playwright unavailable` in the P1 gate results. The Playwright Chromium binary is now available in this session (Playwright MCP operational). All evidence was captured on `http://localhost:3002/` (port 3002 used because 3000/3001 occupied).

### Console Error Count

```text
Viewport 1440px: 0 app errors (1 favicon.ico 404 only — standard, non-functional)
Viewport 1920px: 0 app errors
Total console errors across both sessions: 0
Gate: PASS
```

### Consolidated Surfaces Screenshots

All screenshots saved to `evidence/`:

| Surface | Screenshot | What it shows |
|---|---|---|
| Badge (MetadataIsland) | `evidence/metadata-island-badges.png` | Status badge "In Progress" with status icon; phase readiness badges ("Phase or day is incomplete", "Phase or day is blocked") |
| Input (TaskEditor) | `evidence/task-editor-input.png` | `Input` atom as textarea (via `as="textarea"`), draft message text entry, date select, routing directory |
| Select (task creation) | `evidence/task-create-select.png` | Channel selection buttons (Email, Intranet, Meeting, SMS, Social Media, Feedback Form) using `Select` component |
| Select (Creator Palette) | `evidence/creator-palette-select.png` | Creator Palette with Phase/Action/Task creation selectors |
| GlassSurface (stage cards) | `evidence/glass-surface-stage.png` | Phase cards with GlassSurface: `radius` and `intensity` props applied |
| Task details popup (GlassSurface) | `evidence/task-details-popup.png` | `TaskReadOnlyPopup` using GlassSurface with task details |
| Full page at 1440px | `evidence/browser-1440-full.png` | Complete builder layout at 1440×900 viewport |
| Full page at 1920px | `evidence/browser-1920-full.png` | Complete builder layout at 1920×1080 viewport |

### Gate Update

```text
Previous P1 gate: npx playwright screenshot: BLOCKED — Chromium binary missing
Updated gate:     PASS — Playwright MCP operational; 0 console errors; 8 screenshots captured
```
