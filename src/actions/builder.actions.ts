import { phaseActions } from './phase.actions';
import { actionActions } from './action.actions';
import { nodeActions } from './node.actions';
import { taskCreateActions } from './task.create';
import { taskUpdateActions } from './task.update';
import { taskDeleteActions } from './task.delete';

export * from './phase.actions';
export * from './action.actions';
export * from './node.actions';
export * from './task.create';
export * from './task.update';
export * from './task.delete';

export const builderActions = {
  ...phaseActions,
  ...actionActions,
  ...taskCreateActions,
  ...taskUpdateActions,
  ...taskDeleteActions,
  ...nodeActions,
};
