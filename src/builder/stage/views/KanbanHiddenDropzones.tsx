import { DropTarget } from '@/builder/dropzones/DropTarget';
import type { BuilderNode, PhaseNode } from '@/types/builder-node.types';
import type { Dropzone } from '@/types/dropzone.types';

interface KanbanHiddenDropzonesProps {
  stageZone: Dropzone | null | undefined;
  versionId: string;
  phaseNodes: BuilderNode[];
  phaseZones: Dropzone[];
  actionZones: Dropzone[];
}

export function KanbanHiddenDropzones({
  stageZone,
  versionId,
  phaseNodes,
  phaseZones,
  actionZones,
}: KanbanHiddenDropzonesProps) {
  return (
    <div className="hidden" aria-hidden="true" id="hidden-drag-logic">
      {stageZone ? (
        <DropTarget zone={stageZone} versionId={versionId} className="kanban-stage-drop">
          Drop a phase here
        </DropTarget>
      ) : null}
      {phaseNodes.map((phase) => {
        const phaseZone = phaseZones.find((zone) => zone.targetId === phase.id);
        return (
          <div key={phase.id}>
            {phaseZone ? (
              <DropTarget zone={phaseZone} versionId={versionId} className="kanban-column-drop">
                Drop an action
              </DropTarget>
            ) : null}
            {phase.kind === 'phase' && (phase as PhaseNode).data.actionCards.map((action) => {
              const actionZone = actionZones.find((zone) => zone.targetId === action.id);
              return (
                <div key={action.id}>
                  {actionZone ? (
                    <DropTarget zone={actionZone} versionId={versionId} className="kanban-task-drop">
                      Drop a task
                    </DropTarget>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
