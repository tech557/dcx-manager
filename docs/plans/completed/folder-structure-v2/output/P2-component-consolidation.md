# P2 — Component Consolidation Output
Date: 2026-06-27 | Agent: Codex

Status: Completed with documented debt (Tasks 0–10 done; browser-evidence debt closed 2026-06-27).
<!-- Corrected 2026-06-27: header previously read "In progress" while the sprint frontmatter and Task 10
     recorded a PASS WITH DOCUMENTED DEBT close — reconciled by P1-P2-final-audit. -->

## Execution Method

P2 is being executed as incremental task slices. After each completed task, Codex updates this output,
updates the P2 sprint file, and writes a dedicated progress log before moving to the next task.

## Session Environment

build-current-state.sh:
```text
repository_version: v0.3.4
package_version: 0.2.0
metadata_version: v0.3.3
active_plans: [folder-structure-v2]
mcp_operational: [eslint]
mcp_awaiting: [storybook, shadcn, semgrep, sonarqube]
code_index_stale: true (916 min)
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
code_index: stale (916 min)
MCP active: eslint
MCP awaiting: storybook, shadcn, semgrep, sonarqube
```

## Task 0 — Session + Methodology

Completed:
- Read P2 sprint file.
- Read README carry-forward contract.
- Read P1 output and confirmed P1 is completed with documented debt.
- Read `dcx-frontend-refactor` canonical skill from `agent-skills/dcx-frontend-refactor/SKILL.md`.
- Confirmed existing atom targets:
  - `src/ui/atoms/Badge.tsx`
  - `src/ui/atoms/Chip.tsx`
  - `src/ui/atoms/Input.tsx`
  - `src/ui/atoms/ToggleGroup.tsx`
- Confirmed P2 output file exists and incremental logging method is recorded in the sprint file.

Carry-forward facts for P2:
- Reuse existing atoms; do not create competing base primitives.
- Use `text-dcx-*`; do not reintroduce `text-[var(--text-*)]`.
- Global component CSS lives in `src/brand/styles/components.css`.
- Component CSS colors must use `--theme-*` tokens, including P1's `--theme-component-*` family.

## Task Logs

| Task | Status | Log |
|---|---|---|
| Task 0 — Session + methodology | Completed | `docs/progress/sessions/2026-06-27-codex/13-P2-task0-session-methodology.md` |
| Task 1 — Orphan verification | Completed | `docs/progress/sessions/2026-06-27-codex/14-P2-task1-orphan-verification.md` |
| Task 2 — Orphan deletion | Completed | `docs/progress/sessions/2026-06-27-codex/15-P2-task2-orphan-deletion.md` |
| Task 3 — Badge reconciliation | Completed | `docs/progress/sessions/2026-06-27-codex/16-P2-task3-badge-reconciliation.md` |
| Task 4 — Input reconciliation | Completed | `docs/progress/sessions/2026-06-27-codex/17-P2-task4-input-reconciliation.md` |

## Task 1 — Orphan Verification Before Deletion

Ran live grep plus `code-query.sh consumers` for the 10 deletion candidates.

