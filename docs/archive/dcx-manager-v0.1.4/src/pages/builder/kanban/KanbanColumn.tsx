import React from "react";
import { motion } from "motion/react";
import { SURFACE, BLUR, SHADOW } from "../../../styles/tokens";
import { ActionCardData, TaskCardData } from "../../../types";
import { KanbanColumnCollapsed } from "./KanbanColumnCollapsed";
import { KanbanColumnHeader } from "./KanbanColumnHeader";
import { useNewObjectHighlight } from "../hooks/useNewObjectHighlight";
import { useBuilder } from "../context/BuilderContext";
import { useBuilderStore } from "../../../store/builderStore";
import { useKanbanColumnEvents } from "./useKanbanColumnEvents";
import { usePhaseActions } from "../cards/phase/usePhaseActions";
import { PhaseActionList } from "../cards/phase/PhaseActionList";
import { PhaseFooter } from "../cards/phase/PhaseFooter";
import { useTheme } from "../../../hooks/useTheme";


interface KanbanColumnProps {
  key?: any;
  phaseNode: any;
  index: number;
  allPhases: any[];
  isFilteredDimmed: any;
  isFocused: boolean;
  isStageOut?: boolean;
  onUpdatePhaseField: (phaseId: string, updates: any) => void;
  onDeletePhase: (phaseId: string) => void;
  onDuplicatePhase: (phaseId: string) => void;
  onAddDragAction: (targetPhaseId: string, insertIndex?: number) => void;
  onMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
  onUpdateNodesDirectly: any;
  onStartEditTask?: (task: TaskCardData, phaseId: string, actionCardId: string) => void;
}

