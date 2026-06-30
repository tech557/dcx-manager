---
sprint: FE2-R1
plan: frontend-discovery-v2
title: Architecture + Boundary Audit
status: completed
parallel-with: FE2-R2
output: output/FE2-R1-architecture.md
executor: Codex / opencode
---

# FE2-R1 — Architecture + Boundary Audit

## Context (read before starting)

The expired `src-structure-audit` ran before dep-cruiser was installed. Now that dep-cruiser enforces
6 boundary rules, violations can be measured in seconds. This sprint produces the authoritative
post-P1 violation list and file-size inventory.

Prior art files to read before Step 2:
- `docs/plans/expired/src-structure-audit/output/SA-R1-dependency-graph.md` — pre-dep-cruiser dep graph
- `docs/plans/expired/frontend-discovery/output/FE-R1-component-tree.md` — v1 component tree (131 components)

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

**Check code-index freshness:**
```bash
python3 -c "
import json
d = json.load(open('code-index/code-index-metadata.json'))
print('code-index age:', d.get('generated_at', 'unknown'))
print('stale:', d.get('stale', 'unknown'))
" 2>/dev/null || echo "metadata file not found — run: npm run generate:code-index"
```

If stale: run `npm run generate:code-index` before Step 4.

---

### Step 2 — Read prior art

Read each file in full. Do not skip.

- Read `docs/plans/expired/src-structure-audit/output/SA-R1-dependency-graph.md`
- Read `docs/plans/expired/frontend-discovery/output/FE-R1-component-tree.md`

**Record for Step 7:**
- Pre-P1 component count from FE-R1 (should be 131)
- Any dep-cruiser violations noted in SA-R1 (pre-dep-cruiser, so likely none — note this explicitly)
- Any specific files flagged as over-cap in prior art

---

### Step 3 — Run dep-cruiser boundary audit (full output)

**Run:**
```bash
npm run validate:architecture 2>&1
```

**Record:** exact violation count, which of the 6 rules are triggered, which files are involved.
Do not truncate. Capture the full output.

---

### Step 4 — File size audit (all folders, full output)

**Run:**
```bash
python3 - << 'EOF'
import subprocess, os

caps = [
    ('src', '*.tsx', 250),
    ('src', 'use*.ts', 200),
    ('src/actions', '*.ts', 250),
    ('src/services', '*.ts', 250),
    ('src/rules', '*.ts', 250),
]
registry_cap = 400

violations = []

for root, pattern, cap in caps:
    result = subprocess.run(
        ['find', root, '-name', pattern, '-not', '-path', '*/node_modules/*'],
        capture_output=True, text=True
    )
    for path in result.stdout.strip().split('\n'):
        if not path:
            continue
        try:
            count = sum(1 for _ in open(path))
            if count > cap:
                violations.append((count, cap, path))
        except:
            pass

reg = subprocess.run(
    ['find', 'src', '-name', '*.registry.*', '-not', '-path', '*/node_modules/*'],
    capture_output=True, text=True
)
for path in reg.stdout.strip().split('\n'):
    if not path:
        continue
    try:
        count = sum(1 for _ in open(path))
        if count > registry_cap:
            violations.append((count, registry_cap, path))
    except:
        pass

violations.sort(reverse=True)
print(f'Over-cap files: {len(violations)}')
for lines, cap, path in violations:
    print(f'  {lines:4d} lines (cap {cap})  {path}')
EOF
```

**Record:** full list of over-cap files with line counts and caps.

---

### Step 5 — Component inventory from code-index

> Note: `components.json` has no `consumers` field. Consumer counts come from
> `component-usages.json` (a list of `{component, usedIn, ...}` objects) — group by `component`.

**Run:**
```bash
python3 - << 'EOF'
import json
from collections import Counter

with open('code-index/components.json') as f:
    data = json.load(f)

with open('code-index/component-usages.json') as f:
    usages = json.load(f)

consumer_counts = Counter(u['component'] for u in usages)

components = list(data.keys())
by_consumers = sorted(components, key=lambda n: -consumer_counts.get(n, 0))
orphaned = [n for n in components if consumer_counts.get(n, 0) == 0]

print(f'Total components: {len(components)}')
print(f'\nTop 10 by consumer count:')
for n in by_consumers[:10]:
    print(f'  {n}: {consumer_counts.get(n, 0)} consumers')
print(f'\nOrphaned (0 consumers): {len(orphaned)}')
for n in orphaned:
    print(f'  {n}')
EOF
```

**Record:** total component count (compare to 131 pre-P1), top 10 by consumer count, full orphaned list.

---

### Step 6 — Folder placement audit

**Run:**
```bash
python3 - << 'EOF'
import subprocess, os

folders = [
    'src/components',
    'src/ui',
    'src/builder',
    'src/components/forms',
]
for folder in folders:
    if os.path.exists(folder):
        result = subprocess.run(['find', folder, '-name', '*.tsx'], capture_output=True, text=True)
        files = [l for l in result.stdout.strip().split('\n') if l]
        print(f'{folder}: {len(files)} .tsx files')
        for f in files[:10]:
            print(f'  {f}')
        if len(files) > 10:
            print(f'  ... and {len(files) - 10} more')
    else:
        print(f'{folder}: does not exist')
EOF
```

**Record:** file counts per folder, whether `src/components/forms/` still exists (audit advisory from prior art noted it as misplaced).

---

### Step 7 — Write output file

Write `output/FE2-R1-architecture.md` with this exact structure:

```markdown
# FE2-R1 — Architecture + Boundary Audit
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## 3 — dep-cruiser violations
| Rule | Violating file | Import target | Known pre-P1? |
|------|---------------|---------------|---------------|
[full list from Step 3]
Total: N violations

## 4 — File size violations
| File | Lines | Cap | Excess |
|------|-------|-----|--------|
[full list from Step 4]
Total: N over-cap files

## 5 — Component inventory
- Total components: N (was 131 pre-P1)
- Orphaned (0 consumers): N
[top 10 by consumer count table]

## 6 — Folder placement
[Step 6 output — file counts per folder]
src/components/forms/ status: [exists with N files / does not exist]

## Delta from expired FE-R1
[what changed: new violations, resolved violations, component count change, new over-cap files]

## Blocking issues for folder-structure-v2 P2/P3
[numbered list: files that MUST be addressed before P2/P3]
```

---

## Acceptance criteria

- [x] dep-cruiser violation count recorded (no truncation)
- [x] All over-cap files listed with line counts
- [x] Component count from code-index (not manually counted)
- [x] `src/components/forms/` status documented
- [x] Output written to `output/FE2-R1-architecture.md`
- [x] No source files changed

## Gates

| Gate | Status | Reason |
|------|--------|--------|
| typecheck | N/A | no code changed |
| lint | N/A | no code changed |
| validate:architecture | Audit subject | run in Step 3 as measurement, not as a gate on changes |
| test | N/A | no code changed |
| browser | N/A | no code changed |
| verify-tooling-state.sh | Required | run in Step 1 |
