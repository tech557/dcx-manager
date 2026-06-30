import { getArg } from './args.ts';
import { applyProposalAfterSignoff } from './mutation.ts';
import { GRAPH_ROOT } from './store.ts';

const proposal = getArg('--proposal');
const signoff = getArg('--signoff');
const root = getArg('--root', GRAPH_ROOT);

if (!proposal || !signoff) {
  console.error('Usage: npm run req:apply-after-signoff -- --proposal <id> --signoff <ledger-id-or-PO-ref>');
  process.exit(1);
}

try {
  const result = applyProposalAfterSignoff(root, proposal, signoff);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
