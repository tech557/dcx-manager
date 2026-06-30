import React from "react";
import { PHASE_ICONS_MAP } from "../../cards/phase/PhaseIcons";
import { ActionCardData } from "../../../../types";
import { TaskMovePanel } from "./TaskMovePanel";
import { useTheme } from "../../../../hooks/useTheme";


interface PhaseSummaryPanelProps {
  phases: any[];
  selectedIds: Set<string>;
  toggleSelection: (id: string, isMulti: boolean) => void;
}

export function PhaseSummaryPanel({
phases,
  selectedIds,
  toggleSelection,
}: PhaseSummaryPanelProps) {
  const { isDark } = useTheme();
  return (
    <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex gap-4 p-5 custom-scrollbar bg-current/[0.01]">
      {phases.map((phase) => {
        const phaseData = phase.data || {};
        const isPhaseSelected = selectedIds.has(phase.id);
        const actionCards: ActionCardData[] = phaseData.actionCards || [];

        return (
          <div
            key={phase.id}
            className={`flex flex-col w-[280px] shrink-0 border rounded-[2rem] transition-all duration-500 group/column relative p-4 max-h-full ${
              isPhaseSelected 
                ? isDark
                  ? "border-[#75E2FF]/40 bg-[#75E2FF]/5" 
                  : "border-[#75E2FF]/30 bg-[#75E2FF]/2"
                : isDark
                  ? "bg-black/20 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-black/30 hover:border-white/[0.06] hover:scale-[1.01]"
                  : "bg-white/75 border-black/[0.07] shadow-[0_12px_45px_rgba(0,0,0,0.035)] hover:bg-white/85 hover:border-black/[0.11] hover:scale-[1.01]"
            }`}
          >
            {/* Phase Draggable Header */}
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/dcx-phase-move", JSON.stringify({ phaseId: phase.id }));
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection(phase.id, e.ctrlKey || e.metaKey);
              }}
              className="pb-3 flex items-center justify-between border-b border-current/5 cursor-grab active:cursor-grabbing hover:opacity-75 transition-opacity"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {(() => {
                  const iconConfig = PHASE_ICONS_MAP[phaseData.icon] || PHASE_ICONS_MAP.awareness;
                  const IconComponent = iconConfig.icon;
                  return <IconComponent className={`w-3.5 h-3.5 shrink-0 ${iconConfig.color}`} />;
                })()}
                <span className="text-xs font-black tracking-tight truncate text-current uppercase font-sans">
                  {phaseData.label || "Untitled Phase"}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold opacity-30 shrink-0 bg-current/[0.03] px-1.5 py-0.5 rounded-md">
                {actionCards.length}
              </span>
            </div>

            {/* Draggable actions and tasks mapping */}
            <TaskMovePanel
              phaseId={phase.id}
              actionCards={actionCards}
              selectedIds={selectedIds}
              toggleSelection={toggleSelection}
            />
          </div>
        );
      })}
    </div>
  );
}
