import React from "react";
import { EnrichedVersion, TaskCardData } from "../../../types";
import { WeeklyView } from "./WeeklyView";
import { MonthlyView } from "./MonthlyView";

interface TimelineViewProps {
  phases: any[];
  setNodes?: React.Dispatch<React.SetStateAction<any[]>>;
  currentVersion: EnrichedVersion;
  viewMode: "weekly" | "monthly";
  weeksCount: number;
  activeWeekIndex: number;
  onStartEditTask?: (task: any, phaseId: string, actionCardId: string) => void;
  handleAddPhase?: () => void;
  onEditTask?: (phaseId: string, actionCardId: string, updatedTask: TaskCardData) => void;
  onDeleteTask?: (phaseId: string, actionCardId: string, taskId: string) => void;
  onDuplicateTask?: (phaseId: string, actionCardId: string, task: TaskCardData) => void;
  onActiveWeekChange?: (week: number) => void;
}

export function TimelineView({
phases,
  setNodes,
  currentVersion,
  viewMode,
  weeksCount,
  activeWeekIndex,
  onStartEditTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onActiveWeekChange,
}: TimelineViewProps) {
  // Extract Campaign Anchor Communication Date
  const anchorDateStr = currentVersion.communicatedDate || new Date().toISOString().split("T")[0];

  // Flat list of all live tasks across the entire builder columns
  const allTasks: TaskCardData[] = [];
  phases.forEach((phaseNode) => {
    const parentPhaseId = phaseNode.id;
    const actionCards = phaseNode.data.actionCards || [];

    actionCards.forEach((card: any) => {
      const parentActionCardId = card.id;
      const tasksList = card.tasks || [];

      tasksList.forEach((task: TaskCardData) => {
        // Enforce phaseId and actionCardId helpers for editing integration
        const decoratedTask = {
          ...task,
          phaseId: parentPhaseId,
          actionCardId: parentActionCardId,
        };
        allTasks.push(decoratedTask);
      });
    });
  });

  const handleTaskClick = (task: TaskCardData) => {
    if (onStartEditTask) {
      // Direct pass triggers to open the EditorIsland sidebar
      const phaseId = (task as any).phaseId || "";
      const actionCardId = (task as any).actionCardId || "";
      onStartEditTask(task, phaseId, actionCardId);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center select-none overflow-visible">
      {/* 1. Interactive Schedule Segment */}
      {viewMode === "weekly" ? (
        <WeeklyView
          phases={phases}
          setNodes={setNodes}
          anchorDateStr={anchorDateStr}
          activeWeekIndex={activeWeekIndex}
          totalWeeks={weeksCount}
          allTasks={allTasks}
          onStartEditTask={handleTaskClick}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onDuplicateTask={onDuplicateTask}
          onActiveWeekChange={onActiveWeekChange}
        />
      ) : (
        <div className="w-full h-full overflow-hidden px-1 select-none">
          <MonthlyView
            phases={phases}
            setNodes={setNodes}
            anchorDateStr={anchorDateStr}
            totalWeeks={weeksCount}
            activeWeekIndex={activeWeekIndex}
            allTasks={allTasks}
            onStartEditTask={handleTaskClick}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onDuplicateTask={onDuplicateTask}
          />
        </div>
      )}
    </div>
  );
}
