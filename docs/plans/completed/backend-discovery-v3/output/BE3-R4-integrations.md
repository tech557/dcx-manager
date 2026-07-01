# BE3-R4 — External integration decisions (output)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Version: v1.0.1.0 · Change-Class: non-source

## What this sprint produced

`docs/backend/integrations/decision-matrix.md` — a recorded v1 decision + owner + data-need per external
integration, so nothing is discovered late during the build plan.

| Integration | v1 decision | If built — data need |
|---|---|---|
| ClickUp (`clickup/entry`) | **stay-stub v1** (build later) | ClickUp read token; `versions.source_task_id`; task↔version map |
| AI (`ai/review-draft`) | **stay-stub for milestone; build next** (real Claude) | model id `claude-*`; prompt contract; typed `proposedActions` schema |
| Files (`file_attachments`) | **external-URL-only v1** (OD-BE3-05) | none for v1; bucket+RLS+enum extension if Storage later |
| GAS sink | **stay-out** (RG-R6 confirmed) | — |

## Acceptance criteria

| Criterion | Verdict | Evidence |
|---|---|---|
| AC-BE3-4-1 — every row has decision + owner + data-need; no "TBD" | ✅ PASS | 4/4 rows complete; `grep TBD` finds only the "no-TBD" note, 0 decision cells |
| AC-BE3-4-2 — OD-BE3-05 (files) recorded with recommendation | ✅ PASS | external-URL-only recommended; Storage path documented as clean later addition |
| AC-BE3-4-3 — any "build" decision names its contract/schema addition | ✅ PASS | ClickUp → `versions.source_task_id`; AI → typed `proposedActions` — handed to R1/R2 as follow-ups, not applied |
| AC-BE3-4-4 — no `src/**` changed | ✅ PASS | `git diff --name-only -- src/` empty |

## Key point
The **core backend connection depends on none** of the four integrations — all are decoupled from the
`production-api-client-switch` critical path, which keeps that switch low-risk.

## Gates
| Gate | Result |
|---|---|
| no-TBD | PASS (0 decision cells blank) |
| build→needs cross-ref | PASS (ClickUp/AI additions named + hand-off targets) |
| no-src diff | PASS |

## Follow-ups
- Queue `REQ-BE-AI-*` intake to type `AIReviewDraft.proposedActions` before the AI build.
- `versions.source_task_id` recorded as a HYPOTHESIS column for the ClickUp-linking build (schema note).
