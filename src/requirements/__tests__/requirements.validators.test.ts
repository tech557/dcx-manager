import { describe, expect, it } from 'vitest';
import type { GraphData, GraphNode, TraceLink } from '../../../scripts/requirements/schema.ts';
import { calculateCoverageRollup, validateGraphData } from '../../../scripts/requirements/validators.ts';

const baseProvenance = {
  source: 'test',
  authoring_actor: 'Codex',
  confirmation_status: 'agent-proposed' as const,
};

function requirement(overrides: Partial<GraphNode> = {}): GraphNode {
  return {
    id: 'REQ-TEST-001',
    type: 'Requirement',
    statement: 'Test requirement',
    scope: 'product',
    governance: 'draft',
    maturity: 'intent-captured',
    delivery: 'not-assessed',
    provenance: baseProvenance,
    ...overrides,
  };
}

function graph(nodes: GraphNode[], traceLinks: TraceLink[] = []): GraphData {
  return { nodes, traceLinks, ledger: [] };
}

describe('requirements graph validators', () => {
  it('passes a draft requirement with only intent-level fields', () => {
    const result = validateGraphData(graph([requirement({ statement: 'Draft intent only' })]));

    expect(result.pass).toBe(true);
  });

  it('fails an implementation-ready requirement missing responsibilities and expected categories', () => {
    const result = validateGraphData(
      graph([requirement({ governance: 'locked', maturity: 'implementation-ready', lock_owner: 'PO', lock_date: '2026-06-29' })]),
    );

    expect(result.pass).toBe(false);
    expect(result.errors.map((error) => error.validator)).toContain('progressive-fields');
  });

  it('rejects locked nodes without lock owner and date', () => {
    const result = validateGraphData(graph([requirement({ governance: 'locked' })]));

    expect(result.pass).toBe(false);
    expect(result.errors.map((error) => error.validator)).toContain('lock-enforcement');
  });

  it('catches dangling trace links and invalid confidence', () => {
    const result = validateGraphData(
      graph([requirement()], [
        {
          id: 'TRC-TEST-DANGLING',
          type: 'TraceLink',
          source: 'REQ-TEST-001',
          target: 'MAN-MISSING',
          relationship_type: 'implements',
          coverage: 'complete',
          confidence: 1.5,
        },
      ]),
    );

    expect(result.pass).toBe(false);
    expect(result.errors.map((error) => error.validator)).toEqual(
      expect.arrayContaining(['relationship-integrity', 'confidence-scale']),
    );
  });

  it('calculates complete and partial expected-manifestation coverage', () => {
    expect(
      calculateCoverageRollup(
        ['EMC-A', 'EMC-B'],
        [
          { id: 'TRC-A', type: 'TraceLink', source: 'REQ-TEST-001', target: 'EMC-A', relationship_type: 'implements', coverage: 'complete', confidence: 1 },
          { id: 'TRC-B', type: 'TraceLink', source: 'REQ-TEST-001', target: 'EMC-B', relationship_type: 'implements', coverage: 'complete', confidence: 1 },
        ],
      ),
    ).toBe('complete');

    expect(
      calculateCoverageRollup(
        ['EMC-A', 'EMC-B'],
        [
          { id: 'TRC-A', type: 'TraceLink', source: 'REQ-TEST-001', target: 'EMC-A', relationship_type: 'implements', coverage: 'complete', confidence: 1 },
          { id: 'TRC-B', type: 'TraceLink', source: 'REQ-TEST-001', target: 'EMC-B', relationship_type: 'implements', coverage: 'partial', confidence: 0.6 },
        ],
      ),
    ).toBe('partial');
  });

  it('validates exemptions are typed and reasoned', () => {
    const result = validateGraphData(
      graph([
        {
          id: 'EXM-TEST-001',
          type: 'Exemption',
          statement: 'Generated output',
          scope: 'governance',
          governance: 'approved',
          maturity: 'logic-defined',
          delivery: 'not-assessed',
          provenance: baseProvenance,
          exemption_category: 'generated-code',
          reason: 'Generated view',
          review_status: 'pending-review',
        },
      ]),
    );

    expect(result.pass).toBe(true);
  });
});
