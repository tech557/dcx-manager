## PAC-R3 — Supabase Auth wiring → MyAccess/DCXAccess + RLS
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.3.0
Change-Class: source

Intent: Replace mock open-access with real Supabase Auth (email + Google OAuth) + RLS, proving the workspace-scoped tenant-isolation and role-based edit gating on real Postgres RLS, with the existing `MyAccess`/`DCXAccess` interface and `RouteGuard`/`permissions.rules.ts` unchanged.
Trigger: Sprint execution, PAC-R3 (plan production-api-client-switch), following PO directive "continue"
Requirements covered: REQ-BE-AUTH-001, REQ-PR-002

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | src/services/supabase-auth.ts | Session wiring: signInWithEmail/signInWithOAuth/signOut/getCurrentSession/onAuthStateChange | 42 |
| edited | src/ui/auth/LoginRedirect.tsx | Real sign-in form (email magic-link + Google OAuth), was a static placeholder | 62 (was 9) |
| edited | src/ui/auth/RouteGuard.tsx | Additive: subscribes to auth-state changes only when the real-backend flag is on, invalidates `access.me` via existing `queryClient` | 57 (was 43) |
| created | docs/plans/active/production-api-client-switch/output/PAC-R3-auth.md | Sprint output — AC evidence, RLS matrix results, gate results | 93 |
| edited | docs/plans/active/production-api-client-switch/sprints/PAC-R3.md | status Drafted → Completed; all 6 AC checked | small |
| edited | docs/plans/active/production-api-client-switch/README.md | Carry-forward — PAC-R3 entry appended | +17 |
| created | docs/product/requirements/graph/nodes/manifestation/service/MAN-service-src-services-supabase-auth.json | New manifestation node | small |
| created | docs/product/requirements/graph/trace-links/TRC-MAN-service-src-services-supabase-auth-TO-REQ-BE-AUTH-001.json, TRC-MAN-react-component-src-ui-auth-loginredirect-TO-REQ-PR-002.json | 2 new trace links | small |
| edited | docs/product/requirements/graph/ledger/decision-ledger.jsonl | 3 new ledger entries (1 node + 2 trace-link sign-offs, `Mahmoud (PO)`) | +3 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | `MyAccess`/`DCXAccess` interfaces unchanged (no edit to `access.service.ts`); `permissions.rules.ts` untouched; `RouteGuard` edit is additive-only and flag-gated |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-PAC-3-0 — ID lock cleared | PASS |
| AC-PAC-3-1 — interfaces unchanged | PASS — `npm run typecheck` 0 errors, no edit to `access.service.ts` |
| AC-PAC-3-2 — tenant isolation | PASS — outsider denied (0 rows), member reads (1 row), on real dev RLS |
| AC-PAC-3-3 — role-based edit gating | PASS — editor write succeeds, viewer write denied (0 rows updated) |
| AC-PAC-3-4 — RouteGuard/permissions unchanged | PASS — additive-only, flag-gated, 92/92 tests unaffected |
| AC-PAC-3-5 — advisors clean, RLS enabled, no prod apply | PASS — unchanged from PAC-R1 baseline; prod `list_migrations` = `[]` |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS (0 errors) |
| lint | PASS |
| test | PASS (92/92, unchanged) |
| validate:architecture | PASS (307 modules, 613 deps) |
| verify.sh | PASS |
| req:validate | PASS |
| req:completion-gate (changed) | PASS (after 1 node + 2 trace links, signed off) |
| contract-drift | PASS |
| RLS multi-user matrix (execute_sql, dev) | PASS — 5/5 cases |
| browser manual check | N/A — no dev server observably affected (flag off by default; LoginRedirect never renders under mock) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None — `access.service.ts`'s public interface is unchanged.

### Open issues / follow-ups
- RLS test used simulated JWT claims (`set_config('request.jwt.claims', ...)`), not real Supabase Auth signups — legitimate and standard for RLS validation, but PAC-R4/R5 should still smoke-test an actual signed-in browser session end-to-end before any real-backend cutover.
- PAC-R2's carried-forward risks (non-transactional builder-tree write; type-level-only route parity) still stand — unaffected by this sprint.
