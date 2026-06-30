import React, { useState } from "react";
import { TaskCardData } from "../../../../types";
import { useBuilder } from "../../context/BuilderContext";
import { CollapsedDayCard } from "./CollapsedDayCard";
import { DayCardHeader } from "./DayCardHeader";
import { DayCardTasks } from "./DayCardTasks";
import { DayCardFooter } from "./DayCardFooter";
import { BuilderCardShell } from "../BuilderCardShell";
import { useTheme } from "../../../../hooks/useTheme";


interface DayGridCardProps {
  key?: number | string;
  phases?: any[];
  setNodes?: React.Dispatch<React.SetStateAction<any[]>>;
  dayLabel: string;
  dateString: string;
  isEnabled: boolean;
  isWeekend: boolean;
  isAnchorDay: boolean;
  tasks: TaskCardData[];
  onStartEditTask?: (task: TaskCardData) => void;
  onEditTask?: (phaseId: string, actionCardId: string, updatedTask: TaskCardData) => void;
  onDeleteTask?: (phaseId: string, actionCardId: string, taskId: string) => void;
  onDuplicateTask?: (phaseId: string, actionCardId: string, task: TaskCardData) => void;
  dayIndex: number;
  weekIndex: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  anchorDateStr?: string;
  isMonthly?: boolean;
}

export function DayGridCard({
dayLabel,
  dateString,
  isEnabled,
  isWeekend,
  isAnchorDay,
  tasks,
  onStartEditTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  dayIndex,
  weekIndex,
  isCollapsed,
  onToggleCollapse,
  anchorDateStr,
  isMonthly = false,
}: DayGridCardProps) {
  const { isDark } = useTheme();
  const { toggleSelection } = useBuilder();
  const [isDragOver, setIsDragOver] = useState(false);
  const dayCardId = `week-${weekIndex}`;

  const handleOpenAddTask = () => {
    window.dispatchEvent(
      new CustomEvent("open-viewhelper-create-task", {
        detail: {
          dateString,
          weekIndex,
          dayIndex,
          anchorDateStr,
        },
      })
    );
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    if (!isEnabled) return;
    const types = e.dataTransfer.types;
    if (
      types.includes("application/dcx-task-move") ||
      types.includes("application/dcx-task-add") ||
      types.includes("application/dcx-action-move") ||
      types.includes("application/dcx-phase-move")
    ) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isEnabled) return;

    try {
      const isTaskMove = e.dataTransfer.types.includes("application/dcx-task-move");
      const isActionMove = e.dataTransfer.types.includes("application/dcx-action-move");
      const isPhaseMove = e.dataTransfer.types.includes("application/dcx-phase-move");

      const baseDate = anchorDateStr || "2026-06-13";
      const baseD = new Date(baseDate);
      const baseDayOfWeek = isNaN(baseD.getTime()) ? 0 : baseD.getDay();

      let dayNum: number | null = 0;
      if (weekIndex === 1) {
        dayNum = dayIndex < baseDayOfWeek ? null : (dayIndex - baseDayOfWeek + 1);
      } else {
        dayNum = dayIndex + 1;
      }

      if (dayNum === null) {
        return;
      }

      const linkedStr = `Week ${weekIndex} - Day ${dayNum}`;

      if (isTaskMove) {
        const moveDataString = e.dataTransfer.getData("application/dcx-task-move");
        if (moveDataString) {
          const { task, sourceActionCardId } = JSON.parse(moveDataString);
          const taskPhaseId = task.phaseId || "";
          const taskActionCardId = task.actionCardId || sourceActionCardId || "";

          window.dispatchEvent(
            new CustomEvent("timeline-bulk-drop", {
              detail: {
                type: "task",
                id: task.id,
                task,
                phaseId: taskPhaseId,
                actionCardId: taskActionCardId,
                targetWeek: weekIndex,
                targetDay: dayNum,
              },
            })
          );
        }
      } else if (isActionMove) {
        const moveDataString = e.dataTransfer.getData("application/dcx-action-move");
        if (moveDataString) {
          const { actionCardId, phaseId } = JSON.parse(moveDataString);
          window.dispatchEvent(
            new CustomEvent("timeline-bulk-drop", {
              detail: {
                type: "action",
                id: actionCardId,
                phaseId,
                targetWeek: weekIndex,
                targetDay: dayNum,
              },
            })
          );
        }
      } else if (isPhaseMove) {
        const moveDataString = e.dataTransfer.getData("application/dcx-phase-move");
        if (moveDataString) {
          const { phaseId } = JSON.parse(moveDataString);
          window.dispatchEvent(
            new CustomEvent("timeline-bulk-drop", {
              detail: {
                type: "phase",
                id: phaseId,
                targetWeek: weekIndex,
                targetDay: dayNum,
              },
            })
          );
        }
      }
    } catch (err) {
      console.error("Error dropping task on DayGridCard:", err);
    }
  };

  if (isCollapsed) {
    return (
      <CollapsedDayCard
        dayLabel={dayLabel}
        dateString={dateString}
        isEnabled={isEnabled}
        isWeekend={isWeekend}
        isAnchorDay={isAnchorDay}
        tasksCount={tasks.length}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onToggleCollapse={onToggleCollapse}
        toggleSelection={toggleSelection}
      />
    );
  }

  return (
    <BuilderCardShell
      id={dayCardId}
      variant="day"
      isMonthly={isMonthly}
      isDragOver={isDragOver}
      onDoubleClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("input")) return;
        onToggleCollapse();
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("input") || target.closest("[id^='task-']")) return;
        
        e.stopPropagation();
        toggleSelection(dayCardId, e.ctrlKey || e.metaKey);
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`pointer-events-auto group ${
        isMonthly 
          ? "w-full min-w-0 max-w-none h-full p-2 rounded-[1.2rem]" 
          : "min-w-[170px] max-w-[240px] h-[460px] p-4 sm:p-5"
      } ${
        !isEnabled
          ? isDark
            ? "opacity-40 cursor-not-allowed"
            : "opacity-45 cursor-not-allowed"
          : ""
      }`}
    >
      {/* Striped patterns for locked weekends/gaps */}
      {!isEnabled && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,currentColor,currentColor_10px,transparent_10px,transparent_20px)]" />
      )}

      {/* 1. Header Column block */}
      <DayCardHeader
        dayIndex={dayIndex}
        dayLabel={dayLabel}
        isAnchorDay={isAnchorDay}
        dateString={dateString}
        isMonthly={isMonthly}
      />

      <div className={`h-px bg-current/5 shrink-0 ${isMonthly ? "mb-1.5" : "mb-4"}`} />

      {/* 2. Tasks list */}
      <DayCardTasks
        isEnabled={isEnabled}
        isWeekend={isWeekend}
        tasks={tasks}
        onStartEditTask={onStartEditTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onDuplicateTask={onDuplicateTask}
        onAddTaskClick={handleOpenAddTask}
        isMonthly={isMonthly}
      />

      {/* 3. Footer stats badge */}
      {isEnabled && (
        <DayCardFooter tasksCount={tasks.length} isMonthly={isMonthly} />
      )}
    </BuilderCardShell>
  );
}
