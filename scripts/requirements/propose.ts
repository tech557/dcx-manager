import { getArg } from './args.ts';
import { GRAPH_ROOT } from './store.ts';
import { buildProposalFromFile } from './mutation.ts';
import type { ProposalAction } from './mutation.ts';

const action = getArg('--type') as ProposalAction;
const from = getArg('--from');
const actor = getArg('--actor', 'Codex');
const reason = getArg('--reason', 'No reason provided');
const root = getArg('--root', GRAPH_ROOT);

if (!action || !from) {
  console.error('Usage: npm run req:propose -- --type <create-node|create-trace-link|supersede-node> --from <payload.json> [--actor <name>] [--reason <text>]');
  process.exit(1);
}

const proposal = buildProposalFromFile(root, action, from, actor, reason);
console.log(JSON.stringify(proposal, null, 2));
