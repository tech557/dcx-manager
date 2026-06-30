---
sprint: P2-component-consolidation
plan: folder-structure-v2
version_context: v0.3.4
status: completed-with-documented-debt
executor: Codex
depends-on: P1-token-system (must complete first — new utility class names used in consolidated components)
inputs:
  - docs/plans/completed/ux-discovery-v2/output/UX2-R3-synthesis.md
  - docs/plans/completed/frontend-discovery-v2/output/FE2-R3-refactorability.md
  - docs/plans/completed/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md
output: docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md
---

# P2 — Component Consolidation

> **Execution method — incremental task logs.** Starting 2026-06-27, P2 is executed as small
> recoverable task slices. After each completed task, Codex must update this sprint file and
> `output/P2-component-consolidation.md`, then write a dedicated progress log before moving to the
> next task. This keeps the sprint resumable if the session is interrupted.

## Task Progress

| Task | Scope | Status | Log |
|---|---|---|---|
| Task 0 | Session environment, carry-forward contract, P1 dependency, methodology setup | Completed | `docs/progress/sessions/2026-06-27-codex/13-P2-task0-session-methodology.md` |
| Task 1 | Step 1 orphan verification before deletion | Completed | `docs/progress/sessions/2026-06-27-codex/14-P2-task1-orphan-verification.md` |
| Task 2 | Step 2 delete confirmed orphans + barrels in batches (skip `ReadinessBadge` until Task 3 migration) | Completed | `docs/progress/sessions/2026-06-27-codex/15-P2-task2-orphan-deletion.md` |
| Task 3 | Step 3 Badge reconciliation, including `PhaseReadinessBadge` alias migration off `ReadinessBadge` | Completed | `docs/progress/sessions/2026-06-27-codex/16-P2-task3-badge-reconciliation.md` |
| Task 4 | Step 4 Input reconciliation | Completed | `docs/progress/sessions/2026-06-27-codex/17-P2-task4-input-reconciliation.md` |
| Task 5 | Step 5 Select consolidation | Completed | `docs/progress/sessions/2026-06-27-codex/18-P2-task5-select-consolidation.md` |
| Task 6 | Step 6 Toggle/Tab consolidation | Completed | `docs/progress/sessions/2026-06-27-codex/19-P2-task6-toggle-tab-consolidation.md` |
| Task 7 | Step 7 GlassSurface consolidation | Completed | `docs/progress/sessions/2026-06-27-codex/20-P2-task7-glasssurface-consolidation.md` |
| Task 8 | Step 7b Chip verification | Completed | `docs/progress/sessions/2026-06-27-codex/21-P2-task8-chip-verification.md` |
| Task 9 | Step 8 full gates + browser/dev evidence | Completed | `docs/progress/sessions/2026-06-27-codex/22-P2-task9-full-gates.md` |
| Task 10 | Step 9 carry-forward contract update + sprint close | Completed with documented debt | `docs/progress/sessions/2026-06-27-codex/23-P2-task10-sprint-close.md` |

## Goal

**Reconcile** consumers onto the **atom primitives that already exist**, then delete the duplicate
and dead components. P2 does **not** create new base primitives — `src/ui/atoms/` already contains
`Badge.tsx`, `Chip.tsx`, `Input.tsx`, and `ToggleGroup.tsx` (created 2026-06-25, pre-dating this
plan, and already barrel-exported from `src/ui/atoms/index.ts`).

Concretely:
1. Delete the 10 confirmed dead orphaned components (and their barrel re-exports).
2. Migrate consumers of the duplicate Input/Select/Toggle/Badge/Glass variants onto the existing
   `atoms/*` primitives (adding variant props to those existing atoms where needed), then delete the
   duplicates.

After P2, `src/ui/forms/inputs/`, `src/ui/forms/selects/`, and `src/ui/atoms/` should each
have ≤3 files for their respective component types, down from 7–8 today.

> ⚠️ **Premise correction (2026-06-27 audit).** Earlier drafts said "Badge.tsx was created in P1"
> (false — P1 is tokens-only and creates no component) and told the executor to **create
> `src/ui/forms/inputs/TextInput.tsx`** (a *second* base input beside the existing `atoms/Input.tsx`).
> That violates core §4.5 (no variant beside the real component) and §7 (import the existing atom).
> P2 reconciles onto the existing atoms; it creates no competing base primitive.

