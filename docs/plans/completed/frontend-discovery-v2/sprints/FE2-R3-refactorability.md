---
sprint: FE2-R3
plan: frontend-discovery-v2
title: Refactorability + Extraction Plan
status: completed
requires: FE2-R1, FE2-R2
output: output/FE2-R3-refactorability.md
executor: Codex / opencode
---

# FE2-R3 — Refactorability + Extraction Plan

## Context (read before starting)

The expired `frontend-discovery` plan identified 35 safe leaf atoms and 20 context-coupled components.
The `src-structure-refactor` plan used these numbers to scope P2. This sprint verifies whether those
numbers still hold post-P1 and produces the updated extraction plan for `folder-structure-v2`.

**Do not start this sprint until both `docs/plans/drafted/frontend-discovery-v2/output/FE2-R1-architecture.md` and `docs/plans/drafted/frontend-discovery-v2/output/FE2-R2-state-hooks.md` exist.**

Prior art files to read in Step 2:
- `docs/plans/expired/frontend-discovery/output/FE-R3-duplication-map.md` — v1 map (35 safe atoms, 20 context-coupled)
- `docs/plans/expired/src-structure-refactor/plan/README.md` — which FE-R3 recommendations were adopted

> Do not modify any source file. This is a read-only synthesis sprint.

---

## Steps

### Step 1 — Session environment check

**Run:**
```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

**Log:** paste both outputs under `## Session Environment` in your progress log. Confirm R1 and R2 output files exist:
```bash
test -f docs/plans/drafted/frontend-discovery-v2/output/FE2-R1-architecture.md && echo "R1 OK" || echo "R1 MISSING — do not continue"
test -f docs/plans/drafted/frontend-discovery-v2/output/FE2-R2-state-hooks.md  && echo "R2 OK" || echo "R2 MISSING — do not continue"
```

If either is missing, stop and wait for the parallel sprint to complete.

---

### Step 2 — Read all required inputs

Read each file in full. Do not skip any.

- Read `docs/plans/drafted/frontend-discovery-v2/output/FE2-R1-architecture.md` (dep-cruiser violations, file sizes, component inventory)
- Read `docs/plans/drafted/frontend-discovery-v2/output/FE2-R2-state-hooks.md` (contexts, hooks, useState breakdown)
- Read `docs/plans/expired/frontend-discovery/output/FE-R3-duplication-map.md` (v1 safe/coupled lists)
- Read `docs/plans/expired/src-structure-refactor/plan/README.md` (decisions adopted from v1)

**Record for Step 3:** the exact 35 safe atoms and 20 context-coupled component names from prior art.
**Record for Step 4:** the over-cap files from FE2-R1 (for the impact ranking in Step 5).

---

### Step 3 — Classify all components as safe / context-coupled / unknown

**Run:**
> Note: `components.json` uses `definedIn` (not `file`) and has no `consumers` field.
> Consumer counts come from `component-usages.json`.

```bash
python3 - << 'EOF'
import json, subprocess
from collections import Counter

with open('code-index/components.json') as f:
    components = json.load(f)

with open('code-index/component-usages.json') as f:
    usages = json.load(f)

consumer_counts = Counter(u['component'] for u in usages)

context_signals = ['useContext', 'useBuilderStore', 'useAppStore', 'StageContext',
                   'useDraftContext', 'useEditorContext']
store_signals   = ['builderStore', 'appStore', 'useStore']

safe, coupled, unknown = [], [], []

for name, info in components.items():
    src_file = info.get('definedIn', '')
    if not src_file:
        unknown.append((name, 'no definedIn in index'))
        continue
    try:
        with open(src_file) as f:
            content = f.read()
    except:
        unknown.append((name, f'cannot read {src_file}'))
        continue

    hits = [sig for sig in context_signals + store_signals if sig in content]
    consumer_count = consumer_counts.get(name, 0)

    if hits:
        coupled.append((name, src_file, consumer_count, hits))
    else:
        safe.append((name, src_file, consumer_count))

print(f'Total components: {len(components)}')
print(f'Safe to extract: {len(safe)}  (was 35 pre-P1)')
print(f'Context-coupled: {len(coupled)}  (was 20 pre-P1)')
print(f'Unknown:         {len(unknown)}')
print()
print('--- SAFE (no context/store imports) ---')
for name, path, consumers in sorted(safe, key=lambda x: -x[2]):
    print(f'  {name:40s}  {consumers:3d} consumers  {path}')
print()
print('--- CONTEXT-COUPLED (do not move without refactor) ---')
for name, path, consumers, hits in sorted(coupled, key=lambda x: -x[2]):
    print(f'  {name:40s}  {consumers:3d} consumers  signals: {hits[:2]}')
EOF
```

