# CT-1 Output — Brand light/dark token corrections + app-wide typography (L06)

Date: 2026-06-30
Executor: Claude (claude-opus-4-8) — Anthropic
Family: `change-token`
Status: Completed

## G-IMPECCABLE stop-task (first) — mode chosen
Checked the impeccable quarantine state. Contradiction confirmed: root `CLAUDE.md` table still says
`impeccable` is **QUARANTINED — do not invoke yet**, while `docs/agent-skills.md` §impeccable and
`.claude/settings.json` (`skillOverrides.impeccable: "on"`, no PreToolUse `Skill` guard hook) say the
quarantine was **lifted 2026-06-28 by PO (brand-system only)**.

Per CT-1's stop-task and the re-audit's accepted definition of "resolved"
(`audit/2026-06-30-codex-reaudit.md` item 2: *"direct brand-contract route selected and logged"*), I
executed CT-1 via the **direct brand-contract route (no impeccable)**. The active project instruction in
`CLAUDE.md` still forbids invoking the skill, so I did not invoke it. **Follow-up for PO** (flagged, not
actioned): reconcile root `CLAUDE.md` ↔ `agent-skills.md` so the quarantine status is stated once.

## Requirement Trace (actual)
- Requirements touched: `REQ-FP-D08`, `REQ-FP-D01` (linked this sprint); `REQ-FP-D05`, `REQ-UP-009`,
  `REQ-IFX-001`, `REQ-FP-D12` cited by CT-1 (D12 = dimension tokens → deferred to CT-2).
- Manifestations (new MAN nodes, grounded this sprint):
  - `MAN-function-src-brand-styles-tokens` (src/brand/styles/tokens.css)
  - `MAN-function-src-brand-styles-components` (src/brand/styles/components.css)
  - `MAN-react-component-src-ui-shadcn-button` (already-grounded; L06 token swap)
- New confirmed TraceLinks (skill-derived, needs_confirmation:false):
  - `TRC-CT1-REQ-FP-D08-TO-MAN-function-src-brand-styles-tokens`
  - `TRC-CT1-REQ-FP-D01-TO-MAN-function-src-brand-styles-tokens`
  - `TRC-CT1-REQ-FP-D08-TO-MAN-function-src-brand-styles-components`
  - `TRC-CT1-REQ-FP-D01-TO-MAN-function-src-brand-styles-components`
- Ledger: `LDG-2026-06-30-CT-1-brand-token-trace` (trace-confirmed, no product-truth change).

