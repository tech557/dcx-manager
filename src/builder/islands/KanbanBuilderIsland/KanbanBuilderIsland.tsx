import { Bot, LayoutTemplate, ListPlus, Plus, Rows3 } from 'lucide-react';
import { useState, type DragEvent } from 'react';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { TaskCreationFlow } from '@/builder/islands/TaskCreationFlow/TaskCreationFlow';
import TemplatePopup from '@/builder/islands/TemplatePopup/TemplatePopup';
import type { BuilderNodeKind, PhaseNode } from '@/types/builder-node.types';
import StickyPopupShell from '@/ui/StickyPopupShell';
import { IslandToggleButton, InlineIslandButton } from '@/builder/ui/buttons';
import { motion, AnimatePresence } from 'motion/react';
import { beginCardDrag, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';
import { useToggle } from '@/hooks/useToggle';
import { useTheme } from '@/hooks/useTheme';

interface KanbanBuilderIslandProps {
  versionId: string;
  phases: PhaseNode[];
  onPaletteDragStart: (kind: BuilderNodeKind) => void;
  onPaletteDragEnd: () => void;
}

const paletteItems: Array<{ kind: BuilderNodeKind; label: string }> = [
  { kind: 'phase', label: 'Phase' },
  { kind: 'action', label: 'Action' },
  { kind: 'task', label: 'Task' },
];

export function KanbanBuilderIsland({ versionId, phases, onPaletteDragStart, onPaletteDragEnd }: KanbanBuilderIslandProps) {
  const [expanded, toggleExpanded] = useToggle();
  const [isTemplateOpen, toggleTemplate] = useToggle();
  const [taskActionId, setTaskActionId] = useState<string | null>(null);
  const actions = useBuilderActions();
  const { isDark } = useTheme();
  const firstPhase = phases[0] ?? null;
  const firstAction = firstPhase?.data.actionCards[0] ?? null;
  const taskAction = phases.flatMap((phase) => phase.data.actionCards).find((action) => action.id === taskActionId) ?? null;

  function handleCreate(kind: BuilderNodeKind) {
    if (kind === 'phase') {
      actions.createPhase({ versionId, label: 'New phase' });
    }

    if (kind === 'action' && firstPhase) {
      actions.createAction({ phaseId: firstPhase.id, name: 'New action' });
    }

    if (kind === 'task' && firstAction) {
      setTaskActionId(firstAction.id);
    }
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, kind: BuilderNodeKind) {
    const payload = { id: `new:${kind}`, ids: [`new:${kind}`], kind, create: true };
    beginCardDrag(event, payload, 'copy');
    onPaletteDragStart(kind);
    if (kind === 'task') {
      event.dataTransfer.setData('application/x-dcx-task', `new:${kind}`);
    }
  }

  return (
    <>
      <motion.aside
        layout
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`island-shell kanban-builder-island h-14 p-1.5 flex items-center relative z-[45] ${
          expanded ? 'overflow-visible' : 'overflow-hidden'
        }`}
        aria-label="Kanban builder"
        id="kanban-builder-island"
      >
        <div className="flex items-center pl-0.5 shrink-0 relative z-30">
          <IslandToggleButton
            id="btn-kanban-builder-toggle"
            isActive={expanded}
            onClick={toggleExpanded}
            icon={Plus}
            title={expanded ? "Close Creator Palette" : "Open Creator Palette"}
          />
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <>
              {/* Vertical divider after circular toggle */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`h-6 w-[1px] shrink-0 mx-2.5 relative z-20 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
              />

              {/* Metadata block from the premium v0.1.4 specs */}
              <motion.div
                initial={{ opacity: 0, x: -12, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -12, width: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="flex flex-col select-none pointer-events-none pl-0.5 text-left shrink-0 overflow-hidden whitespace-nowrap"
              >
                <span className="text-dcx-3xs font-black tracking-[0.25em] uppercase text-[var(--theme-accent)]/40 font-mono leading-none">
                  creator
                </span>
                <span className={`text-dcx-md font-bold leading-none mt-1 tracking-tight font-sans ${isDark ? 'text-white/95' : 'text-[var(--theme-text-primary)]'}`}>
                  Controls
                </span>
              </motion.div>

              {/* Second vertical divider */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`h-6 w-[1px] shrink-0 mx-3 relative z-20 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
              />

              {/* Horizontal list of premium capsule builder tools with internal scroll bar hidden */}
              <motion.div
                initial={{ opacity: 0, x: -15, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -15, width: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="flex items-center gap-2 px-1 py-2 overflow-x-auto overflow-y-visible max-w-[275px] xs:max-w-[320px] sm:max-w-[380px] md:max-w-[480px] scrollbar-none relative z-20"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {paletteItems.map((item) => {
                  const IconComponent = item.kind === 'phase' ? Rows3 : ListPlus;
                  return (
                    <InlineIslandButton
                      key={item.kind}
                      label={item.label}
                      icon={IconComponent}
                      draggable={true}
                      onClick={() => handleCreate(item.kind)}
                      onDragStart={(event) => handleDragStart(event, item.kind)}
                      onDragEnd={() => {
                        setActiveCardDragPayload(null);
                        onPaletteDragEnd();
                      }}
                      title={`Drag or click to create ${item.label}`}
                    />
                  );
                })}
              </motion.div>

                {/* Template button — REQ-TPL-001 */}
                <InlineIslandButton
                  label="Template"
                  icon={LayoutTemplate}
                  onClick={toggleTemplate}
                  title="Browse and apply project templates"
                />

              {/* Third vertical divider separating the standby AI Section */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`h-6 w-[1px] shrink-0 mx-2.5 relative z-20 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
              />

              {/* AI Agent Standalone Section */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="flex items-center select-none pr-1 relative z-20"
              >
                <InlineIslandButton
                  label="AI AGENT"
                  icon={Bot}
                  isAi={true}
                  isDisabled={true}
                  title="AI Assistance coming soon"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.aside>

      <StickyPopupShell isOpen={!!taskAction} onClose={() => setTaskActionId(null)} title="Create task">
        {taskAction ? (
          <TaskCreationFlow actionId={taskAction.id} actionName={taskAction.name} onCancel={() => setTaskActionId(null)} onCreated={() => setTaskActionId(null)} />
        ) : null}
      </StickyPopupShell>

      {/* REQ-TPL-001: Template gallery popup */}
      <TemplatePopup isOpen={isTemplateOpen} onClose={toggleTemplate} />
    </>
  );
}
