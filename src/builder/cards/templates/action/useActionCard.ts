import { useState, useEffect } from 'react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useCardBehavior } from '../../useCardBehavior';
import { useBuilderActions } from '@/actions/useBuilderActions';
import type { ActionCardData } from '@/types/builder-node.types';
import { useToggle } from '@/hooks/useToggle';

interface UseActionCardOptions {
  action: ActionCardData;
  selected?: boolean;
  locked?: boolean;
  onSelect?: (id: string, isMulti: boolean) => void;
}

export function useActionCard({ action, selected = false, locked = false, onSelect }: UseActionCardOptions) {
  const { expandedNodeIds, setExpandedNodeIds, selectedNodeIds, setSelectedNodeIds } = useStageContext();
  const behavior = useCardBehavior({ kind: 'action', data: action, selected, locked, onSelect });
  const builderActions = useBuilderActions();
  const isExpanded = expandedNodeIds.includes(action.id);

  const [editedName, setEditedName] = useState(action.name);
  const [isReadinessModalOpen, , openReadinessModal, closeReadinessModal] = useToggle();

  useEffect(() => {
    // Keep the inline draft name in sync when the backing action changes externally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditedName(action.name);
  }, [action.name]);

  const handleNameSubmit = () => {
    if (editedName.trim() && editedName.trim() !== action.name) {
      builderActions.updateAction({
        phaseId: action.parentPhaseId || action.phaseId,
        actionId: action.id,
        changes: { name: editedName.trim() }
      });
    } else {
      setEditedName(action.name);
    }
  };

  const taskIds = action.tasks?.map((t) => t.id) || [];
  const allTasksExpanded = taskIds.length > 0 && taskIds.every((id) => expandedNodeIds.includes(id));

  function handleFocusToggle() {
    if (taskIds.length === 0) return;
    if (allTasksExpanded) {
      setExpandedNodeIds(expandedNodeIds.filter((id) => !taskIds.includes(id)));
    } else {
      const uniqueNewIds = Array.from(new Set([...expandedNodeIds, ...taskIds]));
      setExpandedNodeIds(uniqueNewIds);
    }
  }

  function handleSelect(id: string, isMulti: boolean) {
    const fn = onSelect || ((targetId: string, multi: boolean) => {
      if (multi) {
        setSelectedNodeIds(
          selectedNodeIds.includes(targetId)
            ? selectedNodeIds.filter((x) => x !== targetId)
            : [...selectedNodeIds, targetId],
        );
      } else {
        setSelectedNodeIds([targetId]);
      }
    });
    fn(id, isMulti);
  }

  return {
    behavior,
    isExpanded,
    editedName,
    setEditedName,
    isReadinessModalOpen,
    setIsReadinessModalOpen: (open: boolean) => (open ? openReadinessModal() : closeReadinessModal()),
    handleNameSubmit,
    taskIds,
    allTasksExpanded,
    handleFocusToggle,
    handleSelect,
    selectedNodeIds,
  };
}
