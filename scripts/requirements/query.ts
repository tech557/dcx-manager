import { getArg } from './args.ts';
import { queryByFeature, queryById, queryByLayer, queryByScope } from './query-engine.ts';
import { GRAPH_ROOT, loadGraph } from './store.ts';

const root = getArg('--root', GRAPH_ROOT);
const graph = loadGraph(root);
const byId = getArg('--by-id');
const scope = getArg('--scope');
const feature = getArg('--feature');
const layer = getArg('--layer');

const result = byId
  ? queryById(graph, byId)
  : scope
    ? queryByScope(graph, scope)
    : feature
      ? queryByFeature(graph, feature)
      : layer
        ? queryByLayer(graph, layer)
        : undefined;

if (!result) {
  console.error('Usage: npm run req:query -- --by-id <id> | --scope <scope> | --feature <text> | --layer <layer>');
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
