---
sprint: P4-backend-readiness
plan: folder-structure-v2
version_context: v0.3.4
status: completed
executor: Codex
depends-on: P3-structure-quality
inputs:
  - docs/plans/completed/backend-discovery-v2/output/BE2-R1-type-health.md
  - docs/plans/completed/backend-discovery-v2/output/BE2-R2-service-readiness.md
  - docs/plans/completed/backend-discovery-v2/output/BE2-R3-gap-report.md
output: docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md
---

# P4 — Backend Readiness

## Goal

Wire all 8 localStorage-dependent services to call `apiClient()` instead of `readMockJson`/`writeMockJson`.
`apiClient` is already wired to `mockDispatch` with 22 routes — this sprint makes the services USE it.
After the swap, delete the `safe-storage.ts` util, strip `readMockJson`/`writeMockJson` from `api-client.ts`,
and decide on `mock-dispatch.ts` and `src/mock/` seed data.

## Execution method

Codex is executing this sprint one task at a time. After each completed task, Codex must:
- update this sprint file before moving to the next task;
- append/update the P4 output file;
- write a task log in `docs/progress/sessions/2026-06-28-codex/`;
- run `bash scripts/build-log-index.sh`;
- leave unavailable MCP/browser-only checks for opencode instead of claiming them.

## Task Progress

| Task | Status | Notes |
|------|--------|-------|
| Step 0 — Session environment + data-domain inventory | Completed | P3 Claude review read; BE2 discovery outputs read; current service inventory captured; recursion risk identified because `mock-dispatch.ts` currently calls services. |
| Step 1 — Wire logs.service.ts to apiClient | Completed | Activity-log handlers moved into `mock-dispatch.ts`; `logs.service.ts` now calls `apiClient`; typecheck/test pass. |
| Step 2 — Wire subtask-definitions.service.ts to apiClient | Completed | Subtask definition handlers moved into `mock-dispatch.ts`; service now calls `apiClient`; typecheck/test pass. |
| Step 3 — Wire channels.service.ts to apiClient | Completed | Channel/composition handlers moved into `mock-dispatch.ts`; service now calls `apiClient`; composition side effect preserved; typecheck/test pass. |
| Step 4 — Wire access.service.ts to apiClient | Completed | Access handlers moved into `mock-dispatch.ts`; service now calls `apiClient`; permissive mock defaults preserved; typecheck/test pass. |
| Step 5 — Wire files.service.ts to apiClient | Completed | File handlers moved into `mock-dispatch.ts`; service now calls `apiClient`; `attachVersionFile` persists attachments; typecheck/test pass. |
| Step 6 — Wire versions.service.ts to apiClient | Completed | Version lifecycle handlers moved into `mock-dispatch.ts`; service now calls `apiClient`; transition/approval/supersede logic preserved; typecheck/test pass. |
| Step 7 — Wire builder.service.ts to apiClient | Completed | Builder handlers moved into `mock-dispatch.ts`; service now calls `apiClient`; duplicate builder-copy path now uses internal mock helpers; typecheck/test pass. |
| Step 8 — Cleanup + completeness matrix | Completed | `api-client.ts` helpers removed; `safe-storage.ts` deleted; mock backend split under `src/services/mock/`; grep proof and matrix recorded; typecheck/build/test/focused lint pass. |
| Step 9 — Full gates + browser handoff | Completed with documented debt | Local gates run: typecheck/test/build/architecture pass; repo-wide lint fails on known backlog at 119 problems; focused lint on touched files passes; browser/MCP evidence left for opencode. |
| Step 10 — Carry-forward update | Completed | README carry-forward updated with P4 service seam, cleanup, matrix, gates, and opencode browser/MCP handoff. |

---

## Read before starting

```
docs/plans/completed/backend-discovery-v2/output/BE2-R3-gap-report.md   ← authoritative fix list (primary)
docs/plans/completed/backend-discovery-v2/output/BE2-R2-service-readiness.md  ← service inventory + localStorage map
docs/plans/completed/backend-discovery-v2/output/BE2-R1-type-health.md  ← type health baseline
```

