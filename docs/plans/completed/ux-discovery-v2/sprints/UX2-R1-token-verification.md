---
sprint: UX2-R1
plan: ux-discovery-v2
title: Token Verification + Gap Analysis
status: completed
parallel-with: UX2-R2
output: output/UX2-R1-token-status.md
executor: Codex / opencode
---

# UX2-R1 — Token Verification + Gap Analysis

## Context (read before starting)

P1 of the expired `src-structure-refactor` plan claimed to tokenize all raw color values in `src/`.
This sprint verifies whether those claims hold in the current codebase and measures the remaining gap.

Prior art files to read before step 2:
- `docs/plans/expired/ui-ux-discovery/output/UX-R1-token-inventory.md` — pre-P1 baseline (269 raw hex, exact breakdown)
- `docs/plans/expired/src-structure-refactor/output/P1-design-tokens-output.md` — what P1 claimed to do

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

- Read `docs/plans/expired/ui-ux-discovery/output/UX-R1-token-inventory.md`
- Read `docs/plans/expired/src-structure-refactor/output/P1-design-tokens-output.md`

**Record for use in Step 7:**
- Pre-P1 raw hex count (should be 269 from expired plan)
- What P1 claimed to have tokenized (specific patterns/files)

---

### Step 3 — Run hardcoded color scan (full output)

> Note: `code-query.sh --json hardcoded-tokens` emits a prose line ("Scanning src/...") to stdout
> before the JSON object. The pipe below strips non-JSON lines before parsing.

**Run:**
```bash
bash scripts/agent/code-query.sh --json hardcoded-tokens 2>/dev/null \
  | grep -m1 '^{' > /tmp/ux2-r1-hardcoded.json
python3 -c "
import json
with open('/tmp/ux2-r1-hardcoded.json') as f:
    data = json.load(f)
hex_items = data.get('hardcoded_hex', [])
arb_items = data.get('arbitrary_tailwind', [])
print(f'Hardcoded hex occurrences: {len(hex_items)}')
for line in hex_items:
    print(f'  {line}')
print(f'Arbitrary Tailwind occurrences: {len(arb_items)}')
for line in arb_items:
    print(f'  {line}')
"
```

If `code-query.sh --json hardcoded-tokens` exits non-zero or produces no JSON, fall back:
```bash
grep -rn "#[0-9A-Fa-f]\{3,6\}" src/ --include="*.tsx" --include="*.ts" \
  | grep -v "brand/tokens" | grep -v "\.test\."
```

**Record:** total count, full file list with line numbers and hex values.

---

### Step 4 — Run arbitrary Tailwind value scan (full output)

> The full list MUST be embedded in the output file (not referenced via `/tmp`) because UX2-R3
> and folder-structure-v2 need durable evidence. Include every line — no truncation.

**Run:**
```bash
grep -roh --include="*.tsx" -E "[a-z-]+\[[^\]]+\]" src/ \
  | sort | uniq -c | sort -rn \
  > /tmp/ux2-r1-arbitrary.txt
wc -l /tmp/ux2-r1-arbitrary.txt
echo "--- full list (paste this into output file) ---"
cat /tmp/ux2-r1-arbitrary.txt
```

**Record:** total unique arbitrary value patterns, total occurrences, full sorted list embedded in the output file (§ 4).

---

### Step 5 — Check token coverage (which tokens are actually imported)

**Run:**
```bash
grep -rn "from.*brand/tokens\|from.*['\"].*tokens['\"]" src/ \
  --include="*.tsx" --include="*.ts" \
  | cut -d: -f1 | sort -u
```

**Then run:**
```bash
grep -E "^export (const|type|let)" src/brand/tokens.ts
```

**Record:** full list of exported token names, full list of files importing tokens.

---

### Step 6 — Detect dead tokens (exported but never used)

**Run:**
```bash
python3 - << 'EOF'
import subprocess, re

with open('src/brand/tokens.ts') as f:
    content = f.read()

exports = re.findall(r'^export\s+(?:const|type|let)\s+(\w+)', content, re.MULTILINE)
dead = []
used = []

for name in exports:
    result = subprocess.run(
        ['grep', '-r', '--include=*.tsx', '--include=*.ts', '-l', name, 'src/'],
        capture_output=True, text=True
    )
    files = [l for l in result.stdout.strip().split('\n') if l and l != 'src/brand/tokens.ts']
    if not files:
        dead.append(name)
    else:
        used.append((name, len(files)))

print(f'Exported tokens: {len(exports)}')
print(f'Dead tokens ({len(dead)}): {dead}')
print(f'Used tokens ({len(used)}):')
for name, count in sorted(used, key=lambda x: -x[1]):
    print(f'  {name}: {count} file(s)')
EOF
```

**Record:** dead token names (candidates for removal), used token names with file counts.

---

### Step 7 — Write output file

Write `output/UX2-R1-token-status.md` with this exact structure:

```markdown
# UX2-R1 — Token Verification + Gap Analysis
Date: YYYY-MM-DD | Agent: <name> | Codebase state: post-P1

## Session Environment
[paste build-current-state.sh output here]

## Summary
| Metric | Pre-P1 (expired baseline) | Post-P1 (this scan) | Delta |
|--------|--------------------------|---------------------|-------|
| Raw hex values | 269 | N | ±N |
| Arbitrary Tailwind values | N/A | N unique patterns | — |
| Exported tokens | N/A | N | — |
| Dead tokens | N/A | N | — |

## 3a — Remaining raw hex values (full list)
| File | Line | Value | Recommended token |
|------|------|-------|-------------------|
[full list from Step 3 — no truncation]

## 3b — Files with hardcoded colors
[file paths, one per line]

## 4 — Arbitrary Tailwind values in use
| Pattern | Occurrences |
|---------|-------------|
[full list from Step 4]

## 5 — Token coverage
[Files importing tokens — list from Step 5]

## 6 — Dead tokens (exported, never used)
[list from Step 6 — candidates for removal in folder-structure-v2 P1]

## Token gaps (hardcoded values with no token equivalent)
[derived from Step 3 vs Step 5: values found in Step 3 that have no matching token in Step 5]

## P1 completion status
[what P1 claimed (from Step 2 read) vs what Steps 3–6 measured]
```

---

## Acceptance criteria

- [x] Raw hex count is grep-verified (exact number, not estimated)
- [x] Full file list with line numbers for all hardcoded colors
- [x] Arbitrary Tailwind count is full (no `head` truncation)
- [x] Dead token list populated (even if empty — confirm zero dead tokens if so)
- [x] P1 completion status is a quantified before/after comparison
- [x] Output written to `output/UX2-R1-token-status.md`
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
