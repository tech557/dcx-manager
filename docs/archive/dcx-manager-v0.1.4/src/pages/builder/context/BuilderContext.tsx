import React, { createContext, useContext, useCallback } from "react";
import { ActionCardData, TaskCardData } from "../../../types";
import { useBuilderStore, ClipboardPayload } from "../../../store/builderStore";
import { createDefaultTask } from "../../../utils/task.factory";
import { generateId } from "../../../utils/id.helpers";

interface BuilderContextType {
  // Selection state
  selectedIds: Set<string>;
  toggleSelection: (id: string, isMulti?: boolean) => void;
  selectIds: (ids: string[]) => void;
  clearSelection: () => void;

  // Clipboard (Copy/Paste) state
  clipboard: ClipboardPayload | null;
  copySelection: (nodes: any[]) => void;
  pasteClipboard: (
    targetPhaseId: string,
    targetActionId: string | null
  ) => void;

  // Delete Selection
  deleteSelected: () => void;

  // Global Dragging state
  draggingType: string | null;
  setDraggingType: (type: string | null) => void;

  // Unified callback handlers for Phase and Action cards
  onStartEditTask: (task: any, phaseId: string, actionCardId: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

interface BuilderProviderProps {
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  children: React.ReactNode;
}

export function BuilderProvider({ 
  nodes, 
  setNodes, 
  children 
}: BuilderProviderProps) {
  const selectedIds = useBuilderStore((s) => s.selectedIds);
  const toggleSelection = useBuilderStore((s) => s.toggleSelection);
  const selectIds = useBuilderStore((s) => s.selectIds);
  const clearSelection = useBuilderStore((s) => s.clearSelection);

  const clipboard = useBuilderStore((s) => s.clipboard);
  const setClipboard = useBuilderStore((s) => s.setClipboard);

  const draggingType = useBuilderStore((s) => s.draggingType);
  const setDraggingType = useBuilderStore((s) => s.setDraggingType);

  // Copy selected cards / tasks logic
  const copySelection = useCallback((nodes: any[]) => {
    if (selectedIds.size === 0) return;

    // Find if the selections contain Tasks or Action cards
    const firstSelectedId = Array.from(selectedIds)[0];
    let foundTask: TaskCardData | null = null;
    let foundAction: ActionCardData | null = null;

    for (const node of nodes) {
      if (node.type !== "phase") continue;
      const cards: ActionCardData[] = node.data.actionCards || [];
      for (const card of cards) {
        if (card.id === firstSelectedId) {
          foundAction = card;
          break;
        }
        const tasks = card.tasks || [];
        const task = tasks.find((t) => t.id === firstSelectedId);
        if (task) {
          foundTask = task;
          break;
        }
      }
      if (foundAction || foundTask) break;
    }

    if (foundTask) {
      // Copy multiple tasks if more than one selected
      const copiedTasks: TaskCardData[] = [];
      selectedIds.forEach((sid) => {
        for (const n of nodes) {
          if (n.type !== "phase") continue;
          for (const card of (n.data.actionCards || [])) {
            const match = (card.tasks || []).find((t) => t.id === sid);
            if (match) copiedTasks.push(match);
          }
        }
      });
      setClipboard({ type: "task", data: copiedTasks });
    } else if (foundAction) {
      // Copy multiple actions if more than one selected
      const copiedActions: ActionCardData[] = [];
      selectedIds.forEach((sid) => {
        for (const n of nodes) {
          if (n.type !== "phase") continue;
          const match = (n.data.actionCards || []).find((c: any) => c.id === sid);
          if (match) copiedActions.push(match);
        }
      });
      setClipboard({ type: "action", data: copiedActions });
    }
  }, [selectedIds, setClipboard]);

  // Paste Logic
  const pasteClipboard = useCallback((
    targetPhaseId: string,
    targetActionId: string | null
  ) => {
    if (!clipboard) return;

    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((n) => {
        if (n.type !== "phase") return n;

        // Paste Task into Action Card
        if (clipboard.type === "task" && targetActionId) {
          const actionCards: ActionCardData[] = (n.data.actionCards || []).map((card) => {
            if (card.id === targetActionId) {
              const pastedTasks = clipboard.data.map((t: TaskCardData) => createDefaultTask({
                ...t,
                name: `${t.name} (Copy)`
              }));
              const updatedTasks = [...(card.tasks || []), ...pastedTasks];
              return {
                ...card,
                tasks: updatedTasks
              };
            }
            return card;
          });

          return {
            ...n,
            data: {
              ...n.data,
              actionCards
            }
          };
        }

        // Paste Action into Stage Column
        if (clipboard.type === "action" && n.id === targetPhaseId) {
          const pastedActions = clipboard.data.map((act: ActionCardData) => ({
            ...act,
            id: generateId(),
            name: `${act.name} (Copy)`,
            tasks: (act.tasks || []).map((t) => createDefaultTask({
              ...t
            }))
          }));

          const updatedActions = [...(n.data.actionCards || []), ...pastedActions];
          const start = updatedActions.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, updatedActions[0]?.startDate || n.data.startDate);
          const end = updatedActions.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, updatedActions[0]?.endDate || n.data.endDate);

          return {
            ...n,
            data: {
              ...n.data,
              actionCards: updatedActions,
              startDate: start,
              endDate: end
            }
          };
        }

        return n;
      });

      return updatedNodes;
    });
  }, [clipboard, setNodes]);

  // Bulk Delete Selection
  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;

    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter((n) => {
        // If a phase was selected, remove the node entirely!
        if (n.type === "phase" && selectedIds.has(n.id)) {
          return false;
        }
        return true;
      }).map((n) => {
        if (n.type !== "phase") return n;

        // For Action Cards deletion, filter from actionCards array
        let actionCards: ActionCardData[] = (n.data.actionCards || []).filter((c) => !selectedIds.has(c.id));

        // For sub-tasks deletion, filter inside action cards
        actionCards = actionCards.map((card) => {
          const filteredTasks = (card.tasks || []).filter((t) => !selectedIds.has(t.id));
          return {
            ...card,
            tasks: filteredTasks
          };
        });

        const start = actionCards.length > 0 
          ? actionCards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, actionCards[0].startDate) 
          : n.data.startDate;
        const end = actionCards.length > 0 
          ? actionCards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, actionCards[0].endDate) 
          : n.data.endDate;

        return {
          ...n,
          data: {
            ...n.data,
            actionCards,
            startDate: start,
            endDate: end
          }
        };
      });

      return updatedNodes;
    });
    // Set selected ids to empty
    useBuilderStore.getState().selectIds([]);
  }, [selectedIds, setNodes]);

  const onStartEditTask = useCallback((task: any, phaseId: string, actionCardId: string) => {
    useBuilderStore.getState().setEditingTask({ task, phaseId, actionCardId });
    useBuilderStore.getState().setEditingTaskId(task.id);
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        selectedIds,
        toggleSelection,
        selectIds,
        clearSelection,
        clipboard,
        copySelection,
        pasteClipboard,
        deleteSelected,
        draggingType,
        setDraggingType,
        onStartEditTask,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