| Candidate | Status | Evidence |
|---|---|---|
| `src/ui/LockBadge.tsx` | Confirmed dead | Only definition found; code-index reports no usages. |
| `src/ui/StatusBadge.tsx` | Confirmed dead | Only definition found; code-index reports no usages. |
| `src/builder/cards/FieldIndicator.tsx` | Confirmed dead | Only component definition found; `src/types/card.types.ts` hit is an unrelated interface/type collision. |
| `src/ui/forms/inputs/DateInputTBD.tsx` | Confirmed dead after barrel removal | Definition + `src/ui/forms/inputs/index.ts` re-export only. |
| `src/ui/forms/inputs/DualInput.tsx` | Confirmed dead after barrel removal | Definition + `src/ui/forms/inputs/index.ts` re-export only. |
| `src/ui/forms/inputs/TextInputSmall.tsx` | Confirmed dead after barrel removal | Definition + `src/ui/forms/inputs/index.ts` re-export only. |
| `src/ui/forms/selects/SearchableSelect.tsx` | Confirmed dead after barrel removal | Definition + `src/ui/forms/selects/index.ts` re-export only. |
| `src/ui/forms/selects/SearchableSelectIcons.tsx` | Confirmed dead after barrel removal | Definition + `src/ui/forms/selects/index.ts` re-export only. |
| `src/builder/cards/templates/day/DayCard.tsx` | Confirmed dead | Only definition found; code-index reports no usages. |
| `src/ui/ReadinessBadge.tsx` | Not safe for blind deletion | `src/builder/cards/templates/phase/PhaseReadinessBadge.tsx` re-exports it; real consumers use `PhaseReadinessBadge` in `PhaseCard`, `DayGridCard`, and `DayGridCardCollapsed`. Migrate this alias in Task 3 before deleting. |

Task 2 deletion scope: delete the 9 confirmed-dead files and their barrel lines. `ReadinessBadge.tsx`
is deferred to Task 3 Badge reconciliation.

## Task 2 — Delete Confirmed Dead Orphans

Deleted 9 confirmed-dead files:
- `src/ui/LockBadge.tsx`
- `src/ui/StatusBadge.tsx`
- `src/builder/cards/FieldIndicator.tsx`
- `src/ui/forms/inputs/DateInputTBD.tsx`
- `src/ui/forms/inputs/DualInput.tsx`
- `src/ui/forms/inputs/TextInputSmall.tsx`
- `src/ui/forms/selects/SearchableSelect.tsx`
- `src/ui/forms/selects/SearchableSelectIcons.tsx`
- `src/builder/cards/templates/day/DayCard.tsx`

Also removed:
- `src/builder/cards/templates/day/.gitkeep`
- empty folder `src/builder/cards/templates/day/`

Barrel updates:
- `src/ui/forms/inputs/index.ts`: removed `DateInputTBD`, `DualInput`, `TextInputSmall`.
- `src/ui/forms/selects/index.ts`: removed `SearchableSelect`, `SearchableSelectIcons`.

Batch verification:
```text
Batch 1 (LockBadge, StatusBadge, FieldIndicator, DayCard): typecheck PASS
Batch 2 (DateInputTBD, DualInput, TextInputSmall + input barrel): typecheck PASS
Batch 3 (SearchableSelect, SearchableSelectIcons + select barrel): typecheck PASS
Final Task 2 typecheck after day folder cleanup: PASS
```

Remaining known grep hit:
```text
src/types/card.types.ts:22:export interface FieldIndicator
```
This is the expected type-name collision, not the deleted component.

`ReadinessBadge.tsx` is still present intentionally and deferred to Task 3 because `PhaseReadinessBadge`
currently re-exports it for real consumers.

## Task 3 — Badge Reconciliation

Completed:
- Extended existing `src/ui/atoms/Badge.tsx` with explicit variant names:
  - `default`
  - `status`
  - `readiness`
  - `lock`
- Migrated `src/builder/cards/templates/phase/PhaseReadinessBadge.tsx` from a re-export of
  `@/ui/ReadinessBadge` to a local builder-facing wrapper that renders the existing `Badge` atom with
  `variant="readiness"`.
- Deleted `src/ui/ReadinessBadge.tsx` after the alias migration.

Verification:
```text
npm run typecheck: PASS
rg ReadinessBadge/StatusBadge/LockBadge: only PhaseReadinessBadge references remain; no deleted ui badge component imports remain.
```

Badge status:
- The base `Badge` atom remains the reusable primitive.
- `PhaseReadinessBadge` remains as a builder/card semantic wrapper because consumers expect that domain name.

## Task 4 — Input Reconciliation

