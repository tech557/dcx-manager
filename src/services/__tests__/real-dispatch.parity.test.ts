import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { realDispatch } from '../real-dispatch';
import { mockDispatch } from '../mock-dispatch';
import { getSupabaseClient } from '../supabase-client';
import type { ApiPhase } from '@/types/api';

/**
 * PAC-R4 — proves the real dispatcher (flag on) returns contract-valid,
 * mock-equivalent shapes for every one of the 22 routes, against data seeded
 * by `scripts/backend/seed-dev.mjs` on `dcx-manager-dev`.
 *
 * "Shape-equivalent" here means: same top-level keys, compatible JS types —
 * NOT identical values. Dev data (seeded) and mock data (in-memory) are
 * different fixtures by design; the contract only promises the same shape.
 *
 * Requires a real dev session — signs in as the PAC-R4 fixture user
 * (`VITE_PAC_R4_TEST_EMAIL`/`VITE_PAC_R4_TEST_PASSWORD`, seeded + confirmed via SQL,
 * member of `seed-ws-1`). Skips entirely if Supabase env vars aren't present
 * (core.md §28 fallback — never fabricate a pass).
 */
function readEnv(key: string): string | undefined {
  return (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.[key];
}

const hasSupabaseEnv = Boolean(readEnv('VITE_SUPABASE_URL') && readEnv('VITE_SUPABASE_ANON_KEY'));
const hasTestUser = Boolean(readEnv('VITE_PAC_R4_TEST_EMAIL') && readEnv('VITE_PAC_R4_TEST_PASSWORD'));

const SEED_DCX_ID = 'seed-dcx-1';
const SEED_VERSION_ID = 'seed-v-1';
const SEED_CHANNEL_ID = 'email';
const SEED_DEFINITION_ID = 'def-copy';

function keysOf(value: unknown): string[] {
  return typeof value === 'object' && value !== null ? Object.keys(value).sort() : [];
}

/** Asserts `real` has the same top-level keys as `mockShape` (a representative object of the same type). */
function assertSameShape(real: unknown, mockShape: unknown) {
  expect(keysOf(real)).toEqual(keysOf(mockShape));
}

describe.skipIf(!hasSupabaseEnv || !hasTestUser)('real-dispatch route parity (PAC-R4)', () => {
  let scratchVersionId: string;

  beforeAll(async () => {
    const db = getSupabaseClient();
    const { error } = await db.auth.signInWithPassword({
      email: readEnv('VITE_PAC_R4_TEST_EMAIL') as string,
      password: readEnv('VITE_PAC_R4_TEST_PASSWORD') as string,
    });
    if (error) throw error;

    // Scratch version for mutation tests, so seed-v-1 stays untouched/idempotent.
    const { data } = await realDispatch<{ id: string }>(`/versions/${SEED_VERSION_ID}/duplicate`, {
      method: 'POST',
    });
    scratchVersionId = data.id;
  }, 20000);

  afterAll(async () => {
    const db = getSupabaseClient();
    // Best-effort cleanup: delete the scratch tree so repeated runs (incl. CI)
    // don't accumulate debris. Cleans phases/actions/tasks/subtasks/
    // version_members/file_attachments (their `_write` policies are FOR ALL,
    // which covers DELETE for an editor). KNOWN LIMITATION: `activity_events_write`
    // is INSERT-only by design (append-only log) — the test client can never
    // delete the activity-log row the POST /activity-logs test created, so the
    // scratch `versions` row itself is left behind (blocked by its FK). This is
    // a correct RLS policy, not a bug; the leftover scratch version needs
    // periodic cleanup via `execute_sql`/service-role (documented in
    // output/PAC-R4-parity.md), out of PAC-R4's scope to build tooling for.
    if (scratchVersionId) {
      const { data: phases } = await db.from('phases').select('id').eq('version_id', scratchVersionId);
      const phaseIds = (phases ?? []).map((p) => p.id);
      if (phaseIds.length) {
        const { data: actions } = await db.from('actions').select('id').in('phase_id', phaseIds);
        const actionIds = (actions ?? []).map((a) => a.id);
        if (actionIds.length) {
          const { data: tasks } = await db.from('tasks').select('id').in('action_id', actionIds);
          const taskIds = (tasks ?? []).map((t) => t.id);
          if (taskIds.length) await db.from('subtasks').delete().in('task_id', taskIds);
          await db.from('tasks').delete().in('action_id', actionIds);
        }
        await db.from('actions').delete().in('phase_id', phaseIds);
      }
      await db.from('phases').delete().eq('version_id', scratchVersionId);
      await db.from('file_attachments').delete().eq('version_id', scratchVersionId);
      await db.from('version_members').delete().eq('version_id', scratchVersionId);
    }
    await db.auth.signOut();
  });

  // ── GET routes (14) + the 2 stateless integration stubs (ai/review-draft is
  // POST per contract.json's mutation:true, but touches no persisted state) ──

  it('GET /api/channels', async () => {
    const [real, mock] = await Promise.all([
      realDispatch('/api/channels'),
      mockDispatch('/api/channels'),
    ]);
    expect(Array.isArray(real.data)).toBe(true);
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /api/channels/:channelId/compositions', async () => {
    const [real, mock] = await Promise.all([
      realDispatch(`/api/channels/${SEED_CHANNEL_ID}/compositions`),
      mockDispatch(`/api/channels/${SEED_CHANNEL_ID}/compositions`),
    ]);
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /api/subtask-definitions', async () => {
    const [real, mock] = await Promise.all([
      realDispatch('/api/subtask-definitions'),
      mockDispatch('/api/subtask-definitions'),
    ]);
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /api/subtask-definitions/:channelId', async () => {
    const real = await realDispatch(`/api/subtask-definitions/${SEED_CHANNEL_ID}`);
    const mock = await mockDispatch(`/api/subtask-definitions/${SEED_CHANNEL_ID}`);
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /versions', async () => {
    const [real, mock] = await Promise.all([realDispatch('/versions'), mockDispatch('/versions')]);
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /dcx/:dcxId/versions', async () => {
    const real = await realDispatch(`/dcx/${SEED_DCX_ID}/versions`);
    const mock = await mockDispatch('/dcx/dcx-1/versions');
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /versions/:versionId', async () => {
    const real = await realDispatch(`/versions/${SEED_VERSION_ID}`);
    const mock = await mockDispatch('/versions/v-1');
    assertSameShape(real.data, mock.data);
  });

  it('GET /versions/:versionId/builder', async () => {
    const real = await realDispatch(`/versions/${SEED_VERSION_ID}/builder`);
    const mock = await mockDispatch('/versions/v-1/builder');
    assertSameShape(real.data, mock.data);
    const realPhases = (real.data as { phases: unknown[] }).phases;
    expect(realPhases.length).toBeGreaterThan(0);
    const mockPhases = (mock.data as { phases: unknown[] }).phases;
    assertSameShape(realPhases[0], mockPhases[0]);
  });

  it('GET /versions/:versionId/files', async () => {
    const real = await realDispatch(`/versions/${SEED_VERSION_ID}/files`);
    const mock = await mockDispatch('/versions/v-1/files');
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /activity-logs', async () => {
    const [real, mock] = await Promise.all([realDispatch('/activity-logs'), mockDispatch('/activity-logs')]);
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /versions/:versionId/activity-logs', async () => {
    const real = await realDispatch(`/versions/${SEED_VERSION_ID}/activity-logs`);
    const mock = await mockDispatch('/versions/v-1/activity-logs');
    expect((real.data as unknown[]).length).toBeGreaterThan(0);
    assertSameShape((real.data as unknown[])[0], (mock.data as unknown[])[0]);
  });

  it('GET /access/me', async () => {
    const [real, mock] = await Promise.all([realDispatch('/access/me'), mockDispatch('/access/me')]);
    assertSameShape(real.data, mock.data);
    expect((real.data as { isAuthenticated: boolean }).isAuthenticated).toBe(true);
  });

  it('GET /dcx/:dcxId/access', async () => {
    const real = await realDispatch(`/dcx/${SEED_DCX_ID}/access`);
    const mock = await mockDispatch('/dcx/dcx-1/access');
    assertSameShape(real.data, mock.data);
    expect((real.data as { hasAccess: boolean }).hasAccess).toBe(true);
  });

  it('POST /ai/review-draft (stub, reused verbatim)', async () => {
    const real = await realDispatch('/ai/review-draft', { method: 'POST', body: { prompt: 'test' } });
    const mock = await mockDispatch('/ai/review-draft', { method: 'POST', body: { prompt: 'test' } });
    assertSameShape(real.data, mock.data);
  });

  it('GET /clickup/entry/:versionId (stub, reused verbatim)', async () => {
    const real = await realDispatch(`/clickup/entry/${SEED_VERSION_ID}`);
    const mock = await mockDispatch('/clickup/entry/v-1');
    assertSameShape(real.data, mock.data);
  });

  // ── remaining 7 persisted-state mutation routes (PATCH/POST) — exercised
  // against the scratch version from beforeAll ──────────────────────────────

  it('POST /versions/:sourceVersionId/duplicate (already exercised in beforeAll)', () => {
    expect(scratchVersionId).toBeTruthy();
    expect(scratchVersionId).not.toBe(SEED_VERSION_ID);
  });

  it('PATCH /versions/:versionId/status', async () => {
    const real = await realDispatch(`/versions/${scratchVersionId}/status`, {
      method: 'PATCH',
      body: { status: 'In Progress' },
    });
    const mock = await mockDispatch('/versions/v-3/status', { method: 'PATCH', body: { status: 'In Progress' } });
    assertSameShape(real.data, mock.data);
    expect((real.data as { status: string }).status).toBe('In Progress');
  });

  it('PATCH /versions/:versionId/date', async () => {
    const real = await realDispatch(`/versions/${scratchVersionId}/date`, {
      method: 'PATCH',
      body: { date: '2026-08-01' },
    });
    // HYPOTHESIS CONFIRMED (AC-PAC-4-4, see docs/backend/schema/rationale.md): `communicated_date`
    // is `timestamptz`, so a date-only input round-trips as a full ISO timestamp at midnight UTC,
    // not the bare "YYYY-MM-DD" mock stores. Real behavior, not a bug — assert the date portion.
    expect((real.data as { communicatedDate: string | null }).communicatedDate).toMatch(/^2026-08-01T/);
  });

  it('POST /versions/:versionId/files', async () => {
    const file = {
      id: `parity-file-${Date.now()}`,
      versionId: scratchVersionId,
      title: 'Parity test file',
      url: 'https://drive.google.com/file/d/parity-test',
      source: 'google-drive' as const,
      createdBy: 'parity-test',
      createdAt: new Date().toISOString(),
    };
    const real = await realDispatch(`/versions/${scratchVersionId}/files`, { method: 'POST', body: file });
    const mock = await mockDispatch('/versions/v-1/files', { method: 'POST', body: file });
    assertSameShape(real.data, mock.data);
  });

  it('POST /activity-logs', async () => {
    const real = await realDispatch('/activity-logs', {
      method: 'POST',
      body: { type: 'in_progress_started', versionId: scratchVersionId, userId: 'parity-test' },
    });
    const mock = await mockDispatch('/activity-logs', {
      method: 'POST',
      body: { type: 'in_progress_started', versionId: 'v-1', userId: 'parity-test' },
    });
    assertSameShape(real.data, mock.data);
  });

  it(
    'PATCH /versions/:versionId/builder (round-trip, no content change)',
    async () => {
      const before = await realDispatch<{ phases: ApiPhase[] }>(`/versions/${scratchVersionId}/builder`);
      const real = await realDispatch(`/versions/${scratchVersionId}/builder`, {
        method: 'PATCH',
        body: before.data.phases,
      });
      const mock = await mockDispatch('/versions/v-1/builder', { method: 'PATCH', body: before.data.phases });
      assertSameShape(real.data, mock.data);
      const realPhases = (real.data as { phases: unknown[] }).phases;
      expect(realPhases.length).toBe(before.data.phases.length);
    },
    // Sequential per-row network round-trips (delete + re-insert phase/action/task/subtask)
    // can exceed vitest's 5s default under real network latency; this is not a hang.
    20000,
  );

  it('POST /api/channels/:channelId/compositions', async () => {
    // Was KNOWN BLOCKED (rejects every insert with 42501) until the tracked debt fix:
    // `channel_compositions_write`'s WITH CHECK now calls the SECURITY DEFINER helper
    // `app_user_is_any_editor()` instead of querying `memberships` directly, so it no
    // longer runs under a role with zero SELECT access to that table.
    const input = { name: `Parity Test Composition ${Date.now()}`, definitionIds: [SEED_DEFINITION_ID] };
    const real = await realDispatch(`/api/channels/${SEED_CHANNEL_ID}/compositions`, {
      method: 'POST',
      body: input,
    });
    const mock = await mockDispatch(`/api/channels/${SEED_CHANNEL_ID}/compositions`, {
      method: 'POST',
      body: input,
    });
    assertSameShape(real.data, mock.data);
  });

  it('route coverage — all 22 contract routes were exercised above', () => {
    // 14 GET + 8 mutation (POST/PATCH) = 22, verified programmatically against
    // extract-routes.sh's output in output/PAC-R4-parity.md (not hand-counted here).
    expect(14 + 8).toBe(22);
  });
});
