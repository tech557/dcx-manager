import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';
import type { GraphData, GraphNode, TraceLink } from '../../../scripts/requirements/schema.ts';
import {
  getEvidenceForAcceptanceOutcome,
  hasVerifiedEvidenceForAcceptanceOutcome,
  isImplemented,
  isVerified,
  computeVerificationState,
  getVerificationReport,
  bindEvidence,
  checkStalenessForManifestation,
  markVerificationStaleByManifestation,
} from '../../../scripts/requirements/verification.ts';

const TEST_GRAPH_DIR = path.join(process.cwd(), 'scripts/requirements/__tests__/r8-test-graph');

function setupTestGraphDir(): void {
  fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'nodes'), { recursive: true });
  fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'trace-links'), { recursive: true });
  fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'ledger'), { recursive: true });
  fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'proposals'), { recursive: true });
  fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'views'), { recursive: true });
  fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'generated'), { recursive: true });
  for (const sub of ['intent', 'requirement', 'behavior', 'acceptance', 'responsibility', 'expected-category', 'evidence', 'exemption', 'open-question', 'misc']) {
    fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'nodes', sub), { recursive: true });
  }
  for (const sub of ['react-component', 'function', 'hook', 'type', 'service', 'store-action', 'test', 'other']) {
    fs.mkdirSync(path.join(TEST_GRAPH_DIR, 'nodes', 'manifestation', sub), { recursive: true });
  }
}

function cleanupTestGraphDir(): void {
  if (fs.existsSync(TEST_GRAPH_DIR)) {
    fs.rmSync(TEST_GRAPH_DIR, { recursive: true, force: true });
  }
}

function makeNode(id: string, type: GraphNode['type'], overrides?: Partial<Omit<GraphNode, 'id' | 'type'>>): GraphNode {
  return {
    id,
    type,
    governance: 'proposed',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    ...overrides,
  };
}

function makeTraceLink(overrides: Partial<TraceLink> & { id: string }): TraceLink {
  return {
    type: 'TraceLink',
    source: '',
    target: '',
    relationship_type: 'implements',
    coverage: 'complete',
    confidence: 1.0,
    stale_state: 'current',
    needs_confirmation: false,
    ...overrides,
  };
}

function createTestGraph(): GraphData {
  return {
    nodes: [
      makeNode('REQ-TEST-001', 'Requirement', {
        statement: 'Test requirement with acceptance outcomes',
        acceptance_outcomes: ['AC-TEST-001', 'AC-TEST-002'],
        expected_manifestation_categories: ['component', 'validator'],
      }),
      makeNode('AC-TEST-001', 'AcceptanceOutcome', {
        statement: 'First acceptance outcome',
      }),
      makeNode('AC-TEST-002', 'AcceptanceOutcome', {
        statement: 'Second acceptance outcome',
      }),
      makeNode('EVD-TEST-001', 'Evidence', {
        acceptance_outcome: 'AC-TEST-001',
        statement: 'Evidence for outcome 1',
        delivery: 'verified',
        validity: 'current',
      }),
      makeNode('MAN-TEST-001', 'Manifestation', {
        kind: 'function',
        current_paths: ['src/test.ts'],
      }),
    ],
    traceLinks: [
      makeTraceLink({
        id: 'TRC-TEST-001',
        source: 'MAN-TEST-001',
        target: 'REQ-TEST-001',
        relationship_type: 'implements',
        coverage: 'complete',
      }),
      makeTraceLink({
        id: 'TRC-TEST-002',
        source: 'MAN-TEST-001',
        target: 'AC-TEST-001',
        relationship_type: 'verifies',
        coverage: 'complete',
      }),
    ],
    ledger: [],
  };
}

describe('getEvidenceForAcceptanceOutcome', () => {
  it('returns evidence for a specific acceptance outcome', () => {
    const graph = createTestGraph();
    const result = getEvidenceForAcceptanceOutcome('AC-TEST-001', graph);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('EVD-TEST-001');
  });

  it('returns empty array when no evidence exists', () => {
    const graph = createTestGraph();
    const result = getEvidenceForAcceptanceOutcome('NONEXISTENT', graph);
    expect(result).toHaveLength(0);
  });
});

describe('hasVerifiedEvidenceForAcceptanceOutcome', () => {
  it('returns true when verified evidence exists', () => {
    const graph = createTestGraph();
    expect(hasVerifiedEvidenceForAcceptanceOutcome('AC-TEST-001', graph)).toBe(true);
  });

  it('returns false when no verified evidence', () => {
    const graph = createTestGraph();
    expect(hasVerifiedEvidenceForAcceptanceOutcome('AC-TEST-002', graph)).toBe(false);
  });
});

