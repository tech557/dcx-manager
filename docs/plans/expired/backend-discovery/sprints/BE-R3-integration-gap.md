---
sprint: BE-R3
plan: backend-discovery
title: Integration Gap Analysis
status: not-started
depends-on: BE-R1 and BE-R2 (both must be complete)
output: docs/plans/drafted/backend-discovery/output/BE-R3-integration-gap.md
assigned-to: Claude (synthesis — no terminal required)
---

# BE-R3 — Integration Gap Analysis

## Intent

Read BE-R1 (type inventory) and BE-R2 (service audit) and answer one question: if we pointed the app at a real API today, what breaks and in what order should we fix it?

The output is a prioritised fix list that becomes the direct input to P4.

**No source file changes. Pure analysis.**

---

## Synthesis Tasks

### Task 1 — The "plug in a real API" thought experiment

From BE-R2 data: which services call mock data directly?

For each mock-calling service: if that mock call became a real HTTP fetch returning the same shape, what additional changes would be needed?

Work through three scenarios:

**Scenario A — API returns the same shape as mock data**
- What still breaks? (`any` types, missing mappers, missing error handling)
- What works without any change?

**Scenario B — API returns snake_case field names instead of camelCase**
- Which components would receive broken data?
- How many files would need changing?
- This shows the blast radius of not having a proper mapper layer

**Scenario C — API returns a nested structure different from mock**
- Example: mock has `task.channelId` flat; API returns `task.channel.id` nested
- Which components would break? Which mappers would absorb it?
- This shows the value of having typed `Raw*` shapes vs assuming mock = API

---

### Task 2 — Type layer gap map

From BE-R1 data: for each `ambiguous` type, decide:
- Should the API-facing fields become a `Raw*` type?
- Should the UI-derived fields stay in `domain.ts`?
- What is the clean split for each ambiguous type?

Produce a table:
```
| Ambiguous type | Raw fields (move to api-raw.ts) | UI fields (keep in domain.ts) |
```

---

### Task 3 — Fix priority list

Produce an ordered list of changes P4 must make. Order by risk and dependency:

1. Things that fix type safety without changing runtime behaviour (highest priority — zero risk)
2. Things that add missing mappers (medium priority — tested with mapper tests)
3. Things that split files (lower priority — mechanical, can be done last)
4. Things that require a PO decision (flag, don't implement)

---

## Output Format

```markdown
# BE-R3: Integration Gap Analysis

## Scenario A — Same shape, real API

### Would work without changes
- [list]

### Would break (and fix needed)
| Broken thing | Why | Fix |
|---|---|---|
| mapTask(raw: any) | TypeScript won't catch field name typos | Type raw param as RawTask |

## Scenario B — snake_case API

### Blast radius
- N components would receive broken data
- N files would need changing
- Conclusion: [safe / dangerous / needs mapper layer]

## Scenario C — Nested structure

### Blast radius
- [same format]

## Type Layer Split Plan

| Ambiguous type | Raw fields → api-raw.ts | UI fields → domain.ts |
|---|---|---|
| Task | id, action_id, name, status, due_date, locked | isReady, taskKind, dueDate (as Date) |

## P4 Fix Priority List

### Priority 1 — Zero-risk type safety fixes
1. Create `src/types/api-raw.ts` with Raw* types
2. Replace `any` in mapTask with `RawTask`
3. Replace `any` in mapAction with `RawAction`
[etc.]

### Priority 2 — Add missing mappers
4. Add mapChannel() to api-mappers.ts
5. Add mapChannelComposition() to api-mappers.ts
[etc.]

### Priority 3 — File splits (mechanical)
6. Split versions.service.ts → fetch + mapper + service
7. Split api-mappers.ts → mappers/ folder
[etc.]

### Priority 4 — PO decisions needed
- Field naming convention: camelCase or snake_case in RawTask?
- Error handling strategy: throw or return Result<T, Error>?

## Summary for PO

If we connected a real API today with the same data shape:
- N things would break immediately
- N of those are fixable in P4 with zero feature risk
- N require a decision about API contract before they can be fixed

After P4, connecting a real backend requires: [N-line description]
```

---

## Acceptance Criteria

- [ ] All three scenarios analysed with blast radius estimate
- [ ] Type split plan covers all ambiguous types from BE-R1
- [ ] P4 fix list is prioritised and specific (function names, file names, not vague descriptions)
- [ ] PO decisions are clearly separated from implementation tasks
- [ ] No source file changed
