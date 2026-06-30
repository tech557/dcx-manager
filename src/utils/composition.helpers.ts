import type { Subtask } from '@/types/domain';
import type { ApiChannelComposition, ApiSubtaskDefinition } from '@/types/api';
import { generateId } from './id.helpers';

export function deriveTaskName(actionName: string, channelLabel: string): string {
  return `${actionName.trim()} ${channelLabel.trim()}`.trim();
}

export function generateSubtasksFromComposition(
  taskId: string,
  composition: ApiChannelComposition,
  definitions: ApiSubtaskDefinition[],
): Subtask[] {
  const subtasks: Subtask[] = [];

  composition.definitionIds.forEach((definitionId) => {
    const definition = definitions.find((item) => item.id === definitionId);
    if (!definition) {
      return;
    }

    subtasks.push({
      id: generateId(),
      taskId,
      definitionId,
      label: definition.label,
      done: false,
      estimatedMinutes: definition.estimatedMinutes,
      orderIndex: subtasks.length,
      metadata: null,
      aiContext: null,
      sourceContext: null,
    });
  });

  return subtasks;
}
