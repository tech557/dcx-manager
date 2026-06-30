import { useBuilderActions } from '@/actions/useBuilderActions';
import type { ApiTaskDate } from '@/types/api';
import { useChannelsQuery, useCompositionsQuery } from '@/queries/channels.queries';
import { useSubtaskDefinitionsQuery } from '@/queries/subtask-definitions.queries';
import { CreateCompositionForm } from './CreateCompositionForm';
import { Step1SelectChannel } from './Step1_SelectChannel';
import { Step2SelectComposition } from './Step2_SelectComposition';
import { Step3ReviewSubtasks } from './Step3_ReviewSubtasks';
import { useTaskCreationFlow } from './useTaskCreationFlow';
import { useToggle } from '@/hooks/useToggle';

interface TaskCreationFlowProps {
  actionId: string;
  actionName: string;
  date?: ApiTaskDate;
  onCancel: () => void;
  onCreated?: () => void;
}

export function TaskCreationFlow({ actionId, actionName, date, onCancel, onCreated }: TaskCreationFlowProps) {
  const builderActions = useBuilderActions();
  const flow = useTaskCreationFlow();
  const [isCreatingComposition, , openCompositionForm, closeCompositionForm] = useToggle();
  const channelsQuery = useChannelsQuery();
  const compositionsQuery = useCompositionsQuery(flow.channel?.id ?? '');
  const definitionsQuery = useSubtaskDefinitionsQuery(flow.channel?.id);
  const definitions = definitionsQuery.data ?? [];
  const generatedSubtasks = flow.useGeneratedSubtasks(definitions);

  function renderContent() {
    if (isCreatingComposition && flow.channel) {
      return (
        <CreateCompositionForm
          channelId={flow.channel.id}
          definitions={definitions}
          onCancel={closeCompositionForm}
          onCreated={(composition) => {
            closeCompositionForm();
            flow.selectComposition(composition);
          }}
        />
      );
    }

    if (flow.step === 'channel') {
      return <Step1SelectChannel channels={channelsQuery.data ?? []} isLoading={channelsQuery.isLoading} onSelect={flow.selectChannel} />;
    }

    if (flow.step === 'composition' && flow.channel) {
      return (
        <Step2SelectComposition
          channel={flow.channel}
          compositions={compositionsQuery.data ?? []}
          isLoading={compositionsQuery.isLoading}
          onBack={flow.backToChannels}
          onCreateNew={openCompositionForm}
          onSelect={flow.selectComposition}
        />
      );
    }

    if (flow.step === 'review' && flow.channel && flow.composition) {
      return (
        <Step3ReviewSubtasks
          channel={flow.channel}
          composition={flow.composition}
          subtasks={generatedSubtasks}
          onBack={flow.backToCompositions}
          onConfirm={handleConfirm}
        />
      );
    }

    return null;
  }

  function handleConfirm() {
    if (!flow.channel || !flow.composition) {
      return;
    }

    builderActions.createTask({
      actionId,
      actionName,
      channelId: flow.channel.id,
      channelLabel: flow.channel.label,
      compositionId: flow.composition.id,
      generatedSubtasks,
      date,
    });
    onCreated?.();
  }

  return (
    <div className="space-y-3">
      {renderContent()}
      <button type="button" className="text-xs text-neutral-300 hover:text-white" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
