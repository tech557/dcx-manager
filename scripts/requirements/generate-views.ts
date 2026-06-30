import * as path from 'node:path';
import { getQueueReport } from './queues.ts';
import { GRAPH_ROOT, loadGraph, writeJsonFile } from './store.ts';
import { generateFolderIndexes } from './folder-index.ts';
import { getArg } from './args.ts';

const root = getArg('--root', GRAPH_ROOT);
const graph = loadGraph(root);
const queues = getQueueReport(graph);

const summary = [
  '# Requirements Graph View',
  '',
  `Nodes: ${graph.nodes.length}`,
  `TraceLinks: ${graph.traceLinks.length}`,
  `Ledger entries: ${graph.ledger.length}`,
  '',
  '## Queues',
  '',
  ...Object.entries(queues).map(([name, ids]) => `- ${name}: ${ids.length}`),
  '',
].join('\n');

writeJsonFile(path.join(root, 'generated/query-index.json'), { generated_at: new Date().toISOString(), queues });
writeJsonFile(path.join(root, 'generated/graph-summary.json'), {
  nodes: graph.nodes.length,
  traceLinks: graph.traceLinks.length,
  ledger: graph.ledger.length,
});
await import('node:fs').then((fs) => {
  fs.mkdirSync(path.join(root, 'views'), { recursive: true });
  fs.writeFileSync(path.join(root, 'views/requirements-summary.md'), summary);
});

// Refresh per-folder summaries + CSVs so the node-folder indexes track the canonical graph.
const indexed = generateFolderIndexes(path.join(root, 'nodes'));

console.log(JSON.stringify({ pass: true, views: ['views/requirements-summary.md', 'generated/query-index.json', 'generated/graph-summary.json'], folderIndexNodes: indexed }, null, 2));
