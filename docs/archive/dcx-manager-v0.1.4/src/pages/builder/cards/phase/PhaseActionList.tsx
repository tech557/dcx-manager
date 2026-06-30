import React from "react";
import { Clock } from "lucide-react";
import { ActionCardData, TaskCardData } from "../../../../types";
import { ActionCard } from "../action/ActionCard";
import { ActionDropZone } from "../../kanban/ActionDropZone";

interface PhaseActionListProps {
  phaseId: string;
  actionCards: ActionCardData[];
  onAddDragAction: (targetPhaseId: string, insertIndex?: number) => void;
  onMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
  onUpdateNodesDirectly: any;
  onStartEditTask?: (task: TaskCardData, actionCardId: string) => void;
  handleDeleteAction: (cardId: string) => void;
  handleEditAction: (updatedCard: ActionCardData) => void;
  handleDuplicateAction: (card: ActionCardData, index: number) => void;
}

export function PhaseActionList({
phaseId,
  actionCards,
  onAddDragAction,
  onMoveCardDirectly,
  onUpdateNodesDirectly,
  onStartEditTask,
  handleDeleteAction,
  handleEditAction,
  handleDuplicateAction
}: PhaseActionListProps) {
  return (
    <div 
      id={`scroller-${phaseId}`}
      onDragOver={(e) => {
        // Standard pointer/drag hover auto scrolling
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const threshold = 40;
        if (relativeY < threshold) {
          container.scrollTop -= 12;
        } else if (relativeY > rect.height - threshold) {
          container.scrollTop += 12;
        }
      }}
      className="flex-1 overflow-y-auto py-2.5 pr-1.5 space-y-1.5 custom-scrollbar max-h-[360px] sm:max-h-[400px] lg:max-h-[440px] h-auto min-h-[200px] pointer-events-auto"
    >
      <ActionDropZone
        index={0}
        phaseId={phaseId}
        onAddDragAction={onAddDragAction}
        onMoveCardDirectly={onMoveCardDirectly}
      />
      {actionCards.map((card, cardIndex) => (
        <React.Fragment key={card.id}>
          <ActionCard
            card={card}
            onDelete={() => handleDeleteAction(card.id)}
            onEdit={handleEditAction}
            onDuplicate={() => handleDuplicateAction(card, cardIndex)}
            currentOrParentPhaseId={phaseId}
            onStartEditTask={(task, actionCardId) => onStartEditTask?.(task, actionCardId)}
            onUpdateNodesDirectly={onUpdateNodesDirectly}
          />
          <ActionDropZone
            index={cardIndex + 1}
            phaseId={phaseId}
            onAddDragAction={onAddDragAction}
            onMoveCardDirectly={onMoveCardDirectly}
          />
        </React.Fragment>
      ))}

      {/* Empty state list helper inside Col */}
      {actionCards.length === 0 && (
        <div 
          className="h-full py-10 flex flex-col items-center justify-center text-center opacity-40"
          style={{ fontFamily: "'Gilroy', sans-serif" }}
        >
          <Clock className="w-8 h-8 opacity-25 mb-1 text-primary" />
          <p className="text-[10px] leading-snug font-bold">Drag / Drop Action</p>
          <p className="text-[8px] opacity-50 block mt-0.5 font-bold uppercase tracking-widest">OR CLICK ACTION BUTTON</p>
        </div>
      )}
    </div>
  );
}
