# FE2-R1 Sprint Feasibility Audit
Date: 2026-06-26

## Scope
Verify whether the dep-cruiser and code-index steps in
`docs/plans/drafted/frontend-discovery-v2/sprints/FE2-R1-architecture-audit.md`
are executable as written.

---

## Step 2 — dep-cruiser (`npm run validate:architecture`)

**Verdict: EXECUTABLE**

- `dependency-cruiser` is listed in `devDependencies` (`^18.0.0`) and the binary
  exists at `node_modules/.bin/depcruise`.
- `package.json` defines the script:
  ```
  "validate:architecture": "depcruise src --config .dependency-cruiser.cjs"
  ```
- `.dependency-cruiser.cjs` exists at the repo root.
- The command `npm run validate:architecture 2>&1` as written in Step 2 is valid and
  will produce output that can be parsed for violations.

No issues.

---

## Step 4 — code-index (`bash scripts/agent/code-query.sh component --json`)

**Verdict: EXECUTABLE WITH CAVEAT — index must exist first**

### What exists
- `scripts/agent/code-query.sh` exists and accepts `--json` and `component` as
  the sprint specifies.
- `scripts/generate-code-index.ts` exists and is wired as
  `npm run generate:code-index`.
- `code-index/` directory **already exists** with four files:
  - `component-usages.json`
  - `components.json`
  - `text-labels.json`
  - `unresolved.json`

### Issue with the step-4 command as written
The sprint writes:
```bash
bash scripts/agent/code-query.sh component --json 2>/dev/null | python3 -c "
import json, sys
data = json.load(sys.stdin) if sys.stdin.readable() else {}
" || bash scripts/agent/verify-tooling-state.sh | grep code_index_stale
```

Two problems:

1. **Argument order is wrong.** `code-query.sh` expects `[--json] <command>`, not
   `<command> --json`. Passing `component` first and `--json` second will treat
   `--json` as the `ARG` (search term), not the flag. The `--json` flag is only
   parsed when it is `$1`. The component lookup will run in human-readable mode
   and the Python pipe will likely receive non-JSON output, causing a
   `json.JSONDecodeError`.
   **Fix:** swap to `bash scripts/agent/code-query.sh --json component`.

2. **The Python snippet does nothing.** `json.load` reads the data into `data` but
   nothing is printed or validated. For an inventory count the step would need
   `print(len(data))` or similar. As written it silently succeeds even if the input
   is empty. This means the acceptance criterion "Component inventory count from
   code-index (not manually counted)" cannot be satisfied by this command alone.
   **Fix:** extend the Python snippet to print the count, e.g.
   `print(f"Total components: {len(data)}")`.

### Fallback branch
`|| bash scripts/agent/verify-tooling-state.sh | grep code_index_stale` is valid —
`verify-tooling-state.sh` exists and would surface staleness.

---

## Step 3 — file size checks

**Verdict: EXECUTABLE**

All `find` + `awk` + `wc -l` commands are standard POSIX. The directories
`src/actions`, `src/services`, and `src/rules` all exist. No issues.

---

## Steps 1, 5, 6 — environment check, violation detail, placement audit

**Verdict: EXECUTABLE**

- `build-current-state.sh` and `verify-tooling-state.sh` both exist in
  `scripts/agent/`.
- `ls src/components/` and `find src/ui/` / `find src/builder/` are plain shell
  commands with no dependencies.

---

## Summary

| Step | Command / tool | Status | Blocker? |
|------|---------------|--------|----------|
| 1 | `build-current-state.sh` / `verify-tooling-state.sh` | OK | No |
| 2 | `npm run validate:architecture` | OK | No |
| 3 | `find` + `wc -l` size checks | OK | No |
| 4 | `code-query.sh component --json` | **Broken** — wrong arg order; Python sink does nothing | Yes — acceptance criterion "count from code-index" cannot be met |
| 5 | Manual dep-cruiser output analysis | OK | No |
| 6 | `ls src/components/` / `find src/ui src/builder` | OK | No |

---

## Recommendation

The sprint is **safe to activate** with one mandatory fix before execution:

> In Step 4, change:
> ```bash
> bash scripts/agent/code-query.sh component --json 2>/dev/null | python3 -c "..."
> ```
> to:
> ```bash
> bash scripts/agent/code-query.sh --json component 2>/dev/null | python3 -c "
> import json, sys
> data = json.load(sys.stdin)
> print(f'Total components: {len(data)}')
> "
> ```

All other steps are executable as written.