Key facts from discovery:
- `apiClient()` in `src/services/api-client.ts` delegates to `mockDispatch()` — already returns real data
- `mockDispatch.ts` has 22 routes covering all 8 service domains
- 0 services currently call `apiClient()` — all 8 use `readMockJson`/`writeMockJson` directly
- `files.service.ts:attachVersionFile` is a no-op stub even in mock mode — must be fixed
- Advisory: `logs.service.ts` appears twice in BE2-R3 fix list — treat as ONE service

---

## Steps — ordered by risk (low to high)

### Step 0 — Session environment + data-domain inventory

```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

Record both outputs verbatim in `output/P4-backend-readiness.md` under a `## Session Environment`
section. Confirm `version_context` (`v0.3.4`) matches `docs/VERSION.md` `current`; if mismatched,
stop and ask the PO. Confirm P3 output exists — if `output/P3-structure-quality.md` is missing, stop.

**Carry-forward contract (MANDATORY — read before any edit).** Read the README
`## Carry-forward contract — current structural state` section **and** the P1–P3 `output/*.md`, and
obey the **REUSE-don't-RECREATE** rule. For P4 specifically: wire services to the **existing**
`apiClient()` → `mockDispatch` seam and reuse the existing routes/fixtures in `src/services/mock-dispatch.ts`
and `src/mock/*`; add a route/fixture only when the data-domain matrix proves one is missing — never
build a parallel data path. At sprint end, update the README carry-forward block with what P4 changed.

Then build the **starting data-domain inventory** (the baseline for the Step 8f completeness matrix).
List every application data domain and how it currently reaches data — not just the 8 services in the
swap list, but all of: campaign/dcx, builder, version, channel/composition, file, access, activity-log,
subtask-definition, **and `clickup.service.ts`** (a pure stub):

```bash
ls src/services/*.service.ts
grep -rn "readMockJson\|writeMockJson\|localStorage" src/services/*.service.ts
grep -nE "pattern:|method:" src/services/mock-dispatch.ts   # the existing route table
```

Record a baseline row per domain: `domain | service file | current source (localStorage / apiClient /
pure stub) | mock-dispatch route present? (Y/N)`. This baseline is what Step 8f proves was closed.

---

### Step 1 — Wire logs.service.ts to apiClient

```bash
cat src/services/logs.service.ts
```

Replace `readMockJson` / `writeMockJson` calls with `apiClient()` calls using the matching
mock-dispatch route (check `src/services/mock-dispatch.ts` for the exact route patterns).

Example transformation:
```typescript
// Before
const data = await readMockJson<ActivityEvent[]>('activity-logs');

// After
const response = await apiClient<ActivityEvent[]>('/activity-logs');
if (!response.ok) throw new Error(response.error);
return response.data;
```

```bash
npm run typecheck
npm run test
```

Acceptance: `logs.service.ts` has 0 references to `readMockJson`/`writeMockJson`. Gates pass.

---

### Step 2 — Wire subtask-definitions.service.ts to apiClient

```bash
cat src/services/subtask-definitions.service.ts
```

Same pattern as Step 1. Check mock-dispatch route.

```bash
npm run typecheck
npm run test
```

Acceptance: `subtask-definitions.service.ts` uses `apiClient`. Gates pass.

---

### Step 3 — Wire channels.service.ts to apiClient

```bash
cat src/services/channels.service.ts
```

`channels.service.ts` has 4 localStorage refs. The `createComposition` function has side-effect
writes — these now route through `apiClient` POST.

After wiring:
```bash
npm run typecheck
npm run test
# Verify channel/composition flows still work in browser
```

Acceptance: `channels.service.ts` uses `apiClient`. Gates pass.

---

### Step 4 — Wire access.service.ts to apiClient

```bash
cat src/services/access.service.ts
```

