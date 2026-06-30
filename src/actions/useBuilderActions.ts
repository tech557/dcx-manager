import { useMemo } from 'react';
import { builderActions } from './builder.actions';

export function useBuilderActions() {
  return useMemo(() => builderActions, []);
}
