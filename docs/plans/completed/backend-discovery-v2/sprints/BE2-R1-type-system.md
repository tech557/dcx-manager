---
sprint: BE2-R1
plan: backend-discovery-v2
title: Type System Health
status: completed
parallel-with: BE2-R2
output: output/BE2-R1-type-health.md
executor: Codex / opencode
---

# BE2-R1 — Type System Health

## Context (read before starting)

The expired `backend-discovery` plan found 50% of `domain.ts` was exact duplicates of `api.ts` types,
and `draftData: any` was the only remaining `any` in the state layer. **P4** of `src-structure-refactor`
(not P1) was the planned cleanup sprint for type deduplication and `draftData` typing. Verify current
state against both the expired BE-R1 baseline and whether P4 was executed.

Prior art files to read before Step 2:
- `docs/plans/expired/backend-discovery/output/BE-R1-type-inventory.md` — pre-cleanup baseline (10 duplicate types, draftData: any)
- `docs/plans/expired/src-structure-refactor/plan/README.md` — P4 scope: "Type deduplication. draftData typed. Service swap-ready."

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

- Read `docs/plans/expired/backend-discovery/output/BE-R1-type-inventory.md`
- Read `docs/plans/expired/src-structure-refactor/plan/README.md` (specifically the P4 section)

**Record for Step 7:**
- Pre-cleanup duplicate type names (should be 10 exact names)
- Whether P4 was marked complete or incomplete in the expired README
- Whether `draftData: any` was listed as resolved in P4

---

### Step 3 — TypeScript strict check (full output)

**Run:**
```bash
npm run typecheck 2>&1
```

**Record:** exact error count, error categories, which files have errors. Do not truncate.

---

### Step 4 — any-type scan via ESLint (full output)

**Run:**
```bash
npm run lint 2>&1 | grep "no-explicit-any"
```

**Record:** full list of `no-explicit-any` violations with file and line. Count total.

---

### Step 5 — api.ts / domain.ts duplication check

> Previous versions used `comm -12` on full export lines (e.g. `export interface ApiChannel`
> vs `export interface Channel`) — these never match because the names differ. This step
> uses Python to extract identifiers and compare both exact names and Api-prefix-stripped
> semantic pairs (the pattern the expired plan documented).

**Run:**
```bash
python3 - << 'EOF'
import subprocess, re

def get_type_names(candidates):
    for path in candidates:
        result = subprocess.run(['grep', '-E', r'^export (type|interface) \w+', path],
                                capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            names = re.findall(r'^export (?:type|interface) (\w+)', result.stdout, re.MULTILINE)
            print(f'  found {len(names)} types in {path}')
            return names, path
    return [], None

print('API types:')
api_names, api_file = get_type_names(['src/types/api.ts', 'src/api.ts'])
print('Domain types:')
domain_names, domain_file = get_type_names(['src/types/domain.ts', 'src/domain.ts'])

if not api_file:
    print('api.ts not found — P4 may have merged or deleted it')
if not domain_file:
    print('domain.ts not found — P4 may have merged or deleted it')

def normalize(name):
    return name[3:] if name.startswith('Api') else name

api_set = set(api_names)
domain_set = set(domain_names)
api_norm = {normalize(n): n for n in api_names}
domain_norm = {normalize(n): n for n in domain_names}

exact = sorted(api_set & domain_set)
semantic_keys = set(api_norm.keys()) & set(domain_norm.keys())
semantic_only = sorted(k for k in semantic_keys if api_norm[k] not in exact and domain_norm[k] not in exact)

print(f'\n--- Exact name matches: {len(exact)} ---')
for n in exact:
    print(f'  {n}')
print(f'\n--- Semantic matches (Api-prefix stripped): {len(semantic_only)} ---')
for k in semantic_only:
    print(f'  {api_norm[k]} ↔ {domain_norm[k]}  (base: {k})')
print(f'\nTotal duplicate pairs: {len(exact) + len(semantic_only)} (was 10 pre-cleanup)')
EOF
```

If neither `src/types/api.ts` nor `src/api.ts` exists, note this explicitly — P4 may have merged or deleted the file.

**Record:** duplicate count (compare to 10 pre-cleanup), full list of still-duplicate names.

---

### Step 6 — draftData type check

**Run:**
```bash
grep -n "draftData" src/store/builderStore.ts 2>/dev/null || echo "builderStore.ts not found — try:"
grep -rn "draftData" src/store/ --include="*.ts" 2>/dev/null
grep -rn "draftData" src/ --include="*.ts" --include="*.tsx" | grep -v "\.test\."
```

**Record:** current type of `draftData` (`any` / typed / removed). If removed, note which file it moved to.

---

### Step 7 — Mock data type coverage (full output)

**Run:**
```bash
find src/mock/ -name "*.ts" 2>/dev/null | sort || echo "src/mock/ does not exist"
grep -rn "as any\|: any\|any\[\]" src/mock/ --include="*.ts" 2>/dev/null
```

**Record:** all `any` usages in mock files (full list, no truncation). If `src/mock/` doesn't exist, note it.

---

### Step 8 — Write output file

Write `output/BE2-R1-type-health.md` with this exact structure:

```markdown
# BE2-R1 — Type System Health
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## 3 — TypeScript strict errors
- Total errors: N
[table: file, error count, error type — full output]

## 4 — any-type violations (ESLint)
- no-explicit-any violations: N (was 0 in services/actions pre-cleanup)
[full list: file, line, violation]

## 5 — api.ts / domain.ts duplication
- Duplicate type names: N (was 10 pre-cleanup)
[full list of still-duplicate names]
[note if files were merged or deleted]

## 6 — draftData type status
[any / typed / removed — with file and line evidence]

## 7 — Mock data type coverage
[any usages in mock files, or "clean"]

## Delta from expired BE-R1 (not delta from P1 — delta from last known baseline)
[what changed: duplicate count, any count, draftData status]
[note whether P4 was completed — this determines how much is expected to have changed]

## Blocking issues for folder-structure-v2 P3/P4
[numbered list: types that must be fixed before backend integration is safe]
```

---

## Acceptance criteria

- [x] TypeScript error count from `npm run typecheck` (exact, untruncated)
- [x] any-type violations from ESLint (exact count and full list)
- [x] api.ts/domain.ts duplication count from Step 5 Python script — exact matches + Api-prefix semantic pairs (not manually estimated)
- [x] draftData status documented with file+line evidence
- [x] Output written to `output/BE2-R1-type-health.md`
- [x] No source files changed

## Gates

| Gate | Status | Reason |
|------|--------|--------|
| typecheck | Audit subject | run in Step 3 as measurement, not as a gate on changes |
| lint | Audit subject | run in Step 4 as measurement, not as a gate on changes |
| validate:architecture | N/A | no code changed |
| test | N/A | no code changed |
| browser | N/A | no code changed |
| verify-tooling-state.sh | Required | run in Step 1 |
