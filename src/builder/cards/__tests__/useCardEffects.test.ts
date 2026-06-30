import { describe, expect, it } from 'vitest';
import { isCardDropCompatible } from '../cardDrag.helpers';
import { useCardEffects } from '../useCardEffects';

const baseOptions = {
  isDragOver: false,
  isJustCreated: false,
  isSelected: false,
  isHighlighted: false,
  isLocked: false,
  readinessState: 'ready' as const,
};

describe('useCardEffects', () => {
  it('activates phase drop glow for a compatible action drag', () => {
    const effects = useCardEffects({
      ...baseOptions,
      kind: 'phase',
      isDragOver: true,
    });

    expect(isCardDropCompatible('action', 'phase')).toBe(true);
    expect(effects.effectName).toBe('dropTargetGlow');
    expect(effects.effectActive).toBe(true);
  });

  it('shows selection scale and corners only for task cards', () => {
    const phase = useCardEffects({ ...baseOptions, kind: 'phase', isSelected: true });
    const task = useCardEffects({ ...baseOptions, kind: 'task', isSelected: true });

    expect(phase.effectActive).toBe(false);
    expect(phase.showCorners).toBe('selected');
    expect(task.effectActive).toBe(true);
    expect(task.showCorners).toBe('selected');
  });

  it('keeps unselected action cards transparent and maps readiness borders', () => {
    const action = useCardEffects({ ...baseOptions, kind: 'action' });
    const blockedTask = useCardEffects({
      ...baseOptions,
      kind: 'task',
      readinessState: 'blocked',
    });

    expect(action.noBackground).toBe(true);
    expect(action.glassBorderClass).toContain('border-[var(--theme-accent)]/20');
    expect(blockedTask.glassBorderClass).toContain('border-[var(--theme-error)]/20');
  });

  it('keeps edited and receiving-child feedback static and distinct', () => {
    const edited = useCardEffects({ ...baseOptions, kind: 'task', isJustEdited: true });
    const receiving = useCardEffects({ ...baseOptions, kind: 'action', isReceivingChild: true });

    expect(edited.effectName).toBe('saveSyncFeedback');
    expect(receiving.surfaceClass).not.toContain('animate-pulse');
    expect(receiving.surfaceClass).not.toBe(edited.surfaceClass);
  });
});
