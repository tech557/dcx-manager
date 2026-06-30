import { useEffect, useMemo, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useBuilderStore } from '@/store/builderStore';
import { useVersionQuery } from '@/queries/versions.queries';
import { getBrowserStorage } from '@/utils/browser-storage.helpers';
import { useToggle } from '@/hooks/useToggle';
import type { TaskNode, ActionNode, TaskCardData, ActionCardData, PhaseNodeData } from '@/types/builder-node.types';
import type { EditorDraftData } from '@/types/editor.types';
import { findEditorNode, getInitialDraft } from './editor-node.helpers';
import { draftReducer } from './useDraftReducer';
import { useEditorDragHandlers } from './useEditorDragHandlers';
import { useEditorSessionManager } from './useEditorSessionManager';

export type { DayNode, EditorNode } from './editor-node.helpers';

interface ActiveTabState {
  nodeId: string | null;
  tab: 'info' | 'channel' | 'specs' | 'subtasks';
}

export function useEditorState() {
  const actions = useBuilderActions();
  const stage = useStageContext();
  const { nodes, focusedNodeId, setFocusedNodeId, setIsEditorOpen, selectedNodeIds } = stage;
  const isLocked = useBuilderStore((state) => state.isLocked);
  const sessions = useBuilderStore((state) => state.sessions);
  const activeTaskId = useBuilderStore((state) => state.activeTaskId);
  const openSessionStore = useBuilderStore((state) => state.openSession);
  const minimizeSessionStore = useBuilderStore((state) => state.minimizeSession);
  const closeSessionStore = useBuilderStore((state) => state.closeSession);
  const switchSessionStore = useBuilderStore((state) => state.switchSession);

  const { versionId = 'v-1' } = useParams();
  const versionQuery = useVersionQuery(versionId);
  const anchorDateStr = versionQuery.data?.communicatedDate ?? '2026-07-01';

  const [isReadinessModalOpen, , openReadinessModal, closeReadinessModal] = useToggle();
  const [activeTabState, setActiveTabState] = useState<ActiveTabState>({ nodeId: null, tab: 'info' });
  const [draftState, dispatchDraft] = useReducer(draftReducer, { draftData: null, isEditorDirty: false });

  const activeNode = useMemo(() => findEditorNode(nodes, focusedNodeId), [focusedNodeId, nodes]);

  // Editor is task-only in this version: only the most-recently-selected Task can open
  // the collapsed editor pill. Phase/action/day selections never open the editor.
  const selectedEditableNodeId = useMemo(() => {
    for (let i = selectedNodeIds.length - 1; i >= 0; i -= 1) {
      const node = findEditorNode(nodes, selectedNodeIds[i]);
      if (node && node.kind === 'task') return node.id;
    }
    return null;
  }, [selectedNodeIds, nodes]);
  const activeTab = activeTabState.nodeId === focusedNodeId ? activeTabState.tab : 'info';
  const { draftData, isEditorDirty } = draftState;
  const setActiveTab = (tab: ActiveTabState['tab']) => setActiveTabState({ nodeId: focusedNodeId, tab });
  const setIsEditorDirty = (dirty: boolean) => dispatchDraft({ type: 'dirty', isEditorDirty: dirty });

  const drag = useEditorDragHandlers(setFocusedNodeId);
  const sessionManager = useEditorSessionManager({ sessions, focusedNodeId, nodes, closeSessionStore, setFocusedNodeId });

  useEffect(() => {
    // Editor is task-only in this version: only Task nodes open/expand the editor panel.
    setIsEditorOpen(activeNode?.kind === 'task');
  }, [activeNode, setIsEditorOpen]);

  useEffect(() => {
    if (focusedNodeId) {
      const phaseNode = nodes.find((node) => node.id === focusedNodeId && node.kind === 'phase');
      const actionCard = !phaseNode ? nodes.flatMap((n) => n.kind === 'phase' ? n.data.actionCards : []).find((a) => a.id === focusedNodeId) : undefined;
      const taskCard = !phaseNode && !actionCard
        ? nodes.flatMap((n) => n.kind === 'phase' ? n.data.actionCards.flatMap((a) => a.tasks) : []).find((t) => t.id === focusedNodeId)
        : undefined;
      const nodeData = phaseNode ? phaseNode.data : (actionCard ?? taskCard);
      if (nodeData) openSessionStore(focusedNodeId, nodeData);
    } else if (activeTaskId) {
      minimizeSessionStore(activeTaskId);
    }
  }, [activeTaskId, focusedNodeId, nodes, openSessionStore, minimizeSessionStore]);

  useEffect(() => {
    if (activeTaskId && activeTaskId !== focusedNodeId) {
      setFocusedNodeId(activeTaskId);
    }
  }, [activeTaskId, focusedNodeId, setFocusedNodeId]);

  useEffect(() => {
    if (!activeNode) {
      dispatchDraft({ type: 'load', draftData: null, isEditorDirty: false });
      return;
    }
    const session = useBuilderStore.getState().sessions.find((item) => item.taskId === activeNode.id);
    if (session) {
      dispatchDraft({ type: 'load', draftData: session.draftData, isEditorDirty: session.hasDraft });
      return;
    }
    dispatchDraft({ type: 'load', draftData: getInitialDraft(activeNode), isEditorDirty: false });
  }, [activeNode]);

  const updateDraftField = (field: string, value: unknown) => {
    if (!draftData || !activeNode) return;
    const updated = { ...draftData, [field]: value } as EditorDraftData;
    dispatchDraft({ type: 'update', draftData: updated });
    useBuilderStore.getState().updateDraft(activeNode.id, updated);
  };

  const updateDraftNestedField = (field: string, subfield: string, value: unknown) => {
    if (!draftData || !activeNode) return;
    const currentField = (draftData as unknown as Record<string, unknown>)[field] as Record<string, unknown> || {};
    const updated = { ...draftData, [field]: { ...currentField, [subfield]: value } } as EditorDraftData;
    dispatchDraft({ type: 'update', draftData: updated });
    useBuilderStore.getState().updateDraft(activeNode.id, updated);
  };

  const handleSave = () => {
    if (!activeNode || !draftData) return;
    if (activeNode.kind === 'task') {
      actions.updateTask({ actionId: (activeNode as TaskNode).data.parentActionId, taskId: activeNode.id, changes: draftData as TaskCardData });
      stage.markAsRecentlyEdited(activeNode.id);
    } else if (activeNode.kind === 'action') {
      actions.updateAction({ phaseId: (activeNode as ActionNode).data.parentPhaseId, actionId: activeNode.id, changes: draftData as ActionCardData });
      stage.markAsRecentlyEdited(activeNode.id);
    } else if (activeNode.kind === 'phase') {
      actions.updatePhase({ id: activeNode.id, changes: draftData as PhaseNodeData });
      stage.markAsRecentlyEdited(activeNode.id);
    } else {
      getBrowserStorage()?.setItem(`dcx-day-notes-${activeNode.id}`, (draftData as { notes?: string }).notes || '');
    }
    dispatchDraft({ type: 'dirty', isEditorDirty: false });
    useBuilderStore.getState().saveSession(activeNode.id);
  };

  const handleDiscard = () => {
    if (!activeNode) return;
    const initialData = getInitialDraft(activeNode);
    dispatchDraft({ type: 'load', draftData: initialData, isEditorDirty: false });
    useBuilderStore.getState().discardSessionDraft(activeNode.id, initialData);
  };

  const { pendingAction, setPendingAction, setView, setSelectedNodeIds } = stage;

  const handleProceedPending = (shouldSave: boolean) => {
    if (!pendingAction) return;
    if (shouldSave) handleSave();
    dispatchDraft({ type: 'dirty', isEditorDirty: false });
    const action = pendingAction;
    setPendingAction(null);
    if (action.type === 'view') setView(action.payload);
    else if (action.type === 'select') setSelectedNodeIds(action.payload);
    else if (action.type === 'focus') setFocusedNodeId(action.payload);
  };

  return {
    nodes,
    focusedNodeId,
    setFocusedNodeId,
    selectedEditableNodeId,
    isLocked,
    anchorDateStr,
    ...drag,
    isReadinessModalOpen,
    setIsReadinessModalOpen: (open: boolean) => (open ? openReadinessModal() : closeReadinessModal()),
    activeTab,
    setActiveTab,
    activeNode,
    isEditorDirty,
    setIsEditorDirty,
    sessions,
    ...sessionManager,
    switchSession: switchSessionStore,
    draftData,
    updateDraftField,
    updateDraftNestedField,
    handleSave,
    handleDiscard,
    pendingAction,
    handleProceedPending,
    handleCancelPending: () => setPendingAction(null),
  };
}
