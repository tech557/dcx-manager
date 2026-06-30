import React from "react";
import { EnrichedVersion } from "../../../types";
import { BuilderKanbanView } from "../kanban/BuilderKanbanView";

interface KanbanStageProps {
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddPhase: (insertIndex?: number) => void;
  handleDragAddAction: (targetPhaseId: string) => void;
  handleMoveCardDirectly: (sourcePhaseId: string, targetPhaseId: string, cardId: string, insertIndex?: number) => void;
  currentVersion: EnrichedVersion;
}

export function KanbanStage({
nodes,
  setNodes,
  handleAddPhase,
  handleDragAddAction,
  handleMoveCardDirectly,
  currentVersion,
}: KanbanStageProps) {
  return (
    <BuilderKanbanView
      nodes={nodes}
      setNodes={setNodes}
      handleAddPhase={handleAddPhase}
      onAddDragAction={handleDragAddAction}
      onMoveCardDirectly={handleMoveCardDirectly}
      currentVersion={currentVersion}
    />
  );
}
