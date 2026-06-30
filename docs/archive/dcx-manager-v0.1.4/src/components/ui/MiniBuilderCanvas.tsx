import React, { useState, useMemo } from "react";
import { Layers, Layout } from "lucide-react";
import { PhaseData } from "../../types";
import { mapTaskToTimeline } from "../../utils/date.helpers";

interface MiniBuilderCanvasProps {
  phases?: PhaseData[];
  isDark: boolean;
  anchorDateStr?: string;
  compact?: boolean;
}

const DAYS_OF_WEEK = [
  { index: 0, label: "Sunday", shortLabel: "SUN", isWeekend: true },
  { index: 1, label: "Monday", shortLabel: "MON" },
  { index: 2, label: "Tuesday", shortLabel: "TUE" },
  { index: 3, label: "Wednesday", shortLabel: "WED" },
  { index: 4, label: "Thursday", shortLabel: "THU" },
  { index: 5, label: "Friday", shortLabel: "FRI", isWeekend: true },
  { index: 6, label: "Saturday", shortLabel: "SAT", isWeekend: true }
];

export const MiniBuilderCanvas: React.FC<MiniBuilderCanvasProps> = ({
  phases = [],
  isDark,
  anchorDateStr = "2026-03-08",
  compact = false
}) => {
  const [previewTab, setPreviewTab] = useState<"kanban" | "timeline">("kanban");
  const [activeWeek, setActiveWeek] = useState<number>(1);

  // Extract all tasks across all phases and action cards for live timeline filtering
  const allTasks = useMemo(() => {
    const tasksList: any[] = [];
    phases.forEach((phase) => {
      (phase.actionCards || []).forEach((card) => {
        if (card.tasks) {
          card.tasks.forEach((t) => {
            tasksList.push({
              ...t,
              phaseId: phase.id,
              actionCardId: card.id
            });
          });
        }
      });
    });
    return tasksList;
  }, [phases]);

  // Lightweight calendar calculations to map tasks matching WeeklyView styles
  const getTasksForTimelineCell = (weekNum: number, dayIdx: number) => {
    return allTasks.filter((task) => {
      const mapped = mapTaskToTimeline(task, anchorDateStr);
      return mapped.week === weekNum && mapped.day === dayIdx;
    });
  };

  const getFormattedDayDateString = (weekNum: number, dayIdx: number) => {
    try {
      const parts = anchorDateStr.split("-");
      const aDate = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      const aDay = aDate.getDay();
      const week1Sun = new Date(aDate);
      week1Sun.setDate(aDate.getDate() - aDay);
      week1Sun.setHours(0, 0, 0, 0);

      const targetDate = new Date(week1Sun);
      targetDate.setDate(week1Sun.getDate() + (weekNum - 1) * 7 + dayIdx);

      return targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (err) {
      return "";
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-3 w-full flex-wrap gap-2">
        <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-30 block">
          Experience Sandbox Live Feed
        </span>

        {/* Premium Tab Swapper */}
        <div
          className={`flex items-center p-0.5 rounded-full border ${
            isDark ? "bg-black/40 border-white/5" : "bg-black/[0.02] border-black/[0.05]"
          }`}
        >
          <button
            type="button"
            onClick={() => setPreviewTab("kanban")}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              previewTab === "kanban"
                ? isDark
                  ? "bg-[#75E2FF]/20 text-primary border border-[#75E2FF]/30 shadow-sm"
                  : "bg-white text-black border border-black/5 shadow-xs"
                : "text-current/50 hover:text-current/80 bg-transparent border border-transparent"
            }`}
          >
            Kanban Feed
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("timeline")}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              previewTab === "timeline"
                ? isDark
                  ? "bg-[#75E2FF]/20 text-primary border border-[#75E2FF]/30 shadow-sm"
                  : "bg-white text-black border border-black/5 shadow-xs"
                : "text-current/50 hover:text-current/80 bg-transparent border border-transparent"
            }`}
          >
            Timeline Plan
          </button>
        </div>
      </div>

      <div
        className={`rounded-[1.5rem] border p-5 transition-all duration-300 ${
          isDark
            ? "border-white/[0.04] bg-black/[0.15]"
            : "border-black/[0.05] bg-black/[0.005]"
        }`}
      >
        {previewTab === "kanban" ? (
          /* KANBAN PREVIEW VIEW MODE */
          <div className="flex flex-col w-full">
            {phases.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 pt-1 custom-scrollbar w-full">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`w-[260px] sm:w-[285px] shrink-0 p-4 rounded-2xl border transition-all duration-300 flex flex-col ${
                      isDark
                        ? "bg-[#101011] border-white/5 hover:border-white/10"
                        : "bg-white border-black/[0.04] hover:border-black/10 hover:shadow-xs"
                    }`}
                  >
                    {/* Phase Header */}
                    <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-current/[0.03]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="p-1 rounded bg-[#75E2FF]/10 text-primary shrink-0">
                          <Layers className="w-3 h-3" />
                        </span>
                        <h5
                          className={`text-[11px] font-black truncate leading-none ${
                            isDark ? "text-white" : "text-black"
                          }`}
                        >
                          {phase.label}
                        </h5>
                      </div>
                      <span className="text-[8px] font-mono bg-current/[0.05] font-bold px-1 py-0.5 rounded-sm opacity-60 shrink-0">
                        {phase.actionCards?.length || 0} Card
                        {(phase.actionCards?.length || 0) !== 1 && "s"}
                      </span>
                    </div>

                    {/* Phase Date Subspan */}
                    <div className="text-[8px] font-mono opacity-40 font-bold mb-3 flex items-center gap-1">
                      <span>{phase.startDate}</span>
                      <span className="opacity-30">→</span>
                      <span>{phase.endDate}</span>
                    </div>

                    {/* Action Cards List */}
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1 flex-1">
                      {phase.actionCards && phase.actionCards.length > 0 ? (
                        phase.actionCards.map((card) => (
                          <div
                            key={card.id}
                            className={`p-2.5 rounded-xl border transition-all duration-300 ${
                              isDark
                                ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-[#75E2FF]/20"
                                : "bg-black/[0.01] border-black/[0.03] hover:bg-white hover:border-[#75E2FF]/30 hover:shadow-xs"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span
                                className={`text-[10px] font-black leading-tight ${
                                  isDark ? "text-white" : "text-black"
                                }`}
                              >
                                {card.name}
                              </span>
                              <span className="text-[7.5px] font-mono leading-none bg-[#75E2FF]/10 text-primary px-1.5 py-0.5 rounded font-black shrink-0">
                                {card.tasks?.length || 0} Task
                                {(card.tasks?.length || 0) !== 1 && "s"}
                              </span>
                            </div>
                            {card.description && (
                              <p className="text-[8px] opacity-40 leading-normal truncate pb-1">
                                {card.description}
                              </p>
                            )}

                            {/* Collapsed Tasks inside the card */}
                            {card.tasks && card.tasks.length > 0 && (
                              <div className="pt-2 mt-2 border-t border-current/[0.03] space-y-1">
                                {card.tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-start gap-1 text-[8px] font-semibold leading-tight text-current/75"
                                  >
                                    <div className="w-2.5 h-2.5 rounded border border-current/25 flex items-center justify-center shrink-0 mt-0.5">
                                      {task.subtasks?.every((sub) => sub.done) &&
                                        task.subtasks.length > 0 && (
                                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-sm" />
                                        )}
                                    </div>
                                    <span className="truncate flex-1 select-none">
                                      {task.name}
                                    </span>
                                    {task.channelId && (
                                      <span className="font-mono text-[6.5px] opacity-35 px-1 bg-current/[0.04] rounded-sm select-none shrink-0">
                                        {task.channelId}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center">
                          <p className="text-[8px] font-mono opacity-30 select-none italic">
                            // Empty Phase Card list
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Layout className="w-8 h-8 text-primary opacity-20 mx-auto mb-2" />
                <p className="text-[10px] font-mono opacity-30 select-none">
                  // No phases set up in active database
                </p>
              </div>
            )}
          </div>
        ) : (
          /* TIMELINE PREVIEW VIEW MODE */
          <div className="flex flex-col w-full">
            {/* Week switching bar */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-current/[0.03] flex-wrap gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((wk) => (
                  <button
                    key={wk}
                    type="button"
                    onClick={() => setActiveWeek(wk)}
                    className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition-all duration-300 cursor-pointer ${
                      activeWeek === wk
                        ? isDark
                          ? "bg-[#75E2FF]/20 text-primary border border-primary/25 font-black"
                          : "bg-black text-white px-3"
                        : "opacity-45 hover:opacity-100 bg-current/[0.03] hover:bg-current/[0.06]"
                    }`}
                  >
                    Week {wk}
                  </button>
                ))}
              </div>
              <span className="text-[8px] font-mono opacity-45 font-bold">
                Anchor: {anchorDateStr}
              </span>
            </div>

            {/* Days Strip List */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar w-full">
              {DAYS_OF_WEEK.map((day) => {
                const cellTasks = getTasksForTimelineCell(activeWeek, day.index);
                const cellDateStr = getFormattedDayDateString(activeWeek, day.index);
                const isAnchorDay =
                  activeWeek === 1 && day.index === new Date(anchorDateStr).getDay();

                return (
                  <div
                    key={day.index}
                    className={`w-[170px] shrink-0 p-3 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                      isAnchorDay
                        ? isDark
                          ? "bg-[#75E2FF]/10 border-primary/40 shadow-xs"
                          : "bg-[#75E2FF]/5 border-primary/30"
                        : day.isWeekend
                        ? isDark
                          ? "bg-black/15 border-white/[0.01] opacity-50"
                          : "bg-black/[0.02] border-black/[0.01] opacity-55"
                        : isDark
                        ? "bg-[#101011] border-white/5"
                        : "bg-white border-black/[0.04]"
                    }`}
                  >
                    {/* Day Name & Calendar Date */}
                    <div className="pb-1.5 border-b border-current/[0.03] mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-wider">
                          {day.label}
                        </span>
                        {isAnchorDay && (
                          <span className="text-[7px] bg-amber-500/15 text-amber-500 px-1 py-0.2 rounded-sm font-black uppercase">
                            Anchor
                          </span>
                        )}
                      </div>
                      <span className="text-[8px] font-mono opacity-40 font-bold block mt-0.5">
                        {cellDateStr}
                      </span>
                    </div>

                    {/* Collapsed task list */}
                    <div className="flex-1 space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-0.5 min-h-[50px]">
                      {cellTasks.length > 0 ? (
                        cellTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-2 rounded-xl border text-[8px] font-bold leading-normal ${
                              isDark
                                ? "bg-white/[0.01] border-white/5 hover:border-white/10"
                                : "bg-black/[0.01] border-black/[0.03] hover:bg-white hover:border-black/[0.08]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <span
                                className={`line-clamp-2 leading-snug flex-1 ${
                                  isDark ? "text-white/80" : "text-black/80"
                                }`}
                              >
                                {task.name}
                              </span>
                              {task.channelId && (
                                <span className="font-mono text-[6.5px] opacity-40 uppercase px-0.5 bg-current/[0.05] rounded-sm shrink-0">
                                  {task.channelId}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <span className="text-[8px] font-mono opacity-20 italic select-none">
                            // No events
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="pt-1.5 border-t border-current/[0.03] mt-2 flex items-center justify-between text-[7px] font-mono opacity-45">
                      <span>Tasks:</span>
                      <span>{cellTasks.length} total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
