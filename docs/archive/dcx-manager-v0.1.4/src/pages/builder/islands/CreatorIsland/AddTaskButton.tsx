import React from "react";
import { motion } from "motion/react";
import { CheckSquare } from "lucide-react";
import { useBuilder } from "../../context/BuilderContext";
import { useTheme } from "../../../../hooks/useTheme";


interface AddTaskButtonProps {
  onAddTaskToFirstAction?: () => void;
  hasActions: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
}

export function AddTaskButton({ 
onAddTaskToFirstAction, 
  hasActions,
  isDisabled = false,
  disabledReason
}: AddTaskButtonProps) {
  const { isDark } = useTheme();
  const { setDraggingType } = useBuilder();

  if (!hasActions || isDisabled) {
    const reason = !hasActions ? "No Action Node" : (disabledReason || "Unavailable");
    return (
      <div className="relative group/btn flex items-center justify-center select-none">
        {/* Tooltip above the button */}
        <span className={`absolute bottom-12 px-3 py-1.5 text-[9px] font-bold uppercase font-sans tracking-widest rounded-xl shadow-xl transition-all duration-300 pointer-events-none opacity-0 -translate-y-2 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 whitespace-nowrap z-50 border ${
          isDark
            ? "bg-black/90 border-white/10 text-rose-400"
            : "bg-white/95 border-black/10 text-rose-500 shadow-lg"
        }`}>
          {reason}
        </span>

        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-not-allowed border opacity-40 ${
            isDark
              ? "bg-white/5 border-white/5 text-gray-500"
              : "bg-black/5 border-black/5 text-gray-400"
          }`}
          title={reason}
        >
          <CheckSquare className="w-4 h-4 shrink-0 text-gray-400" />
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (onAddTaskToFirstAction) {
      onAddTaskToFirstAction();
    }
  };

  return (
    <div className="relative group/btn flex items-center justify-center">
      {/* Tooltip above the button */}
      <span className={`absolute bottom-12 px-3 py-1.5 text-[9px] font-bold uppercase font-sans tracking-widest rounded-xl shadow-xl transition-all duration-300 pointer-events-none opacity-0 -translate-y-2 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 whitespace-nowrap z-50 border ${
        isDark
          ? "bg-black/90 border-white/10 text-emerald-400"
          : "bg-white/95 border-black/10 text-emerald-600 shadow-lg"
      }`}>
        Add Task (Drag or Click)
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={handleClick}
        draggable={true}
        onDragStart={(e) => {
          setDraggingType("task");
          e.dataTransfer.setData("application/dcx-task-add", "new-task");
          e.dataTransfer.effectAllowed = "move";
          
          // Create custom ghost element
          const ghost = document.createElement('div');
          ghost.style.position = 'absolute';
          ghost.style.top = '-1000px';
          ghost.style.width = '140px';
          ghost.style.height = '40px';
          ghost.style.backgroundColor = isDark ? '#065F46' : '#10B981';
          ghost.style.borderRadius = '8px';
          ghost.style.display = 'flex';
          ghost.style.alignItems = 'center';
          ghost.style.padding = '0 12px';
          ghost.style.color = 'white';
          ghost.style.fontSize = '10px';
          ghost.style.fontWeight = 'bold';
          ghost.style.fontFamily = 'Gilroy, sans-serif';
          ghost.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
          ghost.innerText = 'NEW DELIVERY TASK';
          document.body.appendChild(ghost);
          e.dataTransfer.setDragImage(ghost, 70, 20);
          setTimeout(() => document.body.removeChild(ghost), 0);
        }}
        onDragEnd={() => setDraggingType(null)}
        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 border ${
          isDark
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            : "bg-black/5 border-black/5 text-neutral-800 hover:bg-neutral-905 hover:border-neutral-905 hover:text-white shadow-sm"
        }`}
        title="DRAG/DROP directly onto any ACTION CARD, or click to append"
      >
        <CheckSquare className="w-4 h-4 shrink-0 text-emerald-400 dark:text-emerald-400 text-current" />
      </motion.button>
    </div>
  );
}
