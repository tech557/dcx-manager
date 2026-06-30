import { describe, it, expect } from 'vitest';
import { parseImportJson, diffImportedNodes, mergeImportedNodes, ImportDecision } from '../import.helpers';
import type { BuilderNode } from '@/types/builder-node.types';

// Simple helper to create minimal nodes
function makePhase(id: string, label = 'Phase'): BuilderNode {
  return {
    id,
    kind: 'phase',
    parentId: null,
    orderIndex: 0,
    data: { id, label, versionId: '', icon: 'launch', orderIndex: 0, actionCards: [], updatedAt: null, updatedBy: null },
  } as BuilderNode;
}

describe('import helpers', () => {
  it('runs import smoke tests', () => {
    // Test parse and diff
    const existing: BuilderNode[] = [makePhase('p1')];
    const importedJson = [{ id: 'p2', label: 'New Phase' }];
    const parsed = parseImportJson(importedJson as unknown);
    expect(parsed.find((n) => n.id === 'p2')).toBeDefined();

    const d = diffImportedNodes(existing, parsed);
    expect(d.added.map((a) => a.id)).toContain('p2');
    expect(d.missing.map((m) => m.existingId)).toContain('p1');

    // Test merge decisions
    const imported: BuilderNode[] = [makePhase('p1'), makePhase('p2')];
    const decisions: Record<string, ImportDecision> = { p1: 'keep', p2: 'add' };
    const merged = mergeImportedNodes(existing, imported, decisions);
    expect(merged.some((n) => n.id === 'p1')).toBe(true);
    expect(merged.some((n) => n.id === 'p2')).toBe(true);
  });
});
