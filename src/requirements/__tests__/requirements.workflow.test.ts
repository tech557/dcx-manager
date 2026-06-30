import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { GraphData, GraphNode, TraceLink } from '../../../scripts/requirements/schema.ts';
import { applyProposalAfterSignoff, assertUnsignedApplyBlocked, saveProposal, type RequirementProposal } from '../../../scripts/requirements/mutation.ts';
import { getQueueReport } from '../../../scripts/requirements/queues.ts';
import { justifyManifestation, queryById, queryByScope, traceFrom } from '../../../scripts/requirements/query-engine.ts';
import { ensureGraphDirs, nodePath, writeNode } from '../../../scripts/requirements/store.ts';

let root = '';

const provenance = {
  source: 'test',
  authoring_actor: 'Codex',
  confirmation_status: 'agent-proposed' as const,
};

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'req-graph-'));
  ensureGraphDirs(root);
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function node(data: GraphNode): GraphNode {
  return { provenance, delivery: 'not-assessed', ...data };
}

describe('requirements governed workflow', () => {
  it('blocks apply without signoff and appends ledger when signed', () => {
    const proposal: RequirementProposal = {
      id: 'PRP-TEST-CREATE',
      type: 'Proposal',
      action: 'create-node',
      actor: 'Codex',
      date: '2026-06-29',
      reason: 'Create a requirement',
      payload: {
        node: node({
          id: 'REQ-WF-001',
          type: 'Requirement',
          statement: 'Workflow requirement',
          scope: 'product',
          governance: 'draft',
          maturity: 'intent-captured',
        }),
      },
    };
    saveProposal(root, proposal);

    expect(assertUnsignedApplyBlocked(root, proposal.id)).toBe(true);
    const result = applyProposalAfterSignoff(root, proposal.id, 'PO-SIGNOFF');

    expect(result.applied).toBe(true);
    expect(fs.existsSync(nodePath(root, 'REQ-WF-001'))).toBe(true);
    const ledger = fs.readFileSync(path.join(root, 'ledger/decision-ledger.jsonl'), 'utf8').trim().split('\n');
    expect(ledger).toHaveLength(1);
    expect(JSON.parse(ledger[0]).event_type).toBe('create-node');
  });

  it('records supersession with suppressed node and reason', () => {
    writeNode(
      root,
      node({
        id: 'REQ-WF-OLD',
        type: 'Requirement',
        statement: 'Old requirement',
        scope: 'product',
        governance: 'locked',
        maturity: 'behavior-defined',
        delivery: 'implemented',
        lock_owner: 'PO',
        lock_date: '2026-06-29',
        acceptance_outcomes: ['AC-WF-OLD'],
      }),
    );
    writeNode(root, node({ id: 'AC-WF-OLD', type: 'AcceptanceOutcome', statement: 'Old accepted' }));
    const proposal: RequirementProposal = {
      id: 'PRP-TEST-SUPERSEDE',
      type: 'Proposal',
      action: 'supersede-node',
      actor: 'Codex',
      date: '2026-06-29',
      reason: 'PO replaced old requirement',
      payload: {
        suppressed_node: 'REQ-WF-OLD',
        replacement_node: node({
          id: 'REQ-WF-NEW',
          type: 'Requirement',
          statement: 'New requirement',
          scope: 'product',
          governance: 'locked',
          maturity: 'behavior-defined',
          delivery: 'not-started',
          lock_owner: 'PO',
          lock_date: '2026-06-29',
          acceptance_outcomes: ['AC-WF-OLD'],
        }),
      },
    };
    saveProposal(root, proposal);

    applyProposalAfterSignoff(root, proposal.id, 'PO-SIGNOFF');

    const suppressed = JSON.parse(fs.readFileSync(nodePath(root, 'REQ-WF-OLD'), 'utf8')) as GraphNode;
    expect(suppressed.governance).toBe('superseded');
    expect(suppressed.superseded_by).toBe('REQ-WF-NEW');
    expect(suppressed.reason).toBe('PO replaced old requirement');
  });

  it('validate-before-write: a signed but invalid proposal does not mutate the store', () => {
    const proposal: RequirementProposal = {
      id: 'PRP-TEST-INVALID',
      type: 'Proposal',
      action: 'create-trace-link',
      actor: 'Codex',
      date: '2026-06-29',
      reason: 'Dangling link must be rejected before any write',
      payload: {
        traceLink: {
          id: 'TRC-DANGLING-X', type: 'TraceLink',
          source: 'REQ-DOES-NOT-EXIST', target: 'MAN-ALSO-MISSING',
          relationship_type: 'implements', coverage: 'complete', confidence: 0.9,
        },
      },
    };
    saveProposal(root, proposal);

    expect(() => applyProposalAfterSignoff(root, proposal.id, 'PO-SIGNOFF')).toThrow(/VALIDATION_FAILED/);
    // nothing was written — the store is untouched
    expect(fs.existsSync(path.join(root, 'trace-links/TRC-DANGLING-X.json'))).toBe(false);
  });
});