describe('isImplemented', () => {
  it('returns false when no expected categories', () => {
    const graph = createTestGraph();
    const req = graph.nodes.find((n) => n.id === 'REQ-TEST-001')!;
    req.expected_manifestation_categories = [];
    expect(isImplemented('REQ-TEST-001', graph)).toBe(false);
  });

  it('returns true when all categories covered by implements links from requirement', () => {
    const graph = createTestGraph();
    graph.traceLinks.push(makeTraceLink({
      id: 'TRC-COV-COMP',
      source: 'REQ-TEST-001',
      target: 'component',
      relationship_type: 'implements',
      coverage: 'complete',
    }));
    graph.traceLinks.push(makeTraceLink({
      id: 'TRC-COV-VAL',
      source: 'REQ-TEST-001',
      target: 'validator',
      relationship_type: 'implements',
      coverage: 'complete',
    }));
    expect(isImplemented('REQ-TEST-001', graph)).toBe(true);
  });

  it('returns false when some categories lack coverage', () => {
    const graph = createTestGraph();
    graph.traceLinks.push(makeTraceLink({
      id: 'TRC-COV-COMP',
      source: 'REQ-TEST-001',
      target: 'component',
      relationship_type: 'implements',
      coverage: 'complete',
    }));
    expect(isImplemented('REQ-TEST-001', graph)).toBe(false);
  });
});

describe('isVerified', () => {
  it('returns true when all acceptance outcomes have verified evidence', () => {
    const graph = createTestGraph();
    graph.nodes.push(makeNode('EVD-TEST-002', 'Evidence', {
      acceptance_outcome: 'AC-TEST-002',
      statement: 'Evidence for outcome 2',
      delivery: 'verified',
      validity: 'current',
    }));
    expect(isVerified('REQ-TEST-001', graph)).toBe(true);
  });

  it('returns false when some outcomes lack verified evidence', () => {
    const graph = createTestGraph();
    expect(isVerified('REQ-TEST-001', graph)).toBe(false);
  });

  it('returns false when requirement has no acceptance outcomes', () => {
    const graph = createTestGraph();
    const req = graph.nodes.find((n) => n.id === 'REQ-TEST-001')!;
    req.acceptance_outcomes = [];
    expect(isVerified('REQ-TEST-001', graph)).toBe(false);
  });
});

describe('computeVerificationState', () => {
  it('returns verified state when all outcomes are verified', () => {
    const graph = createTestGraph();
    graph.nodes.push(makeNode('EVD-TEST-002', 'Evidence', {
      acceptance_outcome: 'AC-TEST-002',
      statement: 'Evidence for outcome 2',
      delivery: 'verified',
      validity: 'current',
    }));
    const state = computeVerificationState('REQ-TEST-001', graph);
    expect(state.verified).toBe(true);
    expect(state.verifiedState).toBe('verified');
  });

  it('returns partially-verified when some outcomes have evidence', () => {
    const graph = createTestGraph();
    const state = computeVerificationState('REQ-TEST-001', graph);
    expect(state.verified).toBe(false);
    expect(state.verifiedState).toBe('partially-verified');
  });

  it('returns unverified when no evidence at all', () => {
    const graph = createTestGraph();
    graph.nodes = graph.nodes.filter((n) => n.id !== 'EVD-TEST-001');
    const state = computeVerificationState('REQ-TEST-001', graph);
    expect(state.verified).toBe(false);
    expect(state.verifiedState).toBe('unverified');
  });

  it('returns not-assessed for nonexistent requirement', () => {
    const graph = createTestGraph();
    const state = computeVerificationState('NONEXISTENT', graph);
    expect(state.verifiedState).toBe('not-assessed');
  });

  it('returns stale when evidence has stale validity', () => {
    const graph = createTestGraph();
    const ev = graph.nodes.find((n) => n.id === 'EVD-TEST-001')!;
    ev.validity = 'stale';
    const state = computeVerificationState('REQ-TEST-001', graph);
    expect(state.verifiedState).toBe('stale');
  });

  it('returns invalidated when evidence has invalidated validity', () => {
    const graph = createTestGraph();
    const ev = graph.nodes.find((n) => n.id === 'EVD-TEST-001')!;
    ev.validity = 'invalidated';
    const state = computeVerificationState('REQ-TEST-001', graph);
    expect(state.verifiedState).toBe('invalidated');
  });
});

