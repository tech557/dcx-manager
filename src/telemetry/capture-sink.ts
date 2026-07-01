/**
 * BE3-R5a — off-by-default backend request/response capture sink.
 *
 * Records each `apiClient` call (route, method, scrubbed request body, response
 * field-shape, timing) into an in-memory ring. It is a NO-OP unless the capture
 * flag `VITE_BE3_CAPTURE` is `'1'` — mirroring the opt-in pattern of
 * `src/telemetry/optin.ts`. It never ships enabled to production (asserted in CI
 * by scripts/backend/assert-capture-off-in-prod.sh, D-BE3-CAPTURE-OFF).
 *
 * Safety (plan §7.4): request bodies are scrubbed of secret-like keys; responses
 * are reduced to a field-shape descriptor (keys → type / null), never raw values,
 * so no PII/secret leaves the preview. Capture points only at dev/preview data.
 *
 * Exposed as a single `captureSink` object so a guarded tap in api-client.ts can
 * call it and tests can spy on it without ESM-namespace pitfalls.
 */

export interface CaptureRecord {
  route: string;
  method: string;
  /** request body with secret-like keys redacted (no raw secrets) */
  requestBody: unknown;
  /** per-field type/null descriptor of the response (no raw values) */
  responseShape: unknown;
  durationMs: number;
  timestamp: string;
}

const RING_LIMIT = 1000;
const ring: CaptureRecord[] = [];

const SECRET_KEY_RE =
  /(token|secret|password|passwd|api[-_]?key|authorization|auth|credential|bearer|cookie|session)/i;

/**
 * Read the capture flag from Vite env (browser/preview) or process.env (node/CI).
 * Accessed via `globalThis` so this compiles without Node type globals (the isolated
 * contract-check tsconfig sets `types: []`) and stays safe in the browser.
 */
function readCaptureFlag(): string | undefined {
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (viteEnv && viteEnv.VITE_BE3_CAPTURE !== undefined) return viteEnv.VITE_BE3_CAPTURE;
  const nodeEnv = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  return nodeEnv?.VITE_BE3_CAPTURE;
}

/** Redact secret-like keys anywhere in a request body; leaves shape intact. */
function scrub(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SECRET_KEY_RE.test(key) ? '[REDACTED]' : scrub(val);
    }
    return out;
  }
  return value;
}

/** Reduce a response to a keys→type/null descriptor (no raw values → no PII). */
function describeShape(value: unknown, depth = 0): unknown {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    return depth > 4 ? 'array' : [value.length > 0 ? describeShape(value[0], depth + 1) : 'empty'];
  }
  if (typeof value === 'object') {
    if (depth > 4) return 'object';
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = describeShape(val, depth + 1);
    }
    return out;
  }
  return typeof value;
}

export const captureSink = {
  /** True only when VITE_BE3_CAPTURE === '1'. The tap checks this before recording. */
  isEnabled(): boolean {
    return readCaptureFlag() === '1';
  },

  /** Record one api call. Caller guards on isEnabled(); this also self-guards. */
  record(input: {
    route: string;
    method: string;
    requestBody: unknown;
    response: unknown;
    durationMs: number;
  }): void {
    if (!this.isEnabled()) return;
    ring.push({
      route: input.route,
      method: input.method,
      requestBody: input.requestBody === undefined ? null : scrub(input.requestBody),
      responseShape: describeShape(input.response),
      durationMs: Math.round(input.durationMs * 1000) / 1000,
      timestamp: new Date().toISOString(),
    });
    if (ring.length > RING_LIMIT) ring.shift();
  },

  /** Current captured records (copy). */
  getAll(): CaptureRecord[] {
    return ring.slice();
  },

  /** Return captured records and clear the ring (used by the E2E/CI harness). */
  flush(): CaptureRecord[] {
    const out = ring.slice();
    ring.length = 0;
    return out;
  },
};

// When enabled, expose the sink to a preview/E2E harness so the CI capture job
// (BE3-R5b) can pull records after a journey walk. No-op when disabled.
if (captureSink.isEnabled() && typeof globalThis !== 'undefined') {
  (globalThis as unknown as { __BE3_CAPTURE__?: typeof captureSink }).__BE3_CAPTURE__ = captureSink;
}
