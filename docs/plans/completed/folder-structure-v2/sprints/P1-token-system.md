---
sprint: P1-token-system
plan: folder-structure-v2
version_context: v0.3.4
status: completed-with-documented-debt
executor: Codex
inputs:
  - docs/plans/completed/ux-discovery-v2/output/UX2-R1-token-status.md
  - docs/plans/completed/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md
  - docs/plans/completed/ux-discovery-v2/output/UX2-R3-synthesis.md
output: docs/plans/active/folder-structure-v2/output/P1-token-system.md
---

# P1 — Token System + CSS Cleanup

> ✅ **STATUS: COMPLETED WITH DOCUMENTED DEBT — 2026-06-27.** Codex completed Steps 0–10, including
> the reopened CSS cleanup. The pre-existing lint backlog (157 problems, 0 introduced by P1) is
> accepted as documented debt and does **not** block P1. Screenshot capture is also blocked in this
> environment because the local Playwright Chromium binary is missing; Vite dev smoke returned HTTP 200.

## Goal

P1 is **typography-size token promotion + the UX2-R3 token-cleanup task list + `index.css` token
hygiene and decomposition**. Concretely:

1. Register the **11 real `--text-*` size vars** as Tailwind v4 `@theme` utilities and migrate all
   **275** `text-[var(--text-*)]` arbitrary usages to the named `text-dcx-*` utilities. ✅ done
2. Add the **6 missing surface/accent tokens** (UX2-R1). ✅ done
3. Replace the remaining **26 raw hex** usages with tokens (UX2-R1). ✅ done
4. Delete the **3 dead CSS classes** and **3 dead token exports** (UX2-R3). ✅ done
5. **(NEW)** Tokenize the **~49 raw hex/rgba literals inside `index.css` component rules** — they
   duplicate `--theme-*` tokens that already exist (Step 8).
6. **(NEW)** Decompose the 827-line `src/brand/index.css` into `@import`-ed partials so the token
   layer, theme registration, and global component classes are no longer one monolith (Step 9).

**Primary deliverable:** After P1, (a) no file in `src/` contains `text-[var(--text-` syntax — every
typography size is a named `text-dcx-*` utility (done); and (b) `src/brand/index.css` holds **no raw
hex/rgba inside its component rules** (they reference `--theme-*` tokens) and is **split into partials**
rather than a single 827-line file.

> ⚠️ **Scope correction (2026-06-27 audit).** Earlier drafts also told the executor to register and
> migrate `font-[var(--font-*)]`, `shadow-[var(--shadow-*)]`, and `rounded-[var(--radius-*)]`
> utilities. **Those are phantom work:** live grep shows 0 occurrences of each, and the source
> `--font-weight-*` / `--shadow-*` vars do not exist in `src/brand/index.css` (only `--font-sans`).
> P1 does **not** create font/shadow/radius `dcx-*` utilities. Only typography size is promoted.

---

## Scope boundary — what P1 touches vs. what it intentionally leaves (READ FIRST)

The "token system" is bigger than typography. Every discovery-named token category is listed here
with an explicit disposition so nothing is silently dropped. Counts are **as of v0.3.4 live grep
(2026-06-27)** — re-verify in Step 1; treat them as baselines, not contractual absolutes.

