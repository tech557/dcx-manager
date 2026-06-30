import React from 'react';
import type { BuilderNode } from '@/types/builder-node.types';
import { usePresentationMode } from './usePresentationMode';
import { resolveNodeKind } from '@/utils/node.helpers';

export interface SelectionLabelProps {
  hasSelection: boolean;
  selectedNodeIds: string[];
  nodes: BuilderNode[];
  view: 'timeline' | 'canvasboard' | string;
}

export function SelectionLabel({
  hasSelection,
  selectedNodeIds,
  nodes,
  view,
}: SelectionLabelProps) {
  const count = selectedNodeIds.length;
  const { isPresentationActive, enterPresentationMode, exitPresentationMode } = usePresentationMode();

  let natureLabel = '';
  if (count === 0) {
    natureLabel = view === 'timeline' ? 'Roadmap Stage' : 'Canvasboard';
  } else {
    let selectedPhasesCount = 0;
    let selectedActionsCount = 0;
    let selectedTasksCount = 0;
    for (const id of selectedNodeIds) {
      const kind = resolveNodeKind(nodes, id);
      if (kind === 'phase') selectedPhasesCount++;
      else if (kind === 'action') selectedActionsCount++;
      else if (kind === 'task') selectedTasksCount++;
    }

    if (selectedPhasesCount > 0 && selectedActionsCount === 0 && selectedTasksCount === 0) {
      natureLabel = `${selectedPhasesCount} phase${selectedPhasesCount > 1 ? 's' : ''} selected`;
    } else if (selectedPhasesCount === 0 && selectedActionsCount > 0 && selectedTasksCount === 0) {
      natureLabel = `${selectedActionsCount} action${selectedActionsCount > 1 ? 's' : ''} selected`;
    } else if (selectedPhasesCount === 0 && selectedActionsCount === 0 && selectedTasksCount > 0) {
      natureLabel = `${selectedTasksCount} task${selectedTasksCount > 1 ? 's' : ''} selected`;
    } else {
      natureLabel = `${count} items selected`;
    }
  }

  const handlePresentationClick = () => {
    if (isPresentationActive) {
      exitPresentationMode();
    } else if (count === 1) {
      enterPresentationMode(selectedNodeIds[0]);
    }
  };

  return (
    <div className="flex flex-col gap-0.5 min-w-[90px] text-left">
      <span className="text-dcx-4xs font-black tracking-[0.1em] uppercase opacity-40 block leading-none font-sans select-none">
        Workstate
      </span>
      {count === 1 ? (
        <button
          type="button"
          onClick={handlePresentationClick}
          className="text-dcx-xs font-bold font-sans tracking-tight text-left text-[var(--theme-accent)] hover:text-[var(--theme-accent-variant)] transition-colors cursor-pointer select-none leading-none focus:outline-none flex items-center gap-1"
          id="btn-selection-presentation"
          title={isPresentationActive ? "Click to exit presentation mode" : "Click to enter presentation mode"}
        >
          <span>{natureLabel}</span>
          <span className="text-dcx-2xs opacity-75 px-1 py-0.5 rounded bg-white/10 text-white font-normal uppercase tracking-wider font-mono scale-90">
            {isPresentationActive ? 'Active' : 'Present'}
          </span>
        </button>
      ) : (
        <span className={`text-dcx-xs font-bold font-sans tracking-tight block leading-none ${!hasSelection ? 'opacity-40' : 'text-[var(--theme-accent)]'}`}>
          {natureLabel}
        </span>
      )}
    </div>
  );
}
