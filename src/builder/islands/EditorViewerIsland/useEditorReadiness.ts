import { useMemo } from 'react';
import { getTaskReadiness, getActionReadiness, getPhaseReadiness } from '@/rules/readiness.rules';
import type { ReadinessResult } from '@/rules/readiness.rules';
import type { TaskCardData, ActionCardData, PhaseNodeData } from '@/types/builder-node.types';
import type { Action, Phase } from '@/types/domain';
import type { EditorNode } from './editor-node.helpers';

// A small hook that computes readiness for the editor's active node.
// Inputs: the currently active/focused node and the editor draft for that node.
// Output: a ReadinessResult or null when not applicable.
export function useEditorReadiness(
  activeNode: EditorNode | null,
  draftData: TaskCardData | ActionCardData | PhaseNodeData | null,
): ReadinessResult | null {
  return useMemo(() => {
    if (!activeNode || !draftData) return null;
    if (activeNode.kind === 'day') return null;

    if (activeNode.kind === 'task') {
      return getTaskReadiness({ ...(draftData as TaskCardData), id: activeNode.id });
    }

    if (activeNode.kind === 'action') {
      return getActionReadiness({
        ...activeNode.data,
        ...(draftData as ActionCardData),
      } satisfies Action);
    }

    if (activeNode.kind === 'phase') {
      const phaseDraft = draftData as PhaseNodeData;
      return getPhaseReadiness({
        ...activeNode.data,
        ...phaseDraft,
        actions: phaseDraft.actionCards,
      } satisfies Phase);
    }

    return null;
  }, [activeNode, draftData]);
}
