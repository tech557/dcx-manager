import { useMemo, type MouseEvent } from 'react';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { getCardConfig } from './card.registry';
import type { ActionCardData, PhaseNodeData, TaskCardData } from '@/types/builder-node.types';
import type { CardKind } from '@/types/card.types';
import type { ReadinessResult } from '@/rules/readiness.rules';
import { getActionReadiness, getPhaseReadiness, getTaskReadiness } from '@/rules/readiness.rules';

export type CardData = PhaseNodeData | ActionCardData | TaskCardData | { id: string; label: string };

export interface CardBehaviorInput {
  kind: CardKind;
  data: CardData;
  selected: boolean;
  locked: boolean;
  onSelect?: (id: string, multi: boolean) => void;
}

export function useCardBehavior({ kind, data, selected, locked, onSelect }: CardBehaviorInput) {
  const config = getCardConfig(kind);
  const actions = useBuilderActions();

  const readiness = useMemo<ReadinessResult>(() => {
    if (kind === 'phase') {
      const phase = data as PhaseNodeData;
      return getPhaseReadiness({
        ...phase,
        actions: phase.actionCards,
      });
    }

    if (kind === 'action') {
      return getActionReadiness(data as ActionCardData);
    }

    if (kind === 'task') {
      return getTaskReadiness(data as TaskCardData);
    }

    return { state: 'ready', reasons: [] };
  }, [data, kind]);

  const draggable = config.capabilities.includes('drag') && !locked && config.movement.axis !== 'none';

  function handleClick(event: MouseEvent<HTMLElement>) {
    onSelect?.(data.id, event.metaKey || event.ctrlKey || event.shiftKey);
  }

  return {
    actions,
    config,
    draggable,
    movementAxis: config.movement.axis,
    readiness,
    selected,
    locked,
    handleClick,
  };
}
