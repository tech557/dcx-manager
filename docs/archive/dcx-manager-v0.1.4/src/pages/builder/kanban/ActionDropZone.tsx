import React, { useState } from "react";
import { useBuilder } from "../context/BuilderContext";

interface ActionDropZoneProps {
  index: number;
  phaseId: string;
  onAddDragAction: (phaseId: string, insertIndex?: number) => void;
  onMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
}

export function ActionDropZone({ 
  index, 
  phaseId, 
onAddDragAction, 
  onMoveCardDirectly 
}: ActionDropZoneProps) {
  const { draggingType } = useBuilder();
  const [isOver, setIsOver] = useState(false);

  const isActive = draggingType === "action";

  return (
    <div
      onDragOver={(e) => {
        const types = Array.from(e.dataTransfer.types);
        if (
          types.includes("application/dcx-action-add") || 
          types.includes("application/dcx-action-move")
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

        const dragAddType = e.dataTransfer.getData("application/dcx-action-add");
        const moveDataString = e.dataTransfer.getData("application/dcx-action-move");

        if (dragAddType === "new" || dragAddType === "new-action") {
          onAddDragAction(phaseId, index);
        } else if (moveDataString) {
          try {
            const { cardId, sourcePhaseId } = JSON.parse(moveDataString);
            onMoveCardDirectly(sourcePhaseId, phaseId, cardId, index);
          } catch (err) {
            console.error("Failed to parse action move drop-zone entry", err);
          }
        }
      }}
      className={`transition-all duration-300 relative rounded-2xl flex items-center justify-center ${
        !isActive
          ? "h-0 opacity-0 pointer-events-none"
          : isOver 
            ? "h-16 py-2 border-2 border-dashed border-[#75E2FF]/60 bg-[#75E2FF]/10 opacity-100 my-1" 
            : "h-2 hover:h-4 opacity-0 hover:opacity-100 hover:border hover:border-dashed hover:border-current/20 hover:my-1"
      }`}
    >
      <div 
        className={`text-[8px] font-black uppercase tracking-widest text-center transition-all ${
          isOver ? "text-[#75E2FF] scale-105" : "text-current opacity-40 hover:opacity-80"
        }`}
        style={{ fontFamily: "'Gilroy', sans-serif" }}
      >
        {isOver ? "↓ Drop to Place Action Here ↓" : "+ Drop / Insert Action"}
      </div>
    </div>
  );
}
