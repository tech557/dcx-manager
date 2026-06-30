import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { builderActions } from '@/actions/builder.actions';
import { useBuilderNodesQuery } from '@/queries/builder.queries';
import { useBuilderStore } from '@/store/builderStore';
import { StageCore } from './stage/StageCore';
import { StageProvider, useStageContext } from './stage/StageProvider';
import { EditorViewerIsland } from './islands/EditorViewerIsland/EditorViewerIsland';
import { MetadataIsland } from './islands/MetadataIsland/MetadataIsland';
import { FocusIsland } from './islands/FocusIsland/FocusIsland';
import { SelectionIsland } from './islands/SelectionIsland/SelectionIsland';
import { ViewHelperIsland } from './islands/ViewHelperIsland/ViewHelperIsland';
import { KanbanBuilderIsland } from './islands/KanbanBuilderIsland/KanbanBuilderIsland';
import { TimelineBuilderIsland } from './islands/TimelineBuilderIsland/TimelineBuilderIsland';
import { useVersionQuery } from '@/queries/versions.queries';
import { useAutosave } from '@/hooks/useAutosave';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { resolveNodeKind } from '@/utils/node.helpers';
import type { PhaseNode } from '@/types/builder-node.types';
import { BuilderBg } from '@/ui/BuilderBg/BuilderBg';
import { BuilderLoadingShell } from './BuilderLoadingShell';

export function BuilderPage() {
  const { versionId = 'v-1' } = useParams();
  const builderQuery = useBuilderNodesQuery(versionId);
  const nodes = useBuilderStore((state) => state.nodes);
  const setSaveStatus = useBuilderStore((state) => state.setSaveStatus);

  useEffect(() => {
    if (!builderQuery.data) {
      return;
    }

    builderActions.applyImport({ nodes: builderQuery.data });
    setSaveStatus('saved');
  }, [builderQuery.data, setSaveStatus]);

  if (builderQuery.isPending) {
    return <BuilderLoadingShell />;
  }

  if (builderQuery.isError) {
    return (
      <BuilderLoadingShell
        error={builderQuery.error?.message || 'Unknown loading error'}
        onRetry={() => builderQuery.refetch()}
      />
    );
  }

  const initialNodes = nodes.length > 0 ? nodes : builderQuery.data || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full h-full"
    >
      <StageProvider nodes={initialNodes}>
        <BuilderWorkspaceContent versionId={versionId} />
      </StageProvider>
    </motion.div>
  );
}

