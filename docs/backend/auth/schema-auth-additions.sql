-- ============================================================================
-- DCX Manager — AUTH schema ADDENDUM (BE3-R3, backend-discovery-v3)
-- ============================================================================
-- The tables the auth/RLS model needs, written as an ADDENDUM under
-- docs/backend/auth/ (NOT docs/backend/schema/ — R3 single-owner boundary,
-- audit blocking #3). BE3-R6 merges this into docs/backend/schema/schema.sql.
-- Proposal only — never applied (D-BE3-NO-APPLY).
--
-- These tables realise MyAccess { userId, isAuthenticated, workspaceIds[] } and
-- DCXAccess { hasAccess, canEdit } against real Supabase Auth + RLS.
-- ============================================================================

-- Role within a workspace. `canEdit` (DCXAccess) is true for editor/admin.
CREATE TYPE membership_role AS ENUM ('viewer', 'editor', 'admin');

-- A tenant boundary. Every dcx belongs to exactly one workspace.
-- MERGE NOTE for BE3-R6: `dcx.client_id` (schema.sql) becomes
--   `dcx.workspace_id text NOT NULL REFERENCES workspaces(id)`.
CREATE TABLE workspaces (
  id         text PRIMARY KEY,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Supabase Auth owns the user identity (auth.users). `user_id` is the auth uid
-- (text form of the uuid). Membership is the MyAccess.workspaceIds source.
CREATE TABLE memberships (
  workspace_id text NOT NULL REFERENCES workspaces(id),
  user_id      text NOT NULL,              -- = auth.uid()::text
  role         membership_role NOT NULL DEFAULT 'viewer',
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE INDEX memberships_user_idx ON memberships (user_id);

-- ---------------------------------------------------------------------------
-- RLS helper functions (SECURITY DEFINER) — the join key every policy reuses.
-- ---------------------------------------------------------------------------

-- The workspace ids the current session user belongs to (=> MyAccess.workspaceIds).
CREATE OR REPLACE FUNCTION app_user_workspace_ids()
RETURNS SETOF text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT workspace_id FROM memberships WHERE user_id = auth.uid()::text;
$$;

-- Whether the current user may EDIT in the given workspace (editor/admin).
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

-- The owning workspace of a version (version -> dcx -> workspace). Reused by every
-- version-scoped policy so the chain is expressed once.
-- MERGE NOTE: depends on dcx.workspace_id (see merge note above).
CREATE OR REPLACE FUNCTION app_version_workspace(target_version text)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT d.workspace_id
  FROM versions v JOIN dcx d ON d.id = v.dcx_id
  WHERE v.id = target_version;
$$;

-- Whether the current user is editor/admin in ANY of their workspaces (no target
-- workspace scope). Added to fix `channel_compositions_write` (PAC-R4 tracked debt):
-- `channel_compositions` has no workspace column (shared catalog), so the write
-- policy's original intent ("any editor/admin in any workspace") needs a helper
-- with no `target_workspace` argument, routed through SECURITY DEFINER so it can
-- read `memberships` despite that table having zero SELECT policies of its own.
CREATE OR REPLACE FUNCTION app_user_is_any_editor()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()::text
      AND role IN ('editor', 'admin')
  );
$$;

-- END auth addendum. Merged into schema.sql by BE3-R6.
