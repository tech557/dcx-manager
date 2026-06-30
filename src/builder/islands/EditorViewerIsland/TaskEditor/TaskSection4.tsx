import React from 'react';
import type { TaskCardData } from '@/types/builder-node.types';
import { QuickSubtaskForm } from '@/builder/ui/forms/subtask';

interface TaskSection4Props {
  draftData: TaskCardData;
  updateDraftField: (field: string, value: unknown) => void;
}

export function TaskSection4({ draftData, updateDraftField }: TaskSection4Props) {
  const subtasks = draftData.subtasks || [];

  return (
    <div className="space-y-3" id="task-editor-section-4">
      <div className="border border-white/5 p-2.5 rounded-lg bg-white/[0.01]">
        <QuickSubtaskForm
          taskId={draftData.id}
          subtasks={subtasks}
          onChange={(updated) => updateDraftField('subtasks', updated)}
        />
      </div>
    </div>
  );
}
