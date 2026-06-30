import React from "react";
import { Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TaskCardData } from "../../../../types";
import { TaskCard } from "../task/TaskCard";
import { TaskDropZone } from "./TaskDropZone";
import { useBuilder } from "../../context/BuilderContext";

interface ActionTaskListProps {
  tasksList: TaskCardData[];
  cardId: string;
  dragOverTaskId: string | null;
  setDragOverTaskId: (id: string | null) => void;
  handleMoveTaskDirectly: (
    taskData: TaskCardData,
    sourceCardId: string,
    targetCardId: string,
    insertIndex: number
  ) => void;
  handleEditTask: (updatedTask: TaskCardData) => void;
  handleDeleteTask: (taskId: string) => void;
  handleDuplicateTask: (taskToDuplicate: TaskCardData) => void;
  onStartEditTask?: (task: TaskCardData, actionCardId: string) => void;
  parentPhaseId?: string;
}

export function ActionTaskList({
tasksList,
  cardId,
  dragOverTaskId,
  setDragOverTaskId,
  handleMoveTaskDirectly,
  handleEditTask,
  handleDeleteTask,
  handleDuplicateTask,
  onStartEditTask,
  parentPhaseId
}: ActionTaskListProps) {
  const { draggingType } = useBuilder();
  const calculatedTaskCount = tasksList.length;

  return (
    <div className="w-full relative z-20">
      {calculatedTaskCount === 0 ? (
        <div 
          className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5 py-1"
          style={{ fontFamily: "'Gilroy', sans-serif" }}
        >
          <Compass className="w-3.5 h-3.5 text-[#75E2FF] animate-pulse shrink-0" />
          <span>No tasks added yet</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-2 w-full">
          {draggingType === "task" && (
            <TaskDropZone 
              index={0}  
              cardId={cardId}
              onMoveTaskDirectly={handleMoveTaskDirectly}
              isSmall={tasksList.length > 0 && tasksList[0].isSmall !== false}
            />
          )}
          <AnimatePresence mode="popLayout" initial={false}>
            {tasksList.flatMap((task, index) => {
              const isDragTarget = dragOverTaskId === task.id;
              const items = [
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  id={`fav-${task.id}`}
                  onDragOver={(e) => {
                    const types = Array.from(e.dataTransfer.types);
                    if (types.includes("application/dcx-task-move")) {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverTaskId(task.id);
                    }
                  }}
                  onDragLeave={() => {
                    setDragOverTaskId(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverTaskId(null);
                    const moveDataString = e.dataTransfer.getData("application/dcx-task-move");
                    if (moveDataString) {
                      try {
                        const { task: draggedTask, sourceActionCardId } = JSON.parse(moveDataString);
                        const targetIndex = tasksList.findIndex((t) => t.id === task.id);
                        if (targetIndex !== -1) {
                          handleMoveTaskDirectly(draggedTask, sourceActionCardId, cardId, targetIndex);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }
                  }}
                  className={`transition-all duration-300 relative ${
                    task.isSmall !== false 
                      ? "w-[68px] h-[68px] shrink-0" 
                      : "w-full shrink-0 z-30"
                  } ${
                    isDragTarget 
                      ? "ring-2 ring-[#75E2FF] scale-105 z-50 shadow-[0_0_15px_rgba(117,226,255,0.4)]" 
                      : ""
                  }`}
                >
                  <TaskCard
                    task={task}
                    parentActionCardId={cardId}
                    parentPhaseId={parentPhaseId}
                    onEdit={handleEditTask}
                    onDelete={() => handleDeleteTask(task.id)}
                    onDuplicate={() => handleDuplicateTask(task)}
                    onStartEdit={() => onStartEditTask?.(task, cardId)}
                  />
                </motion.div>
              ];

              if (draggingType === "task") {
                const isCurrentSmall = task.isSmall !== false;
                const isNextSmall = index + 1 < tasksList.length && tasksList[index + 1].isSmall !== false;
                const isDropSmall = isCurrentSmall && (index + 1 >= tasksList.length || isNextSmall);

                items.push(
                  <TaskDropZone 
                    key={`${task.id}-drop`}
                    index={index + 1}  
                    cardId={cardId}
                    onMoveTaskDirectly={handleMoveTaskDirectly}
                    isSmall={isDropSmall}
                  />
                );
              }

              return items;
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
