import { useState } from 'react';
import { FolderKanban, X } from 'lucide-react';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { CreateCompositionForm } from '@/builder/islands/TaskCreationFlow/CreateCompositionForm';
import { Step1SelectChannel } from '@/builder/islands/TaskCreationFlow/Step1_SelectChannel';
import { Step2SelectComposition } from '@/builder/islands/TaskCreationFlow/Step2_SelectComposition';
import { useChannelsQuery, useCompositionsQuery } from '@/queries/channels.queries';
import { useSubtaskDefinitionsQuery } from '@/queries/subtask-definitions.queries';
import type { ActionCardData } from '@/types/builder-node.types';
import type { ApiChannel, ApiChannelComposition } from '@/types/api';
import { generateSubtasksFromComposition } from '@/utils/composition.helpers';
import { useToggle } from '@/hooks/useToggle';

interface DayTaskCreatorProps {
  actionsList: ActionCardData[];
  weekIndex: number;
  dayOffset: number;
  onClose: () => void;
}

export function DayTaskCreator({ actionsList, weekIndex, dayOffset, onClose }: DayTaskCreatorProps) {
  const actions = useBuilderActions();
  const [selectedActionId, setSelectedActionId] = useState(actionsList[0]?.id ?? '');
  const [selectedChannel, setSelectedChannel] = useState<ApiChannel | null>(null);
  const [isCreatingComposition, , openCompositionForm, closeCompositionForm] = useToggle();
  const channelsQuery = useChannelsQuery();
  const compositionsQuery = useCompositionsQuery(selectedChannel?.id ?? '');
  const definitionsQuery = useSubtaskDefinitionsQuery(selectedChannel?.id);
  const selectedAction = actionsList.find((action) => action.id === selectedActionId) ?? null;
  const definitions = definitionsQuery.data ?? [];

  function createTaskFromComposition(composition: ApiChannelComposition) {
    if (!selectedAction || !selectedChannel) return;

    actions.createTask({
      actionId: selectedAction.id,
      actionName: selectedAction.name,
      channelId: selectedChannel.id,
      channelLabel: selectedChannel.label,
      compositionId: composition.id,
      generatedSubtasks: generateSubtasksFromComposition('preview-task', composition, definitions),
      date: { mode: 'linked', weekOffset: weekIndex, dayOffset },
    });
    onClose();
  }

  return (
    <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 shadow-sm space-y-3 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-dcx-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Quick Task</span>
        <button
          type="button"
          onClick={onClose}
          className="p-0.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-dcx-2xs font-bold text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
          <FolderKanban className="w-3 h-3 text-sky-400" />
          PARENT ACTION *
        </label>
        <select
          required
          value={selectedActionId}
          onChange={(event) => setSelectedActionId(event.target.value)}
          className="w-full text-dcx-sm h-7 px-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-sky-400"
        >
          {actionsList.map((action) => <option key={action.id} value={action.id}>{action.name}</option>)}
          {actionsList.length === 0 && <option value="">-- No Actions available --</option>}
        </select>
      </div>

      {!selectedChannel ? (
        <Step1SelectChannel channels={channelsQuery.data ?? []} isLoading={channelsQuery.isLoading} onSelect={setSelectedChannel} />
      ) : isCreatingComposition ? (
        <CreateCompositionForm
          channelId={selectedChannel.id}
          definitions={definitions}
          onCancel={closeCompositionForm}
          onCreated={createTaskFromComposition}
        />
      ) : (
        <Step2SelectComposition
          channel={selectedChannel}
          compositions={compositionsQuery.data ?? []}
          isLoading={compositionsQuery.isLoading}
          onBack={() => setSelectedChannel(null)}
          onCreateNew={openCompositionForm}
          onSelect={createTaskFromComposition}
        />
      )}
    </div>
  );
}
