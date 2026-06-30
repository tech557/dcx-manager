import { useMemo, useState } from 'react';
import type { ApiChannel, ApiChannelComposition, ApiSubtaskDefinition } from '@/types/api';
import { generateSubtasksFromComposition } from '@/utils/composition.helpers';

export type TaskCreationStep = 'channel' | 'composition' | 'review';

export function useTaskCreationFlow() {
  const [step, setStep] = useState<TaskCreationStep>('channel');
  const [channel, setChannel] = useState<ApiChannel | null>(null);
  const [composition, setComposition] = useState<ApiChannelComposition | null>(null);

  function selectChannel(nextChannel: ApiChannel) {
    setChannel(nextChannel);
    setComposition(null);
    setStep('composition');
  }

  function selectComposition(nextComposition: ApiChannelComposition) {
    setComposition(nextComposition);
    setStep('review');
  }

  function backToChannels() {
    setComposition(null);
    setStep('channel');
  }

  function backToCompositions() {
    setStep('composition');
  }

  function useGeneratedSubtasks(definitions: ApiSubtaskDefinition[]) {
    return useMemo(() => {
      if (!composition) {
        return [];
      }
      return generateSubtasksFromComposition('preview-task', composition, definitions);
    // `composition` is captured from this parent hook; keep the nested hook shape until TaskCreationFlow is flattened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [composition, definitions]);
  }

  return {
    step,
    channel,
    composition,
    selectChannel,
    selectComposition,
    backToChannels,
    backToCompositions,
    useGeneratedSubtasks,
  };
}
