# P5 — Frontend System Readiness Output

Date: 2026-06-28 | Agent: Codex

## Status

In progress. Step 0 is complete.

## Session Environment

### build-current-state.sh

```json
{
  "_generated_at": "2026-06-28T10:04:55.682435+00:00",
  "_note": "Non-authoritative snapshot. Do not edit manually. Regenerate: bash scripts/agent/build-current-state.sh",
  "repository_version": "v0.3.4",
  "package_version": "0.2.0",
  "metadata_version": "v0.3.3",
  "active_plans": [
    {
      "name": "folder-structure-v2",
      "sprint_files": []
    }
  ],
  "latest_log": {
    "date": "2026-06-28",
    "agent": "Claude (Codex)",
    "folder": "2026-06-28-opencode/",
    "status": "Completed"
  },
  "open_questions_count": 0,
  "available_scripts": [
    "dev",
    "build",
    "typecheck",
    "lint",
    "validate:architecture",
    "scan:semgrep",
    "test",
    "test:watch",
    "test:e2e",
    "test:e2e:ui",
    "inspect:react",
    "verify:frontend",
    "generate:code-index",
    "storybook",
    "build-storybook"
  ],
  "mcp_configured": [
    "eslint",
    "storybook",
    "shadcn",
    "semgrep",
    "sonarqube"
  ],
  "mcp_operational": [
    "eslint"
  ],
  "mcp_awaiting_external_setup": [
    "storybook",
    "shadcn",
    "semgrep",
    "sonarqube"
  ],
  "code_index_stale": true,
  "code_index_age_minutes": 2196,
  "git_branch": "unknown",
  "uncommitted_changes": 0,
  "documentation_contradictions": [
    "docs/VERSION.md=v0.3.4 vs metadata.json=v0.3.3"
  ],
  "validation_scripts": [
    "scripts/agent/verify-plan-state.sh",
    "scripts/agent/verify-version-state.sh",
    "scripts/agent/verify-log-claims.sh <log>",
    "scripts/agent/verify-tooling-state.sh",
    "scripts/agent/verify-frontend.sh",
    "scripts/agent/code-query.sh help"
  ]
}
```

### verify-tooling-state.sh

```json
{
  "npm_script_typecheck": {
    "status": "available"
  },
  "npm_script_lint": {
    "status": "available"
  },
  "npm_script_test": {
    "status": "available"
  },
  "npm_script_build": {
    "status": "available"
  },
  "npm_script_validate_architecture": {
    "status": "available"
  },
  "npm_script_test_e2e": {
    "status": "available"
  },
  "npm_script_verify_frontend": {
    "status": "available"
  },
  "npm_script_generate_code-index": {
    "status": "available"
  },
  "npm_script_inspect_react": {
    "status": "available"
  },
  "verify_sh": {
    "status": "pass",
    "output": "verify passed"
  },
  "dependency_cruiser": {
    "status": "available"
  },
  "semgrep_cli": {
    "status": "not_installed",
    "setup": "brew install semgrep"
  },
  "playwright_test": {
    "status": "available"
  },
  "e2e_tests_exist": {
    "status": "no_tests_written"
  },
  "storybook": {
    "status": "installed",
    "setup": null
  },
  "code_index": {
    "status": "stale",
    "age_minutes": 2197,
    "regenerate": "npm run generate:code-index"
  },
  "code_index_stale": true,
  "code_index_age_minutes": 2197,
  "mcp_configured": [
    "eslint",
    "storybook",
    "shadcn",
    "semgrep",
    "sonarqube"
  ],
  "mcp_active": [
    "eslint"
  ],
  "mcp_awaiting_setup": [
    "storybook",
    "shadcn",
    "semgrep",
    "sonarqube"
  ]
}
```

## P4 Audit Read

Read `docs/plans/active/folder-structure-v2/output-review/P4-backend-readiness-review.md`.

Verdict: P4 accepted, gate-clean, P5 ready to start. Important carry-forward nuance: editor day-note/local draft storage is UI-local today; if the PO considers it app data, schedule it for the follow-up production/backend plan rather than P5.

## Step 0 Live Checks

