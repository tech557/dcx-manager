import { describe, it, expect } from 'vitest';
import { runInventory, runDetectors, inferCandidateLinks, classifyCandidates, checkCompletion, createManifestationId } from '../../../scripts/requirements/reconciliation-engine.ts';
import type { GraphData, GraphNode, TraceLink } from '../../../scripts/requirements/schema.ts';

function makeMinimalGraph(): GraphData {
  return { nodes: [], traceLinks: [], ledger: [] };
}

function makeReq(id: string, statement?: string): GraphNode {
  return {
    id,
    type: 'Requirement',
    statement: statement ?? `Requirement ${id}`,
    governance: 'approved',
    maturity: 'behavior-defined',
    delivery: 'not-started',
    scope: 'frontend',
  };
}

function makeTraceLink(source: string, target: string, rel: string, conf?: number): TraceLink {
  return {
    id: `TRC-${source}-${target}`,
    type: 'TraceLink',
    source,
    target,
    relationship_type: rel as TraceLink['relationship_type'],
    coverage: 'complete',
    confidence: conf ?? 0.9,
    stale_state: 'current',
  };
}

describe('createManifestationId', () => {
  it('generates consistent IDs', () => {
    const id = createManifestationId('react-component', 'builder', 'MyComponent');
    expect(id).toBe('MAN-react-component-builder-mycomponent');
  });

  it('handles special characters', () => {
    const id = createManifestationId('hook', 'stage', 'useDragHandler');
    expect(id).toMatch(/^MAN-hook-/);
  });
});

describe('runInventory', () => {
  it('returns a non-empty inventory when code-index exists', () => {
    const data = makeMinimalGraph();
    const result = runInventory(data);
    expect(Array.isArray(result.manifestations)).toBe(true);
    expect(result.manifestations.length).toBeGreaterThan(0);
    expect(result.newCount).toBeGreaterThanOrEqual(0);
  });

  it('each manifestation has required fields', () => {
    const data = makeMinimalGraph();
    const result = runInventory(data);
    for (const m of result.manifestations) {
      expect(m.id).toBeTruthy();
      expect(m.kind).toBeTruthy();
      expect(Array.isArray(m.current_paths)).toBe(true);
      expect(m.name).toBeTruthy();
    }
  });
});

describe('runDetectors', () => {
  it('detects manifestations without requirement links', () => {
    const data = makeMinimalGraph();
    const manifestations = [
      { id: 'MAN-foo', kind: 'react-component' as const, current_paths: ['src/Foo.tsx'], name: 'Foo', lifecycle: 'created' as const },
    ];
    const result = runDetectors(data, manifestations);
    expect(result.manifestationsLackingRequirements).toContain('MAN-foo');
  });

  it('detects stale/broken traces', () => {
    const data: GraphData = {
      nodes: [],
      traceLinks: [
        makeTraceLink('MAN-foo', 'REQ-1', 'implements'),
        {
          id: 'TRC-stale-1',
          type: 'TraceLink',
          source: 'MAN-bar',
          target: 'REQ-2',
          relationship_type: 'implements',
          coverage: 'stale',
          confidence: 0.5,
          stale_state: 'stale',
        },
      ],
      ledger: [],
    };
    const manifestations = [
      { id: 'MAN-foo', kind: 'react-component' as const, current_paths: ['src/Foo.tsx'], name: 'Foo', lifecycle: 'created' as const },
      { id: 'MAN-bar', kind: 'react-component' as const, current_paths: ['src/Bar.tsx'], name: 'Bar', lifecycle: 'created' as const },
    ];
    const result = runDetectors(data, manifestations);
    expect(result.staleBrokenTraces).toContain('TRC-stale-1');
  });

  it('detects tests disconnected from acceptance outcomes', () => {
    const data = makeMinimalGraph();
    const manifestations = [
      { id: 'MAN-test-1', kind: 'test' as const, current_paths: ['src/Foo.test.ts'], name: 'Foo.test', lifecycle: 'created' as const },
    ];
    const result = runDetectors(data, manifestations);
    expect(result.testsDisconnected).toContain('MAN-test-1');
  });

  it('detects connected tests are not flagged', () => {
    const data: GraphData = {
      nodes: [],
      traceLinks: [
        {
          id: 'TRC-test-1',
          type: 'TraceLink',
          source: 'MAN-test-1',
          target: 'AC-001',
          relationship_type: 'verifies',
          coverage: 'complete',
          confidence: 0.9,
          stale_state: 'current',
        },
      ],
      ledger: [],
    };
    const manifestations = [
      { id: 'MAN-test-1', kind: 'test' as const, current_paths: ['src/Foo.test.ts'], name: 'Foo.test', lifecycle: 'created' as const },
    ];
    const result = runDetectors(data, manifestations);
    expect(result.testsDisconnected).not.toContain('MAN-test-1');
  });
});

