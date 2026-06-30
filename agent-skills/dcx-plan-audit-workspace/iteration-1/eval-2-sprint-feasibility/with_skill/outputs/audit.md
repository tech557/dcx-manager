---
audit-of: frontend-discovery-v2
auditor: codex
date: 2026-06-26
verdict: NEEDS REVISION
blocking-issues: 2
advisory-issues: 2
---

# Plan Audit: frontend-discovery-v2

## Verdict

NEEDS REVISION

**Reason:** Sprint FE2-R1 step 4 calls `code-query.sh component --json` with arguments in the wrong order — this command will attempt to look up a component named "--json", fail with an error, and leave the component inventory acceptance criterion unmet; a second issue is that `code-query.sh component` has no all-components listing mode, so there is no executable path to produce the total count, largest-by-consumer, and orphaned-component figures the output format requires.

---

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | FE2-R1 step 4 | `code-query.sh component --json` has arguments in wrong order. The script checks `$1 == "--json"` to set JSON_MODE, then treats `$1` as CMD and `$2` as ARG. Calling `component --json` sets CMD=component, ARG=--json, JSON_MODE=false — the script looks up a component named "--json", fails, and exits non-zero. | `scripts/agent/code-query.sh` lines 9–10: `[[ "${1:-}" == "--json" ]] && { JSON_MODE=true; shift; }` — flag must be first positional. | Replace with `bash scripts/agent/code-query.sh --json component` OR replace the entire step with a direct query against `code-index/components.json` using `python3 -c "import json; d=json.load(open('code-index/components.json')); print(len(d), 'components')"`. |
| 2 | FE2-R1 step 4 | `code-query.sh component` (with or without `--json`) requires a component NAME argument and has no all-components listing mode. The step's stated goal — "total component count, largest components by consumer count, orphaned components" — cannot be produced by any invocation of this command. The python3 inline `json.load(sys.stdin)` fallback also produces nothing actionable (it loads data into a local variable and exits silently). | `scripts/agent/code-query.sh` lines 53–56: `if not arg: print('Usage…'); sys.exit(1)`. No list/inventory subcommand exists. | Replace step 4 with direct `code-index/` queries: `python3 -c "import json; d=json.load(open('code-index/components.json')); usages=json.load(open('code-index/component-usages.json')); ..."` using the actual JSON structure, OR add a `inventory` subcommand to `code-query.sh` that produces count + top-N by consumer. Whichever path is chosen must be verified with `ls code-index/` to confirm the file names before the sprint executes. |

---

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | FE2-R1 step 4 | The stale-index fallback `bash scripts/agent/verify-tooling-state.sh \| grep code_index_stale` pipes the full JSON output of verify-tooling-state.sh through grep and prints only the matching line — this is not a regeneration instruction, it is a staleness check that was already done in step 1. The actual regeneration command `npm run generate:code-index` is mentioned in prose but not in a bash block, so an executing agent (opencode) may skip it. | Sprint step 4 prose: "If code-index is stale: `npm run generate:code-index` first." — not a numbered sub-step. | Make the stale-index branch an explicit conditional bash block: `bash scripts/agent/verify-tooling-state.sh \| python3 -c "import json,sys; d=json.load(sys.stdin); print('STALE') if d['code_index_stale'] else print('FRESH')"` then `npm run generate:code-index` if STALE. |
| 2 | README sprint index | FE2-R2 and FE2-R3 sprint files are listed in the sprint index but were not in scope for this audit. If those files contain similar `code-query.sh` invocations, the same argument-order bug may be present. | Sprint index lists FE2-R2, FE2-R3 as parallel/sequential dependencies. | Audit FE2-R2 and FE2-R3 sprint files for `code-query.sh` invocations before activation. |

---

## Prior art compliance

**Expired frontend-discovery (FE-R1, FE-R2, FE-R3):** The README claims this plan found 98 components, 131 useState, and 5 duplication groups. However, the expired frontend-discovery README does not contain output findings — it is a plan-structure file only. The actual findings should be in `docs/plans/expired/frontend-discovery/output/`. The v2 README correctly references these output files and lists them as required reading before sprint execution. This is compliant.

**Expired src-structure-audit (SA-R1, SA-R2, SA-R3):** All three sprints are marked Complete in the expired README. SA-R1 produced a dependency graph before dep-cruiser was installed. The v2 plan correctly positions FE2-R1 as the dep-cruiser-based successor to SA-R1 and references `SA-R1-dependency-graph.md` in the sprint context. The key SA-R3 finding — that `src/components/` vs `src/ui/` overlap and large-file violations exist — is carried forward explicitly in FE2-R1 step 6 and the file size checks. No SA findings appear to be silently dropped.

**What the v2 plan does not incorporate explicitly:** The expired src-structure-audit README documents a specific finding that `src/components/forms/` (28 files) is builder-specific and misplaced outside `src/builder/`. FE2-R1 step 6 checks `src/components/` status but does not specifically flag the forms/ subfolder for the delta comparison. This is a minor gap — the output format section has a "Delta from expired FE-R1" field that would catch it if the executing agent reads the prior art as instructed.

---

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| FE2-R1 | N/A | N/A | N/A | N/A | N/A | Discovery sprint — no source code changed; `validate:architecture` is run as the subject of the audit, not as a gate on changes |
| FE2-R2 | N/A | N/A | N/A | N/A | N/A | Discovery sprint — no source code changed |
| FE2-R3 | N/A | N/A | N/A | N/A | N/A | Discovery sprint — no source code changed |

Gate coverage is not applicable to this plan. All three sprints are explicitly read-only. The acceptance criteria for each sprint include "No source files changed." This is correctly specified.

---

## Handoff quality

FE2-R1 output format is well-specified: exact file path (`output/FE2-R1-architecture.md`), section headers, and table structures are all defined. The "Blocking issues for folder-structure-v2 P2/P3" section gives the consuming plan (folder-structure-v2) a direct input list. This is sufficient for the next agent.

One gap: the "Component inventory summary" section in the output format requires "Largest consumer count: ComponentName (N consumers)" — this requires querying `code-index/component-usages.json` by consumer frequency. As noted in blocking issue 2, the step that produces this data is not executable as written. The output format will have a blank section unless the step is fixed.

FE2-R3 is listed as "After FE2-R1 + FE2-R2" and its output depends on FE2-R1's component inventory. If FE2-R1's component count is wrong or missing due to the broken step 4, FE2-R3's safe-to-extract list will be based on incomplete data.

---

## Ready checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated (with minor gap noted in advisory)
- [x] Every sprint has executor named (Codex / opencode)
- [x] Every code-modifying sprint has gate coverage (N/A — discovery only)
- [x] Session start steps present in each sprint (FE2-R1 step 1 present)
