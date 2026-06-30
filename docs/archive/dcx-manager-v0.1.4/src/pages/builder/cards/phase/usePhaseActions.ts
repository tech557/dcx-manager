import { ActionCardData, TaskCardData } from "../../../../types";
import { useBuilderStore } from "../../../../store/builderStore";
import { generateId } from "../../../../utils/id.helpers";
import { createDefaultTask } from "../../../../utils/task.factory";

interface UsePhaseActionsProps {
  phaseId: string;
  actionCards: ActionCardData[];
  onUpdatePhaseField?: (phaseId: string, updates: any) => void;
  onActionCardsChange?: (phaseId: string, cards: ActionCardData[]) => void;
}

export function usePhaseActions({
  phaseId,
  actionCards,
  onUpdatePhaseField,
  onActionCardsChange
}: UsePhaseActionsProps) {

  const notifyChanges = (newCards: ActionCardData[]) => {
    if (onUpdatePhaseField) {
      onUpdatePhaseField(phaseId, {
        actionCards: newCards,
      });
    }
    if (onActionCardsChange) {
      onActionCardsChange(phaseId, newCards);
    }
  };

  const handleDeleteAction = (cardId: string) => {
    const updated = actionCards.filter((c) => c.id !== cardId);
    notifyChanges(updated);
  };

  const handleEditAction = (updatedCard: ActionCardData) => {
    const updated = actionCards.map((c) => c.id === updatedCard.id ? updatedCard : c);
    notifyChanges(updated);
  };

  const handleDuplicateAction = (card: ActionCardData, cardIndex: number) => {
    const duplicateCard: ActionCardData = {
      ...card,
      id: generateId(),
      name: `${card.name} (Copy)`,
      tasks: (card.tasks || []).map((t) => createDefaultTask({ ...t }))
    };

    useBuilderStore.getState().setLastCreatedId(duplicateCard.id);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("object-created", { 
            detail: { id: duplicateCard.id, type: "action" } 
          })
        );
      }
    }, 50);

    const updated = [...actionCards];
    updated.splice(cardIndex + 1, 0, duplicateCard);
    notifyChanges(updated);
  };

  return {
    handleDeleteAction,
    handleEditAction,
    handleDuplicateAction
  };
}
