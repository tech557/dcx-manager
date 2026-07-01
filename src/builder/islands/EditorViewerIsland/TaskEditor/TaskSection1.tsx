import type { TaskCardData } from '@/types/builder-node.types';
import { Input } from '@/ui/atoms/Input';
import { CommunicationDateField } from '@/ui/forms/date';
import { RoutingDirectorySection } from './RoutingDirectorySection';

interface TaskSection1Props {
  draftData: TaskCardData;
  updateDraftField: (field: string, value: unknown) => void;
  anchorDateStr?: string;
}

export function TaskSection1({ draftData, updateDraftField, anchorDateStr }: TaskSection1Props) {
  return (
    <div className="space-y-4" id="task-editor-section-1">
      {/* 1. Communication Calendar */}
      <CommunicationDateField
        value={draftData.date || { mode: 'unset' }}
        onChange={(newDate) => updateDraftField('date', newDate)}
        anchorDateStr={anchorDateStr || '2026-07-01'}
      />

      {/* 2. Message Text */}
      <Input
        as="textarea"
        id="task-message-field"
        label="Draft Message Text"
        hint="The core message body for this communication. Structure it as it should read to the recipient."
        value={draftData.message || ''}
        onChange={(event) => updateDraftField('message', event.target.value)}
        placeholder="Enter draft message structure..."
        rows={3}
        size="lg"
        className="resize-y select-text font-sans leading-relaxed"
      />

      <RoutingDirectorySection draftData={draftData} updateDraftField={updateDraftField} />
    </div>
  );
}
