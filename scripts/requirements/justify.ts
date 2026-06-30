import { getArg } from './args.ts';
import { justifyManifestation } from './query-engine.ts';
import { GRAPH_ROOT, loadGraph } from './store.ts';

const root = getArg('--root', GRAPH_ROOT);
const manifestation = getArg('--manifestation');

if (!manifestation) {
  console.error('Usage: npm run req:justify -- --manifestation <manifestation-id>');
  process.exit(1);
}

console.log(JSON.stringify(justifyManifestation(loadGraph(root), manifestation), null, 2));
