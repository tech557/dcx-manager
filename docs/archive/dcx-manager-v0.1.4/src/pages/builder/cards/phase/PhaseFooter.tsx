import { Calendar, ListPlus } from "lucide-react";
import { ActionCardData } from "../../../../types";
import { useTheme } from "../../../../hooks/useTheme";


interface PhaseFooterProps {
  phaseId: string;
  actionCardsLength: number;
  segmentStart: string;
  segmentEnd: string;
  totalColumnTasks: number;
  onUpdatePhaseField: (phaseId: string, updates: any) => void;
  formatDateLabel: (dateStr: string) => string;
}

export function PhaseFooter({
phaseId,
  actionCardsLength,
  segmentStart,
  segmentEnd,
  totalColumnTasks,
  onUpdatePhaseField,
  formatDateLabel,
}: PhaseFooterProps) {
  const { isDark } = useTheme();
  return (
    <div className="pt-3 mt-3 border-t border-current/5 flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <Calendar className="w-3.5 h-3.5 text-[#75E2FF] shrink-0" />
        <span className="text-[9px] font-black font-mono tracking-tight opacity-55 truncate">
          {formatDateLabel(segmentStart)} - {formatDateLabel(segmentEnd)}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`px-2 py-1 rounded-full text-[8px] font-black font-mono ${
          isDark ? "bg-white/5 text-[#75E2FF]" : "bg-black/5 text-neutral-800"
        }`}>
          {actionCardsLength}A / {totalColumnTasks}T
        </span>
        <button
          type="button"
          onClick={() => onUpdatePhaseField(phaseId, { isCollapsed: true })}
          className="p-1.5 rounded-full hover:bg-current/10 text-current/50 hover:text-[#75E2FF] transition-colors"
          title="Collapse phase"
        >
          <ListPlus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