**Record:** full safe and coupled lists with consumer counts.

---

### Step 4 — Reverse dependency check on over-cap files

For each file in the over-cap list from FE2-R1, run `code-query.sh affected` to measure blast radius:

**Run:**
```bash
python3 - << 'EOF'
import subprocess, re

with open('docs/plans/drafted/frontend-discovery-v2/output/FE2-R1-architecture.md') as f:
    content = f.read()

over_cap_files = re.findall(r'src/[^\s|]+\.(?:tsx?)', content)
seen = set()
results = []

for path in over_cap_files:
    if path in seen:
        continue
    seen.add(path)
    result = subprocess.run(
        ['bash', 'scripts/agent/code-query.sh', 'affected', path],
        capture_output=True, text=True
    )
    importers = [l for l in result.stdout.strip().split('\n') if l]
    results.append((len(importers), path, importers))

results.sort(reverse=True)
print('Over-cap files by reverse-dependency count (highest risk to split):')
for count, path, importers in results:
    print(f'  {count:3d} importers  {path}')
    for imp in importers[:5]:
        print(f'             ← {imp}')
    if len(importers) > 5:
        print(f'             ... and {len(importers) - 5} more')
EOF
```

**Record:** full list of over-cap files ranked by importer count. High-importer files are highest risk to split.

---

### Step 5 — Build extraction priority order

Using data from Steps 2–4, rank components for folder-structure-v2 P2. Each entry in the ranking must score on three axes:

| Axis | Low risk | High impact |
|------|----------|-------------|
| Coupling | No context/store imports (safe from Step 3) | — |
| Impact | — | Resolves a dep-cruiser violation OR is over file-size cap |
| Complexity | Few consumers, single folder | Many consumers, cross-folder |

Write the ranked list now (not in Step 6) so Step 6 can copy it directly into the output file.
No commands needed — this is a reasoning step using the data already collected.

---

### Step 6 — Write output file

Write `docs/plans/drafted/frontend-discovery-v2/output/FE2-R3-refactorability.md` with this exact structure:

```markdown
# FE2-R3 — Refactorability + Extraction Plan
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## 3 — Safe-to-extract components
| Component | File | Consumers | Notes |
|-----------|------|-----------|-------|
[full list from Step 3 safe list]
Total: N (was 35 pre-P1, delta: ±N)

## 3 — Context-coupled components (do not move without refactor)
| Component | Signals | Consumers |
|-----------|---------|-----------|
[full list from Step 3 coupled list]
Total: N (was 20 pre-P1, delta: ±N)

## 4 — Over-cap file blast radius
| File | Lines | Cap | Importers (blast radius) |
|------|-------|-----|--------------------------|
[from Step 4 — ranked by importer count]

## 5 — Extraction priority order for folder-structure-v2 P2
[numbered list from Step 5: component name, reason for rank, acceptance criterion]
Each entry must include:
  1. Component name
  2. Why it is prioritised (resolves violation / over cap / low coupling)
  3. Acceptance criterion (runnable command to verify after move)

## Adopted decisions from expired plan (still valid)
[list from prior art read in Step 2 that still applies]

## Changed findings vs expired FE-R3
[new safe components, newly coupled, count deltas, new over-cap files]
```

---

## Acceptance criteria

- [x] Safe-to-extract list produced by the Step 3 script (not manually compiled)
- [x] Context-coupled list produced by the Step 3 script
- [x] Both counts compared to the 35/20 baseline from prior art
- [x] Extraction priority order includes a runnable acceptance criterion for each item
- [x] Output written to `docs/plans/drafted/frontend-discovery-v2/output/FE2-R3-refactorability.md`
- [x] No source files changed

## Gates

| Gate | Status | Reason |
|------|--------|--------|
| typecheck | N/A | no code changed |
| lint | N/A | no code changed |
| validate:architecture | N/A | no code changed |
| test | N/A | no code changed |
| browser | N/A | no code changed |
| verify-tooling-state.sh | Required | run in Step 1 |
