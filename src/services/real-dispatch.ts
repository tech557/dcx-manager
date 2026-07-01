/**
 * Real Supabase-backed dispatcher — implements the frozen 22-route contract
 * (`docs/backend/contract/contract.json`) against the schema applied in PAC-R1.
 *
 * Boundary contract (core.md §5/§9.4, PAC-R2 audit blocking #2): every handler
 * here returns `Api*` shapes only — the exact same shapes `mockDispatch`
 * returns today. It never calls `api-mappers.ts`; the query layer
 * (`src/queries/*`) owns that conversion and is untouched by this file.
 *
 * Selected behind `VITE_USE_REAL_BACKEND` in `api-client.ts` (default off —
 * mock stays the default backend until PAC-R5 proves parity).
 */
import { createAIReviewDraft } from './ai.service';
import { getClickUpEntryPayload } from './clickup.service';
import type { ApiClientRequestOptions, ApiClientResponse } from './api-client';
import { getSupabaseClient } from './supabase-client';
import { canApproveVersion, canTransition } from '@/rules/lifecycle.rules';
import { generateId } from '@/utils/id.helpers';
import type {
  ApiAction,
  ApiActivityEvent,
  ApiAssignedMember,
  ApiBuilderTree,
  ApiChannel,
  ApiChannelComposition,
  ApiFileAttachment,
  ApiPhase,
  ApiSubtask,
  ApiSubtaskDefinition,
  ApiTask,
  ApiVersion,
} from '@/types/api';
import type { MyAccess, DCXAccess } from './access.service';
import type { VersionStatus } from '@/types/lifecycle';
import type { Database, Json } from '@/types/supabase';
import type { ApiJsonValue } from '@/types/api';

type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

function parseBody<T>(body: string | undefined): T {
  return body ? (JSON.parse(body) as T) : (undefined as T);
}

/**
 * Structurally the generated `Json` type and `ApiJsonValue` describe the same
 * jsonb shape; they differ only in how strictly TS marks nested optional keys.
 * Every jsonb column (`metadata`, `strategy_context`, `details`, task date/state
 * discriminated unions) round-trips through this at the DB boundary.
 */
function asApiJson<T>(value: Json | null): T {
  return value as unknown as T;
}

function notFound(kind: string, id: string): never {
  throw new Error(`${kind} not found: ${id}`);
}

// ─── row → Api* mappers (snake_case DB rows → camelCase Api* shapes) ────────

function rowToApiChannel(row: Row<'channels'>, availableCompositionIds: string[]): ApiChannel {
  return { id: row.id, label: row.label, icon: row.icon, availableCompositionIds };
}

function rowToApiChannelComposition(
  row: Row<'channel_compositions'>,
  definitionIds: string[],
): ApiChannelComposition {
  return {
    id: row.id,
    channelId: row.channel_id,
    name: row.name,
    definitionIds,
    createdBy: row.created_by,
    isUserDefined: row.is_user_defined,
  };
}

function rowToApiSubtaskDefinition(
  row: Row<'subtask_definitions'>,
  channelIds: string[],
): ApiSubtaskDefinition {
  return {
    id: row.id,
    label: row.label,
    estimatedMinutes: row.estimated_minutes,
    channelIds,
  };
}

