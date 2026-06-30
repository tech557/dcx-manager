import React from "react";
import { BLUR } from "../../../../styles/tokens";
import { useTheme } from "../../../../hooks/useTheme";


interface CollapsedDayCardProps {
  dayLabel: string;
  dateString: string;
  isEnabled: boolean;
  isWeekend: boolean;
  isAnchorDay: boolean;
  tasksCount: number;
  dayIndex: number;
  weekIndex: number;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onToggleCollapse: () => void;
  toggleSelection: (id: string, isMulti?: boolean) => void;
}

export function CollapsedDayCard({
dayLabel,
  dateString,
  isEnabled,
  isWeekend,
  isAnchorDay,
  tasksCount,
  dayIndex,
  weekIndex,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onToggleCollapse,
  toggleSelection,
}: CollapsedDayCardProps) {
  const { isDark } = useTheme();
  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        onToggleCollapse();
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("input") || target.closest("[id^='task-']")) return;
        
        e.stopPropagation();
        toggleSelection(`week-${weekIndex}`, e.ctrlKey || e.metaKey);
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`group relative flex flex-col items-center py-6 w-20 shrink-0 h-[460px] rounded-[2.2rem] border ${BLUR.heavy} select-none cursor-pointer transition-all duration-500 ${
        !isEnabled
          ? isDark
            ? "bg-black/10 border-white/[0.01] opacity-40 hover:bg-black/20"
            : "bg-black/[0.02] border-black/[0.02] opacity-45 hover:bg-black/[0.05]"
          : isDragOver
            ? isDark
              ? "bg-[#75E2FF]/15 border-[#75E2FF] shadow-[0_0_25px_rgba(117,226,255,0.2)] scale-[1.02]"
              : "bg-[#75E2FF]/5 border-[#75E2FF] shadow-[0_12px_40px_rgba(117,226,255,0.15)] scale-[1.02]"
            : isDark
              ? "bg-black/20 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-black/30 hover:border-white/[0.08]"
              : "bg-white/75 border-black/[0.07] shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:bg-white/90 hover:border-black/[0.12]"
      }`}
      title="Double click to expand day"
    >
      {/* Weekend pattern stripe background */}
      {!isEnabled && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,currentColor,currentColor_10px,transparent_10px,transparent_20px)]" />
      )}

      {/* Vertical Top Icon indicator */}
      <div className="flex flex-col items-center gap-4 relative z-10 w-full px-2">
        <div 
          className={`w-9 h-9 rounded-full flex items-center justify-center font-sans font-bold text-xs ${
            isAnchorDay
              ? "bg-[#75E2FF]/20 text-[#75E2FF] border border-[#75E2FF]/20"
              : isDark
                ? "bg-white/5 text-slate-300"
                : "bg-black/5 text-slate-700"
          }`}
          style={{ fontFamily: "'Gilroy', sans-serif" }}
        >
          D{dayIndex + 1}
        </div>

        {/* Vertical text label with full Date */}
        <div className="flex items-center justify-center h-48 select-none">
          <div className="origin-center rotate-90 whitespace-nowrap flex items-center gap-3">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase font-sans opacity-45">
              {dayLabel.substring(0, 3)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-20 shrink-0" />
            <span className="text-[10px] font-bold font-mono tracking-tight opacity-40 uppercase">
              {dateString}
            </span>
          </div>
        </div>
      </div>

      {/* Compact count stats pill or Lock banner */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1 mt-auto">
        <span className="text-[7px] font-black tracking-widest uppercase opacity-30 font-sans">
          TASKS
        </span>
        {isEnabled ? (
          <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black bg-[#75E2FF]/10 text-[#75E2FF] border border-[#75E2FF]/15">
            {tasksCount}
          </span>
        ) : (
          <span className="text-[9px] font-black font-mono opacity-20">
            0
          </span>
        )}
      </div>
    </div>
  );
}
