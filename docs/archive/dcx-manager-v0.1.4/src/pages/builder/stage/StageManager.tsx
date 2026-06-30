import React, { useState } from "react";
import { EnrichedVersion } from "../../../types";
import { useBuilder } from "../context/BuilderContext";
import { useKeyboardInteractions } from "../hooks/useKeyboardInteractions";
import { useBuilderStore } from "../../../store/builderStore";
import { createDefaultTask } from "../../../utils/task.factory";
import { SelectionIsland } from "../islands/SelectionIsland/SelectionIsland";
import { ViewHelperIsland } from "../islands/ViewHelperIsland/ViewHelperIsland";
import { CreatorIsland } from "../islands/CreatorIsland/CreatorIsland";
import { TimelineBuilderIsland } from "../islands/TimelineBuilderIsland/TimelineBuilderIsland";
import { BuilderHeader } from "./BuilderHeader";
import { KanbanStage } from "./KanbanStage";
import { TimelineStage } from "./TimelineStage";

export type ViewMode = "kanban" | "timeline";

interface StageManagerProps {
  currentVersion: EnrichedVersion;
  toggleTheme: () => void;
  onClose: () => void;
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddPhase: (insertIndex?: number) => void;
  handleDragAddAction: (targetPhaseId: string) => void;
  handleMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
}

export function StageManager({
currentVersion,
  toggleTheme,
  onClose,
  nodes,
  setNodes,
  handleAddPhase,
  handleDragAddAction,
  handleMoveCardDirectly,
  saveStatus,
}: StageManagerProps) {
  const { clearSelection } = useBuilder();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [timelineViewMode, setTimelineViewMode] = useState<"weekly" | "monthly">("weekly");
  const [timelineWeeksCount, setTimelineWeeksCount] = useState<number>(4);
  const [timelineActiveWeek, setTimelineActiveWeek] = useState<number>(1);

  useKeyboardInteractions(nodes, setNodes);

  React.useEffect(() => {
    clearSelection();
  }, [viewMode, clearSelection]);

  const handleAddTaskToAction = (targetActionId?: string) => {
    if (!targetActionId) return;

    clearSelection();

    let totalTasks = 0;
    const parentNode = nodes.find((node) =>
      node.type === "phase" &&
      node.data.actionCards &&
      node.data.actionCards.some((card: any) => card.id === targetActionId)
    );

    if (parentNode) {
      const targetCard = parentNode.data.actionCards.find((card: any) => card.id === targetActionId);
      if (targetCard) {
        totalTasks = targetCard.tasks ? targetCard.tasks.length : 0;
      }
    }

    const newTask = createDefaultTask({
      name: `New Delivery Task ${totalTasks + 1}`,
    });

    useBuilderStore.getState().setLastCreatedId(newTask.id);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("object-created", { detail: { id: newTask.id, type: "task" } }));
      }
    }, 50);

    useBuilderStore.getState().addTaskToAction(targetActionId, newTask);

    setTimeout(() => {
      const el = document.getElementById(newTask.id) ||
        document.getElementById(`small-task-${newTask.id}`) ||
        document.getElementById(`fav-${newTask.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }, 250);
  };

  return (
    <>
      <BuilderHeader
        currentVersion={currentVersion}
        toggleTheme={toggleTheme}
        onClose={onClose}
        saveStatus={saveStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="absolute sm:bottom-4 sm:left-10 bottom-24 left-6 z-40 pointer-events-auto shrink-0 transition-all duration-500">
        <SelectionIsland nodes={nodes} setNodes={setNodes} viewMode={viewMode} />
      </div>

      <div className="absolute sm:bottom-4 sm:right-10 bottom-24 right-6 z-[300] pointer-events-auto shrink-0 transition-all duration-500">
        <ViewHelperIsland nodes={nodes} setNodes={setNodes} viewMode={viewMode} />
      </div>

      <div className="absolute bottom-6 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 pointer-events-none w-max max-w-[90vw]">
        <div className="pointer-events-auto shrink-0">
          {viewMode === "kanban" ? (
            <CreatorIsland
              onAddPhase={handleAddPhase}
              onAddAction={(targetPhaseId) => {
                if (targetPhaseId) {
                  handleDragAddAction(targetPhaseId);
                }
              }}
              onAddTask={handleAddTaskToAction}
              hasPhases={nodes.some((node) => node.type === "phase")}
              hasActions={nodes.some((node) => node.type === "phase" && node.data.actionCards && node.data.actionCards.length > 0)}
              nodes={nodes}
            />
          ) : (
            <TimelineBuilderIsland
              onAddWeek={() => setTimelineWeeksCount((count) => count + 1)}
              viewMode={timelineViewMode}
              onViewModeChange={setTimelineViewMode}
              activeWeek={timelineActiveWeek}
              onActiveWeekChange={setTimelineActiveWeek}
              totalWeeks={timelineWeeksCount}
            />
          )}
        </div>
      </div>

      <main className="w-full h-full relative z-10">
        {viewMode === "kanban" ? (
          <KanbanStage
            nodes={nodes}
            setNodes={setNodes}
            handleAddPhase={handleAddPhase}
            handleDragAddAction={handleDragAddAction}
            handleMoveCardDirectly={handleMoveCardDirectly}
            currentVersion={currentVersion}
          />
        ) : (
          <TimelineStage
            nodes={nodes}
            setNodes={setNodes}
            handleAddPhase={handleAddPhase}
            currentVersion={currentVersion}
            timelineViewMode={timelineViewMode}
            timelineWeeksCount={timelineWeeksCount}
            timelineActiveWeek={timelineActiveWeek}
            setTimelineActiveWeek={setTimelineActiveWeek}
          />
        )}
      </main>
    </>
  );
}
