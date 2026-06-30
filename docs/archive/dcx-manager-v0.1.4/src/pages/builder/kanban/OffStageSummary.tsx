import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PHASE_ICONS_MAP, PhaseIconType } from "../cards/phase/PhaseIcons";
import { BLUR } from "../../../styles/tokens";
import { useTheme } from "../../../hooks/useTheme";


export interface OffStagePhaseInfo {
  id: string;
  label: string;
  icon: PhaseIconType;
}

interface OffStageSummaryProps {
  leftPhases: OffStagePhaseInfo[];
  rightPhases: OffStagePhaseInfo[];
  onScrollToPhase: (phaseId: string) => void;
}

export function OffStageSummary({
leftPhases,
  rightPhases,
  onScrollToPhase,
}: OffStageSummaryProps) {
  const { isDark } = useTheme();
  if (leftPhases.length === 0 && rightPhases.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[45] flex justify-between select-none overflow-hidden">
      
      {/* Offstage Left Indicators Container */}
      <div className="flex flex-col justify-center gap-3 pl-4 h-full pointer-events-auto">
        {leftPhases.map((phase) => {
          const config = PHASE_ICONS_MAP[phase.icon] || PHASE_ICONS_MAP.awareness;
          const IconComponent = config.icon;
          
          return (
            <div
              key={phase.id}
              onClick={() => onScrollToPhase(phase.id)}
              className={`flex items-center gap-2 group/beacon cursor-pointer p-2.5 rounded-full border shadow-xl ${BLUR.heavy} transition-all duration-500 hover:scale-105 active:scale-95 ${
                isDark
                  ? "bg-neutral-950/80 border-white/[0.04] text-[#75E2FF] hover:bg-neutral-900 hover:border-[#75E2FF]/30 hover:shadow-[0_0_20px_rgba(117,226,255,0.15)]"
                  : "bg-white/85 border-black/[0.06] text-[#55b3cc] hover:bg-white hover:border-[#75E2FF]/40 hover:shadow-[0_0_20px_rgba(117,226,255,0.12)]"
              }`}
              title={`Scroll to: ${phase.label}`}
            >
              {/* Pulsing Beacon Light Ring */}
              <div className="relative flex items-center justify-center shrink-0">
                <span className="absolute animate-ping inline-flex h-3 w-3 rounded-full bg-[#75E2FF]/20" />
                <span className={`relative rounded-full h-1.5 w-1.5 ${isDark ? "bg-[#75E2FF]" : "bg-[#55b3cc]"}`} />
              </div>

              {/* Icon */}
              <IconComponent className="w-3.5 h-3.5" />

              {/* Expandable Meta Text */}
              <div className="max-w-0 overflow-hidden group-hover/beacon:max-w-[150px] transition-all duration-500 ease-out flex items-center gap-1.5">
                <ChevronLeft className="w-2.5 h-2.5 opacity-55" />
                <span className="text-[8.5px] font-black font-mono tracking-[0.15em] uppercase whitespace-nowrap opacity-85">
                  {phase.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offstage Right Indicators Container */}
      <div className="flex flex-col justify-center gap-3 pr-4 h-full pointer-events-auto">
        {rightPhases.map((phase) => {
          const config = PHASE_ICONS_MAP[phase.icon] || PHASE_ICONS_MAP.awareness;
          const IconComponent = config.icon;
          
          return (
            <div
              key={phase.id}
              onClick={() => onScrollToPhase(phase.id)}
              className={`flex items-center gap-2 group/beacon cursor-pointer p-2.5 rounded-full border shadow-xl ${BLUR.heavy} transition-all duration-500 hover:scale-105 active:scale-95 flex-row-reverse ${
                isDark
                  ? "bg-neutral-950/80 border-white/[0.04] text-[#75E2FF] hover:bg-neutral-900 hover:border-[#75E2FF]/30 hover:shadow-[0_0_20px_rgba(117,226,255,0.15)]"
                  : "bg-white/85 border-black/[0.06] text-[#55b3cc] hover:bg-white hover:border-[#75E2FF]/40 hover:shadow-[0_0_20px_rgba(117,226,255,0.12)]"
              }`}
              title={`Scroll to: ${phase.label}`}
            >
              {/* Pulsing Beacon Light Ring */}
              <div className="relative flex items-center justify-center shrink-0">
                <span className="absolute animate-ping inline-flex h-3 w-3 rounded-full bg-[#75E2FF]/20" />
                <span className={`relative rounded-full h-1.5 w-1.5 ${isDark ? "bg-[#75E2FF]" : "bg-[#55b3cc]"}`} />
              </div>

              {/* Icon */}
              <IconComponent className="w-3.5 h-3.5" />

              {/* Expandable Meta Text */}
              <div className="max-w-0 overflow-hidden group-hover/beacon:max-w-[150px] transition-all duration-500 ease-out flex items-center gap-1.5 flex-row-reverse">
                <ChevronRight className="w-2.5 h-2.5 opacity-55" />
                <span className="text-[8.5px] font-black font-mono tracking-[0.15em] uppercase whitespace-nowrap opacity-85">
                  {phase.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
