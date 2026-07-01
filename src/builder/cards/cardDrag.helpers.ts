import type { CardKind } from '@/types/card.types';

export interface CardDragPayload {
  id: string;
  ids: string[];
  kind: CardKind;
  create: boolean;
}

let activeCardDragPayload: CardDragPayload | null = null;

export function setActiveCardDragPayload(payload: CardDragPayload | null): void {
  activeCardDragPayload = payload;
}

export function getActiveCardDragPayload(): CardDragPayload | null {
  return activeCardDragPayload;
}

export function beginCardDrag(
  event: Pick<React.DragEvent, 'stopPropagation' | 'dataTransfer'>,
  payload: CardDragPayload,
  effectAllowed: 'copy' | 'move',
): void {
  event.stopPropagation();
  setActiveCardDragPayload(payload);
  event.dataTransfer.effectAllowed = effectAllowed;
  const serialized = JSON.stringify(payload);
  event.dataTransfer.setData('application/x-dcx-card', serialized);
  event.dataTransfer.setData('text/plain', serialized);
}

export function parseCardDragPayload(raw: string): CardDragPayload | null {
  try {
    const candidate = JSON.parse(raw) as Partial<CardDragPayload>;
    if (!candidate.id || !candidate.kind) return null;
    if (!['phase', 'action', 'task'].includes(candidate.kind)) return null;
    return {
      id: candidate.id,
      ids: Array.isArray(candidate.ids) && candidate.ids.length > 0
        ? candidate.ids
        : [candidate.id],
      kind: candidate.kind,
      create: Boolean(candidate.create),
    };
  } catch {
    return null;
  }
}

export function getCardDragPayload(dataTransfer: Pick<DataTransfer, 'getData'>): CardDragPayload | null {
  const raw = dataTransfer.getData('application/x-dcx-card') || dataTransfer.getData('text/plain');
  return parseCardDragPayload(raw);
}

export function isCardDropCompatible(source: CardKind | null, target: CardKind): boolean {
  if (source === 'phase') {
    // Phase only interacts with dropzones, not other cards
    return false;
  }
  if (source === 'action') {
    // Action only interacts with Phase cards
    return target === 'phase';
  }
  if (source === 'task') {
    // Task only interacts with Action cards and other Task cards
    return target === 'action' || target === 'task';
  }
  return false;
}

export function getAutoExpandIds(
  targetKind: CardKind,
  targetId: string,
  parentId: string | null,
  expandedNodeIds: string[],
): string[] {
  const ids = expandedNodeIds.includes(targetId) ? [] : [targetId];
  if (targetKind === 'action' && parentId && !expandedNodeIds.includes(parentId)) {
    ids.push(parentId);
  }
  return ids;
}

export function isInternalDragTransition(
  container: Pick<Node, 'contains'>,
  relatedTarget: EventTarget | null,
): boolean {
  return relatedTarget !== null && container.contains(relatedTarget as Node);
}

/**
 * A long-press must never arm a drag when the press lands on an interactive control
 * (name inputs, readiness buttons, focus toggles, links) — pressing those is "using the
 * card", not "grabbing" it. Nested child cards exclude themselves by stopping pointer-down
 * propagation so only the innermost card arms; this guard covers the leaf controls.
 */
const DRAG_EXCLUDED_SELECTOR =
  'input, textarea, select, button, a, [role="button"], [contenteditable="true"], [data-no-drag]';

export function isDragExcludedTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(DRAG_EXCLUDED_SELECTOR));
}

export function getPhaseDropDirection(
  event: React.DragEvent<HTMLDivElement>,
  source: CardKind | null,
  target: CardKind,
): 'left' | 'right' | null {
  if (source !== 'phase' || target !== 'phase') return null;
  const rect = event.currentTarget.getBoundingClientRect();
  return (event.clientX - rect.left) / rect.width > 0.5 ? 'right' : 'left';
}
