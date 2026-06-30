import React from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useBuilder } from "../../context/BuilderContext";
import { useTheme } from "../../../../hooks/useTheme";


interface AddActionButtonProps {
  onAddAction: () => void;
  hasPhases: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
}

export function AddActionButton({ 
onAddAction, 
  hasPhases,
  isDisabled = false,
  disabledReason
}: AddActionButtonProps) {
  const { isDark } = useTheme();
  const { setDraggingType } = useBuilder();

  if (!hasPhases || isDisabled) {
    const reason = !hasPhases ? "Needs Phase First" : (disabledReason || "Unavailable");
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
          className={`w-10 h-10 rounded-full flex items-center justify-center border opacity-30 select-none ${
            isDark
              ? "bg-white/5 border-white/5 text-gray-500"
              : "bg-black/5 border-black/5 text-gray-400"
          }`}
          title={reason}
        >
          <Play className="w-4 h-4 shrink-0 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/btn flex items-center justify-center">
      {/* Tooltip above the button */}
      <span className={`absolute bottom-12 px-3 py-1.5 text-[9px] font-bold uppercase font-sans tracking-widest rounded-xl shadow-xl transition-all duration-300 pointer-events-none opacity-0 -translate-y-2 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 whitespace-nowrap z-50 border ${
        isDark
          ? "bg-black/90 border-white/10 text-[#75E2FF]"
          : "bg-white/95 border-black/10 text-black shadow-lg"
      }`}>
        Add Action (Drag or Click)
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={onAddAction}
        draggable={true}
        onDragStart={(e) => {
          setDraggingType("action");
          e.dataTransfer.setData("application/dcx-action-add", "new");
          e.dataTransfer.effectAllowed = "move";
          
          // Create custom ghost element looking like an action card
          const ghost = document.createElement('div');
          ghost.style.position = 'absolute';
          ghost.style.top = '-1000px';
          ghost.style.width = '180px';
          ghost.style.height = '60px';
          ghost.style.backgroundColor = isDark ? '#1a1a1b' : '#ffffff';
          ghost.style.border = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)';
          ghost.style.borderRadius = '12px';
          ghost.style.display = 'flex';
          ghost.style.flexDirection = 'column';
          ghost.style.justifyContent = 'center';
          ghost.style.padding = '0 16px';
          ghost.style.color = isDark ? 'white' : 'black';
          ghost.style.fontFamily = 'Gilroy, sans-serif';
          ghost.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
          
          const label = document.createElement('span');
          label.style.fontSize = '8px';
          label.style.fontWeight = '900';
          label.style.textTransform = 'uppercase';
          label.style.opacity = '0.4';
          label.style.letterSpacing = '0.2em';
          label.innerText = 'STAGING ACTION';
          
          const title = document.createElement('span');
          title.style.fontSize = '12px';
          title.style.fontWeight = 'bold';
          title.innerText = 'NEW CAMPAIGN ACTION';
          
          ghost.appendChild(label);
          ghost.appendChild(title);
          document.body.appendChild(ghost);
          e.dataTransfer.setDragImage(ghost, 90, 30);
          setTimeout(() => document.body.removeChild(ghost), 0);
        }}
        onDragEnd={() => setDraggingType(null)}
        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 border ${
          isDark
            ? "bg-[#75E2FF]/10 border-[#75E2FF]/20 text-[#75E2FF] hover:bg-[#75E2FF]/20 hover:border-[#75E2FF]/40 hover:shadow-[0_0_12px_rgba(117,226,255,0.2)]"
            : "bg-black/5 border-black/5 text-neutral-800 hover:bg-neutral-900 hover:border-neutral-900 hover:text-white shadow-sm"
        }`}
        title="Drag onto a specific phase, or click to build action"
      >
        <Play className="w-4 h-4 shrink-0 text-[#75E2FF] dark:text-[#75E2FF] text-current" />
      </motion.button>
    </div>
  );
}