---

## Read before starting

```
docs/plans/completed/ux-discovery-v2/output/UX2-R3-synthesis.md       ← P2 task list (authoritative)
docs/plans/completed/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md  ← duplication groups detail
docs/plans/completed/frontend-discovery-v2/output/FE2-R3-refactorability.md  ← orphan list + consumer counts
src/ui/atoms/index.ts        ← the existing Badge/Chip/Input/ToggleGroup atoms (reconcile onto these)
src/ui/forms/inputs/index.ts ← barrel that re-exports orphan inputs (must be edited on deletion)
src/ui/forms/selects/index.ts← barrel that re-exports orphan selects (must be edited on deletion)
```

**Pre-existing atoms (verify with `ls src/ui/atoms/`):** `Badge.tsx`, `Chip.tsx`, `Input.tsx`,
`ToggleGroup.tsx`, `index.ts`. These are the reconciliation targets. Do **not** recreate them.

FE2-R3 orphan list (confirmed dead — 0 consumers, not in stage.registry.ts):
`LockBadge`, `ReadinessBadge`, `StatusBadge`, `FieldIndicator`, `DateInputTBD`, `DualInput`,
`TextInputSmall`, `SearchableSelect`, `SearchableSelectIcons`, `DayCard`

**Reconciliation note (UX2-R3 vs FE2-R3):** UX2-R3 said *merge* the old Badge variants into a Badge
atom; FE2-R3 lists them as *dead orphans to delete*. Both are now true — the `atoms/Badge.tsx` atom
already exists, so the old `StatusBadge`/`LockBadge`/`ReadinessBadge` are dead. P2 deletes them and
points any remaining consumers at `atoms/Badge.tsx`.

DO NOT delete: `KanbanView`, `SmokeStage`, `TimelineView`, `AIChatPopup`, `TemplatePopup`
These are either dynamically resolved or actively used elsewhere.
Confirm each via grep before deleting.

---

## Steps

### Step 0 — Session environment

```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

Record both outputs verbatim in `output/P2-component-consolidation.md` under a
`## Session Environment` section. Confirm `version_context` (`v0.3.4`) matches `docs/VERSION.md`
`current`; if mismatched, stop and ask the PO. Confirm P1 output exists (this sprint depends on the
`text-dcx-*` utilities P1 registered) — if `output/P1-token-system.md` is missing, stop.

**Carry-forward contract (MANDATORY — read before any edit).** Read the README
`## Carry-forward contract — current structural state` section **and** `output/P1-token-system.md`,
and obey the **REUSE-don't-RECREATE** rule. For P2 specifically:
- Global component CSS now lives in `src/brand/styles/components.css` (NOT a monolithic `index.css`);
  every color there is a `var(--theme-*)` token from `src/brand/styles/tokens.css` — **0 raw literals**.
  If consolidation touches any global class or glass/surface styling, edit `components.css` and reuse
  the existing `--theme-*` tokens (incl. the P1-added `--theme-component-*` family:
  `--theme-component-surface-*`, `--theme-component-border-*`, `--theme-component-text-*`). Do **not**
  hard-code hex/rgba, and do **not** create a new CSS file.
- Reuse the existing atoms (`src/ui/atoms/{Badge,Chip,Input,ToggleGroup}.tsx`); never create a
  competing base primitive. Use `text-dcx-*` for typography (no `text-[var(--text-*)]`).
- At sprint end, update the README carry-forward block with what P2 changed.

---

### Step 1 — Verify orphan status before deletion

For each of the 10 confirmed-dead components, run:
```bash
grep -rn "LockBadge\|ReadinessBadge\|StatusBadge\|FieldIndicator\|DateInputTBD" \
  src/ --include="*.tsx" --include="*.ts" | grep -v "\.test\." | grep -v "node_modules"

grep -rn "DualInput\|TextInputSmall\|SearchableSelect\|SearchableSelectIcons\|DayCard" \
  src/ --include="*.tsx" --include="*.ts" | grep -v "\.test\." | grep -v "node_modules"
```

