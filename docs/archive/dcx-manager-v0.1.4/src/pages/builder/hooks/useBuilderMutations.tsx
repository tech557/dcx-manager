import React, { createContext, useCallback, useContext } from "react";
import { ActionCardData } from "../../../types";

interface BuilderMutationsContextType {
  onLabelChange: (phaseId: string, label: string) => void;
  onIconChange: (phaseId: string, icon: string) => void;
  onDatesChange: (phaseId: string, startDate: string, endDate: string) => void;
  onDeletePhase: (phaseId: string) => void;
  onActionCardsChange: (phaseId: string, actionCards: ActionCardData[]) => void;
  onMoveCardUp: (phaseId: string, cardId: string) => void;
  onMoveCardDown: (phaseId: string, cardId: string) => void;
  onMoveCardToPhase: (phaseId: string, targetPhaseId: string, cardId: string) => void;
  onAddDragAction: (phaseId: string, insertIndex?: number) => void;
  onMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
}

const BuilderMutationsContext = createContext<BuilderMutationsContextType | undefined>(undefined);

interface BuilderMutationsProviderProps {
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  onAddDragAction: (phaseId: string, insertIndex?: number) => void;
  onMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
  children: React.ReactNode;
}

function getDateBounds(actionCards: ActionCardData[], fallbackStart: string, fallbackEnd: string) {
  if (actionCards.length === 0) {
    return { startDate: fallbackStart, endDate: fallbackEnd };
  }

  return {
    startDate: actionCards.reduce(
      (earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest,
      actionCards[0].startDate
    ),
    endDate: actionCards.reduce(
      (latest, cur) => cur.endDate > latest ? cur.endDate : latest,
      actionCards[0].endDate
    ),
  };
}

export function BuilderMutationsProvider({
  setNodes,
  onAddDragAction,
  onMoveCardDirectly,
  children,
}: BuilderMutationsProviderProps) {
  const onLabelChange = useCallback((phaseId: string, label: string) => {
    setNodes((prev) =>
      prev.map((node) => node.id === phaseId ? { ...node, data: { ...node.data, label } } : node)
    );
  }, [setNodes]);

  const onIconChange = useCallback((phaseId: string, icon: string) => {
    setNodes((prev) =>
      prev.map((node) => node.id === phaseId ? { ...node, data: { ...node.data, icon } } : node)
    );
  }, [setNodes]);

  const onDatesChange = useCallback((phaseId: string, startDate: string, endDate: string) => {
    setNodes((prev) =>
      prev.map((node) => node.id === phaseId ? { ...node, data: { ...node.data, startDate, endDate } } : node)
    );
  }, [setNodes]);

  const onDeletePhase = useCallback((phaseId: string) => {
    setNodes((prev) => prev.filter((phase) => phase.id !== phaseId));
  }, [setNodes]);

  const onActionCardsChange = useCallback((phaseId: string, actionCards: ActionCardData[]) => {
    setNodes((prev) =>
      prev.map((node) => node.id === phaseId ? { ...node, data: { ...node.data, actionCards } } : node)
    );
  }, [setNodes]);

  const onMoveCardUp = useCallback((phaseId: string, cardId: string) => {
    setNodes((prev) =>
      prev.map((phaseNode) => {
        if (phaseNode.id !== phaseId) return phaseNode;

        const cards = [...(phaseNode.data.actionCards || [])];
        const idx = cards.findIndex((card) => card.id === cardId);
        if (idx <= 0) return phaseNode;

        [cards[idx - 1], cards[idx]] = [cards[idx], cards[idx - 1]];
        return { ...phaseNode, data: { ...phaseNode.data, actionCards: cards } };
      })
    );
  }, [setNodes]);

  const onMoveCardDown = useCallback((phaseId: string, cardId: string) => {
    setNodes((prev) =>
      prev.map((phaseNode) => {
        if (phaseNode.id !== phaseId) return phaseNode;

        const cards = [...(phaseNode.data.actionCards || [])];
        const idx = cards.findIndex((card) => card.id === cardId);
        if (idx === -1 || idx >= cards.length - 1) return phaseNode;

        [cards[idx], cards[idx + 1]] = [cards[idx + 1], cards[idx]];
        return { ...phaseNode, data: { ...phaseNode.data, actionCards: cards } };
      })
    );
  }, [setNodes]);

  const onMoveCardToPhase = useCallback((phaseId: string, targetPhaseId: string, cardId: string) => {
    setNodes((prev) => {
      const sourceNode = prev.find((phaseNode) => phaseNode.id === phaseId);
      if (!sourceNode) return prev;

      const cardToMove = (sourceNode.data.actionCards || []).find((card: any) => card.id === cardId);
      if (!cardToMove) return prev;

      return prev.map((phaseNode) => {
        if (phaseNode.id === phaseId) {
          const cards = (phaseNode.data.actionCards || []).filter((card: any) => card.id !== cardId);
          const bounds = getDateBounds(cards, phaseNode.data.startDate, phaseNode.data.endDate);
          return {
            ...phaseNode,
            data: {
              ...phaseNode.data,
              actionCards: cards,
              ...bounds,
            },
          };
        }

        if (phaseNode.id === targetPhaseId) {
          const cards = [...(phaseNode.data.actionCards || []), cardToMove];
          const bounds = getDateBounds(cards, phaseNode.data.startDate, phaseNode.data.endDate);
          return {
            ...phaseNode,
            data: {
              ...phaseNode.data,
              actionCards: cards,
              ...bounds,
            },
          };
        }

        return phaseNode;
      });
    });
  }, [setNodes]);

  return (
    <BuilderMutationsContext.Provider
      value={{
        onLabelChange,
        onIconChange,
        onDatesChange,
        onDeletePhase,
        onActionCardsChange,
        onMoveCardUp,
        onMoveCardDown,
        onMoveCardToPhase,
        onAddDragAction,
        onMoveCardDirectly,
      }}
    >
      {children}
    </BuilderMutationsContext.Provider>
  );
}

export function useBuilderMutations() {
  const context = useContext(BuilderMutationsContext);
  if (context === undefined) {
    throw new Error("useBuilderMutations must be used within a BuilderMutationsProvider");
  }
  return context;
}
