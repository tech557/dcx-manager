import type { PhaseNodeData } from '@/types/builder-node.types';
import type { ApiPhaseIconType } from '@/types/api';
import { ToggleGroup, type ToggleGroupItem } from '@/ui/atoms/ToggleGroup';

interface PhaseEditorSectionProps {
  draftData: PhaseNodeData;
  updateDraftField: (field: string, value: unknown) => void;
}

export function PhaseEditorSection({ draftData, updateDraftField }: PhaseEditorSectionProps) {
  const items: Array<ToggleGroupItem<ApiPhaseIconType>> = (
    ['awareness', 'teaser', 'launch', 'scale', 'maintenance'] as ApiPhaseIconType[]
  ).map((icon) => ({
    value: icon,
    label: icon,
    icon: <span className="font-mono uppercase">{icon.substring(0, 4)}</span>,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="editor-field-label">
          Phase Icon
        </label>
        <ToggleGroup
          items={items}
          value={draftData.icon}
          onChange={(icon) => updateDraftField('icon', icon)}
          className="grid w-full grid-cols-5 rounded-lg"
          ariaLabel="Choose phase icon"
        />
      </div>
    </div>
  );
}