**Two known false positives — these are NOT real consumers, do not let them block deletion:**

1. **Barrel re-exports.** 5 orphans are re-exported from `index.ts` barrels:
   - `src/ui/forms/inputs/index.ts` → `DateInputTBD`, `DualInput`, `TextInputSmall`
   - `src/ui/forms/selects/index.ts` → `SearchableSelect`, `SearchableSelectIcons`
   A line `export { X } from './X'` in a barrel is **not** a consumer — it is a re-export that must be
   deleted *together with* the file in Step 2. Exclude `index.ts` from the usage test:
   `... | grep -v "/index.ts:"`.

2. **`FieldIndicator` type-name collision.** `grep FieldIndicator` also hits
   `src/types/card.types.ts:22 export interface FieldIndicator` — an unrelated *type*, not the
   component `src/builder/cards/FieldIndicator.tsx`. Exclude type declarations: a hit in
   `*.types.ts` or on an `interface`/`type ` line is not a component consumer.

A component is only a real consumer if it has a usage that is **not** a barrel re-export and **not** a
type declaration. If such a usage exists: stop, document it, skip that file's deletion. If the only
hits are barrel re-exports + the `FieldIndicator` type: proceed to Step 2 (the barrel lines get
removed there).

---

### Step 2 — Delete confirmed dead orphaned components

Delete the following files:
```
src/ui/LockBadge.tsx
src/ui/ReadinessBadge.tsx
src/ui/StatusBadge.tsx
src/builder/cards/FieldIndicator.tsx
src/ui/forms/inputs/DateInputTBD.tsx
src/ui/forms/inputs/DualInput.tsx
src/ui/forms/inputs/TextInputSmall.tsx
src/ui/forms/selects/SearchableSelect.tsx
src/ui/forms/selects/SearchableSelectIcons.tsx
src/builder/cards/templates/day/DayCard.tsx
```

If `DayCard.tsx` has a parent folder `src/builder/cards/templates/day/` that becomes empty, delete the folder too.

**Mandatory — remove the barrel re-export lines in the same step.** Deleting a file while its barrel
still says `export { X } from './X'` is a guaranteed typecheck/build break. For each deleted file,
delete its matching export line:
- `src/ui/forms/inputs/index.ts` — remove the `DateInputTBD`, `DualInput`, `TextInputSmall` lines
- `src/ui/forms/selects/index.ts` — remove the `SearchableSelect`, `SearchableSelectIcons` lines
- check for any barrel re-exporting `LockBadge`/`ReadinessBadge`/`StatusBadge`/`FieldIndicator`/`DayCard`
  (e.g. a top-level `src/ui/index.ts`) and remove those too:
  `grep -rn "LockBadge\|ReadinessBadge\|StatusBadge\|FieldIndicator\|DayCard" src/ui --include="index.ts"`

Delete in small batches and typecheck after **each** batch so a break is attributable:
```bash
npm run typecheck                     # after each delete+barrel-edit batch
npm run build 2>&1 | grep -i error | head -20
npm run test
```

Acceptance: 10 files deleted, all matching barrel re-export lines removed, 0 TypeScript errors,
tests pass, build succeeds.

---

### Step 3 — Reconcile Badge variants onto the existing Badge atom

`src/ui/atoms/Badge.tsx` **already exists** (created 2026-06-25, exported from `atoms/index.ts`) —
P2 does not create it. Verify it and check whether it supports the variants the deleted
`StatusBadge`/`ReadinessBadge`/`LockBadge` served.

If `Badge.tsx` does NOT support the variants the deleted components served:
- Add `variant: 'status' | 'readiness' | 'lock' | 'default'` prop to `Badge.tsx`
- Add `size: 'sm' | 'md'` prop if not present
- Use the new `text-dcx-*` utilities (from P1) for all typography inside Badge

If `Badge.tsx` already supports these variants: verify and document, no change needed.

```bash
grep -rn "Badge" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules\|\.test\." | head -20
npm run typecheck
```

Acceptance: `Badge.tsx` handles all badge visual patterns with variant props. No raw Badge variants remain.

---

### Step 4 — Reconcile Input variants onto the existing Input atom

