import React from "react";
import { TaskCardData } from "../../../types";
import { MessageSquare, Calendar } from "lucide-react";
import { useBuilder } from "../context/BuilderContext";
import { BLUR } from "../../../styles/tokens";
import { useTheme } from "../../../hooks/useTheme";


interface TimelineTaskMarkerProps {
  key?: string | number;
  task: TaskCardData;
  onClick?: () => void;
  className?: string;
}

export function TimelineTaskMarker({
task,
  onClick,
  className = "",
}: TimelineTaskMarkerProps) {
  const { isDark } = useTheme();
  const { selectedIds } = useBuilder();
  const isSelected = selectedIds.has(task.id);

  // Use status colors matching main theme system
  const hasMissing = task.missingData && task.missingData.length > 0;
  
  return (
    <div
      id={`timeline-task-${task.id}`}
      onClick={onClick}
      className={`group relative flex items-center gap-3 p-3 rounded-xl border ${BLUR.light} cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-[#75E2FF] bg-[#75E2FF]/10 ring-2 ring-[#75E2FF]/20"
          : isDark
            ? "bg-black/30 border-white/[0.04] hover:bg-black/50 hover:border-white/[0.1] text-white"
            : "bg-white/40 border-black/[0.04] hover:bg-white/75 hover:border-black/[0.08] text-neutral-800"
      } ${className}`}
    >
      {/* Tiny pulsing status bullet */}
      <span className="relative flex h-2 w-2">
        {hasMissing ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </>
        ) : (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75E2FF]/70 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#75E2FF]"></span>
          </>
        )}
      </span>

      {/* Task Meta details */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold truncate tracking-tight">
          {task.name}
        </div>
        {task.date && task.date.mode !== "unset" && (
          <div className="flex items-center gap-1 mt-0.5 text-[9px] font-mono opacity-55">
            <Calendar className="w-2.5 h-2.5 text-[#75E2FF]" />
            <span>
              {task.date.mode === "linked" 
                ? `Week ${task.date.weekOffset} - Day ${task.date.dayOffset}` 
                : task.date.date}
            </span>
          </div>
        )}
      </div>

      {/* Message icon indicator */}
      {task.message && (
        <MessageSquare className="w-3 h-3 text-[#75E2FF] opacity-40 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}
