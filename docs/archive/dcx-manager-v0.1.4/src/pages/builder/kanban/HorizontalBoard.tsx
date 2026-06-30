import React, { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Layers } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { EmptyStatePlaceholder } from "./EmptyStatePlaceholder";
import { PhaseDropZone } from "../cards/phase/PhaseDropZone";
import { NavigationArrows } from "../tooltips/NavigationArrows";
import { useColumnBoundaryEffects } from "./useColumnBoundaryEffects";
import { useHorizontalBoardScroll } from "./useHorizontalBoardScroll";
import { useBuilder } from "../context/BuilderContext";
import { BLUR } from "../../../styles/tokens";
import { useTheme } from "../../../hooks/useTheme";


interface HorizontalBoardProps {
  phases: any[];
  allPhases: { id: string; label: string }[];
  isDragOverWorkspace: boolean;
  setIsDragOverWorkspace: (val: boolean) => void;
  scrollerAlignClass: string;
  dynamicTopPadding: string;
  maxActionsCount: number;
  editingTask: any;
  zoomScale: number;
  activeFilterIcon: string | null;
  focusedColumnId: string | null;
  updatePhaseField: (phaseId: string, updates: any) => void;
  deletePhase: (phaseId: string) => void;
  duplicatePhase: (phaseId: string) => void;
  onAddDragAction: (t: string) => void;
  onMoveCardDirectly: (s: string, t: string, c: string) => void;
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddPhase: (index?: number) => void;
  onStartEditTask: (task: any, phaseId: string, actionCardId: string) => void;
  isLeftExpanded?: boolean;
  isRightExpanded?: boolean;
}