describe('getVerificationReport', () => {
  it('returns a comprehensive report', () => {
    const graph = createTestGraph();
    const report = getVerificationReport(graph);
    expect(report.requirements).toHaveLength(1);
    expect(report.implementedButUnverified).toBeDefined();
    expect(report.acceptanceOutcomesWithoutEvidence).toContain('AC-TEST-002');
  });
});

describe('checkStalenessForManifestation', () => {
  it('detects verification links for changed manifestation', () => {
    const graph = createTestGraph();
    const result = checkStalenessForManifestation('MAN-TEST-001', graph);
    expect(result.stale).toBe(true);
    expect(result.affectedAcceptanceOutcomes).toContain('AC-TEST-001');
    expect(result.affectedTraceLinks).toContain('TRC-TEST-002');
  });

  it('returns not stale for manifestation with no verifies links', () => {
    const graph = createTestGraph();
    graph.traceLinks = graph.traceLinks.filter((l) => l.id !== 'TRC-TEST-002');
    const result = checkStalenessForManifestation('MAN-TEST-001', graph);
    expect(result.stale).toBe(false);
    expect(result.affectedTraceLinks).toHaveLength(0);
  });
});

describe('bindEvidence', () => {
  beforeEach(() => setupTestGraphDir());
  afterEach(() => cleanupTestGraphDir());

  it('creates evidence node linked to acceptance outcome', () => {
    const graph = createTestGraph();
    const ev = bindEvidence('AC-TEST-001', {
      statement: 'Bound evidence',
      source: 'test',
      authoring_actor: 'test',
    }, graph, TEST_GRAPH_DIR);
    expect(ev.type).toBe('Evidence');
    expect(ev.acceptance_outcome).toBe('AC-TEST-001');
    expect(ev.statement).toBe('Bound evidence');
    expect(ev.delivery).toBe('verified');
  });

  it('throws for nonexistent acceptance outcome', () => {
    const graph = createTestGraph();
    expect(() =>
      bindEvidence('NONEXISTENT', { statement: 'test', source: 'test', authoring_actor: 'test' }, graph, TEST_GRAPH_DIR),
    ).toThrow('AcceptanceOutcome NONEXISTENT not found in graph');
  });
});

describe('separate dimensions (implemented ≠ verified)', () => {
  it('represents implemented-but-unverified requirement', () => {
    const graph = createTestGraph();
    graph.traceLinks.push(makeTraceLink({
      id: 'TRC-IMPL-COMP',
      source: 'REQ-TEST-001',
      target: 'component',
      relationship_type: 'implements',
      coverage: 'complete',
    }));
    graph.traceLinks.push(makeTraceLink({
      id: 'TRC-IMPL-VAL',
      source: 'REQ-TEST-001',
      target: 'validator',
      relationship_type: 'implements',
      coverage: 'complete',
    }));
    const isImpl = isImplemented('REQ-TEST-001', graph);
    const isVer = isVerified('REQ-TEST-001', graph);
    expect(isImpl).toBe(true);
    expect(isVer).toBe(false);
  });

  it('represents verified-but-not-implemented requirement', () => {
    const graph = createTestGraph();
    const req = graph.nodes.find((n) => n.id === 'REQ-TEST-001')!;
    req.acceptance_outcomes = ['AC-TEST-001'];
    graph.nodes.push(makeNode('EVD-TEST-002', 'Evidence', {
      acceptance_outcome: 'AC-TEST-001',
      statement: 'Additional verified evidence',
      delivery: 'verified',
      validity: 'current',
    }));
    expect(isImplemented('REQ-TEST-001', graph)).toBe(false);
    expect(isVerified('REQ-TEST-001', graph)).toBe(true);
  });
});

describe('change-triggered staleness', () => {
  beforeEach(() => setupTestGraphDir());
  afterEach(() => cleanupTestGraphDir());

  it('returns updated trace link IDs when manifestation changes', () => {
    const graph = createTestGraph();
    const updated = markVerificationStaleByManifestation('MAN-TEST-001', graph, TEST_GRAPH_DIR);
    expect(updated).toContain('TRC-TEST-002');
  });

  it('returns updated evidence IDs when manifestation changes', () => {
    const graph = createTestGraph();
    const updated = markVerificationStaleByManifestation('MAN-TEST-001', graph, TEST_GRAPH_DIR);
    expect(updated).toContain('EVD-TEST-001');
  });

  it('returns empty for manifestation with no verifies links', () => {
    const graph = createTestGraph();
    graph.traceLinks = graph.traceLinks.filter((l) => l.id !== 'TRC-TEST-002');
    const updated = markVerificationStaleByManifestation('MAN-TEST-001', graph, TEST_GRAPH_DIR);
    expect(updated).toHaveLength(0);
  });
});
