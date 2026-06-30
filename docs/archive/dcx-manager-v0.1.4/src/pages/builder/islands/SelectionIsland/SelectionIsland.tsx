import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBuilder } from "../../context/BuilderContext";
import { Trash, X } from "lucide-react";
import { ActionCardData, TaskCardData } from "../../../../types";
import { ExpandButton } from "./ExpandButton";
import { CollapseButton } from "./CollapseButton";
import { BuilderIslandShell } from "../BuilderIslandShell";
import { useTheme } from "../../../../hooks/useTheme";


interface SelectionIslandProps {
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  viewMode?: "kanban" | "timeline";
}

export function SelectionIsland({ nodes, setNodes, viewMode = "kanban" }: SelectionIslandProps) {
  const { isDark } = useTheme();
  const { selectedIds, clearSelection, deleteSelected } = useBuilder();

  const count = selectedIds.size;
  const hasSelection = count > 0;

  // Identify if any part of the target (selection or all) can be expanded/collapsed
  let canExpand = false;
  let canCollapse = false;

  if (viewMode === "timeline") {
    canExpand = true;
    canCollapse = true;
  } else {
    nodes.forEach(n => {
      if (n.type !== 'phase') return;
      
      const isPhaseSelected = hasSelection ? selectedIds.has(n.id) : true;
      
      // Check phase level
      if (isPhaseSelected) {
        if (n.data?.isCollapsed) canExpand = true;
        if (!n.data?.isCollapsed) canCollapse = true;
      }

      // Check card/task level
      const cards: ActionCardData[] = n.data?.actionCards || [];
      cards.forEach(c => {
        const isCardSelected = hasSelection ? selectedIds.has(c.id) : false;
        const tasks: TaskCardData[] = c.tasks || [];
        
        tasks.forEach(t => {
          const isTaskSelected = hasSelection ? selectedIds.has(t.id) : false;
          
          // If phase, card, or task is selected, we evaluate its state for the buttons
          if (!hasSelection || isPhaseSelected || isCardSelected || isTaskSelected) {
            if (t.isSmall !== false) canExpand = true;
            if (t.isSmall === false || t.isSmall === undefined) canCollapse = true;
          }
        });
      });
    });
  }

  // Resolve selection types for label
  let selectedPhasesCount = 0;
  let selectedActionsCount = 0;
  let selectedTasksCount = 0;
  let selectedWeeksCount = 0;
  const selectedWeekNames: string[] = [];

  selectedIds.forEach((sid) => {
    if (sid.startsWith("week-")) {
      selectedWeeksCount++;
      const weekNum = sid.replace("week-", "");
      selectedWeekNames.push(`Week ${weekNum}`);
      return;
    }

    // Check if phase
    const isPhase = nodes.some((n) => n.id === sid && n.type === "phase");
    if (isPhase) {
      selectedPhasesCount++;
      return;
    }

    // Check if action or task inside phases
    nodes.forEach((n) => {
      if (n.type !== "phase") return;
      const cards: ActionCardData[] = n.data?.actionCards || [];
      const matchCardIdx = cards.findIndex((c) => c.id === sid);
      if (matchCardIdx !== -1) {
        selectedActionsCount++;
        return;
      }
      cards.forEach((c) => {
        const tasks: TaskCardData[] = c.tasks || [];
        if (tasks.some((t) => t.id === sid)) {
          selectedTasksCount++;
        }
      });
    });
  });

  // Sort selectedWeekNames numerically
  selectedWeekNames.sort((a, b) => {
    const numA = parseInt(a.replace("Week ", ""), 10);
    const numB = parseInt(b.replace("Week ", ""), 10);
    return numA - numB;
  });

  // Decide selection nature
  let natureLabel = "";
  if (count === 0) {
    natureLabel = viewMode === "timeline" ? "Roadmap Workspace" : "Canvasboard";
  } else if (viewMode === "timeline") {
    if (selectedWeeksCount > 0 && selectedTasksCount === 0) {
      natureLabel = `${selectedWeekNames.join(", ")} selected`;
    } else if (selectedWeeksCount === 0 && selectedTasksCount > 0) {
      natureLabel = `${selectedTasksCount} task${selectedTasksCount > 1 ? "s" : ""} selected`;
    } else {
      natureLabel = "Multiple selection";
    }
  } else {
    if (selectedPhasesCount > 0 && selectedActionsCount === 0 && selectedTasksCount === 0) {
      natureLabel = `${selectedPhasesCount} phase${selectedPhasesCount > 1 ? "s" : ""} selected`;
    } else if (selectedPhasesCount === 0 && selectedActionsCount > 0 && selectedTasksCount === 0) {
      natureLabel = `${selectedActionsCount} action${selectedActionsCount > 1 ? "s" : ""} selected`;
    } else if (selectedPhasesCount === 0 && selectedActionsCount === 0 && selectedTasksCount > 0) {
      natureLabel = `${selectedTasksCount} task${selectedTasksCount > 1 ? "s" : ""} selected`;
    } else {
      natureLabel = "Multiple selection";
    }
  }

  // Bulk Delete selection
  const handleDeleteSelected = () => {
    deleteSelected(nodes, setNodes);
  };

  const handleExpand = () => {
    if (viewMode === "timeline") {
      window.dispatchEvent(new CustomEvent("timeline-expand-all"));
      return;
    }
    if (!canExpand) return;
    setNodes(nds => nds.map(n => {
      if (n.type !== 'phase') return n;
      
      const isPhaseSelected = hasSelection ? selectedIds.has(n.id) : true;
      let nextIsCollapsed = n.data?.isCollapsed;
      if (isPhaseSelected) {
        nextIsCollapsed = false;
      }

      const cards: ActionCardData[] = n.data?.actionCards || [];
      const updatedCards = cards.map(c => {
        const isCardSelected = hasSelection ? selectedIds.has(c.id) : false;
        const tasks: TaskCardData[] = c.tasks || [];
        
        const updatedTasks = tasks.map(t => {
          const isTaskSelected = hasSelection ? selectedIds.has(t.id) : false;
          // Expand task if it, its card, or its phase is selected (or nothing is selected)
          if (!hasSelection || isPhaseSelected || isCardSelected || isTaskSelected) {
            return { ...t, isSmall: false };
          }
          return t;
        });

        return { ...c, tasks: updatedTasks };
      });

      return {
        ...n,
        data: {
          ...n.data,
          isCollapsed: nextIsCollapsed,
          actionCards: updatedCards
        }
      };
    }));
  };

  const handleCollapse = () => {
    if (viewMode === "timeline") {
      window.dispatchEvent(new CustomEvent("timeline-collapse-all"));
      return;
    }
    if (!canCollapse) return;
    setNodes(nds => nds.map(n => {
      if (n.type !== 'phase') return n;
      
      const isPhaseSelected = hasSelection ? selectedIds.has(n.id) : true;
      let nextIsCollapsed = n.data?.isCollapsed;
      if (isPhaseSelected) {
        nextIsCollapsed = true;
      }

      const cards: ActionCardData[] = n.data?.actionCards || [];
      const updatedCards = cards.map(c => {
        const isCardSelected = hasSelection ? selectedIds.has(c.id) : false;
        const tasks: TaskCardData[] = c.tasks || [];
        
        const updatedTasks = tasks.map(t => {
          const isTaskSelected = hasSelection ? selectedIds.has(t.id) : false;
          // Collapse task if it, its card, or its phase is selected (or nothing is selected)
          if (!hasSelection || isPhaseSelected || isCardSelected || isTaskSelected) {
            return { ...t, isSmall: true };
          }
          return t;
        });

        return { ...c, tasks: updatedTasks };
      });

      return {
        ...n,
        data: {
          ...n.data,
          isCollapsed: nextIsCollapsed,
          actionCards: updatedCards
        }
      };
    }));
  };

  const containerClass = isDark
    ? "bg-black/20 border-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    : "bg-white/60 border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.02)]";

  return (
    <BuilderIslandShell
      isExpanded={true}
      shape="panel"
      className="p-2 pl-6 pr-3 h-[60px]"
      style={{
        minWidth: hasSelection ? "240px" : "200px"
      }}
      collapsedIcon={null}
    >
      <div className="flex items-center gap-4 w-full h-full">
        <div className="flex flex-col gap-0.5 min-w-[90px]">
          <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 block leading-none font-sans">
            Workstate
          </span>
          <span className={`text-[11px] font-bold font-sans tracking-tight block leading-none ${!hasSelection ? "opacity-30" : ""}`}>
            {hasSelection ? natureLabel : "Canvasboard"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          <ExpandButton  
            hasSelection={hasSelection} 
            canExpand={canExpand} 
            onClick={handleExpand} 
          />
          <CollapseButton  
            hasSelection={hasSelection} 
            canCollapse={canCollapse} 
            onClick={handleCollapse} 
          />

          {hasSelection && (
            <div className="flex items-center gap-1 ml-1 pl-3 border-l border-current/10">
              {/* Delete Selection button */}
              <button
                onClick={handleDeleteSelected}
                className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-400 transition-colors flex items-center justify-center cursor-pointer"
                title="Delete Selection (Del)"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>

              {/* Clear selection button */}
              <button
                onClick={clearSelection}
                className="p-1.5 rounded-full hover:bg-current/15 transition-colors flex items-center justify-center cursor-pointer"
                title="Clear Selection (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </BuilderIslandShell>
  );
}
