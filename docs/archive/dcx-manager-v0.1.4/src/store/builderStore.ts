import React from "react";
import { create } from "zustand";
import { EnrichedVersion, TaskCardData } from "../types";
import { calculateEndDate } from "../pages/builder/utils/dateHelper";

export interface ClipboardPayload {
  type: "action" | "task";
  data: any[];
}

export interface EditingTaskInfo {
  task: TaskCardData;
  phaseId: string;
  actionCardId: string;
}

export interface BuilderState {
  // Active Version
  activeVersion: EnrichedVersion | null;
  setActiveVersion: (version: EnrichedVersion | null) => void;

  // React state synchronization for nodes
  reactSetNodes: React.Dispatch<React.SetStateAction<any[]>> | null;
  setReactSetNodes: (fn: React.Dispatch<React.SetStateAction<any[]>> | null) => void;

  // State mutation actions
  addTaskToAction: (actionId: string, task: TaskCardData, insertIndex?: number) => void;

  // Selection State
  selectedIds: Set<string>;
  toggleSelection: (id: string, isMulti?: boolean) => void;
  selectIds: (ids: string[]) => void;
  clearSelection: () => void;

  // Clipboard State
  clipboard: ClipboardPayload | null;
  setClipboard: (clipboard: ClipboardPayload | null) => void;

  // Global Dragging state
  draggingType: string | null;
  setDraggingType: (type: string | null) => void;

  // Active Focus Filters (State stage alignment)
  activeFilterIcon: string | null;
  setActiveFilterIcon: (icon: string | null) => void;
  focusedColumnId: string | null;
  setFocusedColumnId: (id: string | null) => void;

  // Task Editor state
  editingTask: EditingTaskInfo | null;
  setEditingTask: (editingTask: EditingTaskInfo | null) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;

  // Highlight Coordination
  lastCreatedId: string | null;
  setLastCreatedId: (id: string | null) => void;
  anyHighlightActive: boolean;
  setAnyHighlightActive: (active: boolean) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  activeVersion: null,
  setActiveVersion: (version) => set({ activeVersion: version }),

  reactSetNodes: null,
  setReactSetNodes: (reactSetNodes) => set({ reactSetNodes }),

  addTaskToAction: (actionId, task, insertIndex) => {
    const { reactSetNodes } = get();
    if (!reactSetNodes) return;

    reactSetNodes((prevNodes) => {
      return prevNodes.map((pn) => {
        if (pn.type !== "phase") return pn;

        const actionCards = pn.data.actionCards || [];
        const hasAction = actionCards.some((c: any) => c.id === actionId);

        if (hasAction) {
          const updatedCards = actionCards.map((c: any) => {
            if (c.id === actionId) {
              const updatedTasks = [...(c.tasks || [])];
              if (typeof insertIndex === "number" && insertIndex >= 0 && insertIndex <= updatedTasks.length) {
                updatedTasks.splice(insertIndex, 0, task);
              } else {
                updatedTasks.push(task);
              }
              const calculatedEnd = calculateEndDate(c.startDate, updatedTasks.length);
              return {
                ...c,
                tasks: updatedTasks,
                endDate: calculatedEnd,
              };
            }
            return c;
          });

          const start = updatedCards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, updatedCards[0]?.startDate || pn.data.startDate);
          const end = updatedCards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, updatedCards[0]?.endDate || pn.data.endDate);

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
  },

  selectedIds: new Set<string>(),
  toggleSelection: (id, isMulti = false) =>
    set((state) => {
      const next = new Set<string>(isMulti ? state.selectedIds : []);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),
  selectIds: (ids) => set({ selectedIds: new Set<string>(ids) }),
  clearSelection: () => set({ selectedIds: new Set<string>(), focusedColumnId: null }),

  clipboard: null,
  setClipboard: (clipboard) => set({ clipboard }),

  draggingType: null,
  setDraggingType: (draggingType) => set({ draggingType }),

  activeFilterIcon: null,
  setActiveFilterIcon: (activeFilterIcon) => set({ activeFilterIcon }),
  focusedColumnId: null,
  setFocusedColumnId: (focusedColumnId) => set({ focusedColumnId }),

  editingTask: null,
  setEditingTask: (editingTask) => set({ editingTask }),
  editingTaskId: null,
  setEditingTaskId: (editingTaskId) => set({ editingTaskId }),
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),

  lastCreatedId: null,
  setLastCreatedId: (lastCreatedId) => set({ lastCreatedId }),
  anyHighlightActive: false,
  setAnyHighlightActive: (anyHighlightActive) => set({ anyHighlightActive }),
}));
