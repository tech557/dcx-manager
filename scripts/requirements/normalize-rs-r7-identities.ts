import * as fs from 'node:fs';
import * as path from 'node:path';
import { GRAPH_ROOT, appendLedger, loadGraph, writeJsonFile, writeNode, writeTraceLink } from './store.ts';
import type { GraphNode, LedgerEntry, ManifestationKind, TraceLink } from './schema.ts';

const today = new Date().toISOString().split('T')[0];
const ledgerId = `LDG-${today}-RS-R7-IDENTITY-NORMALIZATION`;

function sanitize(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function symbolFor(node: GraphNode): string {
  return String(node.provenance?.source_anchor ?? node.name ?? path.basename(node.current_paths?.[0] ?? node.id, path.extname(node.current_paths?.[0] ?? '')));
}

function identityKey(node: GraphNode): string {
  return `${node.current_paths?.[0] ?? ''}|${symbolFor(node)}|${node.kind ?? ''}`;
}

function pathDerivedId(node: GraphNode): string {
  const sourcePath = node.current_paths?.[0] ?? '';
  const noExt = sourcePath.replace(/\.(ts|tsx)$/, '');
  return `MAN-${node.kind}-${sanitize(noExt)}-${sanitize(symbolFor(node))}`;
}

function chooseCanonical(nodes: GraphNode[]): GraphNode {
  const expected = new Set(nodes.map(pathDerivedId));
  return nodes.find((node) => expected.has(node.id)) ?? [...nodes].sort((a, b) => b.id.length - a.id.length || a.id.localeCompare(b.id))[0];
}

function traceId(source: string, target: string): string {
  return `TRC-RS-R7-${source}-TO-${target}`.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function isCandidate(link: TraceLink): boolean {
  return Boolean(link.needs_confirmation) || link.confirmation_status === 'code-discovered' || link.confirmation_status === 'skill-derived';
}

function mergeEvidence(a: string[] = [], b: string[] = []): string[] {
  return [...new Set([...a, ...b])];
}

function relationKey(link: TraceLink): string {
  return [link.source, link.target, link.relationship_type].join('|');
}

function batchForPath(filePath: string): string {
  if (filePath.includes('src/builder/islands/')) return 'frontend-islands';
  if (filePath.includes('src/builder/cards/')) return 'card-components';
  if (filePath.includes('src/builder/stage/')) return 'stage-views';
  if (filePath.includes('src/builder/actions/') || filePath.includes('src/actions/')) return 'actions-store';
  if (filePath.includes('src/builder/ui/') || filePath.includes('src/ui/')) return 'ux-ui-components';
  return 'remaining';
}

function groupManifestations(nodes: GraphNode[]): Map<string, GraphNode[]> {
  const groups = new Map<string, GraphNode[]>();
  for (const node of nodes.filter((n) => n.type === 'Manifestation' && n.current_paths?.[0])) {
    const key = identityKey(node);
    groups.set(key, [...(groups.get(key) ?? []), node]);
  }
  return groups;
}

const graph = loadGraph(GRAPH_ROOT);
const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
const duplicateGroups = [...groupManifestations(graph.nodes).values()].filter((group) => group.length > 1);
const canonicalByOld = new Map<string, string>();
const aliasesByCanonical = new Map<string, string[]>();

for (const group of duplicateGroups) {
  const canonical = chooseCanonical(group);
  const oldIds = group.map((node) => node.id).filter((id) => id !== canonical.id);
  aliasesByCanonical.set(canonical.id, [...(aliasesByCanonical.get(canonical.id) ?? []), ...oldIds]);
  for (const oldId of oldIds) canonicalByOld.set(oldId, canonical.id);
}

for (const [canonicalId, oldIds] of aliasesByCanonical) {
  const canonical = nodesById.get(canonicalId);
  if (!canonical) continue;
  writeNode(GRAPH_ROOT, {
    ...canonical,
    aliases: [...new Set([...(canonical.aliases ?? []), ...oldIds])],
    identity_normalization: {
      date: today,
      ledger_ref: ledgerId,
      canonical: true,
      superseded_aliases: oldIds,
    },
  });
}

for (const [oldId, canonicalId] of canonicalByOld) {
  const oldNode = nodesById.get(oldId);
  if (!oldNode) continue;
  writeNode(GRAPH_ROOT, {
    ...oldNode,
    governance: 'superseded',
    delivery: 'deprecated',
    lifecycle: 'replaced',
    superseded_by: canonicalId,
    aliases: [...new Set([...(oldNode.aliases ?? []), oldId])],
    reason: `RS-R7 identity normalization: duplicate manifestation identity for ${canonicalId}.`,
    identity_normalization: {
      date: today,
      ledger_ref: ledgerId,
      canonical: false,
      canonical_manifestation: canonicalId,
    },
  });
}

const activeByRelation = new Map<string, TraceLink>();
let redirectedLinks = 0;
let mergedDuplicateLinks = 0;
let historyLinks = 0;

for (const original of graph.traceLinks) {
  if (original.normalization_ledger_ref === ledgerId && original.relationship_type === 'supersedes') {
    writeTraceLink(GRAPH_ROOT, {
      ...original,
      coverage: original.coverage === 'stale' ? 'partial' : original.coverage,
      confirmation_status: 'confirmed',
      stale_state: 'current',
      needs_confirmation: false,
    });
    continue;
  }

  const canonicalSource = canonicalByOld.get(original.source) ?? original.source;
  const canonicalTarget = canonicalByOld.get(original.target) ?? original.target;
  const changed = canonicalSource !== original.source || canonicalTarget !== original.target;

  if (!changed || !isCandidate(original)) {
    activeByRelation.set(relationKey(original), original);
    continue;
  }

  redirectedLinks += 1;
  const canonicalId = traceId(canonicalSource, canonicalTarget);
  const redirected: TraceLink = {
    ...original,
    id: canonicalId,
    source: canonicalSource,
    target: canonicalTarget,
    evidence_refs: [
      ...(original.evidence_refs ?? []),
      `RS-R7 identity normalization redirected ${original.id} to canonical manifestation identity.`,
    ],
  };
  const existing = activeByRelation.get(relationKey(redirected));
  if (existing) {
    mergedDuplicateLinks += 1;
    activeByRelation.set(relationKey(redirected), {
      ...existing,
      confidence: Math.max(existing.confidence, redirected.confidence),
      evidence_refs: mergeEvidence(existing.evidence_refs, redirected.evidence_refs),
      merged_from: [...new Set([...(existing.merged_from as string[] | undefined ?? []), original.id])],
      normalization_ledger_ref: ledgerId,
    });
  } else {
    activeByRelation.set(relationKey(redirected), {
      ...redirected,
      merged_from: [original.id],
      normalization_ledger_ref: ledgerId,
    });
  }

  writeTraceLink(GRAPH_ROOT, {
    ...original,
    source: original.source,
    target: canonicalTarget,
    relationship_type: 'supersedes',
    coverage: 'partial',
    confirmation_status: 'confirmed',
    stale_state: 'current',
    needs_confirmation: false,
    evidence_refs: [
      ...(original.evidence_refs ?? []),
      `Historical RS-R7 candidate superseded by canonical link ${canonicalId}.`,
    ],
    original_source: original.source,
    original_target: original.target,
    replacement_trace_link: canonicalId,
    normalization_ledger_ref: ledgerId,
  });
  historyLinks += 1;
}

for (const link of activeByRelation.values()) {
  if (link.inference_source === 'RS-R7 reconciliation-engine' && link.needs_confirmation && link.stale_state !== 'invalidated') {
    writeTraceLink(GRAPH_ROOT, link);
  }
}

const normalized = loadGraph(GRAPH_ROOT);
const normalizedNodes = new Map(normalized.nodes.map((node) => [node.id, node]));
const canonicalManifestations = normalized.nodes.filter(
  (node) => node.type === 'Manifestation' && node.governance !== 'superseded',
);
const activeReviewLinks = normalized.traceLinks.filter(
  (link) => link.inference_source === 'RS-R7 reconciliation-engine' && link.needs_confirmation && link.stale_state !== 'invalidated',
);
const preservedHistoryLinks = normalized.traceLinks.filter(
  (link) => link.normalization_ledger_ref === ledgerId && link.relationship_type === 'supersedes',
);
const mergedFromCount = activeReviewLinks.reduce((count, link) => count + ((link.merged_from as string[] | undefined)?.length ?? 0), 0);
const relationCounts = new Map<string, number>();
for (const link of activeReviewLinks) relationCounts.set(relationKey(link), (relationCounts.get(relationKey(link)) ?? 0) + 1);
const duplicateActiveRelationships = [...relationCounts.entries()].filter(([, count]) => count > 1);
const linkedManifestations = new Set(activeReviewLinks.map((link) => link.target).filter((id) => normalizedNodes.get(id)?.type === 'Manifestation'));
const unlinkedManifestations = canonicalManifestations.filter((node) => !linkedManifestations.has(node.id));

const byCanonical = new Map<string, TraceLink[]>();
for (const link of activeReviewLinks) {
  if (normalizedNodes.get(link.target)?.type !== 'Manifestation') continue;
  byCanonical.set(link.target, [...(byCanonical.get(link.target) ?? []), link]);
}

const canonicalReview = [...byCanonical.entries()].map(([manifestationId, links]) => {
  const node = normalizedNodes.get(manifestationId);
  const filePath = node?.current_paths?.[0] ?? '';
  return {
    canonical_manifestation: manifestationId,
    source_path: filePath,
    exported_symbol: node ? symbolFor(node) : '',
    kind: node?.kind as ManifestationKind | undefined,
    aliases: node?.aliases ?? [],
    suggested_links: links.map((link) => ({
      link: link.id,
      requirement_or_responsibility: link.source,
      statement: normalizedNodes.get(link.source)?.statement ?? '',
      relationship_type: link.relationship_type,
      confidence: link.confidence,
      evidence_refs: link.evidence_refs ?? [],
      recommended_decision: 'PO review: confirm, partially confirm, redirect, reject, or exempt.',
    })),
  };
}).sort((a, b) => a.source_path.localeCompare(b.source_path) || a.canonical_manifestation.localeCompare(b.canonical_manifestation));

const reviewBatches = canonicalReview.reduce<Record<string, { count: number; manifestations: typeof canonicalReview }>>((acc, item) => {
  const batch = batchForPath(item.source_path);
  acc[batch] ??= { count: 0, manifestations: [] };
  acc[batch].count += item.suggested_links.length;
  acc[batch].manifestations.push(item);
  return acc;
}, {});

const summary = {
  generated_at: new Date().toISOString(),
  ledger_ref: ledgerId,
  duplicate_identity_groups: duplicateGroups.length,
  superseded_manifestation_ids: canonicalByOld.size,
  redirected_candidate_links: Math.max(redirectedLinks, preservedHistoryLinks.length),
  merged_duplicate_candidate_links: Math.max(mergedDuplicateLinks, mergedFromCount),
  history_trace_links_preserved: Math.max(historyLinks, preservedHistoryLinks.length),
  active_canonical_manifestations: canonicalManifestations.length,
  active_rs_r7_candidate_links: activeReviewLinks.length,
  canonical_manifestations_in_review: canonicalReview.length,
  unlinked_canonical_manifestations: unlinkedManifestations.length,
  duplicate_active_requirement_manifestation_relationships: duplicateActiveRelationships.length,
  batches: Object.fromEntries(Object.entries(reviewBatches).map(([name, batch]) => [name, {
    candidate_links: batch.count,
    canonical_manifestations: batch.manifestations.length,
  }])),
};

writeJsonFile(path.join(GRAPH_ROOT, 'generated/rs-r7-review-queue.json'), {
  ...summary,
  review_model: 'canonical-manifestation',
  batches: reviewBatches,
});
writeJsonFile(path.join(GRAPH_ROOT, 'generated/rs-r7-identity-normalization.json'), {
  ...summary,
  canonical_aliases: Object.fromEntries(aliasesByCanonical),
  duplicate_active_relationships: duplicateActiveRelationships,
  unlinked_manifestations: unlinkedManifestations.map((node) => node.id),
});

const markdown = [
  '# RS-R7 Canonical Review Queue',
  '',
  `Generated: ${summary.generated_at}`,
  '',
  '| Metric | Count |',
  '|---|---:|',
  `| Duplicate identity groups normalized | ${summary.duplicate_identity_groups} |`,
  `| Superseded MAN aliases preserved | ${summary.superseded_manifestation_ids} |`,
  `| Active canonical manifestations | ${summary.active_canonical_manifestations} |`,
  `| Active RS-R7 candidate links | ${summary.active_rs_r7_candidate_links} |`,
  `| Canonical manifestations in PO review | ${summary.canonical_manifestations_in_review} |`,
  `| Unlinked canonical manifestations | ${summary.unlinked_canonical_manifestations} |`,
  `| Duplicate active requirement-manifestation relationships | ${summary.duplicate_active_requirement_manifestation_relationships} |`,
  '',
  '| Batch | Candidate links | Canonical manifestations |',
  '|---|---:|---:|',
  ...Object.entries(summary.batches).sort(([a], [b]) => a.localeCompare(b)).map(([name, batch]) =>
    `| ${name} | ${batch.candidate_links} | ${batch.canonical_manifestations} |`,
  ),
  '',
  'PO review data is grouped by canonical manifestation in `docs/product/requirements/graph/generated/rs-r7-review-queue.json`.',
  '',
].join('\n');
fs.mkdirSync(path.join(GRAPH_ROOT, 'views'), { recursive: true });
fs.writeFileSync(path.join(GRAPH_ROOT, 'views/rs-r7-review-queue.md'), markdown);

const existingLedgerIds = new Set(normalized.ledger.map((entry) => entry.id));
if (!existingLedgerIds.has(ledgerId)) {
  const entry: LedgerEntry = {
    id: ledgerId,
    type: 'DecisionLedgerEntry',
    event_type: 'identity-normalization',
    actor: 'Codex',
    date: new Date().toISOString(),
    source: 'RS-R7 identity-normalization pass',
    recorded_by: 'Codex',
    reason: 'Normalize duplicate RS-R7 manifestation identities before PO mapping confirmation.',
    affected_links: [...new Set([...activeReviewLinks.map((link) => link.id)])],
  };
  appendLedger(GRAPH_ROOT, entry);
}

console.log(JSON.stringify({ pass: duplicateActiveRelationships.length === 0, ...summary }, null, 2));
