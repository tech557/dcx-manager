import { useState } from 'react';
import { nodeActions } from '@/actions/node.actions';
import { parseImportJson, diffImportedNodes, mergeImportedNodes, ImportDecision, ImportDiffGroup } from './import.helpers';
import type { BuilderNode } from '@/types/builder-node.types';
import { useBuilderStore } from '@/store/builderStore';
import { writeLifecycleLog } from '@/services/logs.service';
import { useToggle } from '@/hooks/useToggle';

export function useImport(versionId?: string) {
  const [importedNodes, setImportedNodes] = useState<BuilderNode[] | null>(null);
  const [diff, setDiff] = useState<ImportDiffGroup | null>(null);
  const [confirmDeletes, , confirmDelete, clearDeleteConfirmation] = useToggle();
  const [decisions, setDecisions] = useState<Record<string, ImportDecision>>({});
  const existing = useBuilderStore.getState().nodes;

  function loadFromFileText(text: string) {
    const parsed = JSON.parse(text);
    const nodes = parseImportJson(parsed);
    setImportedNodes(nodes);
    const d = diffImportedNodes(existing, nodes);
    setDiff(d);
    // Initialize decisions: updates -> keep/update (default update), adds -> add, missing -> keep
    const initial: Record<string, ImportDecision> = {};
    for (const u of d.updated || []) initial[u.existingId] = 'update';
    for (const a of d.added || []) initial[a.id] = 'add';
    for (const m of d.missing || []) initial[m.existingId] = 'keep';
    setDecisions(initial);
    clearDeleteConfirmation();
  }

  async function loadFromFile(file: File) {
    const text = await file.text();
    loadFromFileText(text);
  }

  function applyImport() {
    if (!importedNodes) return;
    // If there are missing nodes (deletes) require explicit confirmation
    if (diff && diff.missing && diff.missing.length > 0 && !confirmDeletes) {
      throw new Error('Deletes not confirmed');
    }

    // Build final nodes using decisions
    const finalNodes = mergeImportedNodes(existing, importedNodes, decisions);

    // Use action boundary
    nodeActions.applyImport({ nodes: finalNodes });
    // write a light lifecycle log entry (mock)
    try {
      // best-effort: record number of nodes applied and a timestamp
      writeLifecycleLog({
        type: 'import_applied',
        versionId: versionId || '',
        userId: 'mock-user',
        details: { appliedCount: finalNodes.length },
      }).catch((err) => console.warn('Failed to write import lifecycle log', err));
    } catch (err) {
      console.warn('Failed to write import lifecycle log', err);
    }
    // mark saved state handled by store middleware
    setImportedNodes(null);
    setDiff(null);
    clearDeleteConfirmation();
  }

  function clear() {
    setImportedNodes(null);
    setDiff(null);
    clearDeleteConfirmation();
  }

  function setDecision(id: string, decision: ImportDecision) {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
  }

  return {
    importedNodes,
    diff,
    loadFromFileText,
    loadFromFile,
    applyImport,
    clear,
    confirmDeletes,
    setConfirmDeletes: (confirmed: boolean) => (confirmed ? confirmDelete() : clearDeleteConfirmation()),
    decisions,
    setDecision,
  };
}
