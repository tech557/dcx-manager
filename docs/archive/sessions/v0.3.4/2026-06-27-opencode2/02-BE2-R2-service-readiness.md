# 02-BE2-R2-service-layer-readiness
Date: 2026-06-27 | Agent: opencode
Plan: backend-discovery-v2 | Sprint: BE2-R2

## Session Environment
- repository_version: v0.3.4
- All gates available

## Prior Art Read
- `docs/plans/expired/backend-discovery/output/BE-R2-service-audit.md` — 12 services, 0 any, 8 localStorage, apiClient throws

## Measurements

### Service inventory
- **14 files** (+2 new: `mock-dispatch.ts`, `service-utils.ts`)
- 8 localStorage-dependent, 1 direct storage (api-client), 5 pure stubs/no I/O (ai, clickup, error-reporter, api-mappers, service-utils)

### localStorage usage
- **8 services** still use localStorage (same as pre-P1)
- All go through `readMockJson`/`writeMockJson` in api-client.ts
- Only api-client.ts directly touches `safeLocalStorage`

### apiClient status
- **No longer throws** — delegates to `mockDispatch()` which routes to real service functions
- `mock-dispatch.ts` defines 22 route patterns covering all endpoints
- **0 callers** — no service or component calls `apiClient()` directly

### Error handling
- **9 services** use `withServiceErrorHandler` wrapper (new P4 utility)
- 3 without: clickup (stub), error-reporter (IS the handler), api-mappers (pure functions)
- Massive improvement from pre-P1 where 7 services had 0 error handling

### Mapper coverage
- 100% — all entities have bi-directional typed mappers
- No mappers referenced in services (services return Api types, queries map them)

## Output Written
- `docs/plans/drafted/backend-discovery-v2/output/BE2-R2-service-readiness.md` (detailed)
- `output/BE2-R2-SERVICE-SUMMARY.md` (summary)

## Blockers for P4
1. 8 localStorage services need `readMockJson` → `apiClient()` migration
2. `apiClient()` has 0 callers — seam exists but unused
3. `attachVersionFile` is no-op stub
4. `mockDispatch` uses `JSON.parse` on body strings — needs proper serialization for real fetch
5. ai/clickup stubs need decision: implement or keep

## Next
Ready for BE2-R3 (Integration Gap Report — requires BE2-R1 + BE2-R2 outputs)
