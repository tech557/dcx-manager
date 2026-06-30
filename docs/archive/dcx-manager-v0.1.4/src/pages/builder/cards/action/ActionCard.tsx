import React, { useState, useEffect } from "react";
import { ActionCardData, TaskCardData } from "../../../../types";
import { calculateEndDate } from "../../utils/dateHelper";
import { ActionCardForm } from "./ActionCardForm";
import { ActionCardHeader } from "./ActionCardHeader";
import { ActionTaskList } from "./ActionTaskList";
import { motion } from "motion/react";
import { NewActionLoader } from "./NewActionLoader";
import { useActionTasks } from "./useActionTasks";
import { BuilderCardShell } from "../BuilderCardShell";
import { useTheme } from "../../../../hooks/useTheme";


interface ActionCardProps {
  key?: string;
  card: ActionCardData;
  onDelete: () => void;
  onEdit: (updated: ActionCardData) => void;
  onDuplicate: () => void;
  currentOrParentPhaseId?: string;
  onStartEditTask?: (task: TaskCardData, actionCardId: string) => void;
  onUpdateNodesDirectly?: any;
}

export function ActionCard({ 
  card, 
onDelete, 
  onEdit,
  onDuplicate,
  currentOrParentPhaseId,
  onStartEditTask,
  onUpdateNodesDirectly
}: ActionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverExpandTimer, setHoverExpandTimer] = useState<NodeJS.Timeout | null>(null);

  // States for inline name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameText, setEditNameText] = useState(card.name);

  useEffect(() => {
    setEditNameText(card.name);
  }, [card.name]);

  useEffect(() => {
    return () => {
      if (hoverExpandTimer) clearTimeout(hoverExpandTimer);
    };
  }, [hoverExpandTimer]);

  const [name, setName] = useState(card.name);
  const [description, setDescription] = useState(card.description || "");
  const [startDate, setStartDate] = useState(card.startDate);

  useEffect(() => {
    setName(card.name);
    setDescription(card.description || "");
    setStartDate(card.startDate);
  }, [card]);

  const tasksList = card.tasks || [];
  const totalTasks = tasksList.length;

  const {
    dragOverTaskId,
    setDragOverTaskId,
    handleAddTask,
    handleMoveTaskDirectly,
    handleEditTask,
    handleDeleteTask,
    handleDuplicateTask
  } = useActionTasks({
    card,
    tasksList,
    startDate,
    onEdit,
    onUpdateNodesDirectly,
    setIsExpanded
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedEnd = calculateEndDate(startDate, Math.max(1, totalTasks));
    onEdit({
      ...card,
      name,
      description: description.trim() ? description : undefined,
      startDate,
      endDate: calculatedEnd,
    });
    setIsEditing(false);
  };

  const handleSaveNameInline = () => {
    if (editNameText.trim() && editNameText.trim() !== card.name) {
      onEdit({
        ...card,
        name: editNameText.trim()
      });
    }
    setIsEditingName(false);
  };

  const handleDoubleClickAction = (e: React.MouseEvent) => {
    if (isEditing || isEditingName) return;

    const target = e.target as HTMLElement;
    if (
      target.closest("button") || 
      target.closest("input") || 
      target.closest("textarea") ||
      target.closest("[role='dialog']") ||
      target.closest(".interactive-tooltip-content")
    ) {
      return; 
    }

    e.stopPropagation();

    if (!tasksList || tasksList.length === 0) return;

    // Expand all if there is at least one small task; otherwise collapse all
    const hasSmallTasks = tasksList.some(t => t.isSmall !== false);
    const newIsSmall = !hasSmallTasks;

    const updatedTasks = tasksList.map(t => ({
      ...t,
      isSmall: newIsSmall
    }));

    onEdit({
      ...card,
      tasks: updatedTasks
    });
  };

  return (
    <BuilderCardShell
      id={card.id}
      isDraggable={!isEditing}
      dragType="action"
      dragData={{ name: card.name, sourcePhaseId: currentOrParentPhaseId }}
      variant="action"
      onDoubleClick={handleDoubleClickAction}
      onDragOver={(e) => {
        const types = Array.from(e.dataTransfer.types);
        if (
          types.includes("application/dcx-task-add") ||
          types.includes("application/dcx-task-move")
        ) {
          e.preventDefault();
          if (!isExpanded && !hoverExpandTimer) {
            const timer = setTimeout(() => setIsExpanded(true), 600);
            setHoverExpandTimer(timer);
          }
        }
      }}
      onDragLeave={() => {
        if (hoverExpandTimer) {
          clearTimeout(hoverExpandTimer);
          setHoverExpandTimer(null);
        }
      }}
      onDrop={(e) => {
        if (hoverExpandTimer) {
          clearTimeout(hoverExpandTimer);
          setHoverExpandTimer(null);
        }
        const dragAddTask = e.dataTransfer.getData("application/dcx-task-add");
        const moveDataString = e.dataTransfer.getData("application/dcx-task-move");

        if (dragAddTask === "new" || dragAddTask === "new-task") {
          e.preventDefault();
          e.stopPropagation();
          handleAddTask();
        } else if (moveDataString) {
          e.preventDefault();
          e.stopPropagation();
          try {
            const { task, sourceActionCardId } = JSON.parse(moveDataString);
            handleMoveTaskDirectly(task, sourceActionCardId, card.id, tasksList.length);
          } catch (err) {
            console.error(err);
          }
        }
      }}
      className="p-3.5 flex flex-col gap-2 group/card overflow-visible"
    >
      {({ isNewlyCreated, showData }) => {
        // Automatically default expanded state on block initialization if newly created
        if (isNewlyCreated && !isExpanded) {
          setIsExpanded(true);
        }

        return (
          <motion.div
            initial={isNewlyCreated ? { opacity: 0, y: 3 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2 w-full"
          >
            {isNewlyCreated && !showData ? (
              <NewActionLoader />
            ) : (
              <div className="w-full">
                {isEditing ? (
                  <ActionCardForm
                    name={name}
                    setName={setName}
                    description={description}
                    setDescription={setDescription}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    calculatedTaskCount={totalTasks}
                    onCancel={() => setIsEditing(false)}
                    onSubmit={handleSave}
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full relative z-[10]">
                      <ActionCardHeader
                        isEditingName={isEditingName}
                        setIsEditingName={setIsEditingName}
                        editNameText={editNameText}
                        setEditNameText={setEditNameText}
                        handleSaveNameInline={handleSaveNameInline}
                        name={name}
                        onAddTask={handleAddTask}
                        onDuplicate={onDuplicate}
                        onDelete={onDelete}
                      />

                      {/* Container carrying actual TaskCards in small state aligned in a row */}
                      <ActionTaskList
                        tasksList={tasksList}
                        cardId={card.id}
                        dragOverTaskId={dragOverTaskId}
                        setDragOverTaskId={setDragOverTaskId}
                        handleMoveTaskDirectly={handleMoveTaskDirectly}
                        handleEditTask={handleEditTask}
                        handleDeleteTask={handleDeleteTask}
                        handleDuplicateTask={handleDuplicateTask}
                        onStartEditTask={onStartEditTask}
                        parentPhaseId={currentOrParentPhaseId}
                      />

                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      }}
    </BuilderCardShell>
  );
}
