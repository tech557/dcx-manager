---
sprint: FP-R2
agent: Codex (GPT-5, OpenAI)
date: 2026-06-28
status: complete
source-sprint: FP-R2-token-audit-metrics
source-edits: none
---

# FP-R2 — Token + Hardcoded-Value Audit

## Verdict

FP-R2 is complete as a read-only discovery sprint. No `src/` files were changed.

Claude left no FP-R2 output to wipe. The only existing newer artifacts were opencode FP-R1
brandbook screenshots under `output/evidence/brandbook-impeccable/`, which are unrelated and were
left intact.

## Baseline Counts

| Metric | Count | Source / command | Notes |
|---|---:|---|---|
| Official project-script hardcoded hex count | 0 | `bash scripts/agent/code-query.sh --json hardcoded-tokens` | The script currently only reports `hardcoded_hex` as an empty array. |
| Official project-script arbitrary Tailwind count | 108 | `bash scripts/agent/code-query.sh hardcoded-tokens` | This is the sprint's primary hardcoded-token baseline. |
| Broader product color/gradient literal lines | 26 | See reproducible commands below. | Includes `rgb/rgba`, gradients, and canvas color strings outside brand. |
| Broader product arbitrary/bracket lines | 342 | See reproducible commands below. | Broad regex baseline only. This is not a required migration list and is intentionally not expanded line-by-line. |
| Storybook/demo color literal lines | 22 | See reproducible commands below. | Storybook scaffold/demo assets; keep separate from product UI baseline. Do not use the old unreproducible 44 count. |
| Old typography regression syntax | 0 | `rg 'text-\\[var\\(--text-' src` | Pass. No `text-[var(--text-*)]` regressions found. |
| `text-dcx-*` utility usages outside brand | 260 | `rg -o 'text-dcx-*' src --glob '!src/brand/**'` | Confirms typography utility migration is live. |
| `--theme-*` arbitrary bracket usages outside brand | 297 | `rg --glob '!src/brand/**' -o '\\[var\\(--theme-[^)]+\\)\\]' src` | Matches the intentionally retained P1b family closely; live count is 297, not inherited 287. |
| All `var(--theme-*)` usages outside brand | 343 | `rg --glob '!src/brand/**' -o 'var\\(--theme-[^)]+\\)' src` | Includes bracket usages plus inline style/template usages. |
| Actual unique `--theme-*` token names consumed outside brand | 35 | `rg --no-filename --glob '!src/brand/**' -o -- '--theme-[a-zA-Z0-9_-]+' src \| sort -u \| wc -l` | Token-name breadth only; not a migration count. |
| Path-sensitive `--theme-*` file/token pairs outside brand | 134 | `rg --glob '!src/brand/**' -o -- '--theme-[a-zA-Z0-9_-]+' src \| sort -u \| wc -l` | File/token pair breadth. Do not label this as unique token names. |
| Defined CSS custom properties in brand CSS | 168 | `rg --pcre2 '--token(?=\\s*:)' src/brand/styles/*.css` | Includes shadcn scaffold tokens, alias tokens, theme tokens, radius, typography. |
| Defined `--theme-*` tokens | 68 | `rg --pcre2 '--theme-*(?=\\s*:)' src/brand/styles/tokens.css` | No zero-consumer `--theme-*` tokens found. |
| Defined `--text-*` tokens | 11 | `rg --pcre2 '--text-*(?=\\s*:)' src/brand/styles/tokens.css` | All have corresponding `text-dcx-*` utility usage. |
| Zero direct literal consumers among all brand CSS vars | 88 | See reproducible loop in "Zero-direct CSS vars" below. | Mostly shadcn/Tailwind alias inputs or raw `--text-*`; not safe-delete without Tailwind build analysis. |
| Proven safe dead `--theme-*` tokens | 0 | See reproducible loop in "`--theme-*` tokens" below. | Every `--theme-*` token has at least one consumer outside `tokens.css`/`theme.css`. |

### Reproducible baseline commands

Product color/gradient literal lines:

```bash
rg '#[0-9A-Fa-f]{3,8}|rgba?\(|hsla?\(|oklch\(' src --glob '!src/brand/**' --glob '!src/stories/**' | wc -l
```

Broader product arbitrary/bracket lines:

```bash
rg '\[[^\]]*(px|rem|em|%|var\(--theme-|radial-gradient|repeating-linear-gradient|scrollbar-width)[^\]]*\]' src --glob '!src/brand/**' --glob '!src/stories/**' | wc -l
```

Storybook/demo color literal lines:

