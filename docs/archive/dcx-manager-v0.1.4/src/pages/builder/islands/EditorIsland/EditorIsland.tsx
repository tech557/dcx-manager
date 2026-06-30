import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye } from "lucide-react";
import { TaskCardData, EnrichedVersion } from "../../../../types";
import { TaskEditor } from "./task-editor/TaskEditor";
import { BuilderIslandShell } from "../BuilderIslandShell";
import { useTheme } from "../../../../hooks/useTheme";


interface EditorIslandProps {
  editingTaskInfo: { task: TaskCardData; phaseId: string; actionCardId: string } | null;
  onSave: (updatedTask: TaskCardData, phaseId: string, actionCardId: string) => void;
  onCancel: () => void;
  currentVersion?: EnrichedVersion;
}

export function EditorIsland({
editingTaskInfo,
  onSave,
  onCancel,
  currentVersion,
}: EditorIslandProps) {
  const { isDark } = useTheme();
  const isExpanded = !!editingTaskInfo;

  // Custom height/width options
  const [width, setWidth] = useState(380);
  const [height, setHeight] = useState(720);
  
  useEffect(() => {
    if (isExpanded) {
      const maxAllowed = window.innerHeight - 240;
      if (height > maxAllowed) {
        setHeight(Math.max(480, maxAllowed));
      }
    }
  }, [isExpanded, height]);

  // Track which side is being resized: "width" (right), "height" (bottom), "corner" (bottom-right both)
  const [activeResizeSide, setActiveResizeSide] = useState<"width" | "height" | "corner" | null>(null);

  // Manage cursors and selection restrictions during resize drags
  useEffect(() => {
    if (activeResizeSide) {
      document.body.style.cursor = 
        activeResizeSide === "corner" 
          ? "se-resize" 
          : activeResizeSide === "width" 
            ? "col-resize" 
            : "row-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [activeResizeSide]);

  const handleMouseDown = (e: React.MouseEvent, type: "width" | "height" | "corner") => {
    e.preventDefault();
    e.stopPropagation();
    setActiveResizeSide(type);
  };

  useEffect(() => {
    if (!activeResizeSide) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const containerItem = document.getElementById("builder-left-island");
      if (!containerItem) return;
      const rect = containerItem.getBoundingClientRect();

      // Drag width calculation
      if (activeResizeSide === "width" || activeResizeSide === "corner") {
        const calculatedWidth = Math.max(340, Math.min(e.clientX - rect.left, 800));
        setWidth(calculatedWidth);
      }

      // Drag height calculation
      if (activeResizeSide === "height" || activeResizeSide === "corner") {
        const maxVal = typeof window !== "undefined" ? window.innerHeight - 240 : 950;
        const calculatedHeight = Math.max(480, Math.min(e.clientY - rect.top, maxVal));
        setHeight(calculatedHeight);
      }
    };

    const handleMouseUp = () => {
      setActiveResizeSide(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeResizeSide]);

  return (
    <BuilderIslandShell
      id="editor-island"
      isExpanded={isExpanded}
      collapsedWidth={56}
      collapsedHeight={56}
      expandedWidth={width}
      expandedHeight={height}
      style={{
        zIndex: isExpanded ? 50 : 30,
        maxHeight: isExpanded ? "calc(100vh - 240px)" : "56px"
      }}
      className={isExpanded ? "" : "cursor-not-allowed"}
      collapsedIcon={
        <div className="w-full h-full flex items-center justify-center cursor-not-allowed group relative">
          <Eye className="w-5 h-5 opacity-45 shrink-0 text-[#75E2FF]" />
          
          {/* Elegant tool tip explaining usage */}
          <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase font-mono tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            isDark ? "bg-neutral-800 text-neutral-400 border border-neutral-700" : "bg-white text-neutral-500 border border-neutral-200"
          }`}>
            Staging Editor Locked
          </div>
        </div>
      }
    >
      <div className="w-full h-full relative">
        {editingTaskInfo && (
          <TaskEditor
            task={editingTaskInfo.task}
            onCancel={onCancel}
            onSave={(updatedTask) => onSave(updatedTask, editingTaskInfo.phaseId, editingTaskInfo.actionCardId)}
            currentVersion={currentVersion}
          />
        )}

        {/* 1. Tactile RIGHT edge width drag handle */}
        <div
          onMouseDown={(e) => handleMouseDown(e, "width")}
          className={`absolute top-0 right-0 w-2.5 h-[calc(100%-12px)] cursor-col-resize active:bg-[#75E2FF]/30 transition-all duration-300 z-50 flex items-center justify-center group ${
            activeResizeSide === "width" ? "bg-[#75E2FF]/10" : "hover:bg-current/[0.03]"
          }`}
          title="Drag right edge to adjust panel width"
        >
          <div className={`w-0.5 h-12 bg-current/20 rounded-full transition-all duration-300 group-hover:scale-y-125 group-hover:bg-[#75E2FF] ${activeResizeSide === "width" ? "scale-y-150 bg-[#75E2FF]" : ""}`} />
        </div>

        {/* 2. Tactile BOTTOM edge height drag handle */}
        <div
          onMouseDown={(e) => handleMouseDown(e, "height")}
          className={`absolute bottom-0 left-0 h-2.5 w-[calc(100%-12px)] cursor-row-resize active:bg-[#75E2FF]/30 transition-all duration-300 z-50 flex items-center justify-center group ${
            activeResizeSide === "height" ? "bg-[#75E2FF]/10" : "hover:bg-current/[0.03]"
          }`}
          title="Drag bottom edge to adjust panel height"
        >
          <div className={`h-0.5 w-12 bg-current/20 rounded-full transition-all duration-300 group-hover:scale-x-125 group-hover:bg-[#75E2FF] ${activeResizeSide === "height" ? "scale-x-150 bg-[#75E2FF]" : ""}`} />
        </div>

        {/* 3. Tactile BOTH CORNER bottom-right drag handle */}
        <div
          onMouseDown={(e) => handleMouseDown(e, "corner")}
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 cursor-se-resize active:bg-[#75E2FF]/30 transition-all duration-300 z-50 flex items-center justify-center rounded-br-[2rem] group border-l border-t border-transparent ${
            activeResizeSide === "corner" ? "bg-[#75E2FF]/20 border-[#75E2FF]/30" : "hover:bg-current/[0.05] hover:border-current/10"
          }`}
          title="Drag corner to expand both width and height"
        >
          <div className="w-1.5 h-1.5 border-r border-b border-current opacity-40 group-hover:opacity-100 group-hover:border-[#75E2FF] transition-colors" />
        </div>
      </div>
    </BuilderIslandShell>
  );
}
