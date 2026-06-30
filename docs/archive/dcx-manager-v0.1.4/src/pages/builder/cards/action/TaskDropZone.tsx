import React, { useState } from "react";
import { useBuilder } from "../../context/BuilderContext";
import { TaskCardData } from "../../../../types";

interface TaskDropZoneProps {
  key?: React.Key | string;
  index: number;
  cardId: string;
  onMoveTaskDirectly: (
    taskData: TaskCardData,
    sourceCardId: string,
    targetCardId: string,
    insertIndex: number
  ) => void;
  isSmall?: boolean;
}

export function TaskDropZone({ 
  index, 
cardId, 
  onMoveTaskDirectly,
  isSmall = false
}: TaskDropZoneProps) {
  const { draggingType } = useBuilder();
  const [isOver, setIsOver] = useState(false);

  const isActive = draggingType === "task";

  // Compute layout classes based on adaptive layout
  const baseClasses = "transition-all duration-300 relative flex items-center justify-center select-none shrink-0";
  
  let layoutClasses = "";
  if (!isActive) {
    layoutClasses = "w-0 h-0 opacity-0 pointer-events-none overflow-hidden m-0 p-0 border-0";
  } else if (isSmall) {
    // Sized to match small cards vertically, expands horizontally
    if (isOver) {
      layoutClasses = "h-[68px] w-12 border-2 border-dashed border-[#75E2FF]/60 bg-[#75E2FF]/5 opacity-100 mx-1 rounded-[1.1rem]";
    } else {
      layoutClasses = "h-[68px] w-1 hover:w-3 opacity-0 hover:opacity-100 hover:border hover:border-dashed hover:border-current/15 hover:mx-1 rounded-[0.3rem]";
    }
  } else {
    // Sized as a full width row element
    if (isOver) {
      layoutClasses = "w-full h-12 border-2 border-dashed border-[#75E2FF]/60 bg-[#75E2FF]/5 opacity-100 my-1 rounded-xl";
    } else {
      layoutClasses = "w-full h-1 hover:h-2.5 opacity-0 hover:opacity-100 hover:border hover:border-dashed hover:border-current/10 hover:my-1";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        const types = Array.from(e.dataTransfer.types);
        if (
          types.includes("application/dcx-task-add") ||
          types.includes("application/dcx-task-move")
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
        
        const moveDataString = e.dataTransfer.getData("application/dcx-task-move");
        if (moveDataString) {
          try {
            const { task, sourceActionCardId } = JSON.parse(moveDataString);
            onMoveTaskDirectly(task, sourceActionCardId, cardId, index);
          } catch (err) {
            console.error(err);
          }
        }
      }}
      className={`${baseClasses} ${layoutClasses}`}
    >
      {isOver && (
        <div 
          className="text-[7px] font-black uppercase tracking-widest text-center transition-all text-[#75E2FF] scale-102 leading-none"
          style={{ fontFamily: "'Gilroy', sans-serif" }}
        >
          {isSmall ? "↓" : "↓ Drop Task Here ↓"}
        </div>
      )}
    </div>
  );
}
