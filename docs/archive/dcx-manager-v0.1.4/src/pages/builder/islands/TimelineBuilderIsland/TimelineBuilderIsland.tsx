import { CalendarPlus, Grid2X2, Rows3, ChevronLeft, ChevronRight } from "lucide-react";
import { BuilderIslandShell } from "../BuilderIslandShell";
import { useTheme } from "../../../../hooks/useTheme";


interface TimelineBuilderIslandProps {
  onAddWeek: () => void;
  viewMode: "weekly" | "monthly";
  onViewModeChange: (mode: "weekly" | "monthly") => void;
  activeWeek: number;
  onActiveWeekChange: (week: number) => void;
  totalWeeks: number;
}

export function TimelineBuilderIsland({
onAddWeek,
  viewMode,
  onViewModeChange,
  activeWeek,
  onActiveWeekChange,
  totalWeeks,
}: TimelineBuilderIslandProps) {
  const { isDark } = useTheme();
  const buttonClass = isDark
    ? "bg-white/5 hover:bg-white/10 text-neutral-200 border-white/10"
    : "bg-black/5 hover:bg-black/10 text-neutral-800 border-black/10";

  return (
    <BuilderIslandShell
      isExpanded
      shape="panel"
      className="h-[60px] px-4 py-2"
      collapsedIcon={null}
    >
      <div className="flex items-center gap-2 h-full">
        <button
          type="button"
          onClick={() => onActiveWeekChange(Math.max(1, activeWeek - 1))}
          disabled={activeWeek <= 1}
          className={`p-2 rounded-full border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${buttonClass}`}
          title="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="px-3 text-center min-w-[92px]">
          <span className="block text-[8px] font-black tracking-[0.25em] uppercase opacity-35">Timeline</span>
          <span className="block text-[11px] font-black leading-none text-[#75E2FF]">
            Week {activeWeek}/{totalWeeks}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onActiveWeekChange(Math.min(totalWeeks, activeWeek + 1))}
          disabled={activeWeek >= totalWeeks}
          className={`p-2 rounded-full border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${buttonClass}`}
          title="Next week"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-current/10 mx-1" />

        <button
          type="button"
          onClick={() => onViewModeChange("weekly")}
          className={`p-2 rounded-full border transition-all ${
            viewMode === "weekly" ? "bg-[#75E2FF]/20 text-[#75E2FF] border-[#75E2FF]/30" : buttonClass
          }`}
          title="Weekly view"
        >
          <Rows3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("monthly")}
          className={`p-2 rounded-full border transition-all ${
            viewMode === "monthly" ? "bg-[#75E2FF]/20 text-[#75E2FF] border-[#75E2FF]/30" : buttonClass
          }`}
          title="Monthly view"
        >
          <Grid2X2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onAddWeek}
          className="ml-1 p-2 rounded-full bg-[#75E2FF]/15 hover:bg-[#75E2FF]/25 text-[#75E2FF] border border-[#75E2FF]/25 transition-all"
          title="Add week"
        >
          <CalendarPlus className="w-4 h-4" />
        </button>
      </div>
    </BuilderIslandShell>
  );
}
