---
sprint: BE2-R2
plan: backend-discovery-v2
title: Service Layer Readiness
status: completed
parallel-with: BE2-R1
output: output/BE2-R2-service-readiness.md
executor: Codex / opencode
---

# BE2-R2 — Service Layer Readiness

## Context (read before starting)

The expired `backend-discovery` plan found: 0 `any` in services/actions, 100% mapper coverage,
8 services still using localStorage instead of fetch, and `apiClient()` existing but throwing.
This sprint re-measures all four dimensions post-P1.

Prior art files to read before Step 2:
- `docs/plans/expired/backend-discovery/output/BE-R2-service-audit.md` — v1 measurements (0 any, 8 localStorage services, apiClient stub)

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

Read the file in full. Do not skip.

- Read `docs/plans/expired/backend-discovery/output/BE-R2-service-audit.md`

**Record for Step 8:**
- The 8 service files that were using localStorage pre-P1 (exact names)
- Whether apiClient() was a stub or partially wired
- Mapper coverage status at v1

---

### Step 3 — Service file inventory with export scan

**Run:**
```bash
python3 - << 'EOF'
import subprocess, os

result = subprocess.run(
    ['find', 'src/services', '-name', '*.ts'],
    capture_output=True, text=True
)
service_files = sorted([l for l in result.stdout.strip().split('\n') if l])

print(f'Total service files: {len(service_files)}')
for path in service_files:
    exports = subprocess.run(
        ['grep', '-E', '^export (const|function|class|async)', path],
        capture_output=True, text=True
    )
    export_lines = [l.strip() for l in exports.stdout.strip().split('\n') if l]
    local_grep = subprocess.run(
        ['grep', '-c', 'localStorage\|sessionStorage\|safe-storage', path],
        capture_output=True, text=True
    )
    fetch_grep = subprocess.run(
        ['grep', '-c', 'fetch\|apiClient\|axios', path],
        capture_output=True, text=True
    )
    local_count = int(local_grep.stdout.strip() or '0')
    fetch_count = int(fetch_grep.stdout.strip() or '0')

    if local_count > 0:
        data_source = 'localStorage'
    elif fetch_count > 0:
        data_source = 'fetch/api'
    else:
        data_source = 'unknown/mock'

    print(f'\n  {path}  [{data_source}]')
    for ex in export_lines:
        print(f'    export: {ex[:80]}')
EOF
```

**Record:** full list of service files, their data source (localStorage/fetch/unknown), and their exported functions.

---

### Step 4 — localStorage usage scan (full output)

**Run:**
```bash
grep -rn "localStorage\|sessionStorage\|safe-storage" src/services/ --include="*.ts"
```

**Record:** every localStorage reference with file and line. Count total services affected (compare to 8 pre-P1).

---

### Step 5 — apiClient wiring check

**Run:**
```bash
grep -rn "apiClient\|api-client" src/services/ --include="*.ts"
grep -rn "apiClient\|api-client" src/ --include="*.ts" --include="*.tsx" | grep -v "\.test\." | grep -v "node_modules"
```

**Also check the apiClient definition:**
```bash
find src/ -name "apiClient*" -o -name "api-client*" | grep -v "node_modules" | sort
```

**Record:** is `apiClient()` called in any service or still a stub? Which file defines it? Does it throw?

---

### Step 6 — Per-service error handling audit (scripted)

**Run:**
```bash
python3 - << 'EOF'
import subprocess, os

result = subprocess.run(
    ['find', 'src/services', '-name', '*.ts'],
    capture_output=True, text=True
)
service_files = sorted([l for l in result.stdout.strip().split('\n') if l])

no_handling = []
has_handling = []

for path in service_files:
    with open(path) as f:
        content = f.read()
    signals = {
        'try':    content.count('try {') + content.count('try{'),
        'catch':  content.count('catch'),
        '.catch': content.count('.catch('),
        'throw':  content.count('throw '),
    }
    total = sum(signals.values())
    if total == 0:
        no_handling.append(path)
    else:
        has_handling.append((path, signals))

print(f'Services with NO error handling ({len(no_handling)}):')
for p in no_handling:
    print(f'  {p}')
print(f'\nServices with error handling ({len(has_handling)}):')
for p, sig in has_handling:
    print(f'  {p}: try={sig["try"]} catch={sig["catch"]} .catch={sig[".catch"]} throw={sig["throw"]}')
EOF
```

**Record:** full list of services with zero error handling (these are blockers for production swap).

---

### Step 7 — Mapper coverage check (full output)

**Run:**
```bash
find src/ \( -name "*mapper*" -o -name "*-mapper*" -o -name "*Mapper*" \) | grep -v "node_modules" | sort
grep -rn "toApi\|fromApi\|toDomain\|fromDomain\|mapper\|Mapper" src/services/ --include="*.ts"
```

**Record:** which mappers exist, which services use them, any services with no mapper reference.

---

### Step 8 — Write output file

Write `output/BE2-R2-service-readiness.md` with this exact structure:

```markdown
# BE2-R2 — Service Layer Readiness
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## 3 — Service inventory
| Service file | Data source | Exported functions |
|-------------|-------------|-------------------|
[full list from Step 3]

## 4 — localStorage usage
- Services still using localStorage: N (was 8 pre-P1)
[full list: file, line, usage]

## 5 — apiClient status
[stub / partially wired / fully wired — with evidence]

## 6 — Error handling coverage
Services with NO error handling: N
[full list from Step 6 — these are Scenario A blockers]

## 7 — Mapper coverage
[mapper files found, which services reference them]

## Delta from expired BE-R2
[what changed since v1: localStorage count, apiClient status, mapper coverage]

## Blockers for folder-structure-v2 P4
[numbered: services that cannot be swapped to real API without additional work]
```

---

## Acceptance criteria

- [x] Every service file listed with localStorage/fetch classification (scripted, not manual)
- [x] Per-service error handling from the Step 6 script (not from aggregate counts)
- [x] apiClient wiring status documented with file evidence
- [x] Mapper coverage from grep (not from reading each file)
- [x] Output written to `output/BE2-R2-service-readiness.md`
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
