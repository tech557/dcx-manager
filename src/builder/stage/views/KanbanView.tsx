import { useMemo, Fragment, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Rows3, Plus } from 'lucide-react';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { useDropzones } from '@/builder/dropzones/useDropzones';
import { PhaseCard } from '@/builder/cards/templates/phase/PhaseCard';
import { PhaseDropZone } from './PhaseDropZone';
import { KanbanHiddenDropzones } from './KanbanHiddenDropzones';
import type { StageViewRendererProps } from '../stage.registry';
import { useStageContext } from '../StageProvider';
import { useKanbanInteraction } from './useKanbanInteraction';

export function KanbanView({ className }: StageViewRendererProps) {
  const {
    nodes,
    selectedNodeIds,
    setSelectedNodeIds,
    expandedNodeIds,
    isDragging,
    draggedNodeKind,
    draggedNodeId,
  } = useStageContext();

  // Derive activeDrag from stage context so dropzones light up during a drag session.
  // draggedNodeKind is CardKind (phase|action|task|day); narrow to BuilderNodeKind for useDropzones.
  const activeDrag = isDragging && draggedNodeKind && draggedNodeKind !== 'day'
    ? { id: draggedNodeId ?? '', kind: draggedNodeKind }
    : null;

  const phaseNodes = useMemo(() => nodes.filter((node) => node.kind === 'phase'), [nodes]);
  const zones = useDropzones('kanban', nodes, activeDrag);
  const stageZone = zones.find((zone) => zone.target === 'stage');
  const phaseZones = zones.filter((zone) => zone.target === 'phase');
  const actionZones = zones.filter((zone) => zone.target === 'action');
  const { versionId = 'v-1' } = useParams();
  const actions = useBuilderActions();

  const {
    isDragOver,
    hoveredPhaseId,
    hoverDirection,
    boardHandlers,
    getPhaseColumnHandlers,
    getPhaseTranslationStyle,
  } = useKanbanInteraction(versionId);

  const prevPhasesLengthRef = useRef(phaseNodes.length);

  useEffect(() => {
    if (phaseNodes.length > prevPhasesLengthRef.current) {
      const scroller = document.getElementById('kanban-scroller');
      if (scroller) {
        setTimeout(() => {
          scroller.scrollTo({
            left: scroller.scrollWidth,
            behavior: 'smooth',
          });
        }, 100);
      }
    }
    prevPhasesLengthRef.current = phaseNodes.length;
  }, [phaseNodes.length]);

  function handleSelect(id: string, isMulti: boolean) {
    if (isMulti) {
      if (selectedNodeIds.includes(id)) {
        setSelectedNodeIds(selectedNodeIds.filter((x) => x !== id));
      } else {
        setSelectedNodeIds([...selectedNodeIds, id]);
      }
    } else {
      setSelectedNodeIds([id]);
    }
  }

  return (
    <div className={`${className} relative overflow-hidden`} id="kanban-view-container">
      <div 
        className="absolute inset-0 overflow-y-hidden overflow-x-auto [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scroll-smooth" 
        id="kanban-scroller"
        data-kanban-view="true"
      >
        <KanbanHiddenDropzones
          stageZone={stageZone}
          versionId={versionId}
          phaseNodes={phaseNodes}
          phaseZones={phaseZones}
          actionZones={actionZones}
        />

        {/* mx-auto on the board centers it when space allows; when board overflows the
            container min-w-full keeps inner at container width so scroll kicks in */}
        <div
          className={[
            'w-max min-w-full h-full flex items-center py-5 px-6 bg-transparent transition-all duration-300',
            isDragOver ? 'bg-sky-500/5 ring-4 ring-[var(--theme-accent)]/20 rounded-2xl' : '',
          ].join(' ')}
          id="kanban-centering-wrapper"
          {...boardHandlers}
        >
          {phaseNodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 max-w-md w-full border border-dashed border-white/10 dark:border-white/10 rounded-[1.5rem] bg-white/[0.02] dark:bg-[var(--theme-glass-bg)] backdrop-blur-md text-center py-12 shadow-lg animate-in fade-in zoom-in-95 duration-300 select-none" id="kanban-empty-state">
              <div className="w-12 h-12 rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center text-[var(--theme-accent)] mb-4 shadow-[0_0_15px_var(--theme-selected-glow)]">
                <Rows3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--theme-text-primary)] uppercase tracking-wider mb-2">
                No Campaign Phases
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
                Phases are the top-level pillars of your campaign roadmap. Create your first planning phase to start mapping actions and tasks.
              </p>
              <button
                onClick={() => actions.createPhase({ versionId, label: 'Phase 1' })}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[var(--theme-accent)]/20 hover:bg-[var(--theme-accent)]/30 text-[var(--theme-accent)] border border-[var(--theme-accent)]/30 rounded-full transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-[0_0_12px_var(--theme-accent-bg)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Phase</span>
              </button>
            </div>
          ) : (
            <div className="kanban-board flex gap-6 shrink-0 h-full max-h-full min-h-0 mx-auto" data-phase-count={phaseNodes.length} id="kanban-board-container">
              <PhaseDropZone index={0} hoveredPhaseId={hoveredPhaseId} hoverDirection={hoverDirection} />
              {phaseNodes.map((phase, idx) => {
                const isPhaseSelected = selectedNodeIds.includes(phase.id);
                const isPhaseExpanded = expandedNodeIds.includes(phase.id);
                const translationStyle = getPhaseTranslationStyle(phase.id);
                return (
                  <Fragment key={phase.id}>
                    <section
                      className={[
                        'kanban-phase-column shrink-0 text-left h-full max-h-full min-h-0 flex flex-col transition-all duration-300 ease-out',
                        isPhaseExpanded
                          ? 'min-w-[240px] max-w-[300px]'
                          : '',
                      ].join(' ')}
                      style={{
                        ...translationStyle,
                        width: isPhaseExpanded ? 'var(--dim-phase-expanded)' : 'var(--dim-phase-collapsed)',
                        ...(isPhaseExpanded ? {} : { minWidth: 'var(--dim-phase-collapsed)', maxWidth: 'var(--dim-phase-collapsed)' }),
                      }}
                      data-testid={`kanban-phase-column-${phase.id}`}
                      data-phase-id={phase.id}
                      {...getPhaseColumnHandlers(phase.id)}
                    >
                      <PhaseCard phase={phase.data} selected={isPhaseSelected} onSelect={handleSelect} />
                    </section>
                    <PhaseDropZone index={idx + 1} hoveredPhaseId={hoveredPhaseId} hoverDirection={hoverDirection} />
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