```bash
rg '#[0-9A-Fa-f]{3,8}|rgba?\(|hsla?\(|oklch\(' src/stories | wc -l
```

## High-Risk Findings For FP-R5

| Finding | Family | Evidence | Implementation note |
|---|---|---|---|
| Light-theme pure white offenders remain source-of-truth token work. | `change-token` | FP-R1 and FP-R0 both identify `--theme-surface-void` and `--theme-dropdown-bg` light values as `#FFFFFF`. | Token sprint should fix before component polish. |
| `--theme-text-secondary` remains missing from the actual token file. | `change-token` | FP-R1 critical list. | Add dark and light values in brand tokens. |
| Official arbitrary Tailwind baseline is 108. | `change-component` / `change-token` split by value type | `code-query.sh hardcoded-tokens`. | Do not convert every entry blindly; layout dimensions often need component tokens, while color/surface values belong in brand tokens. |
| P1b retained `--theme-*` arbitrary count is now 297. | governance baseline | Live `rg` count. | README carried 287 from prior work; FP-R5 should use 297 as the v0.3.5 live baseline. |
| No old `text-[var(--text-*)]` regressions. | none | `rg` returned 0. | Typography utility migration is stable. |
| Dead-token deletion should be conservative. | `change-token` only after proof | 0 dead `--theme-*`; 88 zero-direct CSS vars are mostly scaffold/alias/raw text vars. | Do not schedule broad token deletion from FP-R2 alone. |

## Hardcoded Color / Gradient Literal Lines Outside Brand

These are broader than the project script's `hardcoded_hex` field, which returned `[]`.

| File:line | Literal context | Suggested family |
|---|---|---|
| `src/builder/BuilderLoadingShell.tsx:18` | shimmer `linear-gradient(...rgba...)` | `change-token` if shimmer is retained |
| `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx:40` | shadow `rgba(0,0,0,0.15)` | `change-token` shadow alias |
| `src/builder/stage/views/DayGridCard.tsx:134` | repeating disabled gradient | `change-component` or tokenized pattern |
| `src/builder/stage/views/TimelineHourCell.tsx:60` | repeating disabled gradient | `change-component` or tokenized pattern |
| `src/builder/islands/BuilderIslandShell.tsx:54` | shadow `rgba(0,0,0,0.4)` / `rgba(0,0,0,0.06)` | `change-token` shadow alias |
| `src/builder/stage/views/DayGridCardCollapsed.tsx:73` | repeating disabled gradient | `change-component` or tokenized pattern |
| `src/builder/islands/ViewHelperIsland/ViewContextTaskList.tsx:40` | emerald shadow `rgba(16,185,129,0.05)` | `change-token` semantic shadow |
| `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx:53` | overlay shadow `rgba(0,0,0,0.6)` | `change-token` shadow alias |
| `src/builder/stage/StageEdgeNavigation.tsx:40` | emerald shadow `rgba(52,211,153,0.35)` | `change-token` semantic shadow |
| `src/ui/BuilderBg/BuilderBg.tsx:12` | radial gradient `rgba(59,130,246,0.03)` | `change-token` background accent |
| `src/ui/BuilderBg/BuilderBg.tsx:17` | `rgb(255, 255, 255)` rays color | `change-token` no-pure-white adaptation |
| `src/ui/BuilderBg/LightRays.tsx:21` | default `rgb(255, 255, 255)` | `change-token` no-pure-white adaptation |
| `src/ui/BuilderBg/LightRays.tsx:60` | fallback `rgba(117, 226, 255, 0.08)` | `change-token` alias to accent subtle |
| `src/ui/BuilderBg/LightRays.tsx:169` | dynamic `rgba(${rgb}, ...)` | runtime color builder; keep with token input |
| `src/ui/BuilderBg/LightRays.tsx:170` | dynamic `rgba(${rgb}, ...)` | runtime color builder; keep with token input |
| `src/ui/BuilderBg/LightRays.tsx:171` | dynamic `rgba(${rgb}, ...)` | runtime color builder; keep with token input |
| `src/ui/BuilderBg/LightRays.tsx:172` | dynamic `rgba(${rgb}, ...)` | runtime color builder; keep with token input |
| `src/ui/BuilderBg/LightRays.tsx:173` | dynamic `rgba(${rgb}, 0)` | runtime color builder; keep with token input |
| `src/ui/BuilderBg/LightRays.tsx:188` | focal gradient `rgba(255, 255, 255, 0.08)` | `change-token` no-pure-white adaptation |
| `src/ui/BuilderBg/LightRays.tsx:190` | focal gradient `rgba(0, 0, 0, 0)` | `change-token` no-pure-black adaptation if visible |
| `src/builder/cards/card.registry.ts:5` | `rgba(244,201,117,0.12)` warning shadow | `change-token` warning shadow alias |
| `src/builder/ui/buttons/InlineIslandButton.tsx:45` | indigo shadow `rgba(99,102,241,0.2)` | `change-token` or remove off-brand indigo |
| `src/builder/ui/buttons/InlineIslandButton.tsx:51` | multiple white/black inset shadows | `change-token` shadow aliases |
| `src/builder/ui/buttons/MenuSections.tsx:27` | inset white shadow | `change-token` shadow alias |
| `src/builder/ui/buttons/MenuSections.tsx:33` | inset white shadow | `change-token` shadow alias |
| `src/builder/ui/forms/channel/InlineChannelCompositionSelector.tsx:130` | shadow `rgba(0,0,0,0.8)` | `change-token` shadow alias |

