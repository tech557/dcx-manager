import { useState, useEffect } from 'react';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { useCardBehavior } from '../../useCardBehavior';
import type { PhaseNodeData } from '@/types/builder-node.types';
import { useToggle } from '@/hooks/useToggle';

interface UsePhaseCardOptions {
  phase: PhaseNodeData;
  selected?: boolean;
  locked?: boolean;
  onSelect?: (id: string, isMulti: boolean) => void;
}

export function usePhaseCard({ phase, selected = false, locked = false, onSelect }: UsePhaseCardOptions) {
  const { nodes, expandedNodeIds, setExpandedNodeIds, selectedNodeIds, setSelectedNodeIds } = useStageContext();
  const behavior = useCardBehavior({ kind: 'phase', data: phase, selected, locked, onSelect });
  const builderActions = useBuilderActions();

  const isExpanded = expandedNodeIds.includes(phase.id);
  const [isReadinessModalOpen, , openReadinessModal, closeReadinessModal] = useToggle();
  const [editedLabel, setEditedLabel] = useState(phase.label);

  useEffect(() => {
    // Keep the inline draft label in sync when the backing phase changes externally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditedLabel(phase.label);
  }, [phase.label]);

  const handleLabelSubmit = () => {
    if (editedLabel.trim() && editedLabel.trim() !== phase.label) {
      builderActions.updatePhase({
        id: phase.id,
        changes: { label: editedLabel.trim() }
      });
    } else {
      setEditedLabel(phase.label);
    }
  };

  const phaseIndex = nodes.filter(n => n.kind === 'phase').findIndex(n => n.id === phase.id);
  const displayNum = phaseIndex !== -1 ? phaseIndex + 1 : 1;

  const actionIds = phase.actionCards.map((ac) => ac.id);
  const allActionsExpanded = actionIds.length > 0 && actionIds.every((id) => expandedNodeIds.includes(id));

  const handleFocusToggle = () => {
    if (actionIds.length === 0) return;
    if (allActionsExpanded) {
      setExpandedNodeIds(expandedNodeIds.filter((id) => !actionIds.includes(id)));
    } else {
      const uniqueNewIds = Array.from(new Set([...expandedNodeIds, ...actionIds]));
      setExpandedNodeIds(uniqueNewIds);
    }
  };

  const handleSelect = (id: string, isMulti: boolean) => {
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
  };

  return {
    behavior,
    isExpanded,
    isReadinessModalOpen,
    setIsReadinessModalOpen: (open: boolean) => (open ? openReadinessModal() : closeReadinessModal()),
    editedLabel,
    setEditedLabel,
    displayNum,
    actionIds,
    allActionsExpanded,
    handleLabelSubmit,
    handleFocusToggle,
    handleSelect,
    selectedNodeIds,
  };
}
