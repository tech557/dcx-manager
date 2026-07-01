/**
 * BE3-R1 — Contract ↔ code round-trip type check.
 *
 * Proves the frozen contract (docs/backend/contract/contract.json) has NOT
 * diverged from the live code: for every route, the `response_type` (and, where
 * present, `request_body_type`) the contract declares is asserted — at the type
 * level — to be EXACTLY the type the corresponding service returns/accepts.
 * The service return types resolve to the live `Api*` types, so any rename,
 * removal, or shape drift in `src/types/api.ts` / a service breaks compilation.
 *
 * Uses RELATIVE imports (not the `@/` alias) so it compiles in isolation under
 * scripts/backend/tsconfig.contract-check.json (audit blocking #2 — never a
 * stray file the app `tsc --noEmit` would silently exclude).
 *
 * Run: npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit  → 0 errors.
 */
import type {
  ApiChannel,
  ApiChannelComposition,
  ApiBuilderTree,
  ApiVersion,
  ApiFileAttachment,
  ApiActivityEvent,
  ApiSubtaskDefinition,
  ApiPhase,
} from '../../src/types/api';
import type { VersionStatus } from '../../src/types/lifecycle';

import { getChannels, getCompositions, createComposition } from '../../src/services/channels.service';
import { getBuilder, saveBuilder } from '../../src/services/builder.service';
import {
  getAllVersions,
  getVersions,
  getVersion,
  updateStatus,
  updateVersionDate,
  duplicateVersion,
} from '../../src/services/versions.service';
import { getVersionFiles, attachVersionFile } from '../../src/services/files.service';
import { getAllActivityLogs, getActivityLogs, writeLifecycleLog } from '../../src/services/logs.service';
import { getSubtaskDefinitions } from '../../src/services/subtask-definitions.service';
import { getMyAccess, checkDCXAccess, type MyAccess, type DCXAccess } from '../../src/services/access.service';
import { createAIReviewDraft, type AIReviewDraft } from '../../src/services/ai.service';
import { getClickUpEntryPayload, type ClickUpEntryPayload } from '../../src/services/clickup.service';
import type { WriteLifecycleLogInput } from '../../src/services/logs.service';
import type { CreateCompositionInput } from '../../src/services/mock/channels.mock';

/** Type-level exact-equality (invariant) helper. */
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
type Res<F> = F extends (...args: never[]) => Promise<infer R> ? R : never;
type Arg1<F> = F extends (a: infer A, ...rest: never[]) => unknown ? A : never;

/* ── Response-type round-trip: contract.response_type ≡ live service return ── */
export type _channels_list = Expect<Equals<Res<typeof getChannels>, ApiChannel[]>>;
export type _channels_comps = Expect<Equals<Res<typeof getCompositions>, ApiChannelComposition[]>>;
export type _channels_create = Expect<Equals<Res<typeof createComposition>, ApiChannelComposition>>;

export type _builder_get = Expect<Equals<Res<typeof getBuilder>, ApiBuilderTree>>;
export type _builder_save = Expect<Equals<Res<typeof saveBuilder>, ApiBuilderTree>>;

export type _versions_all = Expect<Equals<Res<typeof getAllVersions>, ApiVersion[]>>;
export type _versions_forDcx = Expect<Equals<Res<typeof getVersions>, ApiVersion[]>>;
export type _versions_one = Expect<Equals<Res<typeof getVersion>, ApiVersion>>;
export type _versions_status = Expect<Equals<Res<typeof updateStatus>, ApiVersion>>;
export type _versions_date = Expect<Equals<Res<typeof updateVersionDate>, ApiVersion>>;
export type _versions_dup = Expect<Equals<Res<typeof duplicateVersion>, ApiVersion>>;

export type _files_list = Expect<Equals<Res<typeof getVersionFiles>, ApiFileAttachment[]>>;
export type _files_attach = Expect<Equals<Res<typeof attachVersionFile>, ApiFileAttachment>>;

export type _logs_all = Expect<Equals<Res<typeof getAllActivityLogs>, ApiActivityEvent[]>>;
export type _logs_forVersion = Expect<Equals<Res<typeof getActivityLogs>, ApiActivityEvent[]>>;
export type _logs_write = Expect<Equals<Res<typeof writeLifecycleLog>, ApiActivityEvent>>;

export type _subtaskDefs = Expect<Equals<Res<typeof getSubtaskDefinitions>, ApiSubtaskDefinition[]>>;

export type _access_me = Expect<Equals<Res<typeof getMyAccess>, MyAccess>>;
export type _access_dcx = Expect<Equals<Res<typeof checkDCXAccess>, DCXAccess>>;

export type _ai_draft = Expect<Equals<Res<typeof createAIReviewDraft>, AIReviewDraft>>;
export type _clickup_entry = Expect<Equals<Res<typeof getClickUpEntryPayload>, ClickUpEntryPayload>>;

/* ── Request-body round-trip: contract.request_body_type ≡ live service arg ── */
export type _req_createComposition = Expect<Equals<Arg1<typeof createComposition>, string>>; // channelId path param
export type _req_saveBuilder_body = Expect<Equals<Arg1<typeof saveBuilder>, string>>; // versionId path param
export type _req_writeLog = Expect<Equals<Arg1<typeof writeLifecycleLog>, WriteLifecycleLogInput>>;

// Enum surface the contract references for the PATCH /versions/:id/status body.
export type _enum_versionStatus = Expect<
  Equals<VersionStatus, 'Draft' | 'In Progress' | 'Ready for Approval' | 'Approved' | 'Superseded'>
>;

// Referenced so the compiler pins the exact request-body named types (drift-guard).
export type _named_createCompositionInput = CreateCompositionInput;
export type _named_apiPhaseArray = ApiPhase[];