- Version: `docs/VERSION.md` current is `v0.3.4`, matching P5 `version_context`.
- MCP operational in this Codex session: ESLint only.
- MCP awaiting setup: Storybook, shadcn, Semgrep, SonarQube.
- Playwright test runner: available; no checked-in e2e tests.
- `components.json`: present; shadcn style `radix-nova`, `cssVariables: true`, `baseColor: neutral`, icon library `lucide`, alias `ui -> @/ui/shadcn`.
- Storybook: installed; `.storybook/main.ts` and `.storybook/preview.tsx` exist.
- `src/ui/shadcn/`: contains `button.tsx`.
- Feature imports of `@/ui/shadcn/*` outside `src/ui/`: 0.
- Quarantined `impeccable` skill: not used.

## Carry-Forward Inputs Read

- `docs/plans/active/folder-structure-v2/README.md`
- `docs/plans/active/folder-structure-v2/output/P1-token-system.md`
- `docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md`
- `docs/plans/active/folder-structure-v2/output/P3-structure-quality.md`
- `docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md`

Key facts:
- Reuse current `src/ui/atoms`, `src/ui/forms`, and `src/ui/surfaces`; do not recreate base primitives.
- `src/ui/shadcn/button.tsx` and `src/stories/Button.stories.ts` are pre-P5 scaffolding and must not be deleted.
- P5 governs component sourcing and visual baseline; it does not move shells/components or alter feature behavior.
- P4 left the backend mock API seam complete; P5 is independent of backend integration.

## Component Inventory

Completed Step 1. Consumer counts are live JSX tag matches in `src/**/*.tsx`, excluding the component's own definition file where applicable.

| Path | Role | Prop contract summary | Consumers |
|------|------|-----------------------|-----------|
| `src/ui/BuilderBg/BuilderBg.tsx` | surface/background | `selectedNodeIds?: string[]` | 2 |
| `src/ui/BuilderBg/LightRays.tsx` | surface/background effect | ray origin/color/speed/spread/length, pulse/fade/saturation/followMouse/noise/distortion, `selectedNodeIds?` | 1 |
| `src/ui/DividerLine.tsx` | atom | `orientation?: horizontal | vertical` | 6 |
| `src/ui/PopoverShell.tsx` | surface/shell | `children`, `className?`, `width?` | 3 |
| `src/ui/StickyPopupShell.tsx` | surface/shell | `isOpen`, `onClose`, optional minimize/title/children/className/style | 7 |
| `src/ui/atoms/Badge.tsx` | atom | `children`, `variant?: default/status/readiness/lock`, `color?`, `size?: xs/sm`, `className?` | 1 |
| `src/ui/atoms/Chip.tsx` | atom | button/span chip with label/icon/variant/size/active/disabled/draggable/aria props plus button attrs | 6 |
| `src/ui/atoms/Input.tsx` | atom/form-control | input/textarea with `as`, `size`, `variant`, `label`, `error`, `rows`, `onChange` plus input attrs | 7 |
| `src/ui/atoms/ToggleGroup.tsx` | atom/form-control | generic `items`, `value`, `onChange`, `size?`, `className?`, `ariaLabel?` | 4 |
| `src/ui/auth/LoginRedirect.tsx` | domain-component | no props | 1 |
| `src/ui/auth/NoAccessScreen.tsx` | domain-component | no props | 1 |
| `src/ui/auth/RouteGuard.tsx` | domain-component | `dcxId`, `children` | 1 |
| `src/ui/forms/date/CalendarGrid.tsx` | form-control/date subcomponent | `currentDate`, `isDark`, `value`, `anchorDateStr`, current-date/select callbacks | 1 |
| `src/ui/forms/date/CommunicationDateField.tsx` | form-control/domain wrapper | `value`, `onChange`, `anchorDateStr`, optional label/link mode/disabled/triggerStyle | 2 |
| `src/ui/forms/date/DatePickerPopup.tsx` | form-control/popover wrapper | `value`, `onChange`, `onClose`, `anchorDateStr`, `showLinkMode?` | 1 |
| `src/ui/forms/date/DatePickerToggle.tsx` | form-control/date subcomponent | `mode`, `onModeChange`, `showLinkMode?` | 1 |
| `src/ui/forms/date/LinkedDateGrid.tsx` | form-control/date subcomponent | linked-date value/anchor/week counts/theme and selection callbacks | 1 |
| `src/ui/forms/inputs/ListInputLines.tsx` | form-control/compound input | `id`, `items`, `onChange`, optional placeholder/label | 1 |
| `src/ui/forms/inputs/SpecsInput.tsx` | form-control/compound input | `id`, metric label/value, label/value callbacks, placeholders/title | 1 |
| `src/ui/forms/selects/CompletionStateSelect.tsx` | domain-component/form-control | `label`, `value?`, `onChange`, `placeholder?` for `ApiFieldCompletionState` | 2 |
| `src/ui/forms/selects/Select.tsx` | form-control | `id`, `value`, `options`, `onChange`, quick-add/placeholder/className/disabled | 6 |
| `src/ui/motion/EffectLayer.tsx` | wrapper/motion | `effect`, `active`, `className?`, `children` | 4 |
| `src/ui/shadcn/button.tsx` | raw-library-primitive | shadcn `Button` props via `React.ComponentProps<'button'>`, variants, `asChild?` | 0 app consumers; storybook sample only |
| `src/ui/surfaces/GlassSurface.tsx` | surface | children, dimensions, radius/intensity/variant, class/backdrop/opacity/background controls | 3 |

