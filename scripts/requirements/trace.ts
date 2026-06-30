import { getArg } from './args.ts';
import { traceFrom } from './query-engine.ts';
import { GRAPH_ROOT, loadGraph } from './store.ts';

const root = getArg('--root', GRAPH_ROOT);
const from = getArg('--from');

if (!from) {
  console.error('Usage: npm run req:trace -- --from <intent-or-requirement-id>');
  process.exit(1);
}

console.log(JSON.stringify(traceFrom(loadGraph(root), from), null, 2));
