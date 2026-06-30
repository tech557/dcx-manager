import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { BuilderNode } from '@/types/builder-node.types';
import type { StagePosition, ViewKind } from '@/types/stage.types';
import type { StageContextValue } from './stageContext.types';
import { useDragState } from './useDragState';
import { useStageExpansion } from './useStageExpansion';
import { useTaskReschedule } from './useTaskReschedule';
import { useWeekState } from './useWeekState';
import { useBuilderStore } from '@/store/builderStore';

/*
 * StageContext currently holds ~28 values covering: selection, drag, view, timeline, and
 * presentation. Future: Split into SelectionContext, DragContext, ViewContext, TimelineContext,
 * and PresentationContext. Each split reduces the re-render surface for context consumers.
 * This split is post-v1 scope — do not attempt it without first mapping all consumers
 * per context key. Reference: FE-R2-state-flow.md (StageContext context values table).
 */

interface StageProviderProps extends PropsWithChildren {
  nodes: BuilderNode[];
  initialView?: ViewKind;
}

const initialPosition: StagePosition = { x: 0, y: 0, zoom: 1 };
const StageContextObject = createContext<StageContextValue | null>(null);

export function StageProvider({ nodes, initialView = 'kanban', children }: StageProviderProps) {
  const [view, setView] = useState<ViewKind>(initialView);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(() =>
    nodes.filter((n) => n.kind === 'phase').map((n) => n.id),
  );
  const [isolatedNodeIds, setIsolatedNodeIds] = useState<string[] | null>(null);
  const [position, setPosition] = useState<StagePosition>(initialPosition);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [recentlyEditedIds, setRecentlyEditedIds] = useState<string[]>([]);
  const [receivingChildId, setReceivingChildId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<StageContextValue['pendingAction']>(null);
  const [activeSubView, setActiveSubView] =
    useState<StageContextValue['activeSubView']>('weekly');
  const dragState = useDragState();
  const weekState = useWeekState();
  const rescheduleTask = useTaskReschedule(nodes);

  const [isPresentationActive, setIsPresentationActive] = useState(false);
  const [presentationSnapshot, setPresentationSnapshot] = useState<string[]>([]);

  const enterPresentationMode = useCallback((selectedId: string) => {
    setPresentationSnapshot(expandedNodeIds);

    // REQ-PRESENT-001: expand descendants (children + grandchildren), not ancestors.
    // Phase → its actions + their tasks. Action → its tasks. Task → self only.
    const descendants: string[] = [];
    for (const node of nodes) {
      if (node.kind !== 'phase') continue;
      if (node.id === selectedId) {
        // Presenting a phase: expand all its actions and their tasks
        for (const action of node.data.actionCards) {
          descendants.push(action.id);
          for (const task of action.tasks) descendants.push(task.id);
        }
        break;
      }
      for (const action of node.data.actionCards) {
        if (action.id === selectedId) {
          // Presenting an action: expand its tasks
          for (const task of action.tasks) descendants.push(task.id);
          break;
        }
      }
    }

    setExpandedNodeIds(Array.from(new Set([selectedId, ...descendants])));
    setIsPresentationActive(true);

    setTimeout(() => {
      const el = document.getElementById(`card-${selectedId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }, 150);
  }, [expandedNodeIds, nodes]);

  const exitPresentationMode = useCallback(() => {
    setExpandedNodeIds(presentationSnapshot);
    setIsPresentationActive(false);
  }, [presentationSnapshot]);

  const markAsRecentlyEdited = (id: string) => {
    setRecentlyEditedIds((prev) => [...prev, id]);
    setTimeout(() => {
      setRecentlyEditedIds((prev) => prev.filter((prevId) => prevId !== id));
    }, 2000);
  };

  const handleSetReceivingChildId = (id: string | null) => {
    setReceivingChildId(id);
    if (id) {
      setTimeout(() => {
        setReceivingChildId((current) => (current === id ? null : current));
      }, 800);
    }
  };

  const storeRecentlyCreatedIds = useBuilderStore((state) => state.recentlyCreatedIds);
  const clearRecentlyCreatedIds = useBuilderStore((state) => state.clearRecentlyCreatedIds);

  useEffect(() => {
    if (storeRecentlyCreatedIds.length === 0) return;

    const newIds = [...storeRecentlyCreatedIds];
    clearRecentlyCreatedIds();

    // Apply one-frame selection flash for newly created nodes from the external store.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedNodeIds((prev) => {
      const updated = [...prev];
      newIds.forEach((id) => {
        if (!updated.includes(id)) {
          updated.push(id);
        }
      });
      return updated;
    });

    // Set an individual timeout for each new ID
    newIds.forEach((id) => {
      setTimeout(() => {
        setSelectedNodeIds((prev) => prev.filter((prevId) => prevId !== id));
      }, 1500);
    });
  }, [storeRecentlyCreatedIds, clearRecentlyCreatedIds]);

  useStageExpansion({
    nodes,
    focusedNodeId,
    selectedNodeIds,
    setExpandedNodeIds,
  });

  const value = useMemo<StageContextValue>(
    () => ({
      view,
      selectedNodeIds,
      focusedNodeId,
      isolatedNodeIds,
      expandedNodeIds,
      position,
      nodes,
      setView,
      setSelectedNodeIds,
      setFocusedNodeId,
      setExpandedNodeIds,
      setIsolatedNodeIds,
      setPosition,
      isEditorOpen,
      setIsEditorOpen,
      recentlyEditedIds,
      markAsRecentlyEdited,
      receivingChildId,
      setReceivingChildId: handleSetReceivingChildId,
      pendingAction,
      setPendingAction,
      rescheduleTask,
      activeSubView,
      setActiveSubView,
      isPresentationActive,
      enterPresentationMode,
      exitPresentationMode,
      ...weekState,
      ...dragState,
    }),
    [
      activeSubView,
      dragState,
      expandedNodeIds,
      focusedNodeId,
      isEditorOpen,
      isolatedNodeIds,
      nodes,
      pendingAction,
      position,
      recentlyEditedIds,
      receivingChildId,
      rescheduleTask,
      selectedNodeIds,
      enterPresentationMode,
      exitPresentationMode,
      view,
      weekState,
      isPresentationActive,
    ],
  );

  return <StageContextObject.Provider value={value}>{children}</StageContextObject.Provider>;
}

export function useStageContext(): StageContextValue {
  const context = useContext(StageContextObject);
  if (!context) throw new Error('useStageContext must be used inside StageProvider');
  return context;
}

export function useOptionalStageContext(): StageContextValue | null {
  return useContext(StageContextObject);
}
