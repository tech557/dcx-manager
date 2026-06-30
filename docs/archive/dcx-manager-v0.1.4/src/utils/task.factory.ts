import { Task, TaskDate } from "../types/domain";
import { generateId } from "./id.helpers";

export function createDefaultTask(overrides: Partial<Task> = {}): Task {
  const uniqId = generateId();
  const initialDate: TaskDate = overrides.date || { mode: "unset" };

  const { id, ...restOverrides } = overrides;

  return {
    id: uniqId,
    name: restOverrides.name !== undefined ? restOverrides.name : "New Delivery Task",
    channelId: restOverrides.channelId !== undefined ? restOverrides.channelId : "ch-1",
    message: restOverrides.message !== undefined ? restOverrides.message : "",
    senderId: restOverrides.senderId !== undefined ? restOverrides.senderId : "",
    receiverId: restOverrides.receiverId !== undefined ? restOverrides.receiverId : "",
    specsIdentifier: restOverrides.specsIdentifier !== undefined ? restOverrides.specsIdentifier : "",
    missingFields: restOverrides.missingFields !== undefined ? restOverrides.missingFields : [],
    subtasks: restOverrides.subtasks !== undefined ? restOverrides.subtasks : [],
    ...restOverrides,
    date: initialDate
  };
}
