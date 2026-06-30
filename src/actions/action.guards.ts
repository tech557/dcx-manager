import { useBuilderStore } from '@/store/builderStore';

export interface ActionGuardResult {
  allowed: boolean;
  reason: string | null;
}

export class ActionGuardError extends Error {
  constructor(
    message: string,
    public readonly command: string,
  ) {
    super(message);
    this.name = 'ActionGuardError';
  }
}

export function canRunBuilderMutation(command: string): ActionGuardResult {
  const { isLocked } = useBuilderStore.getState();

  if (isLocked) {
    return {
      allowed: false,
      reason: `${command} cannot run while the builder is locked.`,
    };
  }

  return { allowed: true, reason: null };
}

export function assertCanRunBuilderMutation(command: string): void {
  const result = canRunBuilderMutation(command);

  if (!result.allowed) {
    throw new ActionGuardError(result.reason ?? 'Builder mutation blocked.', command);
  }
}
