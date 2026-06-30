import { useStageContext } from '../../stage/StageProvider';

export function useViewHelperScrollers() {
  const { nodes, view, setView } = useStageContext();
  const phases = nodes.filter((n) => n.kind === 'phase');
  const actionCards = nodes.filter((n) => n.kind === 'action');
  const tasks = nodes.filter((n) => n.kind === 'task');

  const handleScrollToPhase = (phaseId: string) => {
    const el = document.getElementById(`phase-node-${phaseId}`) || document.getElementById(phaseId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  return {
    phases,
    actionCards,
    tasks,
    handleScrollToPhase,
    view,
    setView,
  };
}
