---
sprint: BE-R2
plan: backend-discovery
title: Service Layer Audit
status: not-started
parallel-with: BE-R1
output: docs/plans/drafted/backend-discovery/output/BE-R2-service-audit.md
assigned-to: Claude or Codex (read files + grep, terminal required)
---

# BE-R2 — Service Layer Audit

## Intent

Read every file in `src/services/` and `src/actions/`. For each function: what does it do, what are its input/output types, does it use `any`, and which mock does it call? Identify the exact functions that would need to change when a real backend connects.

**No source file changes.**

---

## Extraction Tasks

### Task 1 — Catalogue `src/services/`

```bash
ls src/services/
wc -l src/services/*.ts
```

For each service file, read it and produce:
- List of exported functions with their signature
- Whether the function calls mock data or an external fetch
- Whether the return type is typed or uses `any`
- Whether there is a mapper call between raw data and domain type

### Task 2 — Catalogue `src/actions/`

```bash
ls src/actions/
wc -l src/actions/*.ts
```

Actions mutate state. For each action file:
- List of exported functions
- What store mutation / query invalidation / service call it triggers
- Whether it validates input before calling the service
- Whether error handling is present

### Task 3 — Find all `any` usages in services and actions

```bash
grep -rn ": any\|as any\|<any>" src/services/ src/actions/ | sort
```

For each `any`: what is the actual type that should be there? Can it be inferred from the mock data shape?

### Task 4 — Mapper coverage

```bash
cat src/services/api-mappers.ts
```

For each domain entity (Task, Action, Phase, Version, Channel, ChannelComposition, Project):
- Does a mapper function exist?
- Does it have typed inputs (`Raw*` or explicit shape) or `any`?
- Is the mapper called from queries/services, or does data flow to components unmapped?

```bash
grep -rn "mapTask\|mapAction\|mapPhase\|mapVersion\|mapChannel\|mapProject" src/ --include="*.ts" --include="*.tsx" | grep -v "api-mappers" | sort
```

---

## Output Format

```markdown
# BE-R2: Service Layer Audit

## Service Files

### src/services/versions.service.ts (215 lines)
Exports:
| Function | Input type | Return type | Calls mock? | Has mapper? | Any usages |
|---|---|---|---|---|---|
| getVersion(id) | string | Promise<Version> | Yes (mock/versions) | No — returns mock directly | No |

### src/services/api-mappers.ts (228 lines)
Mapper coverage:
| Entity | Mapper exists? | Input typed? | Called from? |
|---|---|---|---|
| Task | Yes — mapTask() | any — not typed | queries/useTaskQuery.ts |
| Channel | No mapper | — | Raw data used directly in ChannelCompositionSelect |

## Action Files

### src/actions/task.actions.ts (288 lines)
| Action | Calls service | Validates input | Error handling | any usages |
|---|---|---|---|---|
| createTask | versions.service | No | No | 2 |

## `any` Usage Summary

| File | Line | Context | Proposed type |
|---|---|---|---|
| api-mappers.ts:45 | mapAction(raw: any) | Raw action shape | RawAction |

## Real API Readiness per Service

| Service | Ready to swap mock → real API? | Blockers |
|---|---|---|
| versions.service.ts | No | Returns mock directly, no fetch layer, no error handling |
| api-mappers.ts | Partial | mapTask exists but untyped; mapChannel missing |
```

---

## Acceptance Criteria

- [ ] Every exported function in every service file listed with signature
- [ ] Every exported action listed
- [ ] All `any` usages in services and actions listed with proposed types
- [ ] Mapper coverage table shows which entities have typed mappers and which don't
- [ ] "Real API readiness" verdict per service file
- [ ] No source file changed
