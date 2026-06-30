import React, { useState, useEffect } from "react";
import { useBuilder } from "../context/BuilderContext";
import { generateId } from "../../../utils/id.helpers";

interface UseKanbanColumnEventsProps {
  phaseNode: any;
  onUpdatePhaseField: (phaseId: string, updates: any) => void;
  onAddDragAction: (targetPhaseId: string, insertIndex?: number) => void;
  onMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
  onUpdateNodesDirectly: any;
  onStartEditTask?: (task: any, phaseId: string, actionCardId: string) => void;
}

export function useKanbanColumnEvents({
  phaseNode,
  onUpdatePhaseField,
  onAddDragAction,
  onMoveCardDirectly,
  onUpdateNodesDirectly,
  onStartEditTask
}: UseKanbanColumnEventsProps) {
  const { draggingType, setDraggingType } = useBuilder();
  const [isColumnDragOver, setIsColumnDragOver] = useState(false);
  const [dragHoverTimer, setDragHoverTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!draggingType) {
      setIsColumnDragOver(false);
    }
  }, [draggingType]);

  useEffect(() => {
    return () => {
      if (dragHoverTimer) clearTimeout(dragHoverTimer);
    };
  }, [dragHoverTimer]);

  const handleDragStart = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;

    // Check if dragging a nested draggable child item (ActionCard, TaskCard, etc.)
    const closestDraggable = target.closest("[draggable='true']");
    if (closestDraggable && closestDraggable.id !== phaseNode.id) {
      return;
    }

    // Prevent dragging the column when interacting with inputs, buttons, etc.
    if (
      target.closest("input") || 
      target.closest("select") || 
      target.closest("button") || 
      target.closest("textarea")
    ) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("application/dcx-phase-rearrange", phaseNode.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingType("phase");
  };

  const handleDragEnd = () => {
    setDraggingType(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsColumnDragOver(true);
  };

  const handleDragLeave = () => {
    setIsColumnDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsColumnDragOver(false);
    e.preventDefault();

    // 0. ADD PHASE drag trigger
    const dragAddPhase = e.dataTransfer.getData("application/dcx-phase-add");
    if (dragAddPhase === "new-phase") {
      onUpdateNodesDirectly((prevNodes: any[]) => {
        const currentPhases = prevNodes.filter((n) => n.type === "phase");
        const targetIdx = currentPhases.findIndex((p) => p.id === phaseNode.id);
        if (targetIdx !== -1) {
          const id = generateId();
          const newIndex = currentPhases.length + 1;
          const icons: ('awareness'|'teaser'|'launch'|'scale'|'maintenance')[] = ['awareness', 'teaser', 'launch', 'scale', 'maintenance'];
          const selectedIcon = icons[(newIndex - 1) % icons.length];
          
          const newPhaseNode = {
            id,
            type: "phase",
            position: {
              x: 100,
              y: 220,
            },
            data: {
              ...phaseNode.data, // copy functions/callbacks safely
              label: `Phase ${newIndex}`,
              icon: selectedIcon,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              actionCards: [],
            }
          };

          const updatedPhases = [...currentPhases];
          updatedPhases.splice(targetIdx + 1, 0, newPhaseNode);

          const nonPhases = prevNodes.filter((n) => n.type !== "phase");
          const positionedPhases = updatedPhases.map((p, idx) => ({
            ...p,
            position: {
              ...p.position,
              x: 100 + idx * 380,
              y: 220
            }
          }));

          return [...nonPhases, ...positionedPhases];
        }
        return prevNodes;
      });
      return;
    }

    // 1. REARRANGE COLUMN drag trigger
    const rearrangePhaseId = e.dataTransfer.getData("application/dcx-phase-rearrange");
    if (rearrangePhaseId) {
      if (rearrangePhaseId !== phaseNode.id) {
        onUpdateNodesDirectly((prevNodes: any[]) => {
          const currentPhases = prevNodes.filter((n) => n.type === "phase");
          const sourceIdx = currentPhases.findIndex((p) => p.id === rearrangePhaseId);
          const targetIdx = currentPhases.findIndex((p) => p.id === phaseNode.id);
          if (sourceIdx !== -1 && targetIdx !== -1) {
            const updatedPhases = [...currentPhases];
            const [movedPhase] = updatedPhases.splice(sourceIdx, 1);
            updatedPhases.splice(targetIdx, 0, movedPhase);

            let phaseInsertCount = 0;
            return prevNodes.map((n) => {
              if (n.type === "phase") {
                const nextPhase = updatedPhases[phaseInsertCount++];
                return {
                  ...nextPhase,
                  position: {
                    ...nextPhase.position,
                    x: 100 + (phaseInsertCount - 1) * 380
                  }
                };
              }
              return n;
            });
          }
          return prevNodes;
        });
      }
      return;
    }

    // 2. ADD ACTION toolbar drag trigger
    const dragAddType = e.dataTransfer.getData("application/dcx-action-add");
    if (dragAddType === "new" || dragAddType === "new-action") {
      onAddDragAction(phaseNode.id);
      return;
    }

    // 3. MOVE CARD drag trigger
    const moveDataString = e.dataTransfer.getData("application/dcx-action-move");
    if (moveDataString) {
      try {
        const { cardId, sourcePhaseId } = JSON.parse(moveDataString);
        if (sourcePhaseId !== phaseNode.id) {
          onMoveCardDirectly(sourcePhaseId, phaseNode.id, cardId);
        }
      } catch (err) {
        console.error("Failed to parse dropped move action", err);
      }
    }
  };

  return {
    isColumnDragOver,
    dragHoverTimer,
    setDragHoverTimer,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