Completed:
- Extended existing `src/ui/atoms/Input.tsx` with `as="textarea"` support.
- Replaced `TextInputLarge` consumers with `Input as="textarea"`.
- Replaced the single `TextInputInline` consumer in `EditorHeader` with local edit state using the existing `Input` atom.
- Deleted `TextInputLarge.tsx` and `TextInputInline.tsx`.
- Updated `src/ui/forms/inputs/index.ts`.

Kept as genuine compound wrappers:
- `ListInputLines.tsx`
- `SpecsInput.tsx`

Verification:
```text
npm run typecheck: PASS
Old input variant grep: 0
src/ui/forms/inputs component files: 2 (`ListInputLines.tsx`, `SpecsInput.tsx`) plus `index.ts`
No new base TextInput.tsx created.
```

## Task 5 — Select Consolidation

Completed:
- Created the governed generic select control at `src/ui/forms/selects/Select.tsx`.
- Migrated `ChannelCompositionFields` from `InlineSelect` to `Select`.
- Updated segment-directory type consumers from `InlineSelectOption` to `SelectOption`.
- Deleted `src/ui/forms/selects/InlineSelect.tsx`.
- Updated `src/ui/forms/selects/index.ts`.

Kept as domain-specific:
- `CompletionStateSelect.tsx` remains because it is a completion-state segmented control with detail
  text behavior, not a duplicate dropdown.

Verification:
```text
npm run typecheck: PASS
Old select variant grep: 0
src/ui/forms/selects files: 3 (`CompletionStateSelect.tsx`, `Select.tsx`, `index.ts`)
```

## Task 6 — Toggle/Tab Consolidation

Completed review:
- `ViewTabSwitcher` already renders the existing `src/ui/atoms/ToggleGroup.tsx`.
- `PhaseEditorSection` also already renders the same `ToggleGroup` atom.
- No inline `role="tablist"` / `aria-selected` tab implementation remains in source.

Intentional non-merge:
- `IslandToggleButton` remains separate because it is a single animated island action button built on
  `Chip`, with active-icon rotation and island sizing behavior. It is not a multi-option toggle/tab
  group, so moving it into `ToggleGroup` would mix different UI roles.

Verification:
```text
npm run typecheck: PASS
Toggle/tab search: ToggleGroup consumers are ViewTabSwitcher and PhaseEditorSection; IslandToggleButton consumers are island shell action buttons.
```

## Task 7 — GlassSurface Consolidation

Completed:
- Added `radius: 'sm' | 'md' | 'lg'` and `intensity: 'low' | 'medium' | 'high'` props to
  `src/ui/surfaces/GlassSurface.tsx`.
- Mapped radius props to existing `--radius-*` variables.
- Replaced raw reflection color literals inside `GlassSurface` with existing `--theme-*` tokens.
- Updated all three live `GlassSurface` consumers to pass `radius` and `intensity`.

Consumers updated:
- `CardShellContent`
- `TaskReadOnlyPopup`
- `DeleteConfirmation`

Verification:
```text
npm run typecheck: PASS
Raw color guard on GlassSurface + styles/components.css: 0 matches
Live GlassSurface call sites: 3, all using radius/intensity props
```

Scope note:
- Broader one-off glassy classes across the builder remain for the P5 visual polish sweep. P2
  consolidated the actual reusable `GlassSurface` component without reintroducing raw surface colors.

## Task 8 — Chip Verification

Completed:
- Confirmed `src/ui/atoms/Chip.tsx` already exists and is exported.
- Confirmed existing Chip consumers:
  - `ChannelPill`
  - `MenuSections`
  - `InlineIslandButton`
  - `IslandToggleButton`
- Migrated two Chip-shaped metadata controls in `MetadataDetailsContent`:
  - duplicate-version action
  - blocked transition status

Intentionally left bespoke:
- Circular icon buttons, progress dots, switches, skeleton pills, and domain-specific quick-edit
  triggers remain outside `Chip` because they are not simple reusable chip controls.

Verification:
```text
npm run typecheck: PASS
Chip consumers after reconciliation: 6 call sites plus atom export
```

