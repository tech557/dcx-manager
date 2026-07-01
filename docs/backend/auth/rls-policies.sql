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
-- Fixed post-PAC-R4 (tracked debt): the original WITH CHECK ran a raw EXISTS against
-- `memberships` directly, which has RLS enabled with zero SELECT policies of its own —
-- the subquery always evaluated empty under the querying role, rejecting every insert
-- even for real editors/admins. Routed through the SECURITY DEFINER helper
-- `app_user_is_any_editor()` instead (schema-auth-additions.sql), same fix class as
-- PAC-R2's getMyAccessReal/checkDCXAccessReal.
CREATE POLICY channel_compositions_write ON channel_compositions FOR INSERT
  WITH CHECK (app_user_is_any_editor());

-- Join tables follow their parents' visibility (catalog-level, authenticated read).
-- `composition_definitions`/`channel_available_compositions` also need write policies:
-- `POST /api/channels/:channelId/compositions` (real-dispatch.ts createComposition) inserts
-- into both as part of creating a composition, same as it inserts into `channel_compositions`.
-- Found post-fix of the channel_compositions_write tracked debt (2026-07-01): the original
-- policy blocking every insert masked that these two join tables had no write policy at all.
CREATE POLICY channel_available_compositions_read ON channel_available_compositions FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY channel_available_compositions_write ON channel_available_compositions FOR INSERT
  WITH CHECK (app_user_is_any_editor());
CREATE POLICY composition_definitions_read ON composition_definitions FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY composition_definitions_write ON composition_definitions FOR INSERT
  WITH CHECK (app_user_is_any_editor());
CREATE POLICY subtask_definition_channels_read ON subtask_definition_channels FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- NOTE: GET /access/me and GET /dcx/:id/access are NOT table reads — they resolve
-- from the auth session + memberships (see auth-model.md interface-conformance).
-- GET /clickup/entry/:id and POST /ai/review-draft are integration routes, not
-- table CRUD (BE3-R4 decides their v1 shape); no table policy applies.

-- END draft RLS policies (BE3-R3).
