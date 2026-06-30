import { useState, type DragEvent, type PropsWithChildren } from 'react';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { EffectLayer } from '@/ui/motion/EffectLayer';
import type { BuilderNodeKind } from '@/types/builder-node.types';
import type { Dropzone } from '@/types/dropzone.types';

interface DropPayload {
  id: string;
  kind: BuilderNodeKind;
}

interface DropTargetProps extends PropsWithChildren {
  zone: Dropzone;
  versionId?: string;
  className?: string;
}

function readDropPayload(event: DragEvent<HTMLElement>): DropPayload | null {
  const raw = event.dataTransfer.getData('application/x-dcx-card');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DropPayload;
  } catch {
    return null;
  }
}

export function DropTarget({ zone, versionId = 'v-1', className, children }: DropTargetProps) {
  const actions = useBuilderActions();
  const [invalidFeedback, setInvalidFeedback] = useState(false);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = zone.active ? 'move' : 'none';
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const payload = readDropPayload(event);

    if (!payload || !zone.acceptedTypes.includes(payload.kind)) {
      setInvalidFeedback(true);
      window.setTimeout(() => setInvalidFeedback(false), 260);
      return;
    }

    if (zone.command === 'createPhase') {
      actions.createPhase({ versionId });
    }

    if (zone.command === 'createAction' && zone.targetId) {
      actions.createAction({ phaseId: zone.targetId });
    }

    if (zone.command === 'createTask' && zone.targetId) {
      actions.createTask({
        actionId: zone.targetId,
        actionName: 'New Task',
        channelId: 'empty',
        channelLabel: 'Unassigned',
        compositionId: null,
      });
    }

    if (zone.command === 'movePhase') {
      actions.movePhase({ id: payload.id, toIndex: 0 });
    }

    if (zone.command === 'moveAction' && zone.targetId) {
      actions.moveAction({ actionId: payload.id, fromPhaseId: zone.targetId, toPhaseId: zone.targetId, toIndex: 0 });
    }

    if (zone.command === 'moveTask' && zone.targetId) {
      actions.moveTask({ taskId: payload.id, fromActionId: zone.targetId, toActionId: zone.targetId, toIndex: 0 });
    }
  }

  return (
    <EffectLayer
      effect={invalidFeedback ? 'invalidDrop' : 'dropTargetGlow'}
      active={zone.active || invalidFeedback}
      className={className}
    >
      <div
        className="drop-target"
        data-testid={`drop-target-${zone.id}`}
        data-dropzone-id={zone.id}
        data-drop-command={zone.command}
        data-active={zone.active}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {children}
      </div>
    </EffectLayer>
  );
}
