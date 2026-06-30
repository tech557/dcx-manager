import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { AddPhaseButton } from "./AddPhaseButton";
import { AddActionButton } from "./AddActionButton";
import { AddTaskButton } from "./AddTaskButton";
import { useBuilder } from "../../context/BuilderContext";
import { BuilderIslandShell } from "../BuilderIslandShell";
import { useTheme } from "../../../../hooks/useTheme";


export interface CreatorIslandProps {
  onAddPhase: () => void;
  onAddAction: (targetPhaseId?: string) => void;
  onAddTask?: (targetActionId?: string) => void;
  hasPhases: boolean;
  hasActions: boolean;
  nodes: any[];
}

export function CreatorIsland({
onAddPhase,
  onAddAction,
  onAddTask,
  hasPhases,
  hasActions,
  nodes,
}: CreatorIslandProps) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { selectedIds, clearSelection } = useBuilder();

  // Find selected phases
  const selectedPhases = useMemo(() => {
    return nodes.filter(n => n.type === "phase" && selectedIds.has(n.id));
  }, [nodes, selectedIds]);

  const selectedActions = useMemo(() => {
    return nodes.filter(n => n.type === "action" && selectedIds.has(n.id));
  }, [nodes, selectedIds]);

  const selectedPhaseId = selectedPhases.length === 1 && selectedActions.length === 0 ? selectedPhases[0].id : undefined;
  const isActionDisabled = !hasPhases;
  const actionDisabledReason = !hasPhases ? "Needs Phase" : undefined;

  const selectedActionId = selectedActions.length === 1 && selectedPhases.length === 0 ? selectedActions[0].id : undefined;
  const isTaskDisabled = !hasActions;
  const taskDisabledReason = !hasActions ? "No Actions" : undefined;

  const handleAddPhase = () => {
    clearSelection();
    onAddPhase();
  };

  const handleAddAction = (phaseId?: string) => {
    clearSelection();
    onAddAction(phaseId);
  };

  const handleAddTask = (actionId?: string) => {
    clearSelection();
    if (onAddTask) onAddTask(actionId);
  };

  return (
    <div className="relative flex justify-center items-center pointer-events-none">
      {/* Primary Pill-Style Trigger Button bar with inline elements */}
      <BuilderIslandShell
        isExpanded={isOpen}
        onToggle={() => setIsOpen(true)}
        shape="pill"
        expandedWidth="auto"
        expandedHeight={56}
        collapsedWidth={56}
        collapsedHeight={56}
        className={isOpen ? "pl-5 pr-3" : ""}
        collapsedIcon={
          <div className="flex items-center justify-center relative w-full h-full">
            <Plus className={`w-5 h-5 transition-opacity duration-300 group-hover:scale-105 shrink-0 ${
              isDark ? "text-[#75E2FF] opacity-45 group-hover:opacity-100" : "text-neutral-500 opacity-60 group-hover:opacity-100 animate-pulse"
            }`} />
            
            {/* Elegant tooltip matching EditorIsland's Staging Editor Locked look */}
            <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase font-mono tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
              isDark ? "bg-neutral-800 text-neutral-400 border border-neutral-700" : "bg-white text-neutral-500 border border-neutral-200"
            }`}>
              Open Creator Tools
            </div>
          </div>
        }
      >
        <div className="flex items-center gap-4 py-0.5">
          <div className="flex flex-col gap-0.5 pointer-events-auto select-none min-w-[80px]">
            <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 block leading-none font-sans text-current">
              Creator Island
            </span>
            <span className="text-[11px] font-bold font-sans tracking-tight block leading-none text-current">
              Controls
            </span>
          </div>

          {/* Divider */}
          <div className={`h-6 w-[1px] shrink-0 ${isDark ? "bg-white/10" : "bg-black/5"}`} />

          <div className="flex items-center gap-2 pr-1">
            {/* 1. Phase Button component */}
            <AddPhaseButton  
              onAddPhase={handleAddPhase} 
            />

            {/* 2. Action Button component */}
            <AddActionButton  
              onAddAction={() => {
                if (selectedPhaseId) {
                  handleAddAction(selectedPhaseId);
                } else {
                  handleAddAction();
                }
              }} 
              hasPhases={hasPhases}
              isDisabled={isActionDisabled}
              disabledReason={actionDisabledReason}
            />

            {/* 3. Task Button component */}
            <AddTaskButton  
              onAddTaskToFirstAction={() => {
                if (selectedActionId) {
                  handleAddTask(selectedActionId);
                } else {
                  handleAddTask();
                }
              }} 
              hasActions={hasActions}
              isDisabled={isTaskDisabled}
              disabledReason={taskDisabledReason}
            />
          </div>

          {/* Internal Divider before toggle */}
          <div className={`h-6 w-[1px] shrink-0 ${isDark ? "bg-white/10" : "bg-black/5"}`} />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 shrink-0 cursor-pointer ${
              isDark
                ? "bg-white/5 text-white hover:bg-white/10 border border-white/5"
                : "bg-black/5 text-neutral-800 hover:bg-black/10 border border-black/5"
            }`}
            title="Close"
          >
            <Plus className="w-4.5 h-4.5 rotate-45" />
          </button>
        </div>
      </BuilderIslandShell>
    </div>
  );
}
