-- Migration: production-api-client-switch PAC-R1 — initial schema + RLS
-- Assembled from docs/backend/schema/schema.sql + docs/backend/auth/rls-policies.sql
-- (backend-discovery-v3 frozen dataset, READY 2026-07-01). Applied to dcx-manager-dev only.

-- ============================================================================
-- DCX Manager — PROPOSED Supabase schema (BE3-R2, backend-discovery-v3)
-- ============================================================================
-- DERIVED mechanically from src/types/api.ts (Api* types) + src/types/lifecycle.ts
-- (enums) + the mock seed. This is a PROPOSAL — D-BE3-NO-APPLY: it is NEVER applied
-- to either Supabase project during this discovery plan. The build plan
-- (production-api-client-switch) applies it after the readiness gate passes.
--
-- Conventions:
--   * snake_case columns mirror camelCase Api* fields (mapper handles the seam).
--   * Primary keys typed `text` to match current string ids (HYPOTHESIS — see
--     rationale.md: uuid preferred once BE3-R5 capture confirms id format).
--   * enum unions -> Postgres ENUM types; file source uses ENUM.
--   * ApiJsonValue / metadata / *_context / details -> jsonb.
--   * Discriminated unions (ApiTaskDate, ApiFieldCompletionState) -> jsonb
--     (OD-BE3-01; see rationale.md for the jsonb-vs-normalized trade-off).
--   * Column sizing / index choices are HYPOTHESIS pending BE3-R5 capture (G5).
--   * RLS is ENABLED per table; the actual policies are the BE3-R3 addendum
--     (docs/backend/auth/rls-policies.sql + schema-auth-additions.sql), merged
--     into this file by BE3-R6.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums (from src/types/lifecycle.ts + ApiPhaseIconType + file source)
-- ---------------------------------------------------------------------------
CREATE TYPE version_status AS ENUM (
  'Draft', 'In Progress', 'Ready for Approval', 'Approved', 'Superseded'
);

CREATE TYPE version_source_type AS ENUM (
  'scratch', 'duplicate', 'import', 'template'
);

CREATE TYPE lifecycle_event_type AS ENUM (
  'version_created', 'in_progress_started', 'ready_submitted',
  'approved', 'superseded', 'duplicated', 'import_applied'
);

CREATE TYPE phase_icon_type AS ENUM (
  'awareness', 'teaser', 'launch', 'scale', 'maintenance'
);

CREATE TYPE file_source AS ENUM ('google-drive', 'link');

-- ---------------------------------------------------------------------------
-- Reference/catalog tables (channels, subtask_definitions, compositions)
-- Ordered first so downstream FKs (tasks, join tables) resolve.
-- ---------------------------------------------------------------------------

-- ApiChannel
CREATE TABLE channels (
  id    text PRIMARY KEY,
  label text NOT NULL,
  icon  text NOT NULL           -- HYPOTHESIS: free string today; may become an enum after capture
  -- availableCompositionIds -> M:N via channel_available_compositions
);

-- ApiSubtaskDefinition
CREATE TABLE subtask_definitions (
  id                text PRIMARY KEY,
  label             text NOT NULL,
  estimated_minutes integer          -- ApiSubtaskDefinition.estimatedMinutes: number | null
  -- channelIds -> M:N via subtask_definition_channels
);

-- ApiChannelComposition
CREATE TABLE channel_compositions (
  id              text PRIMARY KEY,
  channel_id      text NOT NULL REFERENCES channels(id),
  name            text NOT NULL,
  created_by      text NOT NULL,
  is_user_defined boolean NOT NULL
  -- definitionIds -> M:N via composition_definitions
);

-- M:N — a channel's available compositions (ApiChannel.availableCompositionIds)
CREATE TABLE channel_available_compositions (
  channel_id     text NOT NULL REFERENCES channels(id),
  composition_id text NOT NULL REFERENCES channel_compositions(id),
  PRIMARY KEY (channel_id, composition_id)
);

