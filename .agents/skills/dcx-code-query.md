---
name: dcx-code-query
description: >
  Query the DCX Manager codebase for component definitions, consumers, imports,
  text labels, hardcoded tokens, or affected files — without loading full indexes.
  Use this skill when the user asks "where is X defined", "who uses X", "what
  imports X", "find the label Y", "are there hardcoded colors", "what files use
  this hook", or any question about codebase structure or component relationships.
  Also trigger automatically before creating a new component (to check if it
  already exists) or before deleting/renaming anything (to find all consumers).
  Prefer this over reading full code-index files.
---

# DCX Code Query

Run focused queries against the generated code indexes instead of reading full
index files or scanning the entire source tree. The indexes are in `code-index/`
and are regenerated with `npm run generate:code-index`.

## Available query commands

```bash
# Find component definition and props
bash scripts/agent/code-query.sh component <ComponentName>

# Find all usages/consumers of a component
bash scripts/agent/code-query.sh consumers <ComponentName>

# Find what a file imports
bash scripts/agent/code-query.sh imports <file-path>

# Find all occurrences of a UI text label
bash scripts/agent/code-query.sh labels "<label text>"

# List all form controls and input primitives
bash scripts/agent/code-query.sh raw-controls

# Find potentially duplicated controls (same purpose, different implementations)
bash scripts/agent/code-query.sh duplicate-controls

# Find hardcoded hex colors, spacing, or font sizes outside brand/tokens.ts
bash scripts/agent/code-query.sh hardcoded-tokens

# Find all files that import from a given source file (reverse dependency)
bash scripts/agent/code-query.sh affected <src/path/to/file.tsx>

# Show unresolved imports
bash scripts/agent/code-query.sh unresolved

# JSON output for any command (for programmatic use)
bash scripts/agent/code-query.sh --json component <ComponentName>
```

## When to regenerate the index

The code index is stale if files were added or removed since the last generation.
Check staleness:
```bash
bash scripts/agent/verify-tooling-state.sh | python3 -c "
import json,sys; s=json.load(sys.stdin)
print('STALE' if s.get('code_index_stale') else 'FRESH', s.get('code_index_age_minutes','?'), 'min')
"
```

Regenerate if stale (≥ 60 min since last run, or after structural changes):
```bash
npm run generate:code-index
```

## Output format

By default, queries return focused human-readable output — only the relevant
section, not the full index. Use `--json` flag when the result will be used
programmatically or passed to another script.

Example: `bash scripts/agent/code-query.sh component TaskCard` returns:
```
TaskCard
  defined in: src/builder/cards/templates/task/TaskCard.tsx (87 lines)
  props: id, data, isSelected, onSelect, onLongPress
  child components: CardShell, StatusBadge, LockBadge
```

Not the entire components.json (131 entries, 4648 lines).

## Interpreting "not found" results

A "not found" error from `component <Name>` means the name is not in the current
index. Before concluding the component doesn't exist:

1. Check if the index is stale: `bash scripts/agent/verify-tooling-state.sh | grep code_index_stale`
2. If stale, regenerate: `npm run generate:code-index`, then re-run the query.
3. If fresh and still not found: the component genuinely doesn't exist.
4. After confirming not found: run `code-query.sh raw-controls` to check for
   near-name equivalents (e.g., searching `DatePicker` might miss `DateInput`).

Do not regenerate the code index every time a component is not found — only when
`verify-tooling-state.sh` reports `code_index_stale: true`.

## When queries are not enough

If the index doesn't have what you need (e.g., runtime behavior, dynamic imports,
conditional rendering logic), read the specific source file directly. Do not
fallback to reading the full code-index files.

## Spotted requirement-graph debt while querying? Clear it opportunistically (RS-R11.2)

The requirement graph runs in **test/calibration mode**: its first-population links carry known debt.
If, while answering a code query, you notice a manifestation with no requirement link, a duplicate/
aliased identity, or a stale/wrong trace link, flag it — don't ignore it and don't block your task:

- Unlinked manifestation → propose a candidate link or a typed `Exemption`.
- Duplicate/alias identity → record in `graph/views/rs-r7-deferred-cleanup-queue.md` or
  `req:propose --type supersede-node`.
- Stale/wrong link → flag in `candidateLinksAwaitingConfirmation` / `staleBrokenTraces`.
- **Anything touching locked/approved product truth → `req:propose` + PO confirmation only; never a
  silent edit (`core.md §35b`).** No code-query result authorizes a `src/**` change.

Full convention: `docs/plans/active/requirements-system/output/RS-R11-reground-brief.md` §5.
