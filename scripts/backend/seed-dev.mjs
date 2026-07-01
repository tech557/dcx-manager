#!/usr/bin/env node
/**
 * PAC-R4 — seed `dcx-manager-dev` with representative data so every one of
 * the 22 contract routes has something real to return.
 *
 * Uses a Supabase **service role** key (bypasses RLS for the insert) — never
 * the anon key, and never checked in. Reads:
 *   SUPABASE_URL (or VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Idempotent: every insert is an upsert on the primary key, so re-running is
 * safe. Mirrors the catalog + tenant shape `mock-dispatch.ts`'s seed uses
 * (same channel/composition/subtask-definition IDs), plus one workspace/dcx/
 * version/builder-tree/file/activity-log so every route has ≥1 real row.
 *
 * D-PAC-R4-DEV-ONLY: this script must never be pointed at a prod project id.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('seed-dev: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const db = createClient(url, serviceKey);

const CHANNELS = [
  { id: 'email', label: 'Email', icon: 'email' },
  { id: 'intranet', label: 'Intranet', icon: 'intranet' },
  { id: 'meeting', label: 'Meeting', icon: 'meeting' },
  { id: 'sms', label: 'SMS', icon: 'sms' },
  { id: 'social', label: 'Social Media', icon: 'social' },
  { id: 'feedback', label: 'Feedback Form', icon: 'feedback' },
];

const SUBTASK_DEFINITIONS = [
  { id: 'def-copy', label: 'Copywriting', estimated_minutes: 120, channels: ['email', 'intranet', 'sms', 'social'] },
  { id: 'def-design', label: 'Design', estimated_minutes: 180, channels: ['email', 'intranet', 'social'] },
  { id: 'def-approval', label: 'Approval', estimated_minutes: 30, channels: ['email', 'intranet', 'sms', 'social', 'feedback'] },
  { id: 'def-dev', label: 'Development', estimated_minutes: 240, channels: ['intranet', 'feedback'] },
  { id: 'def-review', label: 'Content Review', estimated_minutes: 60, channels: ['email', 'intranet', 'social'] },
  { id: 'def-logistics', label: 'Logistics', estimated_minutes: 90, channels: ['meeting'] },
  { id: 'def-invite', label: 'Invite Management', estimated_minutes: 45, channels: ['meeting'] },
  { id: 'def-slides', label: 'Slide Deck', estimated_minutes: 120, channels: ['meeting'] },
];

const COMPOSITIONS = [
  { id: 'comp-email-std', channel_id: 'email', name: 'Standard Email', definitions: ['def-copy', 'def-design', 'def-approval'] },
  { id: 'comp-email-short', channel_id: 'email', name: 'Short-form Email', definitions: ['def-copy', 'def-approval'] },
  { id: 'comp-intranet-std', channel_id: 'intranet', name: 'Standard Intranet Post', definitions: ['def-copy', 'def-design', 'def-dev', 'def-approval'] },
  { id: 'comp-meeting-std', channel_id: 'meeting', name: 'Standard Meeting', definitions: ['def-logistics', 'def-invite', 'def-slides'] },
  { id: 'comp-sms-std', channel_id: 'sms', name: 'Standard SMS', definitions: ['def-copy', 'def-approval'] },
  { id: 'comp-social-std', channel_id: 'social', name: 'Standard Social Post', definitions: ['def-copy', 'def-design', 'def-review', 'def-approval'] },
  { id: 'comp-feedback-std', channel_id: 'feedback', name: 'Standard Feedback Form', definitions: ['def-dev', 'def-approval'] },
];

const SEED_WORKSPACE_ID = 'seed-ws-1';
const SEED_USER_ID = 'seed-user-1';
const SEED_DCX_ID = 'seed-dcx-1';
const SEED_VERSION_ID = 'seed-v-1';
const SEED_PHASE_ID = 'seed-phase-1';
const SEED_ACTION_ID = 'seed-action-1';
const SEED_TASK_ID = 'seed-task-1';
const SEED_SUBTASK_ID = 'seed-subtask-1';
const SEED_FILE_ID = 'seed-file-1';
const SEED_ACTIVITY_ID = 'seed-activity-1';

async function upsert(table, rows, onConflict) {
  const { error } = await db.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`seed-dev: ${table} upsert failed: ${error.message}`);
}

async function main() {
  await upsert('channels', CHANNELS, 'id');
  await upsert(
    'subtask_definitions',
    SUBTASK_DEFINITIONS.map((d) => ({ id: d.id, label: d.label, estimated_minutes: d.estimated_minutes })),
    'id',
  );
  await upsert(
    'subtask_definition_channels',
    SUBTASK_DEFINITIONS.flatMap((d) => d.channels.map((channel_id) => ({ definition_id: d.id, channel_id }))),
    'definition_id,channel_id',
  );
  await upsert(
    'channel_compositions',
    COMPOSITIONS.map((c) => ({ id: c.id, channel_id: c.channel_id, name: c.name, created_by: 'system', is_user_defined: false })),
    'id',
  );
  await upsert(
    'composition_definitions',
    COMPOSITIONS.flatMap((c) => c.definitions.map((definition_id) => ({ composition_id: c.id, definition_id }))),
    'composition_id,definition_id',
  );
  await upsert(
    'channel_available_compositions',
    COMPOSITIONS.map((c) => ({ channel_id: c.channel_id, composition_id: c.id })),
    'channel_id,composition_id',
  );

  await upsert('workspaces', [{ id: SEED_WORKSPACE_ID, name: 'PAC-R4 Seed Workspace' }], 'id');
  await upsert(
    'memberships',
    [{ workspace_id: SEED_WORKSPACE_ID, user_id: SEED_USER_ID, role: 'admin' }],
    'workspace_id,user_id',
  );

  const timestamp = new Date().toISOString();
  await upsert(
    'dcx',
    [
      {
        id: SEED_DCX_ID,
        workspace_id: SEED_WORKSPACE_ID,
        project_name: 'PAC-R4 Seed Project',
        product: 'DCX Suite',
        created_at: timestamp,
        created_by: SEED_USER_ID,
      },
    ],
    'id',
  );
  await upsert(
    'versions',
    [
      {
        id: SEED_VERSION_ID,
        dcx_id: SEED_DCX_ID,
        version_number: 'V1',
        status: 'In Progress',
        communicated_date: '2026-07-15',
        created_at: timestamp,
        created_by: SEED_USER_ID,
        last_updated_at: timestamp,
        last_updated_by: SEED_USER_ID,
        in_progress_at: timestamp,
        source_type: 'scratch',
      },
    ],
    'id',
  );
  await upsert(
    'phases',
    [{ id: SEED_PHASE_ID, version_id: SEED_VERSION_ID, label: 'Awareness', icon: 'awareness', order_index: 0 }],
    'id',
  );
  await upsert(
    'actions',
    [{ id: SEED_ACTION_ID, phase_id: SEED_PHASE_ID, name: 'Launch email stream', order_index: 0 }],
    'id',
  );
  await upsert(
    'tasks',
    [
      {
        id: SEED_TASK_ID,
        action_id: SEED_ACTION_ID,
        name: 'Announcement email',
        channel_id: 'email',
        composition_id: 'comp-email-std',
        message: 'Seed task message',
        sender_id: SEED_USER_ID,
        receiver_id: 'audience-all',
        order_index: 0,
        date: { mode: 'unset' },
        specs_state: { status: 'empty' },
        missing_data_state: { status: 'empty' },
      },
    ],
    'id',
  );
  await upsert(
    'subtasks',
    [{ id: SEED_SUBTASK_ID, task_id: SEED_TASK_ID, label: 'Write subject line', done: false, order_index: 0 }],
    'id',
  );
  await upsert(
    'file_attachments',
    [
      {
        id: SEED_FILE_ID,
        version_id: SEED_VERSION_ID,
        title: 'Seed Brief.pdf',
        url: 'https://drive.google.com/file/d/seed-1',
        source: 'google-drive',
        created_by: SEED_USER_ID,
        created_at: timestamp,
      },
    ],
    'id',
  );
  await upsert(
    'activity_events',
    [
      {
        id: SEED_ACTIVITY_ID,
        type: 'in_progress_started',
        version_id: SEED_VERSION_ID,
        user_id: SEED_USER_ID,
        timestamp,
      },
    ],
    'id',
  );

  console.log('seed-dev: OK — catalog + 1 workspace/dcx/version/builder-tree/file/activity seeded.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
