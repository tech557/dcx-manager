#!/usr/bin/env node
/**
 * Deterministic route extractor for the DCX Manager contract surface.
 *
 * Parses the `routes: RouteEntry[]` table in `src/services/mock-dispatch.ts`
 * (the contract source of truth — D-BE3-CONTRACT-SOT) and emits a stable JSON
 * array of { method, path, paramNames } — one entry per registered route,
 * in file order.
 *
 * This is the SINGLE authoritative route list for backend-discovery-v3:
 *  - BE3-R1 route-parity gate (`extract-routes.sh | jq length` vs contract.json)
 *  - BE3-R5a `capture-contract-snapshot.sh` reuses it (contract-drift signal)
 *  - BE3-R5b capture-coverage gate reuses it
 *
 * No `grep -c` anywhere in the plan — this parser is the deterministic source.
 * Paths are derived from the regex source, so a re-ordered or added route is
 * reflected automatically.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dispatchPath = resolve(here, '..', '..', 'src', 'services', 'mock-dispatch.ts');

const src = readFileSync(dispatchPath, 'utf8');

// Isolate the routes array block so we never match unrelated `method:` text.
const arrStart = src.indexOf('const routes');
if (arrStart === -1) {
  console.error('extract-routes: could not find `const routes` in mock-dispatch.ts');
  process.exit(2);
}
const block = src.slice(arrStart);

// Each route object opens with: { method: 'X', pattern: /.../, paramNames: [...]
// method / pattern / paramNames are always on the opening line.
const routeRe =
  /\{\s*method:\s*'([^']+)',\s*pattern:\s*(\/.*?\/)\s*,\s*paramNames:\s*\[([^\]]*)\]/g;

/** Convert a JS regex literal source into a REST-style path with :params. */
function regexToPath(regexLiteral, paramNames) {
  // strip leading/trailing slash of the literal, then anchors
  let body = regexLiteral.replace(/^\//, '').replace(/\/$/, '');
  body = body.replace(/^\^/, '').replace(/\$$/, '');
  // unescape `\/` -> `/`
  body = body.replace(/\\\//g, '/');
  // replace each capture group `([^/]+)` with the next :paramName
  let i = 0;
  body = body.replace(/\(\[\^\/\]\+\)/g, () => {
    const name = paramNames[i] ?? `param${i}`;
    i += 1;
    return `:${name}`;
  });
  if (!body.startsWith('/')) body = `/${body}`;
  return body;
}

const routes = [];
let m;
while ((m = routeRe.exec(block)) !== null) {
  const method = m[1];
  const patternLiteral = m[2];
  const paramNames = (m[3].match(/'([^']*)'/g) ?? []).map((s) => s.slice(1, -1));
  routes.push({
    method,
    path: regexToPath(patternLiteral, paramNames),
    paramNames,
    mutation: method !== 'GET',
  });
}

process.stdout.write(`${JSON.stringify(routes, null, 2)}\n`);