Step 1 source checks:
```text
find src/ui -name "*.tsx" | sort
24 TSX files

src/ui/atoms: Badge, Chip, Input, ToggleGroup
src/ui/forms/inputs: ListInputLines, SpecsInput
src/ui/forms/selects: CompletionStateSelect, Select
src/ui/surfaces: GlassSurface
src/ui/shadcn: button.tsx
```

## Source Decision Matrix

Completed Step 2. Durable policy: `docs/product/component-source-policy.md`.

| Component need | Source | Why | Where it lives |
|---|---|---|---|
| Brand-owned visual atom (`Badge`, `Chip`, `Input`, `ToggleGroup`) | Custom | Carries DCX tokens, glass/surface treatment, and compact builder density. | `src/ui/atoms/` |
| Brand-owned surface (`GlassSurface`, popover/shells, builder background) | Custom | The visual system is a DCX differentiator and maps to `--theme-*` tokens. | `src/ui/surfaces/`, `src/ui/`, `src/ui/BuilderBg/` |
| Compound form controls | Custom wrapper over shared primitive | Contains builder/domain behavior, not just generic visuals. | `src/ui/forms/` or feature-owned folders |
| Generic primitive with heavy a11y/focus behavior (`Dialog`, `Popover`, `Combobox`, `Command`, `Tooltip`) | shadcn behind DCX adapter | Focus management, keyboard behavior, aria state, and positioning are expensive to own. | Raw: `src/ui/shadcn/`; adapter: `src/ui/<role>/` |
| Domain control | Custom wrapper over a shared primitive | Domain state and wording are product behavior. | Feature folder or `src/ui/forms/` if shared |

Adapter seam location: `src/ui/PopoverShell.tsx`.

shadcn state:
- Installed/configured via `components.json`
- style `radix-nova`
- alias `ui -> @/ui/shadcn`
- current `src/ui/shadcn/` contents: `button.tsx`
- feature imports of `@/ui/shadcn/*` outside `src/ui/`: 0

Named first shadcn candidates: `Dialog`, `Popover`, `Combobox` / `Command`, `Tooltip`.

Rules recorded:
- Feature code imports adapters, never raw `@/ui/shadcn/*`.
- The adapter file is the swap seam.
- Custom remains default for brand atoms and surfaces.

## Adapter Seam

Step 3 established the live adapter seam in `src/ui/PopoverShell.tsx`.

Contract preserved:
- `children: React.ReactNode`
- `className?: string`
- `width?: string`
- default width remains `w-auto`
- feature imports continue to target `@/ui/PopoverShell`

Runtime behavior changed: no.

Comment added at `src/ui/PopoverShell.tsx:4`:
- Feature code should keep importing `PopoverShell`.
- Future shadcn/MCP popover primitives must stay behind the existing `children` / `className` / `width` contract.

