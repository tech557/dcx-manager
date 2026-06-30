import type { GraphData, GraphNode, TraceLink } from './schema.ts';
import { getQueueReport } from './queues.ts';

export interface QueryResult {
  nodes: GraphNode[];
  traceLinks: TraceLink[];
  queues?: ReturnType<typeof getQueueReport>;
}

function uniqueNodes(nodes: GraphNode[]): GraphNode[] {
  return [...new Map(nodes.map((node) => [node.id, node])).values()];
}

function connectedLinks(data: GraphData, ids: Set<string>): TraceLink[] {
  return data.traceLinks.filter((link) => ids.has(link.source) || ids.has(link.target));
}

export function queryById(data: GraphData, id: string): QueryResult {
  const root = data.nodes.find((node) => node.id === id);
  if (!root) return { nodes: [], traceLinks: [] };
  const links = connectedLinks(data, new Set([id]));
  const linkedIds = new Set(links.flatMap((link) => [link.source, link.target]));
  return {
    nodes: uniqueNodes(data.nodes.filter((node) => linkedIds.has(node.id) || node.id === id)),
    traceLinks: links,
  };
}

export function queryByScope(data: GraphData, scope: string): QueryResult {
  const nodes = data.nodes.filter((node) => node.scope === scope);
  const ids = new Set(nodes.map((node) => node.id));
  return { nodes, traceLinks: connectedLinks(data, ids), queues: getQueueReport(data) };
}

export function queryByLayer(data: GraphData, layer: string): QueryResult {
  const typeByLayer: Record<string, string[]> = {
    intent: ['Intent'],
    requirement: ['Requirement'],
    behavior: ['BehaviorRule', 'AcceptanceOutcome'],
    responsibility: ['SystemResponsibility'],
    expected: ['ExpectedManifestationCategory'],
    manifestation: ['Manifestation'],
    evidence: ['Evidence'],
  };
  const allowedTypes = typeByLayer[layer] ?? [layer];
  const nodes = data.nodes.filter((node) => allowedTypes.includes(node.type));
  const ids = new Set(nodes.map((node) => node.id));
  return { nodes, traceLinks: connectedLinks(data, ids) };
}

export function queryByFeature(data: GraphData, feature: string): QueryResult {
  const needle = feature.toLowerCase();
  const nodes = data.nodes.filter((node) =>
    [node.id, node.statement, ...(node.aliases ?? [])].some((value) => value?.toLowerCase().includes(needle)),
  );
  const ids = new Set(nodes.map((node) => node.id));
  return { nodes, traceLinks: connectedLinks(data, ids), queues: getQueueReport(data) };
}

export function traceFrom(data: GraphData, id: string): QueryResult {
  const visited = new Set<string>([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const link of data.traceLinks) {
      if (visited.has(link.source) && !visited.has(link.target)) {
        visited.add(link.target);
        changed = true;
      }
    }
  }
  return {
    nodes: data.nodes.filter((node) => visited.has(node.id)),
    traceLinks: data.traceLinks.filter((link) => visited.has(link.source) && visited.has(link.target)),
    queues: getQueueReport(data),
  };
}

export function justifyManifestation(data: GraphData, id: string): QueryResult {
  const visited = new Set<string>([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const link of data.traceLinks) {
      if (visited.has(link.target) && !visited.has(link.source)) {
        visited.add(link.source);
        changed = true;
      }
    }
  }
  return {
    nodes: data.nodes.filter((node) => visited.has(node.id)),
    traceLinks: data.traceLinks.filter((link) => visited.has(link.source) && visited.has(link.target)),
    queues: getQueueReport(data),
  };
}