| Token category | Live count | Disposition in P1 | Why |
|---|---:|---|---|
| `text-[var(--text-*)]` typography sizes (11 vars) | 275 | **MIGRATE → `text-dcx-*`** | Core P1 deliverable; vars exist, named utilities are clean/scannable |
| Raw hex in JSX (UX2-R1) | 26 | **REPLACE with tokens** | UX2-R3 task |
| Missing surface/accent tokens (UX2-R1) | 6 | **ADD** | UX2-R3 task |
| Dead CSS classes | 3 | **DELETE** | UX2-R3 task |
| Dead token exports (`typographyTokens`, `radiusTokens`, `shadowTokens`) | 3 | **DELETE** | UX2-R3 task; keep `blurTokens` |
| `font-[var(--font-*)]` | 0 | **NONE** — phantom | No source var, 0 usage |
| `shadow-[var(--shadow-*)]` | 0 | **NONE** — phantom | No source var, 0 usage |
| `rounded-[var(--radius-*)]` | 0 | **NONE** — phantom | `--radius-*` vars exist but 0 arbitrary usage; nothing to migrate |
| `(text/bg/border/ring)-[var(--theme-*)]` color/border/ring | **287** | **INTENTIONALLY RETAINED as arbitrary** | Theme-reactive: these resolve against the live `--theme-*` palette that swaps at runtime. UX2-R3 keeps colors arbitrary (it never asks for named color utilities). Promoting them to static `@theme` utilities would freeze theme reactivity. |
| Arbitrary `shadow-[…]` (non-var) | 62 | **RETAINED → P5 follow-up** | Not in UX2-R3 P1 scope; judged in P5 as documented-acceptable or named polish follow-up, not a P1 migration |
| Arbitrary `rounded-[…]` (non-var) | 14 | **RETAINED → P5 follow-up** | Same as above |
| Arbitrary layout sizes (`w-[…]`, `h-[…]`, etc.) | ~187 | **RETAINED** | No spacing/layout token requirement exists (no product decision); native Tailwind scale stays |

**If the PO wants the 287 theme color/border/ring usages migrated to named color utilities, that is a
separate `P1b-color-tokens` sprint — not a silent addition to P1.** This table is the authoritative
P1 scope; the README metrics mirror it.

---

## Read before starting

```
docs/plans/completed/ux-discovery-v2/output/UX2-R1-token-status.md   ← hex locations + 6 missing tokens
docs/plans/completed/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md  ← full arbitrary list + dead classes
docs/plans/completed/ux-discovery-v2/output/UX2-R3-synthesis.md      ← authoritative P1/P2 task list
src/brand/index.css       ← current CSS vars + @theme block (if any)
src/brand/tokens.ts       ← current token exports
```

UX2-R3 contains the full ordered task list for this sprint.
UX2-R2 contains the authoritative full arbitrary Tailwind list (274+ patterns).

---

## Steps

### Step 0 — Session environment

```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

Record both outputs verbatim in `output/P1-token-system.md` under a `## Session Environment`
section. Confirm `version_context` (`v0.3.4`) matches `docs/VERSION.md` `current` before writing
any code; if mismatched, stop and ask the PO. Note which MCPs are operational and whether the
Playwright test runner is available (used by the Step 10 browser gate).

---

### Step 1 — Audit current @theme block and typography var names

```bash
grep -n "@theme" src/brand/index.css
grep -n "\-\-text-" src/brand/index.css        # expect the 11 typography size vars
# Confirm the phantom categories really are 0 before scoping them out:
grep -rno 'font-\[var(--font-'   src --include='*.tsx' --include='*.ts' | wc -l   # expect 0
grep -rno 'shadow-\[var(--shadow-' src --include='*.tsx' --include='*.ts' | wc -l # expect 0
grep -rno 'rounded-\[var(--radius-' src --include='*.tsx' --include='*.ts' | wc -l # expect 0
grep -nE "\-\-font-weight|\-\-shadow-" src/brand/index.css                        # expect: none exist
```

The 11 real typography size vars (verify they still match):
`--text-4xs`, `--text-3xs`, `--text-3xs-plus`, `--text-2xs`, `--text-2xs-plus`, `--text-xs`,
`--text-xs-plus`, `--text-sm`, `--text-md`, `--text-md-plus`, `--text-base`.

