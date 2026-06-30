---
sprint: BE-R1
plan: backend-discovery
title: Type + Mock Inventory
status: not-started
parallel-with: BE-R2
output: docs/plans/drafted/backend-discovery/output/BE-R1-type-inventory.md
assigned-to: Claude or Codex (read files + grep, terminal required)
---

# BE-R1 — Type + Mock Inventory

## Intent

Read every type in `src/types/` and every mock in `src/mock/`. Classify each type as: raw API shape, UI domain type, or ambiguous. Cross-reference types with mock data to identify mismatches. No changes made.

---

## Extraction Tasks

### Task 1 — Catalogue `src/types/api.ts` (166 lines)

```bash
cat src/types/api.ts
```

For each exported type/interface, classify:
- **`raw-api`** — represents what a server would return (flat IDs, snake_case or camelCase fields, no computed fields)
- **`ui-domain`** — has computed fields (`isReady`, `taskKind`), Date objects instead of strings, UI-only status derivations
- **`ambiguous`** — mix of both, unclear which layer it belongs to

Also note:
- Types that use `any`
- Types that are nested in ways that suggest tight coupling (UI fields inside API shapes)
- Types that are identical to or redundant with types in `domain.ts`

### Task 2 — Catalogue `src/types/domain.ts` (163 lines)

Same classification as Task 1. Cross-reference with `api.ts`:
- Which types are defined in both files? (duplication)
- Which types exist in `domain.ts` but have no equivalent in `api.ts`? (UI-only)
- Which types in `api.ts` should actually be in `domain.ts`?

### Task 3 — Catalogue `src/mock/` data

```bash
ls src/mock/
cat src/mock/*.ts
```

For each mock data file:
- What type does the mock data claim to be?
- Does the mock data shape actually match the type? (spot-check 3 fields per entity)
- Does any mock data have fields that aren't in any type definition? (undocumented fields)
- Does any type have required fields that the mock leaves undefined?

### Task 4 — Type usage map

```bash
# Which types from api.ts are actually used in components?
grep -rn "import.*from.*types/api\|import.*from.*types/domain" src/ --include="*.tsx" --include="*.ts" | grep -v "types/" | sort
```

For each type: which files import it? Are any types defined but never imported (dead types)?

---

## Output Format

```markdown
# BE-R1: Type + Mock Inventory

## api.ts Types

| Type | Fields | Classification | Problems |
|---|---|---|---|
| Task | id, name, status, channelId, … | ambiguous | Has `isReady` (UI computed) + `channel_id` (API snake_case) — mixed |
| Channel | id, name, kind | raw-api | Clean |

## domain.ts Types

| Type | Classification | Duplicate in api.ts? | Notes |
|---|---|---|---|

## Mock Data vs Type Mismatches

| Entity | Mock file | Mismatch found | Details |
|---|---|---|---|
| Task | mock/tasks.ts | Yes | Mock has `channelCompositionId` but type has `channel_composition_id` |

## Dead Types (defined, never imported outside types/)

| Type | File | Action |
|---|---|---|

## Summary
- Total types in api.ts: N (raw-api: N, ui-domain: N, ambiguous: N)
- Total types in domain.ts: N
- Types duplicated across both files: N
- Mock/type mismatches: N
- Dead types: N
```

---

## Acceptance Criteria

- [ ] Every exported type from `api.ts` and `domain.ts` classified
- [ ] Every mock data file compared against its claimed type
- [ ] Type usage map shows which files import which types
- [ ] Dead types identified
- [ ] No source file changed