`src/ui/atoms/Input.tsx` **already exists** (created 2026-06-25, exported from `atoms/index.ts`).
The surviving variant files after Step 2 live in `src/ui/forms/inputs/` (e.g. `TextInputLarge`,
`TextInputInline`, `ListInputLines`, `SpecsInput`).

```bash
ls src/ui/forms/inputs/
cat src/ui/atoms/Input.tsx          # the reconciliation target — read its current prop contract
```

**Do NOT create `src/ui/forms/inputs/TextInput.tsx`.** A second base input beside the existing
`atoms/Input.tsx` violates core §4.5 (no variant beside the real component) and §7 (import the
existing atom). The goal is to make `atoms/Input.tsx` cover the variants, then point consumers at it.

Steps for reconciliation:
1. Read each surviving `forms/inputs/*` variant to catalogue the real visual/behavioral differences.
2. Extend `src/ui/atoms/Input.tsx` with the props needed to cover them — e.g.
   `size: 'sm' | 'md' | 'lg'` and `variant: 'default' | 'inline' | 'list'` (only the variants real
   consumers need). If a variant carries genuine domain behavior (not just styling), keep it as a
   **thin wrapper** around `atoms/Input.tsx`, not a fork.
3. Update all consumers to import `Input` from `@/ui/atoms` with the appropriate props.
4. Delete the now-unused variant files **and their `forms/inputs/index.ts` barrel lines** (same
   barrel discipline as Step 2).
5. Run gates.

Use `text-dcx-*` utilities from P1 for all typography inside `Input`.

```bash
npm run typecheck
npm run lint
npm run test
# verify no references to old files remain
grep -rn "TextInputLarge\|TextInputInline\|ListInputLines" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"
```

Acceptance: consumers import `Input` from `@/ui/atoms`; `src/ui/forms/inputs/` reduced to ≤2 files
(only genuine domain wrappers + any date input remain); **no new base `TextInput.tsx` was created**;
`forms/inputs/index.ts` barrel updated. All gates pass.

---

### Step 5 — Consolidate Select variants

Current state (8 variants from UX2-R2): `InlineSelect`, `CompletionStateSelect`, and others in
`src/ui/forms/selects/`.

```bash
ls src/ui/forms/selects/
```

Goal: unify into `src/ui/forms/selects/Select.tsx` with variant and size props covering all current
consumer needs. Unlike Input/Badge/etc., **there is no existing `Select` atom**, so creating
`Select.tsx` here is legitimate — it is a **form-control adapter/wrapper, not a base atom competing
with `src/ui/atoms/*`**. It lives in `forms/selects/`, not `atoms/`.

Steps:
1. Audit each select file for unique behavior (controlled vs uncontrolled, option rendering, icons)
2. Create `src/ui/forms/selects/Select.tsx` with unified API
3. Migrate consumers
4. Delete variant files

Special handling: `CompletionStateSelect` may be domain-specific (renders completion state options).
If it's a domain-specific select, it may stay as a thin wrapper around `Select.tsx`.
A select that needs a fully custom option renderer is not a duplicate — it can stay.

```bash
npm run typecheck
npm run lint
```

Acceptance: `src/ui/forms/selects/` reduced to ≤3 files. All gates pass.

---

### Step 6 — Consolidate Toggle/Tab variants

UX2-R2 identified a Toggle/Tab duplication group: `ToggleGroup.tsx` (already in `src/ui/atoms/`),
`IslandToggleButton.tsx`, `ViewTabSwitcher`, and inline tab patterns.

```bash
cat src/ui/atoms/ToggleGroup.tsx | head -40
grep -rn "IslandToggleButton\|ViewTabSwitcher" src/ --include="*.tsx" | head -20
```

If `ToggleGroup` doesn't already support the island toggle and tab patterns:
- Extend `ToggleGroup` with `variant: 'tabs' | 'buttons' | 'island'` prop
- Migrate `IslandToggleButton` consumers to `ToggleGroup variant="island"`
- Delete `IslandToggleButton.tsx` if 0 consumers remain

If the components serve meaningfully different purposes (e.g., toggle group is stateful, island button
is always visual-only), document why consolidation was rejected and skip.

```bash
npm run typecheck
npm run lint
npm run test
```

