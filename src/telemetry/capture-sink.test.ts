import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { captureSink } from './capture-sink';
import { apiClient } from '@/services/api-client';

/**
 * BE3-R5a — measurable no-harm proof for the off-by-default capture tap.
 * Asserts the sink is NOT invoked with the flag unset, IS invoked with it set,
 * and that apiClient returns identical data either way. Also proves scrub + shape.
 */
describe('capture-sink (BE3-R5a)', () => {
  beforeEach(() => {
    captureSink.flush(); // clear ring between tests
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    captureSink.flush();
  });

  it('is OFF by default (no flag) — record is a no-op', () => {
    vi.unstubAllEnvs();
    expect(captureSink.isEnabled()).toBe(false);
    captureSink.record({ route: '/x', method: 'GET', requestBody: undefined, response: {}, durationMs: 1 });
    expect(captureSink.getAll()).toHaveLength(0);
  });

  it('records only when VITE_BE3_CAPTURE=1', () => {
    vi.stubEnv('VITE_BE3_CAPTURE', '1');
    expect(captureSink.isEnabled()).toBe(true);
    captureSink.record({ route: '/x', method: 'GET', requestBody: undefined, response: { a: 1 }, durationMs: 2 });
    expect(captureSink.getAll()).toHaveLength(1);
  });

  it('flag OFF: apiClient does NOT invoke the sink', async () => {
    vi.unstubAllEnvs();
    const spy = vi.spyOn(captureSink, 'record');
    await apiClient('/api/channels');
    expect(spy).not.toHaveBeenCalled();
    expect(captureSink.getAll()).toHaveLength(0);
  });

  it('flag ON: apiClient DOES invoke the sink', async () => {
    vi.stubEnv('VITE_BE3_CAPTURE', '1');
    const spy = vi.spyOn(captureSink, 'record');
    await apiClient('/api/channels');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(captureSink.getAll()).toHaveLength(1);
    expect(captureSink.getAll()[0].route).toBe('/api/channels');
  });

  it('returns identical data whether the flag is off or on (no behavior change)', async () => {
    vi.unstubAllEnvs();
    const off = await apiClient('/api/channels');
    vi.stubEnv('VITE_BE3_CAPTURE', '1');
    const on = await apiClient('/api/channels');
    expect(on.data).toEqual(off.data);
  });

  it('scrubs secret-like keys from the request body', () => {
    vi.stubEnv('VITE_BE3_CAPTURE', '1');
    captureSink.record({
      route: '/ai/review-draft',
      method: 'POST',
      requestBody: { prompt: 'hi', apiKey: 'sk-SECRET', nested: { token: 'abc', keep: 'ok' } },
      response: {},
      durationMs: 1,
    });
    const body = captureSink.getAll()[0].requestBody as Record<string, unknown>;
    expect(body.prompt).toBe('hi');
    expect(body.apiKey).toBe('[REDACTED]');
    expect((body.nested as Record<string, unknown>).token).toBe('[REDACTED]');
    expect((body.nested as Record<string, unknown>).keep).toBe('ok');
  });

  it('records a field-shape descriptor, not raw response values', () => {
    vi.stubEnv('VITE_BE3_CAPTURE', '1');
    captureSink.record({
      route: '/versions/v1',
      method: 'GET',
      requestBody: undefined,
      response: { id: 'v1', communicatedDate: null, tags: ['a'] },
      durationMs: 1,
    });
    const shape = captureSink.getAll()[0].responseShape as Record<string, unknown>;
    expect(shape.id).toBe('string');
    expect(shape.communicatedDate).toBe('null');
    expect(shape.tags).toEqual(['string']);
    // raw value 'v1' must NOT appear in the shape descriptor
    expect(JSON.stringify(shape)).not.toContain('v1');
  });
});
