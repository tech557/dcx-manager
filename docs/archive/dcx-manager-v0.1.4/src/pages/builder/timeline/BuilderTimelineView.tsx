import React, { useState } from "react";
import { EnrichedVersion, TaskCardData } from "../../../types";
import { FocusIsland } from "../islands/FocusIsland/FocusIsland";
import { EditorIsland } from "../islands/EditorIsland/EditorIsland";
import { TimelineView } from "./TimelineView";
import { useBuilder } from "../context/BuilderContext";
import { useBuilderStore } from "../../../store/builderStore";
import { createDefaultTask } from "../../../utils/task.factory";

interface BuilderTimelineViewProps {
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddPhase: (index?: number) => void;
  currentVersion: EnrichedVersion;
  viewMode?: "weekly" | "monthly";
  weeksCount?: number;
  activeWeek?: number;
  onActiveWeekChange?: (week: number) => void;
}

export function BuilderTimelineView({
nodes,
  setNodes,
  handleAddPhase,
  currentVersion,
  viewMode = "weekly",
  weeksCount = 4,
  activeWeek = 1,
  onActiveWeekChange,
}: BuilderTimelineViewProps) {
  const { selectedIds, selectIds } = useBuilder();
  const focusedColumnId = useBuilderStore((s) => s.focusedColumnId);
  const setFocusedColumnId = useBuilderStore((s) => s.setFocusedColumnId);
  
  // Extract active phase nodes
  const phases = nodes.filter((n) => n.type === "phase");

  // Expanded editor state using Zustand store
  const editingTask = useBuilderStore((s) => s.editingTask);
  const setEditingTask = useBuilderStore((s) => s.setEditingTask);
  const [activePanel, setActivePanel] = useState<"none" | "locate" | "filter">("none");
  const [activeFilterIcon, setActiveFilterIcon] = useState<string | null>(null);

  React.useEffect(() => {
    const handleBulkDrop = (e: Event) => {
      const { type, id, targetWeek, targetDay } = (e as CustomEvent).detail;
      
      setNodes((prevNodes) => {
        let isMultiSelectMove = false;
        if (type === "task") {
          isMultiSelectMove = selectedIds.has(id);
        }

        return prevNodes.map((node) => {
          if (node.type !== "phase") return node;

          const isTargetPhase = type === "phase" && node.id === id;

          const updatedActionCards = (node.data.actionCards || []).map((card: any) => {
            const isTargetAction = type === "action" && card.id === id;

            let updatedTasks = card.tasks || [];
            let changed = false;

            updatedTasks = updatedTasks.map((t: any) => {
              const shouldUpdateThisTask = 
                isTargetPhase || 
                isTargetAction || 
                (type === "task" && t.id === id) ||
                (type === "task" && isMultiSelectMove && selectedIds.has(t.id));

              if (shouldUpdateThisTask) {
                changed = true;
                return {
                  ...t,
                  date: {
                    mode: "linked",
                    weekOffset: targetWeek,
                    dayOffset: targetDay
                  }
                };
              }
              return t;
            });

            if (changed) {
              return {
                ...card,
                tasks: updatedTasks,
              };
            }
            return card;
          });

          const anyCardChanged = (node.data.actionCards || []).some((c: any, idx: number) => c !== updatedActionCards[idx]);
          
          if (anyCardChanged) {
            return {
              ...node,
              data: {
                ...node.data,
                actionCards: updatedActionCards,
              }
            };
          }
          return node;
        });
      });
    };

    window.addEventListener("timeline-bulk-drop", handleBulkDrop);
    return () => {
      window.removeEventListener("timeline-bulk-drop", handleBulkDrop);
    };
  }, [setNodes, selectedIds]);

  const handleUpdateTask = (phaseId: string, actionCardId: string, taskId: string, updatedTask: TaskCardData) => {
    const isMultiSelectMove = selectedIds.has(taskId);

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const updatedActionCards = (node.data.actionCards || []).map((card: any) => {
          let updatedTasks = card.tasks || [];
          let changed = false;

          if (isMultiSelectMove) {
            updatedTasks = updatedTasks.map((t: any) => {
              if (t.id === taskId) {
                changed = true;
                return { ...t, ...updatedTask };
              } else if (selectedIds.has(t.id)) {
                changed = true;
                return {
                  ...t,
                  date: updatedTask.date,
                };
              }
              return t;
            });
          } else {
            if (node.id === phaseId && card.id === actionCardId) {
              updatedTasks = updatedTasks.map((t: any) => {
                if (t.id === taskId) {
                  changed = true;
                  return { ...t, ...updatedTask };
                }
                return t;
              });
            }
          }

          if (changed) {
            return {
              ...card,
              tasks: updatedTasks,
            };
          }
          return card;
        });

        const anyCardChanged = (node.data.actionCards || []).some((c: any, idx: number) => c !== updatedActionCards[idx]);
        
        if (anyCardChanged) {
          return {
            ...node,
            data: {
              ...node.data,
              actionCards: updatedActionCards,
            }
          };
        }
        return node;
      })
    );
  };

  const handleDeleteTask = (phaseId: string, actionCardId: string, taskId: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === phaseId) {
          const updatedActionCards = (node.data.actionCards || []).map((card: any) => {
            if (card.id === actionCardId) {
              const updatedTasks = (card.tasks || []).filter((t: any) => t.id !== taskId);
              return {
                ...card,
                tasks: updatedTasks,
              };
            }
            return card;
          });
          return {
            ...node,
            data: {
              ...node.data,
              actionCards: updatedActionCards,
            }
          };
        }
        return node;
      })
    );
  };

  const handleDuplicateTask = (phaseId: string, actionCardId: string, taskToDuplicate: TaskCardData) => {
    const duplicatedTask = createDefaultTask({
      ...taskToDuplicate,
      name: `${taskToDuplicate.name} copy`,
    });

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === phaseId) {
          const updatedActionCards = (node.data.actionCards || []).map((card: any) => {
            if (card.id === actionCardId) {
              const currentTasks = card.tasks || [];
              const targetIdx = currentTasks.findIndex((t: any) => t.id === taskToDuplicate.id);
              const updatedTasks = [...currentTasks];
              if (targetIdx !== -1) {
                updatedTasks.splice(targetIdx + 1, 0, duplicatedTask);
              } else {
                updatedTasks.push(duplicatedTask);
              }
              return {
                ...card,
                tasks: updatedTasks,
              };
            }
            return card;
          });
          return {
            ...node,
            data: {
              ...node.data,
              actionCards: updatedActionCards,
            }
          };
        }
        return node;
      })
    );
  };

  return (
    <div id="builder-timeline-root" className="absolute inset-0 pt-[112px] pb-[96px] px-4 sm:px-8 z-10 flex flex-col overflow-hidden">
      
      {/* 3-column Layout mimicking Kanban view */}
      <div className="flex-grow flex-1 w-full relative overflow-hidden min-h-0 z-10">
        
        {/* A. Left Floating Area: Editor Island panel */}
        <div id="builder-left-island" className="absolute left-0 top-0 z-50 transition-all duration-300 pointer-events-none">
          <div className="pointer-events-auto">
            <EditorIsland
              editingTaskInfo={editingTask}
              onCancel={() => setEditingTask(null)}
              onSave={(updatedTask, phaseId, actionCardId) => {
                handleUpdateTask(phaseId, actionCardId, updatedTask.id, updatedTask);
                setEditingTask(null);
                selectIds([]);
              }}
              currentVersion={currentVersion}
            />
          </div>
        </div>

        {/* B. Center Scrolling Area: Custom timeline rows */}
        <div className={`w-full h-full relative z-10 transition-all duration-300 ${
          editingTask ? "pl-[390px]" : "pl-0"
        } ${
          activePanel !== "none" ? "pr-[390px]" : "pr-0"
        }`}>
          <div className="w-full h-full max-w-[1440px] mx-auto flex items-center justify-center">
            <TimelineView
              phases={phases}
              setNodes={setNodes}
              currentVersion={currentVersion}
              viewMode={viewMode}
              weeksCount={weeksCount}
              activeWeekIndex={activeWeek}
              handleAddPhase={handleAddPhase}
              onStartEditTask={(task, phaseId, actionCardId) => {
                selectIds([task.id]);
                setEditingTask({ task, phaseId, actionCardId });
              }}
              onEditTask={(phaseId, actionCardId, updatedTask) => {
                handleUpdateTask(phaseId, actionCardId, updatedTask.id, updatedTask);
              }}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              onActiveWeekChange={onActiveWeekChange}
            />
          </div>
        </div>

        {/* C. Right Floating Area: Focus Island panel */}
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
