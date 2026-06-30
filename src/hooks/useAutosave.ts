import { useEffect, useRef, useCallback } from 'react';
import { saveBuilder } from '@/services/builder.service';
import { builderNodesToPhases } from '@/utils/node.helpers';
import { useBuilderStore } from '@/store/builderStore';
import { domainPhasesToApi } from '@/services/api-mappers';

export function useAutosave(versionId: string) {
  const nodes = useBuilderStore((s) => s.nodes);
  const setSaveStatus = useBuilderStore((s) => s.setSaveStatus);
  const timeoutRef = useRef<number | null>(null);

  const doSave = useCallback(async () => {
    try {
      setSaveStatus('saving');
      const phases = builderNodesToPhases(nodes);
      await saveBuilder(versionId, domainPhasesToApi(phases));
      setSaveStatus('saved');
      window.setTimeout(() => setSaveStatus('idle'), 1200);
    } catch (err: unknown) {
      setSaveStatus('error', err instanceof Error ? err.message : String(err));
    }
  }, [nodes, setSaveStatus, versionId]);

  // debounced autosave
  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    // only schedule autosave when nodes are non-empty or changes made
    timeoutRef.current = window.setTimeout(() => {
      void doSave();
    }, 1200);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [nodes, doSave]);

  return {
    saveNow: doSave,
  };
}
