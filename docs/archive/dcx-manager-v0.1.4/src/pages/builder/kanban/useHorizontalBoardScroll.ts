import { useState } from "react";
import type React from "react";

interface UseHorizontalBoardScrollArgs {
  scrollerRef: React.RefObject<HTMLDivElement>;
  setIsDragOverWorkspace: (val: boolean) => void;
  handleAddPhase: (index?: number) => void;
}

export function useHorizontalBoardScroll({
  scrollerRef,
  setIsDragOverWorkspace,
  handleAddPhase,
}: UseHorizontalBoardScrollArgs) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scrollBy = (amount: number) => {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.types).includes("application/dcx-phase-add")) {
      e.preventDefault();
      setIsDragOverWorkspace(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOverWorkspace(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    const isPhaseAdd = e.dataTransfer.getData("application/dcx-phase-add");
    if (isPhaseAdd === "new" || isPhaseAdd === "new-phase") {
      e.preventDefault();
      setIsDragOverWorkspace(false);
      handleAddPhase();
    }
  };

  return {
    showLeftArrow,
    setShowLeftArrow,
    showRightArrow,
    setShowRightArrow,
    handleScrollLeft: () => scrollBy(-420),
    handleScrollRight: () => scrollBy(420),
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