## Scope delivered
### Pure-white / pure-black offenders (no pure white token surface)
In light `:root` (src/brand/styles/tokens.css):
- `--theme-surface-void`: `#FFFFFF` → `#FDFDFB`
- `--theme-dropdown-bg`: `#FFFFFF` → `#FDFDFB`
- shadcn `--background`: `oklch(1 0 0)` → `oklch(0.98 0.004 91)` (≈ brand surface-deep #FAF9F6)
- shadcn `--card`: `oklch(1 0 0)` → `oklch(0.992 0.003 91)`
- shadcn `--popover`: `oklch(1 0 0)` → `oklch(0.992 0.003 91)`
No pure-black offenders existed in light `:root` (text-primary `#151516`, foreground `oklch(0.145…)`).

### --theme-text-secondary set
Added `--theme-text-secondary` in both themes: light `rgba(21,21,22,0.82)`, dark `rgba(247,247,248,0.82)`
(sits between `--theme-text-primary` and `--theme-text-muted`).

### Contrast-safe brand-blue on light (main-blue-on-light)
Brand main blue is `#75E2FF` (illegible as foreground on light). Added theme-aware
`--theme-accent-text` (light `#006080`, dark `#75E2FF`) and pointed the one on-light brand-blue text
offender at it: `.eyebrow` (src/brand/styles/components.css) `var(--theme-accent)` → `var(--theme-accent-text)`.
Also fixed `.placeholder-screen p:last-child` which used the always-light component token
`--theme-component-text-muted` (invisible on a light page) → theme-aware `--theme-text-muted`.
(The 103 other `text-[var(--theme-accent)]` usages are on the builder's always-dark glass surfaces, where
cyan is legible and correct — out of scope, verified dark.)

### L06 — app-wide typography tokens (no arbitrary font sizes outside src/brand)
Scope bounded by the criterion ("no **arbitrary** font sizes") and REQ-FP-D01 ("font-sizes must be
responsive/token-driven … requires design-exploration + PO sign-off before implementation"): a wholesale
migration of the ~90 named Tailwind `text-xs/sm` utilities is **not** in CT-1 (it needs design sign-off).
Removed the only arbitrary (literal) font size outside `src/brand`:
- `src/ui/shadcn/button.tsx` `sm` size: `text-[0.8rem]` → `text-dcx-md-plus` (0.8125rem, token-sourced).
Result: 0 arbitrary font sizes outside `src/brand`.

## PO Web Check — REAL pointer (Playwright MCP; §28 fallback path)
The Preview MCP could not attach (port 3000 held by another chat's dev server). Per §28 I used the
**Playwright MCP** against the running dev server (same working tree → Vite HMR applied the edits;
verified token values live). Theme switched with a **real pointer click** on the builder header
"Toggle visual theme" button (not `.click()` synthesis at the engine level — Playwright dispatches a real
pointer event). Routes `/builder/v-1`, `/` (home), `/version/v-1`; viewports 1440×900 and 390×844.

Computed-value evidence:
- Light: `--background oklch(0.98 0.004 91)` (not pure white), `--theme-surface-void #FDFDFB`,
  `--card/--popover oklch(0.992…)`, `--theme-text-secondary rgba(21,21,22,0.82)`, `--theme-accent-text #006080`.
- Dark: `--theme-text-secondary rgba(247,247,248,0.82)`, `--theme-accent-text #75E2FF`.
- /home light: app-shell bg `rgb(250,249,246)` (not pure white); `.eyebrow` color `rgb(0,96,128)` = #006080
  (legible; was cyan); `.eyebrow` font-size `13px` (token `--text-md-plus`); `p:last-child` color
  `rgba(21,21,22,0.68)` (legible; was an always-light component token); `h1` `rgb(21,21,22)`.

Screenshots → `output/evidence/CT-1-theme-tokens/`:
- `builder-dark-1440.png`, `builder-light-1440.png`
- `home-light-1440.png`, `home-light-390.png`
- `version-light-1440.png`, `version-light-390.png`

Note: `/home` and `/version` render in light by default because WM-1's theme preference is **version-scoped**
(no version id on those routes), so a full reload falls back to `:root` (light). That is WM-1 behavior, not
CT-1 scope; dark-theme token correctness is proven on `/builder` (dark chrome in both themes) + computed values.
Console: only a pre-existing `favicon.ico` 404 (no React/JS errors).

## Requirement Debt Burn-down (touched scope: button.tsx, tokens.css, components.css)
| Metric | Before | After |
|---|---|---|
| Manifestations lacking requirements | 2 | 0 |
| Candidate links blocking the gate (ungrounded manifestations) | 10 | 0 |
| Candidate links queued (non-blocking, grounded manifestations) | — | 9 |
| Completion-gate status | ❌ FAIL | ✅ PASS |
| Pure-white token surfaces (tokens.css) | 5 | 0 |
| `--theme-text-secondary` defined | 0 | 2 (light+dark) |
| On-light brand-blue text offenders (`.eyebrow`) | 1 (cyan) | 0 (#006080) |
| Arbitrary font sizes outside src/brand | 1 | 0 |

Candidate links **not** confirmed (keyword-similarity noise, recorded in ledger): tokens.css→REQ-FP-D12
(dimension tokens → CT-2); components.css→REQ-BC-024/REQ-DM-012/REQ-DM-024/REQ-DZ-001/REQ-SBC-001/
REQ-STG-001/REQ-STG-003.

## Gates
- `npm run typecheck` — PASS
- `npm run lint` — PASS (eslint --max-warnings 0)
- `bash scripts/verify.sh` — PASS
- `npm run validate:architecture` — PASS (no dependency violations; 264 modules)
- `npm run test` — PASS (11 files, 82 tests) — no targeted test exists for brand CSS tokens (CSS, not unit-testable); browser computed-value proof recorded above
- `npm run req:folder-index` — PASS (784 nodes)
- `npm run req:validate` — PASS (pre-existing warning `QST-VR-011` only)
- `npm run req:completion-gate -- --changed src/ui/shadcn/button.tsx,src/brand/styles/tokens.css,src/brand/styles/components.css` — ✅ PASS
- Browser/visual proof (real pointer, Playwright MCP via §28 fallback) — PASS

## Files touched
- `src/brand/styles/tokens.css`
- `src/brand/styles/components.css`
- `src/ui/shadcn/button.tsx`
- `docs/product/requirements/graph/nodes/manifestation/function/MAN-function-src-brand-styles-tokens.json` (new)
- `docs/product/requirements/graph/nodes/manifestation/function/MAN-function-src-brand-styles-components.json` (new)
- `docs/product/requirements/graph/trace-links/TRC-CT1-*.json` (4 new)
- `docs/product/requirements/graph/ledger/decision-ledger.jsonl` (1 entry)
- README carry-forward + this output + CT-1 sprint status

## Follow-ups / tooling debt
- **PO governance:** reconcile root `CLAUDE.md` (impeccable QUARANTINED) ↔ `docs/agent-skills.md`
  (enabled brand-only) so the status is stated once (G-IMPECCABLE wording).
- Preview MCP could not be used (port 3000 held by another chat's server); used Playwright MCP fallback.
- 9 queued candidate links remain in the review queue for the two brand-CSS manifestations (non-blocking).
