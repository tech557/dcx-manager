# Frozen API Contract — DCX Manager (BE3-R1)

> **Source of truth:** `src/services/mock-dispatch.ts` route table (D-BE3-CONTRACT-SOT). This document is a
> **read-only mirror**, never a fork. The machine-readable form is [`contract.json`](./contract.json); the
> authoritative route list is emitted by `scripts/backend/extract-routes.sh`. The type round-trip
> (`scripts/backend/check-contract-types.ts`, run via `tsconfig.contract-check.json`) proves this contract
> has not diverged from the live `Api*` types.

**Route count:** 22 (deterministic — `extract-routes.sh | jq length` = 22 = `contract.json` route count).
**Types source:** `src/types/api.ts` (`Api*`) + `src/types/lifecycle.ts` (enums) + service interfaces
(`MyAccess`, `DCXAccess`, `AIReviewDraft`, `ClickUpEntryPayload`, `WriteLifecycleLogInput`,
`CreateCompositionInput`).

The backend the `production-api-client-switch` plan builds must implement exactly these routes with these
request/response shapes.

## Contract by resource family

### 1. channels
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/api/channels` | — | `ApiChannel[]` | `channels.service.ts` |

### 2. channel-compositions
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/api/channels/:channelId/compositions` | — | `ApiChannelComposition[]` | `channels.service.ts` |
| POST | `/api/channels/:channelId/compositions` | `CreateCompositionInput` `{ name, definitionIds }` | `ApiChannelComposition` | `channels.service.ts` |

### 3. subtask-definitions
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/api/subtask-definitions` | — | `ApiSubtaskDefinition[]` | `subtask-definitions.service.ts` |
| GET | `/api/subtask-definitions/:channelId` | — | `ApiSubtaskDefinition[]` | `subtask-definitions.service.ts` |

### 4. versions
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/versions` | — | `ApiVersion[]` | `versions.service.ts` |
| GET | `/dcx/:dcxId/versions` | — | `ApiVersion[]` | `versions.service.ts` |
| GET | `/versions/:versionId` | — | `ApiVersion` | `versions.service.ts` |
| PATCH | `/versions/:versionId/status` | `{ status: VersionStatus }` | `ApiVersion` | `versions.service.ts` |
| PATCH | `/versions/:versionId/date` | `{ date: string \| null }` | `ApiVersion` | `versions.service.ts` |
| POST | `/versions/:sourceVersionId/duplicate` | — | `ApiVersion` | `versions.service.ts` |

### 5. builder (phases tree)
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/versions/:versionId/builder` | — | `ApiBuilderTree` | `builder.service.ts` |
| PATCH | `/versions/:versionId/builder` | `ApiPhase[]` | `ApiBuilderTree` | `builder.service.ts` |

### 6. files
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/versions/:versionId/files` | — | `ApiFileAttachment[]` | `files.service.ts` |
| POST | `/versions/:versionId/files` | `ApiFileAttachment` | `ApiFileAttachment` | `files.service.ts` |

### 7. activity-logs
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/activity-logs` | — | `ApiActivityEvent[]` | `logs.service.ts` |
| GET | `/versions/:versionId/activity-logs` | — | `ApiActivityEvent[]` | `logs.service.ts` |
| POST | `/activity-logs` | `WriteLifecycleLogInput` | `ApiActivityEvent` | `logs.service.ts` |

### 8. access
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| GET | `/access/me` | — | `MyAccess` | `access.service.ts` |
| GET | `/dcx/:dcxId/access` | — | `DCXAccess` | `access.service.ts` |

### Integrations (two routes)
| Method | Path | Req body | Response | Service |
|---|---|---|---|---|
| POST | `/ai/review-draft` | `{ prompt: string }` | `AIReviewDraft` | `ai.service.ts` (stub) |
| GET | `/clickup/entry/:versionId` | — | `ClickUpEntryPayload` | `clickup.service.ts` (stub) |

## Drift findings (BE3-R1 AC-BE3-1-4)

Cross-check of registered routes (`extract-routes.sh`) vs. every `@route` JSDoc + `apiClient(` call site.

| Finding | Kind | Detail | Verdict |
|---|---|---|---|
| **`error-reporter.service.ts` `@route POST /error-reports`** | Declared-but-unregistered `@route` | `reportError()` carries a `@route POST /error-reports` JSDoc, but that route is **not** in `mock-dispatch.ts`, and the function does **not** call `apiClient` — it is a local `console.error` stub used by `withServiceErrorHandler`. | ⚠️ Not a live contract route. Documented as an **internal error sink**, not part of the 22-route backend surface. The build plan must decide whether error reporting becomes a real endpoint (recommend: out of v1 backend contract; keep client-side/telemetry). |
| **`api-client.ts` `@route ANY /api/*`** | Generic seam annotation | The `apiClient` wrapper carries an umbrella `@route ANY /api/*`; it is the dispatcher entry, not a discrete route. | ✅ Expected — not counted. |
| All 22 registered routes have a caller | — | Every route in the table is reached by a service `apiClient(` call (or, for `ai/review-draft` + `clickup/entry`, invoked directly by its `mock-dispatch` handler). | ✅ No dead (caller-less) registered route. |
| No unregistered live `apiClient` route | — | Every `apiClient('<route>')` call-site route resolves to a registered pattern. | ✅ No unregistered live call. |

**Net drift:** the 22-route surface is complete and consistent. The only anomaly is the `POST /error-reports`
`@route` tag on a client-side stub that never hits the dispatcher — flagged for a v1 decision, not a backend
contract route today.

## Honesty gate — how this stays true

The **contract-drift** CI gate (BE3-R5a `capture-contract-snapshot.sh`, wired in BE3-R5b) re-emits the
contract from code on every preview and fails if it differs from committed `contract.json`. That keeps this
frozen contract honest on every source change.
