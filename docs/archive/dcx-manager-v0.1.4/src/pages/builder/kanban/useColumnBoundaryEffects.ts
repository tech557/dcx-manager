import React, { useState, useLayoutEffect, useCallback, useRef } from "react";
import { useBuilder } from "../context/BuilderContext";

interface UseColumnBoundaryEffectsProps {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  phases: any[];
  editingTask: any;
  zoomScale: number;
  activeFilterIcon: string | null;
  isLeftExpanded: boolean;
  isRightExpanded: boolean;
  setShowLeftArrow: (show: boolean) => void;
  setShowRightArrow: (show: boolean) => void;
}

export function useColumnBoundaryEffects({
  scrollerRef,
  phases,
  editingTask,
  zoomScale,
  activeFilterIcon,
  isLeftExpanded,
  isRightExpanded,
  setShowLeftArrow,
  setShowRightArrow
}: UseColumnBoundaryEffectsProps) {
  const [columnUiStates, setColumnUiStates] = useState<Record<string, {
    opacity: number;
    scale: number;
    blur: number;
    pointerEvents: "auto" | "none";
    isStageOut: boolean;
  }>>({});

  const { draggingType } = useBuilder();
  const lastPhasesCount = useRef(phases.length);
  const [isLayoutGracePeriod, setIsLayoutGracePeriod] = useState(false);

  const runLayoutBoundaryCheck = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Grace period check or during active dragging - keep everything visible
    if (isLayoutGracePeriod || draggingType === "phase") {
      const newStates: Record<string, {
        opacity: number;
        scale: number;
        blur: number;
        pointerEvents: "auto" | "none";
        isStageOut: boolean;
      }> = {};
      phases.forEach(p => {
        newStates[p.id] = { opacity: 1, scale: 1, blur: 0, pointerEvents: "auto", isStageOut: false };
      });
      setColumnUiStates(newStates);
      return;
    }

    // Wait a frame if phase count changed to ensure DOM elements exist
    if (phases.length !== lastPhasesCount.current) {
      lastPhasesCount.current = phases.length;
      setIsLayoutGracePeriod(true);
      
      // Longer grace period for smoother transitions during insertions
      const timer = setTimeout(() => {
        setIsLayoutGracePeriod(false);
        runLayoutBoundaryCheck();
      }, 1200); 
      return;
    }

    const scrollerRect = scroller.getBoundingClientRect();

    // Track scroll limits for displaying visual navigation aids safely
    const scrollThreshold = 15;
    setShowLeftArrow(scroller.scrollLeft > scrollThreshold);
    setShowRightArrow(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - scrollThreshold);

    const newStates: Record<string, {
      opacity: number;
      scale: number;
      blur: number;
      pointerEvents: "auto" | "none";
      isStageOut: boolean;
    }> = {};

    phases.forEach((p) => {
      const colEl = document.getElementById(p.id);
      if (!colEl) {
        newStates[p.id] = { opacity: 1, scale: 1, blur: 0, pointerEvents: "auto", isStageOut: false };
        return;
      }

      const colRect = colEl.getBoundingClientRect();

      let leftOpacity = 1;
      let rightOpacity = 1;

      if (isRightExpanded) {
        // If right island is open, fade as we slide under it
        const rightIslandEdge = scrollerRect.right - 340; 
        const fadeWidth = 120;
        if (colRect.right > rightIslandEdge) {
          const diff = (rightIslandEdge + fadeWidth) - colRect.right;
          rightOpacity = Math.max(0, Math.min(1, diff / fadeWidth));
        }
        leftOpacity = 1;
      } else if (isLeftExpanded) {
        // If left island is open, fade as we slide under it
        const containsEditingTask = editingTask && p.actionCards?.some((ac: any) => 
          ac.tasks?.some((t: any) => t.id === editingTask.task.id)
        );

        if (containsEditingTask) {
          leftOpacity = 1;
        } else {
          const leftIslandEdge = scrollerRect.left + 330;
          const fadeWidth = 120;
          if (colRect.left < leftIslandEdge) {
            const diff = colRect.left - (leftIslandEdge - fadeWidth);
            leftOpacity = Math.max(0, Math.min(1, diff / fadeWidth));
          }
        }
        rightOpacity = 1;
      } else {
        // Standard view: only fade when truly deep into the overflow
        const fadeWidth = 100;
        const leftBoundary = scrollerRect.left - 150;
        const rightBoundary = scrollerRect.right + 150;

        if (colRect.left < leftBoundary) {
          const diff = colRect.left - (leftBoundary - fadeWidth);
          leftOpacity = Math.max(0, Math.min(1, diff / fadeWidth));
        }
        if (colRect.right > rightBoundary) {
          const diff = (rightBoundary + fadeWidth) - colRect.right;
          rightOpacity = Math.max(0, Math.min(1, diff / fadeWidth));
        }
      }

      // Take minimum opacity to handle both exits beautifully
      const combinedOpacity = Math.min(leftOpacity, rightOpacity);

      // Smooth custom scale and blur based on proximity to the side islands
      const scale = 0.99 + combinedOpacity * 0.01;
      const blur = (1 - combinedOpacity) * 0.5;
      const pointerEvents = combinedOpacity < 0.02 ? "none" : "auto";

      // Stage out triggers an empty skeleton representation - only when almost completely hidden
      const stageOutThreshold = 0.04;
      const isStageOut = combinedOpacity < stageOutThreshold;

      newStates[p.id] = {
        opacity: combinedOpacity,
        scale,
        blur,
        pointerEvents,
        isStageOut,
      };
    });

    setColumnUiStates(newStates);
  }, [phases, scrollerRef, setShowLeftArrow, setShowRightArrow, isLeftExpanded, isRightExpanded]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    runLayoutBoundaryCheck();
    
    scroller.addEventListener("scroll", runLayoutBoundaryCheck, { passive: true });
    
    // Setup observer to trigger calculations during all toggles, scales and expansions
    const observer = new ResizeObserver(() => {
      runLayoutBoundaryCheck();
    });
    observer.observe(scroller);

    const leftIsland = document.getElementById("builder-left-island");
    const rightIsland = document.getElementById("builder-right-island");
    if (leftIsland) observer.observe(leftIsland);
    if (rightIsland) observer.observe(rightIsland);

    // Initial timeout to cover loading sequences
    const timer = setTimeout(runLayoutBoundaryCheck, 180);

    const handleResize = () => runLayoutBoundaryCheck();
    window.addEventListener("resize", handleResize);

    return () => {
      scroller.removeEventListener("scroll", runLayoutBoundaryCheck);
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [phases, editingTask, zoomScale, activeFilterIcon, isLeftExpanded, isRightExpanded, runLayoutBoundaryCheck]);

  return {
    columnUiStates,
    runLayoutBoundaryCheck
  };
}
