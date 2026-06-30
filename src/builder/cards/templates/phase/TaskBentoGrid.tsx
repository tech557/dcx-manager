import React, { Fragment } from 'react';
import type { TaskCardData } from '@/types/builder-node.types';
import { TaskCard } from '@/builder/cards/templates/task/TaskCard';
import { useStageContext } from '@/builder/stage/StageProvider';
import { TaskDropZone } from '@/builder/stage/views/TaskDropZone';

interface TaskBentoGridProps {
  tasks: TaskCardData[];
  actionId?: string;
  locked: boolean;
  selectedNodeIds: string[];
  onSelect: (id: string, isMulti: boolean) => void;
  className?: string;
}

export function TaskBentoGrid({
  tasks = [],
  actionId,
  locked,
  selectedNodeIds,
  onSelect,
  className = '',
}: TaskBentoGridProps) {
  const { expandedNodeIds } = useStageContext();

  if (tasks.length === 0) {
    return (
      <div className="text-dcx-xs text-neutral-600 col-span-4 py-3 px-2 select-none" id="task-bento-grid-empty">
        No tasks created yet
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-4 items-center gap-1.5 w-full select-none ${className}`}
      id="task-scroll-list"
    >
      {actionId && <TaskDropZone index={0} actionId={actionId} isSmall={true} />}
      {tasks.map((task, index) => {
        const isTaskExpanded = expandedNodeIds.includes(task.id);
        return (
          <Fragment key={task.id}>
            <div 
              className={`${isTaskExpanded ? 'col-span-4 w-full h-[60px]' : 'col-span-1 w-14 h-[60px]'} flex flex-col shrink-0 bg-transparent`}
              id={`scroll-item-${task.id}`}
            >
              <TaskCard
                task={task}
                selected={selectedNodeIds.includes(task.id)}
                onSelect={onSelect}
                locked={locked}
              />
            </div>
            {actionId && <TaskDropZone index={index + 1} actionId={actionId} isSmall={true} />}
          </Fragment>
        );
      })}
    </div>
  );
}