function BuilderWorkspaceContent({ versionId }: { versionId: string }) {
  const { view, setView, nodes, isEditorOpen, setDraggingState, selectedNodeIds, setSelectedNodeIds } = useStageContext();
  const cardClipboard = useRef<string[]>([]);
  const builderActionsHook = useBuilderActions();
  const isLocked = useBuilderStore((state) => state.isLocked);
  const setLocked = useBuilderStore((state) => state.setLocked);
  const versionQuery = useVersionQuery(versionId);

  const hasFocusedNode = isEditorOpen;
  const phaseNodes = useMemo(() => nodes.filter((node) => node.kind === 'phase') as PhaseNode[], [nodes]);

  useEffect(() => {
    if (versionQuery.data) {
      const status = versionQuery.data.status;
      setLocked(status === 'Ready for Approval' || status === 'Approved' || status === 'Superseded');
    }
  }, [versionQuery.data, setLocked]);

  // Autosave hook
  const { saveNow } = useAutosave(versionId);

  // Prevent accidental close/refreshes before prompt
  useEffect(() => {
    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', preventClose);
    return () => window.removeEventListener('beforeunload', preventClose);
  }, []);

  // Keyboard shortcuts: Ctrl/Cmd+S (save), Ctrl/Cmd+A (select all), Ctrl/Cmd+C (copy),
  // Ctrl/Cmd+V (paste), Delete/Backspace (delete selection), Escape (deselect)
  // REQ-KEY-007: guard — skip when focus is inside a text input or editable element
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    };

    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key;
      const keyLower = key.toLowerCase();

      // Ctrl+S — save (fires even inside text inputs: intentional)
      if (mod && keyLower === 's') {
        e.preventDefault();
        void saveNow();
        return;
      }

      // REQ-KEY-007: all remaining shortcuts are guarded while typing
      if (isTypingTarget(e.target)) return;

      // REQ-KEY-001: Ctrl+A — select all eligible builder cards (phases + actions + tasks)
      if (mod && keyLower === 'a') {
        e.preventDefault();
        const allIds: string[] = [];
        for (const node of nodes) {
          if (node.kind !== 'phase') continue;
          allIds.push(node.id);
          for (const action of node.data.actionCards) {
            allIds.push(action.id);
            for (const task of action.tasks) allIds.push(task.id);
          }
        }
        setSelectedNodeIds(allIds);
        return;
      }

      // REQ-KEY-002: Ctrl+C — copy current builder selection
      if (mod && keyLower === 'c') {
        if (selectedNodeIds.length > 0) {
          e.preventDefault();
          cardClipboard.current = [...selectedNodeIds];
        }
        return;
      }

      // REQ-KEY-003: Ctrl+V — paste (duplicate) copied builder items into smart target
      if (mod && keyLower === 'v') {
        const clipboard = cardClipboard.current;
        if (clipboard.length === 0) return;
        e.preventDefault();
        if (isLocked) return; // governed: mutations blocked on locked versions
        try {
          clipboard.forEach((nodeId) => {
            builderActionsHook.duplicateNode({ nodeId });
          });
        } catch {
          // Mutation guard rejected the paste — leave the clipboard/selection intact.
        }
        return;
      }

      // REQ-KEY-004: Delete / Backspace — remove selected builder items (governed deletion)
      if (key === 'Delete' || key === 'Backspace') {
        if (selectedNodeIds.length === 0) return;
        e.preventDefault();
        if (isLocked) return; // governed: deletion blocked on locked versions
        try {
          [...selectedNodeIds].forEach((id) => {
            const kind = resolveNodeKind(nodes, id);
            if (kind === 'phase') builderActionsHook.deletePhase(id);
            else if (kind === 'action') builderActionsHook.deleteAction(id);
            else if (kind === 'task') builderActionsHook.deleteTask(id);
          });
          setSelectedNodeIds([]);
        } catch {
          // Mutation guard rejected the deletion — keep the selection so the user can retry.
        }
        return;
      }

      // REQ-KEY-005 + REQ-SBC-DES-001: Escape — deselect current selection
      if (key === 'Escape') {
        if (selectedNodeIds.length > 0) {
          e.preventDefault();
          setSelectedNodeIds([]);
        }
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveNow, selectedNodeIds, setSelectedNodeIds, nodes, builderActionsHook, isLocked]);

  return (
    <div className="builder-canvas flex flex-col h-full w-full max-h-screen max-w-screen p-6 gap-6 relative overflow-hidden bg-bg-deep select-none" id="builder-canvas">
      {/* Background Volumetric Light Effects */}
      <BuilderBg selectedNodeIds={selectedNodeIds} />

      {/* ROW 1: Header Row includes three islands (brand, project metadata, user) */}
      <div className="shrink-0 z-50 w-full pointer-events-none" style={{ height: 'var(--dim-builder-header)' }} id="builder-row-header-outer">
        <MetadataIsland
          versionId={versionId}
          currentView={view}
          onViewChange={setView}
          isLocked={isLocked}
          onExport={() => {
            // dynamic import to avoid server-side errors in tests
            import('@/utils/export.helpers').then((m) => m.exportBuilderNodes(nodes)).catch(() => {});
          }}
        />
      </div>

      {/* ROW 2: Second row includes three columns (left column > Viewer / editor island, right column > focus island, and the middle is the builder stage) */}
      <div className="flex-1 min-h-0 w-full flex items-center gap-4 relative" id="builder-stage-area">
        {/* Left column > Viewer / editor island */}
        <aside
          className="shrink-0 z-40 relative flex flex-col items-center justify-start h-full pointer-events-auto transition-all duration-500 overflow-visible px-2"
          style={{ width: hasFocusedNode ? 'var(--dim-editor-width)' : 'var(--dim-phase-collapsed)' }}
          id="builder-editor-panel-left"
        >
          <EditorViewerIsland />
        </aside>

        {/* Center column > Builder Stage - always centered inside width & height */}
        <main className="builder-stage-main flex-1 min-w-0 h-full overflow-hidden transition-all duration-500 ease-out" id="builder-stage-main">
          <StageCore />
        </main>

        {/* Right column > Focus Island */}
        <aside 
          className="shrink-0 z-40 relative flex flex-col items-center justify-start h-full pointer-events-auto transition-all duration-500 overflow-visible px-2"
          style={{ width: 'var(--dim-phase-collapsed)' }}
          id="builder-focus-panel-right"
        >
          <FocusIsland />
        </aside>
      </div>

      {/* ROW 3: Third row includes three islands: Selection Island, Builder Island, ViewContext Island */}
      <div className="shrink-0 z-50 w-full grid grid-cols-3 items-center px-1 relative" style={{ height: 'var(--dim-builder-footer)' }} id="builder-row-footer-outer">
        {/* Left: Selection Island (expands Inline (right)) */}
        <div className="flex justify-start items-center pointer-events-auto transition-all duration-300" id="selection-island-float">
          <SelectionIsland />
        </div>

        {/* Middle: Builder Islands (Kanban / Timeline) (expands Inline (right and left)) */}
        <div className="flex justify-center items-center pointer-events-auto transition-all duration-300" id="builder-island-footer">
          {view === 'kanban' ? (
            <KanbanBuilderIsland
              versionId={versionId}
              phases={phaseNodes}
              onPaletteDragStart={(kind) => setDraggingState(true, kind, null)}
              onPaletteDragEnd={() => setDraggingState(false, null, null)}
            />
          ) : (
            <TimelineBuilderIsland
              versionId={versionId}
            />
          )}
        </div>

        {/* Right: ViewContext Island (ViewHelper) (expands in sticky resizable popup/overlay or row element) */}
        <div className="flex justify-end items-center pointer-events-auto transition-all duration-300" id="view-helper-island-float">
          <ViewHelperIsland />
        </div>
      </div>
    </div>
  );
}
