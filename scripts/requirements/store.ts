import * as fs from 'node:fs';
import * as path from 'node:path';
import type { GraphData, GraphNode, LedgerEntry, TraceLink } from './schema.ts';
import { writeFolderIndex } from './folder-index.ts';

export const GRAPH_ROOT = path.join(process.cwd(), 'docs/product/requirements/graph');

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

// Recursively collect *.json under a dir (so nodes/ may be organized into type subfolders
// for human accessibility — nodes/requirement/, nodes/manifestation/, etc.). Sorted for determinism.
function collectJson(dirPath: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return acc;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) collectJson(full, acc);
    else if (entry.name.endsWith('.json')) acc.push(full);
  }
  return acc;
}

function readJsonFiles<T>(dirPath: string): T[] {
  return collectJson(dirPath).sort().map((p) => readJsonFile<T>(p));
}

function readLedger(filePath: string): LedgerEntry[] {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as LedgerEntry);
}

export function loadGraph(root = GRAPH_ROOT): GraphData {
  return {
    nodes: readJsonFiles<GraphNode>(path.join(root, 'nodes')),
    traceLinks: readJsonFiles<TraceLink>(path.join(root, 'trace-links')),
    ledger: readLedger(path.join(root, 'ledger/decision-ledger.jsonl')),
  };
}

// Node files are organized into type subfolders by ID prefix, for human accessibility.
const NODE_FOLDER: Record<string, string> = {
  INT: 'intent', REQ: 'requirement', BHV: 'behavior', AC: 'acceptance',
  RSP: 'responsibility', EMC: 'expected-category', MAN: 'manifestation',
  EVD: 'evidence', EXM: 'exemption', QST: 'open-question',
};

// Manifestations are numerous (~400), so they sub-fold by kind: nodes/manifestation/<kind>/.
const MANIFESTATION_KINDS = [
  'react-component', 'store-action', 'state-transition', 'db-structure', 'documentation-view',
  'agent-rule', 'ci-hook', 'evidence-artifact', 'function', 'hook', 'type', 'schema', 'endpoint',
  'service', 'selector', 'script', 'config', 'skill', 'validator', 'infra', 'test',
];

function manifestationKind(id: string): string {
  const rest = id.slice('MAN-'.length);
  const hits = MANIFESTATION_KINDS.filter((k) => rest === k || rest.startsWith(`${k}-`));
  hits.sort((a, b) => b.length - a.length); // longest match wins (react-component before any prefix)
  return hits[0] ?? 'other';
}

function nodeFolder(id: string): string {
  if (id.startsWith('MAN-')) return path.join('manifestation', manifestationKind(id));
  return NODE_FOLDER[id.split('-')[0]] ?? 'misc';
}

export function ensureGraphDirs(root = GRAPH_ROOT): void {
  for (const dir of ['trace-links', 'ledger', 'proposals', 'views', 'generated']) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  }
  for (const f of [...Object.values(NODE_FOLDER), 'misc']) {
    fs.mkdirSync(path.join(root, 'nodes', f), { recursive: true });
  }
  for (const k of [...MANIFESTATION_KINDS, 'other']) {
    fs.mkdirSync(path.join(root, 'nodes', 'manifestation', k), { recursive: true });
  }
}

export function writeJsonFile(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function nodePath(root: string, id: string): string {
  return path.join(root, 'nodes', nodeFolder(id), `${id}.json`);
}

export function traceLinkPath(root: string, id: string): string {
  return path.join(root, 'trace-links', `${id}.json`);
}

export function proposalPath(root: string, id: string): string {
  return path.join(root, 'proposals', `${id}.json`);
}

export function appendLedger(root: string, entry: LedgerEntry): void {
  const ledgerPath = path.join(root, 'ledger/decision-ledger.jsonl');
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
  fs.appendFileSync(ledgerPath, `${JSON.stringify(entry)}\n`);
}

export function writeNode(root: string, node: GraphNode): void {
  const p = nodePath(root, node.id);
  writeJsonFile(p, node);
  writeFolderIndex(path.dirname(p)); // mechanically refresh the folder's index.csv + README on every add
}

export function writeTraceLink(root: string, traceLink: TraceLink): void {
  writeJsonFile(traceLinkPath(root, traceLink.id), traceLink);
}
