import type { ActionCardData } from '@/types/builder-node.types';
import { Input } from '@/ui/atoms/Input';

interface ActionEditorSectionProps {
  draftData: ActionCardData;
  updateDraftField: (field: string, value: unknown) => void;
}

export function ActionEditorSection({ draftData, updateDraftField }: ActionEditorSectionProps) {
  return (
    <div className="space-y-4">
      <Input
        as="textarea"
        id="action-description"
        label="Description"
        value={draftData.description || ''}
        onChange={(event) => updateDraftField('description', event.target.value)}
        placeholder="Enter description..."
        rows={4}
        size="lg"
        className="bg-neutral-900/60 hover:bg-neutral-900 resize-y select-text font-sans"
      />
    </div>
  );
}
