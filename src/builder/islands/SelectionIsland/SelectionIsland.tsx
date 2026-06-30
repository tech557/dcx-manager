import { useEffect, useMemo } from 'react';
import { useStageContext } from '../../stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { BuilderIslandShell } from '../BuilderIslandShell';
import { SelectionLabel } from './SelectionLabel';
import { SelectionButtons } from './SelectionButtons';
import { DeleteConfirmation } from './DeleteConfirmation';
import { getSelfAndDescendants } from './selection.utils';
import { getTaskReadiness, getActionReadiness, getPhaseReadiness } from '@/rules/readiness.rules';
import { findTask, findAction, resolveNodeKind } from '@/utils/node.helpers';
import type { Phase } from '@/types/domain';
import { useToggle } from '@/hooks/useToggle';

export function SelectionIsland() {
  const { nodes, selectedNodeIds, setSelectedNodeIds, view, expandedNodeIds, setExpandedNodeIds } = useStageContext();
  const actions = useBuilderActions();

  const [isConfirmingDelete, , openDeleteConfirmation, closeDeleteConfirmation] = useToggle();

  const hasSelection = selectedNodeIds.length > 0;

  // Reset confirmation if selection is cleared
  useEffect(() => {
    if (selectedNodeIds.length === 0) {
      closeDeleteConfirmation();
    }
  }, [selectedNodeIds, closeDeleteConfirmation]);

  // Find all targeted item IDs for expansion/collapse recursive behavior
  const targetIds = hasSelection 
    ? [
        ...getSelfAndDescendants(selectedNodeIds.filter(id => !id.startsWith('day:')), nodes),
        ...selectedNodeIds.filter(id => id.startsWith('day:')),
      ]
    : nodes.map(n => n.id);

  const allTargetedAreExpanded = targetIds.length > 0 && targetIds.every(id => expandedNodeIds.includes(id));
  const allTargetedAreCollapsed = targetIds.every(id => !expandedNodeIds.includes(id));

  const anySelectedNodeIsReady = useMemo(() => {
    return selectedNodeIds.some((id) => {
      const kind = resolveNodeKind(nodes, id);
      if (kind === 'task') {
        const task = findTask(nodes, id);
        return task ? getTaskReadiness(task).state === 'ready' : false;
      }
      if (kind === 'action') {
        const action = findAction(nodes, id);
        return action ? getActionReadiness(action).state === 'ready' : false;
      }
      if (kind === 'phase') {
        const phase = nodes.find((n) => n.kind === 'phase' && n.id === id);
        return phase ? getPhaseReadiness(phase.data as unknown as Phase).state === 'ready' : false;
      }
      return false;
    });
  }, [selectedNodeIds, nodes]);

  const handleExpandAllSelected = () => {
    if (allTargetedAreExpanded) return;
    const nextExpanded = Array.from(new Set([...expandedNodeIds, ...targetIds]));
    setExpandedNodeIds(nextExpanded);
  };

  const handleCollapseAllSelected = () => {
    if (allTargetedAreCollapsed) return;
    const nextExpanded = expandedNodeIds.filter(id => !targetIds.includes(id));
    setExpandedNodeIds(nextExpanded);
  };

  const handleDuplicateSelected = () => {
    selectedNodeIds.forEach((id) => {
      actions.duplicateNode({ nodeId: id });
    });
    setSelectedNodeIds([]);
  };

  const handleDeleteTrigger = () => {
    if (selectedNodeIds.length > 1 || anySelectedNodeIsReady) {
      openDeleteConfirmation();
    } else {
      handleDeleteSelected();
    }
  };

  const handleDeleteSelected = () => {
    selectedNodeIds.forEach((id) => {
      const kind = resolveNodeKind(nodes, id);
      if (kind === 'phase') {
        actions.deletePhase(id);
      } else if (kind === 'action') {
        actions.deleteAction(id);
      } else if (kind === 'task') {
        actions.deleteTask(id);
      }
    });
    setSelectedNodeIds([]);
    closeDeleteConfirmation();
  };

  return (
    <BuilderIslandShell
      isExpanded={true}
      shape="panel"
      className="p-2.5 px-5 h-14"
      style={{
        minWidth: hasSelection ? '290px' : '210px',
        maxWidth: 'var(--dim-selection-max-width)',
      }}
      collapsedIcon={null}
      id="selection-island-shell"
    >
      <div className="flex items-center gap-4 w-full h-full justify-between">
        <SelectionLabel
          hasSelection={hasSelection}
          selectedNodeIds={selectedNodeIds}
          nodes={nodes}
          view={view}
        />
        {isConfirmingDelete ? (
          <DeleteConfirmation
            onConfirm={handleDeleteSelected}
            onCancel={closeDeleteConfirmation}
            count={selectedNodeIds.length}
          />
        ) : (
          <SelectionButtons
            hasSelection={hasSelection}
            allTargetedAreExpanded={allTargetedAreExpanded}
            allTargetedAreCollapsed={allTargetedAreCollapsed}
            handleExpandAllSelected={handleExpandAllSelected}
            handleCollapseAllSelected={handleCollapseAllSelected}
            handleDuplicateSelected={handleDuplicateSelected}
            handleDeleteSelected={handleDeleteTrigger}
            handleClearSelection={() => setSelectedNodeIds([])}
          />
        )}
      </div>
    </BuilderIslandShell>
  );
}