-- M:N — a composition's subtask definitions (ApiChannelComposition.definitionIds)
CREATE TABLE composition_definitions (
  composition_id text NOT NULL REFERENCES channel_compositions(id),
  definition_id  text NOT NULL REFERENCES subtask_definitions(id),
  PRIMARY KEY (composition_id, definition_id)
);

-- M:N — a definition's channels (ApiSubtaskDefinition.channelIds)
CREATE TABLE subtask_definition_channels (
  definition_id text NOT NULL REFERENCES subtask_definitions(id),
  channel_id    text NOT NULL REFERENCES channels(id),
  PRIMARY KEY (definition_id, channel_id)
);

-- ---------------------------------------------------------------------------
-- Auth tenancy (MERGED from BE3-R3 addendum docs/backend/auth/schema-auth-additions.sql by BE3-R6).
-- Ordered before dcx so dcx.workspace_id FK resolves.
-- ---------------------------------------------------------------------------
CREATE TYPE membership_role AS ENUM ('viewer', 'editor', 'admin');

CREATE TABLE workspaces (
  id         text PRIMARY KEY,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  workspace_id text NOT NULL REFERENCES workspaces(id),
  user_id      text NOT NULL,              -- = auth.uid()::text
  role         membership_role NOT NULL DEFAULT 'viewer',
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE INDEX memberships_user_idx ON memberships (user_id);

-- RLS helper functions reused by every workspace-scoped policy (rls-policies.sql).
CREATE OR REPLACE FUNCTION app_user_workspace_ids()
RETURNS SETOF text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT workspace_id FROM memberships WHERE user_id = auth.uid()::text;
$$;

CREATE OR REPLACE FUNCTION app_user_can_edit(target_workspace text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()::text
      AND workspace_id = target_workspace
      AND role IN ('editor', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION app_version_workspace(target_version text)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT d.workspace_id
  FROM versions v JOIN dcx d ON d.id = v.dcx_id
  WHERE v.id = target_version;
$$;

-- ---------------------------------------------------------------------------
-- Core campaign hierarchy: dcx -> versions -> phases -> actions -> tasks -> subtasks
-- ---------------------------------------------------------------------------

-- ApiDCX
CREATE TABLE dcx (
  id           text PRIMARY KEY,
  workspace_id text NOT NULL REFERENCES workspaces(id),   -- BE3-R6 merge: was client_id; now the tenant FK
  project_name text NOT NULL,
  product      text NOT NULL,
  sub_product  text,                   -- string | null
  tags         text[] NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL,
  created_by   text NOT NULL,
  metadata     jsonb                   -- ApiJsonValue | null
);

-- ApiVersion
CREATE TABLE versions (
  id                 text PRIMARY KEY,
  dcx_id             text NOT NULL REFERENCES dcx(id),
  version_number     text NOT NULL,
  status             version_status NOT NULL,
  communicated_date  timestamptz,          -- string | null (HYPOTHESIS: date vs timestamptz — capture confirms)
  created_at         timestamptz NOT NULL,
  created_by         text NOT NULL,
  last_updated_at    timestamptz NOT NULL,
  last_updated_by    text NOT NULL,
  in_progress_at     timestamptz,
  ready_at           timestamptz,
  approved_at        timestamptz,
  superseded_at      timestamptz,
  source_type        version_source_type NOT NULL,
  source_version_id  text REFERENCES versions(id),   -- self-FK (duplicate lineage)
  source_backup_id   text,
  source_template_id text,
  metadata           jsonb,
  strategy_context   jsonb
  -- assignedTeam -> version_members ; attachments -> file_attachments
);

-- ApiPhase
CREATE TABLE phases (
  id          text PRIMARY KEY,
  version_id  text NOT NULL REFERENCES versions(id),
  label       text NOT NULL,
  icon        phase_icon_type NOT NULL,
  order_index integer NOT NULL,
  updated_at  timestamptz,
  updated_by  text,
  metadata    jsonb
);

-- ApiAction
CREATE TABLE actions (
  id          text PRIMARY KEY,
  phase_id    text NOT NULL REFERENCES phases(id),
  name        text NOT NULL,
  description text,
  order_index integer NOT NULL,
  updated_at  timestamptz,
  updated_by  text,
  metadata    jsonb
);

-- ApiTask
CREATE TABLE tasks (
  id                 text PRIMARY KEY,
  action_id          text NOT NULL REFERENCES actions(id),
  name               text NOT NULL,
  channel_id         text NOT NULL REFERENCES channels(id),
  composition_id     text REFERENCES channel_compositions(id),   -- string | null
  message            text NOT NULL,
  sender_id          text NOT NULL,
  receiver_id        text NOT NULL,
  order_index        integer NOT NULL,
  date               jsonb NOT NULL,   -- ApiTaskDate discriminated union (OD-BE3-01: jsonb)
  specs_state        jsonb NOT NULL,   -- ApiFieldCompletionState (OD-BE3-01: jsonb)
  missing_data_state jsonb NOT NULL,   -- ApiFieldCompletionState (OD-BE3-01: jsonb)
  is_small           boolean,          -- boolean | null
  updated_at         timestamptz,
  updated_by         text,
  metadata           jsonb,
  generation_context jsonb
  -- subtasks -> subtasks table
);

-- ApiSubtask
CREATE TABLE subtasks (
  id                text PRIMARY KEY,
  task_id           text NOT NULL REFERENCES tasks(id),
  definition_id     text REFERENCES subtask_definitions(id),   -- string | null
  label             text NOT NULL,
  done              boolean NOT NULL DEFAULT false,
  estimated_minutes integer,           -- number | null
  order_index       integer NOT NULL,
  metadata          jsonb
);

-- ---------------------------------------------------------------------------
-- Attachments, membership, activity
-- ---------------------------------------------------------------------------

-- ApiFileAttachment
CREATE TABLE file_attachments (
  id         text PRIMARY KEY,
  version_id text NOT NULL REFERENCES versions(id),
  title      text NOT NULL,
  url        text NOT NULL,
  source     file_source NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL
);

-- ApiAssignedMember (join: a version's assigned team)
CREATE TABLE version_members (
  version_id   text NOT NULL REFERENCES versions(id),
  user_id      text NOT NULL,
  role         text NOT NULL,          -- HYPOTHESIS: free string; may become an enum with the auth model (BE3-R3)
  is_protected boolean NOT NULL DEFAULT false,
  PRIMARY KEY (version_id, user_id)
);

-- ApiActivityEvent
CREATE TABLE activity_events (
  id         text PRIMARY KEY,
  type       lifecycle_event_type NOT NULL,
  version_id text NOT NULL REFERENCES versions(id),
  user_id    text NOT NULL,
  timestamp  timestamptz NOT NULL,
  details    jsonb                     -- ApiJsonValue | null
);

-- ---------------------------------------------------------------------------
-- ApiBuilderTree is a COMPOSITE READ (version + its phases tree), not a table.
-- It maps to a view / nested query, not stored state:
--
-- CREATE VIEW builder_tree AS  -- illustrative; the tree is assembled app-side
--   SELECT v.*, (nested phases -> actions -> tasks -> subtasks) FROM versions v ...
--
-- The GET/PATCH /versions/:id/builder routes read/write the phases subtree; they
-- do not imply a `builder_tree` table.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Row-Level Security — ENABLE here; POLICIES are the BE3-R3 addendum.
-- (BE3-R6 merges docs/backend/auth/rls-policies.sql + schema-auth-additions.sql.)
-- ---------------------------------------------------------------------------
ALTER TABLE workspaces                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtask_definitions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_compositions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_available_compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE composition_definitions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtask_definition_channels    ENABLE ROW LEVEL SECURITY;
ALTER TABLE dcx                            ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases                         ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                          ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE version_members                ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events                ENABLE ROW LEVEL SECURITY;

-- END proposed schema. BE3-R2: 15 tables + 5 enums. BE3-R6 merge (+auth addendum):
-- +2 tables (workspaces, memberships) + 1 enum (membership_role) + 3 RLS helper fns;
-- dcx.client_id -> dcx.workspace_id FK. Total 17 tables + 6 enums. Never applied during discovery.

-- ---------------------------------------------------------------------------
-- RLS policies (docs/backend/auth/rls-policies.sql, BE3-R3)
-- ---------------------------------------------------------------------------
-- ============================================================================
-- DCX Manager — DRAFT Row-Level Security policies (BE3-R3)
-- ============================================================================
-- DRAFT ONLY — never applied (D-BE3-NO-APPLY). Depends on the addendum
-- (schema-auth-additions.sql: workspaces, memberships, membership_role, and the
-- app_user_workspace_ids() / app_user_can_edit() / app_version_workspace()
-- helpers) and on RLS already ENABLEd per table in schema.sql.
--
-- Model: read = the row's owning workspace is in the user's memberships;
--        write = same, AND the user's role is editor/admin (=> DCXAccess.canEdit).
-- Tenancy boundary = workspace-scoped (OD-BE3-02, recommended). See auth-model.md.
--
-- Naming: <table>_read / <table>_write. Every CONTRACT read route maps to a read
-- (SELECT) policy on the table it reads; every CONTRACT write route maps to a
-- write (INSERT/UPDATE) policy on the table it mutates.
-- ============================================================================

-- ── dcx (root tenant object) ────────────────────────────────────────────────
CREATE POLICY dcx_read ON dcx FOR SELECT
  USING (workspace_id IN (SELECT app_user_workspace_ids()));
CREATE POLICY dcx_write ON dcx FOR ALL
  USING (app_user_can_edit(workspace_id))
  WITH CHECK (app_user_can_edit(workspace_id));

-- ── versions ────────────────────────────────────────────────────────────────
-- reads: GET /versions, /dcx/:id/versions, /versions/:id, /versions/:id/builder
-- writes: PATCH status, PATCH date, POST duplicate, PATCH builder
CREATE POLICY versions_read ON versions FOR SELECT
  USING (app_version_workspace(id) IN (SELECT app_user_workspace_ids()));
CREATE POLICY versions_write ON versions FOR ALL
  USING (app_user_can_edit(app_version_workspace(id)))
  WITH CHECK (app_user_can_edit((SELECT d.workspace_id FROM dcx d WHERE d.id = dcx_id)));

-- ── phases / actions / tasks / subtasks (builder subtree) ────────────────────
-- read: GET /versions/:id/builder ; write: PATCH /versions/:id/builder
CREATE POLICY phases_read ON phases FOR SELECT
  USING (app_version_workspace(version_id) IN (SELECT app_user_workspace_ids()));
CREATE POLICY phases_write ON phases FOR ALL
  USING (app_user_can_edit(app_version_workspace(version_id)))
  WITH CHECK (app_user_can_edit(app_version_workspace(version_id)));

CREATE POLICY actions_read ON actions FOR SELECT
  USING (app_version_workspace((SELECT p.version_id FROM phases p WHERE p.id = phase_id))
         IN (SELECT app_user_workspace_ids()));
CREATE POLICY actions_write ON actions FOR ALL
  USING (app_user_can_edit(app_version_workspace((SELECT p.version_id FROM phases p WHERE p.id = phase_id))))
  WITH CHECK (app_user_can_edit(app_version_workspace((SELECT p.version_id FROM phases p WHERE p.id = phase_id))));

CREATE POLICY tasks_read ON tasks FOR SELECT
  USING (app_version_workspace(
           (SELECT p.version_id FROM phases p JOIN actions a ON a.phase_id = p.id WHERE a.id = action_id))
         IN (SELECT app_user_workspace_ids()));
CREATE POLICY tasks_write ON tasks FOR ALL
  USING (app_user_can_edit(app_version_workspace(
           (SELECT p.version_id FROM phases p JOIN actions a ON a.phase_id = p.id WHERE a.id = action_id))))
  WITH CHECK (app_user_can_edit(app_version_workspace(
           (SELECT p.version_id FROM phases p JOIN actions a ON a.phase_id = p.id WHERE a.id = action_id))));

CREATE POLICY subtasks_read ON subtasks FOR SELECT
  USING (app_version_workspace(
           (SELECT p.version_id FROM phases p JOIN actions a ON a.phase_id = p.id
              JOIN tasks t ON t.action_id = a.id WHERE t.id = task_id))
         IN (SELECT app_user_workspace_ids()));
CREATE POLICY subtasks_write ON subtasks FOR ALL
  USING (app_user_can_edit(app_version_workspace(
           (SELECT p.version_id FROM phases p JOIN actions a ON a.phase_id = p.id
              JOIN tasks t ON t.action_id = a.id WHERE t.id = task_id))))
  WITH CHECK (app_user_can_edit(app_version_workspace(
           (SELECT p.version_id FROM phases p JOIN actions a ON a.phase_id = p.id
              JOIN tasks t ON t.action_id = a.id WHERE t.id = task_id))));

-- ── file_attachments ─────────────────────────────────────────────────────────
-- read: GET /versions/:id/files ; write: POST /versions/:id/files
CREATE POLICY file_attachments_read ON file_attachments FOR SELECT
  USING (app_version_workspace(version_id) IN (SELECT app_user_workspace_ids()));
CREATE POLICY file_attachments_write ON file_attachments FOR ALL
  USING (app_user_can_edit(app_version_workspace(version_id)))
  WITH CHECK (app_user_can_edit(app_version_workspace(version_id)));

-- ── activity_events ──────────────────────────────────────────────────────────
-- read: GET /activity-logs, GET /versions/:id/activity-logs ; write: POST /activity-logs
CREATE POLICY activity_events_read ON activity_events FOR SELECT
  USING (app_version_workspace(version_id) IN (SELECT app_user_workspace_ids()));
CREATE POLICY activity_events_write ON activity_events FOR INSERT
  WITH CHECK (app_user_can_edit(app_version_workspace(version_id)));

-- ── version_members ──────────────────────────────────────────────────────────
CREATE POLICY version_members_read ON version_members FOR SELECT
  USING (app_version_workspace(version_id) IN (SELECT app_user_workspace_ids()));
CREATE POLICY version_members_write ON version_members FOR ALL
  USING (app_user_can_edit(app_version_workspace(version_id)))
  WITH CHECK (app_user_can_edit(app_version_workspace(version_id)));

-- ── channels / subtask_definitions / channel_compositions (shared catalog) ────
-- reads: GET /api/channels, /api/subtask-definitions(+/:id), /api/channels/:id/compositions
-- write: POST /api/channels/:id/compositions (create composition)
-- Catalog is readable by any authenticated member; compositions are writable by editors.
CREATE POLICY channels_read ON channels FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY subtask_definitions_read ON subtask_definitions FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY channel_compositions_read ON channel_compositions FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY channel_compositions_write ON channel_compositions FOR INSERT
  WITH CHECK (
    -- any member with an editor/admin role in ANY of their workspaces may add a composition
    EXISTS (SELECT 1 FROM memberships m
            WHERE m.user_id = auth.uid()::text AND m.role IN ('editor','admin'))
  );

-- Join tables follow their parents' visibility (catalog-level, authenticated read).
CREATE POLICY channel_available_compositions_read ON channel_available_compositions FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY composition_definitions_read ON composition_definitions FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY subtask_definition_channels_read ON subtask_definition_channels FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- NOTE: GET /access/me and GET /dcx/:id/access are NOT table reads — they resolve
-- from the auth session + memberships (see auth-model.md interface-conformance).
-- GET /clickup/entry/:id and POST /ai/review-draft are integration routes, not
-- table CRUD (BE3-R4 decides their v1 shape); no table policy applies.

-- END draft RLS policies (BE3-R3).
