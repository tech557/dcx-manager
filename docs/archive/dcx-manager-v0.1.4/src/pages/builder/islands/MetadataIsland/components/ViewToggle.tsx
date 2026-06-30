import { Columns3, CalendarDays } from "lucide-react";
import { useTheme } from "../../../../../hooks/useTheme";


interface ViewToggleProps {
  viewMode: "kanban" | "timeline";
  onViewModeChange: (mode: "kanban" | "timeline") => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  const { isDark } = useTheme();
  const inactive = isDark
    ? "text-neutral-400 hover:text-white hover:bg-white/5"
    : "text-neutral-500 hover:text-black hover:bg-black/5";

  return (
    <div className={`flex items-center gap-1 rounded-full p-1 border ${isDark ? "border-white/10 bg-black/20" : "border-black/10 bg-white/70"}`}>
      <button
        type="button"
        onClick={() => onViewModeChange("kanban")}
        className={`p-1.5 rounded-full transition-all ${viewMode === "kanban" ? "bg-[#75E2FF]/20 text-[#75E2FF]" : inactive}`}
        title="Kanban view"
      >
        <Columns3 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange("timeline")}
        className={`p-1.5 rounded-full transition-all ${viewMode === "timeline" ? "bg-[#75E2FF]/20 text-[#75E2FF]" : inactive}`}
        title="Timeline view"
      >
        <CalendarDays className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
