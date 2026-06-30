---
sprint: FE2-R2
plan: frontend-discovery-v2
title: State + Hook Pattern Analysis
status: completed
parallel-with: FE2-R1
output: output/FE2-R2-state-hooks.md
executor: Codex / opencode
---

# FE2-R2 — State + Hook Pattern Analysis

## Context (read before starting)

The expired `frontend-discovery` plan found 131 useState calls and flagged StageContext as too large
(28 values). The `src-structure-refactor` plan adopted a partial split but did NOT fully execute P3.
This sprint measures the current state of context and hook patterns after P1.

Prior art files to read before Step 2:
- `docs/plans/expired/frontend-discovery/output/FE-R2-state-flow.md` — v1 state map (131 useState, StageContext 28 values)
- `docs/plans/expired/src-structure-refactor/plan/README.md` — what was decided about StageContext (partial split, drag state extracted)

> Do not modify any source file. This is a read-only discovery sprint.

---

## Steps

### Step 1 — Session environment check

**Run:**
```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

**Log:** paste both outputs under `## Session Environment` in your progress log before continuing.

---

### Step 2 — Read prior art

Read each file in full. Do not skip.

- Read `docs/plans/expired/frontend-discovery/output/FE-R2-state-flow.md`
- Read `docs/plans/expired/src-structure-refactor/plan/README.md`

**Record for Step 7:**
- Pre-P1 useState count (should be 131)
- StageContext value count pre-P1 (should be 28)
- What P1 claimed to do about StageContext (which values were extracted)

---

### Step 3 — useState count (full output)

**Run:**
```bash
grep -rn "useState" src/ --include="*.tsx" --include="*.ts" \
  | grep -v "\.test\." \
  | cut -d: -f1 | sort | uniq -c | sort -rn \
  > /tmp/fe2-r2-usestate.txt
echo "Total useState calls:"
grep -rn "useState" src/ --include="*.tsx" --include="*.ts" | grep -v "\.test\." | wc -l
echo "Per-file breakdown:"
cat /tmp/fe2-r2-usestate.txt
```

**Record:** total useState call count (compare to 131 pre-P1), full per-file breakdown (no truncation).

---

### Step 4 — Context inventory (scripted, full value count)

**Run:**
```bash
python3 - << 'EOF'
import subprocess, re, os

result = subprocess.run(
    ['grep', '-rn', 'createContext', 'src/', '--include=*.tsx', '--include=*.ts'],
    capture_output=True, text=True
)

contexts = []
for line in result.stdout.strip().split('\n'):
    if not line or '.test.' in line:
        continue
    parts = line.split(':')
    filepath = parts[0]
    if filepath not in [c[0] for c in contexts]:
        contexts.append((filepath, line))

print(f'Total context definitions: {len(contexts)}')
for filepath, match_line in contexts:
    try:
        with open(filepath) as f:
            content = f.read()
        exports = re.findall(r'^export\b', content, re.MULTILINE)
        value_exports = re.findall(r'^\s*(?:export\s+)?(?:const|type|interface)\s+\w+', content, re.MULTILINE)
        too_large = len(value_exports) >= 10
        flag = '  *** TOO LARGE (10+ exports)' if too_large else ''
        print(f'  {filepath}: {len(value_exports)} exports{flag}')
    except:
        print(f'  {filepath}: (could not read)')
EOF
```

**Record:** every context file with its export count, flag any with 10+ exports.

---

### Step 5 — Custom hook inventory (scripted)

**Run:**
```bash
python3 - << 'EOF'
import subprocess, os
from collections import defaultdict

result = subprocess.run(
    ['find', 'src', '-name', 'use*.ts', '-o', '-name', 'use*.tsx'],
    capture_output=True, text=True
)

hooks = [l for l in result.stdout.strip().split('\n') if l and '.test.' not in l]
by_folder = defaultdict(list)
for h in hooks:
    parts = h.split('/')
    folder = '/'.join(parts[:3]) if len(parts) >= 3 else parts[0]
    by_folder[folder].append(h)

print(f'Total custom hooks: {len(hooks)}')
print('\nBy folder:')
for folder, files in sorted(by_folder.items()):
    print(f'  {folder}: {len(files)}')
    for f in files:
        print(f'    {f}')

# Identify hooks used in only 1 component vs shared across 3+
print('\nHook usage analysis:')
for hook_path in hooks:
    hook_name = os.path.basename(hook_path).replace('.ts', '').replace('.tsx', '')
    result2 = subprocess.run(
        ['grep', '-rl', '--include=*.tsx', '--include=*.ts', hook_name, 'src/'],
        capture_output=True, text=True
    )
    usages = [l for l in result2.stdout.strip().split('\n') if l and l != hook_path]
    if len(usages) == 0:
        tag = 'UNUSED'
    elif len(usages) == 1:
        tag = 'single-owner'
    elif len(usages) >= 3:
        tag = 'shared (3+)'
    else:
        tag = f'used in {len(usages)}'
    print(f'  {hook_name}: {tag}')
EOF
```

**Record:** total hook count, full folder distribution, single-owner vs shared classification for each hook.

---

### Step 6 — ESLint hook violations (full output)

**Run:**
```bash
npm run lint 2>&1 | grep "react-hooks"
```

**Record:** full list of `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps` violations. Do not truncate.

---

### Step 7 — Check editor hook merge status

**Run:**
```bash
find src/ \( -name "useEditorPanel*" -o -name "useEditorDraft*" -o -name "useEditorGuard*" \) | sort
```

**Then grep for references to any that exist:**
```bash
grep -rn "useEditorPanel\|useEditorDraft\|useEditorGuard" src/ --include="*.tsx" --include="*.ts" | grep -v "\.test\."
```

**Record:** whether the 3 hooks still exist as separate files or were merged. If merged, what is the merged hook name.

---

### Step 8 — Write output file

Write `output/FE2-R2-state-hooks.md` with this exact structure:

```markdown
# FE2-R2 — State + Hook Pattern Analysis
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## 3 — useState summary
- Total useState calls: N (was 131 pre-P1, delta: ±N)
[full per-file table from Step 3 — no truncation]

## 4 — Context inventory
| Context file | Export count | Too large? |
|-------------|-------------|------------|
[full list from Step 4]

## 5 — Custom hook inventory
- Total custom hooks: N
[folder distribution table]
[hook usage classification table: hook name, usage count, tag]

## 6 — ESLint hook violations
[full lint output from Step 6, or "No violations" if empty]

## 7 — Editor hook merge status
[result of Step 7: merged / still separate / not found]

## Delta from expired FE-R2
[what changed: useState count change, context changes, hooks added/removed]

## Risks for folder-structure-v2 P2/P3
[contexts too large, hooks that cannot be moved safely, hooks with exhaustive-deps violations]
```

---

## Acceptance criteria

- [x] useState total count with full per-file breakdown (no truncation)
- [x] Every context file listed with export count (scripted, not manual)
- [x] Custom hook inventory with usage classification (single-owner / shared / unused)
- [x] Editor hook merge status documented
- [x] Output written to `output/FE2-R2-state-hooks.md`
- [x] No source files changed

## Gates

| Gate | Status | Reason |
|------|--------|--------|
| typecheck | N/A | no code changed |
| lint | N/A | no code changed; lint run in Step 6 as measurement only |
| validate:architecture | N/A | no code changed |
| test | N/A | no code changed |
| browser | N/A | no code changed |
| verify-tooling-state.sh | Required | run in Step 1 |