## Official Project-Script Arbitrary Tailwind List

`bash scripts/agent/code-query.sh --json hardcoded-tokens` returned 108 arbitrary Tailwind entries.
The script truncates line snippets, but each entry includes file and line.

- `src/ui/DividerLine.tsx:6`
- `src/ui/StickyPopupShell.tsx:29`
- `src/ui/forms/selects/Select.tsx:58`
- `src/ui/forms/date/LinkedDateGrid.tsx:27`
- `src/ui/forms/date/DatePickerPopup.tsx:51`
- `src/ui/forms/inputs/ListInputLines.tsx:76`
- `src/ui/BuilderBg/LightRays.tsx:213`
- `src/ui/BuilderBg/BuilderBg.tsx:12`
- `src/builder/BuilderPage.tsx:113`
- `src/builder/BuilderPage.tsx:132`
- `src/builder/BuilderPage.tsx:154`
- `src/builder/BuilderLoadingShell.tsx:41`
- `src/builder/BuilderLoadingShell.tsx:45`
- `src/builder/BuilderLoadingShell.tsx:48`
- `src/builder/BuilderLoadingShell.tsx:51`
- `src/builder/BuilderLoadingShell.tsx:55`
- `src/builder/BuilderLoadingShell.tsx:56`
- `src/builder/BuilderLoadingShell.tsx:57`
- `src/builder/BuilderLoadingShell.tsx:58`
- `src/builder/ui/forms/channel/CompositionLibraryModal.tsx:67`
- `src/builder/ui/forms/channel/ChannelCompositionSelect.tsx:108`
- `src/builder/ui/forms/channel/ChannelCompositionSelect.tsx:204`
- `src/builder/ui/forms/subtask/QuickSubtaskForm.tsx:74`
- `src/builder/ui/buttons/InlineIslandButton.tsx:38`
- `src/builder/ui/modals/readiness-check-modal/ReadinessCheckModal.tsx:27`
- `src/builder/ui/modals/readiness-check-modal/ReadinessCheckModal.tsx:34`
- `src/builder/ui/modals/readiness-check-modal/ReadinessCheckContent.tsx:172`
- `src/builder/ui/modals/quick-edit/QuickEditPopover.tsx:78`
- `src/builder/ui/modals/quick-edit/QuickEditPopover.tsx:94`
- `src/builder/ui/modals/quick-edit/QuickEditTrigger.tsx:39`
- `src/builder/ui/feedback/ValidationSummary.tsx:26`
- `src/builder/cards/CardShellContent.tsx:31`
- `src/builder/cards/CardShellContent.tsx:32`
- `src/builder/cards/CardShellContent.tsx:33`
- `src/builder/cards/CardShellContent.tsx:34`
- `src/builder/cards/CardShellContent.tsx:35`
- `src/builder/cards/CardShellContent.tsx:56`
- `src/builder/cards/CardShellContent.tsx:57`
- `src/builder/cards/CardShellContent.tsx:58`
- `src/builder/cards/CardShellContent.tsx:59`
- `src/builder/cards/templates/phase/PhaseCard.tsx:139`
- `src/builder/cards/templates/phase/TaskBentoGrid.tsx:36`
- `src/builder/cards/templates/phase/TaskBentoGrid.tsx:45`
- `src/builder/cards/templates/action/ActionCard.tsx:55`
- `src/builder/cards/templates/task/TaskCard.tsx:76`
- `src/builder/cards/templates/task/TaskCard.tsx:129`
- `src/builder/cards/templates/task/TaskReadOnlyPopup.tsx:81`
- `src/builder/cards/templates/task/task-properties/TaskProperties.tsx:71`
- `src/builder/cards/templates/task/task-properties/TaskProperties.tsx:86`
- `src/builder/cards/templates/task/task-properties/TaskProperties.tsx:103`
- `src/builder/cards/templates/task/task-properties/TaskProperties.tsx:120`
- `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx:53`
- `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx:86`
- `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx:111`
- `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx:120`
- `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx:149`
- `src/builder/islands/EditorViewerIsland/EditorHeader.tsx:98`
- `src/builder/islands/EditorViewerIsland/EditorHeader.tsx:103`
- `src/builder/islands/EditorViewerIsland/EditorHeader.tsx:115`
- `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx:73`
- `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx:74`
- `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx:84`
- `src/builder/islands/EditorViewerIsland/TaskEditor/RoutingDirectorySection.tsx:117`
- `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx:69`
- `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx:127`
- `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx:142`
- `src/builder/islands/FocusIsland/FocusIsland.tsx:167`
- `src/builder/islands/FocusIsland/FocusIsland.tsx:180`
- `src/builder/islands/FocusIsland/FocusIsland.tsx:203`
- `src/builder/islands/FocusIsland/FocusIsland.tsx:211`
- `src/builder/islands/FocusIsland/FocusIsland.tsx:212`
- `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx:126`
- `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx:182`
- `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx:200`
- `src/builder/islands/FocusIsland/options/WeekOption/WeekOption.tsx:89`
- `src/builder/islands/FocusIsland/options/WeekOption/WeekOption.tsx:99`
- `src/builder/islands/SelectionIsland/SelectionLabel.tsx:56`
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx:36`
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx:46`
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx:87`
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx:89`
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx:97`
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx:99`
- `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx:107`
- `src/builder/islands/MetadataIsland/MetadataDetailsContent.tsx:52`
- `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx:41`
- `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx:58`
- `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx:80`
- `src/builder/stage/views/DayGridCardCollapsed.tsx:63`
- `src/builder/stage/views/MonthlyView.tsx:54`
- `src/builder/stage/views/TaskDropZone.tsx:70`
- `src/builder/stage/views/TaskDropZone.tsx:72`
- `src/builder/stage/views/TaskDropZone.tsx:76`
- `src/builder/stage/views/DayGridCardEmpty.tsx:27`
- `src/builder/stage/views/KanbanView.tsx:125`
- `src/builder/stage/views/KanbanView.tsx:126`
- `src/builder/stage/views/TimelineCustomEdgeSensors.tsx:103`
- `src/builder/stage/views/TimelineCustomEdgeSensors.tsx:105`
- `src/builder/stage/views/TimelineHourCell.tsx:56`
- `src/builder/stage/views/WeeklyView.tsx:34`
- `src/builder/stage/views/DayGridCard.tsx:122`
- `src/builder/stage/views/DayGridCard.tsx:123`
- `src/builder/stage/views/PhaseDropZone.tsx:81`
- `src/builder/stage/views/PhaseDropZone.tsx:83`
- `src/builder/stage/views/MatrixTimelineView.tsx:59`
- `src/builder/stage/views/MatrixTimelineView.tsx:66`
- `src/builder/stage/views/MatrixTimelineView.tsx:81`
- `src/builder/stage/views/MatrixTimelineView.tsx:82`

