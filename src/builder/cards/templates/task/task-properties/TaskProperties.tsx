import React, { useState, useRef } from 'react';
import { Layers, FileText, Database, ListTodo } from 'lucide-react';
import type { TaskCardData } from '@/types/builder-node.types';
import type { Subtask } from '@/types/domain';
import type { ApiFieldCompletionState } from '@/types/api';
import { useCompositionsQuery } from '@/queries/channels.queries';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { TaskCardPopovers } from './TaskCardPopovers';

interface TaskPropertiesProps {
  task: TaskCardData;
}

export function TaskProperties({ task }: TaskPropertiesProps) {
  const builderActions = useBuilderActions();

  // Popover Trigger states
  const [activePopover, setActivePopover] = useState<'comp' | 'specs' | 'missing' | 'bench' | null>(null);

  // Trigger element references
  const compTriggerRef = useRef<HTMLButtonElement>(null);
  const specsTriggerRef = useRef<HTMLButtonElement>(null);
  const missingTriggerRef = useRef<HTMLButtonElement>(null);
  const benchTriggerRef = useRef<HTMLButtonElement>(null);

  // Layout Template Info
  const { data: compositions = [] } = useCompositionsQuery(task.channelId);
  const matchedComp = compositions.find((c) => c.id === task.compositionId);
  const compLabel = matchedComp ? matchedComp.name : 'Freeform';

  const handleCompositionChange = (compId: string | null, subtasks?: Subtask[]) => {
    builderActions.updateTask({
      actionId: task.actionId,
      taskId: task.id,
      changes: subtasks ? { compositionId: compId, subtasks } : { compositionId: compId }
    });
  };

  const handleSpecsChange = (state: ApiFieldCompletionState) => {
    builderActions.updateTask({
      actionId: task.actionId,
      taskId: task.id,
      changes: { specsState: state }
    });
  };

  const handleMissingDataChange = (state: ApiFieldCompletionState) => {
    builderActions.updateTask({
      actionId: task.actionId,
      taskId: task.id,
      changes: { missingDataState: state }
    });
  };

  const handleSubtasksChange = (subtasks: Subtask[]) => {
    builderActions.updateTask({
      actionId: task.actionId,
      taskId: task.id,
      changes: { subtasks }
    });
  };

  return (
    <>
      {/* Aligned Utility belt of 4 small round pins */}
      <div className="flex items-center gap-0.5 bg-neutral-950/40 p-[1.5px] border border-white/5 rounded-full shrink-0">
        {/* 1. Layout Button */}
        <button
          ref={compTriggerRef}
          onClick={() => setActivePopover(activePopover === 'comp' ? null : 'comp')}
          className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all outline-none cursor-pointer ${
            task.compositionId 
              ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]' 
              : 'bg-white/5 border-white/10 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
          }`}
          title={`Layout: ${compLabel}`}
          id={`quick-edit-trigger-layout-${task.id}`}
        >
          <Layers className="w-2 h-2" />
        </button>

        {/* 2. Specs Button */}
        <button
          ref={specsTriggerRef}
          onClick={() => setActivePopover(activePopover === 'specs' ? null : 'specs')}
          className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all outline-none cursor-pointer ${
            task.specsState?.status === 'filled'
              ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]'
              : task.specsState?.status === 'not-needed'
                ? 'bg-neutral-800 border-white/5 text-neutral-500'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:border-amber-500/40'
          }`}
          title={`Specs: ${task.specsState?.status || 'empty'}`}
          id={`quick-edit-trigger-specs-${task.id}`}
        >
          <FileText className="w-2 h-2" />
        </button>

        {/* 3. Data Button */}
        <button
          ref={missingTriggerRef}
          onClick={() => setActivePopover(activePopover === 'missing' ? null : 'missing')}
          className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all outline-none cursor-pointer ${
            task.missingDataState?.status === 'filled'
              ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]'
              : task.missingDataState?.status === 'not-needed'
                ? 'bg-neutral-800 border-white/5 text-neutral-500'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:border-amber-500/40'
          }`}
          title={`Data: ${task.missingDataState?.status || 'empty'}`}
          id={`quick-edit-trigger-data-${task.id}`}
        >
          <Database className="w-2 h-2" />
        </button>

        {/* 4. Bench (Subtasks) Button */}
        <button
          ref={benchTriggerRef}
          onClick={() => setActivePopover(activePopover === 'bench' ? null : 'bench')}
          className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all outline-none cursor-pointer ${
            (task.subtasks?.length || 0) > 0
              ? 'bg-[var(--theme-accent)]/15 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]'
              : 'bg-white/5 border-white/10 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
          }`}
          title={`Subtasks: ${task.subtasks?.length || 0}`}
          id={`quick-edit-trigger-bench-${task.id}`}
        >
          <ListTodo className="w-2 h-2" />
        </button>
      </div>

      {/* Popovers with Portal Positioning */}
      <TaskCardPopovers
        task={task}
        activePopover={activePopover}
        onClose={() => setActivePopover(null)}
        compTriggerRef={compTriggerRef}
        specsTriggerRef={specsTriggerRef}
        missingTriggerRef={missingTriggerRef}
        benchTriggerRef={benchTriggerRef}
        onCompositionChange={handleCompositionChange}
        onSpecsChange={handleSpecsChange}
        onMissingDataChange={handleMissingDataChange}
        onSubtasksChange={handleSubtasksChange}
      />
    </>
  );
}
