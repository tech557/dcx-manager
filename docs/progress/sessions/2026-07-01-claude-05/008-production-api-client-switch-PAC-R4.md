## PAC-R4 — Route parity + dev data seed (real vs. contract)
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: pending
Version: v1.0.3.0
Change-Class: source

Intent: Prove the real dispatcher returns contract-valid, mock-equivalent shapes for all 22 routes against real seeded dev data (not just type-level parity), and correct any real vs. hypothesis drift found along the way.
Trigger: Sprint execution, PAC-R4 (plan production-api-client-switch), following PO directive "continue"
Requirements covered: REQ-BE-API-001

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | scripts/backend/seed-dev.mjs | Idempotent dev-data seed script (catalog + 1 tenant fixture) | 215 |
| created | src/services/__tests__/real-dispatch.parity.test.ts | Live 22-route parity suite against real dev data + real auth session | 299 |
| edited | src/services/real-dispatch.ts | Fixed getMyAccessReal/checkDCXAccessReal (RLS-blocked direct memberships query → RPC calls) | 905 (was 863) |
| created | docs/plans/active/production-api-client-switch/output/PAC-R4-parity.md | Sprint output — findings, coverage table, gate results | 174 |
| edited | docs/plans/active/production-api-client-switch/sprints/PAC-R4.md | status Drafted → Completed; all 6 AC checked; fixed missed REQ-BE-API-* wildcard | small |
| edited | docs/plans/active/production-api-client-switch/README.md | Carry-forward — PAC-R4 entry appended | +23 |
| edited | .env.local | Added VITE_SUPABASE_URL/ANON_KEY (dev, anon-only, not secret) + VITE_PAC_R4_TEST_EMAIL/PASSWORD (dev-only fixture) — gitignored | +6 |
| created | docs/product/requirements/graph/nodes/manifestation/{test,function}/... | 2 new manifestation nodes (parity test, seed-dev script) | small |
| created | docs/product/requirements/graph/trace-links/TRC-MAN-{test-...-real-dispatch-parity-test,function-scripts-backend-seed-dev}-TO-REQ-BE-API-001.json | 2 new trace links | small |
| edited | docs/product/requirements/graph/ledger/decision-ledger.jsonl | 4 new ledger entries (2 node + 2 trace-link sign-offs, `Mahmoud (PO)`) | +4 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | No src/builder, src/pages, src/queries changed (git diff empty); the `real-dispatch.ts` edit is a targeted bug fix (RPC calls instead of RLS-blocked table queries), not a boundary change |
| Open decisions used (⏱) | None — OD-PAC-03 (seed-only, not migrate-existing) already decided at PAC-R0, followed as-is |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-PAC-4-0 — ID lock cleared | PASS (also fixed a missed `REQ-BE-API-*` wildcard in this sprint's own frontmatter, left over from an earlier incomplete sweep) |
| AC-PAC-4-1 — dev seeded, non-empty contract-valid data | PASS for 21/22 routes; 1 route (composition write) explicitly BLOCKED on a documented RLS policy defect, not faked |
| AC-PAC-4-2 — parity covers all 22 routes | PASS — 14 GET + 8 mutation, cross-checked against `extract-routes.sh` |
| AC-PAC-4-3 — real vs mock shape-equivalence | PASS — 23/23 tests, 115/115 full suite |
| AC-PAC-4-4 — HYPOTHESIS columns confirmed/corrected | PASS — `communicated_date` confirmed as `timestamptz` |
| AC-PAC-4-5 — no prod apply, no UI change | PASS — prod `list_migrations` = `[]`; UI dirs untouched |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| test | PASS (115/115: 92 pre-existing + 23 new) |
| validate:architecture | PASS (307 modules, 613 deps) |
| verify.sh | PASS |
| req:validate | PASS |
| req:completion-gate (changed) | PASS (after 2 nodes + 2 trace links, signed off) |
| contract-drift | PASS |
| browser manual check | N/A — backend/test-only change, no UI-observable difference |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Finding #3: `channel_compositions_write` RLS policy is broken (raw `memberships` subquery, blocked by RLS — every insert rejected, even for real editors) | Needs a schema/RLS migration (`apply_migration`), which is a PO-gated action per this plan's governance — and out of PAC-R4's own tool scope | Approve a small follow-up migration rewriting the policy's `WITH CHECK` to call `app_user_can_edit(...)` like the other `_write` policies, before PAC-R6 or any real composition-create usage |
| Finding #2: `rationale.md` HYPOTHESIS-resolved note not yet written (outside PAC-R4's `allowed-writes`) | Doc-only, mechanical, but scope-gated | Low priority — approve a doc-only touch-up whenever convenient |

### Consumer updates required
- None — `access.service.ts`'s public interface is unchanged; the fix is internal to `real-dispatch.ts`.

### Open issues / follow-ups
- Finding #3 (composition-write RLS defect) must be resolved before PAC-R6 (prod promotion) or any real use of user-defined compositions — tracked above as a PO action.
- The parity test's `afterAll` cannot fully clean up scratch versions (`activity_events_write` is INSERT-only by design, blocking the version's FK) — each CI/local run leaves 1 orphaned scratch version + activity-log row, requiring periodic `execute_sql`/service-role cleanup. Documented in the test file and output doc; not fixed (needs tooling out of PAC-R4's scope).
- PAC-R2's carried-forward risks (non-transactional builder-tree write; the now-superseded "type-level-only" note, since PAC-R4 now proves live parity) still apply where relevant — the non-transactional-write risk is unaffected by this sprint.
