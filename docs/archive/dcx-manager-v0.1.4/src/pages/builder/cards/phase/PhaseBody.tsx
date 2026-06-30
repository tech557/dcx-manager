import React from "react";
import { Play, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { ActionCardData } from "../../../../types";
import { ActionCard } from "../action/ActionCard";
import { CreateDirectiveForm } from "./CreateDirectiveForm";
import { useTheme } from "../../../../hooks/useTheme";


interface PhaseBodyProps {
  phaseId: string;
  actionCards: ActionCardData[];
  isExpandingActions: boolean;
  setIsExpandingActions: (val: boolean) => void;
  isAddingCard: boolean;
  setIsAddingCard: (val: boolean) => void;
  cardName: string;
  setCardName: (val: string) => void;
  cardDescription: string;
  setCardDescription: (val: string) => void;
  cardStartDate: string;
  setCardStartDate: (val: string) => void;
  cardEndDate: string;
  setCardEndDate: (val: string) => void;
  cardDurationDays: number;
  setCardDurationDays: (val: number) => void;
  computedStartDate: string;
  computedEndDate: string;
  handleDeleteActionCard: (id: string) => void;
  handleEditActionCard: (updatedCard: ActionCardData) => void;
  handleDuplicateActionCard: (card: ActionCardData, index: number) => void;
  handleAddActionCardSubmit: (e: React.FormEvent) => void;
  onStartEditTask: (task: any, actionCardId: string) => void;
}

export function PhaseBody({
phaseId,
  actionCards,
  isExpandingActions,
  setIsExpandingActions,
  isAddingCard,
  setIsAddingCard,
  cardName,
  setCardName,
  cardDescription,
  setCardDescription,
  cardStartDate,
  setCardStartDate,
  cardEndDate,
  setCardEndDate,
  cardDurationDays,
  setCardDurationDays,
  computedStartDate,
  computedEndDate,
  handleDeleteActionCard,
  handleEditActionCard,
  handleDuplicateActionCard,
  handleAddActionCardSubmit,
  onStartEditTask,
}: PhaseBodyProps) {
  const { isDark } = useTheme();
  return (
    <div className="space-y-4">
      <div 
        onClick={() => setIsExpandingActions(!isExpandingActions)}
        className={`flex items-center justify-between cursor-pointer select-none p-1 rounded-xl transition-colors ${
          isDark ? "hover:bg-white/5" : "hover:bg-black/5"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg ${isDark ? 'bg-white/5 text-[#75E2FF]' : 'bg-black/5 text-neutral-800'}`}>
            <Play className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <span className="text-[8px] font-black tracking-widest uppercase opacity-45 block font-mono">ACTION DIRECTIVES</span>
            <span className="font-mono text-[11px] font-bold tracking-tight text-current">
              {actionCards.length} {actionCards.length === 1 ? "Active Directive" : "Active Directives"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-mono font-bold tracking-wider opacity-50">
            {isExpandingActions ? "COLLAPSE" : "EXPAND"}
          </span>
          {isExpandingActions ? <ChevronUp className="w-3.5 h-3.5 opacity-60" /> : <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
        </div>
      </div>

      {isExpandingActions && (
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 pb-1 scrollbar-thin">
          {actionCards.map((card, index) => (
            <ActionCard 
              key={card.id} 
              card={card}
              onDelete={() => handleDeleteActionCard(card.id)}
              onEdit={handleEditActionCard}
              onDuplicate={() => handleDuplicateActionCard(card, index)}
              currentOrParentPhaseId={phaseId}
              onStartEditTask={(task, actionCardId) => {
                onStartEditTask(task, actionCardId);
              }}
            />
          ))}

          {actionCards.length === 0 && (
            <p className="text-[10px] opacity-40 italic text-center py-4 block">
              No active directives mapped to this campaign phase
            </p>
          )}

          {!isAddingCard ? (
            <button
              type="button"
              onClick={() => {
                setIsAddingCard(true);
                setCardName("");
                setCardDescription("");
                setCardStartDate(computedStartDate);
                setCardEndDate(computedEndDate);
                setCardDurationDays(3);
              }}
              className={`w-full py-2 border border-dashed rounded-[1.25rem] text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                isDark 
                  ? "border-white/10 hover:border-white/25 hover:bg-white/[0.02]" 
                  : "border-black/15 hover:border-black/25 hover:bg-black/[0.02]"
              }`}
            >
              <Plus className="w-3 h-3 text-[#75E2FF]" />
              <span>Configure Action Directive</span>
            </button>
          ) : (
            <CreateDirectiveForm
              cardName={cardName}
              setCardName={setCardName}
              cardDescription={cardDescription}
              setCardDescription={setCardDescription}
              cardStartDate={cardStartDate}
              setCardStartDate={setCardStartDate}
              cardEndDate={cardEndDate}
              cardDurationDays={cardDurationDays}
              setCardDurationDays={setCardDurationDays}
              onCancel={() => setIsAddingCard(false)}
              onSubmit={handleAddActionCardSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
}