function rowToApiFileAttachment(row: Row<'file_attachments'>): ApiFileAttachment {
  return {
    id: row.id,
    versionId: row.version_id,
    title: row.title,
    url: row.url,
    source: row.source,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

function rowToApiAssignedMember(row: Row<'version_members'>): ApiAssignedMember {
  return { userId: row.user_id, role: row.role, isProtected: row.is_protected };
}

function rowToApiVersion(
  row: Row<'versions'>,
  assignedTeam: ApiAssignedMember[],
  attachments: ApiFileAttachment[],
): ApiVersion {
  return {
    id: row.id,
    dcxId: row.dcx_id,
    versionNumber: row.version_number,
    status: row.status,
    communicatedDate: row.communicated_date,
    createdAt: row.created_at,
    createdBy: row.created_by,
    lastUpdatedAt: row.last_updated_at,
    lastUpdatedBy: row.last_updated_by,
    inProgressAt: row.in_progress_at,
    readyAt: row.ready_at,
    approvedAt: row.approved_at,
    supersededAt: row.superseded_at,
    sourceType: row.source_type,
    sourceVersionId: row.source_version_id,
    sourceBackupId: row.source_backup_id,
    sourceTemplateId: row.source_template_id,
    assignedTeam,
    attachments,
    metadata: asApiJson<ApiJsonValue | null>(row.metadata),
    strategyContext: asApiJson<ApiJsonValue | null>(row.strategy_context),
  };
}

function rowToApiSubtask(row: Row<'subtasks'>): ApiSubtask {
  return {
    id: row.id,
    taskId: row.task_id,
    definitionId: row.definition_id,
    label: row.label,
    done: row.done,
    estimatedMinutes: row.estimated_minutes,
    orderIndex: row.order_index,
    metadata: asApiJson<ApiJsonValue | null>(row.metadata),
  };
}

function rowToApiTask(row: Row<'tasks'>, subtasks: ApiSubtask[]): ApiTask {
  return {
    id: row.id,
    actionId: row.action_id,
    name: row.name,
    channelId: row.channel_id,
    compositionId: row.composition_id,
    message: row.message,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    orderIndex: row.order_index,
    date: row.date as ApiTask['date'],
    specsState: row.specs_state as ApiTask['specsState'],
    missingDataState: row.missing_data_state as ApiTask['missingDataState'],
    subtasks,
    isSmall: row.is_small,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
    metadata: asApiJson<ApiJsonValue | null>(row.metadata),
    generationContext: asApiJson<ApiJsonValue | null>(row.generation_context),
  };
}

function rowToApiAction(row: Row<'actions'>, tasks: ApiTask[]): ApiAction {
  return {
    id: row.id,
    phaseId: row.phase_id,
    name: row.name,
    description: row.description,
    orderIndex: row.order_index,
    tasks,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
    metadata: asApiJson<ApiJsonValue | null>(row.metadata),
  };
}

function rowToApiPhase(row: Row<'phases'>, actions: ApiAction[]): ApiPhase {
  return {
    id: row.id,
    versionId: row.version_id,
    label: row.label,
    icon: row.icon,
    orderIndex: row.order_index,
    actions,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
    metadata: asApiJson<ApiJsonValue | null>(row.metadata),
  };
}

function rowToApiActivityEvent(row: Row<'activity_events'>): ApiActivityEvent {
  return {
    id: row.id,
    type: row.type,
    versionId: row.version_id,
    userId: row.user_id,
    timestamp: row.timestamp,
    details: asApiJson<ApiJsonValue | null>(row.details),
  };
}

// ─── shared loaders ──────────────────────────────────────────────────────────

async function loadVersionRow(versionId: string): Promise<Row<'versions'>> {
  const db = getSupabaseClient();
  const { data, error } = await db.from('versions').select('*').eq('id', versionId).maybeSingle();
  if (error) throw error;
  if (!data) notFound('Version', versionId);
  return data;
}

async function loadAssignedTeam(versionId: string): Promise<ApiAssignedMember[]> {
  const db = getSupabaseClient();
  const { data, error } = await db.from('version_members').select('*').eq('version_id', versionId);
  if (error) throw error;
  return (data ?? []).map(rowToApiAssignedMember);
}

async function loadAttachments(versionId: string): Promise<ApiFileAttachment[]> {
  const db = getSupabaseClient();
  const { data, error } = await db.from('file_attachments').select('*').eq('version_id', versionId);
  if (error) throw error;
  return (data ?? []).map(rowToApiFileAttachment);
}

async function loadFullVersion(versionId: string): Promise<ApiVersion> {
  const [row, assignedTeam, attachments] = await Promise.all([
    loadVersionRow(versionId),
    loadAssignedTeam(versionId),
    loadAttachments(versionId),
  ]);
  return rowToApiVersion(row, assignedTeam, attachments);
}

async function loadBuilderTree(versionId: string): Promise<ApiBuilderTree> {
  const db = getSupabaseClient();
  const version = await loadFullVersion(versionId);

  const { data: phaseRows, error: phaseErr } = await db
    .from('phases')
    .select('*')
    .eq('version_id', versionId)
    .order('order_index', { ascending: true });
  if (phaseErr) throw phaseErr;

  const phaseIds = (phaseRows ?? []).map((p) => p.id);
  const { data: actionRows, error: actionErr } = phaseIds.length
    ? await db.from('actions').select('*').in('phase_id', phaseIds).order('order_index', { ascending: true })
    : { data: [] as Row<'actions'>[], error: null };
  if (actionErr) throw actionErr;

  const actionIds = (actionRows ?? []).map((a) => a.id);
  const { data: taskRows, error: taskErr } = actionIds.length
    ? await db.from('tasks').select('*').in('action_id', actionIds).order('order_index', { ascending: true })
    : { data: [] as Row<'tasks'>[], error: null };
  if (taskErr) throw taskErr;

  const taskIds = (taskRows ?? []).map((t) => t.id);
  const { data: subtaskRows, error: subtaskErr } = taskIds.length
    ? await db.from('subtasks').select('*').in('task_id', taskIds).order('order_index', { ascending: true })
    : { data: [] as Row<'subtasks'>[], error: null };
  if (subtaskErr) throw subtaskErr;

  const subtasksByTask = new Map<string, ApiSubtask[]>();
  for (const row of subtaskRows ?? []) {
    const list = subtasksByTask.get(row.task_id) ?? [];
    list.push(rowToApiSubtask(row));
    subtasksByTask.set(row.task_id, list);
  }

  const tasksByAction = new Map<string, ApiTask[]>();
  for (const row of taskRows ?? []) {
    const list = tasksByAction.get(row.action_id) ?? [];
    list.push(rowToApiTask(row, subtasksByTask.get(row.id) ?? []));
    tasksByAction.set(row.action_id, list);
  }

  const actionsByPhase = new Map<string, ApiAction[]>();
  for (const row of actionRows ?? []) {
    const list = actionsByPhase.get(row.phase_id) ?? [];
    list.push(rowToApiAction(row, tasksByAction.get(row.id) ?? []));
    actionsByPhase.set(row.phase_id, list);
  }

  const phases = (phaseRows ?? []).map((row) => rowToApiPhase(row, actionsByPhase.get(row.id) ?? []));
  return { version, phases };
}

/** Full-tree replace (OD-PAC-02): delete the version's existing subtree, then re-insert `phases` as given. */
async function saveBuilderTree(versionId: string, phases: ApiPhase[]): Promise<ApiBuilderTree> {
  const db = getSupabaseClient();

  const { data: existingPhases, error: existingErr } = await db
    .from('phases')
    .select('id')
    .eq('version_id', versionId);
  if (existingErr) throw existingErr;
  const existingPhaseIds = (existingPhases ?? []).map((p) => p.id);

  if (existingPhaseIds.length) {
    const { data: existingActions, error: eaErr } = await db
      .from('actions')
      .select('id')
      .in('phase_id', existingPhaseIds);
    if (eaErr) throw eaErr;
    const existingActionIds = (existingActions ?? []).map((a) => a.id);

    if (existingActionIds.length) {
      const { data: existingTasks, error: etErr } = await db
        .from('tasks')
        .select('id')
        .in('action_id', existingActionIds);
      if (etErr) throw etErr;
      const existingTaskIds = (existingTasks ?? []).map((t) => t.id);

      if (existingTaskIds.length) {
        const { error: delSubtasksErr } = await db.from('subtasks').delete().in('task_id', existingTaskIds);
        if (delSubtasksErr) throw delSubtasksErr;
      }
      const { error: delTasksErr } = await db.from('tasks').delete().in('action_id', existingActionIds);
      if (delTasksErr) throw delTasksErr;
    }
    const { error: delActionsErr } = await db.from('actions').delete().in('phase_id', existingPhaseIds);
    if (delActionsErr) throw delActionsErr;
  }
  const { error: delPhasesErr } = await db.from('phases').delete().eq('version_id', versionId);
  if (delPhasesErr) throw delPhasesErr;

  for (const phase of phases) {
    const { error: phaseInsertErr } = await db.from('phases').insert({
      id: phase.id,
      version_id: versionId,
      label: phase.label,
      icon: phase.icon,
      order_index: phase.orderIndex,
      updated_at: phase.updatedAt,
      updated_by: phase.updatedBy,
      metadata: phase.metadata,
    });
    if (phaseInsertErr) throw phaseInsertErr;

    for (const action of phase.actions) {
      const { error: actionInsertErr } = await db.from('actions').insert({
        id: action.id,
        phase_id: phase.id,
        name: action.name,
        description: action.description,
        order_index: action.orderIndex,
        updated_at: action.updatedAt,
        updated_by: action.updatedBy,
        metadata: action.metadata,
      });
      if (actionInsertErr) throw actionInsertErr;

      for (const task of action.tasks) {
        const { error: taskInsertErr } = await db.from('tasks').insert({
          id: task.id,
          action_id: action.id,
          name: task.name,
          channel_id: task.channelId,
          composition_id: task.compositionId,
          message: task.message,
          sender_id: task.senderId,
          receiver_id: task.receiverId,
          order_index: task.orderIndex,
          date: task.date,
          specs_state: task.specsState,
          missing_data_state: task.missingDataState,
          is_small: task.isSmall,
          updated_at: task.updatedAt,
          updated_by: task.updatedBy,
          metadata: task.metadata,
          generation_context: task.generationContext,
        });
        if (taskInsertErr) throw taskInsertErr;

        for (const subtask of task.subtasks) {
          const { error: subtaskInsertErr } = await db.from('subtasks').insert({
            id: subtask.id,
            task_id: task.id,
            definition_id: subtask.definitionId,
            label: subtask.label,
            done: subtask.done,
            estimated_minutes: subtask.estimatedMinutes,
            order_index: subtask.orderIndex,
            metadata: subtask.metadata,
          });
          if (subtaskInsertErr) throw subtaskInsertErr;
        }
      }
    }
  }

  return loadBuilderTree(versionId);
}

async function writeActivityLog(input: {
  type: ApiActivityEvent['type'];
  versionId: string;
  userId: string;
  details?: ApiActivityEvent['details'];
}): Promise<ApiActivityEvent> {
  const db = getSupabaseClient();
  const row: Row<'activity_events'> = {
    id: generateId(),
    type: input.type,
    version_id: input.versionId,
    user_id: input.userId,
    timestamp: new Date().toISOString(),
    details: input.details ?? null,
  };
  const { error } = await db.from('activity_events').insert(row);
  if (error) throw error;
  return rowToApiActivityEvent(row);
}

// ─── route handlers ──────────────────────────────────────────────────────────

async function getChannels(): Promise<ApiChannel[]> {
  const db = getSupabaseClient();
  const { data: channelRows, error } = await db.from('channels').select('*');
  if (error) throw error;
  const { data: availRows, error: availErr } = await db.from('channel_available_compositions').select('*');
  if (availErr) throw availErr;

  const byChannel = new Map<string, string[]>();
  for (const row of availRows ?? []) {
    const list = byChannel.get(row.channel_id) ?? [];
    list.push(row.composition_id);
    byChannel.set(row.channel_id, list);
  }
  return (channelRows ?? []).map((row) => rowToApiChannel(row, byChannel.get(row.id) ?? []));
}

async function getChannelCompositions(channelId: string): Promise<ApiChannelComposition[]> {
  const db = getSupabaseClient();
  const { data: compositionRows, error } = await db
    .from('channel_compositions')
    .select('*')
    .eq('channel_id', channelId);
  if (error) throw error;

  const compositionIds = (compositionRows ?? []).map((c) => c.id);
  const { data: defRows, error: defErr } = compositionIds.length
    ? await db.from('composition_definitions').select('*').in('composition_id', compositionIds)
    : { data: [] as Row<'composition_definitions'>[], error: null };
  if (defErr) throw defErr;

  const byComposition = new Map<string, string[]>();
  for (const row of defRows ?? []) {
    const list = byComposition.get(row.composition_id) ?? [];
    list.push(row.definition_id);
    byComposition.set(row.composition_id, list);
  }
  return (compositionRows ?? []).map((row) => rowToApiChannelComposition(row, byComposition.get(row.id) ?? []));
}

async function createComposition(
  channelId: string,
  input: { name: string; definitionIds: string[] },
): Promise<ApiChannelComposition> {
  const db = getSupabaseClient();
  const { data: userData } = await db.auth.getUser();
  const createdBy = userData.user?.id ?? 'unknown';
  const id = generateId();

  const { error: insertErr } = await db.from('channel_compositions').insert({
    id,
    channel_id: channelId,
    name: input.name,
    created_by: createdBy,
    is_user_defined: true,
  });
  if (insertErr) throw insertErr;

  if (input.definitionIds.length) {
    const { error: defErr } = await db
      .from('composition_definitions')
      .insert(input.definitionIds.map((definitionId) => ({ composition_id: id, definition_id: definitionId })));
    if (defErr) throw defErr;
  }

  const { error: availErr } = await db
    .from('channel_available_compositions')
    .insert({ channel_id: channelId, composition_id: id });
  if (availErr) throw availErr;

  return rowToApiChannelComposition(
    { id, channel_id: channelId, name: input.name, created_by: createdBy, is_user_defined: true },
    input.definitionIds,
  );
}

async function getAllVersions(): Promise<ApiVersion[]> {
  const db = getSupabaseClient();
  const { data: versionRows, error } = await db.from('versions').select('*');
  if (error) throw error;
  return Promise.all(
    (versionRows ?? []).map(async (row) => {
      const [assignedTeam, attachments] = await Promise.all([
        loadAssignedTeam(row.id),
        loadAttachments(row.id),
      ]);
      return rowToApiVersion(row, assignedTeam, attachments);
    }),
  );
}

async function getVersionsForDcx(dcxId: string): Promise<ApiVersion[]> {
  const db = getSupabaseClient();
  const { data: versionRows, error } = await db.from('versions').select('*').eq('dcx_id', dcxId);
  if (error) throw error;
  return Promise.all(
    (versionRows ?? []).map(async (row) => {
      const [assignedTeam, attachments] = await Promise.all([
        loadAssignedTeam(row.id),
        loadAttachments(row.id),
      ]);
      return rowToApiVersion(row, assignedTeam, attachments);
    }),
  );
}

async function updateVersionStatus(versionId: string, status: VersionStatus): Promise<ApiVersion> {
  const db = getSupabaseClient();
  const current = await loadFullVersion(versionId);

  if (current.status !== status && !canTransition(current.status, status)) {
    throw new Error(`Illegal version transition: ${current.status} -> ${status}`);
  }
  if (status === 'Approved' && !canApproveVersion(current)) {
    throw new Error('Approval is blocked until the version communication date is set.');
  }

  const { data: userData } = await db.auth.getUser();
  const actor = userData.user?.id ?? 'unknown';
  const timestamp = new Date().toISOString();

  const { error: updateErr } = await db
    .from('versions')
    .update({
      status,
      last_updated_at: timestamp,
      last_updated_by: actor,
      ready_at: status === 'Ready for Approval' ? timestamp : undefined,
      approved_at: status === 'Approved' ? timestamp : undefined,
      superseded_at: status === 'Superseded' ? timestamp : undefined,
    })
    .eq('id', versionId);
  if (updateErr) throw updateErr;

  const supersededSiblingIds: string[] = [];
  if (status === 'Approved') {
    const { data: siblings, error: siblingErr } = await db
      .from('versions')
      .select('id, status')
      .eq('dcx_id', current.dcxId)
      .neq('id', versionId)
      .neq('status', 'Superseded');
    if (siblingErr) throw siblingErr;

    for (const sibling of siblings ?? []) {
      supersededSiblingIds.push(sibling.id);
      const { error: supersedeErr } = await db
        .from('versions')
        .update({
          status: 'Superseded',
          superseded_at: timestamp,
          last_updated_at: timestamp,
          last_updated_by: actor,
        })
        .eq('id', sibling.id);
      if (supersedeErr) throw supersedeErr;
    }
  }

  await writeActivityLog({
    type: status === 'Approved' ? 'approved' : status === 'Superseded' ? 'superseded' : 'ready_submitted',
    versionId,
    userId: actor,
    details: { status, supersededSiblingIds },
  });

  return loadFullVersion(versionId);
}

async function updateVersionDate(versionId: string, date: string | null): Promise<ApiVersion> {
  const db = getSupabaseClient();
  const { data: userData } = await db.auth.getUser();
  const { error } = await db
    .from('versions')
    .update({
      communicated_date: date,
      last_updated_at: new Date().toISOString(),
      last_updated_by: userData.user?.id ?? 'unknown',
    })
    .eq('id', versionId);
  if (error) throw error;
  return loadFullVersion(versionId);
}

/** OD-PAC-01 (PO-confirmed 2026-07-01): duplicate-only, no create-from-scratch route. */
async function duplicateVersion(sourceVersionId: string): Promise<ApiVersion> {
  const db = getSupabaseClient();
  const source = await loadFullVersion(sourceVersionId);
  const { data: userData } = await db.auth.getUser();
  const actor = userData.user?.id ?? 'unknown';

  const { count, error: countErr } = await db
    .from('versions')
    .select('*', { count: 'exact', head: true })
    .eq('dcx_id', source.dcxId);
  if (countErr) throw countErr;

  const newId = generateId();
  const timestamp = new Date().toISOString();

  const { error: insertErr } = await db.from('versions').insert({
    id: newId,
    dcx_id: source.dcxId,
    version_number: `V${(count ?? 0) + 1}`,
    status: 'Draft',
    communicated_date: source.communicatedDate,
    created_at: timestamp,
    created_by: actor,
    last_updated_at: timestamp,
    last_updated_by: actor,
    in_progress_at: null,
    ready_at: null,
    approved_at: null,
    superseded_at: null,
    source_type: 'duplicate',
    source_version_id: sourceVersionId,
    source_backup_id: null,
    source_template_id: null,
    metadata: source.metadata,
    strategy_context: source.strategyContext,
  });
  if (insertErr) throw insertErr;

  if (source.assignedTeam.length) {
    const { error: teamErr } = await db.from('version_members').insert(
      source.assignedTeam.map((member) => ({
        version_id: newId,
        user_id: member.userId,
        role: member.role,
        is_protected: member.isProtected,
      })),
    );
    if (teamErr) throw teamErr;
  }

  try {
    const sourceTree = await loadBuilderTree(sourceVersionId);
    await saveBuilderTree(newId, remapBuilderTreeIds(sourceTree.phases));
  } catch (err) {
    console.error('Failed to copy builder tree during duplication:', err);
  }

  return loadFullVersion(newId);
}

/**
 * `phases.id`/`actions.id`/`tasks.id`/`subtasks.id` are primary keys, so a
 * duplicated tree cannot reuse the source version's IDs (found by Codex
 * output-review, 2026-07-01 — `saveBuilderTree` would insert with the same
 * PKs the source version already owns and violate the constraint, silently
 * swallowed by `duplicateVersion`'s catch). Generates fresh IDs top-down and
 * rewrites every parent-reference field to match.
 */
function remapBuilderTreeIds(phases: ApiPhase[]): ApiPhase[] {
  return phases.map((phase) => {
    const newPhaseId = generateId();
    return {
      ...phase,
      id: newPhaseId,
      actions: phase.actions.map((action) => {
        const newActionId = generateId();
        return {
          ...action,
          id: newActionId,
          phaseId: newPhaseId,
          tasks: action.tasks.map((task) => {
            const newTaskId = generateId();
            return {
              ...task,
              id: newTaskId,
              actionId: newActionId,
              subtasks: task.subtasks.map((subtask) => ({
                ...subtask,
                id: generateId(),
                taskId: newTaskId,
              })),
            };
          }),
        };
      }),
    };
  });
}

async function getVersionFiles(versionId: string): Promise<ApiFileAttachment[]> {
  return loadAttachments(versionId);
}

async function attachVersionFile(versionId: string, file: ApiFileAttachment): Promise<ApiFileAttachment> {
  const db = getSupabaseClient();
  await loadVersionRow(versionId); // 404s if the version does not exist
  const row: Row<'file_attachments'> = {
    id: file.id,
    version_id: versionId,
    title: file.title,
    url: file.url,
    source: file.source,
    created_by: file.createdBy,
    created_at: file.createdAt,
  };
  const { error } = await db.from('file_attachments').insert(row);
  if (error) throw error;
  return rowToApiFileAttachment(row);
}

async function getAllActivityLogs(): Promise<ApiActivityEvent[]> {
  const db = getSupabaseClient();
  const { data, error } = await db.from('activity_events').select('*').order('timestamp', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToApiActivityEvent);
}

async function getActivityLogsForVersion(versionId: string): Promise<ApiActivityEvent[]> {
  const db = getSupabaseClient();
  const { data, error } = await db
    .from('activity_events')
    .select('*')
    .eq('version_id', versionId)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToApiActivityEvent);
}

async function getSubtaskDefinitions(channelId?: string): Promise<ApiSubtaskDefinition[]> {
  const db = getSupabaseClient();
  const { data: defRows, error } = await db.from('subtask_definitions').select('*');
  if (error) throw error;

  const { data: linkRows, error: linkErr } = await db.from('subtask_definition_channels').select('*');
  if (linkErr) throw linkErr;

  const channelsByDefinition = new Map<string, string[]>();
  for (const row of linkRows ?? []) {
    const list = channelsByDefinition.get(row.definition_id) ?? [];
    list.push(row.channel_id);
    channelsByDefinition.set(row.definition_id, list);
  }

  const all = (defRows ?? []).map((row) =>
    rowToApiSubtaskDefinition(row, channelsByDefinition.get(row.id) ?? []),
  );
  if (!channelId) return all;
  return all.filter((def) => def.channelIds.includes(channelId));
}

/**
 * `MyAccess`/`DCXAccess` are fully wired at PAC-R3 (Supabase Auth), defaulting
 * to "no access" rather than mock's always-allow when there's no session.
 *
 * PAC-R4 fix (found via the live parity suite, not caught at PAC-R3): a direct
 * `db.from('memberships').select(...)` is blocked by RLS — `memberships` has
 * RLS enabled with **zero** SELECT policies (by design: only the 3 `SECURITY
 * DEFINER` helper functions in `schema.sql` may read it). Both functions below
 * now call those RPCs instead of querying the table directly.
 */
async function getMyAccessReal(): Promise<MyAccess> {
  const db = getSupabaseClient();
  const { data: userData } = await db.auth.getUser();
  const user = userData.user;
  if (!user) {
    return { userId: '', isAuthenticated: false, workspaceIds: [] };
  }
  const { data: workspaceIds, error } = await db.rpc('app_user_workspace_ids');
  if (error) throw error;
  return {
    userId: user.id,
    isAuthenticated: true,
    workspaceIds: workspaceIds ?? [],
  };
}

async function checkDCXAccessReal(dcxId: string): Promise<DCXAccess> {
  const db = getSupabaseClient();
  const { data: dcxRow, error: dcxErr } = await db.from('dcx').select('workspace_id').eq('id', dcxId).maybeSingle();
  if (dcxErr) throw dcxErr;
  if (!dcxRow) {
    return { dcxId, hasAccess: false, canEdit: false };
  }

  const { data: userData } = await db.auth.getUser();
  const user = userData.user;
  if (!user) {
    return { dcxId, hasAccess: false, canEdit: false };
  }

  const [{ data: workspaceIds, error: idsErr }, { data: canEdit, error: editErr }] = await Promise.all([
    db.rpc('app_user_workspace_ids'),
    db.rpc('app_user_can_edit', { target_workspace: dcxRow.workspace_id }),
  ]);
  if (idsErr) throw idsErr;
  if (editErr) throw editErr;

  return {
    dcxId,
    hasAccess: (workspaceIds ?? []).includes(dcxRow.workspace_id),
    canEdit: canEdit ?? false,
  };
}

// ─── route table (mirrors mock-dispatch.ts's shape) ─────────────────────────

interface RouteEntry {
  method: string;
  pattern: RegExp;
  handler: (...params: string[]) => Promise<unknown>;
}

const routes: RouteEntry[] = [
  { method: 'GET', pattern: /^\/api\/channels$/, handler: () => getChannels() },
  { method: 'GET', pattern: /^\/api\/channels\/([^/]+)\/compositions$/, handler: (channelId) => getChannelCompositions(channelId) },
  { method: 'POST', pattern: /^\/api\/channels\/([^/]+)\/compositions$/, handler: (channelId, body) => createComposition(channelId, parseBody(body)) },

  { method: 'GET', pattern: /^\/versions\/([^/]+)\/builder$/, handler: (versionId) => loadBuilderTree(versionId) },
  { method: 'PATCH', pattern: /^\/versions\/([^/]+)\/builder$/, handler: (versionId, body) => saveBuilderTree(versionId, parseBody<ApiPhase[]>(body)) },

  { method: 'GET', pattern: /^\/versions$/, handler: () => getAllVersions() },
  { method: 'GET', pattern: /^\/dcx\/([^/]+)\/versions$/, handler: (dcxId) => getVersionsForDcx(dcxId) },
  { method: 'GET', pattern: /^\/versions\/([^/]+)$/, handler: (versionId) => loadFullVersion(versionId) },
  {
    method: 'PATCH',
    pattern: /^\/versions\/([^/]+)\/status$/,
    handler: (versionId, body) => updateVersionStatus(versionId, parseBody<{ status: VersionStatus }>(body).status),
  },
  {
    method: 'PATCH',
    pattern: /^\/versions\/([^/]+)\/date$/,
    handler: (versionId, body) => updateVersionDate(versionId, parseBody<{ date: string | null }>(body).date),
  },
  { method: 'POST', pattern: /^\/versions\/([^/]+)\/duplicate$/, handler: (sourceVersionId) => duplicateVersion(sourceVersionId) },

  { method: 'GET', pattern: /^\/versions\/([^/]+)\/files$/, handler: (versionId) => getVersionFiles(versionId) },
  { method: 'POST', pattern: /^\/versions\/([^/]+)\/files$/, handler: (versionId, body) => attachVersionFile(versionId, parseBody(body)) },

  { method: 'GET', pattern: /^\/activity-logs$/, handler: () => getAllActivityLogs() },
  { method: 'GET', pattern: /^\/versions\/([^/]+)\/activity-logs$/, handler: (versionId) => getActivityLogsForVersion(versionId) },
  {
    method: 'POST',
    pattern: /^\/activity-logs$/,
    handler: (body) => {
      const input = parseBody<{ type: ApiActivityEvent['type']; versionId: string; userId: string; details?: ApiActivityEvent['details'] }>(body);
      return writeActivityLog(input);
    },
  },

  { method: 'GET', pattern: /^\/api\/subtask-definitions$/, handler: () => getSubtaskDefinitions() },
  { method: 'GET', pattern: /^\/api\/subtask-definitions\/([^/]+)$/, handler: (channelId) => getSubtaskDefinitions(channelId) },

  { method: 'GET', pattern: /^\/access\/me$/, handler: () => getMyAccessReal() },
  { method: 'GET', pattern: /^\/dcx\/([^/]+)\/access$/, handler: (dcxId) => checkDCXAccessReal(dcxId) },

  {
    method: 'POST',
    pattern: /^\/ai\/review-draft$/,
    handler: (body) => createAIReviewDraft(parseBody<{ prompt: string }>(body).prompt),
  },
  { method: 'GET', pattern: /^\/clickup\/entry\/([^/]+)$/, handler: (versionId) => getClickUpEntryPayload(versionId) },
];

export async function realDispatch<TData>(
  route: string,
  options?: ApiClientRequestOptions<unknown>,
): Promise<ApiClientResponse<TData>> {
  const method = options?.method ?? 'GET';
  const bodyStr = options?.body !== undefined ? JSON.stringify(options.body) : undefined;

  for (const entry of routes) {
    if (entry.method !== method) continue;
    const match = route.match(entry.pattern);
    if (!match) continue;

    const params = match.slice(1);
    if (bodyStr !== undefined) params.push(bodyStr);

    const data = await entry.handler(...params);
    return { data: data as TData };
  }

  throw new Error(`No real-dispatch handler for ${method} ${route}`);
}
