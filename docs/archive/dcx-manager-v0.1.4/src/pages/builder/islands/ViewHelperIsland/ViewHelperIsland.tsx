import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBuilder } from "../../context/BuilderContext";
import { 
  Columns, 
  X, 
  Plus,
  ArrowRight,
  Check,
  Sparkles
} from "lucide-react";
import { TaskCreationFlow } from "./TaskCreationFlow";
import { PhaseSummaryPanel } from "./PhaseSummaryPanel";
import { useResizable } from "./useResizable";
import { BLUR } from "../../../../styles/tokens";
import { useDeliverableWizard } from "./useDeliverableWizard";
import { BuilderIslandShell } from "../BuilderIslandShell";
import { useTheme } from "../../../../hooks/useTheme";
import { useIslandPanel } from "../../hooks/useIslandPanel";


interface ViewHelperIslandProps {
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  viewMode: "kanban" | "timeline";
}

export function ViewHelperIsland({
nodes,
  setNodes,
  viewMode,
}: ViewHelperIslandProps) {
  const { isDark } = useTheme();
  const { selectedIds, toggleSelection, clearSelection } = useBuilder();
  const { activePanel, setPanel, closePanel } = useIslandPanel<"none" | "summary">({
    initialPanel: "none",
  });
  const isOpen = activePanel !== "none";

  const { width, height, resizeHandleProps } = useResizable(580, 420);

  const {
    creationCtx,
    setCreationCtx,
    creationStep,
    setCreationStep,
    selectedPhaseId,
    setSelectedPhaseId,
    newPhaseName,
    setNewPhaseName,
    isCreatingNewPhase,
    setIsCreatingNewPhase,
    selectedActionId,
    setSelectedActionId,
    newActionName,
    setNewActionName,
    isCreatingNewAction,
    setIsCreatingNewAction,
    newTaskName,
    setNewTaskName,
    selectedChannelId,
    setSelectedChannelId,
    handleSaveCreatedTask,
  } = useDeliverableWizard({
setNodes,
    setIsOpen: (open) => setPanel(open ? "summary" : "none"),
  });

  const phases = nodes.filter((n) => n.type === "phase");

  if (viewMode === "kanban") {
    return null;
  }

  const islandBgClass = isDark
    ? "bg-black/20 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-black/30 hover:border-white/[0.08]"
    : "bg-white/60 border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:border-black/[0.08]";

  const popupBgClass = isDark
    ? "bg-[#0D0D0E]/95 border-white/[0.06] shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
    : "bg-white/95 border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.12)]";

  return (
    <>
      {/* 1. Floating Interactive ViewHelper Pill Button (Bottom Right) */}
      <AnimatePresence>
        {!isOpen && (
          <BuilderIslandShell
            isExpanded={false}
            onToggle={() => setPanel("summary")}
            shape="pill"
            collapsedWidth={180}
            collapsedHeight={60}
            className="p-0"
            collapsedIcon={
              <div className="flex items-center gap-3 select-none text-left w-full h-full px-5">
                {/* Ice Blue pulsing indicator */}
                <div className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75E2FF]/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#75E2FF]"></span>
                </div>

                <div className="flex flex-col gap-0.5 select-none text-left">
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-35 block leading-none font-sans">
                    PERSPECTIVE
                  </span>
                  <span className="text-[11px] font-bold font-sans tracking-tight block leading-none text-[#75E2FF] flex items-center gap-1">
                    <Columns className="w-3.5 h-3.5" />
                    View Helper
                  </span>
                </div>
              </div>
            }
          />
        )}
      </AnimatePresence>

      {/* 2. Interactive Resizable Overlay Kanban Preview Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            style={{ 
              width: `${width}px`, 
              height: `${height}px`,
            }}
            className={`fixed bottom-4 right-10 z-[250] rounded-[2.5rem] border ${BLUR.heavy} flex flex-col pointer-events-auto select-none overflow-hidden ${popupBgClass}`}
          >
            {/* A. Resize Handle (Top-Left corner) */}
            <div
              {...resizeHandleProps}
              className="absolute top-0 left-0 w-14 h-14 cursor-nwse-resize group/handle z-50 flex items-center justify-center pointer-events-auto rounded-tl-[2.5rem]"
              title="Drag to resize panel"
            >
              <div className="absolute top-3.5 left-3.5 w-6 h-6 border-t-2 border-l-2 border-current/15 group-hover/handle:border-[#75E2FF]/40 transition-all duration-300 rounded-tl-[1.1rem]" />
              <div className="absolute top-5 left-5 w-3 h-3 border-t border-l border-[#75E2FF]/30 group-hover/handle:border-[#75E2FF] group-hover/handle:scale-[1.1] transition-all duration-300 rounded-tl-[0.6rem]" />
            </div>

            {/* B. Header / Control Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-current/5 shrink-0 bg-current/[0.01]">
              <div className="flex items-center gap-3.5 ml-4">
                <div className="p-2 rounded-xl bg-[#75E2FF]/10 text-[#75E2FF]">
                  {creationCtx ? <Plus className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-[0.25em] uppercase opacity-35 block leading-none">
                    {creationCtx ? "DRAFT DELIVERABLE" : "COLLAPSED PREVIEW"}
                  </span>
                  <span className="text-sm font-black tracking-tight text-[#75E2FF] block mt-1">
                    {creationCtx 
                      ? `${creationCtx.dateString}`
                      : "View Helper"
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold tracking-wider opacity-30 uppercase px-2 py-1 rounded-md bg-current/[0.03]">
                  {creationCtx 
                    ? `Step ${creationStep === "phase" ? 1 : creationStep === "action" ? 2 : 3} of 3`
                    : `${phases.length} Phase${phases.length > 1 ? "s" : ""}`
                  }
                </span>
                {creationCtx && (
                  <button
                    onClick={() => setCreationCtx(null)}
                    className="text-[10px] font-bold text-rose-400 hover:underline px-2.5 py-1 rounded-md bg-rose-500/10 cursor-pointer transition-colors"
                  >
                    Abort
                  </button>
                )}
                <button
                  onClick={() => {
                    closePanel();
                    setCreationCtx(null);
                  }}
                  className="p-2 rounded-full hover:bg-current/10 text-current opacity-70 hover:opacity-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* C. Content Body */}
            {creationCtx ? (
              <TaskCreationFlow
                creationStep={creationStep}
                phases={phases}
                isCreatingNewPhase={isCreatingNewPhase}
                setIsCreatingNewPhase={setIsCreatingNewPhase}
                newPhaseName={newPhaseName}
                setNewPhaseName={setNewPhaseName}
                selectedPhaseId={selectedPhaseId}
                setSelectedPhaseId={setSelectedPhaseId}
                isCreatingNewAction={isCreatingNewAction}
                setIsCreatingNewAction={setIsCreatingNewAction}
                newActionName={newActionName}
                setNewActionName={setNewActionName}
                selectedActionId={selectedActionId}
                setSelectedActionId={setSelectedActionId}
                newTaskName={newTaskName}
                setNewTaskName={setNewTaskName}
                selectedChannelId={selectedChannelId}
                setSelectedChannelId={setSelectedChannelId}
                setCreationStep={setCreationStep}
                onSaveCreatedTask={handleSaveCreatedTask}
              />
            ) : (
              <PhaseSummaryPanel
                phases={phases}
                selectedIds={selectedIds}
                toggleSelection={toggleSelection}
              />
            )}

            {/* D. Bottom Instruction Bar */}
            <div className="px-6 py-3 border-t border-current/5 bg-current/[0.01] flex items-center justify-between text-current shrink-0">
              {creationCtx ? (
                <>
                  <button
                    onClick={() => {
                      if (creationStep === "action") {
                        if (!isCreatingNewPhase) {
                          setCreationStep("phase");
                        } else {
                          setIsCreatingNewPhase(false);
                        }
                      } else if (creationStep === "task_name") {
                        setCreationStep("action");
                      } else {
                        setCreationCtx(null);
                      }
                    }}
                    className="text-[10px] font-black tracking-[0.1em] text-current/60 hover:text-rose-400 hover:underline bg-current/[0.03] px-3.5 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => {
                      if (creationStep === "phase") {
                        if (isCreatingNewPhase) {
                          if (!newPhaseName.trim()) {
                            setNewPhaseName(`Phase ${phases.length + 1}`);
                          }
                        } else {
                          if (!selectedPhaseId) return; // must choose phase
                        }
                        setIsCreatingNewAction(true);
                        setNewActionName("Action Stream 1");
                        setCreationStep("action");
                      } else if (creationStep === "action") {
                        if (isCreatingNewAction) {
                          if (!newActionName.trim()) {
                            setNewActionName("Action Stream 1");
                          }
                        } else {
                          if (!selectedActionId) return; // must choose action stream
                        }
                        setNewTaskName("Deliverable Task");
                        setCreationStep("task_name");
                      } else {
                        handleSaveCreatedTask();
                      }
                    }}
                    className="text-[10px] font-black tracking-[0.1em] text-black bg-[#75E2FF] hover:bg-[#75E2FF]/85 px-4 py-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {creationStep === "task_name" ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>CREATE</span>
                      </>
                    ) : (
                      <>
                        <span>NEXT</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[9px] font-bold tracking-wider opacity-40 uppercase flex items-center gap-1.5">
                    <Sparkles className="text-[#75E2FF] w-3 h-3 animate-pulse" />
                    Select any entity to sync selection, drag to timeline dates to place
                  </span>
                  <button 
                    type="button"
                    onClick={clearSelection}
                    className="text-[9px] font-black tracking-[0.1em] text-[#75E2FF] hover:underline cursor-pointer bg-transparent border-none appearance-none font-sans"
                  >
                    CLEAR SELECTION ({selectedIds.size})
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
