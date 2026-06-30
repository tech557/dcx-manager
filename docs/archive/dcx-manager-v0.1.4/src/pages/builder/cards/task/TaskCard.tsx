import React from "react";
import { TaskCardData } from "../../../../types";
import { SmallTaskCard } from "./SmallTaskCard";
import { FullTaskCard } from "./FullTaskCard";

interface TaskCardProps {
  task: TaskCardData;
  onEdit: (updatedTask: TaskCardData) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStartEdit?: () => void;
  parentActionCardId?: string;
  parentPhaseId?: string;
  isMonthly?: boolean;
}

export function TaskCard({
  task,
onEdit,
  onDelete,
  onDuplicate,
  onStartEdit,
  parentActionCardId,
  parentPhaseId,
  isMonthly
}: TaskCardProps) {
  const handleToggleSmall = () => {
    onEdit({
      ...task,
      isSmall: task.isSmall === false
    });
  };

  if (isMonthly || task.isSmall !== false) {
    return (
      <SmallTaskCard
        task={task}
        onToggleSmall={handleToggleSmall}
        onStartEdit={onStartEdit}
        parentActionCardId={parentActionCardId}
        parentPhaseId={parentPhaseId}
        isMonthly={isMonthly}
      />
    );
  }

  return (
    <FullTaskCard
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onStartEdit={onStartEdit}
      parentActionCardId={parentActionCardId}
      parentPhaseId={parentPhaseId}
      onToggleSmall={handleToggleSmall}
    />
  );
}
