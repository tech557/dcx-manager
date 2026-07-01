import { useMemo } from 'react';
import { Save, Sliders } from 'lucide-react';
import { useEditorReadiness } from './useEditorReadiness';
import type { TaskCardData } from '@/types/builder-node.types';

import { TaskEditor } from './TaskEditor/TaskEditor';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { BuilderIslandShell } from '../BuilderIslandShell';
import { EditorHeader } from './EditorHeader';
import { ReadinessCheckModal } from '@/builder/ui/modals/readiness-check-modal/ReadinessCheckModal';
import { useEditorState } from './useEditorState';
import { EditorSessionPill } from './EditorSessionPill';
import { useTaskSectionReadiness } from './useTaskSectionReadiness';
import { DiscardSessionModal } from './DiscardSessionModal';

export function EditorViewerIsland() {
  const {
    nodes,
    setFocusedNodeId,
    closeEditor,
    selectedEditableNodeId,
    isLocked,
    anchorDateStr,
    isDragActive,
    handleDragLeave,
    isReadinessModalOpen,
    setIsReadinessModalOpen,
    activeTab,
    setActiveTab,
    activeNode,
    handleDragOver,
    handleDrop,
    isEditorDirty,
    sessions,
    closeSession,
    switchSession,
    sessionToDiscard,
    confirmDiscardSession,
    cancelDiscardSession,
    draftData,
    updateDraftField,
    handleSave,
    handleDiscard,
    pendingAction,
    handleProceedPending,
    handleCancelPending,
  } = useEditorState();

  const minimizedSessions = useMemo(() => sessions.filter((s) => s.isMinimized), [sessions]);

  const readinessDraft = activeNode?.kind === 'task' ? (draftData as TaskCardData) : null;
  const readinessFeedback = useEditorReadiness(activeNode, readinessDraft);

  const taskDraft = activeNode?.kind === 'task' ? draftData as TaskCardData : null;
  const { infoPassed, specsPassed, subtasksPassed, subtaskCount } = useTaskSectionReadiness(activeNode, taskDraft);

  const sectionTabs = useMemo(() => [
    { id: 'info' as const, label: 'Core', title: 'Details, Routing & Settings', isPassed: infoPassed },
    { id: 'specs' as const, label: 'Specs', title: 'Specifications, Checklist', isPassed: specsPassed },
    { id: 'subtasks' as const, label: `Tasks (${subtaskCount})`, title: 'Subtasks benchmarks', isPassed: subtasksPassed },
  ], [infoPassed, specsPassed, subtasksPassed, subtaskCount]);

  // Editor is task-only in this version: only Task nodes render the expanded editor.
  const isExpanded = activeNode?.kind === 'task' && !!draftData;

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative transition-[transform,box-shadow] duration-300 rounded-[2rem] ${
          isExpanded ? 'h-full w-full' : 'h-[56px] w-[56px]'
        } ${
          isDragActive
            ? 'scale-[1.04] ring-2 ring-[var(--theme-accent)] shadow-[0_0_25px_var(--theme-accent-medium)] bg-sky-500/5'
            : ''
        }`}
      >
        {/* Minimized Sessions Pills Container */}
        {minimizedSessions.length > 0 && isExpanded && (
          <div
            className="absolute bottom-[64px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 px-2 rounded-full bg-black/60 backdrop-blur border border-white/5 shadow-2xl max-w-[200px] overflow-x-auto scrollbar-none z-50"
            id="minimized-sessions-container"
          >
            {minimizedSessions.map((session) => {
              const node = nodes.find((n) => n.id === session.taskId);
              const kind = node?.kind || 'task';
              return (
                <EditorSessionPill
                  key={session.taskId}
                  session={session}
                  kind={kind}
                  onSelect={switchSession}
                  onClose={closeSession}
                />
              );
            })}
          </div>
        )}

        <BuilderIslandShell
          isExpanded={isExpanded}
          shape="panel"
          collapsedWidth={56}
          collapsedHeight={56}
          expandedWidth={384}
          expandedHeight="100%"
          onToggle={undefined}
          collapsedIcon={
            <button
              type="button"
              data-testid="editor-pill"
              onClick={() => {
                if (selectedEditableNodeId) setFocusedNodeId(selectedEditableNodeId);
              }}
              disabled={!selectedEditableNodeId}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${
                isDragActive
                  ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)] text-[var(--theme-accent)] scale-110 shadow-[0_0_15px_var(--theme-accent-medium)]'
                  : selectedEditableNodeId
                    ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/40 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/20 hover:scale-105 cursor-pointer'
                    : 'bg-white/5 text-neutral-400 border-white/10 shadow-none cursor-default'
              }`}
              title={selectedEditableNodeId ? 'Open editor for selected card' : 'Drag task here to edit'}
              aria-label="Open Editor"
            >
              <Sliders className={`w-5 h-5 ${isDragActive ? 'text-[var(--theme-accent)] animate-bounce' : selectedEditableNodeId ? 'text-[var(--theme-accent)]' : 'text-neutral-500'}`} />
            </button>
          }
          id="editor-island"
          className={isExpanded ? 'h-full' : ''}
        >
          {isExpanded && activeNode && draftData && (
            <div className="flex flex-col h-full w-full overflow-hidden text-left" id={`editor-expanded-${activeNode.id}`}>
              <EditorHeader
                activeNode={activeNode}
                displayName={draftData ? ('name' in draftData ? draftData.name : draftData.label) : ''}
                isLocked={isLocked}
                readinessFeedback={readinessFeedback}
                onClose={closeEditor}
                onOpenReadinessModal={() => setIsReadinessModalOpen(true)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sectionTabs={sectionTabs}
                onDisplayNameChange={(newVal) => updateDraftField('name', newVal)}
                draftData={draftData}
                updateDraftField={updateDraftField}
              />

              <section className={`flex-1 overflow-y-auto px-4 py-3 min-h-0 ${isLocked ? 'opacity-85' : ''}`}>
                <fieldset disabled={isLocked} className="space-y-4">
                  {/* Editor is task-only in this version. */}
                  <TaskEditor
                    draftData={draftData as TaskCardData}
                    updateDraftField={updateDraftField}
                    anchorDateStr={anchorDateStr}
                    activeTab={activeTab}
                  />
                </fieldset>
              </section>

              <footer className="border-t border-white/10 p-4 shrink-0 flex items-center gap-2 justify-end">
                <button
                  type="button"
                  disabled={!isEditorDirty}
                  onClick={handleDiscard}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isEditorDirty ? 'text-white/60 hover:text-white/90 hover:bg-white/[0.06] cursor-pointer' : 'text-white/25 cursor-not-allowed'}`}
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={!isEditorDirty}
                  onClick={handleSave}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${isEditorDirty ? 'bg-[var(--theme-accent)] hover:brightness-110 text-black shadow-[0_2px_12px_var(--theme-accent-medium)] cursor-pointer' : 'bg-white/5 text-white/25 cursor-not-allowed'}`}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </footer>
            </div>
          )}
        </BuilderIslandShell>
      </div>

      <UnsavedChangesModal
        pendingAction={pendingAction}
        handleProceedPending={handleProceedPending}
        handleCancelPending={handleCancelPending}
      />

      <ReadinessCheckModal
        isOpen={isReadinessModalOpen}
        onClose={() => setIsReadinessModalOpen(false)}
        task={activeNode?.kind === 'task' ? (draftData as TaskCardData) : null}
      />

      <DiscardSessionModal
        sessionToDiscard={sessionToDiscard}
        confirmDiscardSession={confirmDiscardSession}
        cancelDiscardSession={cancelDiscardSession}
      />
    </>
  );
}
