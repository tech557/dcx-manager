import { useStageContext } from '../StageProvider';
import { ActionCard } from '@/builder/cards/templates/action/ActionCard';
import { PhaseCard } from '@/builder/cards/templates/phase/PhaseCard';
import { TaskCard } from '@/builder/cards/templates/task/TaskCard';

interface SmokeStageProps {
  mode: 'kanban' | 'timeline' | 'weekly' | 'monthly';
  className?: string;
}

export function SmokeStage({ mode, className }: SmokeStageProps) {
  // Temporary Sprint 4 smoke renderer. Replace with real view renderers in later sprints.
  const { nodes, selectedNodeIds, focusedNodeId, expandedNodeIds, position } = useStageContext();
  const phaseNodes = nodes.filter((node) => node.kind === 'phase');

  return (
    <div className={className} data-smoke-stage={mode}>
      <div className="stage-smoke-meta">
        <span>{mode}</span>
        <span>{phaseNodes.length} phases</span>
        <span>{selectedNodeIds.length} selected</span>
        <span>{focusedNodeId ?? 'no focus'}</span>
        <span>{expandedNodeIds.length} expanded</span>
        <span>
          {position.x}:{position.y}:{position.zoom}
        </span>
      </div>
      <div className="stage-phase-row">
        {phaseNodes.map((node) => (
          <div key={node.id} className="stage-phase-column">
            <PhaseCard phase={node.data} />
            {node.data.actionCards.map((action) => (
              <div key={action.id} className="stage-action-stack">
                <ActionCard action={action} />
                {action.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