export function KanbanColumn({
phaseNode,
  index,
  allPhases,
  isFilteredDimmed,
  isFocused,
  isStageOut = false,
  onUpdatePhaseField,
  onDeletePhase,
  onDuplicatePhase,
  onAddDragAction,
  onMoveCardDirectly,
  onUpdateNodesDirectly,
  onStartEditTask
}: KanbanColumnProps) {
  const { isDark } = useTheme();
  const { selectedIds, toggleSelection } = useBuilder();
  const isSelected = selectedIds.has(phaseNode.id);

  const data = phaseNode.data;
  const actionCards: ActionCardData[] = data.actionCards || [];

  const {
    isColumnDragOver,
    dragHoverTimer,
    setDragHoverTimer,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useKanbanColumnEvents({
    phaseNode,
    onUpdatePhaseField,
    onAddDragAction,
    onMoveCardDirectly,
    onUpdateNodesDirectly
  });

  const {
    handleDeleteAction,
    handleEditAction,
    handleDuplicateAction
  } = usePhaseActions({
    phaseId: phaseNode.id,
    actionCards,
    onUpdatePhaseField
  });

  // Highlight and scroll newly created phase columns
  const { isNewlyCreated } = useNewObjectHighlight(phaseNode.id, {
    scrollInline: "center"
  });

  // Format calculated date span for this Phase Column
  const segmentStart = actionCards.length > 0 
    ? actionCards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, actionCards[0].startDate) 
    : data.startDate || new Date().toISOString().split('T')[0];
  const segmentEnd = actionCards.length > 0 
    ? actionCards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, actionCards[0].endDate) 
    : data.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const totalColumnTasks = actionCards.reduce((acc, card) => acc + (card.tasks?.length || 0), 0);

  // Convert dates to a formatted visual preview
  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const isCollapsed = !!data.isCollapsed;
  const isGlobalHighlightActive = useBuilderStore((s) => s.anyHighlightActive);
  const allowHoverEffects = !isGlobalHighlightActive || isNewlyCreated;

  if (isStageOut) {
    return (
      <div
        id={phaseNode.id}
        className={`${isCollapsed ? "w-20" : "w-80 sm:w-[330px]"} shrink-0 pointer-events-none opacity-0`}
        style={{ height: isCollapsed ? '480px' : '340px' }}
      />
    );
  }

  if (isCollapsed) {
    return (
      <KanbanColumnCollapsed
        phaseNode={phaseNode}
        index={index}
        isFocused={isFocused}
        isFilteredDimmed={isFilteredDimmed}
        totalColumnTasks={totalColumnTasks}
        dragHoverTimer={dragHoverTimer}
        setDragHoverTimer={setDragHoverTimer}
        onUpdatePhaseField={onUpdatePhaseField}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
    );
  }

  return (
    <motion.div
      id={phaseNode.id}
      initial={{ opacity: 0, y: 20 }}
      animate={isNewlyCreated ? {
        opacity: 1,
        y: 0,
        boxShadow: [
          "0 0 0px rgba(117,226,255,0)",
          "0 0 25px rgba(117,226,255,0.2)",
          "0 0 0px rgba(117,226,255,0)"
        ],
      } : { opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={isNewlyCreated ? {
        opacity: { duration: 0.4 },
        y: { duration: 0.4, ease: "easeOut" },
        boxShadow: { duration: 1.2, repeat: 0, delay: 0.2 }
      } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col max-h-full overflow-hidden rounded-[2rem] border ${BLUR.heavy} p-5 w-80 sm:w-[330px] shrink-0 transition-all duration-500 relative cursor-grab active:cursor-grabbing ${
        isSelected
          ? isDark
            ? "border-[#75E2FF]/40 bg-[#75E2FF]/5 z-30" 
            : "border-[#75E2FF]/30 bg-[#75E2FF]/2 z-30"
          : isNewlyCreated
            ? "border-[#75E2FF]/40 bg-[#75E2FF]/5 z-40 shadow-[0_0_20px_rgba(117,226,255,0.1)]"
            : isFocused && !isGlobalHighlightActive
              ? "border-[#75E2FF]/20 z-30"
              : isColumnDragOver
                ? "ring-2 ring-[#75E2FF]/40 border-[#75E2FF]/30 bg-[#75E2FF]/10 shadow-[0_0_25px_rgba(117,226,255,0.15)]"
                : isFilteredDimmed
                  ? "opacity-25 grayscale border-dashed blur-[0.5px] scale-95 pointer-events-none"
                  : isDark
                    ? `${SURFACE.dark.glass} ${SHADOW.card} ${allowHoverEffects ? "hover:bg-black/30 hover:border-white/[0.06] hover:-translate-y-1 hover:scale-[1.01]" : ""}`
                    : `${SURFACE.light.glass} shadow-[0_12px_45px_rgba(0,0,0,0.035)] ${allowHoverEffects ? "hover:bg-white/85 hover:border-black/[0.11] hover:-translate-y-1 hover:scale-[1.01]" : ""}`
      }`}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          e.stopPropagation();
          e.preventDefault();
          toggleSelection(phaseNode.id, true);
        }
      }}
      onDoubleClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target.closest("input") || 
          target.closest("select") || 
          target.closest("button") || 
          target.closest("textarea")
        ) {
          return;
        }
        onUpdatePhaseField(phaseNode.id, { isCollapsed: !isCollapsed });
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Col Header layout */}
      <KanbanColumnHeader
        phaseNode={phaseNode}
        index={index}
        onUpdatePhaseField={onUpdatePhaseField}
        onDuplicatePhase={onDuplicatePhase}
        onDeletePhase={onDeletePhase}
        onAddDragAction={onAddDragAction}
      />

      {/* Cards Row list scroll view */}
      <PhaseActionList
        phaseId={phaseNode.id}
        actionCards={actionCards}
        onAddDragAction={onAddDragAction}
        onMoveCardDirectly={onMoveCardDirectly}
        onUpdateNodesDirectly={onUpdateNodesDirectly}
        onStartEditTask={(task, actionCardId) => onStartEditTask?.(task, phaseNode.id, actionCardId)}
        handleDeleteAction={handleDeleteAction}
        handleEditAction={handleEditAction}
        handleDuplicateAction={handleDuplicateAction}
      />

      {/* Footer Dates, Stats, and Action triggers */}
      <PhaseFooter
        phaseId={phaseNode.id}
        actionCardsLength={actionCards.length}
        segmentStart={segmentStart}
        segmentEnd={segmentEnd}
        totalColumnTasks={totalColumnTasks}
        onUpdatePhaseField={onUpdatePhaseField}
        formatDateLabel={formatDateLabel}
      />
    </motion.div>
  );
}
