import { Background } from "../../components/Background";
import { EnrichedVersion } from "../../types";
import { useBuilderNodes } from "./hooks/useBuilderNodes";
import { BuilderProvider } from "./context/BuilderContext";
import { StageManager } from "./stage/StageManager";
import { BuilderMutationsProvider } from "./hooks/useBuilderMutations";

interface BuilderPageProps {
  isDark: boolean;
  currentVersion: EnrichedVersion;
  toggleTheme: () => void;
  onClose: () => void;
  onUpdateVersionData?: (updatedVersion: EnrichedVersion) => void;
}

function BuilderPageContent(props: BuilderPageProps) {
  const {
    nodes,
    setNodes,
    handleAddPhase,
    handleDragAddAction,
    handleMoveCardDirectly,
    saveStatus,
  } = useBuilderNodes(props.currentVersion, props.isDark, props.onUpdateVersionData);

  return (
    <BuilderProvider
      nodes={nodes}
      setNodes={setNodes}
    >
      <BuilderMutationsProvider
        setNodes={setNodes}
        onAddDragAction={handleDragAddAction}
        onMoveCardDirectly={handleMoveCardDirectly}
      >
        <div className={`relative w-screen h-screen overflow-hidden ${props.isDark ? "text-white" : "text-black"}`}>
          <Background isDark={props.isDark} />
          <StageManager
            currentVersion={props.currentVersion}
            toggleTheme={props.toggleTheme}
            onClose={props.onClose}
            nodes={nodes}
            setNodes={setNodes}
            handleAddPhase={handleAddPhase}
            handleDragAddAction={handleDragAddAction}
            handleMoveCardDirectly={handleMoveCardDirectly}
            saveStatus={saveStatus}
          />
        </div>
      </BuilderMutationsProvider>
    </BuilderProvider>
  );
}

export default function BuilderPage(props: BuilderPageProps) {
  return <BuilderPageContent {...props} />;
}
