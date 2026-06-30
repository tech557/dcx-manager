import React from "react";
import { motion } from "motion/react";
import { CheckSquare, ChevronRight, Layers } from "lucide-react";
import { SURFACE, BLUR, SHADOW } from "../../../styles/tokens";
import { PHASE_ICONS_MAP } from "../cards/phase/PhaseIcons";
import { useBuilder } from "../context/BuilderContext";
import { useBuilderStore } from "../../../store/builderStore";
import { useTheme } from "../../../hooks/useTheme";


interface KanbanColumnCollapsedProps {
  phaseNode: any;
  index: number;
  isFocused: boolean;
  isFilteredDimmed: boolean;
  totalColumnTasks: number;
  dragHoverTimer: NodeJS.Timeout | null;
  setDragHoverTimer: (timer: NodeJS.Timeout | null) => void;
  onUpdatePhaseField: (phaseId: string, updates: any) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function KanbanColumnCollapsed({
  phaseNode,
  index,
isFocused,
  isFilteredDimmed,
  totalColumnTasks,
  dragHoverTimer,
  setDragHoverTimer,
  onUpdatePhaseField,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}: KanbanColumnCollapsedProps) {
  const { isDark } = useTheme();
  const { selectedIds, toggleSelection } = useBuilder();
  const isSelected = selectedIds.has(phaseNode.id);

  const data = phaseNode.data;
  const iconConfig = PHASE_ICONS_MAP[data.icon] || PHASE_ICONS_MAP.awareness;
  const IconComponent = iconConfig?.icon || Layers;

  const isGlobalHighlightActive = useBuilderStore((s) => s.anyHighlightActive);

  return (
    <motion.div
      id={phaseNode.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={(e) => {
        onDragOver(e);
        e.preventDefault();
        const types = Array.from(e.dataTransfer.types);
        if (
          types.includes("application/dcx-action-add") ||
          types.includes("application/dcx-action-move") ||
          types.includes("application/dcx-task-add") ||
          types.includes("application/dcx-task-move") ||
          types.includes("application/dcx-phase-add")
        ) {
          if (!dragHoverTimer) {
            const timer = setTimeout(() => {
              onUpdatePhaseField(phaseNode.id, { isCollapsed: false });
            }, 600);
            setDragHoverTimer(timer);
          }
        }
      }}
      onDragLeave={(e) => {
        onDragLeave(e);
        if (dragHoverTimer) {
          clearTimeout(dragHoverTimer);
          setDragHoverTimer(null);
        }
      }}
      onDrop={(e) => {
        onDrop(e);
        if (dragHoverTimer) {
          clearTimeout(dragHoverTimer);
          setDragHoverTimer(null);
        }
      }}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          e.stopPropagation();
          e.preventDefault();
          toggleSelection(phaseNode.id, true);
        }
      }}
      className={`flex flex-col items-center justify-between h-[420px] sm:h-[450px] rounded-[2rem] border ${BLUR.heavy} p-4 w-[74px] shrink-0 transition-all duration-500 relative cursor-grab active:cursor-grabbing select-none group/col ${
        isSelected
          ? isDark
            ? "border-[#75E2FF]/30 bg-[#75E2FF]/10 shadow-[0_0_35px_rgba(117,226,255,0.15)] z-30"
            : "border-[#75E2FF]/20 bg-[#75E2FF]/5 shadow-[0_0_30px_rgba(117,226,255,0.12)] z-30"
          : isFocused && !isGlobalHighlightActive
            ? "border-[#75E2FF]/20 z-30 shadow-[0_0_15px_rgba(117,226,255,0.1)]"
            : isFilteredDimmed
              ? "opacity-25 grayscale border-dashed blur-[0.5px] scale-95 pointer-events-none"
              : isDark
                ? `${SURFACE.dark.glass} hover:bg-black/35 hover:border-white/[0.05]`
                : `${SURFACE.light.glass} hover:bg-white/60 hover:border-black/[0.08]`
      }`}
      onDoubleClick={() => onUpdatePhaseField(phaseNode.id, { isCollapsed: false })}
      title="Double click to expand Phase"
    >
      {/* Top block */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <div className={`p-2.5 rounded-xl transition-all ${
          isDark ? "bg-white/5 text-[#75E2FF]" : "bg-black/5 text-neutral-800"
        }`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <span className="text-[9px] font-black font-mono tracking-tight opacity-40">
          P{index + 1}
        </span>
      </div>

      {/* Center block - Vertically rotated title */}
      <div className="flex-1 flex items-center justify-center my-4 overflow-hidden pointer-events-none">
        <span className="font-sans font-black text-xs text-current tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 block whitespace-nowrap opacity-65 group-hover/col:opacity-100 group-hover/col:text-[#75E2FF] transition-all duration-300">
          {data.label || `Phase ${index + 1}`}
        </span>
      </div>

      {/* Bottom block */}
      <div className="flex flex-col items-center gap-2 pb-1">
        <div 
          className={`p-1.5 rounded-lg text-[9px] font-mono font-bold flex flex-col items-center gap-0.5 min-w-[36px] ${
            isDark ? "bg-white/5 text-[#75E2FF]" : "bg-black/5 text-neutral-800"
          }`}
          title={`${totalColumnTasks} tasks allocated`}
        >
          <CheckSquare className="w-3 h-3 text-[#75E2FF] opacity-70" />
          <span>{totalColumnTasks}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdatePhaseField(phaseNode.id, { isCollapsed: false });
          }}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            isDark ? "bg-white/5 hover:bg-white/15 text-[#75E2FF]" : "bg-black/5 hover:bg-black/15 text-neutral-800"
          }`}
          title="Expand Phase"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
