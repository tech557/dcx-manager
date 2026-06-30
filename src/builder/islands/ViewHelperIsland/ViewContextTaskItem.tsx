import React from 'react';
import { useStageContext } from '../../stage/StageProvider';
import { ChannelPill } from '@/builder/cards/templates/task/task-properties/ChannelPill';
import type { TaskNode } from '@/types/builder-node.types';

interface ViewContextTaskItemProps {
  taskNode: TaskNode;
  actionName: string;
  phaseName: string;
}

export function ViewContextTaskItem({ taskNode, actionName, phaseName }: ViewContextTaskItemProps) {
  const { setDraggingState } = useStageContext();
  const task = taskNode.data;
  const isUnassigned = task.date.mode === 'unset';

  const handleDragStart = (e: React.DragEvent) => {
    if (!isUnassigned) {
      e.preventDefault();
      return;
    }
    setDraggingState(true, 'task', task.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'application/x-dcx-card',
      JSON.stringify({
        id: task.id,
        kind: 'task',
        fromViewContext: true,
      })
    );
  };

  const handleDragEnd = () => {
    setDraggingState(false, null, null);
  };

  return (
    <div
      id={`view-context-task-item-${task.id}`}
      draggable={isUnassigned}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`p-2.5 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 ${
        isUnassigned
          ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 cursor-grab active:cursor-grabbing hover:scale-[1.01]'
          : 'border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed select-none'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-dcx-sm font-semibold text-white/90 truncate flex-1">
          {task.name}
        </div>
        <div className="shrink-0">
          <ChannelPill
            channelId={task.channelId}
            className="px-1.5 py-0.5 rounded-md text-dcx-2xs font-mono flex items-center gap-1 bg-sky-950/40 border border-sky-800/30 text-sky-300"
          />
        </div>
      </div>
      <div className="text-dcx-2xs text-white/40 truncate font-medium">
        {phaseName} <span className="opacity-30">/</span> {actionName}
      </div>
    </div>
  );
}
