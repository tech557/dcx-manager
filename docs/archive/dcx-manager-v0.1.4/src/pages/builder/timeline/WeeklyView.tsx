import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TaskCardData } from "../../../types";
import { getDaysForWeek, mapTaskToTimeline } from "../../../utils/date.helpers";
import { DayGridCard } from "../cards";

interface WeeklyViewProps {
  phases?: any[];
  setNodes?: React.Dispatch<React.SetStateAction<any[]>>;
  anchorDateStr: string;
  activeWeekIndex: number;
  totalWeeks: number;
  allTasks: TaskCardData[];
  onStartEditTask?: (task: TaskCardData) => void;
  onEditTask?: (phaseId: string, actionCardId: string, updatedTask: TaskCardData) => void;
  onDeleteTask?: (phaseId: string, actionCardId: string, taskId: string) => void;
  onDuplicateTask?: (phaseId: string, actionCardId: string, task: TaskCardData) => void;
  onActiveWeekChange?: (week: number) => void;
}

export function WeeklyView({
phases = [],
  setNodes,
  anchorDateStr,
  activeWeekIndex,
  totalWeeks,
  allTasks,
  onStartEditTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onActiveWeekChange,
}: WeeklyViewProps) {
  // Local record of collapsed day indices for this week
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({});

  // Slide translation direction: 1 for right-to-left (forward), -1 for left-to-right (backward)
  const [prevWeekIndex, setPrevWeekIndex] = useState(activeWeekIndex);
  const [direction, setDirection] = useState<number>(1);

  if (activeWeekIndex !== prevWeekIndex) {
    setDirection(activeWeekIndex > prevWeekIndex ? 1 : -1);
    setPrevWeekIndex(activeWeekIndex);
  }

  // Derive days list config for target active week
  const days = getDaysForWeek(activeWeekIndex, anchorDateStr);

  const handleToggleCollapse = (dayIndex: number) => {
    setCollapsedDays((prev) => {
      const isCurrentlyCollapsed = prev[dayIndex] !== undefined 
        ? prev[dayIndex] 
        : !(days.find(d => d.dayIndex === dayIndex)?.isEnabled ?? true);
      return {
        ...prev,
        [dayIndex]: !isCurrentlyCollapsed,
      };
    });
  };

  React.useEffect(() => {
    const handleExpandAll = () => {
      const next: Record<number, boolean> = {};
      days.forEach((d) => {
        next[d.dayIndex] = d.isWeekend;
      });
      setCollapsedDays(next);
    };
    const handleCollapseAll = () => {
      const next: Record<number, boolean> = {};
      days.forEach((d) => {
        next[d.dayIndex] = true;
      });
      setCollapsedDays(next);
    };

    window.addEventListener("timeline-expand-all", handleExpandAll);
    window.addEventListener("timeline-collapse-all", handleCollapseAll);
    return () => {
      window.removeEventListener("timeline-expand-all", handleExpandAll);
      window.removeEventListener("timeline-collapse-all", handleCollapseAll);
    };
  }, [days]);

  // Group tasks that fall into this week and specific days
  const getTasksForDay = (dayIndex: number) => {
    return allTasks.filter((task) => {
      const placement = mapTaskToTimeline(task, anchorDateStr);
      return placement.week === activeWeekIndex && placement.day === dayIndex;
    });
  };

  // Screen Edge Hover Week Navigation states
  const [isDraggingOverLeft, setIsDraggingOverLeft] = useState(false);
  const [isDraggingOverRight, setIsDraggingOverRight] = useState(false);
  const edgeDragTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (edgeDragTimerRef.current) {
        clearTimeout(edgeDragTimerRef.current);
      }
    };
  }, []);

  const handleEdgeDragEnter = (dir: "left" | "right") => (e: React.DragEvent) => {
    const types = Array.from(e.dataTransfer.types);
    if (types.includes("application/dcx-task-move")) {
      e.preventDefault();
      if (dir === "left") {
        setIsDraggingOverLeft(true);
      } else {
        setIsDraggingOverRight(true);
      }

      if (edgeDragTimerRef.current) {
        clearTimeout(edgeDragTimerRef.current);
      }

      // 600ms hover holding threshold before executing navigation to prevent jitter
      edgeDragTimerRef.current = setTimeout(() => {
        if (dir === "left") {
          if (activeWeekIndex > 1 && onActiveWeekChange) {
            onActiveWeekChange(activeWeekIndex - 1);
          }
          setIsDraggingOverLeft(false);
        } else {
          if (activeWeekIndex < totalWeeks && onActiveWeekChange) {
            onActiveWeekChange(activeWeekIndex + 1);
          }
          setIsDraggingOverRight(false);
        }
      }, 600);
    }
  };

  const handleEdgeDragOver = (e: React.DragEvent) => {
    const types = Array.from(e.dataTransfer.types);
    if (types.includes("application/dcx-task-move")) {
      e.preventDefault(); // crucial to let browser know drop or continuous hover is permitted
    }
  };

  const handleEdgeDragLeave = (dir: "left" | "right") => () => {
    if (dir === "left") {
      setIsDraggingOverLeft(false);
    } else {
      setIsDraggingOverRight(false);
    }
    if (edgeDragTimerRef.current) {
      clearTimeout(edgeDragTimerRef.current);
      edgeDragTimerRef.current = null;
    }
  };

  const handleEdgeDrop = (dir: "left" | "right") => () => {
    if (dir === "left") {
      setIsDraggingOverLeft(false);
    } else {
      setIsDraggingOverRight(false);
    }
    if (edgeDragTimerRef.current) {
      clearTimeout(edgeDragTimerRef.current);
      edgeDragTimerRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Dynamic Left Margin Hover Zone */}
      {activeWeekIndex > 1 && (
        <div
          onDragEnter={handleEdgeDragEnter("left")}
          onDragOver={handleEdgeDragOver}
          onDragLeave={handleEdgeDragLeave("left")}
          onDrop={handleEdgeDrop("left")}
          className={`absolute left-0 top-[10%] bottom-[10%] w-12 sm:w-16 z-50 transition-all duration-500 rounded-r-[2rem] flex items-center justify-start pl-6 pointer-events-auto ${
            isDraggingOverLeft
              ? "bg-gradient-to-r from-[#75E2FF]/25 to-transparent border-l-4 border-[#75E2FF] opacity-100 shadow-[20px_0_40px_rgba(117,226,255,0.08)] scale-y-105"
              : "bg-transparent opacity-30 hover:bg-black/[0.01]"
          }`}
        >
          {isDraggingOverLeft && (
            <div className="flex flex-col items-center justify-center text-[#75E2FF] animate-pulse">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase rotate-270 origin-center whitespace-nowrap block">
                PREV WEEK
              </span>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Right Margin Hover Zone */}
      {activeWeekIndex < totalWeeks && (
        <div
          onDragEnter={handleEdgeDragEnter("right")}
          onDragOver={handleEdgeDragOver}
          onDragLeave={handleEdgeDragLeave("right")}
          onDrop={handleEdgeDrop("right")}
          className={`absolute right-0 top-[10%] bottom-[10%] w-12 sm:w-16 z-50 transition-all duration-500 rounded-l-[2rem] flex items-center justify-end pr-6 pointer-events-auto ${
            isDraggingOverRight
              ? "bg-gradient-to-l from-[#75E2FF]/25 to-transparent border-r-4 border-[#75E2FF] opacity-100 shadow-[-20px_0_40px_rgba(117,226,255,0.08)] scale-y-105"
              : "bg-transparent opacity-30 hover:bg-black/[0.01]"
          }`}
        >
          {isDraggingOverRight && (
            <div className="flex flex-col items-center justify-center text-[#75E2FF] animate-pulse">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase rotate-90 origin-center whitespace-nowrap block">
                NEXT WEEK
              </span>
            </div>
          )}
        </div>
      )}

      <div className="w-full h-full flex items-center justify-start xl:justify-center overflow-x-auto overflow-y-visible px-4 py-12 scrollbar-hide">
        <div className="w-full max-w-[1720px] mx-auto overflow-visible py-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeWeekIndex}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 120 : -120,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -120 : 120,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 32,
              }}
              className="flex items-start justify-start xl:justify-center gap-3 sm:gap-4 shrink-0 w-full"
            >
              {days.map((day) => (
                <DayGridCard
                  key={day.dayIndex}
                  phases={phases}
                  setNodes={setNodes}
                  dayLabel={day.label}
                  dateString={day.dateString}
                  isEnabled={day.isEnabled}
                  isWeekend={day.isWeekend}
                  isAnchorDay={day.isAnchorDay}
                  tasks={getTasksForDay(day.dayIndex)}
                  onStartEditTask={onStartEditTask}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  onDuplicateTask={onDuplicateTask}
                  dayIndex={day.dayIndex}
                  weekIndex={activeWeekIndex}
                  isCollapsed={collapsedDays[day.dayIndex] !== undefined ? collapsedDays[day.dayIndex] : !day.isEnabled}
                  onToggleCollapse={() => handleToggleCollapse(day.dayIndex)}
                  anchorDateStr={anchorDateStr}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