Note: currently returns `{isAuthenticated: true, canEdit: true}` hardcoded.
The mock-dispatch route for access should return the same mock data.
Confirm the route exists in `mock-dispatch.ts` before wiring.

```bash
npm run typecheck
npm run test
```

Acceptance: `access.service.ts` uses `apiClient`. Gates pass.

---

### Step 5 — Wire files.service.ts to apiClient (and fix attachVersionFile)

```bash
cat src/services/files.service.ts
```

Two changes required:
1. Wire `getVersionFiles` to `apiClient`
2. Fix `attachVersionFile` — currently a no-op stub that returns input without saving.
   Wire it to `apiClient` POST to actually persist the attachment via mock-dispatch.

Check mock-dispatch for the file attachment route. If no route exists for `attachVersionFile`,
add it to `mock-dispatch.ts` first (route: `POST /versions/:id/files`).

```bash
npm run typecheck
npm run test
```

Acceptance: `files.service.ts` uses `apiClient`. `attachVersionFile` actually saves. Gates pass.

---

### Step 6 — Wire versions.service.ts to apiClient

```bash
cat src/services/versions.service.ts
```

`versions.service.ts` is high-risk (feeds MetadataIsland and version actions).
Wire each function: `getVersions`, `getVersion`, `updateStatus`, `updateVersionDate`, `duplicateVersion`.

`updateStatus` uses `lifecycle.rules` — preserve that logic, only replace the storage read/write.

After wiring:
```bash
npm run typecheck
npm run test
# Test version lifecycle in browser: open a version, update a field, verify persistence
```

Acceptance: `versions.service.ts` uses `apiClient`. Status transition logic preserved. Gates pass.

---

### Step 7 — Wire builder.service.ts to apiClient

```bash
cat src/services/builder.service.ts
```

Highest-risk service (central data pipeline, feeds StageProvider). The `seedPhases()` call is a
localStorage fallback — with apiClient, if the builder returns 404, return an empty builder, do not seed.

After wiring:
```bash
npm run typecheck
npm run test
# Critical: open builder and verify stage loads without seed data fallback
npm run build 2>&1 | tail -10
```

Acceptance: `builder.service.ts` uses `apiClient`. No `seedPhases` fallback needed. Builder loads.

---

### Step 8 — Post-swap cleanup

After all 8 services are wired, clean up the now-unused mock infrastructure:

**8a. Verify no service uses readMockJson/writeMockJson:**
```bash
grep -rn "readMockJson\|writeMockJson" src/services/ --include="*.ts"
# Should return 0 lines (except api-client.ts where they're defined)
```

**8b. Remove readMockJson/writeMockJson from api-client.ts:**
Delete the function definitions — keep only `apiClient()` and its types.

**8c. Delete safe-storage.ts:**
```bash
grep -rn "safe-storage\|safeLocalStorage" src/ --include="*.ts" --include="*.tsx"
# Should return 0 lines after 8b
```
Delete `src/utils/safe-storage.ts`.

**8d. Retain mock-dispatch.ts as the dev/mock layer (do NOT delete):**
This plan ships mock data on purpose — `mockDispatch` IS the data backend for offline dev. Keep
`src/services/mock-dispatch.ts` and add a header comment marking it the **retained dev/mock layer**,
not unfinished work. The real `fetch`-based production swap (Vercel / GitHub / Supabase / ClickUp
secrets) is **out of scope here** and belongs to the named follow-up:

> **Follow-up sprint (not in this plan): `production-api-client-switch`** — replaces the
> `apiClient → mockDispatch` delegation with `apiClient → fetch` against real endpoints, wires
> secrets, and retires `src/mock/`. Tracked in the README "Frontend readiness chain" §3. Future
> agents must NOT read mock retention as backend completion.

Do not collapse the seam into `fetch` in this sprint. Document the retention decision in output.

