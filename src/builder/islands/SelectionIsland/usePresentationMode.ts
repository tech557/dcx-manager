import { useStageContext } from '../../stage/StageProvider';

export function usePresentationMode() {
  const { isPresentationActive, enterPresentationMode, exitPresentationMode, selectedNodeIds } = useStageContext();

  const handleTogglePresentation = () => {
    if (isPresentationActive) {
      exitPresentationMode();
    } else if (selectedNodeIds.length === 1) {
      enterPresentationMode(selectedNodeIds[0]);
    }
  };

  return {
    isPresentationActive,
    enterPresentationMode,
    exitPresentationMode,
    handleTogglePresentation,
    canPresent: selectedNodeIds.length === 1,
  };
}
