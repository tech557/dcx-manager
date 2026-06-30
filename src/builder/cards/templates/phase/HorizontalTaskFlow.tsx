import React, { Fragment } from 'react';
import type { TaskCardData } from '@/types/builder-node.types';
import { TaskCard } from '@/builder/cards/templates/task/TaskCard';
import { TaskDropZone } from '@/builder/stage/views/TaskDropZone';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useScrollEdge } from '@/hooks/useScrollEdge';

interface HorizontalTaskFlowProps {
  tasks: TaskCardData[];
  actionId?: string;
  selectedNodeIds?: string[];
  onTaskClick?: (taskId: string, e: React.MouseEvent) => void;
  className?: string;
}

export function HorizontalTaskFlow({
  tasks = [],
  actionId,
  selectedNodeIds = [],
  onTaskClick,
  className = '',
}: HorizontalTaskFlowProps) {
  const { expandedNodeIds } = useStageContext();
  const { ref: taskScrollRef, startFade: leftFade, endFade: rightFade } = useScrollEdge('horizontal');

  if (tasks.length === 0) {
    return (
      <div className={`text-dcx-2xs text-neutral-600 select-none py-2 ${className}`} id="horizontal-task-flow-empty">
        No tasks yet
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} id="horizontal-task-flow-container">
      {leftFade && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-[var(--theme-glass-bg)] to-transparent" aria-hidden />
      )}
      {rightFade && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-[var(--theme-glass-bg)] to-transparent" aria-hidden />
      )}
    <div
      ref={taskScrollRef}
      className="flex flex-row flex-nowrap items-center gap-2 pt-1.5 pb-2 select-none w-full overflow-x-auto overflow-y-hidden [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      {actionId && <TaskDropZone index={0} actionId={actionId} isSmall={true} />}
      {tasks.map((task, index) => {
        const isSelected = selectedNodeIds.includes(task.id);
        const isExpanded = expandedNodeIds.includes(task.id);

        return (
          <Fragment key={task.id}>
            <div
              className={`${isExpanded ? 'w-[calc(100%-1rem)] mx-2 flex-none' : 'flex-none'} pointer-events-auto`}
              id={`horizontal-task-item-${task.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <TaskCard
                task={task}
                selected={isSelected}
                onSelect={(id, isMulti) => {
                  if (onTaskClick) {
                    onTaskClick(id, { shiftKey: isMulti } as React.MouseEvent);
                  }
                }}
                locked={false}
              />
            </div>
            {actionId && <TaskDropZone index={index + 1} actionId={actionId} isSmall={true} />}
          </Fragment>
        );
      })}
    </div>
    </div>
  );
}
