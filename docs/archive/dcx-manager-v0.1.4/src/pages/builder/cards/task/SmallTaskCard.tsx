import React from "react";
import { TASK_CHANNELS } from "../../../../mock/taskDropdowns";
import { TaskCardData } from "../../../../types";
import { InteractiveTooltip } from "./InteractiveTooltip";
import { ChannelIcon } from "../../../../components/ChannelIcon";
import { useBuilderStore } from "../../../../store/builderStore";
import { resolveTaskDate, mapTaskToTimeline, getDateForWeekAndDay } from "../../../../utils/date.helpers";
import { BuilderCardShell } from "../BuilderCardShell";
import { useTheme } from "../../../../hooks/useTheme";


interface SmallTaskCardProps {
  task: TaskCardData;
  onToggleSmall: () => void;
  onStartEdit?: () => void;
  parentActionCardId?: string;
  parentPhaseId?: string;
  isMonthly?: boolean;
}

export function SmallTaskCard({
  task,
onToggleSmall,
  onStartEdit,
  parentActionCardId,
  parentPhaseId,
  isMonthly
}: SmallTaskCardProps) {
  const { isDark } = useTheme();
  // Helper code for short month/day format
  const getShortDate = () => {
    const activeVer = useBuilderStore.getState().activeVersion;
    const baseDate = activeVer?.communicatedDate || "2026-06-13";
    
    let dateStr = "";
    let isLinked = false;
    
    if (task.date) {
      dateStr = resolveTaskDate(task.date, baseDate);
      isLinked = task.date.mode === "linked";
    }
    
    if (!dateStr) return "12 Jun";

    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const monthName = months[monthIndex] || "Jun";
      return `${day} ${monthName}${isLinked ? " 🔗" : ""}`;
    }
    return dateStr;
  };

  const activeChannel = TASK_CHANNELS.find(ch => ch.id === task.channelId) || TASK_CHANNELS[0];
  const firstWordOfName = task.name ? task.name.trim().split(/\s+/)[0] : "Task";
  const gilroyStyle = { fontFamily: "Gilroy, -apple-system, BlinkMacSystemFont, sans-serif" };

  return (
    <InteractiveTooltip
      alwaysResizable={false}
      compact={true}
      nonEditingWidth="max-content"
      content={
        <div className="flex items-center gap-1.5 py-0 px-2 justify-center">
          <div className="w-0.5 h-0.5 rounded-full bg-[#75E2FF] animate-pulse" />
          <span className="text-[8.5px] font-black uppercase tracking-widest text-[#75E2FF] whitespace-nowrap">
            {task.name}
          </span>
        </div>
      }
    >
      <BuilderCardShell
        id={task.id}
        isDraggable={true}
        dragType="task"
        dragData={{ task, sourceActionCardId: parentActionCardId }}
        parentActionCardId={parentActionCardId}
        parentPhaseId={parentPhaseId}
        variant="task-small"
        isMonthly={isMonthly}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (isMonthly) {
            onStartEdit?.();
          } else {
            onToggleSmall();
          }
        }}
        className={`${
          isMonthly 
            ? "w-11 h-11 p-1" 
            : "w-[68px] h-[68px] p-1.5"
        } flex flex-col items-center justify-between text-center select-none cursor-grab active:cursor-grabbing group/small-task`}
      >
        {() => (
          <>
            {/* Channel visual marker */}
            <div 
              className={`${
                isMonthly 
                  ? "w-4 h-4 rounded-md" 
                  : "w-5.5 h-5.5 rounded-lg"
              } flex items-center justify-center border transition-all duration-300 ${
                isDark 
                  ? "bg-white/5 border-white/10 text-[#75E2FF]" 
                  : "bg-[#75E2FF]/10 border-black/[0.06] text-[#4ea0b5]"
              }`}
            >
              <ChannelIcon name={activeChannel.iconName} className={`${isMonthly ? "w-2.5 h-2.5" : "w-3 h-3"} shrink-0`} />
            </div>

            {/* Task Title (Single Word) */}
            <span 
              className={`${
                isMonthly 
                  ? "text-[7.5px] scale-95 font-bold leading-none mt-0.5" 
                  : "text-[9.5px] font-black tracking-tight leading-none mt-1"
              } truncate w-full px-0.5`}
              style={gilroyStyle}
            >
              {firstWordOfName}
            </span>

            {/* Communication Date (Short) */}
            {!isMonthly && (
              <span 
                className="text-[8px] font-mono font-bold opacity-50 tracking-normal mb-0.5 leading-none uppercase"
                style={gilroyStyle}
              >
                {getShortDate()}
              </span>
            )}
          </>
        )}
      </BuilderCardShell>
    </InteractiveTooltip>
  );
}
