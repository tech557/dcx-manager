import React from "react";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { useBuilder } from "../../context/BuilderContext";
import { useTheme } from "../../../../hooks/useTheme";


interface AddPhaseButtonProps {
  onAddPhase: () => void;
}

export function AddPhaseButton({ onAddPhase }: AddPhaseButtonProps) {
  const { isDark } = useTheme();
  const { setDraggingType } = useBuilder();

  return (
    <div className="relative group/btn flex items-center justify-center">
      {/* Tooltip above the button */}
      <span className={`absolute bottom-12 px-3 py-1.5 text-[9px] font-bold uppercase font-sans tracking-widest rounded-xl shadow-xl transition-all duration-300 pointer-events-none opacity-0 -translate-y-2 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 whitespace-nowrap z-50 border ${
        isDark
          ? "bg-black/90 border-white/10 text-[#75E2FF]"
          : "bg-white/95 border-black/10 text-black shadow-lg"
      }`}>
        Add Phase (Drag or Click)
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={onAddPhase}
        draggable={true}
        onDragStart={(e) => {
          setDraggingType("phase");
          e.dataTransfer.setData("application/dcx-phase-add", "new-phase");
          e.dataTransfer.effectAllowed = "move";
          
          // Create custom ghost element looking like a phase column head
          const ghost = document.createElement('div');
          ghost.style.position = 'absolute';
          ghost.style.top = '-1000px';
          ghost.style.width = '200px';
          ghost.style.height = '40px';
          ghost.style.backgroundColor = isDark ? '#1a1a1b' : '#ffffff';
          ghost.style.borderTop = `3px solid ${isDark ? '#75E2FF' : '#000000'}`;
          ghost.style.borderRadius = '4px 4px 12px 12px';
          ghost.style.display = 'flex';
          ghost.style.alignItems = 'center';
          ghost.style.padding = '0 16px';
          ghost.style.color = isDark ? 'white' : 'black';
          ghost.style.fontFamily = 'Gilroy, sans-serif';
          ghost.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
          
          const title = document.createElement('span');
          title.style.fontSize = '9px';
          title.style.fontWeight = '900';
          title.style.textTransform = 'uppercase';
          title.style.letterSpacing = '0.3em';
          title.style.opacity = '0.5';
          title.innerText = 'STAGING PHASE';
          
          ghost.appendChild(title);
          document.body.appendChild(ghost);
          e.dataTransfer.setDragImage(ghost, 100, 20);
          setTimeout(() => document.body.removeChild(ghost), 0);
        }}
        onDragEnd={() => setDraggingType(null)}
        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 border ${
          isDark
            ? "bg-[#75E2FF]/10 border-[#75E2FF]/20 text-[#75E2FF] hover:bg-[#75E2FF]/20 hover:border-[#75E2FF]/40 hover:shadow-[0_0_12px_rgba(117,226,255,0.2)]"
            : "bg-black/5 border-black/5 text-neutral-800 hover:bg-neutral-900 hover:border-neutral-900 hover:text-white shadow-sm"
        }`}
        title="Drag to pipeline layout to place, or click to append"
      >
        <Layers className="w-4 h-4 shrink-0" />
      </motion.button>
    </div>
  );
}