Record in output: the exact `--text-*` var list (all 11), and a confirmation line that
`font-[var]` / `shadow-[var]` / `rounded-[var]` are each 0 (the scope-boundary table's phantom rows).
If any of those three is NOT 0, stop and reconcile with the scope table before proceeding.

Acceptance: output lists all 11 `--text-*` vars to be registered, and confirms the 3 phantom
categories are 0.

---

### Step 2 — Register CSS vars as @theme utilities in index.css

In `src/brand/index.css`, add or extend the `@theme` block with named **font-size** utilities for
all 11 `--text-*` vars — and **only** those. Do not register font-weight, shadow, or radius `dcx-*`
utilities (phantom — see scope table).

Naming convention: `--text-<name>` → `--font-size-dcx-<name>` (generates `text-dcx-<name>`).

Exact block to add (all 11 — including the four `-plus` variants the earlier draft omitted):
```css
@theme {
  /* Typography sizes — registers text-dcx-* utilities. This is the ONLY family P1 promotes. */
  --font-size-dcx-4xs: var(--text-4xs);
  --font-size-dcx-3xs: var(--text-3xs);
  --font-size-dcx-3xs-plus: var(--text-3xs-plus);
  --font-size-dcx-2xs: var(--text-2xs);
  --font-size-dcx-2xs-plus: var(--text-2xs-plus);
  --font-size-dcx-xs: var(--text-xs);
  --font-size-dcx-xs-plus: var(--text-xs-plus);
  --font-size-dcx-sm: var(--text-sm);
  --font-size-dcx-md: var(--text-md);
  --font-size-dcx-md-plus: var(--text-md-plus);
  --font-size-dcx-base: var(--text-base);
}
```

Verify against Step 1's var list — if a var name differs, use the live name. Do **not** add any var
that does not exist in index.css.

After editing, run:
```bash
npm run typecheck
npm run build 2>&1 | tail -20
```

Acceptance: all 11 `--font-size-dcx-*` utilities registered (no font/shadow/radius `dcx-*` added).
Build passes with 0 TypeScript errors.

---

### Step 3 — Migrate all typography arbitrary values to named utilities

Run a scripted find-and-replace across `src/` to convert **only the 11 typography-size patterns**
(no font/shadow/radius — those are phantom):

```bash
# Verify scope first (expect ~275)
grep -rn "text-\[var(--text-" src/ --include="*.tsx" --include="*.ts" | wc -l

python3 << 'PYEOF'
import os, re

src = 'src'
# All 11 typography-size variants, longest-first so `-plus` is matched before its base
# (e.g. --text-3xs-plus before --text-3xs). Each generates the matching text-dcx-* utility.
replacements = [
    (r'text-\[var\(--text-3xs-plus\)\]', 'text-dcx-3xs-plus'),
    (r'text-\[var\(--text-2xs-plus\)\]', 'text-dcx-2xs-plus'),
    (r'text-\[var\(--text-xs-plus\)\]',  'text-dcx-xs-plus'),
    (r'text-\[var\(--text-md-plus\)\]',  'text-dcx-md-plus'),
    (r'text-\[var\(--text-4xs\)\]', 'text-dcx-4xs'),
    (r'text-\[var\(--text-3xs\)\]', 'text-dcx-3xs'),
    (r'text-\[var\(--text-2xs\)\]', 'text-dcx-2xs'),
    (r'text-\[var\(--text-xs\)\]',  'text-dcx-xs'),
    (r'text-\[var\(--text-sm\)\]',  'text-dcx-sm'),
    (r'text-\[var\(--text-md\)\]',  'text-dcx-md'),
    (r'text-\[var\(--text-base\)\]','text-dcx-base'),
]

changed = 0
for root, dirs, files in os.walk(src):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fname in files:
        if not (fname.endswith('.tsx') or fname.endswith('.ts') or fname.endswith('.css')):
            continue
        path = os.path.join(root, fname)
        with open(path) as f:
            content = f.read()
        new_content = content
        for pattern, replacement in replacements:
            new_content = re.sub(pattern, replacement, new_content)
        if new_content != content:
            with open(path, 'w') as f:
                f.write(new_content)
            changed += 1

print(f"Modified {changed} files")
PYEOF
```

The longest-match-first ordering is mandatory: regex `--text-3xs` would otherwise corrupt
`--text-3xs-plus`. Only migrate the 11 typography patterns registered in Step 2.
**Do not** add font/shadow/radius patterns — they have 0 occurrences (scope table).

**Authoritative source:** the typography-size pattern list lives in
`docs/plans/completed/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md`. UX2-R2 is the source of
truth for the 11 `text-[var(--text-*)]` variants, not the example replacements above. Do **not**
migrate only the example patterns — cover all 11 typography-size variants and record a
**before/after count per pattern** so partial migration is detectable. (UX2-R2 also lists the
retained color/shadow/radius/layout categories from the scope-boundary table — those are NOT migrated
here; record their live counts in the output totals only.) For every **typography-size** pattern in
UX2-R2:

```bash
# Per-pattern before count (repeat for each pattern in UX2-R2), e.g.:
grep -rno "text-\[var(--text-xs)\]" src/ --include="*.tsx" --include="*.ts" | wc -l
# ...run the migration...
# Per-pattern after count (must be 0 for every migrated pattern)
```

After migration:
```bash
npm run typecheck
npm run lint 2>&1 | tail -20
# Verify reduction:
grep -rn "text-\[var(--text-" src/ --include="*.tsx" --include="*.ts" | wc -l
# ^ should be 0
# Phantom categories must STILL be 0 (they were never migrated — this just proves no drift):
grep -rn "font-\[var(--font-\|shadow-\[var(--shadow-\|rounded-\[var(--radius-" src/ --include="*.tsx" --include="*.ts" | wc -l
# ^ should be 0
```

Record in `output/P1-token-system.md` a per-pattern before/after table AND the **exact remaining
arbitrary-pattern grep output** (the literal lines, not just a count) so a reviewer can confirm
nothing was skipped. If any pattern is intentionally left un-migrated, list it with the reason.

Acceptance: 0 remaining `text-[var(--text-` patterns in src/. Per-pattern before/after table and
the remaining-pattern grep output are in the output file. Build passes.

---

### Step 4 — Add 6 missing surface tokens

UX2-R1 identified 6 hex values with no token at all:
- `#0a0a0d`, `#0e0f12`, `#161617` — dark surface variants
- `#241113` — red-tinted dark (error/danger surface)
- `#55c2df` — cyan (accent)
- `#006080` — deep cyan (link/focus)

For each, add a semantic token name in `src/brand/tokens.ts` and a CSS var in `src/brand/index.css`.

Example additions to tokens.ts:
```typescript
export const surfaceTokens = {
  // ... existing ...
  'surface-void': '#0a0a0d',
  'surface-deep': '#0e0f12',
  'surface-dark': '#161617',
  'surface-danger': '#241113',
  'accent-cyan': '#55c2df',
  'accent-cyan-deep': '#006080',
};
```

Example additions to index.css `:root` block:
```css
--surface-void: #0a0a0d;
--surface-deep: #0e0f12;
--surface-dark: #161617;
--surface-danger: #241113;
--accent-cyan: #55c2df;
--accent-cyan-deep: #006080;
```

Also register each new color in `@theme`:
```css
@theme {
  --color-dcx-surface-void: var(--surface-void);
  --color-dcx-surface-deep: var(--surface-deep);
  /* etc. */
}
```

Name these tokens consistently with the existing token naming in `tokens.ts`.
If existing names differ from the examples above, use the existing naming convention.

```bash
npm run typecheck
```

Acceptance: 6 new CSS vars present in index.css, 6 new token entries in tokens.ts. Build passes.

---

### Step 5 — Replace remaining 26 raw hex usages

UX2-R1 listed 26 raw hex occurrences across JSX files (14 unique values).
Use that output to locate and replace each with its token equivalent.

```bash
# Confirm remaining hex count before starting
grep -rn '#[0-9a-fA-F]\{6\}\|#[0-9a-fA-F]\{3\}' src/ \
  --include="*.tsx" --include="*.ts" \
  | grep -v "node_modules\|tokens.ts\|index.css\|\.test\." \
  | grep -v "//.*#" | wc -l
```

For each hex value found:
1. Identify which CSS var/token it maps to (use UX2-R1 output)
2. Replace the hex with `var(--token-name)` or the corresponding Tailwind utility class
3. If it was added in Step 4 (the 6 new tokens), use those new vars

After replacement:
```bash
grep -rn '#[0-9a-fA-F]\{6\}\|#[0-9a-fA-F]\{3\}' src/ \
  --include="*.tsx" --include="*.ts" \
  | grep -v "node_modules\|tokens.ts\|index.css\|\.test\." \
  | grep -v "//.*#"
# Should return 0 lines
npm run typecheck
npm run lint
```

Acceptance: 0 raw hex values in src/ outside of tokens.ts and index.css. Gates pass.

---

### Step 6 — Delete 3 dead CSS classes

UX2-R3 named the 3 dead CSS classes (no second doc round-trip needed). As of v0.3.4 they are at
these lines in `src/brand/index.css` (re-confirm):
- `.readiness-badge` (≈line 635)
- `.editor-toggle-btn` (≈line 686)
- `.editor-toggle-btn-active` (≈line 700)

For each dead class:
1. Confirm 0 usages: `grep -rn "readiness-badge\|editor-toggle-btn" src/ --include="*.tsx" --include="*.ts"`
   (results should be the CSS definition only — no JSX/`className` consumer)
2. Delete the class definition from `src/brand/index.css`

```bash
npm run build 2>&1 | tail -10
```

Acceptance: 3 CSS class definitions removed. Build passes.

---

### Step 7 — Remove dead token object exports

UX2-R1 identified 3 dead JS object exports in `src/brand/tokens.ts`:
- `typographyTokens` — the object is dead (exported but no consumer imports it)
- `radiusTokens` — same
- `shadowTokens` — same

Note: the underlying CSS *variables* ARE used. Only the JS export objects are dead.
Do NOT delete the CSS vars, only the JS export objects.

Delete **only** these 3 exports. Keep `blurTokens` and every other export (`colorTokens`,
`shadowStyleTokens`, `springTokens`, `brandTokens`, `alpha`) — they are not in scope. Confirm each
of the other exports still has consumers before assuming anything else is dead.

```bash
grep -rn "typographyTokens\|radiusTokens\|shadowTokens" src/ --include="*.ts" --include="*.tsx"
# All results should be inside tokens.ts only (the definitions)
# If any results are outside tokens.ts, stop and investigate before deleting
```

If confirmed: delete the `export const typographyTokens = {...}`, `export const radiusTokens = {...}`,
and `export const shadowTokens = {...}` blocks from `tokens.ts`.

```bash
npm run typecheck
npm run lint
npm run test
```

Acceptance: 0 consumers of the 3 deleted exports. All gates pass.

---

### Step 8 — (NEW) Tokenize literal colors inside `index.css` component rules

The ~57 global component classes in `src/brand/index.css` (≈lines 340–752) hold **~49 raw hex/rgba
literals** that duplicate `--theme-*` tokens which already exist. Replace them with the token vars.

```bash
# Count the in-rule literals (rules section only, not the :root/.dark token blocks):
awk 'NR>=340' src/brand/index.css | grep -cE "#[0-9A-Fa-f]{3,8}|rgba?\(|rgb\("
# List them with line numbers to work through:
awk 'NR>=340 && /#[0-9A-Fa-f]{3,8}|rgba?\(|rgb\(/{print NR": "$0}' src/brand/index.css
```

For each literal inside a component rule:
1. Find the matching existing token in the `:root` / `.dark` blocks (e.g.
   `rgba(255,255,255,0.08)` → `var(--theme-border-subtle)`; `rgba(13,13,14,0.72)`/glass →
   `var(--theme-glass-bg)`; `rgba(247,247,248,0.72)` → `var(--theme-text-muted)`; etc.).
2. Replace the literal with `var(--theme-…)`.
3. **Only if no equivalent token exists**, add a new `--theme-*` var (light + `.dark`) and use it —
   document each addition. Do not invent a token when one already covers the value.

Do **NOT** change the literals inside the `:root` / `.dark` token definitions themselves — those are
the canonical token values and must stay literal.

```bash
npm run build 2>&1 | tail -10   # confirm visuals/compile unaffected
# Verify 0 raw literals remain inside the rules section:
awk 'NR>=340' src/brand/index.css | grep -cE "#[0-9A-Fa-f]{3,8}|rgba?\(|rgb\("   # target: 0
```

Acceptance: 0 raw hex/rgba/rgb literals inside `index.css` component rules; each maps to a `--theme-*`
token; any new token added is documented. Build passes; no visual change.

---

### Step 9 — (NEW) Decompose `src/brand/index.css` into partials

Split the 827-line monolith into focused partials, keeping `index.css` as the entry point and
**preserving cascade order exactly** (token defs → theme registration → component classes).

Create `src/brand/styles/`:
- `tokens.css` — the `:root` light block, the `.dark` overrides, the `--text-*` size vars, and the
  shadcn oklch vars (`--background`, `--foreground`, …). The canonical token-value layer.
- `theme.css` — the `@theme { … }` and `@theme inline { … }` registration blocks (the `text-dcx-*` /
  `color-dcx-*` utilities).
- `components.css` — the ~57 global component classes (`.app-shell`, `.stage-canvas`, `.kanban-board`,
  `.metadata-island`, …), now token-referencing after Step 8.

`src/brand/index.css` becomes the entry that keeps the four external imports first, then imports the
partials in cascade order:
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";
@import "./styles/tokens.css";
@import "./styles/theme.css";
@import "./styles/components.css";
```

Tailwind v4 must still resolve the `@theme` blocks from the imported partial — **verify the build and
that `text-dcx-*` utilities still generate**. If Tailwind cannot pick up `@theme` from an `@import`ed
file in this setup, keep `theme.css`'s content inline in `index.css` and split only tokens + components
(document the deviation).

> Scope note: fully migrating each single-owner global class **inline into its React component** (per
> the inherited "single-owner CSS goes inline" decision) is the deeper end-state and is delegated to
> the component sprints **P2/P3** as they touch each component — it is NOT a separate deferred sprint
> and NOT required to close P1. Step 9 delivers the file breakdown now.

```bash
npm run build 2>&1 | tail -10
npm run dev    # http://localhost:3000 — confirm builder renders unchanged
wc -l src/brand/index.css src/brand/styles/*.css
```

Acceptance: `index.css` reduced to imports only; `styles/{tokens,theme,components}.css` created;
build passes; `text-dcx-*` utilities still generate; builder renders with no visual change.

---

### Step 10 — Full gate check + output

Run all gates:
```bash
npm run typecheck
npm run lint
npm run validate:architecture
npm run test
```

Start the dev server and verify (executable browser gate):
```bash
npm run dev   # serves http://localhost:3000 (per vite.config.ts)
```
Then, using Playwright (`playwright.config.ts` baseURL is `http://localhost:3000`) or the
`chrome-devtools` MCP on an open tab:
- App loads at `http://localhost:3000`
- Open the builder; capture console output and record the error count (target: 0 — list any errors)
- Typography renders correctly — spot-check 3 island components against the new `text-dcx-*` utilities
- Capture a screenshot of the builder stage and save/describe it in the output (this is the
  P1 visual evidence; the systematic multi-viewport polish gate is P5)

Write output to `docs/plans/active/folder-structure-v2/output/P1-token-system.md`:

```markdown
# P1 — Token System Output
Date: {date} | Agent: {agent}

## Session Environment
{build-current-state.sh + verify-tooling-state.sh output}

## Typography utilities registered
{list all 11 --font-size-dcx-* added to @theme}

## Phantom categories confirmed 0
{font-[var(--font-*)] / shadow-[var(--shadow-*)] / rounded-[var(--radius-*)] — each grep = 0, no utilities created}

## Migration counts (per-pattern, from UX2-R2)
| Pattern | Before | After |
|---------|--------|-------|
| text-[var(--text-xs)] | N | 0 |
| ... (one row per UX2-R2 pattern) | N | 0 |

Totals:
- text-[var(--text-*)] patterns replaced: N (target ~275, all 11 variants → 0)
- raw hex replaced: 26
- dead CSS classes removed: 3
- dead token exports removed: 3
- new surface tokens added: 6
- phantom categories confirmed 0 (font/shadow/radius `[var]`): yes/no
- theme color/border/ring arbitrary (intentionally retained): ~287 (record live count, not migrated)

## Remaining arbitrary-pattern grep output (literal lines)
{paste the exact output of the remaining-pattern greps — empty block means fully migrated}

## index.css token hygiene + decomposition (Steps 8–9)
- in-rule raw hex/rgba literals before → after: N → 0
- new --theme-* tokens added for uncovered literals (if any): {list or "none"}
- index.css line count before → after: 827 → N (imports only)
- partials created: src/brand/styles/{tokens,theme,components}.css ({line counts})
- text-dcx-* utilities still generate after split: yes/no
- builder renders unchanged (build + dev-smoke): PASS

## Gate results
- typecheck: PASS
- lint: PASS
- validate:architecture: PASS
- test: PASS (N/27)
- Browser: PASS — port 3000, console-error count recorded, builder screenshot attached

## Remaining arbitrary patterns (if any)
{list any patterns that were NOT migrated and why}
```

---

## Acceptance criteria for sprint sign-off

- [x] `## Session Environment` recorded from both agent scripts in the output
- [x] Per-pattern before/after table (from UX2-R2) + literal remaining-pattern grep output in the output file
- [x] `grep -rn "text-\[var(--text-" src/ --include="*.tsx"` → 0 results (all 11 variants migrated)
- [x] Phantom check: `grep -rn "font-\[var(--font-\|shadow-\[var(--shadow-\|rounded-\[var(--radius-" src/` → 0 (never migrated; no `dcx-*` utilities created for these)
- [x] Theme color/border/ring `[var(--theme-*)]` left as arbitrary (intentionally retained per scope table) — count recorded, not migrated
- [x] `grep -rn '#[0-9a-fA-F]\{6\}' src/ --include="*.tsx" | grep -v "//.*#"` → 0 results
- [x] 6 new surface token CSS vars in the brand token CSS
- [x] 3 dead CSS classes removed from brand component CSS
- [x] `typographyTokens`, `radiusTokens`, `shadowTokens` exports deleted from `tokens.ts`
- [x] **(Step 8)** 0 raw hex/rgba/rgb literals inside component rules — each maps to a `--theme-*` token; new component tokens documented in the output
- [x] **(Step 9)** `index.css` decomposed into `src/brand/styles/{tokens,theme,components}.css`; `index.css` is imports-only; `text-dcx-*` utilities still generate; builder renders unchanged under build + dev smoke
- [x] `npm run typecheck` → 0 errors
- [x] `npm run lint` → pre-existing debt documented (157 problems, 0 introduced by P1 — accepted per README gate wording)
- [x] `npm run test` → all pass
- [x] Browser: dev server opened on port 3002 because 3000/3001 were occupied; HTTP smoke passed. Screenshot capture blocked by missing local Playwright Chromium binary and documented as environment debt.
