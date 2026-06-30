import React, { useState, useEffect } from "react";
import { ActionCardData } from "../../../../types";
import { calculateEndDate } from "../../utils/dateHelper";
import { PHASE_ICONS_MAP, PhaseIconType } from "./PhaseIcons";
import { Megaphone } from "lucide-react";
import { usePhaseActions } from "./usePhaseActions";
import { useBuilderMutations } from "../../hooks/useBuilderMutations";
import { generateId } from "../../../../utils/id.helpers";
import { useTheme } from "../../../../hooks/useTheme";

interface UsePhaseEventsProps {
  id: string;
  data: any;
}

export function usePhaseEvents({ id, data }: UsePhaseEventsProps) {
  const { isDark } = useTheme();
  const {
    onLabelChange,
    onDeletePhase: onDelete,
    onIconChange,
    onDatesChange,
    onActionCardsChange
  } = useBuilderMutations();

  const label = (data.label as string) || "New Phase";
  const activeIconKey = (data.icon as PhaseIconType) || "awareness";
  const initialStartDate = (data.startDate as string) || "2026-03-01";
  const initialEndDate = (data.endDate as string) || "2026-03-15";

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);

  const [isEditingDates, setIsEditingDates] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [isSelectingIcon, setIsSelectingIcon] = useState(false);

  const actionCards = (data.actionCards as ActionCardData[]) || [];

  const [isExpandingActions, setIsExpandingActions] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Action card creation state
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardStartDate, setCardStartDate] = useState(initialStartDate);
  const [cardEndDate, setCardEndDate] = useState(initialEndDate);
  const [cardDurationDays, setCardDurationDays] = useState(3);

  useEffect(() => {
    setCardEndDate(calculateEndDate(cardStartDate, cardDurationDays));
  }, [cardStartDate, cardDurationDays]);

  const handleAddActionCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName) return;

    const newCard: ActionCardData = {
      id: generateId(),
      name: cardName,
      description: cardDescription || undefined,
      startDate: cardStartDate || startDate,
      endDate: cardEndDate || endDate,
      tasks: [],
    };

    const newCards = [...actionCards, newCard];
    if (onActionCardsChange) {
      onActionCardsChange(id, newCards);
    }

    setCardName("");
    setCardDescription("");
    setCardDurationDays(3);
    setIsAddingCard(false);
  };

  const {
    handleDeleteAction: handleDeleteActionCard,
    handleEditAction: handleEditActionCard,
    handleDuplicateAction: handleDuplicateActionCard
  } = usePhaseActions({
    phaseId: id,
    actionCards,
    onActionCardsChange
  });

  const handleLabelBlur = () => {
    setIsEditingLabel(false);
    if (onLabelChange) {
      onLabelChange(id, tempLabel);
    }
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLabelBlur();
    }
  };

  const handleDatesBlur = () => {
    setIsEditingDates(false);
    if (onDatesChange) {
      onDatesChange(id, startDate, endDate);
    }
  };

  const selectIcon = (key: PhaseIconType) => {
    setIsSelectingIcon(false);
    if (onIconChange) {
      onIconChange(id, key);
    }
  };

  const ActiveIconComponent = PHASE_ICONS_MAP[activeIconKey]?.icon || Megaphone;

  const formatDateString = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  const computedStartDate = actionCards.length > 0 
    ? actionCards.reduce((earliest, cur) => cur.startDate < earliest ? cur.startDate : earliest, actionCards[0].startDate) 
    : initialStartDate;

  const computedEndDate = actionCards.length > 0 
    ? actionCards.reduce((latest, cur) => cur.endDate > latest ? cur.endDate : latest, actionCards[0].endDate) 
    : initialEndDate;

  return {
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
  };
}
