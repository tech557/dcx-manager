# PO approval — apply schema + RLS to Supabase dev (PAC-R1)

| Field | Value |
|---|---|
| Scope | Apply `docs/backend/schema/schema.sql` (17 tables, 6 enums) + `docs/backend/auth/rls-policies.sql` (25 policies) to **`dcx-manager-dev`** (`ibekkxqujqvlajeldpoa`) only |
| Explicitly excluded | `dcx-manager-prod` (`xokgguodxjjwokngyquo`) — untouched; prod apply is PAC-R6 only, gated separately |
| Requested by | Claude (claude-sonnet-4-6), PAC-R1 kickoff |
| Approved by | Mahmoud (PO) |
| Date | 2026-07-01 |
| Approval text | "Approve dev apply" (via PO confirmation prompt ahead of PAC-R1) |
| Requirement basis | `REQ-BE-SCHEMA-001` (PO-signed 2026-07-01, `LDG-2026-07-01-create-node-REQ-BE-SCHEMA-001`) |

This satisfies PAC-R1's `requires: recorded PO approval ... BEFORE apply` gate and AC-PAC-1-1.
