import React from "react";
import { TaskCardData } from "../../../types";
import { getDaysForWeek, mapTaskToTimeline } from "../../../utils/date.helpers";
import { DayGridCard } from "../cards";

interface MonthlyViewProps {
  anchorDateStr: string;
  totalWeeks: number;
  activeWeekIndex?: number;
  allTasks: TaskCardData[];
  onStartEditTask?: (task: TaskCardData) => void;
  phases?: any[];
  setNodes?: React.Dispatch<React.SetStateAction<any[]>>;
  onEditTask?: (phaseId: string, actionCardId: string, updatedTask: TaskCardData) => void;
  onDeleteTask?: (phaseId: string, actionCardId: string, taskId: string) => void;
  onDuplicateTask?: (phaseId: string, actionCardId: string, task: TaskCardData) => void;
}

export function MonthlyView({
anchorDateStr,
  totalWeeks,
  activeWeekIndex = 1,
  allTasks,
  onStartEditTask,
  phases = [],
  setNodes,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}: MonthlyViewProps) {
  // Respect configuration weeks count dynamically with 4-week pagination chunks
  const activeMonthIndex = Math.ceil(activeWeekIndex / 4);
  const startWeek = (activeMonthIndex - 1) * 4 + 1;
  const endWeek = Math.min(totalWeeks, activeMonthIndex * 4);

  const weeksToRender = [];
  for (let w = startWeek; w <= endWeek; w++) {
    weeksToRender.push(w);
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 py-1.5 overflow-hidden">
      {weeksToRender.map((weekNum) => {
        const days = getDaysForWeek(weekNum, anchorDateStr);

        return (
          <div
            key={weekNum}
            className="flex-1 min-h-0 flex flex-col gap-1"
          >
            {/* Extremely compact Week header */}
            <div className="flex items-center justify-between shrink-0 px-2 opacity-50" style={{ fontFamily: "Gilroy, -apple-system, BlinkMacSystemFont, sans-serif" }}>
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#75E2FF]">
                Week {weekNum}
              </span>
              <span className="text-[8px] font-bold tracking-widest opacity-60 uppercase">
                {days[0].dateString} &mdash; {days[6].dateString}
              </span>
            </div>

            {/* 7 Columns Grid stretching dynamically to row height */}
            <div className="flex-1 min-h-0 grid grid-cols-7 gap-2 w-full">
              {days.map((day) => {
                const tasksOnDay = allTasks.filter((task) => {
                  const placement = mapTaskToTimeline(task, anchorDateStr);
                  return placement.week === weekNum && placement.day === day.dayIndex;
                });

                return (
                  <DayGridCard
                    key={day.dayIndex}
                    phases={phases}
                    setNodes={setNodes}
                    dayLabel={day.label}
                    dateString={day.dateString}
                    isEnabled={day.isEnabled}
                    isWeekend={day.isWeekend}
                    isAnchorDay={day.isAnchorDay}
                    tasks={tasksOnDay}
                    onStartEditTask={onStartEditTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDuplicateTask={onDuplicateTask}
                    dayIndex={day.dayIndex}
                    weekIndex={weekNum}
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                    anchorDateStr={anchorDateStr}
                    isMonthly={true}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
