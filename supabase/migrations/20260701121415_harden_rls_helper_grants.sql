-- Found via get_advisors (security) after pac_r1_init_schema_rls: the 3 RLS helper
-- functions (SECURITY DEFINER) default to anon/authenticated EXECUTE via Supabase's
-- schema-level default privileges (not PUBLIC -- REVOKE FROM PUBLIC alone is a no-op,
-- kept below for documentation, the real fix is the anon-specific revoke).
REVOKE EXECUTE ON FUNCTION app_user_workspace_ids() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION app_user_can_edit(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION app_version_workspace(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION app_user_workspace_ids() TO authenticated;
GRANT EXECUTE ON FUNCTION app_user_can_edit(text) TO authenticated;
GRANT EXECUTE ON FUNCTION app_version_workspace(text) TO authenticated;

REVOKE EXECUTE ON FUNCTION app_user_workspace_ids() FROM anon;
REVOKE EXECUTE ON FUNCTION app_user_can_edit(text) FROM anon;
REVOKE EXECUTE ON FUNCTION app_version_workspace(text) FROM anon;