**8e. Retain src/mock/ seed data (do NOT delete):**
- The 4 seed files (`channels.ts`, `compositions.ts`, `subtask-definitions.ts`, `constants.ts`)
  remain the mock fixtures consumed by `mockDispatch`.
- Keep `src/mock/` for as long as `mock-dispatch.ts` is retained (i.e. until the follow-up
  production-api-client-switch sprint).

```bash
npm run typecheck
npm run build
npm run test
```

---

### Step 8f — Mock API completeness matrix (data-domain coverage)

Mock data is acceptable for this plan, but **every app-facing data domain must route through the
mock API seam** (`apiClient` → `mockDispatch`), not just the 8 swapped services. Otherwise the
future production-integration plan starts from hidden data-source gaps.

Using the Step 0 baseline inventory, produce the completeness matrix and prove it:

```bash
# Prove no app-facing service bypasses the seam (except documented pure stubs):
grep -rn "readMockJson\|writeMockJson\|localStorage" src/services/*.service.ts
# ^ expected: 0 lines (all swapped). Any remaining line must be a documented pure stub.

# Confirm every domain has a matching mock-dispatch route:
grep -nE "pattern:|method:" src/services/mock-dispatch.ts
```

Build the matrix — one row per data domain:

| Domain | Service | Routed via apiClient? | mock-dispatch route | Seed fixture | Notes |
|--------|---------|----------------------|---------------------|--------------|-------|
| channels/compositions | channels.service.ts | ✓ | `GET/POST /api/channels...` | src/mock/channels.ts | — |
| builder | builder.service.ts | ✓ | `GET/PATCH /versions/:id/builder` | — | — |
| versions | versions.service.ts | ✓ | `GET/PATCH /versions...` | — | — |
| files | files.service.ts | ✓ | `GET/POST /versions/:id/files` | — | attachVersionFile now persists |
| activity-logs | logs.service.ts | ✓ | `GET/POST .../activity-logs` | — | — |
| subtask-definitions | subtask-definitions.service.ts | ✓ | `GET /api/subtask-definitions` | src/mock/subtask-definitions.ts | — |
| access | access.service.ts | ✓ | `GET /access/me`, `/dcx/:id/access` | — | — |
| clickup | clickup.service.ts | n/a — **pure stub** | `GET /clickup/entry/:id` | — | documented stub, not a localStorage bypass |
| ai | ai.service.ts | n/a — stub | `POST /ai/review-draft` | — | per plan decision: AI stays a stub |

For any domain that is app-facing but has **no** mock-dispatch route: add the missing route
(and a seed fixture if the handler needs data) to `mock-dispatch.ts` so coverage is complete.
For any domain that is intentionally a pure stub (clickup, ai): label it explicitly so it is not
mistaken for a hidden localStorage bypass.

Record this matrix in the output. This is the "clean mock API matrix" the audit requires the plan
to leave behind for the follow-up production-integration plan.

Acceptance: 0 app-facing services bypass the seam (grep-proven); every app-facing domain has a
mock-dispatch route; pure stubs (clickup, ai) are explicitly labelled; missing routes/fixtures added.
`safe-storage.ts` deleted. mock-dispatch.ts + src/mock/ retained and documented as the dev/mock layer.
All gates pass.

---

### Step 9 — Full gate check + output

```bash
npm run typecheck
npm run lint
npm run validate:architecture
npm run test
```

Browser verify (executable):
```bash
npm run dev   # serves http://localhost:3000 (per vite.config.ts)
```
Using Playwright (`baseURL: http://localhost:3000`) or the `chrome-devtools` MCP, exercise the
mock-API-backed flows and capture console + network evidence (a console error fails the gate):
- App loads at `http://localhost:3000`, builder opens
- Channels load in task creation flow (now via `apiClient` → `mockDispatch`)
- Version metadata loads and saves; attach a version file and confirm it persists (attachVersionFile fix)
- Record the console-error count (target: 0 — list any errors) and capture the network calls hitting
  the mock routes as evidence the seam is live

