import React, { useEffect } from "react";
import { useBuilder } from "../context/BuilderContext";
import { ActionCardData } from "../../../types";

export function useKeyboardInteractions(
  nodes: any[],
  setNodes: React.Dispatch<React.SetStateAction<any[]>>
) {
  const {
    selectedIds,
    clearSelection,
    selectIds,
    copySelection,
    pasteClipboard,
    deleteSelected,
  } = useBuilder();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;

      // Check if user is typing inside an input/textarea/editable. If so, bypass shortcut listeners
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      // 1. SELECT ALL (Ctrl + A / ⌘ + A)
      if (isMeta && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const allIds: string[] = [];
        nodes.forEach((n) => {
          if (n.type === "phase") {
            const cards: ActionCardData[] = n.data?.actionCards || [];
            cards.forEach((c) => {
              allIds.push(c.id);
              const tasks = c.tasks || [];
              tasks.forEach((t) => allIds.push(t.id));
            });
          }
        });
        selectIds(allIds);
      }

      // 2. COPY (Ctrl + C / ⌘ + C)
      if (isMeta && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copySelection(nodes);
      }

      // 3. PASTE (Ctrl + V / ⌘ + V)
      if (isMeta && e.key.toLowerCase() === "v") {
        e.preventDefault();
        
        // Find a suitable paste target. Let's find the last selected card, or the first column
        const firstSelectedId = Array.from(selectedIds)[0];
        let targetPhaseId = "";
        let targetActionCardId: string | null = null;

        if (firstSelectedId) {
          for (const n of nodes) {
            if (n.type !== "phase") continue;
            const cards: ActionCardData[] = n.data?.actionCards || [];
            const matchedCard = cards.find((c) => c.id === firstSelectedId);
            if (matchedCard) {
              targetPhaseId = n.id;
              targetActionCardId = matchedCard.id;
              break;
            }
            const matchedTask = cards.find((c) => 
              (c.tasks || []).some((t) => t.id === firstSelectedId)
            );
            if (matchedTask) {
              targetPhaseId = n.id;
              targetActionCardId = matchedTask.id;
              break;
            }
          }
        }

        // Default fallback to first Phase node if no target found
        if (!targetPhaseId) {
          const firstPhase = nodes.find((n) => n.type === "phase");
          if (firstPhase) {
            targetPhaseId = firstPhase.id;
          }
        }

        if (targetPhaseId) {
          pasteClipboard(targetPhaseId, targetActionCardId, nodes, setNodes);
        }
      }

      // 4. DELETE / BACKSPACE (Delete / Backspace key)
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected(nodes, setNodes);
      }

      // 5. ESCAPE - Escape key clears active selections
      if (e.key === "Escape") {
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    nodes,
    selectedIds,
    selectIds,
    copySelection,
    pasteClipboard,
    deleteSelected,
    clearSelection,
    setNodes,
  ]);
}
