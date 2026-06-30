import React from 'react';
import type { TaskCardData } from '@/types/builder-node.types';
import type { Subtask } from '@/types/domain';
import type { ApiFieldCompletionState } from '@/types/api';
import { QuickEditPopover } from '@/builder/ui/modals/quick-edit/QuickEditPopover';
import { ChannelCompositionSelect } from '@/builder/ui/forms/channel';
import { CompletionStateSelect } from '@/ui/forms/selects';
import { QuickSubtaskForm } from '@/builder/ui/forms/subtask';

interface TaskCardPopoversProps {
  task: TaskCardData;
  activePopover: 'comp' | 'specs' | 'missing' | 'bench' | null;
  onClose: () => void;
  compTriggerRef: React.RefObject<HTMLButtonElement | null>;
  specsTriggerRef: React.RefObject<HTMLButtonElement | null>;
  missingTriggerRef: React.RefObject<HTMLButtonElement | null>;
  benchTriggerRef: React.RefObject<HTMLButtonElement | null>;
  onCompositionChange: (compositionId: string | null, subtasks?: Subtask[]) => void;
  onSpecsChange: (state: ApiFieldCompletionState) => void;
  onMissingDataChange: (state: ApiFieldCompletionState) => void;
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

export function TaskCardPopovers({
  task,
  activePopover,
  onClose,
  compTriggerRef,
  specsTriggerRef,
  missingTriggerRef,
  benchTriggerRef,
  onCompositionChange,
  onSpecsChange,
  onMissingDataChange,
  onSubtasksChange,
}: TaskCardPopoversProps) {
  return (
    <>
      <QuickEditPopover
        isOpen={activePopover === 'comp'}
        onClose={onClose}
        title="Layout Composition Templates"
        triggerRef={compTriggerRef}
      >
        <ChannelCompositionSelect
          channelId={task.channelId}
          selectedCompositionId={task.compositionId}
          taskId={task.id}
          onChange={(compId, sub) => {
            onCompositionChange(compId, sub);
            onClose();
          }}
          currentSubtasks={task.subtasks || []}
        />
      </QuickEditPopover>

      <QuickEditPopover
        isOpen={activePopover === 'specs'}
        onClose={onClose}
        title="Specs Benchmarks State"
        triggerRef={specsTriggerRef}
      >
        <CompletionStateSelect
          label="Specs Metric State"
          value={task.specsState}
          onChange={onSpecsChange}
          placeholder="e.g. Dimensions, copy constraints, or safe-areas..."
        />
      </QuickEditPopover>

      <QuickEditPopover
        isOpen={activePopover === 'missing'}
        onClose={onClose}
        title="Missing Data Tracker State"
        triggerRef={missingTriggerRef}
      >
        <CompletionStateSelect
          label="Missing Data Tracker"
          value={task.missingDataState}
          onChange={onMissingDataChange}
          placeholder="e.g. Awaiting client pricing sheets, or brand assets..."
        />
      </QuickEditPopover>

      <QuickEditPopover
        isOpen={activePopover === 'bench'}
        onClose={onClose}
        title="Subtasks Benchmarks List"
        triggerRef={benchTriggerRef}
      >
        <QuickSubtaskForm
          taskId={task.id}
          subtasks={task.subtasks || []}
          onChange={onSubtasksChange}
        />
      </QuickEditPopover>
    </>
  );
}
