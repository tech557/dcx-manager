import React from "react";
import { Move, Layers } from "lucide-react";
import { ActionCardData, TaskCardData } from "../../../../types";
import { TASK_CHANNELS } from "../../../../mock/taskDropdowns";
import { ChannelIcon } from "../../../../components/ChannelIcon";
import { useTheme } from "../../../../hooks/useTheme";


interface TaskMovePanelProps {
  phaseId: string;
  actionCards: ActionCardData[];
  selectedIds: Set<string>;
  toggleSelection: (id: string, isMulti: boolean) => void;
}

export function TaskMovePanel({
phaseId,
  actionCards,
  selectedIds,
  toggleSelection,
}: TaskMovePanelProps) {
  const { isDark } = useTheme();
  
  const getShortDate = (dateStr?: string) => {
    if (!dateStr) return "•";
    if (dateStr.includes("Day")) {
      const match = dateStr.match(/Day\s+(\d+)/);
      return match ? `D${match[1]}` : "✓";
    }
    return dateStr;
  };

  return (
    <div className="flex-1 overflow-y-auto mt-3 pr-0.5 space-y-3.5 custom-scrollbar">
      {actionCards.map((card) => {
        const isCardSelected = selectedIds.has(card.id);
        const tasks: TaskCardData[] = card.tasks || [];

        return (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "application/dcx-action-move",
                JSON.stringify({ actionCardId: card.id, phaseId })
              );
              e.dataTransfer.effectAllowed = "move";
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelection(card.id, e.ctrlKey || e.metaKey);
            }}
            className={`p-3.5 rounded-[1.6rem] border text-left flex flex-col gap-2 transition-all duration-500 group/card relative cursor-grab active:cursor-grabbing ${
              isCardSelected
                ? isDark
                  ? "border-[#75E2FF]/30 bg-[#75E2FF]/20 shadow-[0_0_24px_rgba(117,226,255,0.18)]"
                  : "border-[#75E2FF]/20 bg-[#75E2FF]/15 shadow-[0_0_20px_rgba(117,226,255,0.12)]"
                : isDark
                  ? "bg-black/25 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-black/35 hover:border-white/[0.08]"
                  : "bg-white/75 border border-[#151516]/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:bg-white/95 hover:border-black/[0.12]"
            }`}
          >
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-[11px] font-black tracking-tight text-current leading-tight uppercase font-sans">
                {card.name || "Untitled Action"}
              </span>
              <Move className="w-3 h-3 opacity-0 group-hover/card:opacity-40 text-current shrink-0 transition-opacity" />
            </div>

            {/* Task Rows inside Card as Small Task Cards! */}
            {tasks.length > 0 && (
              <div className="mt-1.5 pt-2 border-t border-current/5 flex flex-wrap gap-2 w-full">
                {tasks.map((task) => {
                  const isTaskSelected = selectedIds.has(task.id);
                  const activeChannel = TASK_CHANNELS.find(ch => ch.id === task.channelId) || TASK_CHANNELS[0];
                  const firstWordOfName = task.name ? task.name.trim().split(/\s+/)[0] : "Task";
                  const isScheduled = !!(task.date && task.date.mode !== "unset");
                  const displayDate = (() => {
                    if (!task.date || task.date.mode === "unset") return "•";
                    if (task.date.mode === "linked") {
                      return `D${task.date.dayOffset}`;
                    }
                    return task.date.date;
                  })();

                  return (
                    <div
                      key={task.id}
                      draggable={!isScheduled}
                      onDragStart={(e) => {
                        if (isScheduled) return;
                        // Package exactly identical structure so timeline drops work out of the box
                        e.dataTransfer.setData(
                          "application/dcx-task-move",
                          JSON.stringify({ 
                            task: {
                              ...task,
                              phaseId,
                              actionCardId: card.id
                            }, 
                            sourceActionCardId: card.id 
                          })
                        );
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isScheduled) return;
                        toggleSelection(task.id, e.ctrlKey || e.metaKey);
                      }}
                      className={`w-[60px] h-[60px] p-1 rounded-[1.1rem] border flex flex-col items-center justify-between text-center select-none transition-all duration-300 relative group/small-task ${
                        isScheduled
                          ? "opacity-30 cursor-not-allowed"
                          : isTaskSelected
                            ? isDark
                              ? "border-[#75E2FF]/30 bg-[#75E2FF]/25 shadow-[0_0_12px_rgba(117,226,255,0.25)] text-neutral-200"
                              : "border-[#75E2FF]/20 bg-[#75E2FF]/20 shadow-[0_0_12px_rgba(117,226,255,0.18)] text-neutral-800"
                            : isDark 
                              ? "bg-black/25 border-white/[0.04] text-neutral-300 hover:bg-black/40 hover:border-white/[0.12] hover:scale-[1.04] cursor-grab active:cursor-grabbing" 
                              : "bg-white/80 border-slate-200 text-neutral-700 hover:bg-white hover:border-black/[0.15] hover:scale-[1.04] cursor-grab active:cursor-grabbing"
                      }`}
                    >
                      {/* Micro channel visual badge */}
                      <div 
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                          isDark 
                            ? "bg-white/5 border-white/10 text-[#75E2FF]" 
                            : "bg-[#75E2FF]/10 border-black/[0.06] text-[#4ea0b5]"
                        }`}
                      >
                        <ChannelIcon name={activeChannel.iconName} className="w-2.5 h-2.5 shrink-0" />
                      </div>

                      {/* First Word of Title */}
                      <span className="text-[8.5px] font-black tracking-tight truncate w-full px-0.5 leading-none font-sans block uppercase">
                        {firstWordOfName}
                      </span>

                      {/* Communication Date Badge of Small Task */}
                      <span className="text-[7.5px] font-mono font-black opacity-50 tracking-normal leading-none uppercase">
                        {displayDate}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {actionCards.length === 0 && (
        <div className="h-24 flex flex-col items-center justify-center text-center opacity-30">
          <Layers className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-semibold tracking-wider">NO ACTIONS AVAILABLE</span>
        </div>
      )}
    </div>
  );
}
