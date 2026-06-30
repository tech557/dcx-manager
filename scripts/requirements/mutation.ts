import * as fs from 'node:fs';
import {
  appendLedger,
  ensureGraphDirs,
  loadGraph,
  nodePath,
  proposalPath,
  traceLinkPath,
  writeJsonFile,
  writeNode,
  writeTraceLink,
} from './store.ts';
import { validateGraphData } from './validators.ts';
import type { GraphNode, LedgerEntry, TraceLink } from './schema.ts';

export type ProposalAction = 'create-node' | 'create-trace-link' | 'supersede-node';

export interface RequirementProposal {
  id: string;
  type: 'Proposal';
  action: ProposalAction;
  actor: string;
  date: string;
  reason: string;
  payload: {
    node?: GraphNode;
    traceLink?: TraceLink;
    suppressed_node?: string;
    replacement_node?: GraphNode;
  };
}

export interface ApplyResult {
  applied: boolean;
  ledgerEntry: LedgerEntry;
  affectedIds: string[];
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createProposalId(action: ProposalAction, seed: string): string {
  return `PRP-${today()}-${action}-${seed}`.replace(/[^A-Za-z0-9-]/g, '-').replace(/-+/g, '-');
}

export function saveProposal(root: string, proposal: RequirementProposal): RequirementProposal {
  ensureGraphDirs(root);
  writeJsonFile(proposalPath(root, proposal.id), proposal);
  return proposal;
}

export function readProposal(root: string, id: string): RequirementProposal {
  const raw = fs.readFileSync(proposalPath(root, id), 'utf8');
  return JSON.parse(raw) as RequirementProposal;
}

export function buildProposalFromFile(root: string, action: ProposalAction, fromPath: string, actor: string, reason: string): RequirementProposal {
  const payload = JSON.parse(fs.readFileSync(fromPath, 'utf8')) as RequirementProposal['payload'];
  const seed = payload.node?.id ?? payload.traceLink?.id ?? payload.replacement_node?.id ?? 'proposal';
  const proposal: RequirementProposal = {
    id: createProposalId(action, seed),
    type: 'Proposal',
    action,
    actor,
    date: today(),
    reason,
    payload,
  };
  return saveProposal(root, proposal);
}

function ledgerFor(proposal: RequirementProposal, signoff: string, affectedIds: string[]): LedgerEntry {
  return {
    id: `LDG-${proposal.id.replace(/^PRP-/, '')}`,
    type: 'DecisionLedgerEntry',
    event_type: proposal.action,
    actor: proposal.actor,
    date: today(),
    source: proposal.id,
    signoff_by: signoff,
    signoff_text: `Approved proposal ${proposal.id}`,
    reason: proposal.reason,
    suppressed_node: proposal.payload.suppressed_node,
    replacement_node: proposal.payload.replacement_node?.id,
    affected_links: affectedIds,
  };
}

function upsertNode(nodes: GraphNode[], node: GraphNode): GraphNode[] {
  const i = nodes.findIndex((n) => n.id === node.id);
  if (i === -1) return [...nodes, node];
  const copy = [...nodes];
  copy[i] = node;
  return copy;
}

export function applyProposalAfterSignoff(root: string, proposalId: string, signoff: string): ApplyResult {
  if (!signoff.trim()) {
    throw new Error('SIGNOFF_REQUIRED: apply-after-signoff requires --signoff <ledger-id-or-PO-ref>.');
  }

  ensureGraphDirs(root);
  const proposal = readProposal(root, proposalId);

  // VALIDATE-BEFORE-WRITE (core.md §36 / F-R2-1): build the prospective graph in memory, validate it,
  // and only touch disk if it is valid. A signed-but-invalid proposal therefore never mutates the store
  // (no partial writes, no rollback needed).
  const current = loadGraph(root);
  let nextNodes = current.nodes;
  let nextLinks = current.traceLinks;
  const nodeWrites: GraphNode[] = [];
  const linkWrites: TraceLink[] = [];
  const affectedIds: string[] = [];

  if (proposal.action === 'create-node') {
    if (!proposal.payload.node) throw new Error('INVALID_PROPOSAL: create-node requires payload.node.');
    nodeWrites.push(proposal.payload.node);
    nextNodes = upsertNode(nextNodes, proposal.payload.node);
    affectedIds.push(proposal.payload.node.id);
  }

  if (proposal.action === 'create-trace-link') {
    if (!proposal.payload.traceLink) throw new Error('INVALID_PROPOSAL: create-trace-link requires payload.traceLink.');
    linkWrites.push(proposal.payload.traceLink);
    nextLinks = [...nextLinks, proposal.payload.traceLink];
    affectedIds.push(proposal.payload.traceLink.id);
  }

  if (proposal.action === 'supersede-node') {
    if (!proposal.payload.suppressed_node || !proposal.payload.replacement_node) {
      throw new Error('INVALID_PROPOSAL: supersede-node requires suppressed_node and replacement_node.');
    }
    const suppressed = current.nodes.find((node) => node.id === proposal.payload.suppressed_node);
    if (!suppressed) throw new Error(`INVALID_PROPOSAL: suppressed node ${proposal.payload.suppressed_node} not found.`);
    const updatedSuppressed: GraphNode = {
      ...suppressed,
      governance: 'superseded',
      delivery: suppressed.delivery === 'verified' ? 'deprecated' : suppressed.delivery,
      superseded_by: proposal.payload.replacement_node.id,
      reason: proposal.reason,
    };
    nodeWrites.push(updatedSuppressed, proposal.payload.replacement_node);
    nextNodes = upsertNode(upsertNode(nextNodes, updatedSuppressed), proposal.payload.replacement_node);
    affectedIds.push(updatedSuppressed.id, proposal.payload.replacement_node.id);
  }

  const validation = validateGraphData({ nodes: nextNodes, traceLinks: nextLinks, ledger: current.ledger });
  if (!validation.pass) {
    // nothing has been written to disk yet
    throw new Error(`VALIDATION_FAILED (no changes written): ${JSON.stringify(validation.errors)}`);
  }

  // commit — graph is known-valid
  for (const n of nodeWrites) writeNode(root, n);
  for (const l of linkWrites) writeTraceLink(root, l);
  const ledgerEntry = ledgerFor(proposal, signoff, affectedIds);
  appendLedger(root, ledgerEntry);
  return { applied: true, ledgerEntry, affectedIds };
}

export function assertUnsignedApplyBlocked(root: string, proposalId: string): boolean {
  try {
    applyProposalAfterSignoff(root, proposalId, '');
    return false;
  } catch (error) {
    return error instanceof Error && error.message.startsWith('SIGNOFF_REQUIRED');
  }
}