## Dead / Zero-Consumer Token Evidence

### `--theme-*` tokens

Result: **0 proven dead `--theme-*` tokens.**

The consumer loop checked every `--theme-*` definition in `src/brand/styles/tokens.css`, excluding
only `tokens.css` and `theme.css` themselves. Each token had at least one consumer.

Reproducible check:

```bash
tmp=$(mktemp)
rg --no-filename --pcre2 -o -- '--theme-[a-zA-Z0-9-]+(?=\s*:)' src/brand/styles/tokens.css | sort -u > "$tmp"
dead=0
while IFS= read -r token; do
  if ! rg -F --glob '!src/brand/styles/tokens.css' --glob '!src/brand/styles/theme.css' -- "$token" src >/dev/null; then
    dead=$((dead+1))
  fi
done < "$tmp"
echo "$dead"
rm "$tmp"
```

Lowest-consumer examples:

| Consumer count | Tokens |
|---:|---|
| 1 | `--theme-component-border-faint`, `--theme-component-border-light`, `--theme-component-border-soft`, `--theme-component-fill-light`, `--theme-component-fill-overlay`, `--theme-component-fill-soft`, `--theme-component-focus-accent`, `--theme-component-inset-highlight-soft`, `--theme-component-inset-highlight-strong`, `--theme-component-shadow-glow`, `--theme-component-shadow-light`, `--theme-component-shadow-medium`, `--theme-component-shadow-soft`, `--theme-component-shadow-strong`, `--theme-component-surface-deep`, `--theme-component-surface-editor`, `--theme-component-surface-header`, `--theme-component-surface-nav`, `--theme-component-surface-pill`, `--theme-component-surface-popup`, `--theme-component-text-disabled`, `--theme-component-text-faint`, `--theme-component-text-secondary`, `--theme-component-text-soft`, `--theme-component-text-subtle`, `--theme-divider`, `--theme-dropdown-bg` |
| 2 | `--theme-accent-deep`, `--theme-accent-variant`, `--theme-component-border-muted`, `--theme-component-border-strong`, `--theme-component-surface-glass-dark`, `--theme-component-text-muted`, `--theme-error-alt`, `--theme-error-bg-alt`, `--theme-error-deep-bg`, `--theme-muted`, `--theme-success-glow`, `--theme-surface-deep-alt`, `--theme-surface-void`, `--theme-warning-bg`, `--theme-warning-glow` |
| 179 | `--theme-accent` |