describe('inferCandidateLinks', () => {
  it('returns candidates when names match requirement text', () => {
    const data: GraphData = {
      nodes: [makeReq('REQ-DRAG-001', 'Drag drop handler useDrag behavior')],
      traceLinks: [],
      ledger: [],
    };
    const manifestations = [
      { id: 'MAN-drag-handler', kind: 'hook' as const, current_paths: ['src/hooks/useDrag.ts'], name: 'useDrag', lifecycle: 'created' as const },
    ];
    const candidates = inferCandidateLinks(manifestations, data);
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0].confidence).toBeGreaterThanOrEqual(0);
  });

  it('each candidate has required fields', () => {
    const data: GraphData = {
      nodes: [makeReq('REQ-TEST-001', 'Test requirement')],
      traceLinks: [],
      ledger: [],
    };
    const manifestations = [
      { id: 'MAN-test-1', kind: 'test' as const, current_paths: ['src/Test.test.ts'], name: 'Test.test', lifecycle: 'created' as const },
    ];
    const candidates = inferCandidateLinks(manifestations, data);
    for (const c of candidates) {
      expect(typeof c.confidence).toBe('number');
      expect(typeof c.evidence).toBe('string');
      expect(typeof c.reason).toBe('string');
      expect(typeof c.needs_confirmation).toBe('boolean');
      expect(typeof c.is_technical).toBe('boolean');
    }
  });
});

describe('classifyCandidates', () => {
  it('auto-applies high-confidence technical links', () => {
    const candidates = [
      {
        manifestationId: 'MAN-foo',
        targetId: 'RSP-001',
        relationship_type: 'implements' as const,
        confidence: 0.85,
        evidence: 'test',
        reason: 'test',
        needs_confirmation: false,
        is_technical: true,
      },
    ];
    const data: GraphData = {
      nodes: [
        {
          id: 'MAN-foo',
          type: 'Manifestation',
          kind: 'function',
          current_paths: ['src/foo.ts'],
          lifecycle: 'created',
        },
      ],
      traceLinks: [],
      ledger: [],
    };
    const { autoApply, queue } = classifyCandidates(candidates, data);
    expect(autoApply).toHaveLength(1);
    expect(queue).toHaveLength(0);
  });

  it('queues high-confidence technical links when the MAN node is absent', () => {
    const candidates = [
      {
        manifestationId: 'MAN-missing',
        targetId: 'RSP-001',
        relationship_type: 'implements' as const,
        confidence: 0.85,
        evidence: 'test',
        reason: 'test',
        needs_confirmation: false,
        is_technical: true,
      },
    ];
    const data = makeMinimalGraph();
    const { autoApply, queue } = classifyCandidates(candidates, data);
    expect(autoApply).toHaveLength(0);
    expect(queue).toHaveLength(1);
  });

  it('routes ambiguous mappings to review queue', () => {
    const candidates = [
      {
        manifestationId: 'MAN-foo',
        targetId: 'REQ-001',
        relationship_type: 'implements' as const,
        confidence: 0.5,
        evidence: 'test',
        reason: 'test',
        needs_confirmation: true,
        is_technical: false,
      },
    ];
    const data = makeMinimalGraph();
    const { autoApply, queue } = classifyCandidates(candidates, data);
    expect(autoApply).toHaveLength(0);
    expect(queue).toHaveLength(1);
  });

  it('low-confidence technical links go to queue', () => {
    const candidates = [
      {
        manifestationId: 'MAN-foo',
        targetId: 'RSP-002',
        relationship_type: 'implements' as const,
        confidence: 0.7,
        evidence: 'test',
        reason: 'test',
        needs_confirmation: true,
        is_technical: true,
      },
    ];
    const data = makeMinimalGraph();
    const { autoApply, queue } = classifyCandidates(candidates, data);
    expect(autoApply).toHaveLength(0);
    expect(queue).toHaveLength(1);
  });
});

describe('checkCompletion', () => {
  it('returns a report with gatePass and issues', () => {
    const result = checkCompletion(['src/components/Foo.tsx']);
    expect(typeof result.gatePass).toBe('boolean');
    expect(Array.isArray(result.issues)).toBe(true);
    expect(result.mode).toBe('changed');
    expect(result.inventory.length).toBeGreaterThanOrEqual(0);
  });
});