export function HorizontalBoard({
phases,
  allPhases,
  isDragOverWorkspace,
  setIsDragOverWorkspace,
  scrollerAlignClass,
  dynamicTopPadding,
  maxActionsCount,
  editingTask,
  zoomScale,
  activeFilterIcon,
  focusedColumnId,
  updatePhaseField,
  deletePhase,
  duplicatePhase,
  onAddDragAction,
  onMoveCardDirectly,
  setNodes,
  handleAddPhase,
  onStartEditTask,
  isLeftExpanded = false,
  isRightExpanded = false,
}: HorizontalBoardProps) {
  const { isDark } = useTheme();
  const { draggingType } = useBuilder();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const {
    showLeftArrow,
    setShowLeftArrow,
    showRightArrow,
    setShowRightArrow,
    handleScrollLeft,
    handleScrollRight,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useHorizontalBoardScroll({
    scrollerRef,
    setIsDragOverWorkspace,
    handleAddPhase
  });

  const { columnUiStates } = useColumnBoundaryEffects({
    scrollerRef,
    phases,
    editingTask,
    zoomScale,
    activeFilterIcon,
    isLeftExpanded,
    isRightExpanded,
    setShowLeftArrow,
    setShowRightArrow
  });

  React.useEffect(() => {
    if (editingTask && scrollerRef.current) {
      const targetPhaseId = editingTask.phaseId;
      if (targetPhaseId) {
        // Wait briefly for layout and spring animations to stabilize so that coordinates are accurate
        const timer = setTimeout(() => {
          const colEl = document.getElementById(targetPhaseId);
          const scroller = scrollerRef.current;
          if (colEl && scroller) {
            const rect = colEl.getBoundingClientRect();
            const scrollerRect = scroller.getBoundingClientRect();
            // The editor island can be up to 380px wide - we want the column to be fully visible (at least 400px from start)
            const currentScrollLeft = scroller.scrollLeft;
            const targetX = rect.left - scrollerRect.left;
            
            if (targetX < 400) {
              scroller.scrollTo({
                left: currentScrollLeft + (targetX - 400),
                behavior: "smooth"
              });
            }
          }
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [editingTask]);

  return (
    <div className="flex-grow flex-1 min-h-0 flex flex-col justify-center w-full relative">
      {/* Scroller Canvas (Z-index: 15) */}
      <motion.div 
        layout
        ref={scrollerRef}
        onScroll={() => {
          // Trigger boundary calculation manually if needed during standard manual scroll events
          const scroller = scrollerRef.current;
          if (scroller) {
            const scrollThreshold = 20;
            setShowLeftArrow(scroller.scrollLeft > scrollThreshold);
            setShowRightArrow(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - scrollThreshold);
          }
        }}
        animate={{
          scale: editingTask ? zoomScale * 0.90 : zoomScale,
          x: 0,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 160,
          damping: 24,
          max: 0.95
        }}
        className="flex-1 min-h-0 w-full flex overflow-x-auto pt-16 pb-24 scrollbar-hide relative z-15 pointer-events-auto select-none"
        style={{
          transformOrigin: "center center",
          paddingTop: maxActionsCount === 0 ? "0px" : dynamicTopPadding,
          scrollPaddingLeft: isLeftExpanded ? "340px" : "100px",
          scrollPaddingRight: isRightExpanded ? "340px" : "100px",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div 
          className="flex justify-center gap-6 mx-auto px-6 sm:px-12 w-fit items-start min-h-max"
        >
          <AnimatePresence initial={false}>
            {phases.map((phaseNode, index) => {
              const data = phaseNode.data;
              const isFilteredDimmed = activeFilterIcon ? data.icon !== activeFilterIcon : null;
              const isFocused = focusedColumnId === phaseNode.id;

              const uiState = columnUiStates[phaseNode.id] || {
                opacity: 1,
                scale: 1,
                blur: 0,
                pointerEvents: "auto" as const,
                isStageOut: false
              };

              return (
                <motion.div
                  key={phaseNode.id}
                  layout
                  className="flex shrink-0 items-start"
                  style={{
                    opacity: uiState.opacity,
                    filter: uiState.blur > 0 ? `blur(${uiState.blur}px)` : "none",
                    transform: `scale(${uiState.scale})`,
                    pointerEvents: uiState.pointerEvents,
                    gap: draggingType === "phase" ? "12px" : "0px"
                  }}
                >
                  <PhaseDropZone
                    index={index}
                    onUpdateNodesDirectly={setNodes}
                    onAddPhaseWithIndex={handleAddPhase}
                  />
                  <KanbanColumn
                    phaseNode={phaseNode}
                    index={index}
                    allPhases={allPhases}
                    isFilteredDimmed={isFilteredDimmed}
                    isFocused={isFocused}
                    isStageOut={uiState.isStageOut}
                    onUpdatePhaseField={updatePhaseField}
                    onDeletePhase={deletePhase}
                    onDuplicatePhase={duplicatePhase}
                    onAddDragAction={onAddDragAction}
                    onMoveCardDirectly={onMoveCardDirectly}
                    onUpdateNodesDirectly={setNodes}
                    onStartEditTask={onStartEditTask}
                  />
                </motion.div>
              );
            })}

            {/* Trailing drop zone after the last column */}
            {phases.length > 0 && (
              <PhaseDropZone
                key="trailing-drop-zone"
                index={phases.length}
                onUpdateNodesDirectly={setNodes}
                onAddPhaseWithIndex={handleAddPhase}
              />
            )}

            {/* Drop indicator column slot at end */}
            {isDragOverWorkspace && draggingType === "phase" && (
              <motion.div
                key="drop-indicator"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className={`flex flex-col h-[350px] rounded-[2rem] border border-dashed ${BLUR.heavy} p-6 w-80 sm:w-[330px] shrink-0 items-center justify-center gap-3 transition-colors duration-300 ${
                  isDark
                    ? "bg-[#75E2FF]/5 border-[#75E2FF]/40 text-[#75E2FF]"
                    : "bg-blue-500/5 border-blue-500/40 text-blue-500"
                }`}
                style={{ fontFamily: "'Gilroy', sans-serif" }}
              >
                <Layers key="icon" className="w-8 h-8 animate-bounce mb-2 text-primary" />
                <span key="label" className="font-black text-xs uppercase tracking-widest text-center">
                  Drop to Create Phase
                </span>
                <span key="desc" className="text-[10px] opacity-60 text-center uppercase tracking-wider max-w-[200px]">
                  Release to instantly append sequencing container
                </span>
              </motion.div>
            )}

            {/* Empty state Column Placeholder Card */}
            {phases.length === 0 && !isDragOverWorkspace && (
              <EmptyStatePlaceholder key="empty-state" onAddPhase={handleAddPhase} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating visual navigation page-by-page arrow guides */}
      <NavigationArrows
        showLeft={showLeftArrow}
        showRight={showRightArrow}
        onScrollLeft={handleScrollLeft}
        onScrollRight={handleScrollRight}
        leftOffset={isLeftExpanded ? 300 : 56}
        rightOffset={isRightExpanded ? 310 : 56}
      />
    </div>
  );
}