Acceptance: Toggle/Tab group consolidated or documented as intentionally separate. Gates pass.

---

### Step 7 — Consolidate GlassSurface variants

UX2-R2 identified a Glass duplication group: 9 files using the glass surface pattern with slightly
different radius/intensity values.

```bash
grep -rn "glass\|Glass\|backdrop-blur" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules\|test" | head -20
cat src/ui/surfaces/GlassSurface.tsx
```

Goal: ensure `GlassSurface.tsx` supports `radius` and `intensity` props so consumers don't
need to override or duplicate the glass styling.

Steps:
1. Add `radius: 'sm' | 'md' | 'lg'` and `intensity: 'low' | 'medium' | 'high'` props to `GlassSurface.tsx`
2. Update the ~9 glass-pattern consumers (re-grep — discovery counted 9 at v0.3.2; ~8 live) to use
   `<GlassSurface radius="..." intensity="...">`
3. Remove inline glass CSS from those files
4. For radius, map the props to the existing `--radius-*` CSS vars (e.g. `rounded-[var(--radius-md)]`
   or a native Tailwind radius). **Do not** use `rounded-dcx-*` — P1 does not create radius utilities
   (radius arbitrary usage is 0; see the P1 scope-boundary table).

**Carry-forward (core.md §27 — reuse P1's structure, do NOT re-hardcode):**
- Glass/surface **colors** already have dedicated tokens P1 created in `src/brand/styles/tokens.css`:
  `--theme-glass-bg`, `--theme-component-surface-glass-dark`, `--theme-component-surface-nav/pill/header/editor`,
  `--theme-component-border-*`. Reuse `var(--theme-*)` — never reintroduce a raw `rgba(...)` literal.
- If any glass/surface styling lives in a **global CSS class**, it now lives in
  `src/brand/styles/components.css` (NOT the old monolithic `index.css`, which is a 10-line entry).
  Edit `components.css`; do not recreate a CSS file or move rules back into `index.css`.

```bash
npm run typecheck
npm run lint
# Prove no raw color literal was introduced into the glass surfaces or components.css:
grep -nE "rgba?\(|#[0-9A-Fa-f]{3,8}" src/ui/surfaces/GlassSurface.tsx src/brand/styles/components.css
```

Acceptance: All glass surface patterns use `GlassSurface`; colors are `var(--theme-*)` tokens (0 new
raw literals); any global glass CSS edited in `styles/components.css`. No inline `backdrop-blur` + glass combinations.

---

### Step 7b — Verify the Chip atom (no extraction needed)

UX2-R3 recommended a `<Chip>` extraction, but `src/ui/atoms/Chip.tsx` **already exists** (created
2026-06-25, exported from `atoms/index.ts`). Do not re-extract it.

```bash
ls src/ui/atoms/Chip.tsx
grep -rn "pill\|rounded-full" src/ --include="*.tsx" | grep -v "node_modules\|test\|atoms/Chip" | head
```

Confirm pill-shaped consumers either already use `Chip` or are intentionally bespoke; record the
finding in the output (avoids a future agent re-extracting an atom that exists). If a pill consumer
duplicates Chip's styling inline, point it at `Chip` from `@/ui/atoms`.

Acceptance: Chip atom confirmed present; pill consumers reconciled-or-documented. No new Chip created.

---

### Step 8 — Full gate check + output

```bash
npm run typecheck
npm run lint
npm run validate:architecture
npm run test
```

Browser verify (executable):
```bash
npm run dev   # serves http://localhost:3000 (per vite.config.ts)
```
Using Playwright (`baseURL: http://localhost:3000`) or the `chrome-devtools` MCP, open the builder
at **1440×900 and 1920×1080** (builder is 1440px–4K; the full 1440/1920/2560 polish gate is P5) and
confirm each consolidated component renders, capturing console output and a screenshot per check:
- Badge components render correctly in MetadataIsland
- Input components render in TaskEditor
- Select components render in task creation flow
- Toggle/tab components render in the header/island areas
- Record the console-error count (target: 0 — list any errors). A console error fails the gate.
- Save/describe a screenshot of each consolidated surface as the P2 regression evidence.

**Tooling fallback (core.md §28).** Playwright Chromium is currently missing in this env (see README
carry-forward "documented debt"). If the screenshot path is unavailable: run dev-smoke
(`npm run dev` + confirm HTTP 200 + capture console), mark the **screenshot gate
`BLOCKED — Playwright unavailable`**, and record it as `PASS WITH DOCUMENTED DEBT` — do NOT fake a
screenshot. The console-error check still applies via the dev-smoke path.

Note: this is a per-component spot-check with evidence. The systematic visual polish gate across
all three viewports (1440/1920/2560), with the full visual acceptance spec, is **P5**.

Write output to `docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md`:

```markdown
# P2 — Component Consolidation Output
Date: {date} | Agent: {agent}

## Session Environment
{build-current-state.sh + verify-tooling-state.sh output}

## Deleted orphans
{list 10 files deleted}

## Consolidated components
| Before | Reconciled onto | New atom created? | Consumers updated |
|--------|-----------------|-------------------|-------------------|
| Input variants | `atoms/Input.tsx` (existing) | No | N |
| Select variants | `forms/selects/Select.tsx` (new — no Select atom existed) | New consolidation | N |
| Badge variants | `atoms/Badge.tsx` (existing) | No | N |
| Toggle/Tab | `atoms/ToggleGroup.tsx` (existing) | No | N |
| Glass patterns | `surfaces/GlassSurface.tsx` (existing) | No | N |
| Chip (pills) | `atoms/Chip.tsx` (existing) | No — verify only | N |

## Barrel updates
{list each index.ts re-export line removed alongside a deleted file}

## Skipped consolidations (if any)
{list any consolidation that was skipped with reason}

## Gate results
{typecheck/lint/arch/test/browser status}
```

---

### Step 9 — Continuity wiring (final step, MANDATORY — core.md §27)

Update the README `## Carry-forward contract — current structural state` section with everything P2
changed, so it wires forward to **all** later sprints (P3/P4/P5), not just the next one:
- Orphans deleted (10 files) + barrel lines removed.
- Which atoms now carry which variants (`atoms/Input`, `atoms/Badge`, `atoms/ToggleGroup`), the new
  `forms/selects/Select.tsx` consolidation, and any glass-token reuse in `styles/components.css`.
- Any consolidation skipped/deferred + reason; any new documented debt.

**P2 is not closeable until this update is written** (sprint-level close requires it — `dcx-sprint-close`).

---

## Acceptance criteria

- [ ] `## Session Environment` recorded from both agent scripts in the output
- [ ] 10 dead orphaned component files deleted **and their barrel `index.ts` re-export lines removed**
- [ ] **No new base `TextInput.tsx` created** — Input consumers reconciled onto existing `atoms/Input.tsx`
- [ ] `atoms/Chip.tsx` verified (not re-extracted); pill consumers reconciled-or-documented
- [ ] `src/ui/forms/inputs/` ≤ 2 files
- [ ] `src/ui/forms/selects/` ≤ 3 files
- [ ] `src/ui/atoms/Badge.tsx` handles all badge variants (existing atom extended, not recreated)
- [ ] `src/ui/atoms/ToggleGroup.tsx` handles toggle/tab patterns
- [ ] `src/ui/surfaces/GlassSurface.tsx` has `radius` + `intensity` props (radius maps to `--radius-*`, not `rounded-dcx-*`)
- [ ] Glass/surface colors reuse `var(--theme-*)` tokens (incl. P1's `--theme-component-surface-*`); **0 new raw `rgba(...)`/hex** in `GlassSurface.tsx` or `styles/components.css`; any global glass CSS edited in `styles/components.css` (not `index.css`)
- [ ] All gates pass (typecheck run after each delete batch — no barrel break)
- [ ] Browser: dev server on port 3000, each consolidated surface checked at 1440 + 1920, console-error count 0 — **or** screenshot gate `BLOCKED — Playwright unavailable` + dev-smoke fallback (core.md §28), recorded as PASS WITH DOCUMENTED DEBT
- [ ] No visual regressions in browser (systematic 3-viewport polish gate deferred to P5)
- [ ] **Step 9 done:** README carry-forward contract updated with what P2 changed (core.md §27) — P2 is not closeable without it
