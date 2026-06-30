import React, { useState } from "react";
import { EnrichedVersion, TaskCardData } from "../../../types";
import { FocusIsland } from "../islands/FocusIsland/FocusIsland";
import { EditorIsland } from "../islands/EditorIsland/EditorIsland";
import { HorizontalBoard } from "./HorizontalBoard";
import { useBuilder } from "../context/BuilderContext";
import { useBuilderStore } from "../../../store/builderStore";
import { generateId } from "../../../utils/id.helpers";
import { createDefaultTask } from "../../../utils/task.factory";

interface BuilderKanbanViewProps {
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddPhase: (index?: number) => void;
  onAddDragAction: (targetPhaseId: string) => void;
  onMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string) => void;
  currentVersion: EnrichedVersion;
}

export function BuilderKanbanView({
nodes,
  setNodes,
  handleAddPhase,
  onAddDragAction,
  onMoveCardDirectly,
  currentVersion
}: BuilderKanbanViewProps) {
  const { selectedIds, selectIds } = useBuilder();
  const focusedColumnId = useBuilderStore((s) => s.focusedColumnId);
  const setFocusedColumnId = useBuilderStore((s) => s.setFocusedColumnId);
  // Extract phase column nodes
  const phases = nodes.filter((n) => n.type === "phase");

  // State to track if a new phase drag is over the workspace
  const [isDragOverWorkspace, setIsDragOverWorkspace] = useState(false);

  // Determine if all phases are empty or how many cards are in the tallest phase
  const maxActionsCount = Math.max(...phases.map((p) => (p.data.actionCards || []).length), 0);

  // Decide alignment mode: empty state centering vs active staging Top-Alignment "start from the same top".
  const scrollerAlignClass = maxActionsCount === 0 ? "items-center" : "items-start";

  // Dynamically compute the top spacing as columns grow, so they "keep moving up when any column grow".
  // This offsets the baseline upwards so the columns stay beautiful and never reach the structural islands.
  let dynamicTopPadding = "0px";
  if (maxActionsCount === 1) {
    dynamicTopPadding = "10vh";
  } else if (maxActionsCount === 2) {
    dynamicTopPadding = "7vh";
  } else if (maxActionsCount === 3) {
    dynamicTopPadding = "4vh";
  } else if (maxActionsCount >= 4) {
    dynamicTopPadding = "1.5vh";
  }

  // Expanded panel states using Zustand store
  const editingTask = useBuilderStore((s) => s.editingTask);
  const setEditingTask = useBuilderStore((s) => s.setEditingTask);
  const [activePanel, setActivePanel] = useState<"none" | "locate" | "filter">("none");

  // States for Focus Mode filtering and locating columns
  const [activeFilterIcon, setActiveFilterIcon] = useState<string | null>(null);

  // Fixed board zoom scale logic
  const zoomScale = 1.0;

  // State updates helper for phase nodes
  const updatePhaseField = (phaseId: string, updates: any) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === phaseId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates
            }
          };
        }
        return node;
      })
    );
  };

  const handleUpdateTask = (phaseId: string, actionCardId: string, taskId: string, updatedTask: TaskCardData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === phaseId) {
          const updatedActionCards = (node.data.actionCards || []).map((card: any) => {
            if (card.id === actionCardId) {
              const updatedTasks = (card.tasks || []).map((t: any) => t.id === taskId ? updatedTask : t);
              return {
                ...card,
                tasks: updatedTasks
              };
            }
            return card;
          });
          return {
            ...node,
            data: {
              ...node.data,
              actionCards: updatedActionCards
            }
          };
        }
        return node;
      })
    );
  };

  // Delete dynamic phase stage
  const deletePhase = (phaseId: string) => {
    setNodes((prev) => {
      const filtered = prev.filter((pn) => pn.id !== phaseId);
      let phaseCount = 0;
      return filtered.map((n) => {
        if (n.type === "phase") {
          const xPos = 100 + phaseCount * 380;
          phaseCount++;
          return {
            ...n,
            position: {
              ...n.position,
              x: xPos
            }
          };
        }
        return n;
      });
    });
  };

  // Duplicate existing phase stage and its action cards next to it
  const duplicatePhase = (phaseId: string) => {
    setNodes((prevNodes) => {
      const currentPhases = prevNodes.filter((n) => n.type === "phase");
      const targetIdx = currentPhases.findIndex((p) => p.id === phaseId);
      if (targetIdx === -1) return prevNodes;

      const sourcePhase = currentPhases[targetIdx];
      // Generate unique IDs for the duplicated action cards and their tasks to avoid duplicate keys/ids
      const duplicatedCards = (sourcePhase.data.actionCards || []).map((card: any) => ({
        ...card,
        id: generateId(),
        tasks: (card.tasks || []).map((t: any) => createDefaultTask({ ...t }))
      }));

      const newId = generateId();

      useBuilderStore.getState().setLastCreatedId(newId);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("object-created", { detail: { id: newId, type: "phase" } }));
        }
      }, 60);

      const duplicatedPhaseNode = {
        ...sourcePhase,
        id: newId,
        data: {
          ...sourcePhase.data,
          label: `${sourcePhase.data.label || "Phase"} Copy`,
          actionCards: duplicatedCards,
        },
      };

      const updatedPhases = [...currentPhases];
      updatedPhases.splice(targetIdx + 1, 0, duplicatedPhaseNode);

      const resultNodes: any[] = [];
      prevNodes.forEach((n) => {
        if (n.type !== "phase") {
          resultNodes.push(n);
        }
      });

      updatedPhases.forEach((p, idx) => {
        resultNodes.push({
          ...p,
          position: {
            ...p.position,
            x: 100 + idx * 380,
            y: 220
          }
        });
      });

      return resultNodes;
    });
  };

  // Build target list of all columns for the drop-down selector
  const allPhases = phases.map((p) => ({
    id: p.id,
    label: p.data.label || "Untitled Segment"
  }));

  return (
    <div id="builder-kanban-root" className="absolute inset-0 pt-28 pb-10 px-4 sm:px-8 z-10 flex flex-col overflow-hidden">
      
      {/* Main 3-column Workspace View (Left Island Preset, Centered zoomed-out Kanban flow, Right Island Focus Mode) */}
      <div className="flex-grow flex-1 w-full relative overflow-hidden min-h-0 z-10">
        
        {/* A. Left Container - Editor Island panel (Floating left layout) */}
        <div id="builder-left-island" className="absolute left-0 top-0 z-50 transition-all duration-300 pointer-events-none">
          <div className="pointer-events-auto">
            <EditorIsland
              editingTaskInfo={editingTask}
              onCancel={() => setEditingTask(null)}
              onSave={(updatedTask, phaseId, actionCardId) => {
                handleUpdateTask(phaseId, actionCardId, updatedTask.id, updatedTask);
                setEditingTask(null);
              }}
              currentVersion={currentVersion}
            />
          </div>
        </div>

        {/* B. Center Horizontal Board Scroller */}
        <div className="w-full h-full relative z-10">
          <HorizontalBoard
            phases={phases}
            allPhases={allPhases}
            isDragOverWorkspace={isDragOverWorkspace}
            setIsDragOverWorkspace={setIsDragOverWorkspace}
            scrollerAlignClass={scrollerAlignClass}
            dynamicTopPadding={dynamicTopPadding}
            maxActionsCount={maxActionsCount}
            editingTask={editingTask}
            zoomScale={zoomScale}
            activeFilterIcon={activeFilterIcon}
            focusedColumnId={focusedColumnId}
            updatePhaseField={updatePhaseField}
            deletePhase={deletePhase}
            duplicatePhase={duplicatePhase}
            onAddDragAction={onAddDragAction}
            onMoveCardDirectly={onMoveCardDirectly}
            setNodes={setNodes}
            handleAddPhase={handleAddPhase}
            onStartEditTask={(task, phaseId, actionCardId) => {
              if (useBuilderStore.getState().isDirty) {
                window.dispatchEvent(new CustomEvent("task-switch-blocked", {
                  detail: { task, phaseId, actionCardId }
                }));
                return;
              }
              selectIds([task.id]);
              setEditingTask({ task, phaseId, actionCardId });
            }}
            isLeftExpanded={!!editingTask}
            isRightExpanded={activePanel !== "none"}
          />
        </div>

        {/* C. Right Island - Focus Mode panels (Floating right layout) */}
        <div id="builder-right-island" className="absolute right-0 top-0 z-40 transition-all duration-300 pointer-events-none">
          <div className="pointer-events-auto">
            <FocusIsland 
              nodes={nodes} 
              currentVersion={currentVersion}
              activeFilterIcon={activeFilterIcon}
              setActiveFilterIcon={setActiveFilterIcon}
              focusedColumnId={focusedColumnId}
              setFocusedColumnId={setFocusedColumnId}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
