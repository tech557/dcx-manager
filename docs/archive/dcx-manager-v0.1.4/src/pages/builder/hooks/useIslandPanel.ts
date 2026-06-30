import { useCallback, useState } from "react";

interface UseIslandPanelOptions<TPanel extends string> {
  initialPanel: TPanel;
  activePanel?: TPanel;
  onPanelChange?: (panel: TPanel) => void;
}

export function useIslandPanel<TPanel extends string>({
  initialPanel,
  activePanel: controlledPanel,
  onPanelChange,
}: UseIslandPanelOptions<TPanel>) {
  const [localPanel, setLocalPanel] = useState<TPanel>(initialPanel);
  const activePanel = controlledPanel ?? localPanel;

  const setPanel = useCallback(
    (panel: TPanel) => {
      if (controlledPanel === undefined) {
        setLocalPanel(panel);
      }
      onPanelChange?.(panel);
    },
    [controlledPanel, onPanelChange],
  );

  const closePanel = useCallback(() => {
    setPanel(initialPanel);
  }, [initialPanel, setPanel]);

  const togglePanel = useCallback(
    (panel: TPanel) => {
      setPanel(activePanel === panel ? initialPanel : panel);
    },
    [activePanel, initialPanel, setPanel],
  );

  const isPanelOpen = useCallback(
    (panel: TPanel) => activePanel === panel,
    [activePanel],
  );

  return {
    activePanel,
    setPanel,
    closePanel,
    togglePanel,
    isPanelOpen,
  };
}
