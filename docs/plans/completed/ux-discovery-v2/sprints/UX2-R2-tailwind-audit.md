---
sprint: UX2-R2
plan: ux-discovery-v2
title: Tailwind v4 Pattern Audit
status: completed
parallel-with: UX2-R1
output: output/UX2-R2-tailwind-patterns.md
executor: Codex / opencode
---

# UX2-R2 — Tailwind v4 Pattern Audit

## Context (read before starting)

The expired `ui-ux-discovery` plan found 48 dead CSS classes and 5 visual duplication groups.
This sprint re-measures both, and maps the current Tailwind arbitrary-value footprint.

> **Scope note:** This sprint does not reproduce the full v1 CSS class-to-component ownership map.
> It records only the dead/single-owner/shared classification needed for folder-structure-v2 decisions.

Prior art files to read before Step 2:
- `docs/plans/expired/ui-ux-discovery/output/UX-R2-component-css-map.md` — pre-P1 CSS class inventory (48 dead, 11 inline-style files, 5 duplication groups)
- `docs/plans/expired/ui-ux-discovery/output/UX-R3-style-synthesis.md` — visual pattern recommendations pre-P1

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

- Read `docs/plans/expired/ui-ux-discovery/output/UX-R2-component-css-map.md`
- Read `docs/plans/expired/ui-ux-discovery/output/UX-R3-style-synthesis.md`

**Record for use in Step 7:**
- Pre-P1 dead class count (should be 48)
- Pre-P1 duplication groups (Badge, Chip, Glass, Input, Toggle — verify names in file)

---

### Step 3 — Run arbitrary Tailwind value scan (full output)

**Run:**
```bash
grep -roh --include="*.tsx" -E "[a-z-]+\[[^\]]+\]" src/ \
  | sort | uniq -c | sort -rn \
  > /tmp/ux2-r2-arbitrary.txt
echo "--- unique patterns ---"
wc -l /tmp/ux2-r2-arbitrary.txt
echo "--- full list ---"
cat /tmp/ux2-r2-arbitrary.txt
```

**Record:** total unique arbitrary patterns, total occurrences, full sorted list (no truncation).

---

### Step 4 — Run CSS class inventory (dead / single-owner / shared)

**Run:**
```bash
python3 - << 'EOF'
import subprocess, re

with open('src/brand/index.css') as f:
    css_classes = re.findall(r'^\\.([a-zA-Z_-][a-zA-Z0-9_-]*)', f.read(), re.MULTILINE)

dead, single, shared = [], [], []

for cls in sorted(set(css_classes)):
    result = subprocess.run(
        ['grep', '-rl', '--include=*.tsx', cls, 'src/'],
        capture_output=True, text=True
    )
    files = [l for l in result.stdout.strip().split('\n') if l and '.test.' not in l]
    if len(files) == 0:
        dead.append(cls)
    elif len(files) == 1:
        single.append((cls, files[0]))
    else:
        shared.append((cls, files))

print(f'Total CSS classes in index.css: {len(set(css_classes))}')
print(f'\nDead ({len(dead)}):')
for c in dead:
    print(f'  {c}')
print(f'\nSingle-owner ({len(single)}):')
for c, f in single:
    print(f'  {c}  →  {f}')
print(f'\nShared ({len(shared)}):')
for c, files in shared:
    print(f'  {c}  →  {len(files)} files: {files}')
EOF
```

**Record:** dead count (compare to 48 from pre-P1), single-owner list, shared list.

---

### Step 5 — Run visual duplication check

**Run:**
```bash
bash scripts/agent/code-query.sh duplicate-controls
```

**Record:** which of the 5 pre-P1 duplication groups (Badge, Chip, Glass, Input, Toggle) still exist, which were resolved, whether any new groups appeared.

---

### Step 6 — Run shared Tailwind class cluster detection

**Run:**
```bash
python3 - << 'EOF'
import subprocess, re
from collections import defaultdict

result = subprocess.run(
    ['grep', '-roh', '--include=*.tsx', r'className="[^"]{30,}"', 'src/'],
    capture_output=True, text=True
)

cluster_count = defaultdict(int)
for line in result.stdout.strip().split('\n'):
    if line:
        cluster_count[line.strip()] += 1

print('Class strings appearing in 2+ components:')
for pattern, count in sorted(cluster_count.items(), key=lambda x: -x[1]):
    if count >= 2:
        print(f'  [{count}x] {pattern}')
EOF
```

**Record:** class strings used in 2+ components — candidates for shared utility classes.

---

### Step 7 — Write output file

Write `output/UX2-R2-tailwind-patterns.md` with this exact structure:

```markdown
# UX2-R2 — Tailwind v4 Pattern Audit
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## Summary
| Metric | Pre-P1 (expired baseline) | Post-P1 (this scan) | Delta |
|--------|--------------------------|---------------------|-------|
| Dead CSS classes | 48 | N | ±N |
| Duplication groups | 5 | N | ±N |
| Unique arbitrary Tailwind values | N/A | N | — |

## 3 — Arbitrary Tailwind values (full list)
| Pattern | Occurrences |
|---------|-------------|
[full list from Step 3 — no truncation]

## 4a — Dead CSS classes (zero TSX usages)
[class names from Step 4 — candidates for deletion in folder-structure-v2 P1]

## 4b — Single-owner CSS classes
| Class | File |
|-------|------|
[from Step 4 — candidates for inlining as Tailwind utilities]

## 4c — Shared CSS classes (2+ files)
| Class | Files |
|-------|-------|
[from Step 4 — keep in global CSS]

## 5 — Visual duplication groups
| Group | Pre-P1 status | Post-P1 status | Components involved |
|-------|---------------|----------------|---------------------|
[from Step 5 — compare to Badge/Chip/Glass/Input/Toggle baseline]

## 6 — Tailwind class clusters (used in 2+ components)
[from Step 6 — candidates for shared utility classes]
```

---

## Acceptance criteria

- [x] Arbitrary Tailwind value count is full (no `head` truncation)
- [x] Dead CSS class list is produced by the Step 4 script (not manual inspection)
- [x] Duplication group status accounts for all 5 pre-P1 groups
- [x] Output written to `output/UX2-R2-tailwind-patterns.md`
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
