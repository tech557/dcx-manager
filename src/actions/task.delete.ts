import { assertCanRunBuilderMutation } from './action.guards';
import { useBuilderStore } from '@/store/builderStore';
import { renumberTasks, mapActions } from './action.helpers';

export const taskDeleteActions = {
  deleteTask(taskId: string): void {
    assertCanRunBuilderMutation('deleteTask');
    useBuilderStore.getState().updateNodes((nodes) =>
      mapActions(nodes, (actions) =>
        actions.map((action) => ({
          ...action,
          tasks: renumberTasks(action.tasks.filter((task) => task.id !== taskId)),
        })),
      ),
    );
  },
};
