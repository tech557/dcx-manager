import { useState } from "react";
import { ActionCardData, TaskCardData } from "../../../../types";
import { useBuilderStore } from "../../../../store/builderStore";
import { calculateEndDate } from "../../utils/dateHelper";
import { createDefaultTask } from "../../../../utils/task.factory";

interface UseActionTasksProps {
  card: ActionCardData;
  tasksList: TaskCardData[];
  startDate: string;
  onEdit: (updatedCard: ActionCardData) => void;
  onUpdateNodesDirectly?: any;
  setIsExpanded: (expanded: boolean) => void;
}

export function useActionTasks({
  card,
  tasksList,
  startDate,
  onEdit,
  onUpdateNodesDirectly,
  setIsExpanded
}: UseActionTasksProps) {
  const [glowingTaskId, setGlowingTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const tasksTotal = tasksList.length;

  const handleAddTask = () => {
    useBuilderStore.getState().clearSelection();
    const newTask = createDefaultTask({
      name: `New Delivery Task ${tasksTotal + 1}`
    });
    
    setGlowingTaskId(newTask.id);
    setTimeout(() => {
      setGlowingTaskId(null);
    }, 1500);

    useBuilderStore.getState().setLastCreatedId(newTask.id);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("object-created", { detail: { id: newTask.id, type: "task" } }));
      }
    }, 50);
    
    useBuilderStore.getState().addTaskToAction(card.id, newTask);
    setIsExpanded(true);

    // Scroll down to this newly added task beautifully
    setTimeout(() => {
      // Try finding the task element by its specific ID or its favorite/minified ID
      const el = document.getElementById(newTask.id) || 
                 document.getElementById(`fav-${newTask.id}`) ||
                 document.getElementById(`small-task-${newTask.id}`);
                 
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }, 250);
  };

  const handleDropNewTaskToIndex = (insertIndex: number) => {
    const newTask = createDefaultTask({
      name: `New Delivery Task ${tasksTotal + 1}`
    });
    
    useBuilderStore.getState().setLastCreatedId(newTask.id);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("object-created", { detail: { id: newTask.id, type: "task" } }));
      }
    }, 50);
    
    useBuilderStore.getState().addTaskToAction(card.id, newTask, insertIndex);
    setIsExpanded(true);
  };

  const handleMoveTaskDirectly = (taskData: TaskCardData, sourceCardId: string, targetCardId: string, insertIndex: number) => {
    if (onUpdateNodesDirectly) {
      onUpdateNodesDirectly((prevNodes: any[]) => {
        return prevNodes.map((pn) => {
          if (pn.type !== "phase") return pn;
          const currentCards = pn.data.actionCards || [];
          let changed = false;

          const updatedCards = currentCards.map((cardItem: any) => {
            let updatedTasks = cardItem.tasks || [];
            
            if (cardItem.id === sourceCardId) {
              updatedTasks = updatedTasks.filter((t: any) => t.id !== taskData.id);
              changed = true;
            }
            
            if (cardItem.id === targetCardId) {
              if (sourceCardId === targetCardId) {
                updatedTasks = updatedTasks.filter((t: any) => t.id !== taskData.id);
              }
              const copy = [...updatedTasks];
              if (insertIndex >= 0 && insertIndex <= copy.length) {
                copy.splice(insertIndex, 0, taskData);
              } else {
                copy.push(taskData);
              }
              updatedTasks = copy;
              changed = true;
            }

            if (cardItem.id === sourceCardId || cardItem.id === targetCardId) {
              return {
                ...cardItem,
                tasks: updatedTasks,
              };
            }
            return cardItem;
          });

          if (changed) {
            const start = updatedCards.length > 0
              ? updatedCards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, updatedCards[0].startDate)
              : pn.data.startDate;
            const end = updatedCards.length > 0
              ? updatedCards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, updatedCards[0].endDate)
              : pn.data.endDate;
            return {
              ...pn,
              data: {
                ...pn.data,
                actionCards: updatedCards,
                startDate: start,
                endDate: end
              }
            };
          }
          return pn;
        });
      });
    } else {
      let updatedTasks = [...tasksList];
      if (sourceCardId === targetCardId) {
        updatedTasks = updatedTasks.filter((t) => t.id !== taskData.id);
      }
      if (insertIndex >= 0 && insertIndex <= updatedTasks.length) {
        updatedTasks.splice(insertIndex, 0, taskData);
      } else {
        updatedTasks.push(taskData);
      }
      onEdit({
        ...card,
        tasks: updatedTasks,
      });
    }
    setIsExpanded(true);
  };

  const handleEditTask = (updatedTask: TaskCardData) => {
    const updatedTasks = tasksList.map(t => t.id === updatedTask.id ? updatedTask : t);
    onEdit({ ...card, tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasksList.filter(t => t.id !== taskId);
    const calculatedEnd = calculateEndDate(startDate, Math.max(1, updatedTasks.length));
    onEdit({
      ...card,
      tasks: updatedTasks,
      endDate: calculatedEnd
    });
  };

  const handleDuplicateTask = (taskToDuplicate: TaskCardData) => {
    const duplicated: TaskCardData = createDefaultTask({
      ...taskToDuplicate,
      name: `${taskToDuplicate.name} (Copy)`
    });
    
    useBuilderStore.getState().setLastCreatedId(duplicated.id);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("object-created", { detail: { id: duplicated.id, type: "task" } }));
      }
    }, 50);
    
    const updatedTasks = [...tasksList, duplicated];
    const calculatedEnd = calculateEndDate(startDate, updatedTasks.length);
    onEdit({
      ...card,
      tasks: updatedTasks,
      endDate: calculatedEnd
    });
  };

  return {
    glowingTaskId,
    dragOverTaskId,
    setDragOverTaskId,
    handleAddTask,
    handleDropNewTaskToIndex,
    handleMoveTaskDirectly,
    handleEditTask,
    handleDeleteTask,
    handleDuplicateTask
  };
}
