import { useState, useCallback, useEffect } from "react";
import { EnrichedVersion, ActionCardData } from "../../../types";
import { useBuilderStore } from "../../../store/builderStore";
import { usePatchVersionPhasesMutation } from "../../../queries/builderQueries";
import { generateId } from "../../../utils/id.helpers";

export function useBuilderNodes(
  currentVersion: EnrichedVersion, 
  isDark: boolean,
  onUpdateVersionData?: (updatedVersion: EnrichedVersion) => void
) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [lastVersionId, setLastVersionId] = useState<string | null>(null);

  const setReactSetNodes = useBuilderStore((s) => s.setReactSetNodes);
  useEffect(() => {
    setReactSetNodes(setNodes);
    return () => {
      setReactSetNodes(null);
    };
  }, [setNodes, setReactSetNodes]);

  // ADD ACTION directly or via drag-and-drop
  const handleDragAddAction = useCallback((targetPhaseId: string, insertIndex?: number) => {
    useBuilderStore.getState().clearSelection();
    setNodes((prevNodes) => {
      // Calculate overall total action cards across all phase nodes
      const totalActions = prevNodes
        .filter((n) => n.type === "phase")
        .reduce((acc, n) => acc + (n.data.actionCards || []).length, 0);

      const targetNode = prevNodes.find((pn) => pn.id === targetPhaseId);
      if (!targetNode) return prevNodes;

      const defaultStart = targetNode.data.startDate || new Date().toISOString().split('T')[0];
      const defaultEnd = targetNode.data.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const newCard: ActionCardData = {
        id: generateId(),
        name: `Action ${totalActions + 1}`,
        startDate: defaultStart,
        endDate: defaultEnd,
        tasks: []
      };

      useBuilderStore.getState().setLastCreatedId(newCard.id);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("object-created", { detail: { id: newCard.id, type: "action" } }));
        }
      }, 50);

      return prevNodes.map((pn) => {
        if (pn.id === targetPhaseId) {
          const originalCards = pn.data.actionCards || [];
          const cards = [...originalCards];
          if (typeof insertIndex === "number" && insertIndex >= 0 && insertIndex <= cards.length) {
            cards.splice(insertIndex, 0, newCard);
          } else {
            cards.push(newCard);
          }
          const start = cards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, cards[0].startDate);
          const end = cards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, cards[0].endDate);
          return {
            ...pn,
            data: {
              ...pn.data,
              actionCards: cards,
              startDate: start,
              endDate: end
            }
          };
        }
        return pn;
      });
    });
  }, []);

  // MOVE CARD directly between phase segments
  const handleMoveCardDirectly = useCallback((sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => {
    setNodes((currentNds) => {
      const sourceNode = currentNds.find((pn) => pn.id === sourcePhaseId);
      if (!sourceNode) return currentNds;

      const cardToMove = (sourceNode.data.actionCards || []).find((c: any) => c.id === cardId);
      if (!cardToMove) return currentNds;

      return currentNds.map((pn) => {
        // Remove from source node (if moving between different columns)
        if (pn.id === sourcePhaseId && sourcePhaseId !== targetPhaseId) {
          const cards = (pn.data.actionCards || []).filter((c: any) => c.id !== cardId);
          const start = cards.length > 0 
            ? cards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, cards[0].startDate) 
            : pn.data.startDate;
          const end = cards.length > 0 
            ? cards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, cards[0].endDate) 
            : pn.data.endDate;

          return {
            ...pn,
            data: {
              ...pn.data,
              actionCards: cards,
              startDate: start,
              endDate: end
            }
          };
        }
        // Add to target node (reordering in same column OR moving to new column)
        if (pn.id === targetPhaseId) {
          const originalCards = pn.data.actionCards || [];
          let cards = originalCards;
          if (sourcePhaseId === targetPhaseId) {
            cards = cards.filter((c: any) => c.id !== cardId);
          }
          const updatedCards = [...cards];
          if (typeof insertIndex === "number" && insertIndex >= 0 && insertIndex <= updatedCards.length) {
            updatedCards.splice(insertIndex, 0, cardToMove);
          } else {
            updatedCards.push(cardToMove);
          }
          const start = updatedCards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, updatedCards[0].startDate);
          const end = updatedCards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, updatedCards[0].endDate);

          return {
            ...pn,
            data: {
              ...pn.data,
              actionCards: updatedCards,
              startDate: start,
              endDate: end
            }
          };
        }
        return pn;
      });
    });
  }, []);

  // Load initial nodes from currentVersion.phases when versionId changes
  useEffect(() => {
    if (!currentVersion) return;
    if (currentVersion.id !== lastVersionId) {
      setLastVersionId(currentVersion.id);

      const registeredPhases = currentVersion.phases || [];
      if (registeredPhases.length > 0) {
        const loadedNodes = registeredPhases.map((phase, index) => {
          return {
            id: phase.id,
            type: "phase",
            position: phase.position || {
              x: 100 + index * 380,
              y: 220,
            },
            data: {
              label: phase.label,
              icon: phase.icon,
              startDate: phase.startDate,
              endDate: phase.endDate,
              actionCards: phase.actionCards || [],
              isDark,
            },
          };
        });

        setNodes(loadedNodes);
      } else {
        setNodes([]);
      }
    }
  }, [currentVersion, lastVersionId, isDark]);

  const patchPhasesMutation = usePatchVersionPhasesMutation();
  const [localSaveStatus, setLocalSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Sync builder nodes modifications back to the global currentVersion.phases object in real-time with debounced saving
  useEffect(() => {
    if (!currentVersion || nodes.length === 0) return;
    const phaseNodes = nodes.filter((n) => n.type === "phase");
    const updatedPhases = phaseNodes.map((pn) => ({
      id: pn.id,
      label: pn.data.label,
      icon: pn.data.icon,
      startDate: pn.data.startDate,
      endDate: pn.data.endDate,
      position: pn.position,
      actionCards: pn.data.actionCards || []
    }));
    
    const existingPhasesJson = JSON.stringify(currentVersion.phases || []);
    const updatedPhasesJson = JSON.stringify(updatedPhases);
    
    if (existingPhasesJson !== updatedPhasesJson) {
      setLocalSaveStatus("saving");
      const debounceTimer = setTimeout(() => {
        patchPhasesMutation.mutate(
          { id: currentVersion.id, phases: updatedPhases },
          {
            onSuccess: (updatedVer) => {
              setLocalSaveStatus("saved");
              if (onUpdateVersionData) {
                onUpdateVersionData(updatedVer);
              }
              const idleTimer = setTimeout(() => {
                setLocalSaveStatus("idle");
              }, 2000);
              return () => clearTimeout(idleTimer);
            },
            onError: () => {
              setLocalSaveStatus("error");
            }
          }
        );
      }, 1500); // 1.5 seconds debounce
      
      return () => clearTimeout(debounceTimer);
    }
  }, [nodes, currentVersion, onUpdateVersionData, patchPhasesMutation]);

  // Keep isDark styling synchronized inside live node states on theme toggle
  useEffect(() => {
    setNodes((nds) => {
      const phasesList = nds
        .filter((pn) => pn.type === "phase")
        .map((pn) => ({ id: pn.id, label: pn.data.label || "Untitled Phase" }));

      return nds.map((n) => {
        if (n.type === "phase") {
          return {
            ...n,
            data: {
              ...n.data,
              isDark,
              allPhasesList: phasesList,
            },
          };
        }
        return n;
      });
    });
  }, [isDark]);

  // Method to create a phase column/column in the horizontal view list
  const handleAddPhase = useCallback((insertIndex?: number) => {
    useBuilderStore.getState().clearSelection();
    const id = generateId();

    useBuilderStore.getState().setLastCreatedId(id);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("object-created", { detail: { id, type: "phase" } }));
      }
    }, 50);
    setNodes((nds) => {
      const currentPhases = nds.filter((n) => n.type === "phase");
      const newIndex = currentPhases.length + 1;
      const icons: ('awareness'|'teaser'|'launch'|'scale'|'maintenance')[] = ['awareness', 'teaser', 'launch', 'scale', 'maintenance'];
      const selectedIcon = icons[(newIndex - 1) % icons.length];
      
      const newNode = {
        id,
        type: "phase",
        position: {
          x: 100,
          y: 220,
        },
        data: {
          label: `Phase ${newIndex}`,
          icon: selectedIcon,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          actionCards: [],
          isDark,
        },
      };

      const updatedPhases = [...currentPhases];
      if (typeof insertIndex === "number" && insertIndex >= 0 && insertIndex <= updatedPhases.length) {
        updatedPhases.splice(insertIndex, 0, newNode);
      } else {
        updatedPhases.push(newNode);
      }

      const nonPhases = nds.filter((n) => n.type !== "phase");
      const positionedPhases = updatedPhases.map((p, idx) => ({
        ...p,
        position: {
          ...p.position,
          x: 100 + idx * 380,
          y: 220
        }
      }));

      return [...nonPhases, ...positionedPhases];
    });
  }, [isDark]);

  return {
    nodes,
    setNodes,
    handleAddPhase,
    handleDragAddAction,
    handleMoveCardDirectly,
    saveStatus: localSaveStatus
  };
}
