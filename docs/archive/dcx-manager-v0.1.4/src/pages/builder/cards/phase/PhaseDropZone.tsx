import React, { useState } from "react";
import { Layers } from "lucide-react";
import { useBuilder } from "../../context/BuilderContext";
import { useTheme } from "../../../../hooks/useTheme";


interface PhaseDropZoneProps {
  key?: string;
  index: number;
  onUpdateNodesDirectly: any;
  onAddPhaseWithIndex: (index: number) => void;
}

export function PhaseDropZone({ index, onUpdateNodesDirectly, onAddPhaseWithIndex }: PhaseDropZoneProps) {
  const { draggingType } = useBuilder();
  const [isOver, setIsOver] = useState(false);

  const isActive = draggingType === "phase";

  return (
    <div
      onDragOver={(e) => {
        const types = Array.from(e.dataTransfer.types);
        if (
          types.includes("application/dcx-phase-add") ||
          types.includes("application/dcx-phase-rearrange")
        ) {
          e.preventDefault();
          setIsOver(true);
        }
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        setIsOver(false);
        e.preventDefault();
        e.stopPropagation();
        
        const dragType = e.dataTransfer.getData("application/dcx-phase-add");
        const rearrangePhaseId = e.dataTransfer.getData("application/dcx-phase-rearrange");

        if (dragType === "new-phase") {
          onAddPhaseWithIndex(index);
        } else if (rearrangePhaseId) {
          onUpdateNodesDirectly((prevNodes: any[]) => {
            const currentPhases = prevNodes.filter((n) => n.type === "phase");
            const sourceIdx = currentPhases.findIndex((p) => p.id === rearrangePhaseId);
            if (sourceIdx !== -1) {
              const updatedPhases = [...currentPhases];
              const [movedPhase] = updatedPhases.splice(sourceIdx, 1);
              let targetIdx = index;
              if (sourceIdx < targetIdx) {
                targetIdx -= 1;
              }
              updatedPhases.splice(targetIdx, 0, movedPhase);

              const nonPhases = prevNodes.filter((n) => n.type !== "phase");
              const positionedPhases = updatedPhases.map((p, idx) => ({
                ...p,
                position: {
                  ...p.position,
                  x: 100 + idx * 380,
                  y: 220
                }
              }));

              return [...nonPhases, ...positionedPhases];
            }
            return prevNodes;
          });
        }
      }}
      className={`h-[420px] sm:h-[450px] transition-all duration-350 rounded-[2rem] flex items-center justify-center shrink-0 relative ${
        !isActive 
          ? "w-0 opacity-0 pointer-events-none mx-0"
          : isOver
            ? "w-[240px] sm:w-[280px] border-2 border-dashed border-[#75E2FF] bg-[#75E2FF]/10 mx-2 scale-[0.99] shadow-[0_0_20px_rgba(117,226,255,0.15)] opacity-100"
            : "w-3 hover:w-5 hover:bg-current/[0.04] bg-transparent mx-0 mb-0 opacity-40 hover:opacity-100"
      }`}
    >
      <div 
        className={`transition-all duration-300 select-none flex flex-col items-center justify-center text-center leading-normal gap-1.5 p-4 pointer-events-none ${
          isOver ? "opacity-100 scale-100 text-[#75E2FF]" : "opacity-0 scale-95 text-current"
        }`}
        style={{ fontFamily: "'Gilroy', sans-serif" }}
      >
        <Layers className="w-6 h-6 text-primary animate-pulse" />
        <span className="text-[9px] uppercase font-black tracking-widest text-[#75E2FF]">Insert Phase</span>
        <span className="text-[7.5px] uppercase font-bold opacity-50 tracking-wider">Drop to Place Phase here</span>
      </div>
    </div>
  );
}
