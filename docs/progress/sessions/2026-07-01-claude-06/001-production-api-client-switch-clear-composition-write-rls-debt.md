## production-api-client-switch — clear tracked debt: channel_compositions_write RLS fix
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
Status: Completed
PO-Action: none
Version: v1.1.0.1
Change-Class: source

Intent: Clear the tracked debt logged in the prior session (`2026-07-01-claude-05/010-...`) — the
`channel_compositions_write` RLS policy rejects every insert, including real editors/admins.
Trigger: User request — "help me clear the last debt from the last claude session".
Requirements covered: REQ-BE-API-001 (existing trace; no new requirement — fixes a defect in an already-signed
manifestation's supporting policy).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | `docs/backend/auth/schema-auth-additions.sql` | added `app_user_is_any_editor()` SECURITY DEFINER helper | +16 |
| edited | `docs/backend/auth/rls-policies.sql` | rewrote `channel_compositions_write`; added `composition_definitions_write`/`channel_available_compositions_write` | ~15 |
| edited | `src/services/__tests__/real-dispatch.parity.test.ts` | composition-write test now asserts success, not the expected 42501 failure | ~10 |
| created | `docs/backend/switch/apply-approval-dev-2026-07-01-composition-write-rls-fix.md` | PO approval record | 14 |
| created | `docs/plans/active/production-api-client-switch/output/PAC-addendum-composition-write-rls-fix.md` | addendum output doc | 45 |
| edited | `docs/plans/active/production-api-client-switch/output/PAC-R4-parity.md` | finding #3 marked RESOLVED | ~10 |
| edited | `docs/plans/active/production-api-client-switch/README.md` | carry-forward addendum entry | +18 |
| edited | `docs/progress/sessions/2026-07-01-claude-05/010-...-tracked-debt-composition-write-rls.md` | status Blocked → Resolved | +7 |

### Checks
| Check | Result |
|---|---|
| `apply_migration` (dcx-manager-dev) — helper + policy rewrite | PASS |
| `apply_migration` (dcx-manager-dev) — join-table write policies (PO-approved extension, found live) | PASS |
| `real-dispatch.parity.test.ts` | PASS 23/23 (was 22/23 with 1 expected-failure test) |
| `npm run test` | PASS 115/115 (2 unrelated 5s-timeout network flakes, confirmed non-blocking standalone) |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `get_advisors` security (dev) | no new issue class vs. PAC-R1 baseline |
| `list_migrations` (dcx-manager-prod) | `[]` — untouched |

### Notes
Two-step approval: user first approved the documented fix (helper + `channel_compositions_write` rewrite).
Applying it exposed a second, previously-invisible gap — `composition_definitions`/
`channel_available_compositions` had no INSERT policy at all (masked until the first blocker cleared) — asked
again before extending scope to cover it, approved. Both migrations dev-only; prod untouched throughout.

### PO action required
None — debt cleared, PAC-R6 readiness checklist updated in the plan README.