Step 3 gate result:
- `npm run typecheck`: PASS
- `npx eslint src/ui/PopoverShell.tsx --max-warnings 0`: PASS
- `npm run lint`: FAIL, known repo backlog remains at 119 problems (114 errors, 5 warnings); no finding was reported for `src/ui/PopoverShell.tsx`.

## Product Requirements Implemented

Step 4 implements the Builder V1 visual quality-gate definition from `docs/product/requirements/builder/acceptance-criteria.md#quality-gates`.

Quality gates: no requirement ID assigned in source doc.

## Visual Acceptance Spec

This spec was written before screenshot capture. Step 5 screenshots must be judged against this section.

Hard gate:
- Typography: 0 remaining `text-[var(--text-*)]` arbitrary patterns in `src`; live check returned 0 matches.
- Rendered JSX raw hex: 0 raw hex color literals in app-rendered source after excluding token-definition files and Storybook samples; live check returned 0 matches.
- No clipping/overlap: at 1440, 1920, and 2560 desktop widths, visible Builder UI text must not be clipped, overlapped, or unreadably truncated by its parent layout.
- Light/dark mode: both supported theme states must render with readable contrast. If the live app exposes no reachable theme toggle during Step 5, record that limitation and verify the current rendered theme honestly.
- Console health: Step 5 must record browser console errors. Any console error is a polish-gate failure unless documented as pre-existing and explicitly handed off.

Accepted by policy, not a P5 failure:
- Theme-reactive arbitrary color/border/ring variables using `[var(--theme-*)]`; live count is 297.
- Arbitrary shadows; live `shadow-[...]` count is 58.
- Arbitrary radii; live `rounded-[...]` count is 11.
- Arbitrary layout sizing (`w/h/min/max-*-[...]`); live count is 182.
- Native Tailwind spacing scale remains valid. There is no spacing-token product decision; live `m-[var()]` / `p-[var()]` / `gap-[var()]` count is 0.

Policy note: do not fail P5 on retained arbitrary theme variables, shadows, radii, or layout sizes. If screenshots reveal a genuine visual irregularity in these categories, log it as a polish follow-up unless it causes clipping, overlap, unreadable contrast, or another hard-gate failure.

## Polish-Gate Evidence

Step 5 browser route:
- Dev server: `npm run dev -- --host 127.0.0.1`
- URL tested: `http://127.0.0.1:3000/builder/v-1`
- Browser path: in-app browser control skill
- Screenshot folder: `docs/plans/active/folder-structure-v2/output/evidence/P5-polish-baseline/`
- Theme toggle found: yes

Evidence status: ACCEPTED after P6 review.

P6 resolution: the missing editor-panel screenshot was a verification-path false alarm, not a regression. The collapsed `Open Editor` control is intentionally disabled and titled `Drag task here to edit`; it is a drop hint, not a clickable opener. The editor expands when `activeNode` and `draftData` exist, and the supported paths set focus through drag/drop onto the editor island or long-press on a task. Existing post-P3 evidence proves the open editor state: `output/evidence/p3-editor-open.png` and `output/evidence/task-editor-input.png`.

| Viewport | Dark screenshot | Light screenshot | Console errors | Visual judgment |
|---|---|---|---:|---|
| 1440x900 | `output/evidence/P5-polish-baseline/builder-1440x900-dark.png` | `output/evidence/P5-polish-baseline/builder-1440x900-light.png` | 0 dark / 0 light | PASS for MetadataIsland + Builder stage + Kanban + selection controls; no viewport overflow. Editor panel evidence accepted via P3/P6 code-path proof. |
| 1920x1080 | `output/evidence/P5-polish-baseline/builder-1920x1080-dark.png` | `output/evidence/P5-polish-baseline/builder-1920x1080-light.png` | 0 dark / 0 light | PASS for captured surfaces; no viewport overflow. Editor panel evidence accepted via P3/P6 code-path proof. |
| 2560x1440 | `output/evidence/P5-polish-baseline/builder-2560x1440-dark.png` | `output/evidence/P5-polish-baseline/builder-2560x1440-light.png` | 0 dark / 0 light | PASS for captured surfaces; no viewport overflow. Editor panel evidence accepted via P3/P6 code-path proof. |