**Tooling fallback (core.md §28).** If Playwright/chrome-devtools MCP or the Chromium binary is
unavailable in-session (known gap — see README carry-forward "documented debt"), do not fake the
gate: run dev-smoke (`npm run dev` + HTTP 200 + console capture), mark the browser gate
`BLOCKED — Playwright unavailable`, and record `PASS WITH DOCUMENTED DEBT`. The mock-route network
evidence may instead be shown via the service unit path / logged `mockDispatch` calls.

Write output to `docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md`:

```markdown
# P4 — Backend Readiness Output
Date: {date} | Agent: {agent}

## Session Environment
{build-current-state.sh + verify-tooling-state.sh output}

## Mock API completeness matrix
{the Step 8f domain → route → fixture table; 0 app-facing bypasses, pure stubs labelled}

## Service migration
| Service | Status | Notes |
|---------|--------|-------|
| logs.service.ts | ✓ wired | — |
| subtask-definitions.service.ts | ✓ wired | — |
| channels.service.ts | ✓ wired | — |
| access.service.ts | ✓ wired | — |
| files.service.ts | ✓ wired + fixed attachVersionFile | — |
| versions.service.ts | ✓ wired | status logic preserved |
| builder.service.ts | ✓ wired | no seed fallback |

## Cleanup decisions
- readMockJson/writeMockJson: removed from api-client.ts ✓
- safe-storage.ts: deleted ✓
- mock-dispatch.ts: **retained** — dev/mock layer; production fetch swap is the follow-up `production-api-client-switch` sprint
- src/mock/: **retained** — mock fixtures for mock-dispatch; retired by the follow-up sprint

## Gate results
{typecheck/lint/arch/test/browser}

## What breaks if localStorage is cleared now
{updated post-swap assessment}
```

---

### Step 10 — Continuity wiring (final step, MANDATORY — core.md §27)

Update the README `## Carry-forward contract — current structural state` section with what P4 changed,
so it wires forward to **P5**:
- Which services now route through `apiClient` → `mockDispatch`; that `readMockJson`/`writeMockJson`
  and `safe-storage.ts` are gone; that `mock-dispatch.ts` + `src/mock/` are the retained dev/mock layer.
- The mock-API completeness matrix result (every app-facing domain covered; pure stubs labelled).
- Confirm **no component/shell change** (P4 is backend-only — shells and `src/ui/*` untouched).
- Any new documented debt; refresh the lint count.

**P4 is not closeable until this update is written** (sprint-level close requires it — `dcx-sprint-close`).

---

## Acceptance criteria

- [x] `## Session Environment` recorded from both agent scripts in the output
- [x] 0 services use `readMockJson`/`writeMockJson`
- [x] `readMockJson`/`writeMockJson` removed from `src/services/api-client.ts`
- [x] `src/utils/safe-storage.ts` deleted
- [x] `attachVersionFile` actually saves (not a no-op stub)
- [x] **Mock API completeness matrix** in output: every app-facing domain routes through `apiClient`→`mockDispatch`; 0 app-facing bypasses (grep-proven); pure stubs (clickup, ai) labelled; missing routes/fixtures added
- [x] mock-dispatch.ts + src/mock/ retained and documented as the dev/mock layer; `production-api-client-switch` named as the follow-up production sprint
- [x] `npm run typecheck` → 0 errors
- [x] `npm run lint` → **0 NEW problems introduced by P4** (pre-existing backlog now 119; focused lint on touched files passes)
- [x] `npm run test` → all pass
- [x] `npm run build` → succeeds
- [ ] Browser: dev server on port 3000, builder opens, channels/versions load, file-attach persists, network shows mock routes hit, console-error count 0 — **left for opencode per user request**
- [x] No component/shell regression (P4 is backend-only — `src/ui/*` and shells untouched)
- [x] **Step 10 done:** README carry-forward contract updated with what P4 changed (core.md §27) — P4 not closeable without it
