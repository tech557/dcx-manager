import React from 'react';
import type { TaskCardData } from '@/types/builder-node.types';
import { TaskSection1 } from './TaskSection1';
import { TaskSection3 } from './TaskSection3';
import { TaskSection4 } from './TaskSection4';

interface TaskEditorProps {
  draftData: TaskCardData;
  updateDraftField: (field: string, value: unknown) => void;
  anchorDateStr?: string;
  activeTab: 'info' | 'channel' | 'specs' | 'subtasks';
}

export function TaskEditor({ draftData, updateDraftField, anchorDateStr, activeTab }: TaskEditorProps) {
  return (
    <div className="flex flex-col gap-3 font-sansCode" id="task-editor-flow-panel">
      {/* Render selected active section component inside wrapper */}
      <div className="min-h-0 py-1 transition-all" id="task-editor-section-container">
        {activeTab === 'info' && (
          <TaskSection1
            draftData={draftData}
            updateDraftField={updateDraftField}
            anchorDateStr={anchorDateStr}
          />
        )}
        {activeTab === 'specs' && (
          <TaskSection3
            draftData={draftData}
            updateDraftField={updateDraftField}
          />
        )}
        {activeTab === 'subtasks' && (
          <TaskSection4
            draftData={draftData}
            updateDraftField={updateDraftField}
          />
        )}
      </div>
    </div>
  );
}

