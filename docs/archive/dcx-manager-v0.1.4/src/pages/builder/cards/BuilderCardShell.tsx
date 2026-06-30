import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useBuilder } from "../context/BuilderContext";
import { useNewObjectHighlight } from "../hooks/useNewObjectHighlight";
import { useTheme } from "../../../hooks/useTheme";
import { BLUR, RADIUS, SURFACE, SHADOW } from "../../../styles/tokens";

export interface BuilderCardShellProps {
  id: string;
  isDraggable?: boolean;
  dragType?: "phase" | "action" | "task" | "day";
  dragData?: any; // Data helper to pass during onDragStart
  
  // Selection
  isSelected?: boolean;
  parentActionCardId?: string;
  parentPhaseId?: string;
  onSelect?: (e: React.MouseEvent) => void;
  
  // Visual variant
  variant?: "phase" | "action" | "task-full" | "task-small" | "day";
  isMonthly?: boolean; // For task-small custom styling
  
  // Highlight (newly created)
  isHighlighted?: boolean;
  isDragOver?: boolean;
  
  // Handlers/Container custom overrides
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  
  children: React.ReactNode | ((props: { isNewlyCreated: boolean; showData: boolean; isSelected: boolean }) => React.ReactNode);
}

export function BuilderCardShell({
  id,
  isDraggable = false,
  dragType,
  dragData,
  isSelected: isSelectedProp,
  parentActionCardId,
  parentPhaseId,
  onSelect,
  variant = "action",
  isMonthly = false,
  isHighlighted = false,
  isDragOver = false,
  className = "",
  style,
  onClick,
  onDoubleClick,
  onDragOver,
  onDragLeave,
  onDrop,
  children
}: BuilderCardShellProps) {
  const { isDark } = useTheme();
  const { selectedIds, toggleSelection, setDraggingType } = useBuilder();

  // 1. Core Selection Logic Check
  const isSelectedComputed = selectedIds.has(id) || 
    (parentActionCardId && selectedIds.has(parentActionCardId)) || 
    (parentPhaseId && selectedIds.has(parentPhaseId));
  
  const isSelected = isSelectedProp !== undefined ? isSelectedProp : isSelectedComputed;

  // 2. New Object Highlight / Creation Glow
  const { isNewlyCreated, showData } = useNewObjectHighlight(id);

  // 3. Handle default multi-selection via Ctrl/Cmd + click
  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    if (e.ctrlKey || e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      if (onSelect) {
        onSelect(e);
      } else {
        toggleSelection(id, true);
      }
    }
  };

  // 4. Drag & drop event callbacks
  const handleDragStart = (e: React.DragEvent) => {
    if (!isDraggable) return;
    if (dragType) {
      setDraggingType(dragType);
    }
    e.stopPropagation();

    if (dragType === "action" && dragData) {
      e.dataTransfer.setData(
        "application/dcx-action-move",
        JSON.stringify({ cardId: id, sourcePhaseId: dragData.sourcePhaseId })
      );
      e.dataTransfer.effectAllowed = "move";

      // Create beautiful custom ghost element for dragging
      const ghost = document.createElement("div");
      ghost.style.position = "absolute";
      ghost.style.top = "-1000px";
      ghost.style.padding = "12px 20px";
      ghost.style.background = isDark ? "#1A1A1B" : "#FFFFFF";
      ghost.style.border = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)";
      ghost.style.borderRadius = "1.2rem";
      ghost.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
      ghost.style.zIndex = "9999";
      ghost.style.pointerEvents = "none";
      
      const text = document.createElement("div");
      text.innerText = (dragData.name || "Action").toUpperCase();
      text.style.color = "#75E2FF";
      text.style.fontSize = "10px";
      text.style.fontWeight = "900";
      text.style.letterSpacing = "0.1em";
      text.style.fontFamily = "Gilroy, sans-serif";
      ghost.appendChild(text);

      const sub = document.createElement("div");
      sub.innerText = "MOVING ACTION";
      sub.style.color = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
      sub.style.fontSize = "8px";
      sub.style.fontWeight = "bold";
      sub.style.marginTop = "2px";
      ghost.appendChild(sub);

      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 0, 0);
      setTimeout(() => document.body.removeChild(ghost), 0);
    }

    if (dragType === "task" && dragData) {
      e.dataTransfer.setData(
        "application/dcx-task-move",
        JSON.stringify({ task: dragData.task, sourceActionCardId: dragData.sourceActionCardId })
      );
      e.dataTransfer.effectAllowed = "move";

      // Create beautiful custom ghost element for dragging
      const ghost = document.createElement("div");
      ghost.style.position = "absolute";
      ghost.style.top = "-1000px";
      ghost.style.padding = "10px 18px";
      ghost.style.background = isDark ? "#1A1A1B" : "#FFFFFF";
      ghost.style.border = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)";
      ghost.style.borderRadius = "1rem";
      ghost.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
      ghost.style.zIndex = "9999";
      ghost.style.pointerEvents = "none";
      
      const text = document.createElement("div");
      text.innerText = (dragData.task?.name || "Task").toUpperCase();
      text.style.color = "#75E2FF";
      text.style.fontSize = "9px";
      text.style.fontWeight = "900";
      text.style.letterSpacing = "0.08em";
      text.style.fontFamily = "Gilroy, sans-serif";
      ghost.appendChild(text);

      const sub = document.createElement("div");
      sub.innerText = "MOVING TASK";
      sub.style.color = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
      sub.style.fontSize = "7px";
      sub.style.fontWeight = "bold";
      sub.style.marginTop = "1px";
      ghost.appendChild(sub);

      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 0, 0);
      setTimeout(() => document.body.removeChild(ghost), 0);
    }
  };

  const handleDragEnd = () => {
    if (isDraggable) {
      setDraggingType(null);
    }
  };

  // 5. Build style configurations contextually using a clean, token-driven config
  const CARD_STYLE_CONFIG = {
    phase: {
      radius: RADIUS.card,
      dark: {
        base: `${SURFACE.dark.glass} ${SHADOW.card}`,
        hover: "hover:bg-black/30 hover:border-white/[0.08]",
        selected: "ring-2 ring-[#75E2FF] shadow-[0_0_20px_rgba(117,226,255,0.25)] border-[#75E2FF]/40 bg-black/40",
        highlight: `border-white/[0.06] ${SHADOW.glow} bg-[#75E2FF]/5 z-40`,
      },
      light: {
        base: `${SURFACE.light.glass} shadow-[0_12px_40px_rgba(0,0,0,0.04)]`,
        hover: "hover:bg-white/90 hover:border-black/[0.12]",
        selected: "ring-2 ring-black shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white/90",
        highlight: "border-black/[0.06] shadow-[0_0_15px_rgba(117,226,255,0.1)] bg-[#75E2FF]/2 z-40",
      }
    },
    action: {
      radius: RADIUS.panel,
      dark: {
        base: "bg-black/25 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        hover: "hover:bg-[#151516]/60 hover:border-white/[0.08]",
        selected: "border-[#75E2FF]/30 bg-[#75E2FF]/20 shadow-[0_0_24px_rgba(117,226,255,0.18)]",
        highlight: `border-white/[0.06] ${SHADOW.glow} bg-[#75E2FF]/5 z-40`,
      },
      light: {
        base: "bg-white/75 border border-[#151516]/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.03)]",
        hover: "hover:bg-white/95 hover:border-black/[0.12]",
        selected: "border-[#75E2FF]/20 bg-[#75E2FF]/15 shadow-[0_0_20px_rgba(117,226,255,0.12)]",
        highlight: "border-black/[0.06] shadow-[0_0_15px_rgba(117,226,255,0.1)] bg-[#75E2FF]/2 z-40",
      }
    },
    "task-full": {
      radius: "rounded-[1.4rem]",
      dark: {
        base: "bg-black/20 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        hover: "hover:scale-[1.012] hover:-translate-y-0.5 transition-all duration-500 hover:bg-[#151516]/50 hover:border-white/[0.08]",
        selected: "border-[#75E2FF]/30 bg-[#75E2FF]/20 shadow-[0_0_18px_rgba(117,226,255,0.22)] text-neutral-100",
        highlight: `border-white/[0.06] shadow-[0_0_15px_rgba(117,226,255,0.15)] bg-[#75E2FF]/5 z-40`,
      },
      light: {
        base: "bg-white/75 border border-[#151516]/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.02)]",
        hover: "hover:scale-[1.012] hover:-translate-y-0.5 transition-all duration-500 hover:bg-white/95 hover:border-black/[0.1]",
        selected: "border-[#75E2FF]/20 bg-[#75E2FF]/15 shadow-[0_0_15px_rgba(117,226,255,0.15)] text-neutral-900",
        highlight: "border-black/[0.06] shadow-[0_0_10px_rgba(117,226,255,0.1)] bg-[#75E2FF]/2 z-40",
      }
    },
    "task-small": {
      radius: isMonthly ? RADIUS.sm : "rounded-[1.1rem]",
      dark: {
        base: "bg-black/25 border-white/[0.04] text-neutral-300",
        hover: "hover:scale-[1.04] transition-all duration-300 hover:bg-black/40 hover:border-white/[0.12]",
        selected: "border-[#75E2FF]/30 bg-[#75E2FF]/25 shadow-[0_0_12px_rgba(117,226,255,0.25)] text-neutral-200",
        highlight: `border-white/[0.06] shadow-[0_0_15px_rgba(117,226,255,0.15)] bg-[#75E2FF]/5 z-40`,
      },
      light: {
        base: "bg-white/80 border-slate-200 text-neutral-700",
        hover: "hover:scale-[1.04] transition-all duration-300 hover:bg-white hover:border-black/[0.15]",
        selected: "border-[#75E2FF]/20 bg-[#75E2FF]/20 shadow-[0_0_12px_rgba(117,226,255,0.18)] text-neutral-800",
        highlight: "border-black/[0.06] shadow-[0_0_10px_rgba(117,226,255,0.1)] bg-[#75E2FF]/3 z-40",
      }
    },
    day: {
      radius: RADIUS.panel,
      dark: {
        base: "bg-black/20 border-white/[0.03]",
        hover: "hover:bg-black/30",
        selected: "border-[#75E2FF]/30 bg-[#75E2FF]/10 shadow-lg",
        highlight: `border-white/[0.06] ${SHADOW.glow} bg-[#75E2FF]/5 z-40`,
      },
      light: {
        base: "bg-white/70 border border-black/[0.05]",
        hover: "hover:bg-white/80",
        selected: "border-black/20 bg-neutral-100",
        highlight: "border-black/[0.06] shadow-[0_0_15px_rgba(117,226,255,0.1)] bg-[#75E2FF]/2 z-40",
      }
    }
  } as const;

  const styleConfig = CARD_STYLE_CONFIG[variant] || CARD_STYLE_CONFIG.day;
  const themeConfig = isDark ? styleConfig.dark : styleConfig.light;
  const radiusClass = styleConfig.radius;

  const conditionalClasses = isDragOver
    ? "ring-2 ring-emerald-400 border-emerald-400/40 bg-[#34d399]/10 scale-[1.02] shadow-[0_0_25px_rgba(52,211,153,0.35)]"
    : isSelected
      ? themeConfig.selected
      : isNewlyCreated
        ? themeConfig.highlight
        : `${themeConfig.base} ${themeConfig.hover}`;

  return (
    <motion.div
      id={id}
      layoutId={variant.startsWith("task") ? `task-card-container-${id}` : undefined}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`${radiusClass} border ${BLUR.heavy} text-left flex flex-col transition-all duration-500 relative select-none ${conditionalClasses} ${className}`}
      style={style}
    >
      {/* Newly Created Shimmer Spark Effect */}
      {isNewlyCreated && (
        <span className={`absolute inset-0 overflow-hidden pointer-events-none z-50 ${radiusClass}`}>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#75E2FF]/20 to-transparent -translate-x-full animate-shimmer" />
        </span>
      )}

      {/* Actual inner contents */}
      {typeof children === "function"
        ? children({ isNewlyCreated, showData, isSelected })
        : children}
    </motion.div>
  );
}