### Typography tokens

No old arbitrary syntax remains. `text-dcx-*` classes are used directly:

| Token | Utility | Consumer count |
|---|---|---:|
| `--text-4xs` | `text-dcx-4xs` | 5 |
| `--text-base` | `text-dcx-base` | 6 |
| `--text-2xs-plus` | `text-dcx-2xs-plus` | 7 |
| `--text-xs-plus` | `text-dcx-xs-plus` | 7 |
| `--text-md-plus` | `text-dcx-md-plus` | 9 |
| `--text-3xs-plus` | `text-dcx-3xs-plus` | 10 |
| `--text-md` | `text-dcx-md` | 15 |
| `--text-sm` | `text-dcx-sm` | 33 |
| `--text-3xs` | `text-dcx-3xs` | 37 |
| `--text-2xs` | `text-dcx-2xs` | 63 |
| `--text-xs` | `text-dcx-xs` | 100 |

### Zero-direct CSS vars

The scan found 88 CSS custom properties with zero direct literal consumers outside `tokens.css` and
`theme.css`. These are mostly:

- shadcn scaffold tokens (`--background`, `--foreground`, `--card`, `--chart-*`, `--sidebar-*`),
- Tailwind `@theme` alias tokens (`--color-*`, `--font-size-dcx-*`),
- raw text custom properties (`--text-*`) whose generated `text-dcx-*` classes are used.

Do not delete these from FP-R2 alone. A later token implementation sprint may decide whether shadcn
scaffold tokens should be brand-aligned, but FP-R2 does not prove them dead at runtime.

Reproducible check:

```bash
tmp=$(mktemp)
rg --no-filename --pcre2 -o -- '--[a-zA-Z0-9-]+(?=\s*:)' src/brand/styles/*.css | sort -u > "$tmp"
zero=0
while IFS= read -r token; do
  if ! rg -F --glob '!src/brand/styles/tokens.css' --glob '!src/brand/styles/theme.css' -- "$token" src >/dev/null; then
    zero=$((zero+1))
  fi
done < "$tmp"
echo "$zero"
rm "$tmp"
```

## FP-R5 Inputs

Use these exact metric baselines:

- Hardcoded-token script baseline: 108 arbitrary Tailwind entries.
- Broader product color literal baseline: 26 lines.
- Broader product arbitrary/bracket baseline: 342 lines.
- Storybook/demo color literal baseline: 22 lines, separate from product. Do not use the old
  unreproducible 44 count.
- Text arbitrary regression baseline: 0.
- `text-dcx-*` utility usage baseline: 260.
- P1b retained `--theme-*` arbitrary bracket baseline: 297.
- Actual unique `--theme-*` token names consumed outside brand: 35.
- Path-sensitive `--theme-*` file/token pairs outside brand: 134.
- Proven dead `--theme-*` tokens: 0.
- Zero-direct CSS custom properties requiring later build-aware review: 88.

## Verification

- Ran `bash scripts/agent/build-current-state.sh`.
- Ran `bash scripts/agent/verify-tooling-state.sh`; `verify.sh` passed.
- Ran `bash scripts/agent/code-query.sh hardcoded-tokens`.
- Ran `bash scripts/agent/code-query.sh --json hardcoded-tokens`.
- Ran manual `rg` fallback scans for color literals, arbitrary values, text regression syntax, theme-var counts, and token consumers.
- Source mutation check: `find src -type f -newer docs/progress/sessions/2026-06-28-codex/09-FP-R2-output-audit-followup.md`
  returned no files.
- No `src/` files were edited.