## Task 9 — Full Gates + Dev Evidence

Gate results:
```text
npm run typecheck: PASS
npx eslint touched P2 files --max-warnings 0: PASS
npm run lint: FAIL WITH DOCUMENTED DEBT — repo-wide lint debt remains at 156 problems (149 errors, 7 warnings)
npm run validate:architecture: PASS
npm run test: PASS — 6 files, 27 tests
npm run build: PASS — Vite build completed with existing chunk-size/dynamic-import warnings
```

Dev smoke:
```text
npm run dev: PASS on http://localhost:3002/ (3000 and 3001 were occupied)
curl -I http://localhost:3002/: HTTP 200 OK
```

Browser evidence:
```text
Playwright package: installed (1.61.1)
Chromium launch: BLOCKED — browser executable missing under ~/Library/Caches/ms-playwright
Screenshot gate: BLOCKED — Playwright unavailable
Console-error browser capture: BLOCKED — Playwright unavailable
```

Local lint regression check:
- The full lint count improved from the earlier known 157 problems to 156 after fixing the local
  `EditorHeader` lint regression introduced during Task 4.
- Focused lint on touched P2 files passes.

## Task 10 — Sprint Close

Carry-forward:
- Updated `docs/plans/active/folder-structure-v2/README.md` with the P2 structural facts future
  sprints must inherit.

Consolidated components summary:

| Before | Reconciled onto | New atom created? | Consumers updated |
|---|---|---:|---:|
| Badge variants | `src/ui/atoms/Badge.tsx` | No | 1 semantic wrapper |
| Input variants | `src/ui/atoms/Input.tsx` | No | 4 consumers |
| Select variants | `src/ui/forms/selects/Select.tsx` | No atom; new form-control adapter | 3 consumers/type users |
| Toggle/Tab | `src/ui/atoms/ToggleGroup.tsx` | No | 0; already consolidated |
| Glass patterns | `src/ui/surfaces/GlassSurface.tsx` | No | 3 consumers |
| Chip pills | `src/ui/atoms/Chip.tsx` | No | 2 extra consumers |

Sprint close verdict:
```text
PASS WITH DOCUMENTED DEBT
```

Close evidence:
```text
verify-plan-state: FAIL WITH DOCUMENTED DEBT — pre-existing completed builder-refactor README parse issue; active-plan sprint-folder warning is verifier limitation
verify-version-state: PASS WITH WARNING — docs/VERSION.md v0.3.4 vs metadata.json v0.3.3
verify-log-claims: PASS for Task 9 before close
verify-tooling-state: PASS for available tooling; Semgrep not installed; Playwright Chromium missing; code-index stale
verify-frontend: FAIL WITH DOCUMENTED DEBT — lint only; typecheck/verify.sh/architecture/test/build all PASS
stubs check: PASS — no boundary console.log findings
carry-forward updated: PASS
```

Documented debt:
- Full repo lint remains at 156 problems (149 errors, 7 warnings); focused lint on touched P2 files
  passes.
- Code-index is stale and should be regenerated by a future maintenance pass.

## Browser Evidence — P1+P2 Debt Close (2026-06-27)

> ⚠️ **Provenance note (added by Claude P3 audit, 2026-06-28).** Captured in an **unlogged session** —
> no session-log entry / `index.csv` row, and no agent named (presumed opencode via Playwright MCP,
> **unverified**). Screenshots relocated from repo root → `output/evidence/`. Accepted because the
> artifacts exist and gates re-verify, but the audit trail was broken — see core.md §29a.

This section closes the browser-evidence debt originally documented above as "BLOCKED — Playwright
unavailable". The Playwright Chromium binary is now available in this session (Playwright MCP
operational). All evidence captured on `http://localhost:3002/`.

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
Previous P2 gate: Browser screenshot/console — BLOCKED (Playwright Chromium missing)
Updated gate:     PASS — Playwright MCP operational; 0 console errors; 8 screenshots captured
```