describe('requirements queues and slices', () => {
  function fixtureGraph(): GraphData {
    const nodes: GraphNode[] = [
      node({ id: 'INT-FEATURE', type: 'Intent', statement: 'Feature intent' }),
      node({
        id: 'REQ-FEATURE',
        type: 'Requirement',
        statement: 'Feature requirement',
        scope: 'product',
        governance: 'locked',
        maturity: 'decomposed',
        delivery: 'implemented',
        lock_owner: 'PO',
        lock_date: '2026-06-29',
        responsibilities: ['RSP-FEATURE'],
        expected_manifestation_categories: ['EMC-FEATURE-UI', 'EMC-FEATURE-TEST'],
        acceptance_outcomes: ['AC-FEATURE'],
      }),
      node({ id: 'AC-FEATURE', type: 'AcceptanceOutcome', statement: 'Feature accepted' }),
      node({
        id: 'RSP-FEATURE',
        type: 'SystemResponsibility',
        statement: 'Render feature',
        responsibility_type: 'ui-presentation',
      }),
      node({ id: 'EMC-FEATURE-UI', type: 'ExpectedManifestationCategory', statement: 'UI category', category: 'component' }),
      node({ id: 'EMC-FEATURE-TEST', type: 'ExpectedManifestationCategory', statement: 'Test category', category: 'unit-test' }),
      node({ id: 'MAN-FEATURE-UI', type: 'Manifestation', statement: 'UI manifestation', kind: 'react-component' }),
      node({ id: 'MAN-ORPHAN', type: 'Manifestation', statement: 'Orphan manifestation', kind: 'script' }),
      node({ id: 'MAN-TEST', type: 'Manifestation', statement: 'Disconnected test', kind: 'test' }),
      node({
        id: 'EXM-FEATURE-GEN',
        type: 'Exemption',
        statement: 'Generated view',
        scope: 'governance',
        governance: 'approved',
        maturity: 'logic-defined',
        exemption_category: 'generated-code',
        reason: 'Generated',
        review_status: 'pending-review',
      }),
    ];
    const traceLinks: TraceLink[] = [
      { id: 'TRC-INT-REQ', type: 'TraceLink', source: 'INT-FEATURE', target: 'REQ-FEATURE', relationship_type: 'derives-from', coverage: 'complete', confidence: 1 },
      { id: 'TRC-REQ-RSP', type: 'TraceLink', source: 'REQ-FEATURE', target: 'RSP-FEATURE', relationship_type: 'decomposes-into', coverage: 'complete', confidence: 1 },
      { id: 'TRC-RSP-EMC-UI', type: 'TraceLink', source: 'RSP-FEATURE', target: 'EMC-FEATURE-UI', relationship_type: 'decomposes-into', coverage: 'complete', confidence: 1 },
      { id: 'TRC-RSP-EMC-TEST', type: 'TraceLink', source: 'RSP-FEATURE', target: 'EMC-FEATURE-TEST', relationship_type: 'decomposes-into', coverage: 'partial', confidence: 0.6, needs_confirmation: true },
      { id: 'TRC-EMC-MAN', type: 'TraceLink', source: 'EMC-FEATURE-UI', target: 'MAN-FEATURE-UI', relationship_type: 'implements', coverage: 'complete', confidence: 1 },
    ];
    return { nodes, traceLinks, ledger: [] };
  }

  it('returns queue results for fixture and empty graph behavior', () => {
    const emptyQueues = getQueueReport({ nodes: [], traceLinks: [], ledger: [] });
    expect(emptyQueues.needsClassification).toEqual([]);

    const queues = getQueueReport(fixtureGraph());
    expect(queues.missingManifestations).toContain('REQ-FEATURE:EMC-FEATURE-TEST');
    expect(queues.candidateLinksAwaitingConfirmation).toContain('TRC-RSP-EMC-TEST');
    expect(queues.manifestationsLackingRequirements).toEqual(expect.arrayContaining(['MAN-ORPHAN', 'MAN-TEST']));
    expect(queues.exemptionsAwaitingReview).toContain('EXM-FEATURE-GEN');
  });

  it('returns low-token query, trace, and justify slices', () => {
    const data = fixtureGraph();

    expect(queryById(data, 'REQ-FEATURE').nodes.map((item) => item.id)).toContain('RSP-FEATURE');
    expect(queryByScope(data, 'product').nodes.map((item) => item.id)).toContain('REQ-FEATURE');
    expect(traceFrom(data, 'INT-FEATURE').nodes.map((item) => item.id)).toEqual(
      expect.arrayContaining(['INT-FEATURE', 'REQ-FEATURE', 'RSP-FEATURE', 'MAN-FEATURE-UI']),
    );
    expect(justifyManifestation(data, 'MAN-FEATURE-UI').nodes.map((item) => item.id)).toEqual(
      expect.arrayContaining(['INT-FEATURE', 'REQ-FEATURE', 'MAN-FEATURE-UI']),
    );
  });
});
