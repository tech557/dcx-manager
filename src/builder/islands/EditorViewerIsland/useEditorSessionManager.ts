import { useState } from 'react';
import { useBuilderStore, type EditorSession } from '@/store/builderStore';
import { findAction, findTask } from '@/utils/node.helpers';
import type { BuilderNode } from '@/types/builder-node.types';

interface SessionManagerParams {
  sessions: EditorSession[];
  focusedNodeId: string | null;
  nodes: BuilderNode[];
  closeSessionStore: (taskId: string) => void;
  setFocusedNodeId: (id: string | null) => void;
}

export function useEditorSessionManager({
  sessions,
  focusedNodeId,
  nodes,
  closeSessionStore,
  setFocusedNodeId,
}: SessionManagerParams) {
  const [sessionToDiscard, setSessionToDiscard] = useState<string | null>(null);

  const handleCloseSession = (taskId: string) => {
    const session = sessions.find((item) => item.taskId === taskId);
    if (session?.hasDraft) {
      setSessionToDiscard(taskId);
      return;
    }

    closeSessionStore(taskId);
    if (focusedNodeId === taskId) {
      setFocusedNodeId(null);
    }
  };

  const confirmDiscardSession = () => {
    if (!sessionToDiscard) return;

    const session = sessions.find((item) => item.taskId === sessionToDiscard);
    if (session) {
      const phaseNode = nodes.find((node) => node.id === sessionToDiscard && node.kind === 'phase');
      const actionCard = !phaseNode ? findAction(nodes, sessionToDiscard) : undefined;
      const taskCard = !phaseNode && !actionCard ? findTask(nodes, sessionToDiscard) : undefined;
      const nodeData = phaseNode ? phaseNode.data : (actionCard ?? taskCard);
      if (nodeData) {
        useBuilderStore.getState().discardSessionDraft(sessionToDiscard, nodeData);
      }
    }

    closeSessionStore(sessionToDiscard);
    if (focusedNodeId === sessionToDiscard) {
      setFocusedNodeId(null);
    }
    setSessionToDiscard(null);
  };

  return {
    sessionToDiscard,
    closeSession: handleCloseSession,
    confirmDiscardSession,
    cancelDiscardSession: () => setSessionToDiscard(null),
  };
}
