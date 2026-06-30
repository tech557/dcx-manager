import { loadGraph } from './store.ts';
import { validateGraphData } from './validators.ts';

const root = process.argv[2];
const result = validateGraphData(loadGraph(root));

console.log(JSON.stringify(result, null, 2));

if (!result.pass) {
  process.exit(1);
}
