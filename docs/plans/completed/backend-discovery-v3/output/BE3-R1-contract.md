# BE3-R1 — API contract freeze (output)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Version: v1.0.1.0 · Change-Class: non-source

## What this sprint produced

The implicit 22-route contract surface is now an explicit, machine + human, **drift-checkable** spec, proven
to match the live `Api*` types.

| Artifact | Path | Purpose |
|---|---|---|
| Deterministic route extractor | `scripts/backend/extract-routes.sh` (+ `.mjs`) | parses `mock-dispatch.ts` route table → JSON `{method, path, paramNames, mutation}`; the single authoritative route list (no `grep -c` anywhere) |
| Machine contract | `docs/backend/contract/contract.json` | 22 enriched entries: method/path/params/req-type/resp-type/service/family |
| Human contract | `docs/backend/contract/contract.md` | grouped by 8 families + drift findings + honesty gate |
| Type round-trip check | `scripts/backend/check-contract-types.ts` + `tsconfig.contract-check.json` | asserts each contract response/request type ≡ the live service/`Api*` type |

## Acceptance criteria

| Criterion | Verdict | Evidence |
|---|---|---|
| AC-BE3-1-1 — every extracted route has exactly one contract.json entry | ✅ PASS | `extract-routes.sh \| jq length` = 22 = `jq '.routes\|length' contract.json`; method+path set diff empty |
| AC-BE3-1-2 — each entry records method/path/params/req-type/resp-type/service | ✅ PASS | schema of `contract.json` — all fields present per entry |
| AC-BE3-1-3 — contract type-check passes against live `Api*` types | ✅ PASS | `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` → exit 0 |
| AC-BE3-1-4 — drift list produced | ✅ PASS | drift section in `contract.md`: `error-reporter` `POST /error-reports` unregistered stub flagged; all 22 routes have callers; no unregistered live call |
| AC-BE3-1-5 — no `src/**` changed | ✅ PASS | `git diff --name-only -- src/` empty; no untracked src |

## Route-parity evidence
```
extractor=22  contract=22  → PARITY PASS
diff(extractor method+path, contract method+path) → ROUTE-SET IDENTICAL
```

## Drift summary
- ⚠️ `error-reporter.service.ts` declares `@route POST /error-reports` but it is **not** registered and is a
  local `console.error` stub (no `apiClient`). Flagged as an internal error sink — a v1 decision, not a
  backend contract route. (Recommend keep out of v1 backend contract.)
- `api-client.ts` `@route ANY /api/*` is the generic seam, not a discrete route (expected).
- All 22 registered routes have callers; no unregistered live `apiClient` route.

## Gates

| Gate | Result |
|---|---|
| route parity (deterministic) | PASS (22 == 22, identical set) |
| type round-trip (`tsc -p tsconfig.contract-check.json`) | PASS (0 errors) |
| no-src diff | PASS (empty) |
| `req:validate` | run at sprint-close (docs/scripts only) |

## Follow-ups
- The contract-drift CI gate is authored in BE3-R5a (`capture-contract-snapshot.sh`) and wired live in
  BE3-R5b — it will re-emit the contract on every preview and fail on divergence.
- Build plan decision needed: is `POST /error-reports` a real v1 endpoint? (recommend no.)
