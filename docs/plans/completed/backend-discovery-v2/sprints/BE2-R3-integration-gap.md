---
sprint: BE2-R3
plan: backend-discovery-v2
title: Integration Gap Report
status: completed
requires: BE2-R1, BE2-R2
output: output/BE2-R3-gap-report.md
executor: Codex / opencode
---

# BE2-R3 — Integration Gap Report

## Context (read before starting)

The expired `backend-discovery` plan concluded that Scenario A (same-shape API) is achievable:
swap 8 localStorage services to fetch, everything else (mappers, queries, actions, guards, helpers)
survives. This sprint updates that Scenario A fix list using BE2-R1 and BE2-R2 current measurements.

**Do not start this sprint until both `docs/plans/drafted/backend-discovery-v2/output/BE2-R1-type-health.md` and `docs/plans/drafted/backend-discovery-v2/output/BE2-R2-service-readiness.md` exist.**

Prior art files to read in Step 2:
- `docs/plans/expired/backend-discovery/output/BE-R3-integration-gap.md` — v1 fix list (8 services, mapper/query/action survival list)

> Do not modify any source file. This is a read-only synthesis sprint.

---

## Steps

### Step 1 — Session environment check

**Run:**
```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

**Log:** paste both outputs under `## Session Environment` in your progress log. Confirm R1 and R2 outputs exist:
```bash
test -f docs/plans/drafted/backend-discovery-v2/output/BE2-R1-type-health.md    && echo "R1 OK" || echo "R1 MISSING — do not continue"
test -f docs/plans/drafted/backend-discovery-v2/output/BE2-R2-service-readiness.md && echo "R2 OK" || echo "R2 MISSING — do not continue"
```

If either is missing, stop and wait for the parallel sprint to complete.

---

### Step 2 — Read all required inputs

Read each file in full. Do not skip any.

- Read `docs/plans/drafted/backend-discovery-v2/output/BE2-R1-type-health.md`
- Read `docs/plans/drafted/backend-discovery-v2/output/BE2-R2-service-readiness.md`
- Read `docs/plans/expired/backend-discovery/output/BE-R3-integration-gap.md`

**Record for Step 3:**
- Services still using localStorage (from BE2-R2 § 4)
- Services with no error handling (from BE2-R2 § 6)
- Duplicate type names still present (from BE2-R1 § 5)
- Whether draftData is still `any` (from BE2-R1 § 6)

---

### Step 3 — Assess Scenario A readiness per service

Using the localStorage services list from Step 2, classify each service.

> **Mapper check is entity-specific, not a global file presence check.**
> In this architecture, services may intentionally return `Api*` shapes and mapping can occur in
> `queries/`, or `src/services/api-mappers.ts`. The script identifies which `Api*` types each
> service references, derives the expected mapper function names (pattern: `api{Entity}ToDomain`,
> `domain{Entity}ToApi`), then confirms a matching mapper exists — in the service, in any
> `src/queries/` file that imports the service, or in the shared mapper file.
> If a service references no `Api*` types, it is classified as same-shape/no mapper required.

