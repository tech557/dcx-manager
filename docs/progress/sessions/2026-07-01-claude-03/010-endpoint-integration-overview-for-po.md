## Endpoint & integration overview for PO review
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-planning
Status: Completed
PO-Action: pending
Version: v1.0.1.0
Change-Class: non-source

Intent: Give the PO the context to review the backend integration — a summary of the 22 endpoints, where each is used in the product, the integration plan, and the decisions I took (PO-delegated) with the product-model points to confirm at the implementation-sprint draft.
Trigger: User request — "I need a summary of the endpoints you found and how you plan to integrate them ... you can take whatever decision now as long as we will still have enough data to draft the implementation sprint."

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/backend/endpoint-integration-overview.md | PO-review: endpoint→feature map, integration plan, decisions, confirm-list | 108 |
| edited | docs/backend/README.md | dataset index: add PO-review overview row | ~1 |

### Endpoint→feature map traced (verified against code)
- Traced every service's consumers: queries/* → UI (pages/builder/islands) and actions/* → mutations.
- Verified: version creation is duplicate-only (no create-from-scratch route); files.service + ai.service + clickup.service have NO UI consumers (dormant stubs / unwired seam).

### Decisions taken (PO-delegated; confirm at sprint draft)
| ID | Decision |
|---|---|
| OD-BE3-02 tenancy | workspace-scoped |
| OD-BE3-04 auth provider | Supabase Auth (email + OAuth) |
| OD-BE3-05 files | external-URL-only v1 |
| OD-BE3-01 unions | jsonb |
| OD-BE3-03 threshold | N = 3 |
| Integrations | ClickUp stub, AI build-next, GAS out |
| Registry capture ref | rely on <version> path (no new column) |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — docs only, no code |
| Open decisions used (⏱) | Decisions taken under explicit PO delegation; flagged for confirmation |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Confirm 4 product-model points | need PO intent to finalize the implementation sprint | review docs/backend/endpoint-integration-overview.md §"confirm at the implementation-sprint draft": (1) create-via-duplicate only? (2) workspace vs DCX-scoped access? (3) files/attachments in v1? (4) AI/ClickUp stay stubs? |

### Consumer updates required
- None.

### Open issues / follow-ups
- Decisions recorded; PO confirms/corrects at implementation-sprint (production-api-client-switch) draft.
- Still-open blockers to READY unchanged: live capture (G5) + requirement intake (G6).
