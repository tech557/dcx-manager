import { describe, expect, it, vi } from 'vitest';
import {
  beginCardDrag,
  getActiveCardDragPayload,
  getAutoExpandIds,
  getCardDragPayload,
  getPhaseDropDirection,
  isCardDropCompatible,
  isInternalDragTransition,
  parseCardDragPayload,
  setActiveCardDragPayload,
} from '../cardDrag.helpers';
import { adjustDropIndex } from '../dragDropHelpers';

describe('card drag helpers', () => {
  it('accepts only documented card nesting combinations', () => {
    expect(isCardDropCompatible('phase', 'phase')).toBe(false);
    expect(isCardDropCompatible('phase', 'action')).toBe(false);
    expect(isCardDropCompatible('action', 'phase')).toBe(true);
    expect(isCardDropCompatible('action', 'task')).toBe(false);
    expect(isCardDropCompatible('task', 'phase')).toBe(false);
    expect(isCardDropCompatible('task', 'action')).toBe(true);
    expect(isCardDropCompatible('task', 'task')).toBe(true);
  });

  it('ignores drag transitions that remain inside the current card', () => {
    const child = {} as Node;
    const container = { contains: (target: Node | null) => target === child };
    expect(isInternalDragTransition(container, child)).toBe(true);
    expect(isInternalDragTransition(container, null)).toBe(false);
  });

  it('resolves phase placement from the drop half', () => {
    const currentTarget = { getBoundingClientRect: () => ({ left: 100, width: 200 }) };
    const leftEvent = { currentTarget, clientX: 150 } as unknown as React.DragEvent<HTMLDivElement>;
    const rightEvent = { currentTarget, clientX: 250 } as unknown as React.DragEvent<HTMLDivElement>;
    expect(getPhaseDropDirection(leftEvent, 'phase', 'phase')).toBe('left');
    expect(getPhaseDropDirection(rightEvent, 'phase', 'phase')).toBe('right');
    expect(getPhaseDropDirection(rightEvent, 'task', 'phase')).toBeNull();
  });

  it('keeps a synchronous drag session for hover events', () => {
    const payload = parseCardDragPayload(JSON.stringify({
      id: 'action-1',
      ids: ['action-1'],
      kind: 'action',
    }));
    expect(payload).not.toBeNull();
    setActiveCardDragPayload(payload);
    expect(getActiveCardDragPayload()).toEqual({
      id: 'action-1',
      ids: ['action-1'],
      kind: 'action',
      create: false,
    });
    setActiveCardDragPayload(null);
  });

  it('reads the plain-text fallback used by stricter browsers', () => {
    const payload = getCardDragPayload({
      getData: (type) => type === 'text/plain'
        ? JSON.stringify({ id: 'phase-1', kind: 'phase' })
        : '',
    });
    expect(payload?.kind).toBe('phase');
  });

  it('claims nested drag starts and writes both payload formats', () => {
    const written = new Map<string, string>();
    const event = {
      stopPropagation: vi.fn(),
      dataTransfer: {
        effectAllowed: 'none',
        setData: (type: string, value: string) => written.set(type, value),
      },
    } as unknown as React.DragEvent;
    beginCardDrag(event, {
      id: 'task-1',
      ids: ['task-1'],
      kind: 'task',
      create: false,
    }, 'move');
    expect(event.stopPropagation).toHaveBeenCalledOnce();
    expect(event.dataTransfer.effectAllowed).toBe('move');
    expect(written.get('application/x-dcx-card')).toBe(written.get('text/plain'));
    expect(getActiveCardDragPayload()?.kind).toBe('task');
    setActiveCardDragPayload(null);
  });

  it('expands only the hovered target and its missing action parent', () => {
    expect(getAutoExpandIds('phase', 'phase-2', null, ['phase-1'])).toEqual(['phase-2']);
    expect(getAutoExpandIds('action', 'action-2', 'phase-2', [])).toEqual(['action-2', 'phase-2']);
    expect(getAutoExpandIds('action', 'action-2', 'phase-2', ['action-2', 'phase-2'])).toEqual([]);
  });

  it('adjusts same-container slots after dragged items are removed', () => {
    expect(adjustDropIndex(2, ['action-1'], ['action-1', 'action-2', 'action-3'])).toBe(1);
    expect(adjustDropIndex(0, ['action-3'], ['action-1', 'action-2', 'action-3'])).toBe(0);
    expect(adjustDropIndex(3, ['task-1', 'task-2'], ['task-1', 'task-2', 'task-3'])).toBe(1);
  });
});
