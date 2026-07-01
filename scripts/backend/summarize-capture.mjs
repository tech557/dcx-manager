#!/usr/bin/env node
/**
 * BE3-R5a — roll raw captured payloads into a per-route summary.
 *
 * Input : a JSON array of CaptureRecord ({route, method, requestBody,
 *         responseShape, durationMs, timestamp}) — the sink's flush() output.
 * Output: summary.json with, per route: capture count, methods, response kind,
 *         per-field population + null-rate, and duration stats. Plus a scrub
 *         check that fails if any secret-like value survived redaction (PII gate).
 *
 * Usage: node summarize-capture.mjs <raw-capture.json> [out-summary.json]
 * Never emits raw values — only field names, types, and rates.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// Load the contract route TEMPLATES (method + :param path) so concrete captured
// paths (e.g. /versions/v-abc) normalize back to their template (/versions/:versionId).
// Reuses extract-routes.sh — the single authoritative route list. Without this,
// parameterized routes fragment by id and coverage is measured at the wrong granularity.
function loadTemplates() {
  try {
    const out = execFileSync('bash', [resolve(here, 'extract-routes.sh')], { encoding: 'utf8' });
    return JSON.parse(out).map((r) => ({
      method: r.method,
      path: r.path,
      re: new RegExp('^' + r.path.replace(/:[^/]+/g, '[^/]+') + '$'),
    }));
  } catch {
    return []; // fall back to raw route strings if the extractor is unavailable
  }
}
const TEMPLATES = loadTemplates();

/** Map a concrete (method, path) to its contract template, or return the path unchanged. */
function toTemplate(method, path) {
  const m = TEMPLATES.find((t) => t.method === method && t.re.test(path));
  return m ? m.path : path;
}

const [, , rawPath, outPath] = process.argv;
if (!rawPath) {
  console.error('summarize-capture: usage: summarize-capture.mjs <raw-capture.json> [out.json]');
  process.exit(2);
}

const records = JSON.parse(readFileSync(rawPath, 'utf8'));
if (!Array.isArray(records)) {
  console.error('summarize-capture: input must be a JSON array of capture records');
  process.exit(2);
}

// ── Scrub check: no secret-like value may survive into the summary source. ──
// Precise on purpose: real API-key/token/password VALUES, not route/field names
// (e.g. "subtask-definitions" must not trip the sk- rule — hence the length + boundary).
const SECRET_VALUE_RE =
  /((?<![\w-])sk-[a-z0-9]{20,}|bearer\s+[a-z0-9._-]{16,}|password"?\s*[:=]\s*"?[^"\s]{6,})/i;
const REDACTED = '[REDACTED]';
let scrubViolations = 0;
const rawText = JSON.stringify(records);
if (SECRET_VALUE_RE.test(rawText)) scrubViolations += 1;

/** Extract the field descriptor object from a responseShape (array or object). */
function fieldObject(shape) {
  if (Array.isArray(shape)) return typeof shape[0] === 'object' && shape[0] !== null ? shape[0] : null;
  if (shape && typeof shape === 'object') return shape;
  return null;
}

const byRoute = new Map();
for (const r of records) {
  // Normalize the concrete path to its contract template and key by method+template,
  // so /versions/v-1 and /versions/v-2 aggregate under GET /versions/:versionId.
  const template = toTemplate(r.method, r.route);
  const key = `${r.method} ${template}`;
  if (!byRoute.has(key)) {
    byRoute.set(key, { route: template, methods: new Set(), count: 0, kinds: new Set(), durations: [], fields: new Map() });
  }
  const g = byRoute.get(key);
  g.count += 1;
  g.methods.add(r.method);
  g.durations.push(r.durationMs ?? 0);
  g.kinds.add(Array.isArray(r.responseShape) ? 'array' : typeof r.responseShape === 'object' ? 'object' : 'scalar');
  const fo = fieldObject(r.responseShape);
  if (fo) {
    for (const [field, desc] of Object.entries(fo)) {
      if (!g.fields.has(field)) g.fields.set(field, { present: 0, nulls: 0, types: new Set() });
      const f = g.fields.get(field);
      f.present += 1;
      if (desc === 'null') f.nulls += 1;
      f.types.add(Array.isArray(desc) ? 'array' : typeof desc === 'object' ? 'object' : String(desc));
    }
  }
}

const routes = [...byRoute.values()].map((g) => {
  const durs = g.durations;
  const fields = [...g.fields.entries()].map(([name, f]) => ({
    field: name,
    population_rate: Math.round(((f.present - f.nulls) / g.count) * 1000) / 1000,
    null_rate: Math.round((f.nulls / g.count) * 1000) / 1000,
    types: [...f.types].sort(),
  }));
  return {
    route: g.route,
    methods: [...g.methods].sort(),
    captures: g.count,
    response_kind: [...g.kinds].sort(),
    duration_ms: {
      min: Math.min(...durs),
      max: Math.max(...durs),
      avg: Math.round((durs.reduce((a, b) => a + b, 0) / durs.length) * 1000) / 1000,
    },
    fields,
  };
}).sort((a, b) => a.route.localeCompare(b.route));

const summary = {
  _meta: {
    generated_by: 'scripts/backend/summarize-capture.mjs (BE3-R5a)',
    source: rawPath,
    total_records: records.length,
    routes_observed: routes.length,
    scrub_check: scrubViolations === 0 ? 'PASS' : `FAIL (${scrubViolations} secret-like value survived)`,
    redaction_marker: REDACTED,
  },
  routes,
};

const out = JSON.stringify(summary, null, 2);
if (outPath) {
  writeFileSync(outPath, `${out}\n`);
  console.error(`summarize-capture: wrote ${outPath} (${routes.length} routes, scrub ${summary._meta.scrub_check})`);
} else {
  process.stdout.write(`${out}\n`);
}

if (scrubViolations > 0) process.exit(1);
