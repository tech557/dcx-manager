import type { TaskCardData } from '@/types/builder-node.types';

export function useTaskSectionReadiness(
  activeNode: { kind: string } | null,
  taskDraft: TaskCardData | null,
) {
  const infoPassed = !!(
    activeNode?.kind === 'task' &&
    taskDraft &&
    taskDraft.name &&
    taskDraft.name.trim().length > 0 &&
    taskDraft.message &&
    taskDraft.message.trim().length > 0 &&
    taskDraft.date &&
    taskDraft.date.mode !== 'unset' &&
    taskDraft.channelId &&
    taskDraft.channelId.trim().length > 0 &&
    taskDraft.senderId &&
    taskDraft.senderId.trim().length > 0 &&
    taskDraft.receiverId &&
    taskDraft.receiverId.trim().length > 0
  );

  const specsPassed = !!(
    activeNode?.kind === 'task' &&
    taskDraft &&
    taskDraft.specsState?.status !== 'empty' &&
    taskDraft.missingDataState?.status !== 'empty'
  );

  const subtasksPassed = !!(
    activeNode?.kind === 'task' &&
    taskDraft &&
    taskDraft.subtasks &&
    taskDraft.subtasks.length > 0 &&
    !taskDraft.subtasks.some(
      (st) => st.estimatedMinutes === null || st.estimatedMinutes === undefined || st.estimatedMinutes <= 0
    )
  );

  const subtaskCount = taskDraft?.subtasks?.length || 0;

  return { infoPassed, specsPassed, subtasksPassed, subtaskCount };
}
