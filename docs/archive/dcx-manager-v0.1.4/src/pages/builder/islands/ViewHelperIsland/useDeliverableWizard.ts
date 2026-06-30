import React, { useState, useEffect } from "react";
import { ActionCardData } from "../../../../types";
import { createDefaultTask } from "../../../../utils/task.factory";
import { generateId } from "../../../../utils/id.helpers";

export interface TaskCreationContext {
  dateString: string;
  weekIndex: number;
  dayIndex: number;
  anchorDateStr?: string;
}

interface UseDeliverableWizardProps {
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  setIsOpen: (isOpen: boolean) => void;
}

export function useDeliverableWizard({
setNodes,
  setIsOpen,
}: UseDeliverableWizardProps) {
  const [creationCtx, setCreationCtx] = useState<TaskCreationContext | null>(null);
  const [creationStep, setCreationStep] = useState<"phase" | "action" | "task_name">("phase");

  const [selectedPhaseId, setSelectedPhaseId] = useState("");
  const [newPhaseName, setNewPhaseName] = useState("");
  const [isCreatingNewPhase, setIsCreatingNewPhase] = useState(false);

  const [selectedActionId, setSelectedActionId] = useState("");
  const [newActionName, setNewActionName] = useState("");
  const [isCreatingNewAction, setIsCreatingNewAction] = useState(false);

  const [newTaskName, setNewTaskName] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("ch-1");

  // Handler to open task creator
  useEffect(() => {
    const handleOpenWizard = (e: CustomEvent) => {
      const detail = e.detail;
      if (!detail) return;

      setCreationCtx({
        dateString: detail.dateString,
        weekIndex: detail.weekIndex,
        dayIndex: detail.dayIndex,
        anchorDateStr: detail.anchorDateStr,
      });

      // Reset wizard fields
      setCreationStep("phase");
      setSelectedPhaseId("");
      setNewPhaseName("");
      setIsCreatingNewPhase(false);
      setSelectedActionId("");
      setNewActionName("");
      setIsCreatingNewAction(false);
      setNewTaskName("");
      setSelectedChannelId("ch-1");

      // Open the island panel!
      setIsOpen(true);
    };

    window.addEventListener("open-viewhelper-create-task" as any, handleOpenWizard);
    return () => {
      window.removeEventListener("open-viewhelper-create-task" as any, handleOpenWizard);
    };
  }, [setIsOpen]);

  const handleSaveCreatedTask = () => {
    if (!creationCtx || !setNodes) return;
    const { dateString, weekIndex, dayIndex, anchorDateStr } = creationCtx;

    // Calculate sequential day index
    const baseDate = anchorDateStr || "2026-06-13";
    const baseD = new Date(baseDate);
    const baseDayOfWeek = isNaN(baseD.getTime()) ? 0 : baseD.getDay();

    let dayNum = 1;
    if (weekIndex === 1) {
      dayNum = dayIndex < baseDayOfWeek ? 1 : (dayIndex - baseDayOfWeek + 1);
    } else {
      dayNum = dayIndex + 1;
    }

    const newTask = createDefaultTask({
      name: newTaskName.trim() || `Deliverable Task`,
      channelId: selectedChannelId,
      senderId: "p-3", // Account Executive lead
      receiverId: "r-3", // Regional Marketer
      specsIdentifier: `spec-${generateId().slice(0, 4)}`,
      date: {
        mode: "linked",
        weekOffset: weekIndex,
        dayOffset: dayNum
      },
      isSmall: true
    });

    setNodes((prevNodes) => {
      const currentPhases = prevNodes.filter((n) => n.type === "phase");
      const nonPhases = prevNodes.filter((n) => n.type !== "phase");

      if (isCreatingNewPhase) {
        // Create full phase block
        const phaseId = generateId();
        const actionId = generateId();

        const newActionCard: ActionCardData = {
          id: actionId,
          name: newActionName.trim() || `Action Stream 1`,
          startDate: dateString,
          endDate: dateString,
          tasks: [newTask]
        };

        const newPhaseNode = {
          id: phaseId,
          type: "phase",
          position: {
            x: 100,
            y: 220,
          },
          data: {
            label: newPhaseName.trim() || `Phase ${currentPhases.length + 1}`,
            icon: "awareness" as const,
            startDate: dateString,
            endDate: dateString,
            actionCards: [newActionCard],
onActionCardsChange: (targetId: string, newActionCards: ActionCardData[]) => {
              setNodes((prev) =>
                prev.map((pw) => {
                  if (pw.id === targetId) {
                    return {
                      ...pw,
                      data: {
                        ...pw.data,
                        actionCards: newActionCards,
                      }
                    };
                  }
                  return pw;
                })
              );
            },
            onDelete: (deletedId: string) => {
              setNodes((prev) => prev.filter((prevNode) => prevNode.id !== deletedId));
            },
            onLabelChange: (targetId: string, newLabel: string) => {
              setNodes((prev) =>
                prev.map((prevNode) => {
                  if (prevNode.id === targetId) {
                    return { ...prevNode, data: { ...prevNode.data, label: newLabel } };
                  }
                  return prevNode;
                })
              );
            },
            onIconChange: (targetId: string, newIcon: string) => {
              setNodes((prev) =>
                prev.map((prevNode) => {
                  if (prevNode.id === targetId) {
                    return { ...prevNode, data: { ...prevNode.data, icon: newIcon } };
                  }
                  return prevNode;
                })
              );
            },
            onDatesChange: (targetId: string, start: string, end: string) => {
              setNodes((prev) =>
                prev.map((prevNode) => {
                  if (prevNode.id === targetId) {
                    return { ...prevNode, data: { ...prevNode.data, startDate: start, endDate: end } };
                  }
                  return prevNode;
                })
              );
            },
          }
        };

        const updatedPhases = [...currentPhases, newPhaseNode];
        const positionedPhases = updatedPhases.map((p, idx) => ({
          ...p,
          position: {
            ...p.position,
            x: 100 + idx * 380,
            y: 220
          }
        }));

        return [...nonPhases, ...positionedPhases];
      } else {
        // Appending to an existing phase
        return prevNodes.map((node) => {
          if (node.id === selectedPhaseId) {
            let updatedActionCards = [...(node.data.actionCards || [])];

            if (isCreatingNewAction) {
              const actionId = generateId();
              const newActionCard: ActionCardData = {
                id: actionId,
                name: newActionName.trim() || `Action Stream ${updatedActionCards.length + 1}`,
                startDate: dateString,
                endDate: dateString,
                tasks: [newTask]
              };
              updatedActionCards.push(newActionCard);
            } else {
              updatedActionCards = updatedActionCards.map((card: any) => {
                if (card.id === selectedActionId) {
                  const updatedTasks = [...(card.tasks || []), newTask];
                  return {
                    ...card,
                    tasks: updatedTasks,
                  };
                }
                return card;
              });
            }

            return {
              ...node,
              data: {
                ...node.data,
                actionCards: updatedActionCards,
              }
            };
          }
          return node;
        });
      }
    });

    setCreationCtx(null);
  };

  return {
    creationCtx,
    setCreationCtx,
    creationStep,
    setCreationStep,
    selectedPhaseId,
    setSelectedPhaseId,
    newPhaseName,
    setNewPhaseName,
    isCreatingNewPhase,
    setIsCreatingNewPhase,
    selectedActionId,
    setSelectedActionId,
    newActionName,
    setNewActionName,
    isCreatingNewAction,
    setIsCreatingNewAction,
    newTaskName,
    setNewTaskName,
    selectedChannelId,
    setSelectedChannelId,
    handleSaveCreatedTask,
  };
}
