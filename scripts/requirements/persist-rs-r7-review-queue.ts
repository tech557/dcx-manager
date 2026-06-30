import { reconcile } from './reconciliation-engine.ts';
import * as path from 'node:path';
import { GRAPH_ROOT, loadGraph, writeJsonFile, writeNode, writeTraceLink } from './store.ts';
import type { GraphNode, Scope, TraceLink } from './schema.ts';

const today = new Date().toISOString().split('T')[0];

function scopeFromPath(filePath: string): Scope {
  if (filePath.includes('/types/') || filePath.includes('/data/') || filePath.includes('/schema')) return 'data';
  if (filePath.includes('/services/') || filePath.includes('/api/')) return 'backend';
  if (filePath.includes('/rules/') || filePath.includes('/auth/')) return 'security';
  if (filePath.includes('/__tests__/') || filePath.endsWith('.test.ts') || filePath.endsWith('.test.tsx')) return 'test-qa';
  return 'frontend';
}

function statementForManifestation(name: string, paths: string[]): string {
  const pathText = paths.length === 1 ? paths[0] : `${paths.length} paths`;
  return `Code manifestation discovered by RS-R7 inventory: ${name} (${pathText}).`;
}

function traceId(source: string, target: string): string {
  const raw = `TRC-RS-R7-${source}-TO-${target}`;
  return raw.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function batchForPath(filePath: string): string {
  if (filePath.includes('src/builder/islands/')) return 'frontend-islands';
  if (filePath.includes('src/builder/cards/')) return 'card-components';
  if (filePath.includes('src/builder/stage/')) return 'stage-views';
  if (filePath.includes('src/builder/actions/') || filePath.includes('src/actions/')) return 'actions-store';
  if (filePath.includes('src/builder/ui/') || filePath.includes('src/ui/')) return 'ux-ui-components';
  return 'remaining';
}

const before = loadGraph(GRAPH_ROOT);
const beforeNodeIds = new Set(before.nodes.map((node) => node.id));
const beforeTraceIds = new Set(before.traceLinks.map((link) => link.id));

const report = reconcile('inventory');

let nodesCreated = 0;
let nodesUpdated = 0;

for (const manifest of report.inventory) {
  const firstPath = manifest.current_paths[0] ?? '';
  const node: GraphNode = {
    id: manifest.id,
    type: 'Manifestation',
    statement: statementForManifestation(manifest.name, manifest.current_paths),
    scope: scopeFromPath(firstPath),
    governance: 'proposed',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    kind: manifest.kind,
    current_paths: manifest.current_paths,
    lifecycle: manifest.lifecycle,
    provenance: {
      source: 'RS-R7 code manifestation inventory',
      source_path: firstPath,
      source_anchor: manifest.name,
      authoring_actor: 'Codex',
      inference_source: 'reconciliation-engine',
      confidence: 0.8,
      confirmation_status: 'code-discovered',
      last_checked_date: today,
    },
  };

  if (beforeNodeIds.has(node.id)) nodesUpdated += 1;
  else nodesCreated += 1;
  writeNode(GRAPH_ROOT, node);
}

let linksCreated = 0;
let linksUpdated = 0;
let linksSkipped = 0;

for (const candidate of report.candidateLinks) {
  if (!candidate.targetId) {
    linksSkipped += 1;
    continue;
  }
  const id = traceId(candidate.targetId, candidate.manifestationId);
  const traceLink: TraceLink = {
    id,
    type: 'TraceLink',
    source: candidate.targetId,
    target: candidate.manifestationId,
    relationship_type: candidate.relationship_type,
    coverage: 'partial',
    confidence: candidate.confidence,
    evidence_refs: [candidate.evidence],
    inference_source: 'RS-R7 reconciliation-engine',
    confirmation_status: 'code-discovered',
    last_checked_date: today,
    stale_state: 'current',
    needs_confirmation: true,
  };

  if (beforeTraceIds.has(id)) linksUpdated += 1;
  else linksCreated += 1;
  writeTraceLink(GRAPH_ROOT, traceLink);
}

const after = loadGraph(GRAPH_ROOT);
const persistedReviewLinks = after.traceLinks.filter(
  (link) => link.inference_source === 'RS-R7 reconciliation-engine' && link.needs_confirmation,
);
const manifestationsById = new Map(after.nodes.filter((node) => node.type === 'Manifestation').map((node) => [node.id, node]));
const reviewBatches = persistedReviewLinks.reduce<Record<string, { count: number; examples: unknown[] }>>((acc, link) => {
  const manifest = manifestationsById.get(link.target);
  const filePath = manifest?.current_paths?.[0] ?? '';
  const batch = batchForPath(filePath);
  acc[batch] ??= { count: 0, examples: [] };
  acc[batch].count += 1;
  if (acc[batch].examples.length < 20) {
    acc[batch].examples.push({
      link: link.id,
      requirement: link.source,
      manifestation: link.target,
      path: filePath,
      confidence: link.confidence,
    });
  }
  return acc;
}, {});

writeJsonFile(path.join(GRAPH_ROOT, 'generated/rs-r7-review-queue.json'), {
  generated_at: new Date().toISOString(),
  total: persistedReviewLinks.length,
  batches: reviewBatches,
});

const reviewMarkdown = [
  '# RS-R7 Review Queue',
  '',
  `Total persisted RS-R7 candidate links: ${persistedReviewLinks.length}`,
  '',
  '| Batch | Count |',
  '|---|---:|',
  ...Object.entries(reviewBatches)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, batch]) => `| ${name} | ${batch.count} |`),
  '',
  'Examples are stored in `docs/product/requirements/graph/generated/rs-r7-review-queue.json`.',
  '',
].join('\n');
await import('node:fs').then((fs) => {
  fs.mkdirSync(path.join(GRAPH_ROOT, 'views'), { recursive: true });
  fs.writeFileSync(path.join(GRAPH_ROOT, 'views/rs-r7-review-queue.md'), reviewMarkdown);
});

console.log(JSON.stringify({
  pass: true,
  inventory: report.inventory.length,
  candidateLinks: report.candidateLinks.length,
  persistedReviewLinks: persistedReviewLinks.length,
  reviewBatches: Object.fromEntries(Object.entries(reviewBatches).map(([name, batch]) => [name, batch.count])),
  nodesCreated,
  nodesUpdated,
  linksCreated,
  linksUpdated,
  linksSkipped,
  graph: {
    nodes: after.nodes.length,
    traceLinks: after.traceLinks.length,
    ledger: after.ledger.length,
  },
}, null, 2));
