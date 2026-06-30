import React from "react";
import { 
  Trash2, 
  Megaphone,
  Calendar
} from "lucide-react";
import { PHASE_ICONS_MAP, PhaseIconType } from "./PhaseIcons";
import { usePhaseEvents } from "./usePhaseEvents";
import { useBuilder } from "../../context/BuilderContext";
import { useBuilderMutations } from "../../hooks/useBuilderMutations";
import { PhaseBody } from "./PhaseBody";
import { BuilderCardShell } from "../BuilderCardShell";
import { PopoverShell } from "../../../../components/ui/PopoverShell";
import { useTheme } from "../../../../hooks/useTheme";


interface PhaseCardProps {
  id: string;
  data: any;
  selected?: boolean;
}

export function PhaseCard({ id, data, selected }: PhaseCardProps) {
  const { isDark } = useTheme();
  const { onStartEditTask } = useBuilder();
  const { onAddDragAction, onMoveCardDirectly } = useBuilderMutations();
  const {
label,
    activeIconKey,
    isEditingLabel,
    setIsEditingLabel,
    tempLabel,
    setTempLabel,
    isEditingDates,
    setIsEditingDates,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSelectingIcon,
    setIsSelectingIcon,
    isExpandingActions,
    setIsExpandingActions,
    isAddingCard,
    setIsAddingCard,
    isDragOver,
    setIsDragOver,
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
    onDelete,
    actionCards,
    handleAddActionCardSubmit,
    handleEditActionCard,
    handleDuplicateActionCard,
    handleDeleteActionCard,
    handleLabelBlur,
    handleLabelKeyDown,
    handleDatesBlur,
    selectIcon,
    ActiveIconComponent,
    formatDateString,
    computedStartDate,
    computedEndDate
  } = usePhaseEvents({ id, data });

  return (
    <BuilderCardShell
      id={id}
      isSelected={selected}
      variant="phase"
      isDragOver={isDragOver}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
      }}
      onDragLeave={() => {
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        setIsDragOver(false);
        e.preventDefault();

        const dragAddType = e.dataTransfer.getData("application/dcx-action-add");
        if (dragAddType === "new" || dragAddType === "new-action") {
          onAddDragAction(id);
          return;
        }

        const moveDataString = e.dataTransfer.getData("application/dcx-action-move");
        if (moveDataString) {
          try {
            const { cardId, sourcePhaseId } = JSON.parse(moveDataString);
            if (sourcePhaseId !== id) {
              onMoveCardDirectly(sourcePhaseId, id, cardId);
            }
          } catch (err) {
            console.error("Failed to parse", err);
          }
        }
      }}
      className="p-6 min-w-[300px] max-w-[340px] pointer-events-auto"
    >

      <div className="flex items-center gap-2 mb-3.5 group/title relative">
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsSelectingIcon(!isSelectingIcon)}
            className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
              isDark 
                ? "bg-white/5 border-white/[0.04] hover:bg-white/10 hover:border-[#75E2FF]/20 text-[#75E2FF]" 
                : "bg-black/5 border-black/[0.04] hover:bg-black/10 hover:border-black/15 text-neutral-800"
            }`}
          >
            <ActiveIconComponent className="w-4 h-4" />
          </button>

          {isSelectingIcon && (
            <PopoverShell className="left-0 top-10 p-3 grid grid-cols-4 gap-1.5 shadow-2xl min-w-[170px]" width="w-[170px]">
              {Object.entries(PHASE_ICONS_MAP).map(([key, config]) => {
                const ItemIcon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectIcon(key as any)}
                    className={`p-2 rounded-xl transition-all hover:scale-110 cursor-pointer flex items-center justify-center ${
                      activeIconKey === key 
                        ? (isDark ? "bg-white/10 text-[#75E2FF] border border-[#75E2FF]/20" : "bg-black/10 text-black border border-black/20")
                        : (isDark ? "hover:bg-white/5 text-gray-400" : "hover:bg-black/5 text-gray-600")
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                  </button>
                );
              })}
            </PopoverShell>
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          {isEditingLabel ? (
            <input
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
              autoFocus
              className={`w-full text-base font-black tracking-tight bg-transparent outline-none border-b py-0.5 ${
                isDark ? "text-white border-white/20 focus:border-[#75E2FF]" : "text-black border-black/20 focus:border-black"
              }`}
            />
          ) : (
            <h3
              onDoubleClick={() => setIsEditingLabel(true)}
              className="text-base font-black tracking-tight leading-none cursor-text select-none hover:underline decoration-dotted decoration-[#75E2FF]/50 text-current truncate uppercase animate-none"
            >
              {label}
            </h3>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-xl transition-all duration-300 cursor-pointer flex-shrink-0 ${
              isDark ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-rose-500/5 text-rose-600"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mb-4">
        {actionCards.length > 0 ? (
          <div className="flex items-center gap-1.5 text-left opacity-60">
            <Calendar className="w-3 h-3 text-[#75E2FF]" />
            <span className="text-[10px] font-bold font-mono tracking-tight text-current uppercase">
              {formatDateString(computedStartDate)} — {formatDateString(computedEndDate)}
            </span>
          </div>
        ) : (
          <div>
            {isEditingDates ? (
              <div className="flex items-center gap-1.5" onBlur={(e) => {
                setTimeout(() => {
                  if (!e.currentTarget.contains(document.activeElement)) {
                    handleDatesBlur();
                  }
                }, 100);
              }}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`text-[9px] p-1 font-mono rounded-md border ${
                    isDark ? "bg-black/40 border-white/10 text-white" : "bg-white border-black/10 text-black"
                  }`}
                />
                <span className="opacity-45 text-[8px] font-mono">TO</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`text-[9px] p-1 font-mono rounded-md border ${
                    isDark ? "bg-black/40 border-white/10 text-white" : "bg-white border-black/10 text-black"
                  }`}
                />
              </div>
            ) : (
              <div 
                onClick={() => setIsEditingDates(true)}
                className="flex items-center gap-1.5 cursor-pointer max-w-max select-none opacity-60 hover:opacity-100 transition-opacity"
              >
                <Calendar className="w-3 h-3 text-[#75E2FF]" />
                <span className="text-[10px] font-bold font-mono tracking-tight text-current uppercase decoration-dashed decoration-current/30 underline underline-offset-2">
                  {formatDateString(startDate)} — {formatDateString(endDate)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-current/5 mb-4" />

      <PhaseBody
        phaseId={id}
        actionCards={actionCards}
        isExpandingActions={isExpandingActions}
        setIsExpandingActions={setIsExpandingActions}
        isAddingCard={isAddingCard}
        setIsAddingCard={setIsAddingCard}
        cardName={cardName}
        setCardName={setCardName}
        cardDescription={cardDescription}
        setCardDescription={setCardDescription}
        cardStartDate={cardStartDate}
        setCardStartDate={setCardStartDate}
        cardEndDate={cardEndDate}
        setCardEndDate={setCardEndDate}
        cardDurationDays={cardDurationDays}
        setCardDurationDays={setCardDurationDays}
        computedStartDate={computedStartDate}
        computedEndDate={computedEndDate}
        handleDeleteActionCard={handleDeleteActionCard}
        handleEditActionCard={handleEditActionCard}
        handleDuplicateActionCard={handleDuplicateActionCard}
        handleAddActionCardSubmit={handleAddActionCardSubmit}
        onStartEditTask={(task, actionCardId) => {
          onStartEditTask(task, id, actionCardId);
        }}
      />
    </BuilderCardShell>
  );
}
