## PAC-R2 — Real dispatcher implementing the 22 routes (flagged)
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.3.0
Change-Class: source

Intent: Implement a real Supabase-backed dispatcher satisfying the exact 22-route contract, selected behind `VITE_USE_REAL_BACKEND` (off by default), so the app can eventually run on Supabase with zero UI/mapper change.
Trigger: Sprint execution, PAC-R2 (plan production-api-client-switch), following PO directive "continue"
Requirements covered: REQ-BE-API-001

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | src/services/real-dispatch.ts | Real dispatcher — all 22 routes against the PAC-R1 dev schema, `Api*`-only boundary | 863 |
| created | src/services/supabase-client.ts | Lazy Supabase JS client + `VITE_USE_REAL_BACKEND`/env reader | 41 |
| edited | src/services/api-client.ts | Whole-dispatcher flip (OD-PAC-04): select `realDispatch`/`mockDispatch` on the flag | 42 (was 36) |
| edited | package.json, package-lock.json | Added `@supabase/supabase-js` dependency | — |
| created | docs/plans/active/production-api-client-switch/output/PAC-R2-real-dispatch.md | Sprint output — AC evidence, gate results, requirement-graph housekeeping | 117 |
| edited | docs/plans/active/production-api-client-switch/sprints/PAC-R2.md | status Drafted → Completed; all 7 AC checked | small |
| edited | docs/plans/active/production-api-client-switch/README.md | Carry-forward — PAC-R2 entry appended | +18 |
| created | docs/product/requirements/graph/nodes/manifestation/service/MAN-service-src-services-{real-dispatch,supabase-client}.json | 2 new manifestation nodes (net-new files) | small |
| created | docs/product/requirements/graph/trace-links/TRC-MAN-service-src-services-{real-dispatch,api-client,supabase-client}-TO-REQ-BE-API-001.json | 3 new trace links, all `implements` → `REQ-BE-API-001` | small |
| edited | docs/product/requirements/graph/ledger/decision-ledger.jsonl | 5 new ledger entries (2 node + 3 trace-link sign-offs, `Mahmoud (PO)`) | +5 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Query layer (`src/queries/**`), `api-mappers.ts`, and all UI (`src/builder/**`, `src/pages/**`) confirmed untouched via `git diff --name-only`; dispatcher never imports the mapper or domain types |
| Open decisions used (⏱) | OD-PAC-02 (builder-tree write) resolved this sprint → full-tree replace (matches mock semantics; schema FKs have no cascading delete, so bottom-up manual delete order was required) |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-PAC-2-0 — ID lock cleared | PASS |
| AC-PAC-2-1 — 22/22 route parity | PASS — programmatic diff, 0 routes only-in-mock, 0 only-in-real |
| AC-PAC-2-2 — flag-off unchanged | PASS — 92/92 tests pass |
| AC-PAC-2-3 — flag-on contract-valid shapes | PASS (type-level; live probe deferred to PAC-R4 per this sprint's own scope) |
| AC-PAC-2-4 — Api\*-only boundary | PASS — no mapper import, no domain types, no `as any`, `src/queries` diff empty |
| AC-PAC-2-5 — no UI change | PASS — `src/builder`/`src/pages`/`src/queries` diff empty |
| AC-PAC-2-6 — contract-drift green | PASS — `capture-contract-snapshot.sh` → "OK — no drift" |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS (0 errors — fixed one `Json`/`ApiJsonValue` structural mismatch via a named `asApiJson<T>` cast) |
| lint | PASS (`eslint src --max-warnings 0`) |
| test | PASS (13 files, 92 tests) |
| validate:architecture | PASS (0 violations, 305 modules) |
| verify.sh | PASS |
| req:validate | PASS |
| req:completion-gate (changed) | Initially FAILED (4 unlinked manifestations) → resolved via 2 new nodes + 3 trace links, all signed off → PASS |
| browser manual check | N/A — backend-only change, flag off by default, no observable UI difference |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None — `api-client.ts`'s public signature is unchanged; callers (services, queries) are unaffected.

### Open issues / follow-ups
- `/access/me` and `/dcx/:dcxId/access` currently default to "no access" when there's no Supabase Auth session (expected pre-PAC-R3 — full auth wiring is PAC-R3's scope, and the flag is off by default so this isn't exercised yet).
- `duplicateVersion`'s real implementation explicitly copies `version_members` rows (mock shares the array by object-spread); intentional and more correct for a real multi-table backend, not a parity gap — full behavioral parity against the contract is PAC-R4's gate.
- Full live route-by-route probe against the applied dev schema (flag on) is deferred to PAC-R4 by this sprint's own scope, not done here.