Automated DOM notes:
- Browser-reported page viewport overflow: false at all three viewport sizes.
- Sampled overflow text includes visually-hidden accessibility labels for the Kanban/Timeline toggle and readiness indicators; these are not visible clipping failures.
- Date tile text `1 Jul` reports scroll-height overflow in the DOM sample at 1440 and 1920, but visual inspection shows a deliberately compact stacked date marker. Treat as accepted-by-policy unless the polish agent wants to redesign the date chip.
- No console errors were recorded.

Original P5 manual interaction attempts for editor evidence:
- Select phase at stage center: selection controls appear; `Open Editor` remains disabled.
- Click nested task marker: no editor opening.
- Expand selected phase: action/task structure appears; `Open Editor` remains disabled.
- Focus action textbox `Click to edit action name`: active state appears; `Open Editor` remains disabled.
- Double-click action textbox: no editor opening; `Open Editor` remains disabled.

P6 interpretation: those attempts targeted unsupported editor-opening paths. The disabled `Open Editor` hint staying disabled is expected behavior.

## Step 6 Remediation Decision

No source remediation was applied.

Reason:
- Step 4 token hard gates pass: typography arbitrary text vars 0; app-rendered raw hex 0.
- Step 5 console hard gate passes: 0 errors.
- Step 5 viewport overflow hard gate passes: false at all three viewport sizes.
- The remaining blocker is missing editor-panel evidence because `Open Editor` stays disabled in the reachable Builder state. P5 Step 6 only permits token/spacing hard-gate fixes; it does not authorize speculative feature behavior changes to force the editor open.

Carry-forward:
- No P5 editor regression remains. Future visual baselines should use drag/drop or long-press to open the editor, not the disabled hint button.

## Gate Results

Step 0:
- `verify.sh`: PASS via `verify-tooling-state.sh`
- Code gates: not applicable yet, no source behavior changed
- Browser/MCP: not run in Step 0

Step 3:
- `npm run typecheck`: PASS
- `npx eslint src/ui/PopoverShell.tsx --max-warnings 0`: PASS
- `npm run lint`: FAIL, known 119-problem lint backlog; no new touched-file finding

Step 4:
- Visual acceptance spec written before screenshots: PASS
- `rg -n "text-\[var\(--text-" src --glob "*.tsx" --glob "*.ts" --glob "*.css"`: PASS, 0 matches
- `rg -n "#[0-9a-fA-F]{3,8}\b" src --glob "*.tsx" --glob "*.ts" --glob "*.css" --glob "!src/brand/**" --glob "!src/stories/**"`: PASS, 0 app-rendered matches
- Accepted-by-policy live counts: `[var(--theme-*)]` 297; `shadow-[...]` 58; `rounded-[...]` 11; layout sizing 182; var spacing 0

Step 5:
- Dev server: PASS, Vite served `http://127.0.0.1:3000/`
- Builder route: PASS, `http://127.0.0.1:3000/builder/v-1`
- Console errors: PASS, 0 at 1440 / 1920 / 2560 in dark and light states
- Screenshot files: PASS, 6 files saved
- Viewport overflow: PASS, false at 1440 / 1920 / 2560
- Required editor-panel evidence: RESOLVED in P6 as verification-path false alarm; P3 editor-open screenshots cited

Step 6:
- Source remediation: NOT APPLIED
- Reason: no token/color/spacing hard-gate source defect found; editor evidence issue later resolved as verification-path false alarm

Step 7:
- `npm run typecheck`: PASS
- `npm run validate:architecture`: PASS, no dependency violations found (264 modules, 528 dependencies cruised)
- `npm run test`: PASS, 6 files / 27 tests
- `npm run lint`: FAIL, known lint backlog remains 119 problems (114 errors, 5 warnings)
- Browser evidence: ACCEPTED after P6 review; screenshots captured and editor-open state covered by P3 evidence/code-path proof

Step 7 status: PASS WITH DOCUMENTED DEBT. Remaining debt is repo lint backlog, not P5 visual governance.

Step 8:
- README carry-forward updated: PASS
- Plan move to completed: NOT DONE
- Reason: P6 closeout sprint was inserted before archive to handle lint/doc/agent coherence

Final P5 status: governance complete, visual baseline accepted after P6 review. Plan remains active for P6 closeout only.