**Run:**
```bash
python3 - << 'EOF'
import subprocess, re, os

with open('docs/plans/drafted/backend-discovery-v2/output/BE2-R2-service-readiness.md') as f:
    content = f.read()

local_section = re.search(r'## 4 — localStorage usage(.*?)(?=\n## )', content, re.DOTALL)
if not local_section:
    print("Could not parse localStorage section from BE2-R2 output")
    exit(1)

files = re.findall(r'(src/services/\S+\.ts)', local_section.group(1))
unique_files = sorted(set(files))

ERROR_SIGNALS  = 'try\|catch\|throw'
API_SIGNALS    = 'apiClient'
SHARED_MAPPER  = 'src/services/api-mappers.ts'

# Infrastructure files: assessed for apiClient wired/stub only — not for entity mapper coverage.
# Transport envelope types (ApiClientRequestOptions, ApiClientResponse, etc.) are not domain types.
INFRA_FILES  = {'api-client.ts', 'api-mappers.ts', 'error-reporter.service.ts', 'logs.service.ts'}
# Api* type names that are transport/infrastructure — never domain entities requiring mappers
INFRA_TYPES  = {'ApiClientRequestOptions', 'ApiClientResponse', 'ApiClientError',
                'ApiClientConfig', 'ApiClientHeaders'}

def grep_count(pattern, path):
    r = subprocess.run(['grep', '-c', pattern, path], capture_output=True, text=True)
    return int(r.stdout.strip() or '0')

def grep_text(pattern, path):
    r = subprocess.run(['grep', '-oE', pattern, path], capture_output=True, text=True)
    return [l for l in r.stdout.strip().split('\n') if l]

print(f'localStorage services to assess: {len(unique_files)}')
for path in unique_files:
    svc_name = os.path.basename(path).replace('.ts', '')

    # Infrastructure files: skip mapper check entirely
    if os.path.basename(path) in INFRA_FILES:
        has_error     = grep_count(ERROR_SIGNALS, path) > 0
        has_apiclient = grep_count(API_SIGNALS, path) > 0
        print(f'  {path}: INFRA (mapper N/A) | error handling: {has_error} | apiClient: {has_apiclient}')
        continue

    # 1. Find which Api* types this service references (exclude infrastructure envelope types)
    all_api_types = sorted(set(grep_text(r'Api[A-Z][a-zA-Z]+', path)))
    api_type_names = [t for t in all_api_types if t not in INFRA_TYPES]

    # 2. Find query files that import this service
    q_result = subprocess.run(
        ['grep', '-rl', '--include=*.ts', '--include=*.tsx', svc_name, 'src/queries/'],
        capture_output=True, text=True
    )
    query_files = [l for l in q_result.stdout.strip().split('\n') if l]

    # 3. Check mapper coverage entity-by-entity
    if not api_type_names:
        mapper_status = 'same-shape/no mapper required'
        mapper_covered = True
    else:
        found_for = []
        missing_for = []
        for api_type in api_type_names:
            base = api_type[3:]  # strip 'Api' prefix → e.g. 'Channel'
            base_lo = base[0].lower() + base[1:]  # → 'channel'
            # Expected function names: apiChannelToDomain, domainChannelToApi, apiChannelMapper …
            patterns = [f'api{base}ToDomain', f'domain{base}ToApi',
                        f'api{base}Mapper', f'{base_lo}Mapper', f'toApi{base}']
            check_paths = [path] + query_files + ([SHARED_MAPPER] if os.path.exists(SHARED_MAPPER) else [])
            match_loc = None
            for fn_pat in patterns:
                for cp in check_paths:
                    if grep_count(fn_pat, cp) > 0:
                        match_loc = f'{fn_pat} in {os.path.basename(cp)}'
                        break
                if match_loc:
                    break
            if match_loc:
                found_for.append(f'{api_type} → {match_loc}')
            else:
                missing_for.append(api_type)

        if missing_for:
            mapper_status = f'MISSING mapper for: {", ".join(missing_for)}'
            mapper_covered = False
        else:
            mapper_status = f'covered ({"; ".join(found_for)})'
            mapper_covered = True

    has_error     = grep_count(ERROR_SIGNALS, path) > 0
    has_apiclient = grep_count(API_SIGNALS, path) > 0

    blockers = []
    if not mapper_covered: blockers.append(f'needs mapper — {mapper_status}')
    if not has_error:      blockers.append('needs error handling')
    if not has_apiclient:  blockers.append('needs apiClient wired')

    status = 'READY' if not blockers else f'BLOCKED: {", ".join(blockers)}'
    print(f'  {path}: {status}')
    print(f'    mapper: {mapper_status}')
    print(f'    error handling: {has_error} | apiClient: {has_apiclient}')
    if query_files:
        print(f'    query files checked: {[os.path.basename(q) for q in query_files]}')
EOF
```

**Record:** per-service Scenario A readiness status. For each service: which `Api*` types it uses, which mapper function was found and where, and the exact blocker if any.

---

### Step 4 — Check ai.service.ts status

**Run:**
```bash
find src/services/ -name "ai.service.ts" -o -name "ai*.service.ts" | sort
```

**Then read the file if it exists:**
```bash
cat src/services/ai.service.ts 2>/dev/null || echo "ai.service.ts not found"
```

**Record:** whether it is a stub, partially implemented, or not present. Full file content if short; summary if long. Do not truncate to 30 lines — read the whole file.

---

### Step 5 — Build exact fix list for folder-structure-v2 P4

Using data from Steps 2–4, produce a numbered fix list. Each entry must include:
- **File** (exact path)
- **Change** (what to do — add error handling / wire apiClient / fix duplicate type / etc.)
- **Acceptance criterion** (runnable command that confirms the fix is done)
- **Risk** (low / med / high)

No commands needed here — this is a reasoning step using collected data.

Risk guide:
- `low` = service with no consumers that share state
- `med` = service called from multiple actions or rules
- `high` = service that feeds a context or affects save/load flow

---

### Step 6 — Write output file

Write `docs/plans/drafted/backend-discovery-v2/output/BE2-R3-gap-report.md` with this exact structure:

```markdown
# BE2-R3 — Integration Gap Report
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## Scenario A readiness summary
| Status | Count |
|--------|-------|
| Ready (0 blockers) | N |
| Needs error handling | N |
| Needs mapper | N |
| Needs apiClient wired | N |

## 3 — Per-service Scenario A status
| Service | Blockers |
|---------|---------|
[full table from Step 3]

## 4 — ai.service.ts status
[stub / partially implemented / not found — with evidence]

## 5 — Exact fix list for folder-structure-v2 P4
[numbered: file, change, acceptance criterion, risk]

## Delta from expired BE-R3
[what changed since v1: fewer localStorage services? apiClient wired? draftData typed?]

## What breaks immediately if mock → real API today
[exact list, from code evidence in BE2-R1 and BE2-R2 — not speculation]
```

---

## Acceptance criteria

- [x] Per-service Scenario A status from the Step 3 script (not manual assessment)
- [x] Exact fix list with runnable acceptance criteria for each item
- [x] Risk classification for each fix
- [x] Delta from expired BE-R3 documented
- [x] Output written to `docs/plans/drafted/backend-discovery-v2/output/BE2-R3-gap-report.md`
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
