import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, MapPin, Activity, CheckSquare, Plus } from "lucide-react";
import { EnrichedVersion } from "../../../../types";
import { useBuilder } from "../../context/BuilderContext";
import { PhaseLocatePopup } from "./PhaseLocatePopup";
import { ActionLocatePopup } from "./ActionLocatePopup";
import { TaskLocatePopup } from "./TaskLocatePopup";
import { BuilderIslandShell } from "../BuilderIslandShell";
import { useTheme } from "../../../../hooks/useTheme";
import { useIslandPanel } from "../../hooks/useIslandPanel";


export interface FocusIslandProps {
  nodes: any[];
  currentVersion: EnrichedVersion;
  activeFilterIcon: string | null;
  setActiveFilterIcon: (icon: string | null) => void;
  focusedColumnId: string | null;
  setFocusedColumnId: (id: string | null) => void;
  activePanel: "none" | "locate" | "filter";
  setActivePanel: (panel: "none" | "locate" | "filter") => void;
}

export function FocusIsland({ 
nodes, 
  focusedColumnId,
  setFocusedColumnId,
  activePanel,
  setActivePanel,
}: FocusIslandProps) {
  const { isDark } = useTheme();
  const { selectedIds, selectIds } = useBuilder();
  const { togglePanel, isPanelOpen } = useIslandPanel({
    initialPanel: "none" as const,
    activePanel,
    onPanelChange: setActivePanel,
  });
  const {
    closePanel: closeLocatorPanel,
    togglePanel: toggleLocatorPanel,
    isPanelOpen: isLocatorPanelOpen,
  } = useIslandPanel<"none" | "phase" | "action" | "task">({
    initialPanel: "none",
  });

  // Filter phases list from nodes
  const phases = nodes.filter((n) => n.type === "phase");

  const isExpanded = isPanelOpen("locate");
  const isPhaseOpen = isLocatorPanelOpen("phase");
  const isActionOpen = isLocatorPanelOpen("action");
  const isTaskOpen = isLocatorPanelOpen("task");

  // Calculate high-contrast active selections to light up indices
  const hasSelectedPhase = useMemo(() => {
    return phases.some((p) => selectedIds.has(p.id));
  }, [phases, selectedIds]);

  const allActionIds = useMemo(() => {
    const list: string[] = [];
    phases.forEach((p) => {
      const actionCards = p.data?.actionCards || [];
      actionCards.forEach((a: any) => {
        list.push(a.id);
      });
    });
    return list;
  }, [phases]);

  const allTaskIds = useMemo(() => {
    const list: string[] = [];
    phases.forEach((p) => {
      const actionCards = p.data?.actionCards || [];
      actionCards.forEach((a: any) => {
        const tasks = a.tasks || [];
        tasks.forEach((t: any) => {
          list.push(t.id);
        });
      });
    });
    return list;
  }, [phases]);

  const hasSelectedAction = useMemo(() => {
    return allActionIds.some((id) => selectedIds.has(id));
  }, [allActionIds, selectedIds]);

  const hasSelectedTask = useMemo(() => {
    return allTaskIds.some((id) => selectedIds.has(id));
  }, [allTaskIds, selectedIds]);

  const isLocateActive = selectedIds.size > 0;
  const isTargetGlow = isLocateActive || isExpanded;

  const handleLocateElement = (id: string, type: "phase" | "action" | "task") => {
    const idsToSelect: string[] = [id];

    if (type === "phase") {
      setFocusedColumnId(id);
      setTimeout(() => {
        setFocusedColumnId(null);
      }, 2500);

      const phaseNode = phases.find((p) => p.id === id);
      if (phaseNode) {
        const actionCards = phaseNode.data?.actionCards || [];
        actionCards.forEach((action: any) => {
          idsToSelect.push(action.id);
          const tasks = action.tasks || [];
          tasks.forEach((task: any) => {
            idsToSelect.push(task.id);
          });
        });
      }
    } else if (type === "action") {
      for (const p of phases) {
        const actionCards = p.data?.actionCards || [];
        const actionNode = actionCards.find((a: any) => a.id === id);
        if (actionNode) {
          const tasks = actionNode.tasks || [];
          tasks.forEach((task: any) => {
            idsToSelect.push(task.id);
          });
          break;
        }
      }
    }

    selectIds(idsToSelect);

    setTimeout(() => {
      const element = document.getElementById(id) || document.querySelector(`[id$="${id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
      }
    }, 50);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("object-created", { detail: { id, type } }));
    }, 150);
  };

  const toggleExpand = () => {
    if (isExpanded) {
      closeLocatorPanel();
    }
    togglePanel("locate");
  };

  const openPhaseLocator = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLocatorPanel("phase");
  };

  const openActionLocator = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLocatorPanel("action");
  };

  const openTaskLocator = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLocatorPanel("task");
  };

  const isPhaseActive = isPhaseOpen || hasSelectedPhase;
  const isActionActive = isActionOpen || hasSelectedAction;
  const isTaskActive = isTaskOpen || hasSelectedTask;

  return (
    <>
      <div 
        className="flex flex-col items-end justify-start pointer-events-auto select-none relative z-40 transition-all duration-500 w-14"
      >
        <BuilderIslandShell
          isExpanded={isExpanded}
          onToggle={toggleExpand}
          collapsedWidth={56}
          collapsedHeight={56}
          expandedWidth={56}
          expandedHeight={310}
          className={isExpanded ? "flex-col py-2.5 gap-2.5" : ""}
          collapsedIcon={
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer relative group">
              <Target className={`w-5 h-5 transition-all duration-300 group-hover:scale-105 shrink-0 ${
                isTargetGlow
                  ? isDark
                    ? "text-[#75E2FF] opacity-100 filter drop-shadow-[0_0_8px_rgba(117,226,255,0.6)] animate-pulse"
                    : "text-[#51bcd8] opacity-100 filter drop-shadow-[0_0_8px_rgba(81,188,216,0.5)]"
                  : isDark
                    ? "text-neutral-500 opacity-45 group-hover:opacity-100 hover:text-[#75E2FF]"
                    : "text-neutral-500 opacity-60 group-hover:opacity-100 hover:text-[#51bcd8]"
              }`} />
              <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase font-mono tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                isDark ? "bg-neutral-800 text-neutral-400 border border-neutral-700" : "bg-white text-neutral-500 border border-neutral-200"
              }`}>
                Open Workspace Locator
              </div>
            </div>
          }
        >

          {/* 1. Static Top Logo Icon (styled contextually matching state activation glows) */}
          <div 
            onClick={(e) => {
              if (isExpanded) {
                e.stopPropagation();
                toggleExpand();
              }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer relative"
          >
            <Target className={`w-5 h-5 transition-all duration-300 group-hover:scale-105 shrink-0 ${
              isTargetGlow
                ? isDark
                  ? "text-[#75E2FF] opacity-100 filter drop-shadow-[0_0_8px_rgba(117,226,255,0.6)] animate-pulse"
                  : "text-[#51bcd8] opacity-100 filter drop-shadow-[0_0_8px_rgba(81,188,216,0.5)]"
                : isDark
                  ? "text-neutral-500 opacity-45 group-hover:opacity-100 hover:text-[#75E2FF]"
                  : "text-neutral-500 opacity-60 group-hover:opacity-100 hover:text-[#51bcd8]"
            }`} />
            
            <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase font-mono tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
              isDark ? "bg-neutral-800 text-neutral-400 border border-neutral-700" : "bg-white text-neutral-500 border border-neutral-200"
            }`}>
              {isExpanded ? "Collapse Locator" : "Open Workspace Locator"}
            </div>
          </div>

          {/* Expanded vertical stack buttons */}
          <div className="flex flex-col items-center gap-2.5 w-full pointer-events-auto">
                {/* Thin divider line */}
                <div className={`w-8 h-[1px] ${isDark ? "bg-white/10" : "bg-black/10"}`} />

                {/* A. Phase locate button */}
                <div className="relative group flex items-center justify-center w-full">
                  <span className={`absolute right-16 px-2.5 py-1 text-[9px] font-black uppercase font-mono tracking-widest rounded-md shadow-xl transition-all duration-200 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50 border ${
                    isDark
                      ? "bg-black/90 border-white/10 text-white"
                      : "bg-white/95 border-black/10 text-neutral-800"
                  }`}>
                    Find Phase
                  </span>
                  
                  <button
                    type="button"
                    onClick={openPhaseLocator}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      isPhaseActive
                        ? isDark
                          ? "bg-[#75E2FF]/15 border-[#75E2FF]/30 text-[#75E2FF] shadow-[0_0_12px_rgba(117,226,255,0.25)]"
                          : "bg-[#51bcd8]/10 border-[#51bcd8]/35 text-[#51bcd8] shadow-[0_0_12px_rgba(81,188,216,0.15)]"
                        : isDark
                          ? "bg-white/5 border-white/5 text-slate-300 hover:text-[#75E2FF] hover:bg-[#75E2FF]/15 hover:border-[#75E2FF]/30"
                          : "bg-black/5 border-black/5 text-neutral-600 hover:text-[#51bcd8] hover:bg-[#51bcd8]/10 hover:border-[#51bcd8]/20"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>

                  <PhaseLocatePopup
                    isOpen={isPhaseOpen}
                    onClose={closeLocatorPanel}
                    phases={phases}
                    onLocate={(id) => handleLocateElement(id, "phase")}
                  />
                </div>

                {/* B. Action locate button */}
                <div className="relative group flex items-center justify-center w-full">
                  <span className={`absolute right-16 px-2.5 py-1 text-[9px] font-black uppercase font-mono tracking-widest rounded-md shadow-xl transition-all duration-200 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50 border ${
                    isDark
                      ? "bg-black/90 border-white/10 text-white"
                      : "bg-white/95 border-black/10 text-neutral-800"
                  }`}>
                    Find Action
                  </span>
                  
                  <button
                    type="button"
                    onClick={openActionLocator}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      isActionActive
                        ? isDark
                          ? "bg-[#75E2FF]/15 border-[#75E2FF]/30 text-[#75E2FF] shadow-[0_0_12px_rgba(117,226,255,0.25)]"
                          : "bg-[#51bcd8]/10 border-[#51bcd8]/35 text-[#51bcd8] shadow-[0_0_12px_rgba(81,188,216,0.15)]"
                        : isDark
                          ? "bg-white/5 border-white/5 text-slate-300 hover:text-[#75E2FF] hover:bg-[#75E2FF]/15 hover:border-[#75E2FF]/30"
                          : "bg-black/5 border-black/5 text-neutral-600 hover:text-[#51bcd8] hover:bg-[#51bcd8]/10 hover:border-[#51bcd8]/20"
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                  </button>

                  <ActionLocatePopup
                    isOpen={isActionOpen}
                    onClose={closeLocatorPanel}
                    phases={phases}
                    onLocate={(id) => handleLocateElement(id, "action")}
                  />
                </div>

                {/* C. Task locate button */}
                <div className="relative group flex items-center justify-center w-full">
                  <span className={`absolute right-16 px-2.5 py-1 text-[9px] font-black uppercase font-mono tracking-widest rounded-md shadow-xl transition-all duration-200 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50 border ${
                    isDark
                      ? "bg-black/90 border-white/10 text-white"
                      : "bg-white/95 border-black/10 text-neutral-800"
                  }`}>
                    Find Task
                  </span>
                  
                  <button
                    type="button"
                    onClick={openTaskLocator}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      isTaskActive
                        ? isDark
                          ? "bg-[#75E2FF]/15 border-[#75E2FF]/30 text-[#75E2FF] shadow-[0_0_12px_rgba(117,226,255,0.25)]"
                          : "bg-[#51bcd8]/10 border-[#51bcd8]/35 text-[#51bcd8] shadow-[0_0_12px_rgba(81,188,216,0.15)]"
                        : isDark
                          ? "bg-white/5 border-white/5 text-slate-300 hover:text-[#75E2FF] hover:bg-[#75E2FF]/15 hover:border-[#75E2FF]/30"
                          : "bg-black/5 border-black/5 text-neutral-600 hover:text-[#51bcd8] hover:bg-[#51bcd8]/10 hover:border-[#51bcd8]/20"
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>

                  <TaskLocatePopup
                    isOpen={isTaskOpen}
                    onClose={closeLocatorPanel}
                    phases={phases}
                    onLocate={(id) => handleLocateElement(id, "task")}
                  />
                </div>

                {/* Thin divider line */}
                <div className={`w-8 h-[1px] ${isDark ? "bg-white/10" : "bg-black/10"}`} />

                {/* D. Close button at the bottom end of the island */}
                <div className="relative group flex items-center justify-center w-full">
                  <span className={`absolute right-16 px-2.5 py-1 text-[9px] font-black uppercase font-mono tracking-widest rounded-md shadow-xl transition-all duration-200 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50 border ${
                    isDark
                      ? "bg-black/90 border-white/10 text-white"
                      : "bg-white/95 border-black/10 text-neutral-800"
                  }`}>
                    Close
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand();
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      isDark
                        ? "bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/15"
                        : "bg-black/5 border-black/5 text-neutral-500 hover:text-black hover:bg-black/10"
                    }`}
                    title="Collapse Locator"
                  >
                    <Plus className="w-4.5 h-4.5 rotate-45" />
                  </button>
                </div>

          </div>
        </BuilderIslandShell>
      </div>
    </>
  );
}
